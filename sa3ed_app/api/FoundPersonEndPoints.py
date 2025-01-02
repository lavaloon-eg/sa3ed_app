import json
from sa3ed_app.api.ApiEndPoint import *
from frappe import _
from sa3ed_app.api.Sa3edAddressEndPoints import create_sa3ed_address
from sa3ed_app.utils.FileHandler import save_image_attachment
from sa3ed_app.utils.DateHelper import calculate_age


@frappe.whitelist(allow_guest=True)
def create_found_person_case(args_obj: str):
    status_code, message, data = None, '', None
    args_obj = json.loads(args_obj)

    mandatory_args_csv = _("first_name,middle_name,last_name,birthdate,nationality,gender,seen_date")
    error_msg = ApiEndPoint.validate_mandatory_parameters(args_obj=args_obj,
                                                        mandatory_args_csv=mandatory_args_csv)
    if error_msg:
        status_code = 400
        message = error_msg
    else:
        try:
            frappe.db.begin()
            new_doc = frappe.new_doc("Found Person")
            new_doc.first_name = args_obj["first_name"]
            new_doc.middle_name = args_obj["middle_name"]
            new_doc.last_name = args_obj["last_name"]
            new_doc.nationality = args_obj["nationality"]
            new_doc.gender = args_obj["gender"]
            new_doc.birthdate = args_obj["birthdate"]
            new_doc.age = calculate_age(args_obj["birthdate"])
            new_doc.case_status = args_obj["case_status"]
            new_doc.seen_date = args_obj["seen_date"]
            new_doc.phone_1 = args_obj["phone_1"]
            if args_obj.get("phone_2"):
                new_doc.phone_2 = args_obj["phone_2"]
            if args_obj.get("email_Address"):
                new_doc.email_address = args_obj["email_Address"]
            if args_obj.get("notes"):
                new_doc.notes = args_obj["notes"]
            
            if new_doc.case_status == "Seen":
                if args_obj.get("seen_address"):
                    new_doc.seen_address = create_sa3ed_address(args_obj["seen_address"])
            else:
                if args_obj.get("seen_address"):
                    new_doc.hospitality_address = create_sa3ed_address(args_obj["seen_address"])
            new_doc.insert()

            if args_obj.get("pic"):
                image_file_url = save_image_attachment(filedata=args_obj['pic'],
                                                    target_doctype="Found Person",
                                                    target_doctype_id=new_doc.name,
                                                    max_size_in_mb=2,
                                                    target_field="pic_preview",
                                                    is_private=0)
                new_doc.pic = new_doc.pic_preview = image_file_url
                # frappe.session.user.flags.ignore_permissions = True
                new_doc.save(ignore_permissions=True)
            status_code = 200
            frappe.db.commit()
            message = _(f"Found Person Case has been created successfully.")
            data = {"found_person_case_id": new_doc.name,
                    "case_status": new_doc.case_status}
        except Exception as ex:
            frappe.db.rollback()
            message = f"creating a found person case, error: '{str(ex)}'"
            status_code = 400

    return ApiEndPoint.create_response(status_code=status_code, message=message, data=data)