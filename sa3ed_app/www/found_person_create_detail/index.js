const found_person_form_app = Vue.createApp({
    delimiters: ['[[', ']]'],
    data() {
        return {
            found_person_name: '',
            birthdate: '',
            found_person_date: '',
            gender: '',
            status: '',
            country: '',
            city: '',
            found_address_line: '',
            notes: '',
            notes_address: '',
            errors: {},
            countries: [],
        };
    },
    methods: {
        async get_countries() {
            try {
                const response = await fetch('/countries.json');
                if (!response.ok) {
                    throw new Error('Failed to load countries');
                }
                this.countries = await response.json();
            } catch (error) {
                console.error('Error loading countries:', error);
            }
        },
        validate_form() {
            this.errors = {};
            if (!this.found_person_name || this.found_person_name.length < 3) this.errors.found_person_name = true;
            if (!this.birthdate) this.errors.birthdate = true;
            if (!this.city || this.city.length < 2) this.errors.city = true;
            if (!this.found_address_line) this.errors.address_line = true;
            if (!this.found_person_date) this.errors.found_date = true;
            if (!this.gender) this.errors.gender = true;
            if (!this.status) this.errors.status = true;
            if (!this.country) this.errors.country = true;

            if (Object.keys(this.errors).length > 0) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                this.fire_toast(__('يرجى ادخال البيانات'), '', 'error', __('حسنا'));
                return false;
            }

            return this.validate_dates();
        },
        validate_dates() {
            const birthdate = new Date(this.birthdate);
            const found_date = new Date(this.found_person_date);
            const today = new Date();

            if (birthdate > today) {
                this.fire_toast(__('تاريخ الميلاد يجب ان يكون اصغر من او يساوي تاريخ اليوم'), '', 'error', __('حسنا'));
                return false;
            }

            if (found_date > today) {
                this.fire_toast(__('تاريخ الفقدان يجب ان يكون اصغر من او يساوي تاريخ اليوم'), '', 'error', __('حسنا'));
                return false;
            }

            if (birthdate >= found_date) {
                this.fire_toast(__('تاريخ الفقدان يجب ان يكون اكبر من او يساوي تاريخ الميلاد'), '', 'error', __('حسنا'));
                return false;
            }

            return true;
        },
        btn_event() {
            if (!this.validate_form()) return;

            let found_address_obj = {
                title: `${this.found_address_line?.toString()}-${this.city?.toString()}-${this.country?.toString()}`,
                address_type: this.status === 'Seen' ? 'Seen Place' : 'Hospitality Address',
                city: this.city,
                country: this.country,
                address_line_1: this.found_address_line,
                notes: this.notes_address,
                address_line_2: '',
                postal_code: ''
            };

            window.localStorage.setItem('found_person_name', this.found_person_name);
            window.localStorage.setItem('found_date', this.found_person_date);
            window.localStorage.setItem('found_birthdate', this.birthdate);
            window.localStorage.setItem('found_gender', this.gender);
            window.localStorage.setItem('found_status', this.status);
            window.localStorage.setItem('found_country', this.country);
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
    },
    mounted() {
        this.get_countries();
    }
});

found_person_form_app.mount('#found_person_form');
