'use strict';

module.exports = [
    function () {


        this.getMessage = function (setting) {
            var message;
            if (!setting.type) {
                message = {
                    changePrivacyNoContactSetting: {
                        privacySettings: {
                            profileVisible: setting.profileVisible,
                            contactsVisible: setting.contactsVisible,
                            imageVisible: setting.imageVisible,
                            profileDataVisible: setting.profileDataVisible
                        }
                    }
                }
            } else {
                message = {
                    changePrivacySetting: {
                        privacySettings: {
                            profileVisible: setting.profileVisible,
                            contactsVisible: setting.contactsVisible,
                            imageVisible: setting.imageVisible,
                            profileDataVisible: setting.profileDataVisible
                        }, privacyDescription: setting.type
                    }
                }
            }
            return message
        };
    }]
;
