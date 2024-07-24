import frappe
from frappe import _
from datetime import datetime, timedelta


def calculate_age(birthdate):
    today = datetime.today()
    birthdate = datetime.strptime(birthdate, '%Y-%m-%d')
    if today < birthdate:
        frappe.throw(msg=_("Birthdate cannot be greater than today"))
    age = today.year - birthdate.year - (
            (today.month, today.day) < (birthdate.month, birthdate.day)
    )
    return age


def calculate_birthdate(age):
    today = datetime.today()
    birth_year = today.year - age
    birthdate = today.replace(year=birth_year)
    try:
        birthdate = birthdate.replace(year=birth_year)
    except ValueError:
        birthdate = birthdate - timedelta(days=1)

    return birthdate.strftime('%Y-%m-%d')
