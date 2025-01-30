const search_form_app = Vue.createApp({
    delimiters: ['[[', ']]'],
    data() {
        return {
            case_id: "",
            res_list: [],
            error: false,
            show_results: false
        }
    },
    methods: {
        back_to_prev() {
            window.history.back();
        },
        search() {
            if (!this.case_id) {
                this.error = true;
                return;
            }

            frappe.call({
                method: "sa3ed_app.api.user_search.get_matched_cases",
                args: {
                    case_id: this.case_id
                },
                callback: (r) => {
                    if (r.message.status_code == 200) {
                        this.res_list = r.message.data;
                        this.show_results = true;
                    } else {
                        this.res_list = [];
                        this.show_results = true;
                    }
                }
            })
        },
        reset_search() {
            this.case_id = "";
            this.res_list = [];
            this.error = false;
            this.show_results = false;
        }
    }
});

search_form_app.mount("#search_form");
