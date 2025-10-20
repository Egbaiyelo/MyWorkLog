

export function FillLanguage() {
    const lang_section = document.querySelector('#Languages-section');
    const add_button = lang_section.querySelector('[data-automation-id="add-button"]');

    add_button.click();

}


export function FillSkills(skills) {
    const skills_section = document.querySelector('#skills--skills');

    for (const skill in skills) {
        skills_section.textContent = skill;
    }
}