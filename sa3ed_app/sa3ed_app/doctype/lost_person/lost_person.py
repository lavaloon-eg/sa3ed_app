# Copyright (c) 2024, LavaLoon and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class LostPerson(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		birthdate: DF.Date
		case_status: DF.Literal["Open", "Closed"]
		email_address: DF.Data | None
		first_name: DF.Data
		founded_person: DF.Link | None
		gender: DF.Literal["Male", "Female"]
		home_address: DF.Link | None
		last_name: DF.Data | None
		lost_address: DF.Link | None
		lost_date: DF.Date
		middle_name: DF.Data | None
		nationality: DF.Link | None
		notes: DF.Text | None
		phone_1: DF.Data
		phone_2: DF.Data | None
		pic: DF.AttachImage | None
		reporter_name: DF.Data
	# end: auto-generated types
	pass
