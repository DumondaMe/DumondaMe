'use strict';

var topics = [{description: 'Gesundheit', code: 'health'},
    {description: 'Umwelt', code: 'environmental'},
    {description: 'Spiritualität', code: 'spiritual'},
    {description: 'Bildung', code: 'education'},
    {description: 'Persönliche Entwicklung', code: 'personalDevelopment'},
    {description: 'Politik', code: 'politics'},
    {description: 'Wirtschaft', code: 'economy'},
    {description: 'Gesellschaft', code: 'socialDevelopment'}];

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
            var result = topics[0].description;
            angular.forEach(topics, function (topic) {
                if (topic.code === code) {
                    result = topic.description;
                }
            });
            return result;
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
