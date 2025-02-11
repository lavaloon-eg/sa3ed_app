import json
from sa3ed_app.api.api_endpoint import *
from frappe import _
from frappe.query_builder.functions import Concat_ws
from sa3ed_app.api.sa3ed_address_endpoints import create_sa3ed_address
from sa3ed_app.utils.file_handler import save_image_attachment


@frappe.whitelist(allow_guest=True, methods=['GET'])
def get_lost_persons(args_obj: str = None):
    args_obj = json.loads(args_obj)
    try:
        page_limit = cint(ApiEndPoint.get_key_value(parent_obj=args_obj, key="page_limit",
                                                    default_value=20, raise_error_if_not_exist=False))
        start_index = cint(ApiEndPoint.get_key_value(parent_obj=args_obj, key="start_index",
                                                    default_value=0, raise_error_if_not_exist=False))
        # age = ApiEndPoint.get_key_value(parent_obj=args_obj, key="age", raise_error_if_not_exist=False)
        lost_person = frappe.qb.DocType('Lost Person')
        query = (
            frappe.qb.from_(lost_person)
            .select(
                lost_person.name.as_("lost_person_id"),
                Concat_ws(' ', lost_person.first_name, lost_person.middle_name, lost_person.last_name).as_("full_name"),
                lost_person.birthdate,
                lost_person.gender,
                lost_person.pic.as_("lost_person_pic"),
            )
            .where(Lower(lost_person.case_status) == 'open')
            .limit(page_limit)
            .offset(start_index)
            .orderby(lost_person.creation, order=Order.desc)
        )
        data = query.run(as_dict=True)

        if data:
            return ApiEndPoint.create_response(status_code=200, message=_("Success"), data=data)
        else:
            return ApiEndPoint.create_response(status_code=404, message=_("No data found"))
    except Exception as ex:
        message = _("getting lost persons, error: '{0}'").format(str(ex))
        return ApiEndPoint.create_response(status_code=400, message=message, data=data)

@frappe.whitelist(allow_guest=True)
def create_lost_person_case(args_obj: str):
    status_code, message, data = None, '', None
    args_obj = json.loads(args_obj)

    mandatory_args_csv = _("first_name,last_name,birthdate,nationality,gender,lost_date")
    error_msg = ApiEndPoint.validate_mandatory_parameters(args_obj=args_obj,
                                                        mandatory_args_csv=mandatory_args_csv)
    if error_msg:
        status_code = 400
        message = error_msg
        return ApiEndPoint.create_response(status_code=status_code, message=error_msg, data=data)

    try:
        new_doc = frappe.new_doc("Lost Person")
        new_doc.first_name = args_obj["first_name"]
        new_doc.last_name = args_obj["last_name"]
        new_doc.nationality = args_obj["nationality"]
        new_doc.gender = args_obj["gender"]
        new_doc.birthdate = args_obj["birthdate"]
        new_doc.case_status = "Open"
        new_doc.lost_date = args_obj["lost_date"]
        new_doc.phone_1 = args_obj["phone_1"]

        if args_obj.get("middle_name"):
            new_doc.middle_name = args_obj["middle_name"]

        if args_obj.get("phone_2"):
            new_doc.phone_2 = args_obj["phone_2"]

        if args_obj.get("email_Address"):
            new_doc.email_address = args_obj["email_Address"]

        if args_obj.get("notes"):
            new_doc.notes = args_obj["notes"]

        if args_obj.get("home_address"):
            new_doc.home_address = create_sa3ed_address(args_obj["home_address"])

        if args_obj.get("lost_address"):
            new_doc.lost_address = create_sa3ed_address(args_obj["lost_address"])

        new_doc.insert()

        if args_obj.get("pic"):
            image_file_url = save_image_attachment(filedata=args_obj['pic'],
                                                target_doctype="Lost Person",
                                                target_doctype_id=new_doc.name,
                                                max_size_in_mb=2,
                                                target_field="pic_preview",
                                                is_private=0)
            new_doc.pic = new_doc.pic_preview = image_file_url

            new_doc.save(ignore_permissions=True)
        status_code = 200

        message = _(f"Lost Person Case has been created successfully.")
        data = {"lost_person_case_id": new_doc.name,
                "case_status": new_doc.case_status}
    except Exception as ex:
        frappe.db.rollback()
        message = f"creating a lost person case, error: '{str(ex)}'"
        status_code = 400

    return ApiEndPoint.create_response(status_code=status_code, message=message, data=data)
