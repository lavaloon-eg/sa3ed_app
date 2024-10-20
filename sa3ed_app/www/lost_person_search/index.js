function get_lost_person_list(search_criteria={}){
    let args = {};
    for (const key in search_criteria) {
        if (search_criteria.hasOwnProperty(key)) {
            args[key] = search_criteria[key];
        }
    }
    //TODO: map search_criteria to args
    run_api(method="sa3ed_app.api.LostPersonEndPoints.get_lost_persons",
                    type= "GET".
                    async = false,
                    args = JSON.stringify(args),
                    function_render_response = render_response_get_lost_person_list
            );
}

function render_response_get_lost_person_list(response){
    const label = document.getElementById("div_test_response");
    label.innerHTML = response['error_message'];
}

//TODO: this is a temp code to be replaced by the final code of handling UI
document.addEventListener("DOMContentLoaded", (event) => {
    get_lost_persons_list();
    });


