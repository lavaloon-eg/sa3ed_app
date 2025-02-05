const lost_person_form_2_app = Vue.createApp({
    delimiters: ['[[', ']]'],
    data() {
        return {
            city: '',
            home_address_line: '',
            selected_country: '',
            notes: '',
            errors: {
                city: false,
                home_address_line: false,
                country: false,
            },
            countries: this.get_countries()
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
                country: !this.selected_country,
            };
            return !Object.values(this.errors).some(error => error);
        },
        btn_event() {
            if (this.validate_form()) {
                if (this.home_address_line != '' && this.city != '' && this.selected_country != '') {
                    let home_address_object = {
                        title: 'test',
                        city: this.city,
                        country: this.selected_country,
                        address_type: 'Home',
                        address_line_1: this.home_address_line,
                        notes: this.notes,
                        address_line_2: '',
                        postal_code: ''
                    }
                    window.localStorage.setItem('home_address', JSON.stringify(home_address_object))
                    window.location.pathname = '/lost_person_create_detail_3'
                } else {
                    Swal.fire({
                        title: 'يرجي ادخال البيانات',
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
            const refs = [this.$refs.name, this.$refs.date, this.$refs.loc, this.$refs.lost_date].filter(ref => ref);
            const btn = this.$refs.btn;
            refs.forEach(ref => ref.value !== '' ? (ref.style.borderBottom = '1px solid #0ACCAD', btn.style.backgroundColor = '#053B4F') : null);
        },
        back_to_prev() {
            window.history.back();
        }
    }
})
lost_person_form_2_app.mount("#lost_person_form_2")
