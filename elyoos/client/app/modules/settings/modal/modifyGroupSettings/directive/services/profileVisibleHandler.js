'use strict';

module.exports = [
    function () {

        this.setProfileVisibleChanged = function (setting) {
            if(setting.profileVisible) {
                setting.contactsVisible = true;
                setting.imageVisible = true;
                setting.profileDataVisible = true;
                setting.pinwallVisible = true;
            } else {
                setting.contactsVisible = false;
                setting.imageVisible = false;
                setting.profileDataVisible = false;
                setting.pinwallVisible = false;
            }
        };

        this.setProfileChanged = function (setting) {

            if(!setting.contactsVisible && !setting.imageVisible && !setting.profileDataVisible && !setting.pinwallVisible) {
                setting.profileVisible = false;
            }
        };
    }]
;
