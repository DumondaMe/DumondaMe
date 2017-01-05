'use strict';

let userInfo = require('../../user/userInfo');
let administrator = require('./administrator');
let recommendation = require('./recommendation');

let getResponse = function (resp, page, pageId, userId) {

    let returnValue, isAdmin = administrator.isUserAdministrator(resp[0]);
    userInfo.addImageForPreview(resp[0]);
    returnValue = {
        page: page,
        administrators: {
            list: resp[0],
            isAdmin: isAdmin
        },
        recommendation: {
            summary: {
                all: resp[2][0],
                contact: resp[3][0]
            }
        }
    };
    if (resp[1] && resp[1][0]) {
        recommendation.addProfileThumbnail(resp[1][0], userId);
        returnValue.recommendation.user = resp[1][0];
    }
    return returnValue;
};

module.exports = {
    getResponse: getResponse
};
