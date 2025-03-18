function open_file_browser() {
    $('#upload_image').click();
}

document.getElementById("upload_image").onchange = function () {
    if (this.value) {
        document.getElementById("submit_image").disabled = false;
    }

    const file_data_obj = this.files[0];
    const allowed_types = ['image/jpeg', 'image/jpg', 'image/png'];
    const max_size = 1 * 1024 * 1024;

    if (!allowed_types.includes(file_data_obj.type)) {
        Swal.fire({
            title: __('خطأ'),
            text: __('الأنواع المسموح بها: JPEG, JPG, PNG'),
            icon: 'error',
            confirmButtonText: __('موافق')
        });
        return;
    }

    if (file_data_obj.size > max_size) {
        Swal.fire({
            title: __('خطأ'),
            text: __('حجم الملف يتجاوز 1MB'),
            icon: 'error',
            confirmButtonText: __('موافق')
        });
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
        Swal.fire({
            title: __('خطأ'),
            text: __('الرجاء اختيار ملف.'),
            icon: 'error',
            confirmButtonText: __('موافق')
        })
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        const pic_base64_image = event.target.result;
        let lost_person_name = window.localStorage.getItem('lost_person_name') || "";
        let name_parts = lost_person_name.trim().split(/\s+/);
        let first_name = name_parts[0] || "";
        let last_name = name_parts.length > 1 ? name_parts[name_parts.length - 1] : "";
        let middle_name = name_parts.length > 2 ? name_parts.slice(1, -1).join(' ') : "";

        let args = {
            'args_obj': {
                'pic': { 'pic_base64_image': pic_base64_image, 'file_data_obj': file_data_obj },
                'first_name': first_name,
                'middle_name': middle_name,
                'last_name': last_name,
                'reporter_name': window.localStorage.getItem('user_name'),
                'gender': window.localStorage.getItem('gender'),
                'birthdate': window.localStorage.getItem('birthdate'),
                'lost_date': window.localStorage.getItem('lost_date'),
                'phone_1': window.localStorage.getItem('phone_1'),
                'notes': window.localStorage.getItem('notes'),
                'email_address': window.localStorage.getItem('email_address'),
                'lost_address': JSON.parse(window.localStorage.getItem('lost_address')),
                'home_address': JSON.parse(window.localStorage.getItem('home_address'))
            }
        };

        frappe.call({
            method: "sa3ed_app.api.lost_person.create_lost_person_case",
            type: "POST",
            args: args,
            callback: function (response) {
                if (response.message) {
                    Swal.fire({
                        title: __('تم الحفظ!'),
                        text: __('البيانات تم حفظها بنجاح, رمز الحالة هو {0}', [response.message.data.lost_person_case_id]),
                        icon: 'success',
                        confirmButtonText: __('موافق')
                    })
                    reset_form();
                    setTimeout(() => {
                        window.localStorage.clear();
                        document.getElementById("back_to_home").disabled = false;
                        document.getElementById("back_to_home").onclick = function () {
                            window.location.pathname = 'home'
                        }
                    }, 3000);
                } else {
                    Swal.fire({
                        title: __('لم يتم الحفظ!'),
                        text: __('البيانات لم يتم حفظها بنجاح.'),
                        icon: 'error',
                        confirmButtonText: __('حسنا')
                    });
                }
            }
        });
    };
    reader.readAsDataURL(file);
};

function back_to_prev() {
    window.history.back();
};

function reset_form() {
    window.localStorage.setItem('lost_person_name', '');
    window.localStorage.setItem('gender', '');
    window.localStorage.setItem('country', '');
    window.localStorage.setItem('birthdate', '');
    window.localStorage.setItem('lost_date', '');
    window.localStorage.setItem('phone_1', '');
    window.localStorage.setItem('notes', '');
    window.localStorage.setItem('email_address', '');
    window.localStorage.setItem('lost_address', '');
    window.localStorage.setItem('home_address', '');
}