from sa3ed_app.api.ApiEndPoint import *
from frappe import _
from sa3ed_app.api.Sa3edAddressEndPoints import create_sa3ed_address


@frappe.whitelist(allow_guest=True)
def get_lost_persons(args_obj: dict = {}):
    status_code, message, data = None, '', None

    try:
        current_lang = get_language()  # TODO: Apply the language
        page_limit = cint(ApiEndPoint.get_key_value(parent_obj=args_obj, key="page_limit",
                                                    default_value=20, raise_error_if_not_exist=False))
        start_index = cint(ApiEndPoint.get_key_value(parent_obj=args_obj, key="start_index",
                                                     default_value=0, raise_error_if_not_exist=False))
        age = ApiEndPoint.get_key_value(parent_obj=args_obj, key="age", raise_error_if_not_exist=False)
        lost_person_table = frappe.qb.DocType('Lost Person')
        query = (
            frappe.qb.from_(lost_person_table)
            .select(lost_person_table.name.as_("lost_person_id"),
                    lost_person_table.birthdate)
            .where(Lower(lost_person_table.case_status) == 'open')
            .limit(page_limit)
            .offset(start_index)
            .orderby(lost_person_table.creation, order=Order.desc)
        )
        data = query.run(as_dict=True)
        if data:
            status_code = 200
        else:
            status_code = 404
            message = "No data found"
    except Exception as ex:
        message = f"getting lost persons, error: '{str(ex)}'"
        status_code = 400

    return ApiEndPoint.create_response(status_code=status_code, message=message, data=data)


@frappe.whitelist(allow_guest=True)
def create_lost_person_case(args_obj: dict = {}):
    status_code, message, data = None, '', None
    mandatory_args_csv = _("first_name,middleman,last_name,birthdate,nationality,gender,lost_date")
    error_msg = ApiEndPoint.validate_mandatory_parameters(args_obj=args_obj,
                                                          mandatory_args_csv=mandatory_args_csv)
    if error_msg:
        status_code = 400
        message = error_msg
    else:
        try:
            frappe.db.begin()
            new_doc = frappe.new_doc("Lost Person")
            new_doc.first_name = args_obj["first_name"]
            new_doc.middle_name = args_obj["middle_name"]
            new_doc.last_name = args_obj["last_name"]
            new_doc.nationality = args_obj["nationality"]
            new_doc.gender = args_obj["gender"]
            new_doc.birthdate = args_obj["birthdate"]
            new_doc.case_status = "Open"
            new_doc.lost_date = args_obj["lost_date"]
            # new_doc.pic = args_obj["pic"] # TODO: handle uploading and adding the pic
            new_doc.phone_1 = args_obj["phone_1"]
            new_doc.phone_2 = ApiEndPoint.get_key_value(parent_obj=args_obj, key="phone_2",
                                                        raise_error_if_not_exist=False)
            new_doc.email_Address = ApiEndPoint.get_key_value(parent_obj=args_obj, key="email_Address",
                                                              raise_error_if_not_exist=False)
            new_doc.notes = ApiEndPoint.get_key_value(parent_obj=args_obj, key="notes",
                                                      raise_error_if_not_exist=False, default_value='')
            if args_obj["home_address"]:
                new_doc.home_address = create_sa3ed_address(args_obj["home_address"])
            if args_obj["lost_address"]:
                new_doc.lost_address = create_sa3ed_address(args_obj["lost_address"])
            new_doc.save()
            status_code = 200
            frappe.db.commit()
            message = _(f"Lost Person Case has been created successfully.")
            data = {"lost_person_case_id": new_doc.name,
                    "case_status": new_doc.case_status}
        except Exception as ex:
            frappe.db.rollback()
            message = f"creating a lost person case, error: '{str(ex)}'"
            status_code = 400

    return ApiEndPoint.create_response(status_code=status_code, message=message, data=data)
