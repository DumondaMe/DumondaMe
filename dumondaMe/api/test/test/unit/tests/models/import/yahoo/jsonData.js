'use strict';

let getTestData = function () {
    return `{"contacts":
{"contact":[{"isConnection":false,
"id":1,
"fields":[{"id":1,"type":"name","value":{"givenName":"Hans","middleName":"","familyName":"Muster","prefix":"","suffix":"","givenNameSound":"","familyNameSound":""},"editedBy":"OWNER","flags":[],"categories":[],"updated":"2017-02-19T16:21:05Z","created":"2017-02-19T16:21:05Z","uri":"http://social.yahooapis.com/v1/user/BNEIPSXD5OZFVJMQK6S4RMSQNI/contact/1/name/1"},
{"id":2,"type":"email","value":"test@elyoos.org","editedBy":"OWNER","flags":[],"categories":[],"updated":"2017-02-19T16:21:05Z","created":"2017-02-19T16:21:05Z","uri":"http://social.yahooapis.com/v1/user/BNEIPSXD5OZFVJMQK6S4RMSQNI/contact/1/email/2"}],"categories":[{"id":-5555,"created":"2017-02-19T16:21:37Z","updated":"2017-02-19T16:21:37Z","uri":"http://social.yahooapis.com/v1/user/BNEIPSXD5OZFVJMQK6S4RMSQNI/contact/1/category/"}],"error":0,"restoredId":0,"created":"2017-02-19T16:21:05Z","updated":"2017-02-19T16:21:05Z","uri":"http://social.yahooapis.com/v1/user/BNEIPSXD5OZFVJMQK6S4RMSQNI/contact/1"},{"isConnection":false,"id":2,"fields":[{"id":1,"type":"email","value":"test2@elyoos.org","editedBy":"OWNER","flags":[],"categories":[],"updated":"2017-02-19T16:21:21Z","created":"2017-02-19T16:21:21Z","uri":"http://social.yahooapis.com/v1/user/BNEIPSXD5OZFVJMQK6S4RMSQNI/contact/2/email/1"}],"categories":[{"id":-5555,"created":"2017-02-19T16:21:37Z","updated":"2017-02-19T16:21:37Z","uri":"http://social.yahooapis.com/v1/user/BNEIPSXD5OZFVJMQK6S4RMSQNI/contact/2/category/"}],"error":0,"restoredId":0,"created":"2017-02-19T16:21:21Z","updated":"2017-02-19T16:21:21Z","uri":"http://social.yahooapis.com/v1/user/BNEIPSXD5OZFVJMQK6S4RMSQNI/contact/2"}],"count":2,"total":2,"start":0,"uri":"http://social.yahooapis.com/v1/user/BNEIPSXD5OZFVJMQK6S4RMSQNI/contacts"}}`;
};

module.exports = {
    getTestData: getTestData
};
