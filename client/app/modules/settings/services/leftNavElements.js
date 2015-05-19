'use strict';

module.exports = [
    function () {
        this.event = 'elyoos.leftNav.changed';

        this.elements = [
            {description: 'Profile', url: 'app/img/defaultProfile.png', color: '#009688', sref: 'settings.profile'},
            {description: 'Privatsph\u00e4re', url: 'app/img/security.png', color: '#FFA000', sref: 'settings.privacy'},
            {description: 'Home', url: 'app/img/home.png', color: '#B3C833', sref: 'home'}];
    }];
