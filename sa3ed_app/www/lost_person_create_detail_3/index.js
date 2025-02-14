var lost_person_form_3_app = Vue.createApp({
    data() {
        return {
            user_name: '',
            email: '',
            phone_number: '',
            phone_input: null,
            errors: {
                user_name: false,
                email: false,
                phone_number: false
            }
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
                user_name: !this.user_name.trim(),
                email: !this.validate_email(this.email),
                phone_number: !(this.phone_input && this.phone_input.isValidNumber())
            };

            if (this.errors.user_name) {
                this.fire_toast(__('يرجى إدخال الاسم'), '', 'error', __('خطأ'));
                return false;
            }

            if (this.errors.email) {
                this.fire_toast(__('البريد الإلكتروني غير صالح'), '', 'error', __('خطأ'));
                return false;
            }

            if (this.errors.phone_number) {
                this.fire_toast(__('رقم الهاتف المحمول غير صالح'), '', 'error', __('خطأ'));
                return false;
            }

            this.phone_number = this.phone_input.getNumber();
            return true;
        },

        btn_event() {
            if (!this.validate_form()) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            window.localStorage.setItem('user_name', this.user_name);
            window.localStorage.setItem('email_Address', this.email);
            window.localStorage.setItem('phone_1', this.phone_number);

            window.location.pathname = '/lost_person_create';
        },

        validate_email(email) {
            if (!email) return false;
            const email_pattern = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
            return email_pattern.test(email.trim());
        },

        fire_toast(title = '', text = '', icon = '', confirm_button_text = '') {
            Swal.fire({
                title,
                text,
                icon,
                confirmButtonText: confirm_button_text
            });
        },

        back_to_prev() {
            window.history.back();
        }
    }

});

lost_person_form_3_app.mount("#lost_person_form_3");
