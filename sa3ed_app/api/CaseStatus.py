import frappe

@frappe.whitelist()
def follow_up_case(case_id):
    lost_person = frappe.db.get_value('Lost Person', {'name': case_id}, ['case_status'], as_dict=True)
    if lost_person:
        response = {
            "status_code": 200,
            "success": True,
            "data": {
                "case_status": lost_person['case_status']
            }
        }
        return response
    
    founded_person = frappe.db.get_value('Founded Person', {'name': case_id}, ['case_status'], as_dict=True)
    
    if founded_person:
        response = {
            "status_code": 200,
            "success": True,
            "data": {
                "case_status": founded_person['case_status']
            }
        }
        return response
    
    response = {
        "status_code": 404,
        "success": False,
        "error": "Case not found"
    }
    return response
