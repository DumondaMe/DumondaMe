'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/admin/feedback/delete/discussion', null, {'delete': {method: 'POST', headers: {'X-HTTP-Method-Override': 'DELETE'}}});
}];
