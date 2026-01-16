

// Autofills Sign In info
//! Assumes all needed elements are present 
// If submit is true, it also submits form
export function signIn(form, email, password, submit) {
    const emailBox = form.querySelector('[data-automation-id="email"]');
    const passwordBox = form.querySelector('[data-automation-id="password"]');
    if (!emailBox || !passwordBox) { console.log("didnt finds"); return false };

    emailBox.value = email;
    emailBox.dispatchEvent(new Event('input', { bubbles: true }));
    passwordBox.value = password;
    passwordBox.dispatchEvent(new Event('input', { bubbles: true }));

    // If submit is wanted, click submit button
    if (submit) {
        const signInButton = form.querySelector("[data-automation-id='click_filter']");
        signInButton.click();
    }
}

// Autofills Account info
//! Assumes all needed elements are present
// If submit is true, it also submits form
export function createAccount(form, email, password, submit) {
    console.log("creating account")
    const emailBox = form.querySelector('[data-automation-id="email"]');
    const passwordBox = form.querySelector('[data-automation-id="password"]');
    const verifyPasswordBox = form.querySelector('[data-automation-id="verifyPassword"]');
    if (!emailBox || !passwordBox) { console.log("didnt finds"); return false };

    emailBox.value = email;
    emailBox.dispatchEvent(new Event('input', { bubbles: true }));
    passwordBox.value = password;
    passwordBox.dispatchEvent(new Event('input', { bubbles: true }));
    verifyPasswordBox.value = password;
    verifyPasswordBox.dispatchEvent(new Event('input', { bubbles: true }));

    const createAccountCB = form.querySelector("[data-automation-id='createAccountCheckbox']");
    if (createAccountCB) {
        // console.log("aria checked", createAccountCB.getAttribute('aria-checked'));

        if (createAccountCB.getAttribute('aria-checked') === "false") {
            console.log("we getting there")
            createAccountCB.click();
            createAccountCB.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    // If submit is wanted, click submit button
    if (submit) {
        // console.log("registering")
        const createAccountButton = form.querySelector("[data-automation-id='click_filter']");
        createAccountButton.click();
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
                console.warn("myWorkLog says: You are logged in with a different account! It cannot be monitored")
            }

        }

        // Given the way the page routes, better to keep checking and ensure adding the link
        const myWorkLogButton = document.querySelector('#myWorkLog-button-div');
        const barDivider = document.querySelector('#myWorkLog-divider-div');
        //- Ensure its last element and change name from item present
        // console.log('itemPresent', myWorkLogButton)

        if (myWorkLogButton) {
            // console.log('^^^^^^^^^^^^^ehwreheye', utilButtonBar.children, utilButtonBar.children[utilButtonBar.children.length - 1])
            if (utilButtonBar.children[utilButtonBar.children.length - 1].id != 'myWorkLog-button-div') {

                utilButtonBar.appendChild(barDivider);
                utilButtonBar.appendChild(myWorkLogButton);
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
            //- New flow -> user clicks sign in and can then register or login with myWorklog
            //- maybe offer to register if not and if user logs in maybe save pass info
            const formType = document.getElementById('authViewTitle').textContent;
            if (formType == 'Sign In') {
                //- onclick signin and then click button

                const signInHelper = document.querySelector('#myWorklog-signIn-helper');
                if (!signInHelper) {

                    const element = createAccountHelper('Sign in with MyWorklog', () => {
                        signIn(signInFormo, username, password, true);
                    });

                    element.id = 'myWorklog-signIn-helper';
                    signInFormo.appendChild(element);
                }


            } else if (formType == 'Create Account') {

                const registerHelper = document.querySelector('#myWorklog-register-helper');
                if (!registerHelper) {
                    const element = createAccountHelper('Register with MyWorklog', () => {
                        createAccount(signInFormo, username, password, true);
                    });

                    element.id = 'myWorklog-register-helper';
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
                    Alert("MyWorklog could not get your credentials, please fill form manually")
                }
            });
        } else {
            HandleAccountForm();
        }
    }
});
