import frappe
from frappe import _
from frappe import cint
from sa3ed_app.Utils.Localization import *
from pypika.functions import Count
from frappe.query_builder import DocType


class ApiEndPoint:
    @staticmethod
    def validate_mandatory_parameters(args_obj: {},
                                      mandatory_args_csv: str = '') -> str:
        """
        Validate the API main object of the args
        :param args_obj:
        :param mandatory_args_csv:mandatory_args_csv
        :return: empty string if no validation errors, else return error message
        """
        error_msg = ''
        mandatory_args_list = mandatory_args_csv.split(sep=",")
        for arg in mandatory_args_list:
            if arg in args_obj:
                if args_obj[arg] is None:
                    error_msg.join(f"arg '{arg}' is mandatory\n")
            else:
                error_msg.join(f"arg '{arg}' doesn't exist\n")

        return error_msg

    @staticmethod
    def create_response(status_code: int, message: str, data: {} = None) -> {}:
        response = {"status_code": status_code,
                    "message": message,
                    "data": data}
