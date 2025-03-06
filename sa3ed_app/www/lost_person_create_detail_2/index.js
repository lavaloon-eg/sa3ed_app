const lost_person_form_2_app = Vue.createApp({
    delimiters: ['[[', ']]'],
    data() {
        return {
            city: '',
            home_address_line: '',
            country: '',
            errors: {
                city: false,
                home_address_line: false,
                country: false,
            },
            countries: []
        }
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
            this.errors = {
                city: !this.city,
                home_address_line: !this.home_address_line,
                country: !this.country,
            };
            return !Object.values(this.errors).some(error => error);
        },
        btn_event() {
            if (!this.validate_form()) {
                Swal.fire({
                    title: 'يرجي ادخال البيانات',
                    icon: 'error',
                    confirmButtonText: 'خطا'
                });
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            const home_address_object = {
                title: `${this.home_address_line?.toString() || ''}-${this.city?.toString() || ''}-${this.country?.toString() || ''}`,
                city: this.city,
                country: this.country,
                address_type: 'Home',
                address_line_1: this.home_address_line,
                address_line_2: '',
                postal_code: ''
            };

            window.localStorage.setItem('home_address', JSON.stringify(home_address_object));
            window.location.pathname = '/lost_person_create_detail_3';
        },
        change_line() {
            const refs = [this.$refs.city, this.$refs.address].filter(ref => ref);
            const btn = this.$refs.btn;
            refs.forEach(ref => ref.value !== '' ? (ref.style.borderBottom = '1px solid #0ACCAD', btn.style.backgroundColor = '#053B4F') : null);
        },
        back_to_prev() {
            window.history.back();
        }
    },
    mounted() {
        this.get_countries()
    }
})
lost_person_form_2_app.mount("#lost_person_form_2")
