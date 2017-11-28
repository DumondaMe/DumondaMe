'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/user/page/transitionConnect/sync/:pageId',  {pageId: '@pageId'} , {
        'update': {method: 'PUT'}});
}];
