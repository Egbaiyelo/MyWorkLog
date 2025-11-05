
// Adds site to the watch list
// adds applied jobs to the watch list
// might add visited jobs to the watch list

//- need to run this only when necessary


export function addSite() {

    // Company name in format like 
    // bmo.wd3.myworkdayjobs
    const companyName = window.location.hostname.split('.')[0];

    const segments = window.location.href.split('/');
    const baseURL = segments.slice(0, 5).join('/');

    // Save to local
    // Redundant storage, given some may not have the app or maybe the app isnt working, it at least keeps them 
    // in local storage first
    //- not used sync yet but might have addsites
    chrome.storage.sync.get("companySites", function (result) {
        const companySites = result.companySites || {};
        console.log("result, companysites", result, companySites);

        if (!companySites[companyName]) {
            chrome.runtime.sendMessage({ action: "addSite", data: { companyName, url: baseURL } });
        }

        // Shouldn't have duplicates but just checking
        // If the company name exists but doesnt have the same data as the baseURL
        if (companySites[companyName] && companySites[companyName] != baseURL) {
            chrome.runtime.sendMessage({ action: "siteChange", data: { companyName, url: baseURL, oldUrl: companySites[companyName] } });
        }
        // Update or insert
        companySites[companyName] = baseURL;

        chrome.storage.sync.set({ companySites }, function () {
            console.log(`Saved ${companyName}: ${baseURL}`);
        });

        // different protocol if site changes
        // chrome.runtime.sendMessage({ action: "addSite", data: { companyName, url: baseURL } });
    });

    // Example full format
    // "https://bmo.wd3.myworkdayjobs.com/en-US/External/userHome"
}


//- When you apply to a job, log it immediately
export function addAppliedJob() {

}


//- If in dashboard, ensure jobs there are same with what has been stored
//- maybe add notifications
export function checkJobs() {

}

//- maybe background has all the listeners and dispatches events?

export function startNavigationListener() {

    navigation.addEventListener('navigate', (event) => {
        const url = new URL(event.destination.url);
        if (url.pathname.includes('/userHome')) {
            checkJobs();
        }
    });
}