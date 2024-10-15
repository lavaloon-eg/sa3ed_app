# Copyright (c) 2024, LavaLoon and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Sa3edAddress(Document):
	def before_save(self):
		if(self.latitude != '' and self.longitude != ''):
			self.location = f"https://www.google.com/maps/@{self.latitude},{self.longitude}"
		else:
			self.location = f"https://www.google.com/maps"
