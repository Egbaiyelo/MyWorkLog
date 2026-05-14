

//! Need to add to hamburger menu too in case it gets squashed or on mobile
//! page for dom stuff only

import { addToSaved, isJobSaved, removeFromSaved } from "./data";


// returns bardivider and button element
export function createHomeLink(targetColor = 'white') {
    // =======
    // AddLinkToHome(document.querySelector("[data-automation-id='utilityButtonBar']"))

    // Icon div and style
    const targetIcon = document.createElement('span');
    targetIcon.classList.add('mwl-target-icon');
    targetIcon.style.setProperty('--target-color', targetColor);

    // Fetching account icon
    fetch(chrome.runtime.getURL('icons/account-folder.svg'))
        .then(res => res.text())
        .then(svgContent => {

            targetIcon.innerHTML = svgContent;

            // Overiding size
            const svg = targetIcon.querySelector('svg');
            if (svg) {
                svg.setAttribute('width', '20');
                svg.setAttribute('height', '20');
            }
        });

    // Button text and style
    const targetText = document.createElement('span');
    targetText.classList.add('mwl-target-text');
    targetText.style.setProperty('--target-color', targetColor);
    targetText.textContent = "MyWorkLog";

    // Button
    const targetButton = document.createElement('button');
    targetButton.classList.add('mwl-target-button');
    targetButton.setAttribute('aria-expanded', 'false');
    targetButton.setAttribute('aria-haspopup', 'listbox');
    targetButton.setAttribute('color', '#FFFFFF');
    targetButton.setAttribute('data-automation-id', 'UtilityMenuButton');
    Object.assign(targetButton.style, {
        WebkitBoxAlign: 'center',
        alignItems: 'center',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'inline-flex',
        height: '21px',
        margin: '0px 9px',
        padding: '0px',
        whiteSpace: 'nowrap',
        textDecorationSkipInk: 'none',
        color: 'rgb(255, 255, 255)',
    })

    targetButton.append(targetIcon);
    //! extension context invalidated error
    targetButton.append(targetText);

    targetButton.onclick = () => {
        const homeURL = chrome.runtime.getURL('pages/home.bundle.html');
        window.open(homeURL);
    };


    // Bardivider and style
    const barDivider = document.createElement('div');
    barDivider.id = 'myWorkLog-divider-div';
    barDivider.classList.add('mwl-bar-divider');
    barDivider.setAttribute('data-automation-id', 'utility-button-bar-divider');
    barDivider.setAttribute('color', '#FFFFFF');
    barDivider.style.setProperty('--target-color', targetColor);
    
    // Target Button Div Wrapper
    const targetButtonDiv = document.createElement('div');
    targetButtonDiv.id = "myWorkLog-button-div";
    targetButtonDiv.classList.add('mwl-target-button-div');
    targetButtonDiv.setAttribute('data-automation-id', 'utilityButtonTarget');
    targetButtonDiv.append(targetButton);
    //! - for style update
    //- also add hover thingy for style update
    // border: `1px solid ${targetColor}`,
    // borderRadius: '2px',
    // padding: '2px',

    return { targetButtonDiv, barDivider }
}


//- add button and link later
export function createAccountHelper(helperText, onClickHandler) {
    const container = document.createElement('div');
    container.classList.add('mwl-container');

    // OR Separator
    const separator = document.createElement('div');
    separator.classList.add('mwl-separator');
    separator.innerHTML = `
        <span class="mwl-separator-line left"></span>
        <span>OR</span>
        <span class="mwl-separator-line right"></span>
    `;

    // MyWorkLog Sign In Button
    const button = document.createElement('button');
    button.textContent = helperText;
    button.classList.add('mwl-helper-button');

    //! icon
    // const icon = document.createElement('img');
    // icon.src = chrome.runtime.getURL('icons/worklog-icon.svg'); 
    // icon.alt = 'WorkLog icon';
    // icon.style.width = '20px';
    // icon.style.height = '20px';
    // button.prepend(icon);

    // signin/register event listener
    if (onClickHandler) {
        button.addEventListener('click', onClickHandler);
    }

    container.appendChild(separator);
    container.appendChild(button);

    return container;
}


// Adds link to home page
//! Expects utilitybuttonbar to be present
export function AddLinkToHome(utilityButtonBar, targetColor) {
    const { targetButtonDiv, barDivider } = createHomeLink(targetColor);

    //- Probably use mutation observer somehow to make sure its the last element
    if (utilityButtonBar) {
        utilityButtonBar.insertBefore(barDivider, null);
        utilityButtonBar.insertBefore(targetButtonDiv, null);
    }
}


/// Adds the save button
//! adds to 
export function AddSaveButton(containerBar, className, theme) {

    const saveBtn = document.createElement('button');
    saveBtn.innerText = 'Save';
    saveBtn.type = 'button';
    saveBtn.className = className;

    saveBtn.style.whiteSpace = 'nowrap';
    if (theme) {
        Object.assign(saveBtn.style, theme);
        saveBtn.style.border = 'none'; // Dont remove its just finicky

        saveBtn.addEventListener('mouseenter', () => {
            saveBtn.style.backgroundColor = theme.color; 
            saveBtn.style.color = theme.backgroundColor;   
            saveBtn.style.border = `2px solid ${theme.backgroundColor}`         
        });
        
        saveBtn.addEventListener('mouseleave', () => {
            saveBtn.style.backgroundColor = theme.backgroundColor;
            saveBtn.style.color = theme.color;
        });  
    }

    const bookmarkOutline = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>`;
    const bookmarkFilled  = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>`;
    
    const showSaved = () => {
        saveBtn.innerHTML = `${bookmarkFilled} <span style="margin-left: 8px;">Saved</span>`;
        saveBtn.style.opacity = '0.7'; 
    }
    const showNotSaved = () => {
        saveBtn.innerHTML = `${bookmarkOutline} <span style="margin-left: 8px;">Save</span>`;
        saveBtn.style.opacity = '1.0';
    }


    // Interactive button
    isJobSaved((saved) => {  
        if (saved) {
            showSaved();
        } else {
            showNotSaved();
        }
    });

    // handle click action
    saveBtn.addEventListener('click', () => {
        isJobSaved((alreadySaved) => {
            if (!alreadySaved) {

                const titleText = document.querySelector('[data-automation-id="jobPostingHeader"]') ?.innerText || document.title;
                addToSaved({ title: titleText });

                showSaved();
            } else {
                removeFromSaved(() => {
                    showNotSaved()
                });
            }
        });
    });

    saveBtn.classList.add('save-btn-outline');
    containerBar.appendChild(saveBtn);
}

