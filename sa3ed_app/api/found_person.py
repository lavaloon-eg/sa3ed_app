import json
from typing import cast
from sa3ed_app.api.api_endpoint import *
from frappe import _
from sa3ed_app.api.sa3ed_address_endpoints import create_sa3ed_address
from sa3ed_app.sa3ed_app.doctype.found_person.found_person import FoundPerson
from sa3ed_app.utils.file_handler import save_image_attachment
from sa3ed_app.utils.date_helper import calculate_age


@frappe.whitelist(allow_guest=True)
def create_found_person_case(args_obj: str):
    status_code, message, data = None, '', None
    args_obj = json.loads(args_obj)

    mandatory_args_csv = _("first_name,last_name,birthdate,nationality,gender,seen_date")
    error_msg = ApiEndPoint.validate_mandatory_parameters(args_obj=args_obj,
                                                        mandatory_args_csv=mandatory_args_csv)
    if error_msg:
        status_code = 400
        message = error_msg
        return ApiEndPoint.create_response(status_code=status_code, message=message)

    try:
        found_person_doc = cast(FoundPerson, frappe.new_doc("Found Person"))
        found_person_doc.first_name = args_obj["first_name"]
        found_person_doc.last_name = args_obj["last_name"]
        found_person_doc.nationality = args_obj["nationality"]
        found_person_doc.gender = args_obj["gender"]
        found_person_doc.age = calculate_age(args_obj["birthdate"])
        found_person_doc.case_status = args_obj["case_status"]
        found_person_doc.seen_date = args_obj["seen_date"]
        found_person_doc.phone_1 = args_obj["phone_1"]

        if args_obj.get("middle_name"):
            found_person_doc.middle_name = args_obj["middle_name"]

        if args_obj.get("last_name"):
            found_person_doc.last_name = args_obj["last_name"]

        if args_obj.get("finder_name"):
            found_person_doc.finder_name = args_obj["finder_name"]

        if args_obj.get("phone_2"):
            found_person_doc.phone_2 = args_obj["phone_2"]

        if args_obj.get("email_address"):
            found_person_doc.email_address = args_obj["email_address"]

        if args_obj.get("notes"):
            found_person_doc.notes = args_obj["notes"]

        if found_person_doc.case_status == "Seen":
            if args_obj.get("seen_address"):
                found_person_doc.seen_address = create_sa3ed_address(args_obj["seen_address"])
        else:
            if args_obj.get("seen_address"):
                found_person_doc.hospitality_address = create_sa3ed_address(args_obj["seen_address"])
        found_person_doc.insert()

        if args_obj.get("pic"):
            image_file_url = save_image_attachment(filedata=args_obj['pic'],
                                                target_doctype="Found Person",
                                                target_doctype_id=found_person_doc.name,
                                                max_size_in_mb=2,
                                                target_field="pic_preview",
                                                is_private=0)
            found_person_doc.pic = image_file_url
            found_person_doc.save(ignore_permissions=True)
        status_code = 201
        frappe.db.commit()

        try:
            frappe.enqueue(
                'sa3ed_app.api.ai_matcher.get_potential_matches',
                queue='long',
                timeout=10000,
                found_person_id=found_person_doc.name
            )
        except Exception as ex:
            frappe.logger().error(f"Error enqueueing AI matcher: {str(ex)}")
        message = _(f"Found Person Case has been created successfully.")
        data = {"found_person_case_id": found_person_doc.name,
                "case_status": found_person_doc.case_status}
    except Exception as ex:
        frappe.db.rollback()
        message = f"creating a found person case, error: '{str(ex)}'"
        status_code = 400

    return ApiEndPoint.create_response(status_code=status_code, message=message, data=data)