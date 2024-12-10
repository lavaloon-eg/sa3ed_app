import frappe

#Use this API file to bypass frappe whitelist.

@frappe.whitelist(allow_guest=True)
def get_country_list():
    country = frappe.qb.DocType("Country")
    query = (frappe.qb.from_(country)
    .select(
        country.name,
        country.code
    ))
    country_list = query.run(as_dict=True)
    return country_list