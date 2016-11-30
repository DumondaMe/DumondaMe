'use strict';

var topics = [{description: 'Gesundheit', code: 'health', acronym: 'G'},
    {description: 'Umwelt', code: 'environmental', acronym: 'U'},
    {description: 'Spiritualität', code: 'spiritual', acronym: 'S'},
    {description: 'Bildung', code: 'education', acronym: 'B'},
    {description: 'Persönliche Entwicklung', code: 'personalDevelopment', acronym: 'PE'},
    {description: 'Politik', code: 'politics', acronym: 'P'},
    {description: 'Wirtschaft', code: 'economy', acronym: 'W'},
    {description: 'Gesellschaft', code: 'socialDevelopment', acronym: 'GE'}];

var getTopicElement = function (code, element) {
    var result = topics[0][element];
    angular.forEach(topics, function (topic) {
        if (topic.code === code) {
            result = topic[element];
        }
    });
    return result;
};

module.exports = ['$log',
    function ($log) {
        var service = this;
        service.topics = topics;

        service.getCode = function (description) {
            var result = false;
            angular.forEach(topics, function (topic) {
                if (topic.description === description) {
                    result = topic.code;
                }
            });
            return result;
        };

        service.getTopic = function (code) {
            return getTopicElement(code, 'description');
        };

        service.getAcronym = function (code) {
            return getTopicElement(code, 'acronym');
        };

        service.getTopics = function (codes) {
            var result = [];
            if (angular.isArray(codes)) {
                angular.forEach(codes, function (code) {
                    angular.forEach(topics, function (topic) {
                        if (topic.code === code) {
                            result.push(topic);
                        }
                    });
                });
            }
            return result;
        };

        service.getCodes = function (topicsToGetCodes) {
            var result = [];
            if (angular.isArray(topicsToGetCodes)) {
                angular.forEach(topicsToGetCodes, function (topic) {
                    if (topic.hasOwnProperty('code')) {
                        result.push(topic.code);
                    } else {
                        $log.warn('property code does not exit!');
                    }
                });
            }
            return result;
        };
    }];
