
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
    chrome.storage.local.get("companySites", function (result) {
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

        chrome.storage.local.set({ companySites }, function () {
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
export function checkApplicationTable() {

    const targetNode = document.body;
    const config = { childList: true, subtree: true };

    const callback = (mutationsList, observer) => {
        const rowsExist = document.querySelector('[data-automation-id="applicationTitle"]');
        const appSection = document.querySelector('[data-automation-id="applicationsSectionHeading"]');

        if (rowsExist && appSection) {
            console.log("$$$ Table found, Now extracting job data");
            extractJobDetails(appSection);
            // observer.disconnect();
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
}

//
//- not all will be on the page, need to click to get the rest (pagination)
//- applied jobs might not be needed cause it takes to home immediately
//-     but still just in case it doesnt
//- store by domain not company name
//- full table not loaded in if viewport small
function extractJobDetails(appSection) {

    console.log('@@@@@@@@@', appSection)

    const tpanels = appSection.querySelectorAll('[role="tabpanel"]');
    const activeJobs = tpanels[0].querySelector('tbody') || null;   // not initally hidden
    const inactiveJobs = tpanels[1].querySelector('tbody') || null; // a tbody that is initally hidden
    // Or maybe use .hidden?

    console.log("@@@@@@@@@@@inactive", activeJobs, inactiveJobs)

    chrome.storage.local.get({ jobs: {} }, result => {

        const hostname = window.location.hostname;
        const currentJobs = result.jobs;
        const currentCompanyJobs = currentJobs[hostname] || { active: [], inactive: [] };

        function getContent(taskRow, isActive = true) {
            if (!taskRow) return [];

            const prevList = isActive ? currentCompanyJobs.active : currentCompanyJobs.inactive;
            const taskContent = [];
            const items = taskRow.querySelectorAll('tr');

            items.forEach(element => {
                const jobTitleText = element.querySelector('[data-automation-id="applicationTitle"]')?.textContent || "Unknown";
                const cells = element.querySelectorAll('td');

                const existingData = prevList.find(job => job.jobTitle === jobTitleText) || {};

                const itemContent = {
                    jobTitle: jobTitleText.trim(),
                    jobReq: cells[0]?.textContent.trim() || existingData.jobReq || "Unknown",
                    jobStatus: element.querySelector('[data-automation-id="applicationStatus"]')?.textContent || "Unknown",
                    jobDate: cells[2]?.textContent.trim() || existingData.jobDate || "Unknown"
                };
                taskContent.push(itemContent);
            });

            return taskContent;
        }

        const newActive = getContent(activeJobs);
        const newInactive = getContent(inactiveJobs);

        if (newActive.length > 0 || newInactive.length > 0) {
            currentCompanyJobs.active = newActive;
            currentCompanyJobs.inactive = newInactive;
            currentJobs[hostname] = currentCompanyJobs;

            chrome.storage.local.set({ jobs: currentJobs }, () => {
                console.log("Saved to storage:", currentCompanyJobs);
            });
        }
    })
}

//- maybe background has all the navigations listeners and dispatches events?

// When candidate goes home
export function startNavigationListener() {

    const handleNavigation = (url) => {
        if (url.includes('/userHome')){
            // console.log("Checking page now")
            checkApplicationTable();
        }
    }

    console.log('$$$ here', window.location.href)
    handleNavigation(window.location.href);

    console.log("$$$$ set the nav listener")
    navigation.addEventListener('navigate', (event) => {
        const url = new URL(event.destination.url);
        // console.log('$$$ here is url: ', url)
        // console.log("got ", url);
        handleNavigation(url);
    });
}