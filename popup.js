let trackEmails = document.getElementById('trackEmails');
let list = document.getElementById('emailList');


//receive emails from content script
chrome.runtime.onMessage.addListener((request,sender,sendResponse)=>{
    let emails = request.emails;

    //display emails on popup
    if(emails==null || emails.length == 0){
        let li = document.createElement('li');
        li.innerText = "No emails detected. Maybe they're hiding? Let's search again!";
        list.appendChild(li);
    } else{
        emails.forEach((email) =>{
            let li = document.createElement("li");
            li.innerText = email;
            list.appendChild(li);
        });
    }
})


//initially when the button is clicked
trackEmails.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab.id !== undefined) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: trackEmailsFromPage,
        }).catch(error => console.error('Error executing script:', error));
    } else {
        console.error("No active tab identified.");
    }
});


//function to track emails
function trackEmailsFromPage(){

    //using reg expressions to track and display emails
    const emailRegEx = /[\w\.=-]+@[\w\.-]+\.[\w]{2,3}/gim;

    let emails = document.body.innerHTML.match(emailRegEx);

    chrome.runtime.sendMessage({emails});

}