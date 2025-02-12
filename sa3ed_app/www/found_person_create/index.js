function open_file_browser() {
    document.getElementById('upload_image').click();
}

document.getElementById("upload_image").onchange = function () {
    if (this.value) {
        document.getElementById("submit_image").disabled = false;
    }

    const file_data_obj = this.files[0];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 1 * 1024 * 1024;

    if (!allowedTypes.includes(file_data_obj.type)) {
        fire_toast(__('الأنواع المسموح بها: JPEG, JPG, PNG'), '', 'error', __('حسنا'));
        return;
    }

    if (file_data_obj.size > maxSize) {
        fire_toast(__('حجم الملف يتجاوز 1MB'), '', 'error', __('حسنا'));
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById('image_preview').src = e.target.result;
    };
    reader.readAsDataURL(file_data_obj);
}

function convert_file_to_object(file) {
    return {
        lastModified: file.lastModified,
        lastModifiedDate: file.lastModifiedDate,
        name: file.name,
        size: file.size,
        type: file.type,
        webkitRelativePath: file.webkitRelativePath
    };
};

document.getElementById("submit_image").onclick = function (evt) {
    evt.preventDefault();
    const file = document.getElementById("upload_image").files[0];
    const file_data_obj = convert_file_to_object(file);
    if (!file) {
        fire_toast(__('يرجى اختيار صورة'), '', 'error', __('حسنا'));
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        const pic_base64_image = event.target.result;
        let found_address = window.localStorage.getItem('found_address');
        let parsed_address = found_address ? JSON.parse(found_address) : null;

        let args = {
            'args_obj': {
                'pic': { 'pic_base64_image': pic_base64_image, 'file_data_obj': file_data_obj },
                'first_name': window.localStorage.getItem('found_person_name'),
                'middle_name': "",
                'last_name': "test",
                'finder_name': window.localStorage.getItem('finder_user_name'),
                'gender': window.localStorage.getItem('found_gender'),
                'nationality': window.localStorage.getItem('found_country'),
                'birthdate': window.localStorage.getItem('found_birthdate'),
                'seen_date': window.localStorage.getItem('found_date'),
                'phone_1': window.localStorage.getItem('finder_phone_1'),
                'notes': window.localStorage.getItem('found_notes'),
                'email_Address': window.localStorage.getItem('finder_email_Address'),
                'case_status': window.localStorage.getItem('found_status'),
                'seen_address': parsed_address
            }
        };

        if (Object.values(args.args_obj).some(value => value === "" || value === null)) {
            fire_toast(__('يرجى ملء جميع الحقول المطلوبة.'), '', 'error', __('حسنا'));
            return;
        }

        frappe.call({
            method: "sa3ed_app.api.found_person.create_found_person_case",
            type: "POST",
            args: args,
            callback: function (response) {
                if (response.message) {
                    fire_toast(__('تم الحفظ!'), __('البيانات تم حفظها بنجاح, رمز الحالة هو {0}', [response.message.data.found_person_case_id]), 'success', __('حسنا'));
                    setTimeout(() => {
                        window.localStorage.clear();
                        document.getElementById("bach_to_home").disabled = false;
                        document.getElementById("bach_to_home").onclick = function () {
                            window.location.pathname = 'home'
                        }
                    }, 3000);
                } else {
                    fire_toast(__('لم يتم الحفظ!'), __('البيانات لم يتم حفظها بنجاح.'), 'error', __('حسنا'));
                }
            }
        });
    };
    reader.readAsDataURL(file);
};

function back_to_prev() {
    window.history.back();
};

function fire_toast(title = null, text = null, icon = null, confirm_button_text = null) {
    Swal.fire({
        title: title || __('تم الحفظ!'),
        text: text || __('البيانات تم حفظها بنجاح.'),
        icon: icon || 'success',
        confirmButtonText: confirm_button_text || __('موافق')
    });
}