'use strict';

let db = requireDb();

let setUserLocation = function (userId, location) {
    return db.cypher().match('(u:User {userId: {userId}})')
        .set('u', {userLocationDescription: location.description, latitude: location.latitude, longitude: location.longitude})
        .end({userId: userId}).send();
};

let deleteUserLocation = function (userId) {
    return db.cypher().match('(u:User {userId: {userId}})')
        .remove('u.userLocationDescription')
        .set('u', {latitude: 0, longitude: 0})
        .end({userId: userId}).send();
};

module.exports = {
    setUserLocation: setUserLocation,
    deleteUserLocation: deleteUserLocation
};
