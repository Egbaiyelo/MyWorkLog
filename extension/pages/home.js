const MAIN = document.querySelector('main');

// Adding back link
//! Resolve back link
// document.referer

//- ensure all element tags start with something so not to clash with base site
document.querySelector('#back-button').addEventListener('click', function () {
    window.history.back();
});


//- what for?
chrome.runtime.sendMessage({ action: "addSite", data: { name: 'testing', url: 'test.com' } }, (response) => {
    if (chrome.runtime.lastError) {
        console.error('Error messaging extension:', chrome.runtime.lastError.message);
        return;
    }

    if (response) {
        console.log(response)
    } else {
        console.error('Invalid credentials received from nativeHost');
    }
});

// 
//- what for?
chrome.runtime.sendMessage({ action: 'getData' }, (response) => {
    if (chrome.runtime.lastError) {
        console.error('Error messaging extension:', chrome.runtime.lastError.message);
        return;
    }

    if (response) {
        response.forEach(element => {
            console.log(element)

            //! temp display
            const section = document.createElement('section');
            const h2 = document.createElement('h2');
            h2.textContent = element.site;
            section.appendChild(h2);

            element.data.forEach(item => {
                const div = document.createElement('div');
                const span = document.createElement('span');
                span.textContent = item.job_title;
                div.appendChild(span);
                section.appendChild(div);
            })
            MAIN.append(section);
        });
    } else {
        console.error('Invalid credentials received from nativeHost');
    }
});

chrome.storage.local.get("companySites", (result) => {
    
})

function makeCompanyButton(){

}