
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

chrome.storage.local.get("sampleSites", (result) => {
    const keys = Object.keys(result.sampleSites);
    // console.log(result.sampleSites['bmo'])

    keys.forEach((key) => {
        // console.log('got herezzz')
        makeCompanyButton(key, result.sampleSites[key]);
    })
})

//- add num of tracked apps
//- default is the silly arrow, default icon must be workday, server 404 handle
//- might break out and add a bundled source for the html instead
function makeCompanyButton(companyName, baseURL) {
    // console.log('got here')
    const companyList = document.querySelector('#company-list-div');

    const div = document.createElement('div');
    const span = document.createElement('span');
    span.textContent = companyName;

    const url = new URL(baseURL);
    const img = document.createElement('img');
    img.src = getLogo(companyName, url.hostname);
    img.alt = `${companyName}-logo`;

    img.style.width = '45px';
    img.style.height = '45px';
    img.style.objectFit = 'contain';

    div.appendChild(img);
    div.appendChild(span);

    // console.log('############', div)

    // Link to Candiate home
    div.addEventListener('click', () => {
        window.open(baseURL, '_blank');
    })

    companyList.appendChild(div);
    //- maybe host website that just pulls the local storage and displays so people can bookmark and shortcut unless its possuble here
    //- separate companies into active and inactive based on job status
}

//- cira.ca vs cira.com? different screenshots (what to od)
//- add to readme (screenshot) with american banks maybe?
//- add times to applications and sort by last applied 
//- eg <small style="color: #94a3b8; font-size: 0.6rem; margin-top: 4px;">Applied 2d ago</small>
//- merge companysites and jobs
function getLogo(companyName, domain) {

    // Maybe never?
    // const localLogo = chrome.runtime.getURL(`assets/${companyName}.png`);

    // DuckDuckGo = ddg
    const ddgSrc = `https://icons.duckduckgo.com/ip3/${companyName}.com.ico`;

    // Final fallback, workday logo
    const defaultLogo = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

    return ddgSrc || defaultLogo;
}


chrome.storage.local.get("sampleJobs", (result) => {
    const keys = Object.keys(result.sampleJobs);
    console.log(result.sampleJobs)

    keys.forEach((key) => {
        // console.log('got herezzz')
        makeApplicationRow(key, result.sampleJobs[key]);
    })
})

// DEMO //
function makeApplicationRow(hostName, data) {
    const toAdd = document.querySelector('#job-tracker-container');
    console.log("got", hostName, data)

    // DEMO //

    const div = document.createElement('div');
    div.classList.add('job-row')

    const jobTitle = document.createElement('div');
    jobTitle.classList.add('job-title-cell');
    const title = document.createElement('strong');
    title.textContent = data.active[0].jobTitle;
    jobTitle.appendChild(title);
    const span = document.createElement('span');
    span.textContent = `at ${hostName.split('.')[0]}`;
    span.classList.add('company-subtext')
    jobTitle.appendChild(span);
    div.appendChild(jobTitle);

    const req = document.createElement('div');
    req.classList.add('job-req-cell');
    req.textContent = data.active[0].jobReq;
    div.appendChild(req)

    const statusCell = document.createElement('div');
    statusCell.classList.add('job-status-cell')
    const statusBadge = document.createElement('span');
    //- status badge logic
    statusBadge.classList.add('status-badge', 'pending');
    statusBadge.textContent = data.active[0].jobStatus
    statusCell.appendChild(statusBadge);
    div.appendChild(statusCell)

    const date = document.createElement('div');
    date.textContent = data.active[0].jobsDate
    date.classList.add('job-date-cell');
    div.appendChild(date)

    console.log(toAdd)
    toAdd.appendChild(div);

    // looks like
    // <div class="job-row">
    //     <div class="job-title-cell">
    //         <strong>Software Engineer</strong>
    //         <span class="company-subtext">at Google</span>
    //     </div>
    //     <div class="job-req-cell">#REQ-12345</div>
    //     <div class="job-status-cell">
    //         <span class="status-badge pending">Pending</span>
    //     </div>
    //     <div class="job-date-cell">Feb 08, 2026</div>
    // </div>
}
