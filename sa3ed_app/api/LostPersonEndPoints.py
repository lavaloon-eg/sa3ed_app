import frappe
from ApiEndPoint import *


@frappe.whitelist(allow_guest=True)
def get_lost_persons(args_obj: {} = None):
    status_code, message, data = None, '', None
    try:
        current_lang = get_language()  # TODO: Apply the language
        page_limit = cint(args_obj["page_limit"], default=20)
        start_index = cint(args_obj["start_index"], default=0)

        lost_person_table = frappe.qb.DocType('Lost Person')
        query = (
            frappe.qb.from_(lost_person_table)
            .select(lost_person_table.name.as_("lost_person_id"),
                    lost_person_table.birth_date)
            .where(lost_person_table.case_status == 'open')
            .limit(page_limit)
            .offset(start_index)
            .orderby(lost_person_table.creation, order="desc")
        )
        data = query.run(as_dict=True)
        status_code = 200
    except Exception as ex:
        message = f"getting lost persons, error: '{str(ex)}'"
        status_code = 400

    return ApiEndPoint.create_response(status_code=status_code, message=message, data=data)


@frappe.whitelist(allow_guest=True)
def create_lost_person_case(args_obj: {}):
    status_code, message, data = None, '', None
    mandatory_args_csv = "first_name,middleman,last_name,birthdate,nationality"
    error_msg = ApiEndPoint.validate_mandatory_parameters(args_obj=args_obj,
                                                          mandatory_args_csv=mandatory_args_csv)
    if error_msg:
        status_code = 400
        message = error_msg
    else:
        new_doc = frappe.new_doc("Lost Person")
        new_doc.first_name = args_obj["first_name"]
        # TODO: add the rest of fields
        new_doc.save()
        status_code = 200
        message = f"Lost Person Case has been created successfully."
        data = {"lost_person_case_id": new_doc.name}
    return ApiEndPoint.create_response(status_code=status_code, message=message, data=data)
