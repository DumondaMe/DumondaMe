'use strict';

module.exports = [function () {

    this.isValidFileFormat = function (fileName, supportedFiles) {
        var extension, isValid = false;
        if (angular.isString(fileName) && angular.isString(supportedFiles)) {
            extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
            if (supportedFiles.indexOf(extension) >= 0) {
                isValid = true;
            }
        }
        return isValid;
    };
}];
