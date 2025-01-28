let found_person_form_2_app = Vue.createApp({
    data() {
        return {
            user_name: '',        
            email: '',           
            phone_number: '',    
            phoneInput: null,
            errors: {
                name: false,
                email: false,
                phone: false
            }
        }
    },

    mounted() {
        this.phoneInput = window.intlTelInput(this.$refs.phone, {
            initialCountry: "auto",
            geoIpLookup: function(callback) {
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
                name: !this.user_name,
                email: !this.email,
                phone: !this.phone_number
            };
            return !Object.values(this.errors).some(error => error);
        },
        btn_event() { 
            if (this.validate_form()) {
                if (this.user_name && this.validate_email(this.email) && this.validate_phone()) {
                    window.localStorage.setItem('fnduser_name', this.user_name);
                    window.localStorage.setItem('fndemail_Address', this.email);
                    window.localStorage.setItem('fndphone_1', this.phoneInput.getNumber());
                    window.location.pathname = '/found_person_create';
                } else {
                    Swal.fire({
                        title: 'خطا في ادخال البيانات',
                        text: '',
                        icon: 'error',
                        confirmButtonText: 'خطا'
                    });
                }
            } else {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        },

        change_line() {
            const fields = [this.$refs.name, this.$refs.date, this.$refs.phone];
            const btn = this.$refs.btn;
            fields.forEach(field => {
                if (field.value !== '') {
                    field.style.borderBottom = '1px solid #0ACCAD';
                    btn.style.backgroundColor = '#053B4F';
                } else {
                    
                }
            });
        },

        validate_email(email) {
            let email_test = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
            if (email_test.test(email)) {
                return true;
            } else {
                Swal.fire({
                    title: 'خطا في البريد الالكتروني',
                    text: '',
                    icon: 'error',
                    confirmButtonText: 'خطا'
                });
                return false;
            }
        },

        validate_phone() {
            if (this.phoneInput.isValidNumber()) {
                this.phone_number = this.phoneInput.getNumber();
                return true;
            } else {
                this.phone_number = '';
                Swal.fire({
                    title: 'خطا في رقم الهاتف المحمول',
                    text: '',
                    icon: 'error',
                    confirmButtonText: 'خطا'
                });
                return false;
            }
        },
        back_to_prev() {
            window.history.back();
        }
    }
});

found_person_form_2_app.mount("#found_person_form_2");
