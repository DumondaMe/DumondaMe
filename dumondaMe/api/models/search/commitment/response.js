'use strict';

const slug = require('limax');
const cdn = require('dumonda-me-server-lib').cdn;

const getResponse = function (commitments) {
    let response = [];
    for (let commitment of commitments) {
        let commitmentResponse = {
            commitmentId: commitment.commitment.commitmentId,
            title: commitment.commitment.title,
            slug: slug(commitment.commitment.title),
            description: commitment.commitment.description,
            imageUrl: cdn.getPublicUrl(`commitment/${commitment.commitment.commitmentId}/120x120/title.jpg`,
                commitment.commitment.modified),
            isAdmin: commitment.isAdmin,
            numberOfWatches: commitment.numberOfWatches,
            isWatchedByUser: commitment.isWatchedByUser,
            regions: commitment.regions
        };
        response.push(commitmentResponse);
    }
    return response;
};

module.exports = {
    getResponse
};
