function UserSearch() {
    document.getElementById("resultdiv").innerHTML = "";
    var input = document.getElementById("searchbar").value;
    document.getElementById("searchbar").value = "";
    if ((input.toString()).trim() == "") {
        document.getElementById("err").className = "err";
        document.getElementById("err").innerHTML = "ادخل قيمة للبحث";
    } else {
        frappe.call({
            method: "sa3ed_app.api.UserSearch.search_people",
            args: {input:input},
            callback: function(result) {            
                message = result.message;
                if (message.length == 0) {
                    document.getElementById("err").className = "message";
                    document.getElementById("err").innerHTML = "ليس هناك شيء متتابق للبحث";
                } else {
                    for (let index in message) {
                        var person = message[index];
                        var div = document.createElement("div");
                        div.className = "person";
                        div.innerHTML = "<h4>Result " + (Number(index) + 1) + " of " + message.length + "</h4>";
                        for (const key in person) {
                            var value = person[key];
                            if (value == null) {
                            } else if (value == "") {
                            } else {
                                var text = document.createElement("p");
                                var keytext = key.replaceAll("_"," ");
                                let capitalkey = keytext.at(0).toUpperCase();
                                keytext = keytext.replace(keytext.at(0), capitalkey);
                                text.innerHTML = keytext + ": " + value;
                                div.append(text);
                            }
                        }
                        document.getElementById("resultdiv").append(div)
                    }  
                }
            },
            error: function(error) {
                    document.getElementById("err").className("err");
                document.getElementById("err").innerHTML = "هناك خطء في عملية البحث";
            }
        });
    }
} 