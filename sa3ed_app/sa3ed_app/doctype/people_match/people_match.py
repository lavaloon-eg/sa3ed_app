# Copyright (c) 2024, LavaLoon and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class PeopleMatch(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		age_similarity: DF.Float
		face_similarity: DF.Float
		found_person: DF.Link | None
		found_person_pic: DF.AttachImage | None
		gender_similarity: DF.Float
		lost_person: DF.Link | None
		lost_person_pic: DF.AttachImage | None
		match_date: DF.Datetime | None
		match_status: DF.Literal["Pending", "Confirmed", "Rejected"]
		name: DF.Int | None
		similarity_score: DF.Float
	# end: auto-generated types
	pass
