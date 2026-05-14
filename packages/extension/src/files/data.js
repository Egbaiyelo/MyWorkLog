
import { getCompanyKey, getJobId } from "./sitelog";

/**
 * returns true if the job ID has been saved to storage
 * @param {*} callback 
 */
export function isJobSaved(callback) {
    const company = getCompanyKey();
    const jobId = getJobId();

    chrome.storage.local.get([company], (result) => {
        const companyData = result[company] || {};
        const savedMap = companyData.saved || {};

        callback(!!savedMap[jobId]);
    });
}

/**
 * Gets all existing saved jobs for a domain
 * @param {*} companyName The name of the queried company domain
 * @param {*} callback 
 */
export function getAllSaved(companyName, callback) {
    chrome.storage.local.get([companyName], (result) => {
        const companyData = result[companyName] || {};
        callback(companyData.saved || {});
    });
}


/**
 * Adds a job to the saved list of a domain
 * @param {*} jobData The job data to be saved
 */
export function addToSaved(jobData) {
    const company = getCompanyKey();
    const jobId = getJobId();

    chrome.storage.local.get([company], (result) => {
        const companyData = result[company] || {};
        
        if (!companyData.saved) {
            companyData.saved = {};
        }

        // Add or overwrite the job payload
        companyData.saved[jobId] = {
            id: jobId,
            title: jobData.title || document.title,
            url: window.location.href,
            savedAt: new Date().toISOString(),
            ...jobData
        };

        // Writing updated structure back to storage
        chrome.storage.local.set({ [company]: companyData }, () => {
            console.log(`[Storage] Saved job ${jobId} under ${company}`);
        });
    });
}


/**
 * Removes a job from the saved list
 * @param {*} successCallback 
 */
export function removeFromSaved(successCallback) {
    const company = getCompanyKey();
    const jobId = getJobId();

    chrome.storage.local.get([company], (result) => {
        const companyData = result[company] || {};
        const savedMap = companyData.saved || {};

        if (savedMap[jobId]) {
            // Delete the key from the object map
            delete companyData.saved[jobId];

            chrome.storage.local.set({ [company]: companyData }, () => {
                console.log(`[Storage] Removed job ${jobId} from ${company}`);
                if (successCallback) successCallback();
            });
        }
    });
}


// Extract Tenant and SiteId dynamically from the URL path
//! maybe move data writing to background for race conditions
function getWorkdayRouteMetadata() {
    const origin = window.location.origin; // e.g., "https://bmo.wd3.myworkdayjobs.com"
    const segments = window.location.href.split('/');  // e.g., [ "https:", "", "autodesk.wd1.myworkdayjobs.com", "en-US", "uni", "job", "Software-Engineer_REQ123" ]
    
    // Filter out en-US and all that
    const pathSegments = segments.filter(seg => 
        seg && !/^[a-z]{2}-[A-Z]{2}$/.test(seg) && !seg.includes('http') && !seg.includes('.')
    ); // e.g., [ "uni", "job", "Software-Engineer_REQ123" ]

    // e.g. domain/en-US/SiteId/job...
    const tenant = getCompanyKey();  // company name
    const siteId = pathSegments[0]; // the company workdomain

    return {
        siteUrl: `${origin}/${siteId}`, 
        apiUrl: `${origin}/wday/cxs/${tenant}/${siteId}/` 
    };
}


/**
 * Log visited site
 * //! add description and add company to the companysite list
 */
export function syncCompanySiteData() {
    const company = getCompanyKey();
    const meta = getWorkdayRouteMetadata();

    chrome.storage.local.get([company, "companySites"], (result) => {
        const companyData = result[company] || { saved: {} };
        const companyList = result["companySites"] || [];
        const oldUrl = companyData.siteUrl;

        if (!companyList.includes(company)) companyList.push(company);

        //! necessary?
        // Alerting background script if the company root paths modified
        if (!oldUrl) {
            chrome.runtime.sendMessage({ action: "addSite", data: { companyName: company, url: meta.siteUrl } });
        } else if (oldUrl !== meta.siteUrl) {
            chrome.runtime.sendMessage({ action: "siteChange", data: { companyName: company, url: meta.siteUrl, oldUrl } });
        }

        // Update
        companyData.siteUrl = meta.siteUrl;
        companyData.apiUrl = meta.apiUrl;

        chrome.storage.local.set({ [company]: companyData, "companySites": companyList }, () => {
            console.log(`[Storage Sync] Synced ${company} configuration.`);
        });
    });
}

