
// page observes changes in body and then adds the elements
//! Change it so it has nothing else
//! all added elements include .myworkday-element
const ELEMENT_TAG = "myWorkday-element"


import { syncCompanySiteData } from "./files/data";
import { AddLinkToHome, AddSaveButton } from "./files/dom";
// import { signIn, createAccount } from "./files/auth"
import { addSite, startNavigationListener } from "./files/sitelog";
// maybe just once file like index which gives it all as myWorklog.xy


// Add site
// Login
// 
// 


//-! need a lot better error handling between connections

//#region 1. ADD SITE

// The first functionality is adding sites to the watch list, so all sites with a workday domain
// can be tracked and viewed anytime.


//- only when once logged in (this ensures right path to home)
//- verify how sitechange happened


// addSite();

/////////////////////////////////////////////////////////////////
// startNavigationListener();


// siteStatus();

// Autofills Sign In info
//! Assumes all needed elements are present 
// If signinbutton given, it clicks it

// >>>>>>>>>>>>>>>

// function signIn(email, password, submit) {
//     const emailBox = document.querySelector('[data-automation-id="email"]');
//     const passwordBox = document.querySelector('[data-automation-id="password"]');
//     if (!emailBox || !passwordBox) { console.log("didnt finds"); return false };

//     emailBox.value = email;
//     emailBox.dispatchEvent(new Event('input', { bubbles: true }));
//     passwordBox.value = password;
//     passwordBox.dispatchEvent(new Event('input', { bubbles: true }));

//     // await user sign in? or ask specifically ahead of time
//     // sign in for now
//     // const signInButton = document.querySelector("[data-automation-id='signInSubmitButton']");
//     // signInButton.click();

//     // 
//     if (submit) {
//         // console.log('------------------((((((((((signing in');
//         const signInButton = document.querySelector("[data-automation-id='click_filter']");
//         console.log(signInButton);
//         signInButton.click();
//         //- Do for register too


//         // signInButton.dispatchEvent(new MouseEvent('click', {
//         //     view: window,
//         //     bubbles: true,
//         //     cancelable: true,
//         //     trusted: true,
//         //     isTrusted: true
//         // }));
//     }
// }

// <<<<<<<<<<<<<<<

//#endregion

//#region 2. LOGIN

//- will probably have option to always signin so user never evensees the page (better)

//- Issue -> User might not have made account on the site yet so I need to confirm that before trying to login
//  --- Also need to handle failed login
//  --- Maybe check if user ever signed in?
//- Issue -> Cant decide if should wait for autofill and wait for user to click 
// -(can be messy with other autocompletes I think)
// - or put a button that does it all, probably put a button at the top to let use sign in without the form (from the utility bar)

// - Issue -> Can get two forms
function siteStatus() {

    const observer = new MutationObserver(() => {

        // Mostly from sites like Linkedin that lead directly to the application
        // If user goes there themselves and wants to apply eventually, it still pops up
        const signInForm = document.querySelector('[data-automation-id="signInContent"]');

        if (signInForm) {
            clearTimeout(timeoutId);

            const formType = document.getElementById('authViewTitle').textContent;
            if (formType == 'Sign In') {
                console.log('sign in');
            } else if (formType == 'Create Account') {
                console.log('create account');
            }
            //- Else put button in the utility bbar as said above

            // else {
            //     alert("Can't identify the form");
            // }

            observer.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    const timeoutId = setTimeout(() => {
        //- What to do with this part?
        // console.warn("Timeout: Sign-in form not found.");
        observer.disconnect();
        // alert("Login/Register form did not appear.");
    }, 5000);
}

//! temp for now needs to be in observer
syncCompanySiteData();

//#endregion

//#region 3. Add MyWorkLog Button

// button for home page
// Button for sign in / sign up

// Issue -> Might move buttons somewhere else, login/register button and then the home button

let ran = false

const utilityBarObserver = new MutationObserver(() => {
    const utilButtonBar = document.querySelector('[data-automation-id="utilityButtonBar"]');
    if (utilButtonBar) {

        const myWorkLogButton = utilButtonBar.querySelector('#myWorkLog-button-div');
        const barDivider = document.querySelector('#myWorkLog-divider-div');
        const accountIdentifier = document.querySelector('[data-automation-id="utilityButtonAccountTasksMenu"]')

        //-! if at home page
        if (!ran && accountIdentifier) {

            // sitelog logged in site
            addSite();

            //! ???
            console.log('%%%%%%%%%%%%%%%%%%', 'here')
            chrome.runtime.sendMessage({ action: "fetchApi", url: "https://td.wd3.myworkdayjobs.com/en-US/TD_Bank_Careers/userHome" },
                (response) => {
                    console.log("%%%", response);
                })
            ran = true
        }

        // ensure its last
        //- might not have to run
        if (myWorkLogButton) {
            if (utilButtonBar.children[utilButtonBar.children.length - 1].id != 'myWorkLog-button-div') {

                utilButtonBar.appendChild(barDivider);
                utilButtonBar.appendChild(myWorkLogButton);
            }
        }
        else {
            // Getting the base text color for blending in
            //! move to top and make color global
            const utilButton = utilButtonBar.querySelector('button');
            const utilColor = getComputedStyle(utilButton).color;
            site_text_color = utilColor;

            //- Probably check for my element instead and add it if not there based on Status
            AddLinkToHome(utilButtonBar, utilColor);
            // generalObserver.disconnect();
        }
        //- find different way to make sure its last
        // utilityBarObserver.disconnect();
    }
})

utilityBarObserver.observe(document.body, {
    childList: true,
    subtree: true
});



// $$ auth logic

//- maybe observe the button bar instead?
// generalObserver.observe(document.body, {
//     childList: true,
//     subtree: true
// });



//#endregion

//#region Execution

// addSite();

//#endregion



///// NEW ----------------
// if page has job details, add save button
//! maybe a hierarchy of what kind of page we are on then what we shpuld do, form page, job details/posting page, etc
//! get the page from the url then use mutation observers
const jobDetailsObserver = new MutationObserver(() => {

    const className = 'myWorkday-saveBtn'
    const targetelement = document.getElementById(className);

    // Works on both the details page and postings page
    const jobDetails = document.querySelector('[data-automation-id="jobDetails"]')
        || document.querySelector('[data-automation-id="jobPostingPage"]');

    const stickyWrapper = document.querySelector('[data-automation-id="jobPostingStickyWrapper"]');
    //! fix hover

    if ((jobDetails && !jobDetails.querySelector(`.${className}`)) || (stickyWrapper && !stickyWrapper.querySelector(`.${className}`))) {

        //! Maybe a better way to get the button?
        const applyButton = document.querySelector('a[href*="/apply"]') 
        || document.querySelector('[data-automation-id="adventureButton"]');

        if (!applyButton) return

        const styles = window.getComputedStyle(applyButton);
        const theme = {
            backgroundColor: styles.backgroundColor,
            color: styles.color,
            borderRadius: styles.borderRadius,

            height: styles.height,
            padding: styles.padding,
            opacity: styles.opacity,
            lineHeight: styles.lineHeight
        };

        const parent = applyButton.parentElement;
        parent.style.position = 'relative';

        const rect = applyButton.getBoundingClientRect();

        const newDiv = document.createElement('div');
        newDiv.className = ELEMENT_TAG;
        newDiv.style.position = 'absolute';
        newDiv.style.left = (rect.width + 12) + 'px';
        newDiv.style.top = '0';

        //! maybe find way to remove theme and classname like maybe class is made up here for the container instead and savebutton has its own class internally
        AddSaveButton(newDiv, className, theme);
        applyButton.insertAdjacentElement('afterend', newDiv);        
    }
})

jobDetailsObserver.observe(document.body, {
    childList: true,
    subtree: true
});

