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
        document.getElementById('validationRules').textContent = 'Allowed file types: JPEG, JPG, PNG';
        return;
    }

    if (file_data_obj.size > maxSize) {
        document.getElementById('validationRules').textContent = 'File size exceeds 5MB';
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById('imagePreview').src = e.target.result;
        document.getElementById('imagePreview').style.display = 'block';
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
    //debugger;
    const response_obj = args[0];
    let data = null;
    if (data in response_obj){
        data = response_obj['data'];
    }
    document.getElementById('response_label').textContent = response_obj['error_message'];
    ControlSubmission(is_disabled=false);
}

const convert_file_to_object = (file) => {
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
    //file_data_obj = convert_file_to_object(file_data_obj);
    const file_data_obj = document.getElementById("UploadImage").files[0];
    if (!file_data_obj) {
        alert('Please select a file.');
        return;
    }
    debugger;
    args = {
    'args_obj': {
         'pic': file_data_obj,
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