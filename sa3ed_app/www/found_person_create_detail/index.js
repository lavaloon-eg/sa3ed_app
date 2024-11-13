var app = Vue.createApp({
    delimiters: ['[[', ']]'], // Change delimiters here
    data() {
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
            countries : [
                { code: 'AF', name: 'Afghanistan' },
                { code: 'AL', name: 'Albania' },
                { code: 'DZ', name: 'Algeria' },
                { code: 'AS', name: 'American Samoa' },
                { code: 'AD', name: 'Andorra' },
                { code: 'AO', name: 'Angola' },
                { code: 'AI', name: 'Anguilla' },
                { code: 'AQ', name: 'Antarctica' },
                { code: 'AG', name: 'Antigua and Barbuda' },
                { code: 'AR', name: 'Argentina' },
                { code: 'AM', name: 'Armenia' },
                { code: 'AW', name: 'Aruba' },
                { code: 'AU', name: 'Australia' },
                { code: 'AT', name: 'Austria' },
                { code: 'AZ', name: 'Azerbaijan' },
                { code: 'BS', name: 'Bahamas' },
                { code: 'BH', name: 'Bahrain' },
                { code: 'BD', name: 'Bangladesh' },
                { code: 'BB', name: 'Barbados' },
                { code: 'BY', name: 'Belarus' },
                { code: 'BE', name: 'Belgium' },
                { code: 'BZ', name: 'Belize' },
                { code: 'BJ', name: 'Benin' },
                { code: 'BM', name: 'Bermuda' },
                { code: 'BT', name: 'Bhutan' },
                { code: 'BO', name: 'Bolivia' },
                { code: 'BQ', name: 'Bonaire, Sint Eustatius and Saba' },
                { code: 'BA', name: 'Bosnia and Herzegovina' },
                { code: 'BW', name: 'Botswana' },
                { code: 'BV', name: 'Bouvet Island' },
                { code: 'BR', name: 'Brazil' },
                { code: 'IO', name: 'British Indian Ocean Territory' },
                { code: 'BN', name: 'Brunei Darussalam' },
                { code: 'BG', name: 'Bulgaria' },
                { code: 'BF', name: 'Burkina Faso' },
                { code: 'BI', name: 'Burundi' },
                { code: 'CV', name: 'Cabo Verde' },
                { code: 'KH', name: 'Cambodia' },
                { code: 'CM', name: 'Cameroon' },
                { code: 'CA', name: 'Canada' },
                { code: 'KY', name: 'Cayman Islands' },
                { code: 'CF', name: 'Central African Republic' },
                { code: 'TD', name: 'Chad' },
                { code: 'CL', name: 'Chile' },
                { code: 'CN', name: 'China' },
                { code: 'CX', name: 'Christmas Island' },
                { code: 'CC', name: 'Cocos (Keeling) Islands' },
                { code: 'CO', name: 'Colombia' },
                { code: 'KM', name: 'Comoros' },
                { code: 'CD', name: 'Congo, Democratic Republic of the' },
                { code: 'CG', name: 'Congo' },
                { code: 'CK', name: 'Cook Islands' },
                { code: 'CR', name: 'Costa Rica' },
                { code: 'HR', name: 'Croatia' },
                { code: 'CU', name: 'Cuba' },
                { code: 'CW', name: 'Curaçao' },
                { code: 'CY', name: 'Cyprus' },
                { code: 'CZ', name: 'Czechia' },
                { code: 'DK', name: 'Denmark' },
                { code: 'DJ', name: 'Djibouti' },
                { code: 'DM', name: 'Dominica' },
                { code: 'DO', name: 'Dominican Republic' },
                { code: 'EC', name: 'Ecuador' },
                { code: 'EG', name: 'Egypt' },
                { code: 'SV', name: 'El Salvador' },
                { code: 'GQ', name: 'Equatorial Guinea' },
                { code: 'ER', name: 'Eritrea' },
                { code: 'EE', name: 'Estonia' },
                { code: 'SZ', name: 'Eswatini' },
                { code: 'ET', name: 'Ethiopia' },
                { code: 'FK', name: 'Falkland Islands (Malvinas)' },
                { code: 'FO', name: 'Faroe Islands' },
                { code: 'FJ', name: 'Fiji' },
                { code: 'FI', name: 'Finland' },
                { code: 'FR', name: 'France' },
                { code: 'GF', name: 'French Guiana' },
                { code: 'PF', name: 'French Polynesia' },
                { code: 'TF', name: 'French Southern Territories' },
                { code: 'GA', name: 'Gabon' },
                { code: 'GM', name: 'Gambia' },
                { code: 'GE', name: 'Georgia' },
                { code: 'DE', name: 'Germany' },
                { code: 'GH', name: 'Ghana' },
                { code: 'GI', name: 'Gibraltar' },
                { code: 'GR', name: 'Greece' },
                { code: 'GL', name: 'Greenland' },
                { code: 'GD', name: 'Grenada' },
                { code: 'GP', name: 'Guadeloupe' },
                { code: 'GU', name: 'Guam' },
                { code: 'GT', name: 'Guatemala' },
                { code: 'GG', name: 'Guernsey' },
                { code: 'GN', name: 'Guinea' },
                { code: 'GW', name: 'Guinea-Bissau' },
                { code: 'GY', name: 'Guyana' },
                { code: 'HT', name: 'Haiti' },
                { code: 'HM', name: 'Heard Island and McDonald Islands' },
                { code: 'VA', name: 'Holy See' },
                { code: 'HN', name: 'Honduras' },
                { code: 'HK', name: 'Hong Kong' },
                { code: 'HU', name: 'Hungary' },
                { code: 'IS', name: 'Iceland' },
                { code: 'IN', name: 'India' },
                { code: 'ID', name: 'Indonesia' },
                { code: 'IR', name: 'Iran' },
                { code: 'IQ', name: 'Iraq' },
                { code: 'IE', name: 'Ireland' },
                { code: 'IM', name: 'Isle of Man' },
                { code: 'IL', name: 'Israel' },
                { code: 'IT', name: 'Italy' },
                { code: 'JM', name: 'Jamaica' },
                { code: 'JP', name: 'Japan' },
                { code: 'JE', name: 'Jersey' },
                { code: 'JO', name: 'Jordan' },
                { code: 'KZ', name: 'Kazakhstan' },
                { code: 'KE', name: 'Kenya' },
                { code: 'KI', name: 'Kiribati' },
                { code: 'KP', name: 'Korea, Democratic People\'s Republic of' },
                { code: 'KR', name: 'Korea, Republic of' },
                { code: 'KW', name: 'Kuwait' },
                { code: 'KG', name: 'Kyrgyzstan' },
                { code: 'LA', name: 'Lao People\'s Democratic Republic' },
                { code: 'LV', name: 'Latvia' },
                { code: 'LB', name: 'Lebanon' },
                { code: 'LS', name: 'Lesotho' },
                { code: 'LR', name: 'Liberia' },
                { code: 'LY', name: 'Libya' },
                { code: 'LI', name: 'Liechtenstein' },
                { code: 'LT', name: 'Lithuania' },
                { code: 'LU', name: 'Luxembourg' },
                { code: 'MO', name: 'Macao' },
                { code: 'MG', name: 'Madagascar' },
                { code: 'MW', name: 'Malawi' },
                { code: 'MY', name: 'Malaysia' },
                { code: 'MV', name: 'Maldives' },
                { code: 'ML', name: 'Mali' },
                { code: 'MT', name: 'Malta' },
                { code: 'MH', name: 'Marshall Islands' },
                { code: 'MQ', name: 'Martinique' },
                { code: 'MR', name: 'Mauritania' },
                { code: 'MU', name: 'Mauritius' },
                { code: 'YT', name: 'Mayotte' },
                { code: 'MX', name: 'Mexico' },
                { code: 'FM', name: 'Micronesia' },
                { code: 'MD', name: 'Moldova' },
                { code: 'MC', name: 'Monaco' },
                { code: 'MN', name: 'Mongolia' },
                { code: 'ME', name: 'Montenegro' },
                { code: 'MS', name: 'Montserrat' },
                { code: 'MA', name: 'Morocco' },
                { code: 'MZ', name: 'Mozambique' },
                { code: 'MM', name: 'Myanmar' },
                { code: 'NA', name: 'Namibia' },
                { code: 'NR', name: 'Nauru' },
                { code: 'NP', name: 'Nepal' },
                { code: 'NL', name: 'Netherlands' },
                { code: 'NC', name: 'New Caledonia' },
                { code: 'NZ', name: 'New Zealand' },
                { code: 'NI', name: 'Nicaragua' },
                { code: 'NE', name: 'Niger' },
                { code: 'NG', name: 'Nigeria' },
                { code: 'NU', name: 'Niue' },
                { code: 'NF', name: 'Norfolk Island' },
                { code: 'MP', name: 'Northern Mariana Islands' },
                { code: 'NO', name: 'Norway' },
                { code: 'OM', name: 'Oman' },
                { code: 'PK', name: 'Pakistan' },
                { code: 'PW', name: 'Palau' },
                { code: 'PS', name: 'Palestine, State of' },
                { code: 'PA', name: 'Panama' },
                { code: 'PG', name: 'Papua New Guinea' },
                { code: 'PY', name: 'Paraguay' },
                { code: 'PE', name: 'Peru' },
                { code: 'PH', name: 'Philippines' },
                { code: 'PN', name: 'Pitcairn' },
                { code: 'PL', name: 'Poland' },
                { code: 'PT', name: 'Portugal' },
                { code: 'PR', name: 'Puerto Rico' },
                { code: 'QA', name: 'Qatar' },
                { code: 'RE', name: 'Réunion' },
                { code: 'RO', name: 'Romania' },
                { code: 'RU', name: 'Russian Federation' },
                { code: 'RW', name: 'Rwanda' },
                { code: 'BL', name: 'Saint Barthélemy' },
                { code: 'KN', name: 'Saint Kitts and Nevis' },
                { code: 'LC', name: 'Saint Lucia' },
                { code: 'MF', name: 'Saint Martin (French part)' },
                { code: 'SX', name: 'Sint Maarten (Dutch part)' },
                { code: 'VC', name: 'Saint Vincent and the Grenadines' },
                { code: 'WS', name: 'Samoa' },
                { code: 'SM', name: 'San Marino' },
                { code: 'ST', name: 'Sao Tome and Principe' },
                { code: 'SA', name: 'Saudi Arabia' },
                { code: 'SN', name: 'Senegal' },
                { code: 'RS', name: 'Serbia' },
                { code: 'SC', name: 'Seychelles' },
                { code: 'SL', name: 'Sierra Leone' },
                { code: 'SG', name: 'Singapore' },
                { code: 'SX', name: 'Sint Maarten' },
                { code: 'SK', name: 'Slovakia' },
                { code: 'SI', name: 'Slovenia' },
                { code: 'SB', name: 'Solomon Islands' },
                { code: 'SO', name: 'Somalia' },
                { code: 'ZA', name: 'South Africa' },
                { code: 'GS', name: 'South Georgia and the South Sandwich Islands' },
                { code: 'SS', name: 'South Sudan' },
                { code: 'ES', name: 'Spain' },
                { code: 'LK', name: 'Sri Lanka' },
                { code: 'SD', name: 'Sudan' },
                { code: 'SR', name: 'Suriname' },
                { code: 'SJ', name: 'Svalbard and Jan Mayen' },
                { code: 'SZ', name: 'Sweden' },
                { code: 'CH', name: 'Switzerland' },
                { code: 'SY', name: 'Syrian Arab Republic' },
                { code: 'TW', name: 'Taiwan, Province of China' },
                { code: 'TJ', name: 'Tajikistan' },
                { code: 'TZ', name: 'Tanzania, United Republic of' },
                { code: 'TH', name: 'Thailand' },
                { code: 'TL', name: 'Timor-Leste' },
                { code: 'TG', name: 'Togo' },
                { code: 'TK', name: 'Tokelau' },
                { code: 'TO', name: 'Tonga' },
                { code: 'TT', name: 'Trinidad and Tobago' },
                { code: 'TN', name: 'Tunisia' },
                { code: 'TR', name: 'Turkey' },
                { code: 'TM', name: 'Turkmenistan' },
                { code: 'TC', name: 'Turks and Caicos Islands' },
                { code: 'TV', name: 'Tuvalu' },
                { code: 'UG', name: 'Uganda' },
                { code: 'UA', name: 'Ukraine' },
                { code: 'AE', name: 'United Arab Emirates' },
                { code: 'GB', name: 'United Kingdom' },
                { code: 'US', name: 'United States' },
                { code: 'UM', name: 'United States Minor Outlying Islands' },
                { code: 'VI', name: 'United States Virgin Islands' },
                { code: 'UY', name: 'Uruguay' },
                { code: 'UZ', name: 'Uzbekistan' },
                { code: 'VU', name: 'Vanuatu' },
                { code: 'VE', name: 'Venezuela' },
                { code: 'VN', name: 'Viet Nam' },
                { code: 'WF', name: 'Wallis and Futuna' },
                { code: 'EH', name: 'Western Sahara' },
                { code: 'YE', name: 'Yemen' },
                { code: 'ZM', name: 'Zambia' },
                { code: 'ZW', name: 'Zimbabwe' }
            ],
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