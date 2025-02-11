const lost_persons_app = Vue.createApp({
    delimiters: ['[[', ']]'],
    data() {
        return {
            lost_persons: [],
            start_index: 0,
            page_limit: 3,
            selected_case: null,
            no_more_data: false
        }
    },
    methods: {
        back_to_prev() {
            window.history.back();
        },
        async get_lost_persons() {
            try {
                const res = await frappe.call({
                    method: "sa3ed_app.api.lost_person_endpoints.get_lost_persons",
                    freeze: true,
                    freeze_message: __("...تحميل المزيد"),
                    args: {
                        args_obj: JSON.stringify({
                            start_index: this.start_index,
                            page_limit: this.page_limit
                        })
                    }
                });
                if (res.message && res.message.status_code === 200) {
                    if (res.message.data.length > 0) {
                        this.lost_persons.push(...res.message.data);
                        this.start_index += this.page_limit;
                    } else {
                        this.no_more_data = true;
                    }
                } else {
                    this.no_more_data = true;
                }
            } catch (error) {
                console.error("Error fetching lost persons:", error);
            }
        },
        toggle_details(match_id) {
            this.selected_case = this.selected_case === match_id ? null : match_id;
        }
    },
    mounted() {
        this.get_lost_persons();
    }
});

lost_persons_app.mount("#lost_persons");
