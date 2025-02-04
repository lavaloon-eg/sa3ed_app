function UserSearch() {
    document.getElementById("resultdiv").innerHTML = "";
    document.getElementById("buttondiv").innerHTML = "";
    document.getElementById("err").innerHTML = "";
    var input = document.getElementById("searchbar").value;
    document.getElementById("searchbar").value = "";
    if ((input.toString()).trim() == "") {
        document.getElementById("err").className = "err";
        document.getElementById("err").innerHTML = "ادخل قيمة للبحث";
    } else {
        frappe.call({
            method: "sa3ed_app.api.user_search.search_people",
            args: {input:input},
            callback: function(result) {            
                let message = result.message;
                let data = message.data;
                if (message.statuscode != 200) {
                    console.error(data)
                    document.getElementById("err").className("err");
                    document.getElementById("err").innerHTML = "هناك خطء في عملية البحث";
                } else {
                    let lost_people = data.lost_people;
                    let found_people = data.found_people;
                    if (lost_people.length == 0 && found_people.length == 0) {
                        document.getElementById("err").className = "message";
                        document.getElementById("err").innerHTML = "ليس هناك شيء متتابق للبحث";
                    } else {
                        if (lost_people.length == 0) {
                        } else {
                            let lost_button = document.createElement("button");
                            lost_button.id = "lost_button";
                            lost_button.className = "btn btn-primary mx-1";
                            lost_button.type = "button";
                            lost_button.onclick = show_lost_people;
                            lost_button.innerHTML = "Lost People";
                            document.getElementById("buttondiv").append(lost_button);
                            document.getElementById("lost_button").focus();
                            let lost_people_div = document.createElement("div");
                            lost_people_div.id = "lost_people_div";
                            let i = 0;
                            for (let index in lost_people) {
                                let person = lost_people[index];
                                if (typeof person !== "object") {
                                } else {
                                    i++
                                    let div = document.createElement("div");
                                    div.className = "person";
                                    div.innerHTML = "<h4>Lost Case " + (Number(index) + 1) + " of " + lost_people.length + "</h4>";
                                    for (const key in person) {
                                        if (key == "pic"){
                                            let img = document.createElement("img");
                                            let src = person[key];
                                            let alt;
                                            if (src == null) {
                                                src = "/static/img/miss.svg";
                                                alt = "No Photo Found"
                                            } else if (src == "") {
                                                src = "/static/img/miss.svg";
                                                alt = "No Photo Found"
                                            } else {
                                                let srcArray = src.split("/");
                                                alt = srcArray.pop();
                                            }
                                            img.src = src;
                                            img.alt = alt;
                                            img.className = "rounded mx-auto d-block";
                                            img.style.width = "35%";
                                            div.append(img);
                                        } else {
                                            let value = person[key];
                                            let text = document.createElement("p");
                                            let keytext = key.replaceAll("_"," ");
                                            let capitalkey = keytext.at(0).toUpperCase();
                                            keytext = keytext.replace(keytext.at(0), capitalkey);
                                            if (value == null) {
                                                value = "N/A"
                                            } else if (value == "") {
                                                value = "N/A"
                                            }
                                            if (key == "creation") {
                                                let dateArray = value.split(" ");
                                                value = dateArray[0];
                                            }
                                            if (key == "name") {
                                                keytext = "ID";
                                            }
                                            text.innerHTML = keytext + ": " + value;
                                            div.append(text);
                                        }
                                    }
                                    if (i == 4) {
                                        let show_button = document.createElement("button")
                                        show_button.id = "show_lost_button";
                                        show_button.className = "btn btn-primary mx-1";
                                        show_button.type = "button";
                                        show_button.onclick = show_more;
                                        show_button.innerHTML = "Show More";
                                        lost_people_div.append(show_button)
                                    } if (i > 3) {
                                       div.classList.add("showmore");
                                       div.style.display = "none";
                                    }
                                    lost_people_div.append(div);
                                }
                            }
                            document.getElementById("resultdiv").append(lost_people_div);
                        }
                        if (found_people.length == 0) {
                        } else {
                            let found_button = document.createElement("button");
                            found_button.id = "found_button";
                            found_button.className = "btn btn-primary mx-1";
                            found_button.type = "button";
                            found_button.onclick = show_found_people;
                            found_button.innerHTML = "Found People";
                            document.getElementById("buttondiv").append(found_button);
                            let found_people_div = document.createElement("div");
                            found_people_div.id = "found_people_div";
                            found_people_div.style.display = "none";
                            let i = 0;
                            for (let index in found_people) {
                                let person = found_people[index];
                                if (typeof person !== "object") {
                                } else {
                                    i++
                                    let div = document.createElement("div");
                                    div.className = "person";
                                    div.innerHTML = "<h4>Found Case " + (Number(index) + 1) + " of " + found_people.length + "</h4>";
                                    for (const key in person) {
                                        if (key == "pic"){
                                            let img = document.createElement("img");
                                            let src = person[key];
                                            let alt;
                                            if (src == null) {
                                                src = "/static/img/miss.svg";
                                                alt = "No Photo Found"
                                            } else if (src == "") {
                                                src = "/static/img/miss.svg";
                                                alt = "No Photo Found"
                                            } else {
                                                let srcArray = src.split("/");
                                                alt = srcArray.pop();
                                            }
                                            img.src = src;
                                            img.alt = alt;
                                            img.className = "rounded mx-auto d-block";
                                            img.style.width = "35%";
                                            div.append(img);
                                        } else {
                                            let value = person[key];
                                            let text = document.createElement("p");
                                            let keytext = key.replaceAll("_"," ");
                                            let capitalkey = keytext.at(0).toUpperCase();
                                            keytext = keytext.replace(keytext.at(0), capitalkey);
                                            if (value == null) {
                                                value = "N/A"
                                            } else if (value == "") {
                                                value = "N/A"
                                            }
                                            if (key == "creation") {
                                                let dateArray = value.split(" ");
                                                value = dateArray[0];
                                            }
                                            if (key == "name") {
                                                keytext = "ID";
                                            }
                                            text.innerHTML = keytext + ": " + value;
                                            div.append(text);
                                        }
                                    }
                                    if (i == 4) {
                                        let show_button = document.createElement("button")
                                        show_button.id = "show_found_button";
                                        show_button.className = "btn btn-primary mx-1";
                                        show_button.type = "button";
                                        show_button.onclick = show_more;
                                        show_button.innerHTML = "Show More";
                                        found_people_div.append(show_button)
                                    } if (i > 3) {
                                       div.classList.add("showmore");
                                       div.style.display = "none";
                                    }
                                    found_people_div.append(div);
                                }
                            }
                            document.getElementById("resultdiv").append(found_people_div);
                        }
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

function show_lost_people(){
    if (document.getElementById("resultdiv").innerHTML != "") {
        document.getElementById("lost_button").focus();
        document.getElementById("found_button").blur();
        document.getElementById("lost_people_div").style.display = "block";
        document.getElementById("found_people_div").style.display = "none";
        document.getElementById("show_lost_button").style.display = "inline-block";
        let hiddendivs = document.getElementsByClassName("showmore");
        for (let index in hiddendivs) {
            let div = hiddendivs[index]
            div.style.display = "none";
        }
    }
}

function show_found_people() {
    if (document.getElementById("resultdiv").innerHTML != "") {
        document.getElementById("found_button").focus();
        document.getElementById("lost_button").blur();
        document.getElementById("found_people_div").style.display = "block";
        document.getElementById("lost_people_div").style.display = "none";
        document.getElementById("show_found_button").style.display = "inline-block";
        let hiddendivs = document.getElementsByClassName("showmore");
        for (let index in hiddendivs) {
            let div = hiddendivs[index]
            div.style.display = "none";
        }
    }
}

function show_more() {
    if (document.getElementById("resultdiv").innerHTML != "") {
        document.getElementById("show_found_button").style.display = "none";
        document.getElementById("show_lost_button").style.display = "none";
        let hiddendivs = document.getElementsByClassName("showmore");
        for (let index in hiddendivs) {
            let div = hiddendivs[index]
            div.style.display = "block";
        }
    }
}