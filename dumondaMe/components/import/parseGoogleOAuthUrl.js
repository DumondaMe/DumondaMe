export default {
    parse: function (url) {
        let indexScope = url.indexOf('&scope=');
        let indexCode = url.indexOf('?code=') + 6;
        return url.substr(indexCode, indexScope - indexCode);
    }
}