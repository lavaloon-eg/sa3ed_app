from sa3ed_app.api.ApiEndPoint import *
from frappe import _


def create_sa3ed_address(args_obj: {}) -> str:
    mandatory_args_csv = _("title,address_type,country,city,address_line_1")
    error_msg = ApiEndPoint.validate_mandatory_parameters(args_obj=args_obj,
                                                          mandatory_args_csv=mandatory_args_csv)
    new_doc = None
    if error_msg:
        frappe.throw(msg=error_msg)
    else:
        new_doc = frappe.new_doc("Sa3ed Address")
        new_doc.title = args_obj['title']
        new_doc.address_type = args_obj['address_type']
        new_doc.country = args_obj['country']
        new_doc.city = args_obj['city']
        new_doc.address_line_1 = args_obj['address_line_1']
        new_doc.address_line_2 = args_obj['address_line_2']
        new_doc.notes = args_obj['notes']
        new_doc.postal_code = args_obj['postal_code']
        new_doc.save()

    return new_doc.name
