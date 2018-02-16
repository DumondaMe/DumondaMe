'use strict';

let cdn = require('elyoos-server-lib').cdn;
let _ = require("lodash");

let getImageForPreview = async function (contact, profileType) {
    return await cdn.getSignedUrl('profileImage/' + contact.userId + '/' + profileType);
    //return cdn.getUrl('profileImage/default/' + profileType);

};

let addImage = async function (contacts, imageTyp) {
    for (let contact of contacts) {
        contact.profileUrl = await getImageForPreview(contact, imageTyp);
    }
};

let addImageForPreview = async function (contacts) {
    await addImage(contacts, 'profilePreview.jpg');
};

let addImageForThumbnail = async function (contacts) {
    await addImage(contacts, 'thumbnail.jpg');
};

let setUserImageVisible = function (userId, contacts) {
    _.each(contacts, function (contact) {
        if (contact.userId === userId) {
            contact.profileVisible = true;
            contact.imageVisible = true;
        }
    });
};

module.exports = {
    getImageForPreview: getImageForPreview,
    addImageForPreview: addImageForPreview,
    addImageForThumbnail: addImageForThumbnail,
    setUserImageVisible: setUserImageVisible,
    addContactPreviewInfos: function (contacts) {
        addImageForThumbnail(contacts);
    }
};
