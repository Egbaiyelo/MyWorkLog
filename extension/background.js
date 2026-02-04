// globalThis.sendNativeCommand = sendNativeCommand;
// globalThis.connectToNativeHost = connectToNativeHost;

// globalThis.testNative = () => {
//     sendNativeCommand('/scrape', { url: 'https://google.com' })
//         .then(response => console.log('Scrape result:', response))
//         .catch(error => console.error('Scrape error:', error));
// };


// touch icon to view page
// chrome.action.onClicked.addListener((tab) => {

// })

let user_signed_in = false;
const NATIVE_HOST = 'com.me.my_workday';

// maybe the action and message should be the same string
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'get_access_token') {
        chrome.identity.getAuthToken({ interactive: true }, function (authToken) {
            sendResponse({ token: authToken });
            console.log({ "auth token": authToken });
        });
        return true;

    } else if (message.action === 'get_profile') {
        chrome.identity.getProfileUserInfo({ accountStatus: 'ANY' }, function (user_info) {
            console.log({ "user info": user_info })
        });
        sendResponse(true);
    }
    else if (message.action === 'getCredentials') {

        chrome.runtime.sendNativeMessage('com.me.my_workday', { action: '/get-credentials' }, (response) => {
            if (chrome.runtime.lastError) {
                console.error('Native messaging error:', chrome.runtime.lastError.message);
            }

            console.log('Received from native app:', response);
            sendResponse(response.result);
        })

        return true;
    }
    else if (message.action === 'getData') {

        chrome.runtime.sendNativeMessage('com.me.my_workday', { action: '/scrape' }, (response) => {
            if (chrome.runtime.lastError) {
                console.error('Native messaging error:', chrome.runtime.lastError.message);
            }

            console.log('Received from native app:', response);
            sendResponse(response.result);
        })

        return true;
    }
    else if (message.action === 'addSite') {
        chrome.runtime.sendNativeMessage('com.me.my_workday', { action: '/add-site', data: message.data }, (response) => {
            console.log('addsite command received');
            if (chrome.runtime.lastError) {
                console.error('Native messaging error:', chrome.runtime.lastError.message);
            }

            console.log('Received add site data from native app:', response);
            sendResponse(response.result);
        })

        return true;
    }
    else { console.log('unknown command'); sendResponse('command unknown') }
});


chrome.action.onClicked.addListener(function (tab) {
    chrome.identity.getAuthToken({ interactive: false }, function (authToken) {
        if (chrome.runtime.lastError || !authToken) {

            console.log("No token given")
            // Try again openly
            chrome.identity.getAuthToken({ interactive: true }, function (newAuthToken) {
                if (chrome.runtime.lastError || !authToken) {
                    console.error("Login failed or was canceled:", chrome.runtime.lastError?.message);
                    return;
                }
                console.log("New token", newAuthToken)
            })
        }
        else {
            console.log({ "auth token": authToken });
            // sendResponse({ token: authToken })
        }
    });
    return true;
})


chrome.identity.onSignInChanged.addListener(function (id, status) {
    console.log(status);
})

// export function loginUser() {
//     chrome.identity.getAuthToken({ interactive: true }, function (token) {
//         if (chrome.runtime.lastError || !token) {
//             console.error("Login failed:", chrome.runtime.lastError);
//             return;
//         }

//         // Now you have a token! Use it to get user info
//         fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`)
//             .then(response => response.json())
//             .then(user => {
//                 console.log("Logged in as:", user.email);
//                 // Save user identity to local storage
//                 chrome.storage.local.set({ user: { email: user.email, name: user.name } });
//             });
//     });
// }
