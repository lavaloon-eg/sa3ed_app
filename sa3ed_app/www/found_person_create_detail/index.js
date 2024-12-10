var app = Vue.createApp({
    delimiters: ['[[', ']]'], // Change delimiters here
    data() {
        frappe.call({
            method:"sa3ed_app.api.WhitelistBypass.get_country_list",
            callback: function(result) { 
                message = result.message;
                var select = document.getElementById("country_select");
                for (let index in message) {
                    const country = message[index];
                    if (typeof country !== "object") {
                    } else {
                        var option = document.createElement("option")
                        option.value = country.name;
                        option.innerHTML = country.name;
                        select.append(option);
                    }
                }
            },
        })
        return {
            foundpername:'',
            perdate:'', // brith of baby
            foundperloca:'',
            foundperdate:'',
            selectedGender: '',// This will hold the selected gender value 
            selectedStatus:'', // status of this child
            country:'',
            city:'',
            found_address_line:'',
            notes:'',
            notesloc:'',
        }
    },
    methods:{
        btnevent() {
            const isBirthdateValid = this.validateBirthdate();
            const isfounddateValid = this.validatefounddate();
            if( !(isBirthdateValid && isfounddateValid) ) {
                return;
            }   
            if(this.found_address_line!=''&&this.city!=''&&this.foundpername != '' && this.perdate != '' &&  this.foundperdate != '' && this.selectedGender != '' && this.country !='' && this.selectedStatus != '')  {
                window.localStorage.setItem('fndfirst_name',this.foundpername);
                window.localStorage.setItem('found_date',this.foundperdate);
                window.localStorage.setItem('fndbirthdate',this.perdate)
                window.localStorage.setItem('fndgender',this.selectedGender)
                window.localStorage.setItem('fndstatus',this.selectedStatus)
                window.localStorage.setItem('fndcountry',this.country)
                window.localStorage.setItem('fndnotes',this.notes)
                window.localStorage.setItem('fndcity',this.city)
                let found_address_obj = {
                    title:"test",
                    address_type:"",
                    city:this.city,
                    country:this.country,
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
    }
})
app.mount("#app")
