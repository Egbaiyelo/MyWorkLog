
// Emmet style element creator 
// Usage tag .class ... #id ...
export function forgeElement(query){
    const tokens = query.split(' ');
    const elemTag = tokens.shift();

    const elem = document.createElement(elemTag);

    tokens.forEach(token => {
        if (token.startsWith('.')) {
            elem.classList.add(token.slice(1));
        } else if (token.startsWith('#')) {
            elem.id = token.slice(1);
        }
    });

    return elem;
}