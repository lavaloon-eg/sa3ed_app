import frappe

@frappe.whitelist()
def follow_up_case(case_id):
    
    lost_person = frappe.db.get_value('Lost Person', {'name': case_id}, ['case_status'], as_dict=True)
    
    if lost_person:
        return {'case_status': lost_person['case_status']}
    
    
    founded_person = frappe.db.get_value('Founded Person', {'name': case_id}, ['case_status'], as_dict=True)
    
    if founded_person:
        return {'case_status': founded_person['case_status']}
    
    return {'error': 'Case not found'}
