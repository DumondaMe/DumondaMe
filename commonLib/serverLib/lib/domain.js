'use strict';

let getDomain = function () {
    let domain = 'http://localhost:8080/';

    if (process.env.NODE_ENV === 'production') {
        domain = 'https://www.elyoos.org/';
    } else if (process.env.NODE_ENV === 'development') {
        domain = 'https://preview.elyoos.org/';
    }
    return domain;
};

module.exports = {
    getDomain: getDomain
};
