import frappe
from frappe import _
from sa3ed_app.api.api_endpoint import ApiEndPoint


@frappe.whitelist(allow_guest=True)
def get_country_list():
    try:
        countries = frappe.get_all(doctype="Country", fields=["name AS id", "country_name"])
        if not countries:
            return ApiEndPoint.create_response(status_code=404, message=_("No data found"))

        return ApiEndPoint.create_response(status_code=200, message=_("Success"), data={"countries": countries})
    except Exception as e:
        return ApiEndPoint.create_response(status_code=400, message=str(e))
