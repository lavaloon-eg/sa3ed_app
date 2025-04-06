# Copyright (c) 2024, LavaLoon and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class FoundPerson(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		age: DF.Int
		case_status: DF.Literal["Seen", "Hospitality", "Closed"]
		email_address: DF.Data | None
		finder_name: DF.Data | None
		first_name: DF.Data | None
		gender: DF.Literal["Male", "Female"]
		hospitality_address: DF.Link | None
		last_name: DF.Data | None
		lost_person: DF.Link | None
		middle_name: DF.Data | None
		nationality: DF.Link | None
		notes: DF.Text | None
		phone_1: DF.Data
		phone_2: DF.Data | None
		pic: DF.AttachImage | None
		seen_address: DF.Link | None
		seen_date: DF.Date | None
	# end: auto-generated types
	pass
