export default {
    parse: function (url) {
        return url.substr(url.indexOf('?code=') + 6);
    }
}