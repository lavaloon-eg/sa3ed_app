import frappe

@frappe.whitelist(allow_guest=True)
def search_people(input):
    # Accessing Database and Variable Declerations
    lost_people = frappe.db.get_all('Lost Person', fields=[
        #column breaks, tab breaks, pic and pic_preview fields not included
        "name",
        "creation",
        "first_name",
        "middle_name",
        "last_name",
        "birthdate",
        "gender",
        "nationality",
        "phone_1",
        "phone_2",
        "email_address",
        "notes",
        "case_status",
        "lost_date",
        "founded_person",
        "home_address",
        "lost_address"])
    found_people = frappe.db.get_all('Found Person', fields=[
        #column breaks, tab breaks, pic and pic_preview fields not included
        "name",
        "creation",
        "first_name",
        "middle_name",
        "last_name",
        "nationality",
        "gender",
        "age",
        "phone_1",
        "phone_2",
        "email_address",
        "notes",
        "seen_date",
        "case_status",
        "lost_person",
        "seen_address",
        "hospitality_address"])
    result = []
    
    # Search Filter
    if (str(input).lower()).strip() == "":
        err = "There is no input given"
        return err
    for person in lost_people:
        for value in person.values():
            if (str(input).lower()).strip() in (str(value).lower()).strip():
                result.append(person)
    for person in found_people:
        for value in person.values():
            if (str(input).lower()).strip() in (str(value).lower()).strip():
                result.append(person)    
    
    # Result Sort (Latest)
    def creation_date(person):
        return person["creation"]
    result.sort(reverse=True, key=creation_date)
    
    #  Return Results
    return result