const lost_person_form_app = Vue.createApp({
    delimiters: ['[[', ']]'],
    data() {
        return {
            lost_person_name: '',
            birthdate: '',
            lost_address_line: '',
            home_address_line: '',
            lost_date: '',
            gender: '',
            notes: '',
            errors: {
                lost_person_name: false,
                birthdate: false,
                lost_address_line: false,
                lost_date: false,
                gender: false,
            },
        }
    },
    methods: {
        validate_form() {
            this.errors = {
                lost_person_name: !this.lost_person_name,
                birthdate: !this.birthdate,
                lost_address_line: !this.lost_address_line,
                lost_date: !this.lost_date,
                gender: !this.gender,
            };
            return !Object.values(this.errors).some(error => error);
        },
        btn_event() {
            if (!this.validate_form()) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            if (!this.validate_birthdate() || !this.validate_lost_date()) {
                return;
            }

            const fields_to_store = ['lost_person_name', 'birthdate', 'lost_date', 'gender', 'notes'];
            fields_to_store.forEach(field => {
                if (this[field] !== undefined && this[field] !== null) {
                    window.localStorage.setItem(field, this[field]);
                }
            });

            const lost_address_object = {
                title: this.lost_address_line?.toString() || '',
                city: '',
                country: '',
                address_type: 'Lost Place',
                address_line_1: this.lost_address_line?.toString() || '',
                address_line_2: '',
                postal_code: ''
            };

            const home_address_object = {
                title: this.home_address_line?.toString() || '',
                city: '',
                country: '',
                address_type: 'Home',
                address_line_1: this.home_address_line,
                address_line_2: '',
                postal_code: ''
            };

            window.localStorage.setItem('lost_address', JSON.stringify(lost_address_object));
            window.localStorage.setItem('home_address', JSON.stringify(home_address_object));
            window.location.pathname = '/lost_person_create_detail_2';
        },
        change_line() {
            const refs = ["name", "date", "address", "lost_date"];
            refs.forEach(ref => {
                if (this.$refs[ref].value) {
                    this.$refs[ref].style.borderBottom = '1px solid #0ACCAD';
                    this.$refs.btn.style.backgroundColor = '#053B4F';
                }
            });
        },
        validate_birthdate() {
            if (new Date(this.birthdate) > new Date()) {
                this.fire_toast(__('تاريخ الميلاد يجب ان يكون اصغر من او يساوي تاريخ اليوم'), '', 'error', __('خطا'));
                return false;
            } else {
                return true;
            }
        },
        validate_lost_date() {
            if (new Date(lost_date) > new Date()) {
                this.fire_toast(__('تاريخ الفقدان يجب ان يكون اصغر من او يساوي تاريخ اليوم'), '', 'error', __('خطا'));
                return false;
            } else if (new Date(this.birthdate) >= new Date(this.lost_date)) {
                this.fire_toast(__('تاريخ الفقدان يجب ان يكون اكبر من او يساوي تاريخ الميلاد'), '', 'error', __('خطا'));
                return false;
            }
            else {
                return true;
            }
        },
        back_to_prev() {
            window.history.back();
        },
        fire_toast(title = null, text = null, icon = null, confirm_button_text = null) {
            Swal.fire({
                title: title || __("تم الحفظ!"),
                text: text || __("البيانات تم حفظها بنجاح."),
                icon: icon || 'success',
                confirmButtonText: confirm_button_text || __("موافق")
            });
        }
    }
})

lost_person_form_app.mount("#lost_person_form")
