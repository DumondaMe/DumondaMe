'use strict';

let moment = require('moment');
let stringParser = require('./stringParser');

const GOOGLE_VALUE_DATE = ';VALUE=DATE:';
const TZID = ';TZID=';

let getUtcTimestamp = function (timestamp) {
    return moment.utc(timestamp, "YYYYMMDDTHHmmss").utc().valueOf() / 1000;
};

let getUtcTimestampParsedWithOffset = function (value) {
    let offset = value.substring(value.indexOf(TZID) + TZID.length + 3, value.indexOf(':'));
    let time = value.substring(value.indexOf(':') + 1);
    return moment.utc(`${time} ${offset}000`, "YYYYMMDDTHHmmss Z").utc().valueOf() / 1000;
};

let isGoogleDate = function (date) {
    return date.indexOf(GOOGLE_VALUE_DATE) !== -1;
};

let isUtcTimestamp = function (date) {
    return date.indexOf(':') === 0 && date.indexOf('Z') !== -1;
};

let hasTZIDProperty = function (date) {
    return date.indexOf(TZID) !== -1;
};

let parseDate = function (vEvent, property, isMandatory) {
    let startIndex = vEvent.indexOf(property);
    let result;
    if (startIndex !== -1) {
        let value = vEvent.substring(startIndex + property.length, vEvent.indexOf('\n', startIndex));
        if (isGoogleDate(value)) {
            result = getUtcTimestamp(value.substring(GOOGLE_VALUE_DATE.length) + 'T000000Z');
        } else if (isUtcTimestamp(value)) {
            result = getUtcTimestamp(stringParser.parseString(vEvent, property, isMandatory));
        } else if (hasTZIDProperty(value)) {
            result = getUtcTimestampParsedWithOffset(value);
        }
    }
    return result;
};

module.exports = {
    parseDate
};
