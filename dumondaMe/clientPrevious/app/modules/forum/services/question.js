'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/user/forum/question', null, {'delete': {method: 'POST', headers: {'X-HTTP-Method-Override': 'DELETE'}}});
}];
