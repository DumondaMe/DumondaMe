'use strict';

module.exports = ['HomeResultSearchResponseConverter', function (HomeResultSearchResponseConverter) {
    var ctrl = this;
    
    ctrl.resultConverted = HomeResultSearchResponseConverter.convert(ctrl.searchResult);
}];

