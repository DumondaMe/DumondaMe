'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/forum/question/popular');
}];
