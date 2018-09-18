'use strict';

let dateParser = require('./dateParser');
let stringParser = require('./stringParser');
let logger = require('dumonda-me-server-lib').logging.getLogger(__filename);
let iCalProperties = require('./iCalProperties');

const UID = 'UID:';
const SUMMARY = 'SUMMARY:';
const DESCRIPTION = 'DESCRIPTION:';
const LOCATION = 'LOCATION:';
const GEO = 'GEO:';
const START_DATE_EVENT = 'DTSTART';
const END_DATE_EVENT = 'DTEND';

let multiIncludes = function (text, values) {
    let regExp = new RegExp(values.join('|'));
    return regExp.test(text);
};

let parseDescription = function (vEvent) {
    let index = vEvent.indexOf(DESCRIPTION), description = null;
    if (index !== -1) {
        let indexSeparator = vEvent.indexOf(':', index) + 1;
        let lines = vEvent.substring(indexSeparator).split('\n');
        description = [lines[0]];
        lines.shift();
        for (let line of lines) {
            if (multiIncludes(line, iCalProperties) || multiIncludes(line, ['VEVENT'])) {
                break;
            } else {
                description.push(line);
            }
        }
        description = description.join('\n');
    }
    return description;
};

let parseGeo = function (vEvent, uid) {
    let index = vEvent.indexOf(GEO), geo = null;
    if (index !== -1) {
        let indexSeparator = vEvent.indexOf(':', index) + 1;
        let lastIndexLine = vEvent.indexOf('\n', index);
        let geoCoordinates = vEvent.substring(indexSeparator, lastIndexLine).split(';');
        if (geoCoordinates.length === 2) {
            geo = {
                latitude: parseFloat(geoCoordinates[0]),
                longitude: parseFloat(geoCoordinates[1])
            };
        } else {
            logger.error(`Wrong geo coordinates ${geoCoordinates.join(';')} for event ${uid}`);
        }
    }
    return geo;
};

let parseEvent = function (vEvent) {
    let event = {};
    event.uid = stringParser.parseString(vEvent, UID, true);
    event.summary = stringParser.parseString(vEvent, SUMMARY, true);
    event.description = parseDescription(vEvent);
    event.location = stringParser.parseString(vEvent, LOCATION, false);
    event.geo = parseGeo(vEvent, event.uid);
    event.startDate = dateParser.parseDate(vEvent, START_DATE_EVENT, true);
    event.endDate = dateParser.parseDate(vEvent, END_DATE_EVENT, true);
    return event;
};

module.exports = {
    parseEvent
};
