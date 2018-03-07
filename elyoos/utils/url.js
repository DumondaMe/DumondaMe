module.exports = () => {

    const protocol = `^(http|https)://`;
    const domain = '([a-z\\u00a1-\\uffff0-9]+\\.)+';
    const tld = `([a-z\\u00a1-\\uffff]{2,})+`;
    const regex = `${protocol}${domain}${tld}`;

    return new RegExp(`${regex}`, 'i');
};