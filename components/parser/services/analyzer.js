async function analyzer(savedData) {

    let jsObject = [...new Set(Array.from(savedData))];
    let regexBeginning = /^\/url\?q=/;
    let excludeUrlRegex = /\.*^https:\/\/accounts\.google\.com\/ServiceLogin\.*/;
    let jsObjectSanitized = [];

    function urlSanitize(value) {
        if (regexBeginning.test(value)) {
            return value.slice(value.indexOf("=") + 1, value.indexOf("&"))
        }
    }

    jsObject.forEach(value => {
        value = urlSanitize(value);
        if (value && !excludeUrlRegex.test(value)) {
            jsObjectSanitized.push({href: value})
        }
    });

    return jsObjectSanitized;
}

module.exports = analyzer;
