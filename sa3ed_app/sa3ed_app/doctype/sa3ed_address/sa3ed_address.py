# Copyright (c) 2024, LavaLoon and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Sa3edAddress(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		address_line_1: DF.Data
		address_line_2: DF.Data | None
		address_type: DF.Literal["Home", "Seen Place", "Lost Place", "Hospitality Address"]
		city: DF.Data | None
		country: DF.Link | None
		latitude: DF.Float
		location: DF.Data | None
		longitude: DF.Float
		notes: DF.Text | None
		postal_code: DF.Data | None
		state: DF.Data | None
		title: DF.Data | None
	# end: auto-generated types
	def before_save(self):
		if(self.latitude != '' and self.longitude != ''):
			self.location = f"https://www.google.com/maps/@{self.latitude},{self.longitude}"
		else:
			self.location = f"https://www.google.com/maps"
