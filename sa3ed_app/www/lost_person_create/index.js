function OpenFileBrowser() {
    $('#UploadImage').click();
}

function ControlSubmission(is_disabled){
    $("#SubmitImage").attr("disabled", true);
    $("#ProgressBar").attr("hidden", !is_disabled);
}

document.getElementById("UploadImage").onchange = function () {
    if (this.value) {
        document.getElementById("SubmitImage").disabled = false;
    }

    const file_data_obj = this.files[0];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 1 * 1024 * 1024;

    if (!allowedTypes.includes(file_data_obj.type)) {
        display_alert_with_timeout(msg="Allowed file types: JPEG, JPG, PNG", type="danger");
        return;
    }

    if (file_data_obj.size > maxSize) {
        display_alert_with_timeout(msg="File size exceeds 5MB", type="danger");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById('imagePreview').src = e.target.result;
    };
    reader.readAsDataURL(file_data_obj);
}


function run_progress_bar(){
    var xhr = new window.XMLHttpRequest();

    xhr.upload.addEventListener("progress", function (evt) {
        if (evt.lengthComputable) {
            var percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);
            $('.progress-bar').width(percentComplete + '%');
            $('.progress-bar').html(percentComplete + '%');
        }
    }, false);

    return xhr;
}

function render_response_create_lost_person_case(...args){
    const response_obj = args[0];
    let data = null;
    if ("data" in response_obj){
        data = response_obj['data'];
        display_alert_with_timeout(msg=`lost_person_case_id: ${data['lost_person_case_id']}`, type="success", timeout=3000);
    }
    else
    {
        display_alert_with_timeout(msg=response_obj['error_message'], type="danger", timeout=3000);
        ControlSubmission(is_disabled=false);
    }
}

function convert_file_to_object(file){
    return {
        lastModified: file.lastModified,
        lastModifiedDate: file.lastModifiedDate,
        name: file.name,
        size: file.size,
        type: file.type,
        webkitRelativePath: file.webkitRelativePath
    };
};

document.getElementById("SubmitImage").onclick = function (evt) {
    evt.preventDefault();
    ControlSubmission(is_disabled=true);
    let args = {};
    const file = document.getElementById("UploadImage").files[0];
    const file_data_obj = convert_file_to_object(file);
    if (!file) {
        alert('Please select a file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const pic_base64Image = event.target.result;
        args = {
            'args_obj': {
                 'pic': {'pic_base64Image': pic_base64Image,'file_data_obj': file_data_obj},
                 'first_name': "Ahmed",
                 'middle_name': "Mohamed",
                 'last_name': "Ali",
                 'gender': "Male",
                 'nationality': "Egypt",
                 'birthdate': "1980-01-01",
                 'lost_date': "2024-01-01",
                 'phone_1': "+2012345678",
                 }
                }
        run_api(method="sa3ed_app.api.LostPersonEndPoints.create_lost_person_case",
                type= "POST",
                async = false,
                args = args,
                function_render_response = render_response_create_lost_person_case
            );
    };
    reader.readAsDataURL(file);
};

function display_alert_with_timeout(msg, type, timeout=3000) {
    setTimeout(() => {
        $('#validationRules').text(msg).removeClass("hide").addClass("alert-" + type);
    }, timeout);
}