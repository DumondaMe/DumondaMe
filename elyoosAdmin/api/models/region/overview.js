'use strict';

const topRegions = require('./topRegions');

const getResponse = function (regions) {
    let response = [];
    for (let region of regions) {
        response.push({
            regionId: region.region.regionId,
            parentRegionId: 'international',
            de: region.region.de,
            en: region.region.en,
            numberOfSubRegions: region.numberOfSubRegions
        });
    }
    return response;
};

const getOverview = async function (language) {
    let resp = await topRegions.getTopRegions(language).send();
    return {regions: getResponse(resp)};
};

module.exports = {
    getOverview
};
