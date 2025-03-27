let found_person_form_2_app = Vue.createApp({
    data() {
        return {
            finder_name: '',
            email: '',
            phone_number: '',
            phone_input: null,
            errors: {}
        };
    },
    mounted() {
        this.phone_input = window.intlTelInput(this.$refs.phone, {
            initialCountry: "eg",
            geoIpLookup: function (callback) {
                fetch('https://ipinfo.io/json', { headers: { 'Accept': 'application/json' } })
                    .then(response => response.json())
                    .then(data => callback(data.country))
                    .catch(() => callback('us'));
            },
            utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js"
        });

        const wrapper = this.$refs.phone.parentNode;
        wrapper.classList.add("w-100");
    },
    methods: {
        validate_form() {
            this.errors = {
                finder_name: !this.finder_name?.trim(),
                email: !this.validate_email(this.email),
                phone: !(this.phone_input && this.phone_input.isValidNumber())
            };

            if (this.errors.finder_name) {
                this.fire_toast(__('يرجى إدخال الاسم'), '', 'error', __('خطأ'));
                return false;
            }

            if (this.errors.email) {
                this.fire_toast(__('البريد الإلكتروني غير صالح'), '', 'error', __('خطأ'));
                return false;
            }

            if (this.errors.phone) {
                this.fire_toast(__('رقم الهاتف المحمول غير صالح'), '', 'error', __('خطأ'));
                return false;
            }

            this.phone_number = this.phone_input.getNumber();
            return true;
        },
        btn_event() {
            if (!this.validate_form()) return;

            window.localStorage.setItem('finder_user_name', this.finder_name);
            window.localStorage.setItem('finder_email_address', this.email);
            window.localStorage.setItem('finder_phone_1', this.phone_number);
            window.location.pathname = '/found_person_create';
        },
        validate_email(email) {
            let email_pattern = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
            if (!email_pattern.test(email)) {
                this.fire_toast(__('خطا في البريد الالكتروني'), '', 'error', __('حسنا'));
                return false;
            }
            return true;
        },
        validate_phone() {
            if (!this.phone_input.isValidNumber()) {
                this.fire_toast(__('خطا في رقم الهاتف المحمول'), '', 'error', __('حسنا'));
                return false;
            }
            this.phone_number = this.phone_input.getNumber();
            return true;
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

found_person_form_2_app.mount("#found_person_form_2");
