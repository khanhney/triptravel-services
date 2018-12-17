var languageKey = "";

function getLanguage(key) {
    if (langModule[key] && langModule[key][languageKey]) {
        return langModule[key][languageKey];
    } else {
        return key;
    }
}