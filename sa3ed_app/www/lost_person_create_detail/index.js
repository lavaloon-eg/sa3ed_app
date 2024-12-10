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
            lostpername:'',
            perdate:'',
            cityperloca:'',
            lost_address_line:'',
            // homeperloca:'',// home address
            lostperdate:'',
            selectedGender: '',// This will hold the selected gender value 
            country:'',
            notes:'',
            notesloc:'',
        }
    },
    methods:{
        btnevent() {
            const isBirthdateValid = this.validateBirthdate();
            const isLostdateValid = this.validateLostdate();
            if( !(isBirthdateValid && isLostdateValid) ) {
                return;
            }   
            if(this.lost_address_line!=''&& this.notesloc!= ''&&this.lostpername != '' && this.perdate != '' && this.cityperloca != ''  && this.lostperdate != '' && this.selectedGender != '' && this.country !='')  {
                window.localStorage.setItem('first_name',this.lostpername);
                window.localStorage.setItem('lost_date',this.lostperdate);
                window.localStorage.setItem('birthdate',this.perdate)
                window.localStorage.setItem('gender',this.selectedGender)
                window.localStorage.setItem('country',this.country)
                window.localStorage.setItem('notes',this.notes)
                window.localStorage.setItem('notesloc',this.notesloc)
                window.localStorage.setItem('lost_addres_type','Lost Place');
                // send lost_address data os object
                let lost_address_object = {
                    title:'test',
                    city: (this.cityperloca).toString(),
                    country:(this.country).toString(),
                    address_type:'Lost Place',
                    address_line_1:this.lost_address_line.toString(),
                    notes:this.notesloc.toString(),
                    address_line_2: '', // إذا كانت هذه الحقول غير موجودة، أرسل قيمة فارغة
                    postal_code:  ''
                }
                window.localStorage.setItem('lost_address',JSON.stringify(lost_address_object))                
                window.location.pathname ='/lost_person_create_detail_2'
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
            if(this.$refs.lostdate.value != '') {
                this.$refs.lostdate.style.borderBottom = '1px solid #0ACCAD'
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
        validateLostdate() {
            const lostdate = this.lostperdate;
            if (new Date(lostdate) > new Date()) {
                Swal.fire({
                    title: 'تاريخ الفقدان يجب ان يكون اصغر من او يساوي تاريخ اليوم',
                    text: '',
                    icon: 'error',
                    confirmButtonText: 'خطا'
                });
                return false;
            } else if(new Date(this.perdate) >= new Date(lostdate)){
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
