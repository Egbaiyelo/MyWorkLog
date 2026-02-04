
import { AddLinkToHome, createAccountHelper, createHomeLink } from "./files/dom";
// import { signIn, createAccount } from "./files/auth"
import { addSite } from "./files/addsite";

// Add site
// Login
// 
// 


//-! need a lot better error handling between connections



//#region 1. ADD SITE

// The first functionality is adding sites to the watch list, so all sites with a workday domain
// can be tracked and viewed anytime.

const siteURL = window.location.href;


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


//#endregion 

//#region 3. Add MyWorkday Button

// button for home page
// Button for sign in / sign up

// Issue -> Might move buttons somewhere else, login/register button and then the home button

// AddLinkToHome()

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

