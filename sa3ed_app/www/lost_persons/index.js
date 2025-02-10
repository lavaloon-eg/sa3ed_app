const lost_persons_app = Vue.createApp({
    delimiters: ['[[', ']]'],
    data() {
        return {
            lost_persons: [],
            start_index: 0,
            page_limit: 3,
            selected_case: null
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
                    this.lost_persons.push(...res.message.data);
                    this.start_index += this.page_limit;
                }
            } catch (error) {
                console.error("Error fetching lost persons:", error);
            }
        },
        handle_window_scroll() {
            const near_bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;
            if (near_bottom) {
                this.get_lost_persons();
            }
        },
        toggle_details(match_id) {
            this.selected_case = this.selected_case === match_id ? null : match_id;
        }
    },
    mounted() {
        this.get_lost_persons();
        window.addEventListener('scroll', this.handle_window_scroll);
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.handle_window_scroll);
    }
});

lost_persons_app.mount("#lost_persons");
