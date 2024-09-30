var app = Vue.createApp({
    data() {
        return {
            user_name: '',        
            email: '',           
            phone_number: '',    
        }
    },
    methods: {
        btnevent() { 
            if (this.user_name && this.email && this.phone_number) {
                window.localStorage.setItem('user_name', this.user_name);
                window.localStorage.setItem('email_Address', this.email);
                window.localStorage.setItem('phone_1', this.phone_number);
                window.location.pathname = '/lost_person_create';
            } else {
                window.alert("يرجى إدخال القيم المطلوبة");
            }
        },
        changeline() {
            const fields = [this.$refs.name, this.$refs.date, this.$refs.area];
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
    }
});
app.mount("#app");






