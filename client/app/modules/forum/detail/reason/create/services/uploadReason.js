'use strict';


module.exports = ['CreateProblemReasonCheck', 'ProblemReason', '$q',
    function (CreateProblemReasonCheck, ProblemReason, $q) {

        var uploadReasonIsRunning = false;
        this.upload = function (titleReason, descriptionReason, problemId) {
            var deferred = $q.defer();
            if (CreateProblemReasonCheck.isSendReasonAllowed(titleReason, descriptionReason) && !uploadReasonIsRunning) {
                uploadReasonIsRunning = true;
                ProblemReason.save({createReason: {description: descriptionReason, title: titleReason, problemId: problemId}}, function (resp) {
                    uploadReasonIsRunning = false;
                    resp.isAdmin = true;
                    deferred.resolve(resp);
                }, function () {
                    uploadReasonIsRunning = false;
                    deferred.reject({});
                });
            } else {
                deferred.reject({});
            }
            return deferred.promise;
        };
    }];
