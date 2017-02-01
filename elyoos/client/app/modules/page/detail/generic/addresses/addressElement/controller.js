'use strict';

module.exports = ['$mdDialog', 'PageAddress', 'errorToast', 'ArrayHelper', 'ElyModal',
    function ($mdDialog, PageAddress, errorToast, ArrayHelper, ElyModal) {
        var ctrl = this;

        ctrl.deleteAddress = function (addressToDelete) {
            var confirm = $mdDialog.confirm()
                .title("Adresse " + addressToDelete.address + " löschen")
                .textContent("Willst Du diese Adresse wirklich löschen?")
                .ariaLabel("Delete Address")
                .ok("Löschen")
                .cancel("Abbrechen");
            $mdDialog.show(confirm).then(function () {
                PageAddress.delete({addressId: addressToDelete.addressId}, function () {
                    ArrayHelper.removeElement(ctrl.addresses, 'addressId', addressToDelete.addressId);
                }, function () {
                    errorToast.showError("Fehler beim Löschen der Addresse");
                });
            });
        };

        ctrl.editAddress = function (addressToEdit, index) {
            ElyModal.show('ManageAddressCtrl', 'app/modules/page/modal/manageAddress/template.html', {
                isEditMode: true, addressId: addressToEdit.addressId, description: addressToEdit.description
            }).then(function (resp) {
                ctrl.addresses[index] = resp;
            });
        };
    }];

