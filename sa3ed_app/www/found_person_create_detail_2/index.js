var app = Vue.createApp({
    data() {
        return {
            user_name: '',        
            email: '',           
            phone_number: '',    
            phoneInput: null, 
        }
    },

    mounted() {
        // Initialize intl-tel-input with GeoIP lookup
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
    },
    methods: {
        btnevent() { 
            if (this.user_name && this.email && this.phoneInput.isValidNumber()) {
                if (this.VailedEmail(this.email)) {
                    window.localStorage.setItem('fnduser_name', this.user_name);
                    window.localStorage.setItem('fndemail_Address', this.email);
                    window.localStorage.setItem('fndphone_1', this.phoneInput.getNumber());
                    window.location.pathname = '/found_person_create';
                }
            } else {
                Swal.fire({
                    title: 'خطا في ادخال البيانات',
                    text: '',
                    icon: 'error',
                    confirmButtonText: 'خطا'
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
                    field.style.borderBottom = 'none';
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
        }
    }
});

app.mount("#app");
