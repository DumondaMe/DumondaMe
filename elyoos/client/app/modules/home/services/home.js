'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/user/home', null, {
        'get': {method: 'GET'}
    });
}];
