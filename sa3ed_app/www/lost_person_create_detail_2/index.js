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
            cityperloca:'',
            home_address_line:'',
            // homeperloca:'',// home address
            country:'',
            notesloc:'',
        }
    },
    methods:{
        btnevent() {
            
            if(this.home_address_line!=''&& this.notesloc!= ''&& this.cityperloca != ''   && this.country !='')  {
                let home_address_object = {
                    title:'test',
                    city:this.cityperloca,
                    country:this.country,
                    address_type:'Home',
                    address_line_1:this.home_address_line,
                    notes:this.notesloc,
                    address_line_2:  '', // إذا كانت هذه الحقول غير موجودة، أرسل قيمة فارغة
                    postal_code: ''
                }
                window.localStorage.setItem('home_address',JSON.stringify(home_address_object))
                window.location.pathname ='/lost_person_create_detail_3'
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
        }
    }
})
app.mount("#app")
