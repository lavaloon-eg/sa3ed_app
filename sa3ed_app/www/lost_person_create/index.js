var file_data_obj = null;
function OpenFileBrowser() {
    $('#UploadImage').click();
}

document.getElementById("UploadImage").onchange = function () {
    if (this.value) {
        document.getElementById("SubmitImage").disabled = false;
    }

    file_data_obj = event.target.files[0];
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

    //Change imagePreview to uploaded photo
//    var src = URL.createObjectURL(this.files[0])
//    document.getElementById('imagePreview').src = src
}//Submit button is disabled until image is uploaded


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

function render_response_create_lost_person_case(){
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
    $("#SubmitImage").attr("disabled", true);
    $("#ProgressBar").attr("hidden", false);
    let args = {};
    file_data_obj = convert_file_to_object(file_data_obj);
    args = {
    'args_obj': {
         'pic': file_data_obj
         }
    }
    run_api(method="sa3ed_app.api.LostPersonEndPoints.create_lost_person_case",
                    type= "POST",
                    async = false,
                    args = args,
                    function_render_response = render_response_create_lost_person_case
               );
};