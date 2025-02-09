import frappe
from fuzzywuzzy import fuzz
from sa3ed_app.utils.date_helper import calculate_age
from geopy.distance import geodesic
import face_recognition
import numpy as np
import requests
from io import BytesIO
from PIL import Image
from frappe.utils import get_url
from sa3ed_app.api.api_endpoint import ApiEndPoint


class AIPersonMatcher:
    def __init__(self):
        self.name_weight = 0.1
        self.age_weight = 0.2
        self.gender_weight = 0.15
        self.location_weight = 0.05
        self.face_weight = 0.5
        self.similarity_threshold = 0.6

    def get_face_encoding(self, image_url):
        """Get face encoding from image URL"""
        try:
            # Handle both relative and absolute URLs
            if not image_url.startswith(('http://', 'https://')):
                image_url = get_url(image_url)
            
            try:
                # First try to get image directly from Frappe's public files
                file_path = frappe.get_site_path('public', image_url.split('/files/')[-1])
                img = Image.open(file_path)
            except:
                # Fallback to HTTP request if file not found locally
                response = requests.get(image_url, timeout=10)
                response.raise_for_status()
                img = Image.open(BytesIO(response.content))

            img_array = np.array(img)
            
            face_locations = face_recognition.face_locations(img_array)
            if not face_locations:
                return None
            
            face_encodings = face_recognition.face_encodings(img_array, face_locations)
            return face_encodings[0] if face_encodings else None
        except Exception as e:
            frappe.log_error(f"Error processing image {image_url}: {str(e)}")
            return None

    def calculate_face_similarity(self, lost_person, found_person):
        """Calculate similarity between face images"""
        try:
            if not (lost_person.pic and found_person.pic):
                return 0

            lost_encoding = self.get_face_encoding(lost_person.pic)
            found_encoding = self.get_face_encoding(found_person.pic)

            if lost_encoding is None or found_encoding is None:
                return 0

            face_distance = face_recognition.face_distance([lost_encoding], found_encoding)[0]
            face_similarity = max(0, 1 - (face_distance / 0.6))
            
            return face_similarity
        except Exception as e:
            frappe.log_error(f"Face comparison error: {str(e)}")
            return 0

    def calculate_name_similarity(self, lost_person, found_person):
        """Calculate similarity between full names using fuzzy matching"""
        lost_full_name = f"{lost_person.first_name} {lost_person.middle_name} {lost_person.last_name}"
        found_full_name = f"{found_person.first_name} {found_person.middle_name} {found_person.last_name}"
        
        return fuzz.token_sort_ratio(lost_full_name.lower(), found_full_name.lower()) / 100

    def calculate_age_similarity(self, lost_person, found_person):
        """Calculate similarity based on age/birthdate"""
        lost_age = calculate_age(lost_person.birthdate)
        found_age = found_person.age

        if lost_age == found_age:
            return 1.0

        age_diff = abs(lost_age - found_age)
        return max(0, 1 - (age_diff / 3))

    def calculate_gender_similarity(self, lost_person, found_person):
        """Calculate similarity based on gender"""
        return 1.0 if lost_person.gender.lower() == found_person.gender.lower() else 0.0

    def calculate_location_similarity(self, lost_person, found_person):
        """Calculate similarity based on location proximity"""
        try:
            if not (lost_person.lost_address and found_person.seen_address):
                return 0.5 
                
            lost_coords = self._get_coordinates(lost_person.lost_address)
            found_coords = self._get_coordinates(found_person.seen_address)
            
            if not (lost_coords and found_coords):
                return 0.5
                
            distance = geodesic(lost_coords, found_coords).kilometers
            return max(0, 1 - (distance / 50))
        except:
            return 0.5

    def _get_coordinates(self, address_id):
        """Get coordinates from Sa3ed Address doctype"""
        address = frappe.get_doc("Sa3ed Address", address_id)
        if address.latitude and address.longitude:
            return (float(address.latitude), float(address.longitude))
        return None

    def calculate_overall_similarity(self, lost_person, found_person):
        """Calculate weighted similarity score between lost and found person"""
        name_sim = self.calculate_name_similarity(lost_person, found_person)
        age_sim = self.calculate_age_similarity(lost_person, found_person)
        gender_sim = self.calculate_gender_similarity(lost_person, found_person)
        location_sim = self.calculate_location_similarity(lost_person, found_person)
        face_sim = self.calculate_face_similarity(lost_person, found_person)

        overall_similarity = (
            name_sim * self.name_weight +
            age_sim * self.age_weight +
            gender_sim * self.gender_weight +
            location_sim * self.location_weight +
            face_sim * self.face_weight
        )
        
        return [overall_similarity, face_sim, gender_sim, age_sim]

    def create_people_match_record(self, lost_person_id, found_person_id, similarity_score, face_sim, gender_sim, age_sim):
        """Create a record in People Match doctype"""
        try:
            existing_match = frappe.get_all(
                "People Match",
                filters={
                    "lost_person": lost_person_id,
                    "found_person": found_person_id
                }
            )
            
            if existing_match:
                match_doc = frappe.get_doc("People Match", existing_match[0].name)
                match_doc.similarity_score = similarity_score
                match_doc.face_similarity = face_sim
                match_doc.gender_similarity = gender_sim
                match_doc.age_similarity = age_sim
                match_doc.save()
                return match_doc.name
            else:
                match_doc = frappe.get_doc({
                    "doctype": "People Match",
                    "lost_person": lost_person_id,
                    "found_person": found_person_id,
                    "similarity_score": similarity_score,
                    "face_similarity": face_sim,
                    "gender_similarity": gender_sim,
                    "age_similarity": age_sim,
                    "match_status": "Pending",
                    "match_date": frappe.utils.now_datetime()
                })
                match_doc.insert()
                return match_doc.name
                
        except Exception as e:
            frappe.logger().error(f"Error creating people match record: {str(e)}")
            return None

    def find_matches(self, found_person_id, limit=5):
        """Find potential matches for a found person"""
        found_person = frappe.get_doc("Found Person", found_person_id)
        
        lost_persons = frappe.get_all(
            "Lost Person",
            filters={"case_status": "Open"},
            fields=["name", "first_name", "middle_name", "last_name", 
                   "birthdate", "gender", "lost_address", "lost_date", "pic"]
        )
        
        matches = []
        for lost_doc in lost_persons:
            lost_person = frappe.get_doc("Lost Person", lost_doc.name)
            similarity = self.calculate_overall_similarity(lost_person, found_person)
            
            if similarity[0] >= self.similarity_threshold:
                match_id = self.create_people_match_record(
                    lost_person.name,
                    found_person_id,
                    similarity[0],
                    similarity[1],
                    similarity[2],
                    similarity[3]
                )
                
                matches.append({
                    "lost_person_id": lost_person.name,
                    "similarity_score": similarity[0],
                    "lost_person_name": f"{lost_person.first_name} {lost_person.middle_name} {lost_person.last_name}",
                    "lost_date": lost_person.lost_date,
                    "picture_url": lost_person.pic,
                    "match_id": match_id
                })
        
        matches.sort(key=lambda x: x["similarity_score"], reverse=True)
        return matches[:limit]

@frappe.whitelist()
def get_potential_matches(found_person_id):
    """API endpoint to get potential matches for a found person"""
    try:
        matcher = AIPersonMatcher()
        matches = matcher.find_matches(found_person_id)

        return ApiEndPoint.create_response(200, "Potential matches found successfully", matches)

    except Exception as ex:
        frappe.logger().error(f"Error finding matches: {str(ex)}")
        return ApiEndPoint.create_response(400, f"Error finding matches: {str(ex)}", None)

@frappe.whitelist()
def update_match_status(match_id, status):
    """Update the status of a people match record"""
    try:
        valid_statuses = ["Pending", "Confirmed", "Rejected"]
        if status not in valid_statuses:
            return ApiEndPoint.create_response(400, f"Invalid status. Must be one of: {', '.join(valid_statuses)}", None)
            
        match_doc = frappe.get_doc("People Match", match_id)
        match_doc.match_status = status
        match_doc.save()
        
        if status == "Confirmed":
            lost_person = frappe.get_doc("Lost Person", match_doc.lost_person)
            found_person = frappe.get_doc("Found Person", match_doc.found_person)
            
            lost_person.case_status = "Closed"
            found_person.case_status = "Matched"
            
            lost_person.save()
            found_person.save()
        
        return ApiEndPoint.create_response(200, f"Match status updated to {status}", {"match_id": match_id})
    except Exception as ex:
        return ApiEndPoint.create_response(400, f"Error updating match status: {str(ex)}", None)

