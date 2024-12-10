function get_lost_person_list(search_criteria={}){
    document.getElementById("err").innerHTML = "";
    let args = {};
    for (const key in search_criteria) {
        if (search_criteria.hasOwnProperty(key)) {
            args[key] = search_criteria[key];
        }
    }
    frappe.call({
        method: "sa3ed_app.api.LostPersonEndPoints.get_lost_persons",
        args: {args_obj:args},
        callback: function(result) {
            var err = document.getElementById("err");
            var message = result.message;
            var data = message.data;
            if (message.data.length == 0) {
                err.innerHTML = "لا يوجد اشخاص مفقودين";
            } else {
                var container = document.createElement("ul");
                container.className = "col";
                for (let index in data) {
                    var lost_person = data[index];
                    var div = document.createElement("li");
                    div.className = "person";
                    div.innerHTML = "<h4>" + "Lost Person " + (Number(index) + 1) + " of " + data.length + "</h4>"
                    var nested_list = document.createElement("ul");
                    for (const key in lost_person) {
                        let value = lost_person[key];
                        let list_item = document.createElement("li");
                        let text = document.createElement("p");
                        var keytext = key.replaceAll("_"," ");
                        let capitalkey = keytext.at(0).toUpperCase();
                        keytext = keytext.replace(keytext.at(0), capitalkey);
                        text.innerHTML = keytext + ": " + value;
                        list_item.append(text);
                        nested_list.append(list_item);
                        div.append(nested_list);
                    }
                    container.append(div);
                    document.getElementById("container").append(container);
                }
            }
        }
    });
}

//TODO: this is a temp code to be replaced by the final code of handling UI
document.addEventListener("DOMContentLoaded", (event) => {
    get_lost_person_list();
    });


