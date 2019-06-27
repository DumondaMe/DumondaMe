'use strict';

module.exports = [function () {

    var detailCollection;
    this.set = function (detail) {
        detailCollection = detail;
    };

    this.addExplanation = function (explanation) {
        if (detailCollection && angular.isArray(detailCollection.explanation)) {
            detailCollection.explanation.push(explanation);
        }
    };

    this.addSolution = function (solution) {
        if (detailCollection && angular.isArray(detailCollection.solution)) {
            detailCollection.solution.push(solution);
        }
    };
}];
