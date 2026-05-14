
// 
function getCompanyKey() {
    // e.g. "bmo.wd3.myworkdayjobs.com" but first part
    return window.location.hostname.split('.')[0];
}

// Gets the unique identifier for the current job posting based on the URL
function getJobId() {
    // Spliting the URL path to get the unique reference string (e.g., 'Associate-Banker_R123456789')
    const pathParts = window.location.pathname.split('/');
    return pathParts[pathParts.length - 1] || window.location.href;
}


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
