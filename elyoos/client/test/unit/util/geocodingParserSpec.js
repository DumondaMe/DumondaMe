'use strict';

var Parser = require('../../../app/modules/util/geocodingParser.js')[0];
var testee = new Parser();

describe('Tests of the geocoding parser', function () {

    it('Parse autocomplete mapzen response', function () {

        var result = testee.parseAutoComplete({
            data: {
                features: [
                    {
                        type: "Feature",
                        geometry: {type: "Point", coordinates: [-0.125422, 51.501581]},
                        properties: {label: "London, England, United Kingdom"}
                    },
                    {
                        type: "Feature",
                        geometry: {type: "Point", coordinates: [-0.125423, 51.501582]},
                        properties: {label: "LONDON, England, United Kingdom2"}
                    },
                    {
                        type: "Feature",
                        geometry: {type: "Point", coordinates: [-0.125424, 51.501583]},
                        properties: {label: "London, England, United Kingdom3"}
                    }
                ]
            }
        }, "ondo");

        expect(result.length).to.equal(3);
        expect(result[0].address).to.equal("L<b>ondo</b>n, England, United Kingdom");
        expect(result[0].latitude).to.equal(51.501581);
        expect(result[0].longitude).to.equal(-0.125422);

        expect(result[1].address).to.equal("L<b>ONDO</b>N, England, United Kingdom2");
        expect(result[1].latitude).to.equal(51.501582);
        expect(result[1].longitude).to.equal(-0.125423);

        expect(result[2].address).to.equal("L<b>ondo</b>n, England, United Kingdom3");
        expect(result[2].latitude).to.equal(51.501583);
        expect(result[2].longitude).to.equal(-0.125424);
    });
});
