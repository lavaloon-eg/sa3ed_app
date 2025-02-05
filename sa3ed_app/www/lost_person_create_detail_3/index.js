var lost_person_form_3_app = Vue.createApp({
    data() {
        return {
            user_name: '',        
            email: '',           
            phone_number: '',    
            phoneInput: null,
            errors:{
                user_name:false,
                email:false,
                phone_number:false,
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
                user_name: !this.user_name,
                email: !this.email,
                phone_number: !this.phoneInput.isValidNumber(),
            };
            return !Object.values(this.errors).some(error => error);
        },
        btn_event() { 
            if (this.validate_form()) {
                if (this.user_name && this.email && this.phoneInput.isValidNumber()) {
                    if (this.VailedEmail(this.email)) {
                        window.localStorage.setItem('user_name', this.user_name);
                        window.localStorage.setItem('email_Address', this.email);
                        window.localStorage.setItem('phone_1', this.phoneInput.getNumber());
                        window.location.pathname = '/lost_person_create';
                    }
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

        changeline() {
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

        VailedEmail(email) {
            let emailtest = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
            if (emailtest.test(email)) {
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

        validatePhone() {
            if (this.phoneInput.isValidNumber()) {
                this.phone_number = this.phoneInput.getNumber();
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

lost_person_form_3_app.mount("#lost_person_form_3");
