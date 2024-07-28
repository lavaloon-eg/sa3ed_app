import frappe
import base64
from io import BytesIO
from PIL import Image


def convert_image_base64_to_image_data(image_base64):
    image_data = base64.b64decode(image_base64.split(',')[1])
    # image_file = BytesIO(image_data)
    # img = Image.open(image_file)
    return image_data


def save_file_attachment(filedata, target_doctype, target_doctype_id, target_field, allowed_types, max_size_in_mb,
                         is_private=1):
    try:
        file_data_obj = filedata['file_data_obj']
        if file_data_obj['type'] not in allowed_types:
            allowed_types_str = ''
            for file_type in allowed_types:
                allowed_types_str.join(f"{file_type},")
            frappe.throw(msg=f"Error: Invalid file type. Allowed types: {allowed_types_str}")

        max_size = max_size_in_mb * 1024 * 1024
        if file_data_obj['size'] > max_size:
            frappe.throw(msg=f"Error: File size exceeds {max_size_in_mb} MB")

        file_doc = frappe.get_doc({
            "doctype": "File",
            "file_name": file_data_obj['name'],
            "attached_to_doctype": target_doctype,
            "attached_to_name": target_doctype_id,
            "attached_to_field": target_field,
            "is_private": is_private,
            "content": convert_image_base64_to_image_data(filedata['pic_base64Image'])
        })
        file_doc.insert()
        return file_doc.file_url
    except Exception as ex:
        frappe.throw(msg=f"Error saving file: {str(ex)}")


def save_image_attachment(filedata, target_doctype,
                          target_doctype_id,
                          max_size_in_mb,
                          target_field,
                          allowed_types=None,
                          is_private=1
                          ):
    if allowed_types is None:
        allowed_types = ['image/jpeg', 'image/jpg', 'image/png']

    return save_file_attachment(filedata=filedata,
                                target_doctype=target_doctype,
                                target_doctype_id=target_doctype_id,
                                allowed_types=allowed_types,
                                target_field=target_field,
                                max_size_in_mb=max_size_in_mb,
                                is_private=is_private)
