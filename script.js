const myinput = document.getElementById("myinput");
const btnCopy = document.getElementById("btnCopy");
const discon = document.getElementById("discon");
const display = document.getElementById("display");

btnCopy.onclick = function () {
    // Step-1: Select the text
    myinput.select();
    // Step-2: Copying the text
    document.execCommand("copy");
    
    // Fetching data and saving to MongoDB
    const textToCopy = myinput.value;
    fetch('http://localhost:3000/saveData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: textToCopy }),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));

    // Alert moved outside the fetch block
    alert("Copied to clipboard");
};

display.onclick = function () {
    let text = document.getElementById("myinput").value;
    document.getElementById("discon").value = "" + text;
};
