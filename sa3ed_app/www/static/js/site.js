function run_api(method,type,async,args,function_render_response){
    frappe.call({
        method: method,
        type: type,
        async: async,
        args: args,
        success: (r) => {
            if (r.message.status_code == 200) {
                function_render_response ({"error_message": "", "data": r.message.data});
            }
            else {
                function_render_response({"error_message": r.message.message});
            }
        },
        error: (r) => {
            function_render_response({"error_message": r.message});
        }
    })
}

