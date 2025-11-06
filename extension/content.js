
// import { createAccountHelper, createHomeLink } from "./files/dom";
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

// console.log("I work")
// // const siteURL = window.location.href;

addSite();
startNavigationListener();


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

// Adds link to home page
//! Expects utilitybuttonbar to be present
function AddLinkToHome(utilityButtonBar, targetColor) {
    const { targetButtonDiv, barDivider } = createHomeLink(targetColor);
    // console.log(targetButtonDiv, barDivider)
    // console.log('then', utilityButtonBar)

    //- Probably use mutation observer somehow to make sure its the last element
    if (utilityButtonBar) {
        // console.log("inserting utility button bar")
        // console.log({ "utilitybuttonbar I got": utilityButtonBar })
        utilityButtonBar.insertBefore(barDivider, null);
        utilityButtonBar.insertBefore(targetButtonDiv, null);
    }
}

let username, password;

const generalObserver = new MutationObserver(() => {

    const utilButtonBar = document.querySelector("[data-automation-id='utilityButtonBar']");
    const signInFormo = document.querySelector("[data-automation-id='signInFormo']");

    if (utilButtonBar) {

        // Addsite if logged in, can tell by the account button with the email in it
        const accountButton = document.querySelector("[data-automation-id='utilityButtonAccountTasksMenu']");

        if (accountButton) {

            // request username
            let username;
            chrome.storage.sync.get("username", result => username = result);

            // Dont expect anything else in the accountbutton other than email
            if (accountButton.textContent === username) {
                addSite();
            }
            else {
                //- Maybe allow multiple accounts
                console.warn("myWorkday says: You are logged in with a different account! It cannot be monitored")
            }

        }

        // Given the way the page routes, better to keep checking and ensure adding the link
        const myWorkdayButton = document.querySelector('#myWorkday-button-div');
        const barDivider = document.querySelector('#myWorkday-divider-div');
        //- Ensure its last element and change name from item present
        // console.log('itemPresent', myWorkdayButton)

        if (myWorkdayButton) {
            // console.log('^^^^^^^^^^^^^ehwreheye', utilButtonBar.children, utilButtonBar.children[utilButtonBar.children.length - 1])
            if (utilButtonBar.children[utilButtonBar.children.length - 1].id != 'myWorkday-button-div') {

                utilButtonBar.appendChild(barDivider);
                utilButtonBar.appendChild(myWorkdayButton);
            }

        } else {
            // Getting the base text color for blending in
            const utilButton = utilButtonBar.querySelector('button');
            const utilColor = getComputedStyle(utilButton).color;
            // console.log("util button", utilButton, utilColor);
            // console.log("util button color", utilColor);

            //- Probably check for my element instead and add it if not there based on Status
            AddLinkToHome(utilButtonBar, utilColor);
            // generalObserver.disconnect();
        }
    }

    if (signInFormo) {

        function HandleAccountForm() {
            console.log("username", password, username)
            //- New flow -> user clicks sign in and can then register or login with myWorkday
            //- maybe offer to register if not and if user logs in maybe save pass info
            const formType = document.getElementById('authViewTitle').textContent;
            if (formType == 'Sign In') {
                //- onclick signin and then click button

                const signInHelper = document.querySelector('#myWorkday-signIn-helper');
                if (!signInHelper) {

                    const element = createAccountHelper('Sign in with MyWorkday', () => {
                        signIn(signInFormo, username, password, true);
                    });

                    element.id = 'myWorkday-signIn-helper';
                    signInFormo.appendChild(element);
                }


            } else if (formType == 'Create Account') {

                const registerHelper = document.querySelector('#myWorkday-register-helper');
                if (!registerHelper) {
                    const element = createAccountHelper('Register with MyWorkday', () => {
                        createAccount(signInFormo, username, password, true);
                    });

                    element.id = 'myWorkday-register-helper';
                    signInFormo.appendChild(element);
                }
            }
        }

        // Ensure username and pass available
        if (!username || !password) {
            chrome.runtime.sendMessage({ action: 'getCredentials' }, (response) => {
                // console.log("trying")
                if (chrome.runtime.lastError) {
                    console.error('Error messaging extension:', chrome.runtime.lastError.message);
                    return;
                }

                // console.log("I got it the creds", response)

                if (response && response.username && response.password) {
                    console.log('got response')
                    username = response.username;
                    password = response.password;

                    HandleAccountForm();
                } else {
                    console.error('Invalid credentials received from nativeHost');
                    Alert("MyWorkday could not get your credentials, please fill form manually")
                }
            });
        } else {
            HandleAccountForm();
        }
    }
});

//- maybe observe the button bar instead?
// generalObserver.observe(document.body, {
//     childList: true,
//     subtree: true
// });



//#endregion

//#region Execution

// addSite();

//#endregion


function uploadFile() {
    const dummyContent = "Experience:\n Service worker \n Engineer University ";
    const dummyFile = new File([dummyContent], "resume.txt", { type: "text/plain" });

    const observer = new MutationObserver(() => {
        const input = document.querySelector('[data-automation-id="file-upload-input-ref"]');

        if (input) {
            console.log("File input found!");

            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(dummyFile);

            input.files = dataTransfer.files;
            input.dispatchEvent(new Event('change', { bubbles: true }));


            observer.disconnect();
        }
    });

    // observer.observe(document.body, {
    //     childList: true,
    //     subtree: true
    // })

}


// uploadFile();

// Look for what to do, sign up, sign in
// function ensureAccount() {
//     const observer = new MutationObserver(() => {

//         // Ensure signed in? or signed up?
//         const utilityButtonBar = document.querySelector('[data-automation-id="utilityButtonBar"]');
//         const signInButton = document.querySelector('[data-automation-id="utilityButtonSignIn"]');


//     });
// }

// const observer = new MutationObserver(() => {

//     const utilityButtonBar = document.querySelector('[data-automation-id="utilityButtonBar"]');
//     const signInButton = document.querySelector('[data-automation-id="utilityButtonSignIn"]');


//     console.log(utilityButtonBar)
//     if (!utilityButtonBar) {
//         console.log("Failed to find");
//         return;
//     };

//     if (signInButton) {
//         console.log("signing in");
//         const signInResponse = SignIn(signInButton);
//     }

//     observer.disconnect();
// })

// observer.observe(document.body, { subtree: true, childList: true });



// function waitForElement(selector, timeout = 5000) {
//     return new Promise((resolve, reject) => {
//         const observer = new MutationObserver(() => {
//             const element = document.querySelector(selector);
//             if (element) {
//                 observer.disconnect();
//                 resolve(element);
//             }
//         });

//         observer.observe(document.body, { childList: true, subtree: true });

//         setTimeout(() => {
//             observer.disconnect();
//             reject(new Error('Element not found within timeout'));
//         }, timeout);
//     });
// }



// const creds = { email: "I am email", password: "I am password" };

// function SignIn(signInButton) {
//     console.log(signInButton);
//     if (!signInButton || signInButton.getAttribute('data-automation-id') !== "utilityButtonSignIn") {
//         console.log("Received falsy sign in button");
//         return false;
//     }

//     signInButton.click();


//     waitForElement('[data-automation-id="signInContent"]')
//         .then(signInContent => {
//             console.log("here!!!")
//             console.log("sign inc onten")
//             const emailBox = document.querySelector('[data-automation-id="email"]');
//             const passwordBox = document.querySelector('[data-automation-id="password"]');
//             if (!emailBox || !passwordBox) { console.log("didnt finds"); return false };

//             console.log(emailBox, passwordBox, "setting", creds)
//             emailBox.value = creds.email;
//             emailBox.dispatchEvent(new Event('input', { bubbles: true }));
//             passwordBox.value = creds.password;

//             passwordBox.dispatchEvent(new Event('input', { bubbles: true }));

//             return true;
//         })
//         .catch(error => {
//             console.log("Sign-in form not loaded:", error);
//             return false;
//         });


//     // // const closeButton = document.querySelector('[aria-label="close"]');
//     // awaitElement('[data-automation-id="signInContent"]');
//     // const signInContent = document.querySelector('[data-automation-id="signInContent"]');
//     // console.log(signInContent)
//     // if (!signInContent) { console.log("Received falsy form"); return false; }

//     // const emailBox = document.querySelector('[data-automation-id="email"]');
//     // emailBox.value = creds.email;

//     // const passwordBox = document.querySelector('[data-automation-id="password"]');
//     // passwordBox.value = creds.password;

//     // return true;
// }

// function awaitElement(selector) {
//     // really shouldnt take too much time

//     if (document.querySelector(selector)) { console.log("1"); console.log(document.querySelector(selector)); return };

//     const observer = new MutationObserver(() => {
//         //- check added node instead maybe
//         if (document.querySelector(selector)) { console.log("2"); console.log(document.querySelector(selector)); return };

//     })
//     observer.observe(document.body, { subtree: true, childList: true })
//     //- maybe return the elemnt and set timeout if it never appeared
//     console.log("reached")
// }







// // const observer = new MutationObserver((mutations) => {
// //     for (const mutation of mutations) {
// //         console.log("Here")
// //         for (const node of mutation.addedNodes) {
// //             console.log("there")
// //             console.log("node", node)
// //             if (node.nodeType === 1 && node.matches('[data-automation-id="utilityButtonBar"]')) {
// //                 console.log("level 1")
// //                 observer.disconnect();
// //                 console.log("level 2")


// //                 node.append(barDivider);
// //                 node.append(targetButtonDiv);
// //                 console.log({ added: node })


// //                 return;
// //             }
// //         }
// //     }
// // });

// // observer.observe(document.body, { childList: true, subtree: true });





// Form data

/**experience
 * 
 * Job title
 * company
 * 
 * Currently work here
 * 
 * From
 * To
 * Role Description
 * 
 */

/**Education
 * 
 * School or Uni
 * 
 * Degree
 * Field of Study
 * Overall Result
 * 
 * From 
 * To
 */

/**Language
 * 
 * Language
 * I am flient
 * Reading
 * Speaking
 * Writing
 * Listening
 * Overall
 */

/**Skills
 * *
 */

/**Social Networks
 * 
 * LinkeDin
 * Github
 */

/**Other
 * race
 * gender
 * sexuality
 */

