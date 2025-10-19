

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


