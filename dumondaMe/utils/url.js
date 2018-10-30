export default function checkUrl(withProtocol) {

    let protocol = ``;
    if (withProtocol) {
        protocol = `^(http|https)://`;
    }
    const domain = '([a-z\\u00a1-\\uffff0-9\\-\\_]+\\.){1,}';
    const tld = `[a-z\\u00a1-\\uffff\/]{2,}`;
    const regex = `${protocol}${domain}${tld}`;

    return new RegExp(`${regex}`, 'i');
};