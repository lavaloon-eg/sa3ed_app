const found_person_form_app = Vue.createApp({
    delimiters: ['[[', ']]'],
    data() {
        return {
            foundpername:'',
            perdate:'',
            foundperloca:'',
            foundperdate:'',
            selectedGender: '', 
            selectedStatus:'',
            selected_country:'',
            city:'',
            found_address_line:'',
            notes:'',
            notesloc:'',
            errors: {
                name: false,
                birthDate: false,
                city: false,
                addressLine: false,
                foundDate: false,
                gender: false,
                status: false,
                country: false
            },
            countries: [],
        }
    },
    methods:{
        async getCountries() {
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
        getCurrentDate() {
            return new Date().toISOString().split('T')[0];
        },
        validateForm() {
            this.errors = {
                name: !this.foundpername || this.foundpername.length < 3,
                birthDate: !this.perdate,
                city: !this.city || this.city.length < 2,
                addressLine: !this.found_address_line || !/^[0-9]+$/.test(this.found_address_line),
                foundDate: !this.foundperdate,
                gender: !this.selectedGender,
                status: !this.selectedStatus,
                country: !this.selected_country
            };
    
            return !Object.values(this.errors).some(error => error);
        },
        btnevent() {
            if (this.validateForm()) {
                const isBirthdateValid = this.validateBirthdate();
                const isfounddateValid = this.validatefounddate();
                if( !(isBirthdateValid && isfounddateValid) ) {
                    return;
                }   
                if(this.found_address_line!=''&&this.city!=''&&this.foundpername != '' && this.perdate != '' &&  this.foundperdate != '' && this.selectedGender != '' && this.selected_country !='' && this.selectedStatus != '')  {
                    window.localStorage.setItem('fndfirst_name',this.foundpername);
                    window.localStorage.setItem('found_date',this.foundperdate);
                    window.localStorage.setItem('fndbirthdate',this.perdate)
                    window.localStorage.setItem('fndgender',this.selectedGender)
                    window.localStorage.setItem('fndstatus',this.selectedStatus)
                    window.localStorage.setItem('fndcountry',this.selected_country)
                    window.localStorage.setItem('fndnotes',this.notes)
                    window.localStorage.setItem('fndcity',this.city)
                    let found_address_obj = {
                        title:"test",
                        address_type:"",
                        city:this.city,
                        country:this.selected_country,
                        address_line_1:this.found_address_line,
                        notes:this.notesloc,
                        address_line_2:"",
                        postal_code:""
                    }
                    if(this.selectedStatus == 'Seen') {
                        found_address_obj.address_type = "Seen Place"
                    } else {
                            found_address_obj.address_type = "Hospitality Address"
                        }
                        window.localStorage.setItem('found_address',JSON.stringify(found_address_obj));
                        window.location.pathname ='/found_person_create_detail_2'
                    } else {
                        Swal.fire({
                            title: 'يرجي ادخال البيانات',
                            text: '',
                            icon: 'error',
                            confirmButtonText: 'خطا'
                        });
                    }
            }else{
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        },
        changeline() {
            if(this.$refs.name.value != '') {
                this.$refs.name.style.borderBottom = '1px solid #0ACCAD'
                this.$refs.btn.style.backgroundColor = '#053B4F'
            }
            if(this.$refs.date.value != '') {
                this.$refs.date.style.borderBottom = '1px solid #0ACCAD'
                this.$refs.btn.style.backgroundColor = '#053B4F'
            } 
            if(this.$refs.loc.value != '') {
                this.$refs.loc.style.borderBottom = '1px solid #0ACCAD'
                this.$refs.btn.style.backgroundColor = '#053B4F'
            }
            if(this.$refs.founddate.value != '') {
                this.$refs.founddate.style.borderBottom = '1px solid #0ACCAD'
                this.$refs.btn.style.backgroundColor = '#053B4F'
            } 
        },
        validateBirthdate() {
            const birthdate = this.perdate;
            
            if (new Date(birthdate) > new Date()) {
                Swal.fire({
                    title: 'تاريخ الميلاد يجب ان يكون اصغر من او يساوي تاريخ اليوم',
                    text: '',
                    icon: 'error',
                    confirmButtonText: 'خطا'
                });
                return false;
            } else {
                return true;
            }
        },
        validatefounddate() {
            const founddate = this.foundperdate;
            if (new Date(founddate) > new Date()) {
                Swal.fire({
                    title: 'تاريخ الفقدان يجب ان يكون اصغر من او يساوي تاريخ اليوم',
                    text: '',
                    icon: 'error',
                    confirmButtonText: 'خطا'
                });
                return false;
            } else if(new Date(this.perdate) >= new Date(founddate)){
                Swal.fire({
                    title: 'تاريخ الفقدان يجب ان يكون اكبر من او يساوي تاريخ الميلاد',
                    text: '',
                    icon: 'error',
                    confirmButtonText: 'خطا'
                });                
                return false;
            }
            else {
                return true;
            }
        },
        back_to_prev() {
            window.history.back();
        }
    },
    mounted() {
        this.getCountries();
    }
})

found_person_form_app.mount("#found_person_form")