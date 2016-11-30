'use strict';

module.exports = ['$resource', function ($resource) {

    return $resource('/api/user/contact', null, {
        'delete': {method: 'POST', headers: {'X-HTTP-Method-Override': 'DELETE'}}
    });
}];
