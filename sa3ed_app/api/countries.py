import frappe
from frappe import _
from sa3ed_app.api.ApiEndPoint import ApiEndPoint
from sa3ed_app.utils.Localization import get_language


@frappe.whitelist(allow_guest=True)
def get_country_list():
    try:
        current_lang = get_language() 
        countries = frappe.get_all(doctype="Country", fields=["name AS id", "country_name"])
        if not countries:
            return ApiEndPoint.create_response(status_code=404, message=_("No data found"))

        countries = [{"id": country.id, "country_name": _(msg=country.country_name, lang=current_lang)} for country in countries]
        return ApiEndPoint.create_response(status_code=200, message=_("Success"), data={"countries": countries})
    except Exception as e:
        return ApiEndPoint.create_response(status_code=400, message=str(e))
