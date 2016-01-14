'use strict';


module.exports = ['CreateProblemCheck', 'Problem', '$q',
    function (CreateProblemCheck, Problem, $q) {

        var uploadProblemIsRunning = false;
        this.upload = function (blogText) {
            var deferred = $q.defer();
            if (CreateProblemCheck.isSendProblemAllowed(blogText) && !uploadProblemIsRunning) {
                uploadProblemIsRunning = true;
                Problem.save({description: blogText}, function (resp) {
                    uploadProblemIsRunning = false;
                    resp.isAdmin = true;
                    deferred.resolve(resp);
                }, function () {
                    uploadProblemIsRunning = false;
                    deferred.reject({});
                });
            } else {
                deferred.reject({});
            }
            return deferred.promise;
        };
    }];
