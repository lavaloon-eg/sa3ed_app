import logging
import frappe


@frappe.whitelist(allow_guest=True)
def get_language():
    """
    default language is Arabic
    """
    local_language: str = frappe.local.lang
    selected_language = "ar"
    try:
        selected_language = format_language_key(language_key=local_language,
                                                default_language_key=selected_language)
    except Exception as ex:
        logger = logging.getLogger(__name__)
        logger.setLevel(logging.DEBUG)  # Optional: Set to DEBUG for detailed output
        logger.exception("An exception occurred in get_lang(): %s", ex)  # Log with full traceback

    return selected_language


@frappe.whitelist()
def format_language_key(language_key, default_language_key: str | None = None):
    """
    set the session language of the user. The method identifies the language based on
    the first 2 letters lower case. If not en (English), this means ar (Arabic)
    """
    default_language_key = default_language_key or get_default_language_key()
    if len(language_key) < 2:
        frappe.throw(msg="the language key's length must be >=2 characters",
                     exc=ValueError)
    selected_language = default_language_key
    if language_key[:2].lower() == "en":
        selected_language = "en"
    return selected_language


def get_default_language_key():
    """
    returns the default language key from website settings
    """
    return 'ar'
