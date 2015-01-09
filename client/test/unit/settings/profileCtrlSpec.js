'use strict';

var ProfileCtrl = require('../../../app/modules/settings/profileCtrl')[3];

describe('Tests of Profile Default Controller', function () {
    var testee, scope, q, HttpService, timeout;

    beforeEach(function (done) {
        inject(function ($rootScope, $filter, $q, $timeout) {

            scope = $rootScope.$new();
            q = $q;
            timeout = $timeout;

            HttpService = {
                sendPostRequest: function () {
                },
                sendGetRequest: function () {
                    return q.defer().promise;
                }
            };
            scope.user = {};
            testee = new ProfileCtrl(scope, $filter, HttpService);
            done();
        });
    });

    it('Successful submit Data to the server', function () {

        scope.profileForm = {
            $invalid: false,
            $setPristine: function () {
            }
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

        scope.userDataToChange = {
            forename: 'Hans',
            surname: 'Wurst',
            birthday: '2002-02-02',
            street: 'hansdampf',
            place: 'irgendwo',
            country: 'nirgendwo',
            female: false
        };

        var stubHttpService = sinon.stub(HttpService, 'sendPostRequest');
        stubHttpService.returns(q.reject());

        scope.submitProfileData();

        timeout.flush();

        expect(scope.submitFailed).to.be.false;
        expect(scope.successUserDataChange).to.be.false;
        expect(scope.submitFailedToServer).to.be.true;
    });
});
