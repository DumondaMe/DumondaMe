'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/user/recommendation/page', null, {
        'delete': {method: 'POST', headers: {'X-HTTP-Method-Override': 'DELETE'}}
    });
}];
