'use strict';

var Testee = require('../../../../../app/modules/util/userInfo/services/contactGroupUpdate')[1];
var helper = require('../../../../../app/modules/util/helper/arrayHelper')[0];
var testee = new Testee(new helper());

describe('Tests for update the contact group statistic', function () {

    it('Update with same group but different contact count', function () {

        var originalGroup = [{group: 'Test', count: 2}, {group: 'Test2', count: 3}],
            newGroup = [{group: 'Test', count: 5}, {group: 'Test2', count: 2}];

        testee.update(originalGroup, newGroup);

        expect(originalGroup.length).to.equal(2);
        expect(originalGroup[0].group).to.equal("Test");
        expect(originalGroup[0].count).to.equal(5);
        expect(originalGroup[1].group).to.equal("Test2");
        expect(originalGroup[1].count).to.equal(2);
    });


    it('Update with additional group and different contact count', function () {

        var originalGroup = [{group: 'Test', count: 2}, {group: 'Test2', count: 3}],
            newGroup = [{group: 'Test', count: 4}, {group: 'Test2', count: 2}, {group: 'Test3', count: 3}];

        testee.update(originalGroup, newGroup);

        expect(originalGroup.length).to.equal(3);
        expect(originalGroup[0].group).to.equal("Test");
        expect(originalGroup[0].count).to.equal(4);
        expect(originalGroup[1].group).to.equal("Test2");
        expect(originalGroup[1].count).to.equal(2);
        expect(originalGroup[2].group).to.equal("Test3");
        expect(originalGroup[2].count).to.equal(3);
    });

    it('Update and remove group', function () {

        var originalGroup = [{group: 'Test', count: 2}, {group: 'Test2', count: 3}],
            newGroup = [{group: 'Test', count: 4}];

        testee.update(originalGroup, newGroup);

        expect(originalGroup.length).to.equal(1);
        expect(originalGroup[0].group).to.equal("Test");
        expect(originalGroup[0].count).to.equal(4);
    });
});
