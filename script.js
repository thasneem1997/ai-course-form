//it set that when pressing the enterkey the generate content function is called
document.getElementById('title').addEventListener('keypress', function(event) {
    if (event.keyCode === 13) { // 13 is the Enter key
        event.preventDefault(); // Prevent the default action for Enter key
        document.getElementById('generateContent').click(); // Programmatically click the button
    }
});

//to increase the text area size according to the content
function adjustTextAreaHeight(textArea) {
    // Set its height to 'auto' to get the correct scrollHeight
    textArea.style.height = 'auto';
    // Set its height to the scrollHeight plus a little extra space
    textArea.style.height = (textArea.scrollHeight + 5) + 'px';
}

//we get the course title and trim the white space
document.getElementById('generateContent').addEventListener('click', function() {
    var courseTitle = document.getElementById('title').value.trim();
    if (!courseTitle) {//if there is no course title is given then alert displays
        alert('Please enter a course title.');
        return;
    }

    var button = this; // Reference to the button itself
    button.disabled = true;
    button.textContent = 'Generating...';// the generating.. content displays before generating

    var xhr = new XMLHttpRequest();//XMLHttpRequest object is  created
    xhr.open('POST', 'generate_content.php', true);//initailizing the request(we can set it as post/get:post when sending a data to server and get to retrive data from server)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');//set the request header
    xhr.onload = function() {//after the sucessfully completing the request what should do
        button.disabled = false;
        button.textContent = 'Generate AI Content';

        if (this.status === 200) {//check the request is succeesful
            try {
                var response = JSON.parse(this.responseText);//it convert the json into javascript object then that value is stored to variable response
                document.getElementById('shortDesc').innerHTML = response.shortDesc.replace(/\*\*(.*?)\*\*/g, '$1') || 'No short description provided.';
                document.getElementById('outcomes').innerHTML = response.outcomes.replace(/\*\*(.*?)\*\*/g, '$1') || 'No outcomes provided.';
                document.getElementById('requirements').innerHTML = response.requirements.replace(/\*\*(.*?)\*\*/g, '$1') || 'No requirements provided.';
                document.getElementById('courseDesc').innerHTML = response.courseDesc.replace(/\*\*(.*?)\*\*/g, '$1') || 'No course description provided.';
                adjustTextAreaHeight(document.getElementById('shortDesc'));//to adjuest the text area
                adjustTextAreaHeight(document.getElementById('outcomes'));
                adjustTextAreaHeight(document.getElementById('requirements'));
                adjustTextAreaHeight(document.getElementById('courseDesc'));
            } catch (e) {//if there is error in parsing
                console.error("Error parsing response: ", e);
                alert('Error parsing response. See console for details.');
            }
        } else {//if there is error in server responsee
            console.error("Server responded with status: ", this.status);
            alert('Error: ' + this.responseText);
        }
    };
    xhr.onerror = function() {//action to do when there is error in xhr
        button.disabled = false;
        button.textContent = 'Generate AI Content';
        console.error("Request failed");
        alert('Request failed. Check console for details.');
    };
    xhr.send('title=' + encodeURIComponent(courseTitle));
});
