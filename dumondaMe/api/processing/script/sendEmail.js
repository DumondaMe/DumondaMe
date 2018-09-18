'use strict';

let email = require('dumonda-me-server-lib').eMail;
let tmp = require('tmp');
let cdn = require('dumonda-me-server-lib').cdn;
let fs = require('fs');
let logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

let getUserImage = async function (userId) {
    let imageData, userImage = tmp.fileSync({postfix: '.jpg'});
    imageData = await cdn.getObject(`profileImage/${userId}/profile.jpg`, process.env.BUCKET_PRIVATE);
    fs.writeFileSync(userImage.name, imageData.Body);
    return userImage;
};

let sendEmail = async function () {
    await email.sendEMail("invitePerson", {name: 'Roger Waldvogel', userId: '0', userImage: await getUserImage('0')},
        'de', 'climberwoodi@gmx.ch');
    logger.info('Sent email');
};

module.exports = {
    sendEmail
};
