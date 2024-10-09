function followUpCase() {
    var caseID = document.getElementById('caseID').value;

    if (!caseID) {
        document.getElementById('statusMessage').innerHTML = '<p class="text-danger">من فضلك أدخل رقم الحالة.</p>';
        return;
    }

    document.getElementById("SearchCaseButton").disabled = true;
    document.getElementById("ProgressBar").hidden = false;

    frappe.call({
        method: 'sa3ed_app.api.CaseStatus.follow_up_case',  
        args: { case_id: caseID },
        callback: function(response) {
            document.getElementById("SearchCaseButton").disabled = false;
            document.getElementById("ProgressBar").hidden = true;

            if (response.message && response.message.case_status) {
                document.getElementById('statusMessage').innerHTML = '<p class="text-success">الحالة: ' + response.message.case_status + '</p>';
            } else if (response.message && response.message.error) {
                document.getElementById('statusMessage').innerHTML = '<p class="text-danger">' + response.message.error + '</p>';
            } else {
                document.getElementById('statusMessage').innerHTML = '<p class="text-danger">لم يتم العثور على الحالة.</p>';
            }
        },
        error: function(error) {
            document.getElementById("SearchCaseButton").disabled = false;
            document.getElementById("ProgressBar").hidden = true;
            document.getElementById('statusMessage').innerHTML = '<p class="text-danger">حدث خطأ أثناء التحقق من الحالة.</p>';
        }
    });
}
