const found_person_form_app = Vue.createApp({
    delimiters: ['[[', ']]'],
    data() {
        return {
            found_person_name: '',
            age: '',
            found_person_date: '',
            gender: '',
            status: '',
            found_address_line: '',
            notes: '',
            errors: {},
        };
    },
    methods: {
        validate_form() {
            this.errors = {};
            if (!this.found_person_name || this.found_person_name.length < 3) this.errors.found_person_name = true;
            if (!this.age) this.errors.age = true;
            if (!this.found_address_line) this.errors.address_line = true;
            if (!this.gender) this.errors.gender = true;
            if (!this.status) this.errors.status = true;

            if (Object.keys(this.errors).length > 0) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                this.fire_toast(__('خطأ'), __('يرجى ادخال البيانات'), 'error', __('حسنا'));
                return false;
            }

            return this.validate_dates();
        },
        validate_dates() {
            const found_date = new Date(this.found_person_date);
            const today = new Date();

            if (found_date && found_date > today) {
                this.fire_toast(__('تاريخ الفقدان يجب ان يكون اصغر من او يساوي تاريخ اليوم'), '', 'error', __('حسنا'));
                return false;
            }

            return true;
        },
        btn_event() {
            if (!this.validate_form()) return;

            let found_address_obj = {
                title: this.found_address_line?.toString(),
                address_type: this.status === 'Seen' ? 'Seen Place' : 'Hospitality Address',
                city: '',
                country: '',
                address_line_1: this.found_address_line,
                address_line_2: '',
                postal_code: ''
            };

            window.localStorage.setItem('found_person_name', this.found_person_name);
            window.localStorage.setItem('found_date', this.found_person_date);
            window.localStorage.setItem('found_age', this.age);
            window.localStorage.setItem('found_gender', this.gender);
            window.localStorage.setItem('found_status', this.status);
            window.localStorage.setItem('found_notes', this.notes);
            window.localStorage.setItem('found_address', JSON.stringify(found_address_obj));

            window.location.pathname = '/found_person_create_detail_2';
        },
        back_to_prev() {
            window.history.back();
        },
        fire_toast(title = null, text = null, icon = null, confirm_button_text = null) {
            Swal.fire({
                title: title || __('تم الحفظ!'),
                text: text || __('البيانات تم حفظها بنجاح.'),
                icon: icon || 'success',
                confirmButtonText: confirm_button_text || __('موافق')
            });
        }
    }
});

found_person_form_app.mount('#found_person_form');
