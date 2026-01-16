

//- Need to add to hamburger menu too in case it gets squashed or on mobile


// returns bardivider and button element
export function createHomeLink(targetColor = 'white') {
    // =======
    // AddLinkToHome(document.querySelector("[data-automation-id='utilityButtonBar']"))


    // Icon div and style
    const targetIcon = document.createElement('span');
    // Fetching account icon
    fetch(chrome.runtime.getURL('icons/account-folder.svg'))
        .then(res => res.text())
        .then(svgContent => {
            Object.assign(targetIcon.style, {
                display: 'inline-block',
                margin: '0 3px',
                opacity: '0.5',
                color: targetColor,
                width: 20,
                height: 20,
                alt: 'Account icon'
            });

            targetIcon.innerHTML = svgContent;

            // Overiding size
            const svg = targetIcon.querySelector('svg');
            console.log('&&&svg', targetIcon)
            if (svg) {
                svg.setAttribute('width', '20');
                svg.setAttribute('height', '20');
            }
        });

    // Button text and style
    const targetText = document.createElement('span');
    targetText.textContent = "MyWorkLog";
    Object.assign(targetText.style, {
        color: targetColor,
        fontSize: '12px',
        fontWeight: '500',
        lineHeight: '14px',
        margin: '0px 3px',
        opacity: '1',
        textDecorationSkipInk: 'none'
    })


    // Button
    const targetButton = document.createElement('button');
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
        const homeURL = chrome.runtime.getURL('pages/home.html');
        window.open(homeURL);
    };


    // Bardivider and style

    const barDivider = document.createElement('div');
    barDivider.setAttribute('data-automation-id', 'utility-button-bar-divider');
    barDivider.setAttribute('color', '#FFFFFF');
    barDivider.id = 'myWorkLog-divider-div';
    // barDivider.setAttribute('color', targetColor);
    Object.assign(barDivider.style, {
        backgroundColor: targetColor,
        height: ' 12px',
        margin: ' 0px',
        opacity: ' 0.5',
        width: ' 1px'
    })


    const targetButtonDiv = document.createElement('div');
    targetButtonDiv.setAttribute('data-automation-id', 'utilityButtonTarget');
    targetButtonDiv.style.height = '21px';
    targetButtonDiv.append(targetButton);
    targetButtonDiv.id = "myWorkLog-button-div";
    Object.assign(targetButtonDiv.style, {
        //- for style update
        //- also add hover thingy for style update
        // border: `1px solid ${targetColor}`,
        // borderRadius: '2px',
        // padding: '2px',
        height: '21px'
    })

    return { targetButtonDiv, barDivider }
}

//- add button and link later
export function createAccountHelper(helperText, onClickHandler) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.marginTop = '20px';

    // OR Separator
    const separator = document.createElement('div');
    separator.style.display = 'flex';
    separator.style.alignItems = 'center';
    separator.style.textAlign = 'center';
    separator.style.color = '#999';
    separator.style.fontSize = '12px';
    separator.style.margin = '20px 0';
    separator.style.width = '100%';
    separator.innerHTML = `
        <span style="flex: 1; border-bottom: 1px solid #ccc; margin-right: 10px;"></span>
        <span>OR</span>
        <span style="flex: 1; border-bottom: 1px solid #ccc; margin-left: 10px;"></span>
    `;

    // MyWorkLog Sign In Button
    const button = document.createElement('button');
    button.textContent = helperText;
    button.style.padding = '10px 16px';
    button.style.border = '1px solid #ccc';
    button.style.borderRadius = '4px';
    button.style.backgroundColor = '#f7f7f7';
    button.style.cursor = 'pointer';
    button.style.fontWeight = 'bold';
    button.style.color = '#333';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.gap = '8px';

    // icon
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