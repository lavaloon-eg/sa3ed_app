document.getElementById('foundPersonForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the form from submitting the traditional way
    
    // Create a new FormData object, which automatically captures all form inputs
    let formData = new FormData(this);  
    
    // Use fetch API to send a POST request to the Frappe server
    fetch('/api/method/path.to.your.create_founded_person.api', {
        method: 'POST',  // Make sure the API expects a POST request
        body: formData,  // Send form data
    })
    .then(response => response.json())  // Parse the JSON response
    .then(data => {
        // Handle the response from the server
        if (data.message === 'success') {
            document.getElementById('responseMessage').textContent = "Found Person created successfully!";
        } else {
            document.getElementById('responseMessage').textContent = "Error: " + data.message;
        }
    })
    .catch(error => {
        // Handle any errors that occur during the fetch request
        document.getElementById('responseMessage').textContent = "Request failed: " + error.message;
    });
});
