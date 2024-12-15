import frappe

#Use this API file to bypass frappe whitelist.

@frappe.whitelist(allow_guest=True)
def get_country_list():
    try:
        country = frappe.qb.DocType("Country")
        query = (frappe.qb.from_(country)
        .select(
            country.name,
            country.code
        ))
        data = query.run(as_dict=True)
        statuscode = 200
    except Exception as err:
        statuscode = 400
        data = f"An unexpected error happened: {err}"
    
    result = {
        "statuscode" : statuscode,
        "data" : data
    }
    return result