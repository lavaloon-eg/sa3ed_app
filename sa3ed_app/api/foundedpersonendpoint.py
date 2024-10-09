import frappe
from frappe import _

@frappe.whitelist(allow_guest=True)
def create_founded_person(first_name, middle_name=None, last_name=None, gender=None, age=None, phone_1=None, seen_date=None, case_status=None, seen_address=None, country=None, city=None, address_type=None, postal_code=None, latitude=None, longitude=None, nationality=None, pic=None):
    try:
        
        if not first_name or not last_name or not gender or not age or not phone_1 or not seen_date or not case_status or not seen_address or not nationality:
            return {"status": "error", "message": _("Missing required fields")}

        
        if not address_type or not country or not city or not seen_address:
            return {"status": "error", "message": _("Missing required fields for Sa3ed Address")}

        
        valid_address_types = ["Home", "Seen Place", "Lost Place", "Hospitality Address"]
        if address_type not in valid_address_types:
            return {"status": "error", "message": _("Invalid Address Type. Valid options are: Home, Seen Place, Lost Place, Hospitality Address.")}

        
        sa3ed_address = frappe.get_doc({
            "doctype": "Sa3ed Address",
            "title": "{} {}".format(first_name, last_name),
            "address_type": address_type,
            "country": country,
            "city": city,
            "address_line_1": seen_address,  
            "address_line_2": "",              
            "postal_code": postal_code,
            "longitude": longitude,
            "latitude": latitude
        })
        sa3ed_address.insert(ignore_permissions=True)

        # Create Found Person document
        found_person = frappe.get_doc({
            "doctype": "Found Person",
            "first_name": first_name,          
            "middle_name": middle_name,
            "last_name": last_name,
            "gender": gender,
            "age": age,
            "phone_1": phone_1,
            "seen_date": seen_date,
            "case_status": case_status,
            "seen_address": sa3ed_address.name,  
            "nationality": nationality,
            "pic": pic
        })
        found_person.insert(ignore_permissions=True)

        # Return success response
        return {
            "status": "success",
            "message": _("Found Person created successfully"),
            "docname": found_person.name
        }

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("Error in Found Person API"))
        return {
            "status": "error",
            "message": _("An error occurred while creating the Found Person: {0}").format(str(e))
        }
