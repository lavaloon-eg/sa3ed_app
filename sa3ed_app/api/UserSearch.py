import frappe
from pypika import Order

@frappe.whitelist(allow_guest=True)
def search_people(input):
    # Accessing Database and Variable Declerations
    lost_people = frappe.qb.DocType("Lost Person")
    found_people = frappe.qb.DocType("Found Person")
    result = []
    input = (str(input).lower()).strip()
    key = "%" + input + "%"

    # SQL Search Query
    try:
        if input == "":
            statuscode = 400
            data = "There is no input given"
        else:
            statuscode = 200
            lost_query = (
                frappe.qb.from_(lost_people)
                .select(
                lost_people.pic,
                lost_people.first_name,
                lost_people.middle_name,
                lost_people.last_name,
                lost_people.name,
                lost_people.creation,
                lost_people.birthdate,
                lost_people.gender,
                lost_people.nationality,
                lost_people.phone_1,
                lost_people.phone_2,
                lost_people.email_address,
                lost_people.notes,
                lost_people.case_status,
                lost_people.lost_date,
                lost_people.founded_person,
                lost_people.home_address,
                lost_people.lost_address
                )
                .where(
                (lost_people.pic.like(key)) |
                (lost_people.name.like(key)) |
                (lost_people.creation.like(key)) |
                (lost_people.first_name.like(key)) |
                (lost_people.middle_name.like(key)) |
                (lost_people.last_name.like(key)) |
                (lost_people.birthdate.like(key)) |
                (lost_people.gender.like(key)) |
                (lost_people.nationality.like(key)) |
                (lost_people.phone_1.like(key)) |
                (lost_people.phone_2.like(key)) |
                (lost_people.email_address.like(key)) |
                (lost_people.notes.like(key)) |
                (lost_people.case_status.like(key)) |
                (lost_people.lost_date.like(key)) |
                (lost_people.founded_person.like(key)) |
                (lost_people.home_address.like(key)) |
                (lost_people.lost_address.like(key))
                )
                .orderby(
                    "creation", order=Order.desc
                )
            )
            found_query = (
                frappe.qb.from_(found_people)
                .select(
                found_people.pic,
                found_people.first_name,
                found_people.middle_name,
                found_people.last_name,
                found_people.name,
                found_people.creation,
                found_people.nationality,
                found_people.gender,
                found_people.age,
                found_people.phone_1,
                found_people.phone_2,
                found_people.email_address,
                found_people.notes,
                found_people.seen_date,
                found_people.case_status,
                found_people.lost_person,
                found_people.seen_address,
                found_people.hospitality_address
                )
                .where(
                (found_people.pic.like(key)) |
                (found_people.name.like(key)) |
                (found_people.creation.like(key)) |
                (found_people.first_name.like(key)) |
                (found_people.middle_name.like(key)) |
                (found_people.last_name.like(key)) |
                (found_people.nationality.like(key)) |
                (found_people.gender.like(key)) |
                (found_people.age.like(key)) |
                (found_people.phone_1.like(key)) |
                (found_people.phone_2.like(key)) |
                (found_people.email_address.like(key)) |
                (found_people.notes.like(key)) |
                (found_people.seen_date.like(key)) |
                (found_people.case_status.like(key)) |
                (found_people.lost_person.like(key)) |
                (found_people.seen_address.like(key)) |
                (found_people.hospitality_address.like(key))
                )
                .orderby(
                    "creation", order=Order.desc
                )
            )
            data = {
                "lost_people" : lost_query.run(as_dict=True),
                "found_people" : found_query.run(as_dict=True)
            }
    except Exception as err:
        statuscode = 400
        data = f"An unexpected error happened: {err}"

    result = {
        "statuscode" : statuscode,
        "data" : data
    }
    return result