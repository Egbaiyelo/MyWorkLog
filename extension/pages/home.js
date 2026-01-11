
const MAIN = document.querySelector('main');

// Adding back link
//! Resolve back link
// document.referer

//- ensure all element tags start with something so not to clash with base site
document.querySelector('#back-button').addEventListener('click', function () {
    window.history.back();
});


//- what for?
// chrome.runtime.sendMessage({ action: "addSite", data: { name: 'testing', url: 'test.com' } }, (response) => {
//     if (chrome.runtime.lastError) {
//         console.error('Error messaging extension:', chrome.runtime.lastError.message);
//         return;
//     }

//     if (response) {
//         console.log(response)
//     } else {
//         console.error('Invalid credentials received from nativeHost');
//     }
// });

// 
//- what for?
// chrome.runtime.sendMessage({ action: 'getData' }, (response) => {
//     if (chrome.runtime.lastError) {
//         console.error('Error messaging extension:', chrome.runtime.lastError.message);
//         return;
//     }

//     if (response) {
//         response.forEach(element => {
//             console.log(element)

//             //! temp display
//             const section = document.createElement('section');
//             const h2 = document.createElement('h2');
//             h2.textContent = element.site;
//             section.appendChild(h2);

//             element.data.forEach(item => {
//                 const div = document.createElement('div');
//                 const span = document.createElement('span');
//                 span.textContent = item.job_title;
//                 div.appendChild(span);
//                 section.appendChild(div);
//             })
//             MAIN.append(section);
//         });
//     } else {
//         console.error('Invalid credentials received from nativeHost');
//     }
// });

chrome.storage.local.get("companySites", (result) => {
    const keys = Object.keys(result.companySites);
    console.log(result.companySites['bmo'])

    keys.forEach((key) => {
        console.log('got herezzz')
        makeCompanyButton(key, result.companySites[key]);
    })
})

function makeCompanyButton(companyName, baseURL){
    console.log('got here')
    const companyList = document.querySelector('#company-list');

    const div = document.createElement('div');
    const p = document.createElement('p');
    p.textContent = companyName;
    div.appendChild(p);

    const url = new URL(baseURL);
    const img = document.createElement('img');
    img.src = getLogo(companyName, url.hostname);
    img.alt = `${companyName}-logo`;
    div.appendChild(img);
    console.log('############', div)

    companyList.appendChild(div);
}

function getLogo(companyName, domain) {

    const localLogo = chrome.runtime.getURL(`assets/${companyName}.png`);
    
    // DuckDuckGo = ddg
    const ddg = `https://icons.duckduckgo.com/ip3/${companyName}.com.ico`;

    // Final fallback, workday
    const defaultLogo = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

    //- just need anything thats stable
    // const faviconService = `https://www.google.com/s2/favicons?domain=${domain}&sz=64&fallback_opts=type,url`;
    // const faviconUrl = `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(domain)}&size=64`;
    return  ddg || defaultLogo;
}