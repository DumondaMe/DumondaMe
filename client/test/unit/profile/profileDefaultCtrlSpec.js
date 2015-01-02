'use strict';

var ProfileDefaultCtrl = require('../../../app/modules/profile/profileDefaultCtrl')[3];

describe('Tests of Profile Default Controller', function () {
    var testee, scope, q, HttpService, timeout;

    beforeEach(function (done) {
        inject(function ($rootScope, $filter, $q, $timeout) {

            scope = $rootScope.$new();
            q = $q;
            timeout = $timeout;

            HttpService = {
                sendPostRequest: function () {
                }
            };
            scope.user = {};
            testee = new ProfileDefaultCtrl(scope, $filter, HttpService);
            done();
        });
    });

    it('Successful submit Data to the server', function () {

        scope.profileForm = {
            $invalid: false,
            $setPristine: function () {
            }
        };

        scope.user = {
            forename: 'Hans',
            surname: 'Wurst',
            birthday: '2002-02-02',
            street: 'hansdampf',
            place: 'irgendwo',
            country: 'nirgendwo',
            female: false
        };

        scope.userDataToChange = {
            forename: 'Hans2',
            surname: 'Wurst2',
            birthday: '2002-02-03',
            street: 'hansdampf2',
            place: 'irgendwo2',
            country: 'nirgendwo2',
            female: true
        };

        var stubHttpService = sinon.stub(HttpService, 'sendPostRequest');
        stubHttpService.returns(q.when());

        scope.submitProfileData();

        timeout.flush();

        expect(scope.submitFailed).to.be.false;
        expect(scope.successUserDataChange).to.be.true;
        expect(scope.submitFailedToServer).to.be.false;

        expect(scope.user.forename).to.equal(scope.userDataToChange.forename);
        expect(scope.user.surname).to.equal(scope.userDataToChange.surname);
        expect(scope.user.birthday).to.equal(scope.userDataToChange.birthday);
        expect(scope.user.street).to.equal(scope.userDataToChange.street);
        expect(scope.user.place).to.equal(scope.userDataToChange.place);
        expect(scope.user.country).to.equal(scope.userDataToChange.country);
        expect(scope.user.female).to.equal(scope.userDataToChange.female);
    });

    it('Invalid form data. Data not sent to server', function () {

        scope.profileForm = {
            $invalid: true,
            $setPristine: function () {
            }
        };
        scope.submitFailed = false;

        scope.submitProfileData();

        expect(scope.submitFailed).to.be.true;
    });

    it('Error occurred while sending data. User data are not updated', function () {

        scope.profileForm = {
            $invalid: false,
            $setPristine: function () {
            }
        };
        scope.submitFailed = false;

        scope.user = {
            forename: 'Hans',
            surname: 'Wurst',
            birthday: '2002-02-02',
            street: 'hansdampf',
            place: 'irgendwo',
            country: 'nirgendwo',
            female: false
        };

        scope.userDataToChange = {
            forename: 'Hans2',
            surname: 'Wurst2',
            birthday: '2002-02-03',
            street: 'hansdampf2',
            place: 'irgendwo2',
            country: 'nirgendwo2',
            female: true
        };

        var stubHttpService = sinon.stub(HttpService, 'sendPostRequest');
        stubHttpService.returns(q.reject());

        scope.submitProfileData();

        timeout.flush();

        expect(scope.submitFailed).to.be.false;
        expect(scope.successUserDataChange).to.be.false;
        expect(scope.submitFailedToServer).to.be.true;

        expect(scope.user.forename).to.equal('Hans');
        expect(scope.user.surname).to.equal('Wurst');
        expect(scope.user.birthday).to.equal('2002-02-02');
        expect(scope.user.street).to.equal('hansdampf');
        expect(scope.user.place).to.equal('irgendwo');
        expect(scope.user.country).to.equal('nirgendwo');
        expect(scope.user.female).to.equal(false);
    });

    it('Setting userDataToChange.female when user is not defined set to default value false', function () {
        expect(scope.userDataToChange.female).to.be.true;
    });
});
