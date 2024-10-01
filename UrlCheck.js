const urlInput = document.getElementById('urlInput'); // Type in the input box
const resultDiv = document.getElementById('result'); //Display if the URl is valid
const resultServerDiv = document.getElementById('resultServer'); //Display of the URL is file or a folder

let timeoutId;
// Initialize variables for server response
let fileResponse=0;
let folderResponse=0;
let unsure=0;

//Regular expressions to match the input patterns
const matchpattern = /^(https?:\/\/)?([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,6})(\/[^\s]*)?$/; // to check if URL is valid (Copied from Google)
const fileExtensionRegex = /\/[^\/]+\.[a-zA-Z0-9]+$/; // to check if URL is a file (Copied from Google)


//Dummy server simulating asynchronous behaviour
function DummyServerResponse(url) {
    console.log('Mock Server for URL:', url);
    console.log('File response: ' + fileResponse + ', Folder response: ' + folderResponse + ', Unsure: ' + unsure);
    
    return new Promise((resolve) => {
        setTimeout(() => {
            // Check if URL is a file or folder
            const fileCheck = isFile(url);
            const folderCheck = isFolder(url);

            if (fileCheck) {
                // URL is a file
                console.log('File response: ' + fileCheck);
                fileResponse = true;
                folderResponse = false;
                unsure = false;
                resolve('File');
            } else if (folderCheck) {
                // URL is a folder
                console.log('Folder response: ' + folderCheck);
                folderResponse = true;
                fileResponse = false;
                unsure = false;
                resolve('Folder');
            } else {
                //URL is neither a file nor a folder
                console.log('URL is neither a file nor a folder, marking as "unknown"');
                unsure = true;
                fileResponse = false;
                folderResponse = false;
                resolve('Unknown');
            }
        }, 500); // Simulate a delay of 500ms for server to response
    });
}
//Asynchronous function to contact server and wait for server to respond
async function checkURL(url) 
{
    console.log('checkURL');
    let checkedUrl = isValidURL(url);
    console.log('CheckURL result from function: ' + checkedUrl);

    if (checkedUrl) {
        console.log('Valid URL, now sending to the Server');
        resultDiv.innerText = 'Valid URL, Sending to server';

        try {
            const response = await DummyServerResponse(url);
            console.log('Server response: ' + response);

            // Update UI based on dummy server response
            if (fileResponse) 
            {
                resultServerDiv.innerText = 'This is a File';
            } 
            else if (folderResponse) 
            {
                resultServerDiv.innerText = 'This is a Folder';
            } 
            else if (unsure) 
            {
                resultServerDiv.innerText = 'Unknown: Not sure if it is a File or a Folder';
            }
        } 
        catch (error) 
        {
            //Error contacting the server
            resultServerDiv.innerText = 'An error occurred contacting the server';
            console.error('Error:', error);
        }

    } 
    else 
    {
        resultDiv.innerText = 'Invalid URL, Not sending to Server';
    }
}


function isValidURL(url)
{
    console.log('isvalidURL');
    // Basic URL validation
    console.log('url is :'+url);
    let matchResult =  matchpattern.test(url);
    console.log(matchResult);
    return matchResult;
}
function isFile(url) 
{
    // Regular expression to match common file extensions
    let fileResult = fileExtensionRegex.test(url);
    return fileResult;
}

function isFolder(url) 
{
    // Check if the URL ends with a '/' indicating a folder
    return (url.endsWith('/'));
}


function handleInput() 
{
    resultServerDiv.innerText='';
    console.log('handleInput');
    clearTimeout(timeoutId);
    const url = urlInput.value.trim();
    // Throttle the checks
    if (url) 
    {
       timeoutId = setTimeout(() => checkURL(url), 500);
    } 
    else 
    {
        resultDiv.innerText = '';
        resultServerDiv.innerText='';
    }
} 

urlInput.addEventListener('input', handleInput); // Start

