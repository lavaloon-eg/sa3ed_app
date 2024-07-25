from ApiEndPoint import *
from frappe import _
from Sa3edAddressEndPoints import create_sa3ed_address


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
            .where(lost_person_table.case_status.lower() == 'open')
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
    mandatory_args_csv = _("first_name,middleman,last_name,birthdate,nationality")
    error_msg = ApiEndPoint.validate_mandatory_parameters(args_obj=args_obj,
                                                          mandatory_args_csv=mandatory_args_csv)
    if error_msg:
        status_code = 400
        message = error_msg
    else:
        new_doc = frappe.new_doc("Lost Person")
        new_doc.first_name = args_obj["first_name"]
        new_doc.middle_name = args_obj["middle_name"]
        new_doc.last_name = args_obj["last_name"]
        new_doc.nationality = args_obj["nationality"]
        new_doc.gender = args_obj["gender"]
        new_doc.birthdate = args_obj["birthdate"]
        # new_doc.pic = args_obj["pic"] # TODO: handle uploading and adding the pic
        new_doc.phone_1 = args_obj["phone_1"]
        if args_obj["phone_2"]:
            new_doc.phone_2 = args_obj["phone_2"]
        if args_obj["email_Address"]:
            new_doc.email_Address = args_obj["email_Address"]
        if args_obj["notes"]:
            new_doc.notes = args_obj["notes"]
        new_doc.case_status = "Open"
        new_doc.lost_date = args_obj["lost_date"]
        if args_obj["home_address"]:
            new_doc.home_address = create_sa3ed_address(args_obj["home_address"])
        if args_obj["lost_address"]:
            new_doc.lost_address = create_sa3ed_address(args_obj["lost_address"])
        new_doc.save()
        status_code = 200
        message = _(f"Lost Person Case has been created successfully.")
        data = {"lost_person_case_id": new_doc.name,
                "case_status": new_doc.case_status}
    return ApiEndPoint.create_response(status_code=status_code, message=message, data=data)
