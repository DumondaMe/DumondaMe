angular.module('elyoosApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/modules/auth/login.html',
    "<div id=\"loginform\">\n" +
    "    <div id=\"error-message\" class=\"alert alert-danger\" role=\"alert\" ng-if=\"error\">\n" +
    "        {{error}}\n" +
    "    </div>\n" +
    "    <form class=\"form-horizontal\" name=\"loginForm\" role=\"form\" novalidate=\"novalidate\">\n" +
    "        <div class=\"form-group\">\n" +
    "            <label for=\"id_username\" class=\"col-sm-2 control-label\">Email</label>\n" +
    "\n" +
    "            <div class=\"col-sm-10\">\n" +
    "                <input type=\"email\" name=\"username\" ng-model=\"loginuser.email\"\n" +
    "                       class=\"form-control\" id=\"id_username\" autofocus=\"autofocus\"\n" +
    "                       placeholder=\"Email\" required>\n" +
    "                <span class=\"error\" ng-show=\"loginForm.inputEmail.$error.email\">\n" +
    "    Keine gültige E-Mail Adresse!</span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label for=\"id_password\" class=\"col-sm-2 control-label\">Passwort</label>\n" +
    "\n" +
    "            <div class=\"col-sm-10\">\n" +
    "                <input type=\"password\" ng-model=\"loginuser.password\" class=\"form-control\"\n" +
    "                       id=\"id_password\" name=\"password\"\n" +
    "                       placeholder=\"Passwort\" required>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <div class=\"col-sm-offset-2 col-sm-10\">\n" +
    "                <button id=\"login\" type=\"submit\" class=\"btn btn-default\" ng-click=\"login()\"\n" +
    "                        ng-disabled=\"loginForm.$invalid\">\n" +
    "                    Anmelden\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</div>"
  );


  $templateCache.put('app/modules/auth/register.html',
    "<div id=\"content-settings-profile\">\n" +
    "    <div id=\"centerCol\">\n" +
    "        <div id=\"inner-centerCol\">\n" +
    "            <div id=\"manage-profile\">\n" +
    "                <form class=\"form-horizontal\" name=\"profileForm\" role=\"form\" novalidate>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label for=\"inputEmail\" class=\"col-sm-4 control-label\">E-Mail</label>\n" +
    "\n" +
    "                        <div class=\"col-sm-8\">\n" +
    "                            <input name=\"inputEmail\" ng-model=\"userDataToChange.email\"\n" +
    "                                   class=\"form-control\"\n" +
    "                                   id=\"inputEmail\"\n" +
    "                                   placeholder=\"Email\">\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label for=\"inputPassword\" class=\"col-sm-4 control-label\">Passwort</label>\n" +
    "\n" +
    "                        <div class=\"col-sm-8\">\n" +
    "                            <input name=\"inputEmail\" ng-model=\"userDataToChange.password\"\n" +
    "                                   class=\"form-control\"\n" +
    "                                   id=\"inputPassword\">\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\"\n" +
    "                         ng-class=\"{'has-error': profileForm.inputForename.$invalid && (visitedForename || submitFailed)}\">\n" +
    "                        <label for=\"inputForenameId\" class=\"col-sm-4 control-label\">Vorname\n" +
    "                        </label>\n" +
    "\n" +
    "                        <div class=\"col-sm-8\">\n" +
    "                            <input name=\"inputForename\" ng-model=\"userDataToChange.forename\"\n" +
    "                                   class=\"form-control\"\n" +
    "                                   id=\"inputForenameId\" ng-blur=\"visitedForename = true\"\n" +
    "                                   placeholder=\"Vorname\" required ng-maxlength=\"30\">\n" +
    "\n" +
    "                            <div class=\"alert-input alert-danger\"\n" +
    "                                 ng-show=\"profileForm.inputForename.$error.required && (visitedForename || submitFailed)\">\n" +
    "                                <span>Es wird ein Vorname benötigt</span>\n" +
    "                            </div>\n" +
    "                            <div class=\"alert-input alert-danger\"\n" +
    "                                 ng-show=\"profileForm.inputForename.$error.maxlength && (visitedForename || submitFailed)\">\n" +
    "                                <span>Der Vorname darf nicht länger als 30 Zeichen sein</span>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\"\n" +
    "                         ng-class=\"{'has-error': profileForm.inputSurename.$invalid && (visitedSurename || submitFailed)}\">\n" +
    "                        <label for=\"inputSurename\" class=\"col-sm-4 control-label\">Nachname</label>\n" +
    "\n" +
    "                        <div class=\"col-sm-8\">\n" +
    "                            <input name=\"inputSurename\" ng-model=\"userDataToChange.surname\"\n" +
    "                                   class=\"form-control\"\n" +
    "                                   id=\"inputSurename\" ng-blur=\"visitedSurename = true\"\n" +
    "                                   placeholder=\"Nachname\" required ng-maxlength=\"50\">\n" +
    "\n" +
    "                            <div class=\"alert-input alert-danger\"\n" +
    "                                 ng-show=\"profileForm.inputSurename.$error.required && (visitedSurename || submitFailed)\">\n" +
    "                                <span>Es wird ein Nachname benötigt</span>\n" +
    "                            </div>\n" +
    "                            <div class=\"alert-input alert-danger\"\n" +
    "                                 ng-show=\"profileForm.inputSurename.$error.maxlength && (visitedSurename || submitFailed)\">\n" +
    "                                <span>Der Nachname darf nicht länger als 50 Zeichen sein</span>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\"\n" +
    "                         ng-class=\"{'has-error': profileForm.inputBirthday.$invalid && (visitedBirthday || submitFailed)}\">\n" +
    "                        <label for=\"inputBirthday\" class=\"col-sm-4 control-label\">Geburtstag</label>\n" +
    "\n" +
    "                        <div class=\"col-sm-8\">\n" +
    "                            <input name=\"inputBirthday\" ng-model=\"userDataToChange.birthday\"\n" +
    "                                   class=\"form-control\"\n" +
    "                                   id=\"inputBirthday\" ng-blur=\"visitedBirthday = true\"\n" +
    "                                   placeholder=\"z.B {{getDateExample()}}\" required/>\n" +
    "\n" +
    "                            <div class=\"alert-input alert-danger\"\n" +
    "                                 ng-show=\"profileForm.inputBirthday.$error.required && (visitedBirthday || submitFailed)\">\n" +
    "                                <span>Bitte gib deinen Geburtstag an</span>\n" +
    "                            </div>\n" +
    "                            <div class=\"alert-input alert-danger\"\n" +
    "                                 ng-show=\"profileForm.inputBirthday.$error.date && (visitedBirthday || submitFailed)\">\n" +
    "                                <span>Gib einen gültigen Geburtstag ein (z.B. {{getDateExample()}})</span>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\"\n" +
    "                         ng-class=\"{'has-error': profileForm.inputCountry.$invalid && (visitedCountry || submitFailed)}\">\n" +
    "                        <label for=\"inputCountryId\" class=\"col-sm-4 control-label\">Land</label>\n" +
    "\n" +
    "                        <div class=\"col-sm-8\">\n" +
    "                            <button type=\"button\" class=\"btn btn-default\" ng-model=\"selectedCountryCode\"\n" +
    "                                    name=\"inputCountry\"\n" +
    "                                    id=\"inputCountryId\"\n" +
    "                                    bs-options=\"countryCode.country as countryCode.country for countryCode in countryCodes\"\n" +
    "                                    data-placeholder=\"Land\"\n" +
    "                                    bs-select>\n" +
    "                                Action <span class=\"caret\"></span>\n" +
    "                            </button>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label for=\"inputGender\" class=\"col-sm-4 control-label\">Geschlecht</label>\n" +
    "\n" +
    "                        <div class=\"col-sm-8\">\n" +
    "                            <div class=\"btn-group\" id=\"inputGender\">\n" +
    "                                <label class=\"btn btn-default\"\n" +
    "                                       ng-click=\"userDataToChange.female = true; profileForm.$setDirty()\"\n" +
    "                                       ng-class=\"{'active': userDataToChange.female == true}\">Frau</label>\n" +
    "                                <label class=\"btn btn-default\"\n" +
    "                                       ng-click=\"userDataToChange.female = false; profileForm.$setDirty()\"\n" +
    "                                       ng-class=\"{'active': userDataToChange.female == false}\">Mann</label>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <div class=\"col-sm-offset-4 col-sm-8\">\n" +
    "                            <div>\n" +
    "                                <button id=\"submit-change-profile\" type=\"submit\"\n" +
    "                                        class=\"btn btn-default\"\n" +
    "                                        ng-click=\"submitProfileData()\">\n" +
    "                                    Profil erstellen\n" +
    "                                </button>\n" +
    "                            </div>\n" +
    "                            <div class=\"alert-input alert-danger\"\n" +
    "                                 ng-show=\"profileForm.$invalid && submitFailed\">\n" +
    "                                <span>Bitte fülle alle Werte korrekt aus</span>\n" +
    "                            </div>\n" +
    "                            <div class=\"alert-input alert-danger\"\n" +
    "                                 ng-show=\"profileForm.$invalid == false && submitFailedToServer\">\n" +
    "                                <span>Fehler auf dem Server. Die Werte konnten nicht gespeichert werden</span>\n" +
    "                            </div>\n" +
    "                            <div class=\"alert-input alert-success\"\n" +
    "                                 ng-show=\"successUserDataChange && profileForm.$pristine\">\n" +
    "                                <span>Profil erfolgreich erstellt</span>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </form>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('app/modules/contact/contactPreview/template.html',
    "<div class=\"contact-preview\">\r" +
    "\n" +
    "    <img ng-src=\"{{contact.profileUrl}}\" ng-click=\"openUserDetails()\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"contact-preview-content\">\r" +
    "\n" +
    "        <div class=\"contact-preview-name\">\r" +
    "\n" +
    "            <div ng-click=\"openUserDetails()\">\r" +
    "\n" +
    "                {{contact.name}}\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"description-container\">\r" +
    "\n" +
    "                <div class=\"description\" ng-click=\"openModalUpdateType($scope)\" ng-show=\"!contact.blocked && contact.type\">\r" +
    "\n" +
    "                    ({{contact.type}})\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"blocked-description\" ng-show=\"contact.blocked\">\r" +
    "\n" +
    "                BLOCKIERT\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"command-icons\">\r" +
    "\n" +
    "            <button type=\"button\"\r" +
    "\n" +
    "                    class=\"btn btn-default btn-xs dropdown-toggle left\"\r" +
    "\n" +
    "                    data-toggle=\"dropdown\" aria-expanded=\"false\"\r" +
    "\n" +
    "                    bs-dropdown=\"contact.actions\"\r" +
    "\n" +
    "                    ng-show=\"!contact.blocked && contact.type\">\r" +
    "\n" +
    "                Aktionen <span class=\"caret\"></span>\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "            <button type=\"button\" class=\"btn btn-default btn-xs left\"\r" +
    "\n" +
    "                    aria-expanded=\"false\"\r" +
    "\n" +
    "                    ng-show=\"!contact.blocked && !contact.type\"\r" +
    "\n" +
    "                    ng-click=\"openModalAddNewContact($scope)\">\r" +
    "\n" +
    "                <span class=\"glyphicon glyphicon-plus\" aria-hidden=\"true\"></span>\r" +
    "\n" +
    "                Als Kontakt hinzufügen\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "            <button type=\"button\" class=\"btn btn-default btn-xs left\"\r" +
    "\n" +
    "                    aria-expanded=\"false\"\r" +
    "\n" +
    "                    ng-show=\"contact.blocked\"\r" +
    "\n" +
    "                    ng-click=\"unblockContact($scope)\">\r" +
    "\n" +
    "                Blockierung aufheben\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "            <div class=\"command-connection-state\" ng-hide=\"contact.connected === 'none'\"\r" +
    "\n" +
    "                 data-trigger=\"hover\" data-delay=\"600\" data-title=\"{{tooltipConnectionState.title}}\"\r" +
    "\n" +
    "                 bs-tooltip>\r" +
    "\n" +
    "                <img ng-src=\"{{contact.connectionImage}}\">\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <!--<div class=\"command-connection-block\"\r" +
    "\n" +
    "                 ng-show=\"!contact.blocked && (contact.connected === 'none' || contact.connected === 'contactToUser')\"\r" +
    "\n" +
    "                 data-trigger=\"hover\" data-delay=\"600\" data-title=\"User blockieren\"\r" +
    "\n" +
    "                 bs-tooltip ng-click=\"blockContact($scope)\">\r" +
    "\n" +
    "                <img src=\"/app/img/block.png\">\r" +
    "\n" +
    "            </div>-->\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <!--<div class=\"select-user\" ng-show=\"enableSelect !== 'false'\">\r" +
    "\n" +
    "        <div class=\"s2\">\r" +
    "\n" +
    "            <input type=\"checkbox\" ng-model=\"contact.selected\">\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>-->\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('app/modules/contact/contacting.html',
    "<div id=\"content-page-contact\">\r" +
    "\n" +
    "    <div id=\"centerCol\">\r" +
    "\n" +
    "        <div id=\"inner-centerCol\">\r" +
    "\n" +
    "            <div ng-repeat=\"contact in users.contactingUsers\">\r" +
    "\n" +
    "                <div ng-if=\"showContactingInfo($index)\" class=\"contacting-info\">\r" +
    "\n" +
    "                    <div class=\"contacting-inner-info\">\r" +
    "\n" +
    "                        {{getContactingInfo($index)}}\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <ely-contact-preview enable-select=\"false\" contact=\"contact\"\r" +
    "\n" +
    "                                     privacy-settings=\"users.privacySettings\"\r" +
    "\n" +
    "                                     statistic=\"users.statistic\"></ely-contact-preview>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div ng-show=\"users.numberOfAllContactings > itemsPerPage\"\r" +
    "\n" +
    "                 class=\"pagination\">\r" +
    "\n" +
    "                <ely-pagination-next-previous total-items=\"users.numberOfAllContactings\"\r" +
    "\n" +
    "                                              items-per-page=\"{{itemsPerPage}}\"\r" +
    "\n" +
    "                                              get-pagination-set=\"getContacting\"\r" +
    "\n" +
    "                                              reset-counter=\"resetCounter\"></ely-pagination-next-previous>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div ng-show=\"users.numberOfAllContactings === 0 && users.contactingUsers.length === 0\">\r" +
    "\n" +
    "                <div class=\"no-contact-description\">\r" +
    "\n" +
    "                    <h3>Es hat Dich noch niemand als Kontakt hinzugefügt</h3>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div id=\"leftCol\">\r" +
    "\n" +
    "        <div id=\"inner-leftCol\">\r" +
    "\n" +
    "            <h5>Personen die mich als Kontakt hinzugefügt haben:</h5>\r" +
    "\n" +
    "            <ul id=\"contact-counter\" class=\"list-group\">\r" +
    "\n" +
    "                <li class=\"list-group-item\">\r" +
    "\n" +
    "                    <span class=\"badge\">{{users.numberOfContactingLastDay}}</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"contact-description-count\">In den letzten 24h</div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"list-group-item\">\r" +
    "\n" +
    "                    <span class=\"badge\">{{users.numberOfContactingLastWeek}}</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"contact-description-count\">In der letzten Woche</div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"list-group-item\">\r" +
    "\n" +
    "                    <span class=\"badge\">{{users.numberOfContactingLastMonth}}</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"contact-description-count\">Im letzten Monat</div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"list-group-item\">\r" +
    "\n" +
    "                    <span class=\"badge\">{{users.numberOfAllContactings}}</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"contact-description-count\">Gesamt</div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div id=\"leftColNav\" ng-include=\"'app/modules/contact/leftNavCol.html'\"></div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('app/modules/contact/leftNavCol.html',
    "<div class=\"nav-placeholder-top\"></div>\n" +
    "\n" +
    "<div class=\"nav-sub-element\" ui-sref=\"contact.myContacts\">\n" +
    "    <div class=\"button-leftNavCol-active-wrapper\">\n" +
    "        <div ui-sref-active=\"button-leftNavCol-active\" ui-sref=\"contact.myContacts\"></div>\n" +
    "    </div>\n" +
    "    <img src=\"app/img/address-book.png\">\n" +
    "</div>\n" +
    "<div class=\"nav-sub-element\" ui-sref=\"contact.contacting\">\n" +
    "    <div class=\"button-leftNavCol-active-wrapper\">\n" +
    "        <div ui-sref-active=\"button-leftNavCol-active\" ui-sref=\"contact.contacting\"></div>\n" +
    "    </div>\n" +
    "    <img src=\"app/img/followMe.png\">\n" +
    "</div>\n" +
    "<div class=\"nav-sub-element-last\" ui-sref=\"home\">\n" +
    "    <img src=\"app/img/home.png\">\n" +
    "</div>"
  );


  $templateCache.put('app/modules/contact/myContact.html',
    "<div id=\"content-page-contact\">\r" +
    "\n" +
    "    <div id=\"centerCol\">\r" +
    "\n" +
    "        <div id=\"inner-centerCol\">\r" +
    "\n" +
    "            <div ng-repeat=\"contact in users.contacts\">\r" +
    "\n" +
    "                <ely-contact-preview contact=\"contact\" statistic=\"users.statistic\"\r" +
    "\n" +
    "                                     privacy-settings=\"users.privacySettings\"\r" +
    "\n" +
    "                                     number-of-contacts=\"users.numberOfContacts\"></ely-contact-preview>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div ng-show=\"!isUserSearch && users.contactsForPagination > itemsPerPage\"\r" +
    "\n" +
    "                 class=\"pagination\">\r" +
    "\n" +
    "                <ely-pagination-next-previous total-items=\"users.contactsForPagination\"\r" +
    "\n" +
    "                                              items-per-page=\"{{itemsPerPage}}\"\r" +
    "\n" +
    "                                              get-pagination-set=\"paginationChanged\"></ely-pagination-next-previous>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div ng-show=\"users.numberOfContacts === 0 && users.contacts.length === 0\">\r" +
    "\n" +
    "                <div class=\"no-contact-description\">\r" +
    "\n" +
    "                    <h3>Du hast noch keine Kontakte</h3>\r" +
    "\n" +
    "                    {{help.content}}\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div id=\"leftCol\">\r" +
    "\n" +
    "        <div id=\"inner-leftCol\">\r" +
    "\n" +
    "            <ely-search-box description=\"Suche nach Personen...\" query=\"query\"\r" +
    "\n" +
    "                            get-query-suggestion=\"getUserSuggestion\"\r" +
    "\n" +
    "                            get-query=\"getUser\"></ely-search-box>\r" +
    "\n" +
    "            <ul id=\"contact-counter\" class=\"list-group\" ng-controller=\"DescriptionCounterCtrl\">\r" +
    "\n" +
    "                <div>\r" +
    "\n" +
    "                    <li class=\"list-group-item\"\r" +
    "\n" +
    "                        ng-class=\"{'group-selected': allContactsSelected}\">\r" +
    "\n" +
    "                        <span class=\"badge\">{{users.numberOfContacts}}</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"contact-description-count\" ng-click=\"selectedAllContacts()\">\r" +
    "\n" +
    "                            Alle\r" +
    "\n" +
    "                            Kontakte\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div ng-repeat=\"statistic in users.statistic\">\r" +
    "\n" +
    "                    <li class=\"list-group-item\"\r" +
    "\n" +
    "                        ng-class=\"{'group-selected': statistic.selected}\">\r" +
    "\n" +
    "                        <span class=\"badge\">{{statistic.count}}</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"contact-description-count\"\r" +
    "\n" +
    "                             ng-click=\"selectedStatisticType(statistic)\">{{statistic.type}}\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "            <div id=\"privacy-link\">\r" +
    "\n" +
    "                <a ui-sref=\"settings.privacy\">Privatsphären Einstellungen verwalten...</a>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div id=\"help-my-contact\" data-animation=\"am-fade-and-scale\" data-placement=\"center\" data-backdrop=\"false\"\r" +
    "\n" +
    "                 bs-modal=\"help\">\r" +
    "\n" +
    "                <img src=\"/app/img/help.png\">\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div id=\"leftColNav\" ng-include=\"'app/modules/contact/leftNavCol.html'\"></div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('app/modules/contact/services/userActionsModalDescription.html',
    "<div class=\"modal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\r" +
    "\n" +
    "    <div id=\"modal-dialog-set-privacy\" class=\"modal-dialog\">\r" +
    "\n" +
    "        <div class=\"modal-content\">\r" +
    "\n" +
    "            <div class=\"modal-header\" ng-show=\"title\"><h4 class=\"modal-title\" ng-bind=\"title\"></h4></div>\r" +
    "\n" +
    "            <div class=\"modal-body\">\r" +
    "\n" +
    "                <button type=\"button\" class=\"btn btn-default privacy-selection\"\r" +
    "\n" +
    "                        ng-model=\"contact.selectedPrivacySetting\" trigger=\"click\"\r" +
    "\n" +
    "                        bs-options=\"privacySetting.type as privacySetting.type for privacySetting in contact.privacySettings\"\r" +
    "\n" +
    "                        data-placeholder=\"\"\r" +
    "\n" +
    "                        bs-select>\r" +
    "\n" +
    "                    Action <span class=\"caret\"></span>\r" +
    "\n" +
    "                </button>\r" +
    "\n" +
    "                <div class=\"privacy-description\">\r" +
    "\n" +
    "                    Wähle eine Privatsphären Einstellung\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"modal-footer\">\r" +
    "\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-click=\"$hide()\">Abbrechen</button>\r" +
    "\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-click=\"send($scope, $hide)\">{{actionDescription}}</button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('app/modules/contact/userDetail.html',
    "<div id=\"content-page-contact-details\">\r" +
    "\n" +
    "    <div id=\"centerCol\">\r" +
    "\n" +
    "        <div id=\"inner-centerCol\">\r" +
    "\n" +
    "            <div class=\"profile-detail-content-group\">\r" +
    "\n" +
    "                <div id=\"profile-image\">\r" +
    "\n" +
    "                    <img class=\"img-rounded img-responsive\" ng-src=\"{{contact.profileUrl}}\"/>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div id=\"profile-data\">\r" +
    "\n" +
    "                    <div id=\"profile-data-overview\">\r" +
    "\n" +
    "                        <div id=\"profile-data-name\">{{contact.name}}</div>\r" +
    "\n" +
    "                        <div id=\"profile-connection-state\" ng-hide=\"contact.connected === 'none'\" data-trigger=\"hover\" data-delay=\"600\"\r" +
    "\n" +
    "                             data-title=\"{{tooltipConnectionState.title}}\"\r" +
    "\n" +
    "                             bs-tooltip>\r" +
    "\n" +
    "                            <img ng-src=\"{{contact.connectionImage}}\">\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div id=\"profile-connection-type\">\r" +
    "\n" +
    "                            <div class=\"profile-inner-connection-type\" ng-click=\"openModalUpdateType($scope)\" ng-show=\"contact.type\">\r" +
    "\n" +
    "                                ({{contact.type}})\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div class=\"profile-data-description\">{{contact.country}}</div>\r" +
    "\n" +
    "                        <div class=\"profile-data-description\">{{contact.birthday}}</div>\r" +
    "\n" +
    "                        <div class=\"profile-data-description\">{{contact.street}}</div>\r" +
    "\n" +
    "                        <div class=\"profile-data-description\">{{contact.place}}</div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"profile-command\">\r" +
    "\n" +
    "                        <button type=\"button\" class=\"btn btn-default\"\r" +
    "\n" +
    "                                aria-expanded=\"false\"\r" +
    "\n" +
    "                                ng-show=\"!contact.type\"\r" +
    "\n" +
    "                                ng-click=\"openModalAddNewContact($scope)\">\r" +
    "\n" +
    "                            <span class=\"glyphicon glyphicon-plus\" aria-hidden=\"true\"></span>\r" +
    "\n" +
    "                            Als Kontakt hinzufügen\r" +
    "\n" +
    "                        </button>\r" +
    "\n" +
    "                        <button type=\"button\" class=\"btn btn-default\"\r" +
    "\n" +
    "                                aria-expanded=\"false\"\r" +
    "\n" +
    "                                ng-click=\"sendMessage(userId, contact.name)\">\r" +
    "\n" +
    "                            Nachricht senden\r" +
    "\n" +
    "                        </button>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"profile-detail-content-group\" ng-show=\"contacts.length > 0\">\r" +
    "\n" +
    "                <div id=\"profile-contacts-title-female\" ng-show=\"contact.female\">\r" +
    "\n" +
    "                    Sie hat {{numberOfContacts}} Kontakte ({{numberOfSameContacts}} gemeinsame Kontakte)\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div id=\"profile-contacts-title-male\" ng-show=\"!contact.female\">\r" +
    "\n" +
    "                    Er hat {{numberOfContacts}} Kontakte ({{numberOfSameContacts}} gemeinsame Kontakte)\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"profile-contacts-preview\" ng-repeat=\"user in contacts\" ng-click=\"openUserDetails(user.id)\">\r" +
    "\n" +
    "                    <div class=\"profile-contacts-preview-content\">\r" +
    "\n" +
    "                        <img ng-src=\"{{user.profileUrl}}\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"profile-contacts-preview-name\">\r" +
    "\n" +
    "                            <div class=\"name\">{{user.name}}</div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"profile-contact-expander\" ng-show=\"contacts.length < numberOfContacts - 1\" ng-click=\"appendContacts()\"><img\r" +
    "\n" +
    "                        src=\"app/img/expand-down.png\"/></div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div id=\"leftColNav\" ng-include=\"'app/modules/contact/leftNavCol.html'\"></div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('app/modules/directives/formTextInput/template.html',
    "<div class=\"form-group ely-form-text-input\" ng-class=\"{'has-error': showError && (visited || submitFailed)}\">\r" +
    "\n" +
    "    <label for=\"{{inputName}}\" class=\"col-sm-4 control-label\">{{label}}\r" +
    "\n" +
    "        <em ng-show=\"required !== 'true'\">(optional)</em>\r" +
    "\n" +
    "    </label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"col-sm-8\">\r" +
    "\n" +
    "        <input name=\"{{inputName}}\" ng-model=\"submitModel\"\r" +
    "\n" +
    "               class=\"form-control\" id=\"{{inputName}}\"\r" +
    "\n" +
    "               placeholder=\"{{inputPlaceholder}}\" ng-blur=\"visited = true\"\r" +
    "\n" +
    "               ng-maxlength=\"{{maxLength}}\" ng-required=\"{{required === 'true'}}\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"ely-input-error-wrapper\">\r" +
    "\n" +
    "            <div class=\"ely-input-image-error\" ng-show=\"showError && (visited || submitFailed)\"\r" +
    "\n" +
    "                 data-template=\"app/modules/util/tooltip/tooltipError.html\" data-trigger=\"hover\"\r" +
    "\n" +
    "                 data-placement=\"left\"\r" +
    "\n" +
    "                 data-container=\"body\"\r" +
    "\n" +
    "                 bs-tooltip=\"errorDescription\">\r" +
    "\n" +
    "                <img src=\"app/img/error.png\"/>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('app/modules/directives/imageCropper/template.html',
    "<div class=\"cropper-outer-container\">\r" +
    "\n" +
    "    <img src=\"\" ng-show=\"image && image.trim() !== ''\">\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('app/modules/directives/paginationNextPrevious/template.html',
    "<div class=\"paginationNextPrevious\">\r" +
    "\n" +
    "    <div class=\"paginationNextPrevious-wrapper\">\r" +
    "\n" +
    "        <div class=\"paginationElement\" ng-class=\"{disabled: currentPagination === 1}\"\r" +
    "\n" +
    "             ng-click=\"clickPrevious()\">\r" +
    "\n" +
    "            <img src=\"app/img/arrow-previous.png\">\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"paginationElement\"\r" +
    "\n" +
    "             ng-class=\"{disabled: currentPagination === currentPaginationRange}\"\r" +
    "\n" +
    "             ng-click=\"clickNext()\">\r" +
    "\n" +
    "            <img src=\"app/img/arrow-next.png\">\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('app/modules/directives/searchBox/template.html',
    "<div class=\"searchBoxForm\">\r" +
    "\n" +
    "    <div class=\"input-group\">\r" +
    "\n" +
    "        <input class=\"form-control\" placeholder=\"{{description}}\" ng-model=\"query\"\r" +
    "\n" +
    "               ng-keypress=\"sendGetQuery($event)\"\r" +
    "\n" +
    "               bs-options=\"querySuggestion.name as querySuggestion.name for querySuggestion in getQuerySuggestion($viewValue)\"\r" +
    "\n" +
    "               data-trigger=\"focus\" bs-typeahead>\r" +
    "\n" +
    "        <span class=\"input-group-btn\">\r" +
    "\n" +
    "            <button class=\"btn btn-default\" type=\"button\" ng-click=\"getQuery(query)\"><span\r" +
    "\n" +
    "                    class=\"glyphicon glyphicon-search\" aria-hidden=\"true\"></span></button>\r" +
    "\n" +
    "        </span>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('app/modules/directives/sendButton/template.html',
    "<div class=\"ely-submit-button\">\r" +
    "\n" +
    "    <button type=\"submit\"\r" +
    "\n" +
    "            class=\"btn btn-default\"\r" +
    "\n" +
    "            ng-click=\"sendAllData()\"\r" +
    "\n" +
    "            ng-class=\"{disabled: sendButtonDisabled}\">\r" +
    "\n" +
    "        {{buttonDescription}}\r" +
    "\n" +
    "    </button>\r" +
    "\n" +
    "    <div class=\"ely-submit-button-error\" ng-show=\"showError\">\r" +
    "\n" +
    "        <img src=\"app/img/error.png\" ng-show=\"showError\" data-template=\"app/modules/util/tooltip/tooltipError.html\" data-trigger=\"hover\"\r" +
    "\n" +
    "             data-placement=\"{{errorPlacement}}\" bs-tooltip=\"errorDescription\"/>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"ely-submit-button-success\" ng-show=\"showSuccess\">\r" +
    "\n" +
    "        <img src=\"app/img/success.png\" ng-show=\"showSuccess\"/>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('app/modules/directives/spin/template.html',
    "<div class=\"spin\">\r" +
    "\n" +
    "    <div id=\"spinner-content\"></div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('app/modules/directives/starRating/template.html',
    "<div class=\"ely-star-rating\" ng-mouseleave=\"resetToSelected()\">\r" +
    "\n" +
    "    <img ng-src=\"{{star0}}\" ng-mouseover=\"mouseOverStar(0)\" ng-mousedown=\"starSelected(1)\" ng-class=\"{'ely-star-rating-small': isSmall, 'ely-star-rating-x-small': isXSmall}\">\r" +
    "\n" +
    "    <img ng-src=\"{{star1}}\" ng-mouseover=\"mouseOverStar(1)\" ng-mousedown=\"starSelected(2)\" ng-class=\"{'ely-star-rating-small': isSmall, 'ely-star-rating-x-small': isXSmall}\">\r" +
    "\n" +
    "    <img ng-src=\"{{star2}}\" ng-mouseover=\"mouseOverStar(2)\" ng-mousedown=\"starSelected(3)\" ng-class=\"{'ely-star-rating-small': isSmall, 'ely-star-rating-x-small': isXSmall}\">\r" +
    "\n" +
    "    <img ng-src=\"{{star3}}\" ng-mouseover=\"mouseOverStar(3)\" ng-mousedown=\"starSelected(4)\" ng-class=\"{'ely-star-rating-small': isSmall, 'ely-star-rating-x-small': isXSmall}\">\r" +
    "\n" +
    "    <img ng-src=\"{{star4}}\" ng-mouseover=\"mouseOverStar(4)\" ng-mousedown=\"starSelected(5)\" ng-class=\"{'ely-star-rating-small': isSmall, 'ely-star-rating-x-small': isXSmall}\">\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('app/modules/home/home.html',
    "<div class=\"navigation\">\n" +
    "    <ely-home-nav-element description=\"Kontakte\" image-url=\"app/img/home/contact.png\"\n" +
    "                          nav-to=\"contact.myContacts\"></ely-home-nav-element>\n" +
    "    <ely-home-nav-element description=\"Nachrichten\" image-url=\"app/img/home/email.png\"\n" +
    "                          nav-to=\"message.threads\" event-description=\"messageText\"></ely-home-nav-element>\n" +
    "    <ely-home-nav-element description=\"Seiten\" image-url=\"app/img/home/page.png\"\n" +
    "                          nav-to=\"page.overview\"></ely-home-nav-element>\n" +
    "</div>"
  );


  $templateCache.put('app/modules/home/homeNavElement/template.html',
    "<div class=\"navigation-element\">\r" +
    "\n" +
    "    <a ui-sref={{navTo}}>\r" +
    "\n" +
    "        <div class=\"navigation-element-content\">\r" +
    "\n" +
    "            <img ng-src=\"{{imageUrl}}\"/>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"navigation-element-description\">{{description}}</div>\r" +
    "\n" +
    "            <div class=\"navigation-element-info\">{{eventDescription}}</div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </a>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('app/modules/messages/conversation.html',
    "<div id=\"content-messages\">\r" +
    "\n" +
    "    <div ng-controller=\"ConversationActionsCtrl\">\r" +
    "\n" +
    "        <div id=\"centerCol\">\r" +
    "\n" +
    "            <div id=\"inner-centerCol\">\r" +
    "\n" +
    "                <div class=\"add-message\" ng-style=\"settings.textInputWrapperStyle\">\r" +
    "\n" +
    "                    <div class=\"input-group\">\r" +
    "\n" +
    "                    <textarea class=\"form-control\" placeholder=\"Nachricht\"\r" +
    "\n" +
    "                              ng-style=\"settings.textInputStyle\"\r" +
    "\n" +
    "                              ng-keyup=\"settings.checkHeightOfInput($event)\"\r" +
    "\n" +
    "                              ng-maxlength=\"1000\"\r" +
    "\n" +
    "                              ng-model=\"settings.newMessage\"></textarea>\r" +
    "\n" +
    "                    <span class=\"input-group-btn\">\r" +
    "\n" +
    "                        <button class=\"btn btn-default\" type=\"button\" ng-click=\"sendMessage()\"\r" +
    "\n" +
    "                                ng-style=\"settings.textInputStyle\"\r" +
    "\n" +
    "                                ng-class=\"{'disabled': settings.newMessage.trim() === ''}\">Senden\r" +
    "\n" +
    "                        </button>\r" +
    "\n" +
    "                    </span>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div ng-repeat=\"message in settings.thread.messages\" class=\"message-view\">\r" +
    "\n" +
    "                    <div class=\"message-inner-view\">\r" +
    "\n" +
    "                        <div class=\"message-view-image\">\r" +
    "\n" +
    "                            <img ng-src=\"{{message.profileUrl}}\" class=\"img-rounded\">\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div class=\"message-view-content\">\r" +
    "\n" +
    "                            <div class=\"message-view-title\">\r" +
    "\n" +
    "                                <div class=\"message-view-name\">\r" +
    "\n" +
    "                                    {{message.name}}\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                                <div class=\"message-view-timestamp\">\r" +
    "\n" +
    "                                    {{getFormattedDate(message.timestamp)}}\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div class=\"message-view-text\">{{message.text}}</div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div ng-show=\"settings.thread.numberOfMessages > settings.itemsPerPage\"\r" +
    "\n" +
    "                     class=\"pagination\">\r" +
    "\n" +
    "                    <ely-pagination-next-previous total-items=\"settings.thread.numberOfMessages\"\r" +
    "\n" +
    "                                                  items-per-page=\"{{settings.itemsPerPage}}\"\r" +
    "\n" +
    "                                                  get-pagination-set=\"settings.getThread\"></ely-pagination-next-previous>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div id=\"leftCol\">\r" +
    "\n" +
    "            <div id=\"inner-leftCol\">\r" +
    "\n" +
    "                <div id=\"thread-description\">{{settings.thread.threadDescription}}</div>\r" +
    "\n" +
    "                <ul id=\"message-index\" class=\"list-group\">\r" +
    "\n" +
    "                    <div ng-repeat=\"thread in settings.threads.threads\"\r" +
    "\n" +
    "                         ng-if=\"thread.threadId !== settings.selectedThreadId\">\r" +
    "\n" +
    "                        <li class=\"list-group-item\"\r" +
    "\n" +
    "                            ng-click=\"settings.openThread(thread.threadId, thread.isGroupThread)\">\r" +
    "\n" +
    "                            <span class=\"badge\" ng-if=\"thread.hasNotReadMessages\">{{thread.numberOfUnreadMessages}}</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div class=\"message-unread-count\" data-trigger=\"hover\" data-delay=\"1000\"\r" +
    "\n" +
    "                                 data-title=\"{{thread.description}}\"\r" +
    "\n" +
    "                                 bs-tooltip>{{thread.description}}\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </ul>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div id=\"leftColNav\" ng-include=\"'app/modules/messages/leftNavCol.html'\"></div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('app/modules/messages/leftNavCol.html',
    "<div class=\"nav-placeholder-top\"></div>\n" +
    "\n" +
    "<div class=\"nav-sub-element\" ui-sref=\"message.threads\">\n" +
    "    <div class=\"button-leftNavCol-active-wrapper\">\n" +
    "        <div ui-sref-active=\"button-leftNavCol-active\" ui-sref=\"message.threads\"></div>\n" +
    "    </div>\n" +
    "    <img src=\"app/img/threads.png\">\n" +
    "</div>\n" +
    "<div class=\"nav-sub-element-last\" ui-sref=\"home\">\n" +
    "    <img src=\"app/img/home.png\">\n" +
    "</div>"
  );


  $templateCache.put('app/modules/messages/threads.html',
    "<div id=\"content-threads\">\r" +
    "\n" +
    "    <div id=\"centerCol\">\r" +
    "\n" +
    "        <div id=\"inner-centerCol\">\r" +
    "\n" +
    "            <div ng-if=\"!search\">\r" +
    "\n" +
    "                <div ng-repeat=\"thread in threads.threads\" class=\"thread-preview\"\r" +
    "\n" +
    "                     ng-click=\"openThread(thread.threadId, thread.isGroupThread)\">\r" +
    "\n" +
    "                    <div class=\"thread-preview-image\">\r" +
    "\n" +
    "                        <img ng-src=\"{{thread.profileUrl}}\" class=\"img-circle\">\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"thread-preview-text\">\r" +
    "\n" +
    "                        <div class=\"thread-preview-description\">\r" +
    "\n" +
    "                            {{thread.description}}\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div ng-class=\"{'thread-preview-previewText': !thread.hasNotReadMessages, 'thread-preview-previewTextBold': thread.hasNotReadMessages}\">\r" +
    "\n" +
    "                            {{thread.previewText}}\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div ng-class=\"{'thread-preview-date': !thread.hasNotReadMessages, 'thread-preview-dateBold': thread.hasNotReadMessages}\">\r" +
    "\n" +
    "                        {{getFormattedDate(thread.lastUpdate)}}\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div ng-show=\"threads.numberOfThreads > itemsPerPage\"\r" +
    "\n" +
    "                     class=\"pagination\">\r" +
    "\n" +
    "                    <ely-pagination-next-previous total-items=\"threads.numberOfThreads\"\r" +
    "\n" +
    "                                                  items-per-page=\"{{itemsPerPage}}\"\r" +
    "\n" +
    "                                                  get-pagination-set=\"getThreads\"></ely-pagination-next-previous>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div ng-if=\"search.threads.length > 0\">\r" +
    "\n" +
    "                <div ng-repeat=\"thread in search.threads\" class=\"thread-preview\"\r" +
    "\n" +
    "                     ng-class=\"{'thread-preview-add-thread': !thread.previewText, 'thread-preview': thread.previewText}\"\r" +
    "\n" +
    "                     ng-click=\"openThread(thread.threadId, thread.isGroupThread)\">\r" +
    "\n" +
    "                    <div class=\"thread-preview-image\">\r" +
    "\n" +
    "                        <img ng-src=\"{{thread.profileUrl}}\" class=\"img-circle\">\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"thread-preview-text\">\r" +
    "\n" +
    "                        <div ng-class=\"{'thread-preview-description': thread.previewText, 'thread-preview-description-center': !thread.previewText}\">\r" +
    "\n" +
    "                            {{thread.description}}\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div class=\"thread-preview-previewText\" ng-if=\"thread.previewText\">\r" +
    "\n" +
    "                            {{thread.previewText}}\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"add-new-single-thread\" ng-if=\"!thread.previewText\">\r" +
    "\n" +
    "                        <button class=\"btn btn-default\" type=\"button\" ng-click=\"addNewSingleThread(thread.userId, thread.description)\">\r" +
    "\n" +
    "                            <span class=\"glyphicon glyphicon-plus\" aria-hidden=\"true\"></span> Konversation starten\r" +
    "\n" +
    "                        </button>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div ng-if=\"search.threads.length === 0\">\r" +
    "\n" +
    "                Es konnte leider keiner deiner Kontakte mit dem Namen {{query}} gefunden werden. Du kannst nur Nachrichten an Personen senden, welche du als Kontakt hinzugefügt hast.\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div id=\"leftCol\">\r" +
    "\n" +
    "        <div id=\"inner-leftCol\">\r" +
    "\n" +
    "            <ely-search-box description=\"Nachricht an...\" query=\"query\"\r" +
    "\n" +
    "                            get-query-suggestion=\"getSuggestion\"\r" +
    "\n" +
    "                            get-query=\"getThreadsOrContacts\"></ely-search-box>\r" +
    "\n" +
    "            <!--<div id=\"add-new-group-button\">\r" +
    "\n" +
    "                <button class=\"btn btn-default\" type=\"button\" ng-click=\"sendMessage()\">\r" +
    "\n" +
    "                    <span class=\"glyphicon glyphicon-plus\" aria-hidden=\"true\"></span> Neuer\r" +
    "\n" +
    "                    Gruppenchat\r" +
    "\n" +
    "                </button>\r" +
    "\n" +
    "            </div>-->\r" +
    "\n" +
    "            <ul id=\"message-index\" class=\"list-group\">\r" +
    "\n" +
    "                <div ng-repeat=\"thread in threads.threads\">\r" +
    "\n" +
    "                    <li class=\"list-group-item\"\r" +
    "\n" +
    "                        ng-click=\"openThread(thread.threadId, thread.isGroupThread)\">\r" +
    "\n" +
    "                        <span class=\"badge\" ng-if=\"thread.hasNotReadMessages\">{{thread.numberOfUnreadMessages}}</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"message-unread-count\" data-trigger=\"hover\" data-delay=\"1000\"\r" +
    "\n" +
    "                             data-title=\"{{thread.description}}\"\r" +
    "\n" +
    "                             bs-tooltip>{{thread.description}}\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div id=\"leftColNav\" ng-include=\"'app/modules/messages/leftNavCol.html'\"></div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('app/modules/navigation/loggedInHeader.html',
    "<div id=\"public-header\" ng-controller=\"LoggedInHeaderCtrl\">\r" +
    "\n" +
    "    <div>\r" +
    "\n" +
    "        <div class=\"rightHeaderNavElement\">\r" +
    "\n" +
    "            <ul>\r" +
    "\n" +
    "                <li>\r" +
    "\n" +
    "                    <img src=\"app/img/settingsNav.png\">\r" +
    "\n" +
    "                    <ul>\r" +
    "\n" +
    "                        <li class=\"first\"></li>\r" +
    "\n" +
    "                        <li ui-sref=\"settings.profile\">Einstellungen</li>\r" +
    "\n" +
    "                        <li ng-click=\"logout()\">Logout</li>\r" +
    "\n" +
    "                    </ul>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"leftHeaderNavElement\" ui-sref=\"settings.profile\">\r" +
    "\n" +
    "            <img ng-src=\"{{userHeaderInfo.profileImage}}\" class=\"img-circle\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div id=\"header-user-name\">{{userHeaderInfo.name}}</div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('app/modules/navigation/publicHeader.html',
    "<div id=\"public-header\">\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('app/modules/page/createPage/commonBook.html',
    "<div>\r" +
    "\n" +
    "    <form class=\"form-horizontal\" name=\"bookCommonForm\" role=\"form\" novalidate>\r" +
    "\n" +
    "        <ely-form-text-input label=\"Author\" input-name=\"inputAuthor\" input-placeholder=\"Author\"\r" +
    "\n" +
    "                             profile-form=\"bookCommonForm\" submit-model=\"page.authors\"\r" +
    "\n" +
    "                             max-length=\"255\" required=\"true\"></ely-form-text-input>\r" +
    "\n" +
    "        <ely-form-text-input label=\"Erscheinungsdatum\" input-name=\"inputPublicationDate\" input-placeholder=\"Erscheinungsdatum\"\r" +
    "\n" +
    "                             profile-form=\"bookCommonForm\" submit-model=\"page.publicationDate\"\r" +
    "\n" +
    "                             max-length=\"255\" required=\"true\"></ely-form-text-input>\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('app/modules/page/createPage/pageCreate.html',
    "<div id=\"content-page-create\">\r" +
    "\n" +
    "    <div id=\"centerCol\">\r" +
    "\n" +
    "        <div id=\"inner-centerCol\">\r" +
    "\n" +
    "            <div class=\"website-structure-header\">\r" +
    "\n" +
    "                <div class=\"website-structure-header-title\">\r" +
    "\n" +
    "                    <h2>Kategorie ausw&aumlhlen</h2>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div id=\"content-create-category\">\r" +
    "\n" +
    "                <form class=\"form-horizontal\" name=\"categoryForm\" role=\"form\" novalidate>\r" +
    "\n" +
    "                    <div class=\"form-group\">\r" +
    "\n" +
    "                        <button type=\"button\" class=\"btn btn-default content-create-category-element\" ng-model=\"category.selectedCategory\"\r" +
    "\n" +
    "                                name=\"inputCategory\"\r" +
    "\n" +
    "                                id=\"inputCategoryId\"\r" +
    "\n" +
    "                                bs-options=\"category as category for category in categories\"\r" +
    "\n" +
    "                                data-placeholder=\"Kategorie ausw&aumlhlen\"\r" +
    "\n" +
    "                                bs-select>\r" +
    "\n" +
    "                            <span class=\"caret\"></span>\r" +
    "\n" +
    "                        </button>\r" +
    "\n" +
    "                        <button type=\"button\" class=\"btn btn-default content-create-category-element\" ng-model=\"category.selectedLanguage\"\r" +
    "\n" +
    "                                name=\"inputLanguage\"\r" +
    "\n" +
    "                                id=\"inputLanguageId\"\r" +
    "\n" +
    "                                bs-options=\"language.description as language.description for language in languages\"\r" +
    "\n" +
    "                                data-placeholder=\"Sprache der Seite ausw&aumlhlen\"\r" +
    "\n" +
    "                                bs-select>\r" +
    "\n" +
    "                            <span class=\"caret\"></span>\r" +
    "\n" +
    "                        </button>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"form-group content-create-category-element\">\r" +
    "\n" +
    "                        <input name=\"inputTitle\" ng-model=\"category.title\"\r" +
    "\n" +
    "                               class=\"form-control\" id=\"inputTitleId\"\r" +
    "\n" +
    "                               placeholder=\"Titel\"\r" +
    "\n" +
    "                               ng-maxlength=\"255\" ng-required=\"true\">\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"form-group content-create-category-element\">\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "                            <button type=\"submit\"\r" +
    "\n" +
    "                                    class=\"btn btn-default\"\r" +
    "\n" +
    "                                    id=\"category-select-finished\"\r" +
    "\n" +
    "                                    ng-click=\"categorySelectFinished()\"\r" +
    "\n" +
    "                                    ng-class=\"{disabled: sendButtonDisabled}\">\r" +
    "\n" +
    "                                Fertig\r" +
    "\n" +
    "                            </button>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </form>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div id=\"content-create-page-suggestions\" ng-show=\"showSuggestions\">\r" +
    "\n" +
    "                <div class=\"website-structure-header\">\r" +
    "\n" +
    "                    <div class=\"website-structure-header-title\">\r" +
    "\n" +
    "                        <h2>Existiert die Seite die Sie erstellen m&oumlchten bereits?</h2>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div ng-repeat=\"pagePreview in pageSuggestions.pages\">\r" +
    "\n" +
    "                    <ely-page-preview page-preview=\"pagePreview\"></ely-page-preview>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div id=\"content-create-page-suggestion-commands\">\r" +
    "\n" +
    "                    <button type=\"submit\"\r" +
    "\n" +
    "                            class=\"btn btn-default content-create-page-suggestion-commands-buttons\"\r" +
    "\n" +
    "                            ng-click=\"suggestionContinue()\">\r" +
    "\n" +
    "                        Weiter\r" +
    "\n" +
    "                    </button>\r" +
    "\n" +
    "                    <button type=\"submit\"\r" +
    "\n" +
    "                            class=\"btn btn-default content-create-page-suggestion-commands-buttons\"\r" +
    "\n" +
    "                            ng-click=\"abortCreatePage()\">\r" +
    "\n" +
    "                        Seite Erstellen Abbrechen\r" +
    "\n" +
    "                    </button>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div id=\"content-create-page-common\"> <!--ng-show=\"showCommonSection\"-->\r" +
    "\n" +
    "                <div class=\"website-structure-header\">\r" +
    "\n" +
    "                    <div class=\"website-structure-header-title\">\r" +
    "\n" +
    "                        <h2>Allgemeines</h2>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div id=\"content-create-page-common-picture-area\">\r" +
    "\n" +
    "                    <img ng-src=\"{{imagePreview}}\" class=\"content-create-page-common-picture\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div>\r" +
    "\n" +
    "                        <button type=\"button\" class=\"btn btn-default content-create-page-common-get-picture\"\r" +
    "\n" +
    "                                data-animation=\"am-fade-and-scale\" data-placement=\"center\"\r" +
    "\n" +
    "                                data-backdrop=\"static\"\r" +
    "\n" +
    "                                data-template=\"app/modules/util/file/previewFile.html\" bs-modal=\"modal\">\r" +
    "\n" +
    "                            Titelbild ausw&aumlhlen..\r" +
    "\n" +
    "                        </button>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div id=\"content-create-page-common-area\">\r" +
    "\n" +
    "                    <div id=\"content-create-page-common-inner-area\">\r" +
    "\n" +
    "                        <div ng-include=\"'app/modules/page/createPage/commonBook.html'\"></div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div id=\"content-create-page-common-description-area\">\r" +
    "\n" +
    "                    <textarea class=\"form-control\" placeholder=\"Beschreibung\"\r" +
    "\n" +
    "                              ng-maxlength=\"10000\"\r" +
    "\n" +
    "                              ng-model=\"page.description\"></textarea>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div>\r" +
    "\n" +
    "                    <button type=\"submit\"\r" +
    "\n" +
    "                            class=\"btn btn-default content-create-page-common-commands\"\r" +
    "\n" +
    "                            ng-click=\"createPage()\">\r" +
    "\n" +
    "                        Seite erstellen\r" +
    "\n" +
    "                    </button>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div id=\"leftColNav\" ng-include=\"'app/modules/page/leftNavCol.html'\"></div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('app/modules/page/leftNavCol.html',
    "<div class=\"nav-placeholder-top\"></div>\n" +
    "\n" +
    "<div class=\"nav-sub-element\" ui-sref=\"page.overview\">\n" +
    "    <div class=\"button-leftNavCol-active-wrapper\">\n" +
    "        <div ui-sref-active=\"button-leftNavCol-active\" ui-sref=\"page.overview\"></div>\n" +
    "    </div>\n" +
    "    <img src=\"app/img/page/overview.png\">\n" +
    "</div>\n" +
    "<div class=\"nav-sub-element-last\" ui-sref=\"home\">\n" +
    "    <img src=\"app/img/home.png\">\n" +
    "</div>"
  );


  $templateCache.put('app/modules/page/pageDetail.html',
    "<div id=\"content-page-detail\">\r" +
    "\n" +
    "    <div id=\"centerCol\">\r" +
    "\n" +
    "        <div id=\"inner-centerCol\">\r" +
    "\n" +
    "            <div id=\"page-detail-rightCol\">\r" +
    "\n" +
    "                <div class=\"page-detail-select-contact-visible\">\r" +
    "\n" +
    "                    <input type=\"checkbox\" ng-model=\"contact\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"page-detail-select-contact-visible-description\">\r" +
    "\n" +
    "                        Nur Kontakte\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"page-detail-user-recommendation-preview\" ng-show=\"pageDetail.recommendation.user\">\r" +
    "\n" +
    "                        <div class=\"page-detail-recommendation-preview-thumbnail\">\r" +
    "\n" +
    "                            <img ng-src=\"{{pageDetail.recommendation.user.profileUrl}}\" class=\"img-circle\">\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div class=\"page-detail-recommendation-preview-list\">\r" +
    "\n" +
    "                            <div class=\"page-detail-recommendation-preview-name\">\r" +
    "\n" +
    "                                Meine Bewertung\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div class=\"page-detail-recommendation-preview-rating\">\r" +
    "\n" +
    "                                <ely-star-rating is-readonly=\"true\" is-small=\"true\"\r" +
    "\n" +
    "                                                 number-of-selected-stars-readonly=\"pageDetail.recommendation.user.rating\"></ely-star-rating>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div class=\"page-detail-recommendation-preview-comment\">\r" +
    "\n" +
    "                            {{pageDetail.recommendation.user.comment}}\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"page-detail-users-recommendation-preview\" ng-repeat=\"user in pageDetail.recommendation.users\">\r" +
    "\n" +
    "                        <div class=\"page-detail-recommendation-preview-thumbnail\">\r" +
    "\n" +
    "                            <img ng-src=\"{{user.profileUrl}}\" class=\"img-circle\">\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div class=\"page-detail-recommendation-preview-list\">\r" +
    "\n" +
    "                            <div class=\"page-detail-recommendation-preview-name\">\r" +
    "\n" +
    "                                {{user.name}}\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div class=\"page-detail-recommendation-preview-rating\">\r" +
    "\n" +
    "                                <ely-star-rating is-readonly=\"true\" is-small=\"true\"\r" +
    "\n" +
    "                                                 number-of-selected-stars-readonly=\"user.rating\"></ely-star-rating>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div class=\"page-detail-recommendation-preview-comment\">\r" +
    "\n" +
    "                            {{user.comment}}\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div id=\"page-detail-header\">\r" +
    "\n" +
    "                <div id=\"page-detail-inner-header\">\r" +
    "\n" +
    "                    <div class=\"page-detail-header-image\">\r" +
    "\n" +
    "                        <img ng-src=\"{{pageDetail.page.titleUrl}}\">\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"page-detail-header-list\">\r" +
    "\n" +
    "                        <div class=\"page-detail-header-title\">\r" +
    "\n" +
    "                            {{pageDetail.page.title}}\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div class=\"page-detail-header-category\">\r" +
    "\n" +
    "                            Kategorie: {{category}}\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div ng-show=\"contributorsWithProfile.length > 0 || contributors.length > 0\">\r" +
    "\n" +
    "                            <div class=\"page-detail-contributor-title\">\r" +
    "\n" +
    "                                {{contributorPrefix}}\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div class=\"page-detail-header-contributor-with-Profile\" ng-repeat=\"contributor in contributorsWithProfile\"\r" +
    "\n" +
    "                                 ng-click=\"openUserDetail(contributor.userId, contributor.isLoggedInUser)\">\r" +
    "\n" +
    "                                <div ng-if=\"contributor.isLoggedInUser\">Ich</div>\r" +
    "\n" +
    "                                <div ng-if=\"!contributor.isLoggedInUser\">{{contributor.name}}</div>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div class=\"page-detail-header-contributor\" ng-repeat=\"contributor in contributors\">\r" +
    "\n" +
    "                                {{contributor.name}}\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div class=\"page-detail-header-commands\" ng-controller=\"AddRemoveRecommendationCtrl\">\r" +
    "\n" +
    "                            <button class=\"btn btn-default\" type=\"button\" ng-click=\"addNewRecommendation(pageDetail, pageId, label, pageDetail.page.title)\"\r" +
    "\n" +
    "                                    ng-hide=\"pageDetail.recommendation.user\">\r" +
    "\n" +
    "                                <span class=\"glyphicon glyphicon-plus\" aria-hidden=\"true\"></span> Bewerten\r" +
    "\n" +
    "                            </button>\r" +
    "\n" +
    "                            <button class=\"btn btn-default\" type=\"button\" ng-click=\"removeRecommendation(pageDetail, pageId, label)\"\r" +
    "\n" +
    "                                    ng-show=\"pageDetail.recommendation.user && pageDetail.recommendation.users\">Bewertung entfernen\r" +
    "\n" +
    "                            </button>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div class=\"page-detail-header-rating-overviews\">\r" +
    "\n" +
    "                            <div class=\"page-detail-header-rating-overview\">\r" +
    "\n" +
    "                                <ely-star-rating is-readonly=\"true\" is-small=\"true\"\r" +
    "\n" +
    "                                                 number-of-selected-stars-readonly=\"pageDetail.recommendation.summary.contact.rating\"></ely-star-rating>\r" +
    "\n" +
    "                                <div class=\"page-detail-header-rating-overview-description\">\r" +
    "\n" +
    "                                    (Kontakte {{pageDetail.recommendation.summary.contact.numberOfRatings}})\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div class=\"page-detail-header-rating-overview\">\r" +
    "\n" +
    "                                <ely-star-rating is-readonly=\"true\" is-small=\"true\"\r" +
    "\n" +
    "                                                 number-of-selected-stars-readonly=\"pageDetail.recommendation.summary.all.rating\"></ely-star-rating>\r" +
    "\n" +
    "                                <div class=\"page-detail-header-rating-overview-description\">\r" +
    "\n" +
    "                                    (Alle {{pageDetail.recommendation.summary.all.numberOfRatings}})\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"page-detail-section-separator\"></div>\r" +
    "\n" +
    "            <div id=\"page-detail-description\">\r" +
    "\n" +
    "                <div class=\"page-detail-section-title\">Beschreibung</div>\r" +
    "\n" +
    "                <div id=\"page-detail-description-text\" style=\"height: 100px\">{{pageDetail.page.description}}</div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"page-detail-reference-pages\">\r" +
    "\n" +
    "                <div class=\"page-detail-reference-title\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"page-detail-reference-preview\" ng-repeat=\"pagePreview in pageDetail.page.pageReference\">\r" +
    "\n" +
    "                    <div class=\"page-detail-reference-preview-content\">\r" +
    "\n" +
    "                        <img ng-src=\"{{pagePreview.previewUrl}}\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"profile-contacts-preview-name\">\r" +
    "\n" +
    "                            <div class=\"name\">{{pagePreview.title}}</div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div id=\"leftColNav\" ng-include=\"'app/modules/page/leftNavCol.html'\"></div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('app/modules/page/pageOverview.html',
    "<div id=\"content-page-overview\">\r" +
    "\n" +
    "    <div id=\"centerCol\">\r" +
    "\n" +
    "        <div id=\"inner-centerCol\">\r" +
    "\n" +
    "            <div ng-repeat=\"pagePreview in page.pages\">\r" +
    "\n" +
    "                <ely-page-preview page-preview=\"pagePreview\"></ely-page-preview>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div id=\"leftCol\">\r" +
    "\n" +
    "        <div id=\"inner-leftCol\">\r" +
    "\n" +
    "            <ely-search-box description=\"Suche nach Seite...\" query=\"query\"\r" +
    "\n" +
    "                            get-query-suggestion=\"getUserSuggestion\"\r" +
    "\n" +
    "                            get-query=\"searchPage\"></ely-search-box>\r" +
    "\n" +
    "            <button class=\"btn btn-default page-preview-add-page\" type=\"button\" ng-click=\"createNewPage()\">\r" +
    "\n" +
    "                <span class=\"glyphicon glyphicon-plus\" aria-hidden=\"true\"></span> Seite erstellen\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "            <div>Filtern nach</div>\r" +
    "\n" +
    "            <ul id=\"contact-counter\" class=\"list-group\">\r" +
    "\n" +
    "                <div>\r" +
    "\n" +
    "                    <li class=\"list-group-item\"\r" +
    "\n" +
    "                        ng-class=\"{'group-selected': allFilterEnabled}\">\r" +
    "\n" +
    "                        <span class=\"badge\">{{users.numberOfContacts}}</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"contact-description-count\" ng-click=\"selectedAllContacts()\">{{}}\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div ng-repeat=\"statistic in users.statistic\">\r" +
    "\n" +
    "                    <li class=\"list-group-item\"\r" +
    "\n" +
    "                        ng-class=\"{'group-selected': statistic.selected}\">\r" +
    "\n" +
    "                        <span class=\"badge\">{{statistic.count}}</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"contact-description-count\"\r" +
    "\n" +
    "                             ng-click=\"selectedStatisticType(statistic)\">{{statistic.type}}\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div id=\"leftColNav\" ng-include=\"'app/modules/page/leftNavCol.html'\"></div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('app/modules/page/pagePreview/template.html',
    "<div class=\"page-preview\">\r" +
    "\n" +
    "    <div class=\"page-preview-image\" ng-click=\"openDetail(pagePreview.pageId, pagePreview.label)\">\r" +
    "\n" +
    "        <img ng-src=\"{{pagePreview.url}}\">\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"page-preview-text\">\r" +
    "\n" +
    "        <div class=\"page-preview-title\" ng-click=\"openDetail(pagePreview.pageId, pagePreview.label)\">\r" +
    "\n" +
    "            {{pagePreview.title}}\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"page-preview-category\">\r" +
    "\n" +
    "            Kategorie: {{pagePreview.category}}\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"page-preview-rating-overview\">\r" +
    "\n" +
    "            <div ng-show=\"pagePreview.recommendation.summary.contact.numberOfRatings > 0\">\r" +
    "\n" +
    "                <ely-star-rating is-readonly=\"true\" is-x-small=\"true\"\r" +
    "\n" +
    "                                 number-of-selected-stars-readonly=\"pagePreview.recommendation.summary.contact.rating\"></ely-star-rating>\r" +
    "\n" +
    "                <div class=\"page-preview-rating-overview-description\">\r" +
    "\n" +
    "                    (Kontakte {{pagePreview.recommendation.summary.contact.numberOfRatings}})\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div ng-show=\"pagePreview.recommendation.summary.contact.numberOfRatings === 0 && pagePreview.recommendation.summary.all.numberOfRatings > 0\"\r" +
    "\n" +
    "                 class=\"page-preview-no-rating-overview-text\">\r" +
    "\n" +
    "                Keine Bewertung durch deine Kontakte\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"page-preview-rating-overview\">\r" +
    "\n" +
    "            <div ng-show=\"pagePreview.recommendation.summary.all.numberOfRatings > 0\">\r" +
    "\n" +
    "                <ely-star-rating is-readonly=\"true\" is-x-small=\"true\"\r" +
    "\n" +
    "                                 number-of-selected-stars-readonly=\"pagePreview.recommendation.summary.all.rating\"></ely-star-rating>\r" +
    "\n" +
    "                <div class=\"page-preview-rating-overview-description\">\r" +
    "\n" +
    "                    (Alle {{pagePreview.recommendation.summary.all.numberOfRatings}})\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div ng-show=\"pagePreview.recommendation.summary.contact.numberOfRatings === 0 && pagePreview.recommendation.summary.all.numberOfRatings === 0\"\r" +
    "\n" +
    "                 class=\"page-preview-no-rating-overview-text\">\r" +
    "\n" +
    "                Seite wurde noch nie bewertet\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"page-preview-user-recommendation\" ng-controller=\"AddRemoveRecommendationCtrl\">\r" +
    "\n" +
    "        <div ng-show=\"pagePreview.recommendation.user.recommendationId\">\r" +
    "\n" +
    "            <div>\r" +
    "\n" +
    "                <button type=\"submit\" class=\"btn btn-default btn-xs\"\r" +
    "\n" +
    "                        ng-click=\"removeRecommendation(pagePreview, pagePreview.pageId, pagePreview.label)\">\r" +
    "\n" +
    "                    Bewertung entfernen\r" +
    "\n" +
    "                </button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <ely-star-rating is-readonly=\"true\" is-x-small=\"true\" class=\"page-preview-user-recommendation-rating\"\r" +
    "\n" +
    "                             number-of-selected-stars-readonly=\"pagePreview.recommendation.user.rating\"\r" +
    "\n" +
    "                             ng-class=\"{'page-preview-user-recommendation-no-comment': pagePreview.recommendation.user.comment.trim() === ''}\"></ely-star-rating>\r" +
    "\n" +
    "            <div class=\"page-preview-user-recommendation-comment\" ng-show=\"pagePreview.recommendation.user.comment.trim() !== ''\">\r" +
    "\n" +
    "                {{pagePreview.recommendation.user.comment}}\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div ng-hide=\"pagePreview.recommendation.user.recommendationId\">\r" +
    "\n" +
    "            <button type=\"submit\" class=\"btn btn-default btn-xs\"\r" +
    "\n" +
    "                    ng-click=\"addNewRecommendation(pagePreview, pagePreview.pageId, pagePreview.label, pagePreview.title)\">\r" +
    "\n" +
    "                Bewerten\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('app/modules/recommendation/home.html',
    "<div id=\"content-recommendation-home\">\r" +
    "\n" +
    "    <div id=\"centerCol\">\r" +
    "\n" +
    "        <div id=\"inner-centerCol\">\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div id=\"leftCol\">\r" +
    "\n" +
    "        <div id=\"inner-leftCol\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div id=\"leftColNav\" ng-include=\"'app/modules/recommendation/leftNavCol.html'\"></div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('app/modules/recommendation/leftNavCol.html',
    "<div class=\"nav-placeholder-top\"></div>\n" +
    "\n" +
    "<div class=\"nav-sub-element\" ui-sref=\"recommendation.home\">\n" +
    "    <div class=\"button-leftNavCol-active-wrapper\">\n" +
    "        <div ui-sref-active=\"button-leftNavCol-active\" ui-sref=\"recommendation.home\"></div>\n" +
    "    </div>\n" +
    "    <img src=\"app/img/recommendation/home.png\">\n" +
    "</div>\n" +
    "<div class=\"nav-sub-element-last\" ui-sref=\"home\">\n" +
    "    <img src=\"app/img/home.png\">\n" +
    "</div>"
  );


  $templateCache.put('app/modules/recommendation/modalAddRecommendation.html',
    "<div class=\"modal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\" ng-controller=\"ModalAddRecommendationCtrl\">\r" +
    "\n" +
    "    <div id=\"modal-dialog-add-recommendation\" class=\"modal-dialog\">\r" +
    "\n" +
    "        <div class=\"modal-content\">\r" +
    "\n" +
    "            <div class=\"modal-header\">\r" +
    "\n" +
    "                <h4 class=\"modal-title\">Deine Bewertung für\r" +
    "\n" +
    "                    <div class=\"modal-dialog-add-recommendation-title\">{{title}}</div>\r" +
    "\n" +
    "                </h4>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"modal-body\">\r" +
    "\n" +
    "                <div class=\"modal-dialog-add-recommendation-description\">\r" +
    "\n" +
    "                    <textarea class=\"form-control\" ng-model=\"recommendationDescription\"></textarea>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"modal-footer\">\r" +
    "\n" +
    "                <ely-star-rating number-of-selected-stars=\"numberOfSelectedStars\"></ely-star-rating>\r" +
    "\n" +
    "                <div class=\"modal-dialog-add-recommendation-error\" ng-show=\"error\">{{error}}</div>\r" +
    "\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-click=\"$hide()\">Abbrechen</button>\r" +
    "\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-click=\"addRecommendation()\" ng-class=\"{disabled: numberOfSelectedStars === -1}\">\r" +
    "\n" +
    "                    Hinzufügen\r" +
    "\n" +
    "                </button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('app/modules/settings/changePassword.html',
    "<div id=\"content-settings-password\">\r" +
    "\n" +
    "    <div id=\"centerCol\">\r" +
    "\n" +
    "        <div id=\"inner-centerCol\">\r" +
    "\n" +
    "            <div id=\"manage-profile\">\r" +
    "\n" +
    "                <form class=\"form-horizontal\" name=\"profileForm\" role=\"form\" novalidate>\r" +
    "\n" +
    "                    <div class=\"form-group\">\r" +
    "\n" +
    "                        <label for=\"inputPasswordActual\" class=\"col-sm-4 control-label\">Aktuelles\r" +
    "\n" +
    "                            Passwort\r" +
    "\n" +
    "                        </label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"col-sm-8\">\r" +
    "\n" +
    "                            <input name=\"inputPasswordActual\" ng-model=\"password.actualPassword\"\r" +
    "\n" +
    "                                   class=\"form-control\"\r" +
    "\n" +
    "                                   type=\"password\"\r" +
    "\n" +
    "                                   id=\"inputPasswordActual\"\r" +
    "\n" +
    "                                   required ng-maxlength=\"55\" ng-minlength=\"1\">\r" +
    "\n" +
    "                            <div class=\"alert-input alert-danger\"\r" +
    "\n" +
    "                                 ng-show=\"profileForm.inputPasswordActual.$error.minlength\">\r" +
    "\n" +
    "                                <span>Das Passwort muss mindestens 1 Zeichen lang sein</span>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div class=\"alert-input alert-danger\"\r" +
    "\n" +
    "                                 ng-show=\"profileForm.inputPasswordActual.$error.maxlength\">\r" +
    "\n" +
    "                                <span>Das Passwort darf nicht länger als 55 Zeichen sein</span>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"form-group\">\r" +
    "\n" +
    "                        <label for=\"inputPassword\" class=\"col-sm-4 control-label\">Neu\r" +
    "\n" +
    "                        </label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"col-sm-8\">\r" +
    "\n" +
    "                            <input name=\"inputPassword\" ng-model=\"password.newPassword\"\r" +
    "\n" +
    "                                   class=\"form-control\"\r" +
    "\n" +
    "                                   type=\"password\"\r" +
    "\n" +
    "                                   id=\"inputPassword\"\r" +
    "\n" +
    "                                   required ng-maxlength=\"55\" ng-pattern=\"/^(?=.*[A-Z])(?=.*\\d)/\">\r" +
    "\n" +
    "                            <div class=\"alert-input alert-danger\"\r" +
    "\n" +
    "                                 ng-show=\"profileForm.inputPassword.$error.pattern\">\r" +
    "\n" +
    "                                <span>Das Passwort muss mindestens eine Zahl und einen Grossbuchstaben beinhalten</span>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div class=\"alert-input alert-danger\"\r" +
    "\n" +
    "                                 ng-show=\"profileForm.inputPassword.$error.minlength\">\r" +
    "\n" +
    "                                <span>Das Passwort muss mindestens 8 Zeichen lang sein</span>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div class=\"alert-input alert-danger\"\r" +
    "\n" +
    "                                 ng-show=\"profileForm.inputPassword.$error.maxlength\">\r" +
    "\n" +
    "                                <span>Das Passwort darf nicht länger als 55 Zeichen sein</span>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"form-group\">\r" +
    "\n" +
    "                        <label  id=\"label-password-confirm\" for=\"inputPasswordConfirm\" class=\"col-sm-4 control-label\">Neues\r" +
    "\n" +
    "                            Passwort erneut eingeben\r" +
    "\n" +
    "                        </label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"col-sm-8\">\r" +
    "\n" +
    "                            <input name=\"inputPasswordConfirm\"\r" +
    "\n" +
    "                                   ng-model=\"password.newPasswordConfirm\"\r" +
    "\n" +
    "                                   class=\"form-control\"\r" +
    "\n" +
    "                                   type=\"password\"\r" +
    "\n" +
    "                                   id=\"inputPasswordConfirm\"\r" +
    "\n" +
    "                                   required ng-maxlength=\"55\">\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"form-group\">\r" +
    "\n" +
    "                        <div class=\"col-sm-offset-4 col-sm-8\">\r" +
    "\n" +
    "                            <div>\r" +
    "\n" +
    "                                <button id=\"submit-change-profile\" type=\"submit\"\r" +
    "\n" +
    "                                        class=\"btn btn-default\"\r" +
    "\n" +
    "                                        ng-click=\"submitNewPassword()\">\r" +
    "\n" +
    "                                    Passwort ändern\r" +
    "\n" +
    "                                </button>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div class=\"alert-input alert-danger\"\r" +
    "\n" +
    "                                 ng-show=\"profileForm.$invalid && submitFailed\">\r" +
    "\n" +
    "                                <span>Bitte fülle alle Werte korrekt aus</span>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div class=\"alert-input alert-danger\"\r" +
    "\n" +
    "                                 ng-show=\"newPasswordNotEqual\">\r" +
    "\n" +
    "                                <span>Das neue Passwort stimmt nicht überein</span>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div class=\"alert-input alert-danger\"\r" +
    "\n" +
    "                                 ng-show=\"profileForm.$invalid == false && submitFailedToServer\">\r" +
    "\n" +
    "                                <span>Fehler auf dem Server. Die Werte konnten nicht gespeichert werden</span>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div class=\"alert-input alert-success\"\r" +
    "\n" +
    "                                 ng-show=\"successUserDataChange && profileForm.$pristine\">\r" +
    "\n" +
    "                                <span>Passwort erfolgreich geändert</span>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </form>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div id=\"leftColNav\" ng-include=\"'app/modules/settings/leftNavCol.html'\"></div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('app/modules/settings/leftNavCol.html',
    "<div class=\"nav-placeholder-top\"></div>\n" +
    "\n" +
    "<div class=\"nav-sub-element\" ui-sref=\"settings.profile\">\n" +
    "    <div class=\"button-leftNavCol-active-wrapper\">\n" +
    "        <div ui-sref-active=\"button-leftNavCol-active-white\" ui-sref=\"settings.profile\"></div>\n" +
    "    </div>\n" +
    "    <img src=\"app/img/defaultProfile.png\">\n" +
    "</div>\n" +
    "<div class=\"nav-sub-element\" ui-sref=\"settings.privacy\">\n" +
    "    <div class=\"button-leftNavCol-active-wrapper\">\n" +
    "        <div ui-sref-active=\"button-leftNavCol-active\" ui-sref=\"settings.privacy\"></div>\n" +
    "    </div>\n" +
    "    <img src=\"app/img/security.png\">\n" +
    "</div>\n" +
    "<div class=\"nav-sub-element-last\" ui-sref=\"home\">\n" +
    "    <img src=\"app/img/home.png\">\n" +
    "</div>"
  );


  $templateCache.put('app/modules/settings/popoverDeletePrivacy.html',
    "<div class=\"popover\" ng-controller=\"DeletePrivacyCtrl\">\r" +
    "\n" +
    "    <div class=\"arrow\"></div>\r" +
    "\n" +
    "    <div class=\"popover-content\">\r" +
    "\n" +
    "        <form name=\"popoverForm\">\r" +
    "\n" +
    "            <div class=\"popover-element-description\">\r" +
    "\n" +
    "                Kontakte <b>{{privacy.type}}</b> werden beim löschen der Privatsphären Einstellung verschoben nach:\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <button type=\"button\" class=\"btn btn-default popover-element-right\" ng-model=\"otherPrivacySettingType\"\r" +
    "\n" +
    "                    bs-options=\"privacyType for privacyType in otherPrivacySettingTypes\" bs-select>\r" +
    "\n" +
    "                Action <span class=\"caret\"></span>\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "            <div class=\"popover-element-divider\"></div>\r" +
    "\n" +
    "            <div class=\"popover-element-right\">\r" +
    "\n" +
    "                <button type=\"submit\" class=\"btn btn-default\"\r" +
    "\n" +
    "                        ng-click=\"deletePrivacySetting()\">Löschen\r" +
    "\n" +
    "                </button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"popover-element\">\r" +
    "\n" +
    "                <button type=\"submit\" class=\"btn btn-default\"\r" +
    "\n" +
    "                        ng-click=\"$hide()\">Abbrechen\r" +
    "\n" +
    "                </button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </form>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('app/modules/settings/popoverRenamePrivacy.html',
    "<div class=\"popover\" ng-controller=\"RenamePrivacyCtrl\">\r" +
    "\n" +
    "    <div class=\"arrow\"></div>\r" +
    "\n" +
    "    <div class=\"popover-content\">\r" +
    "\n" +
    "        <form name=\"popoverForm\">\r" +
    "\n" +
    "            <div class=\"popover-element-description\">\r" +
    "\n" +
    "                Privatsphären Einstellung <b>{{privacy.type}}</b> umbennen in:\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"popover-element\">\r" +
    "\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"renameType\"\r" +
    "\n" +
    "                       bs-options=\"type for type in types\"\r" +
    "\n" +
    "                       bs-typeahead>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"popover-element\">\r" +
    "\n" +
    "                <button type=\"submit\" class=\"btn btn-default\"\r" +
    "\n" +
    "                        ng-class=\"{'disabled': renameType === privacy.type || renameType.trim() === '' || renameExists}\"\r" +
    "\n" +
    "                        ng-click=\"renamePrivacySetting()\">Ändern\r" +
    "\n" +
    "                </button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"popover-element\">\r" +
    "\n" +
    "                <div class=\"alert-input alert-danger\"\r" +
    "\n" +
    "                     ng-if=\"renameExists && renameType !== privacy.type\">\r" +
    "\n" +
    "                    <span>Diese Privatspähren Einstellung existiert bereits.</span>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </form>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('app/modules/settings/privacy.html',
    "<div id=\"content-settings-security\">\n" +
    "    <div id=\"centerCol\">\n" +
    "        <div id=\"inner-centerCol\">\n" +
    "            <div class=\"website-structure-header\">\n" +
    "                <div class=\"website-structure-header-title\">\n" +
    "                    <h2>Privatsphäre Einstellung für {{selectedType.type}}</h2>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"content-privacy\">\n" +
    "                <div class=\"privacy-setting-row\">\n" +
    "                    <div class=\"select-privacy-settings\">\n" +
    "                        <input type=\"checkbox\" ng-model=\"selectedType.profileVisible\">\n" +
    "\n" +
    "                        <div class=\"select-privacy-settings-text\">\n" +
    "                            Mein Profil ist sichtbar\n" +
    "                        </div>\n" +
    "                        <div class=\"select-privacy-settings-description\" ng-show=\"privacySettings.noContactSelected\">\n" +
    "                            Wenn diese Funktion deaktiviert ist, können andere User die Du nicht zu deinen Kontakten hinzugefügt hast nur deinen Namen\n" +
    "                            sehen. Alle anderen Profildaten bleiben verborgen.\n" +
    "                        </div>\n" +
    "                        <div class=\"select-privacy-settings-description\" ng-show=\"!privacySettings.noContactSelected\">\n" +
    "                            Wenn diese Funktion deaktiviert ist, können andere User die Du der Gruppe {{selectedType.type}} hinzugefügt hast nur\n" +
    "                            deinen Namen sehen. Alle anderen Profildaten bleiben verborgen.\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"privacy-setting-row\">\n" +
    "                    <div class=\"select-privacy-settings\">\n" +
    "                        <input type=\"checkbox\" ng-model=\"selectedType.contactsVisible\" ng-disabled=\"!selectedType.profileVisible\">\n" +
    "\n" +
    "                        <div ng-class=\"{'select-privacy-settings-text': selectedType.profileVisible, 'select-privacy-settings-text-disabled': !selectedType.profileVisible}\">\n" +
    "                            Meine Kontakte sind sichtbar\n" +
    "                        </div>\n" +
    "                        <div class=\"select-privacy-settings-description\" ng-show=\"privacySettings.noContactSelected\">\n" +
    "                            Bestimmt ob User die Du nicht als Kontakte hinzugefügt hast deine Kontakte sehen können.\n" +
    "                        </div>\n" +
    "                        <div class=\"select-privacy-settings-description\" ng-show=\"!privacySettings.noContactSelected\">\n" +
    "                            Bestimmt ob User die Du der Gruppe {{selectedType.type}} hinzugefügt hast deine Kontake sehen können.\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"privacy-setting-row\">\n" +
    "                    <div class=\"select-privacy-settings\">\n" +
    "                        <input type=\"checkbox\" ng-model=\"selectedType.imageVisible\" ng-disabled=\"!selectedType.profileVisible\">\n" +
    "\n" +
    "                        <div ng-class=\"{'select-privacy-settings-text': selectedType.profileVisible, 'select-privacy-settings-text-disabled': !selectedType.profileVisible}\">\n" +
    "                            Mein Profilbild ist sichtbar\n" +
    "                        </div>\n" +
    "                        <div class=\"select-privacy-settings-description\" ng-show=\"privacySettings.noContactSelected\">\n" +
    "                            Bestimmt ob User die Du nicht als Kontakte hinzugefügt hast dein Profilbild sehen können.\n" +
    "                        </div>\n" +
    "                        <div class=\"select-privacy-settings-description\" ng-show=\"!privacySettings.noContactSelected\">\n" +
    "                            Bestimmt ob User die Du der Gruppe {{selectedType.type}} hinzugefügt hast dein Profilbild sehen können.\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"privacy-setting-row\">\n" +
    "                    <div class=\"select-privacy-settings\">\n" +
    "                        <input type=\"checkbox\" ng-model=\"selectedType.profileDataVisible\" ng-disabled=\"!selectedType.profileVisible\">\n" +
    "\n" +
    "                        <div ng-class=\"{'select-privacy-settings-text': selectedType.profileVisible, 'select-privacy-settings-text-disabled': !selectedType.profileVisible}\">\n" +
    "                            Meine Profildaten sind sichtbar\n" +
    "                        </div>\n" +
    "                        <div class=\"select-privacy-settings-description\" ng-show=\"privacySettings.noContactSelected\">\n" +
    "                            Bestimmt ob User die Du nicht als Kontakte hinzugefügt hast deine Profil Daten, wie z.B. deinen Geburtstag, sehen können.\n" +
    "                        </div>\n" +
    "                        <div class=\"select-privacy-settings-description\" ng-show=\"!privacySettings.noContactSelected\">\n" +
    "                            Bestimmt ob User die Du der Gruppe {{selectedType.type}} hinzugefügt hast deine Profil Daten, wie z.B. deinen Geburtstag,\n" +
    "                            sehen können.\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"privacy-setting-button-row\">\n" +
    "                    <ely-send-button button-description=\"Änderung übernehmen\" send-data=\"updatePrivacyType\"\n" +
    "                                     error-placement=\"right\" model=\"selectedType\"></ely-send-button>\n" +
    "                    <!--<button class=\"btn btn-default\" ng-class=\"{disabled: disableChangePrivacy}\"\n" +
    "                            type=\"submit\" ng-click=\"updatePrivacyType()\">Änderung übernehmen\n" +
    "                    </button>-->\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div id=\"leftCol\">\n" +
    "        <div id=\"inner-leftCol\">\n" +
    "            <ul class=\"list-group\">\n" +
    "                <div>\n" +
    "                    <li class=\"list-group-item\" ng-click=\"setPrivacyTypeNoContact()\"\n" +
    "                        ng-class=\"{'group-selected': privacySettings.noContactSelected}\">\n" +
    "\n" +
    "                        <div class=\"privacy-type-description\">Kein Kontakt</div>\n" +
    "                    </li>\n" +
    "                </div>\n" +
    "                <div ng-repeat=\"privacy in privacySettings.normal\">\n" +
    "                    <li class=\"list-group-item\"\n" +
    "                        ng-class=\"{'group-selected': selectedType.type === privacy.type}\">\n" +
    "                        <div class=\"list-group-item-container\">\n" +
    "                            <img ng-if=\"privacySettings.normal.length > 1\"\n" +
    "                                 class=\"list-group-item-icons\"\n" +
    "                                 src=\"app/img/delete.png\" trigger=\"click\"\n" +
    "                                 data-auto-close=\"true\"\n" +
    "                                 data-placement=\"bottom\"\n" +
    "                                 data-template=\"app/modules/settings/popoverDeletePrivacy.html\"\n" +
    "                                 bs-popover/>\n" +
    "                        </div>\n" +
    "                        <div class=\"list-group-item-container\">\n" +
    "                            <img class=\"list-group-item-icons\" src=\"app/img/edit.png\"\n" +
    "                                 trigger=\"click\"\n" +
    "                                 data-auto-close=\"true\"\n" +
    "                                 data-placement=\"bottom\"\n" +
    "                                 data-template=\"app/modules/settings/popoverRenamePrivacy.html\"\n" +
    "                                 bs-popover/>\n" +
    "                        </div>\n" +
    "                        <div class=\"privacy-type-description\"\n" +
    "                             ng-click=\"setPrivacyType(privacy.type)\">{{privacy.type}}\n" +
    "                        </div>\n" +
    "                    </li>\n" +
    "                </div>\n" +
    "                <div>\n" +
    "                    <div class=\"privacy-adding\" ng-if=\"!showNewPrivacySettingInput && privacySettings.normal.length < 10\">\n" +
    "                        <a href=\"#\" ng-click=\"showAddingNewPrivacySetting()\">Neuer Privatsphären Typ\n" +
    "                            hinzufügen...</a>\n" +
    "                    </div>\n" +
    "                    <div class=\"privacy-adding-input\" ng-if=\"showNewPrivacySettingInput\">\n" +
    "                        <input class=\"form-control\" placeholder=\"Privatsphären Typ\" ng-maxlength=\"30\"\n" +
    "                               ng-model=\"addingPrivacy.newPrivacyName\">\n" +
    "                        <button class=\"btn btn-default\" type=\"button\" ng-click=\"addPrivacySetting()\"\n" +
    "                                ng-class=\"{disabled: addingPrivacy.newPrivacyName.trim() === ''}\">\n" +
    "                            Hinzufügen\n" +
    "                        </button>\n" +
    "                        <button class=\"btn btn-default\" type=\"button\"\n" +
    "                                ng-click=\"abortAddingNewPrivacy()\">Abbrechen\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div id=\"leftColNav\" ng-include=\"'app/modules/settings/leftNavCol.html'\"></div>\n" +
    "</div>"
  );


  $templateCache.put('app/modules/settings/profile.html',
    "<div id=\"content-settings-profile\">\r" +
    "\n" +
    "    <div id=\"centerCol\">\r" +
    "\n" +
    "        <div id=\"inner-centerCol\">\r" +
    "\n" +
    "            <div id=\"manage-profile-photo-container\">\r" +
    "\n" +
    "                <div>\r" +
    "\n" +
    "                    <img class=\"img-rounded img-responsive\"\r" +
    "\n" +
    "                         ng-src=\"{{userDataToChange.profileImage}}\"/>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <button id=\"change-profile-image\" type=\"button\" class=\"btn btn-default\"\r" +
    "\n" +
    "                        data-animation=\"am-fade-and-scale\" data-placement=\"center\"\r" +
    "\n" +
    "                        data-backdrop=\"static\"\r" +
    "\n" +
    "                        data-template=\"app/modules/util/file/uploadFile.html\" bs-modal=\"modal\">\r" +
    "\n" +
    "                    Foto ändern..\r" +
    "\n" +
    "                </button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div id=\"manage-profile\">\r" +
    "\n" +
    "                <form class=\"form-horizontal\" name=\"profileForm\" role=\"form\" novalidate>\r" +
    "\n" +
    "                    <div class=\"form-group\">\r" +
    "\n" +
    "                        <label for=\"inputEmail\" class=\"col-sm-4 control-label\">E-Mail</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"col-sm-8\">\r" +
    "\n" +
    "                            <input name=\"inputEmail\" ng-model=\"userDataToChange.email\"\r" +
    "\n" +
    "                                   class=\"form-control\"\r" +
    "\n" +
    "                                   id=\"inputEmail\"\r" +
    "\n" +
    "                                   ng-disabled=\"true\">\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"form-group\">\r" +
    "\n" +
    "                        <div class=\"col-sm-4\"></div>\r" +
    "\n" +
    "                        <div class=\"col-sm-5\">\r" +
    "\n" +
    "                            <a ui-sref=\"settings.profile.changePassword\">\r" +
    "\n" +
    "                                <button id=\"change-profile-password\" type=\"button\"\r" +
    "\n" +
    "                                        class=\"btn btn-default\">\r" +
    "\n" +
    "                                    Passwort ändern..\r" +
    "\n" +
    "                                </button>\r" +
    "\n" +
    "                            </a>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <ely-form-text-input label=\"Vorname\" input-name=\"inputForename\" input-placeholder=\"Vorname\"\r" +
    "\n" +
    "                                         profile-form=\"profileForm\" submit-model=\"userDataToChange.forename\"\r" +
    "\n" +
    "                                         max-length=\"30\" required=\"true\"></ely-form-text-input>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <ely-form-text-input label=\"Nachname\" input-name=\"inputSurename\" input-placeholder=\"Nachname\"\r" +
    "\n" +
    "                                         profile-form=\"profileForm\" submit-model=\"userDataToChange.surname\"\r" +
    "\n" +
    "                                         max-length=\"50\" required=\"true\"></ely-form-text-input>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <ely-form-text-input label=\"Geburtstag\" input-name=\"inputBirthday\" input-placeholder=\"z.B {{getDateExample()}}\"\r" +
    "\n" +
    "                                         profile-form=\"profileForm\" submit-model=\"userDataToChange.birthday\"\r" +
    "\n" +
    "                                         required=\"true\"\r" +
    "\n" +
    "                                         custom-error-description=\"Gib einen gültigen Geburtstag ein (z.B. {{getDateExample()}})\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </ely-form-text-input>\r" +
    "\n" +
    "                    <ely-form-text-input label=\"Strasse\" input-name=\"inputStreet\" input-placeholder=\"Strasse\"\r" +
    "\n" +
    "                                         profile-form=\"profileForm\" submit-model=\"userDataToChange.street\"\r" +
    "\n" +
    "                                         max-length=\"80\"></ely-form-text-input>\r" +
    "\n" +
    "                    <ely-form-text-input label=\"Ort\" input-name=\"inputPlace\" input-placeholder=\"Ort\"\r" +
    "\n" +
    "                                         profile-form=\"profileForm\" submit-model=\"userDataToChange.place\"\r" +
    "\n" +
    "                                         max-length=\"80\"></ely-form-text-input>\r" +
    "\n" +
    "                    <div class=\"form-group\"\r" +
    "\n" +
    "                         ng-class=\"{'has-error': profileForm.inputCountry.$invalid && (visitedCountry || submitFailed)}\">\r" +
    "\n" +
    "                        <label for=\"inputCountryId\" class=\"col-sm-4 control-label\">Land</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"col-sm-8\">\r" +
    "\n" +
    "                            <button type=\"button\" class=\"btn btn-default\" ng-model=\"selectedCountryCode\"\r" +
    "\n" +
    "                                    name=\"inputCountry\"\r" +
    "\n" +
    "                                    id=\"inputCountryId\"\r" +
    "\n" +
    "                                    bs-options=\"countryCode.country as countryCode.country for countryCode in countryCodes\"\r" +
    "\n" +
    "                                    data-placeholder=\"Land\"\r" +
    "\n" +
    "                                    bs-select>\r" +
    "\n" +
    "                                Action <span class=\"caret\"></span>\r" +
    "\n" +
    "                            </button>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"form-group\">\r" +
    "\n" +
    "                        <label for=\"inputGender\" class=\"col-sm-4 control-label\">Geschlecht</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"col-sm-8\">\r" +
    "\n" +
    "                            <div class=\"btn-group\" id=\"inputGender\">\r" +
    "\n" +
    "                                <label class=\"btn btn-default\"\r" +
    "\n" +
    "                                       ng-click=\"userDataToChange.female = true; profileForm.$setDirty()\"\r" +
    "\n" +
    "                                       ng-class=\"{'active': userDataToChange.female === true}\">Frau</label>\r" +
    "\n" +
    "                                <label class=\"btn btn-default\"\r" +
    "\n" +
    "                                       ng-click=\"userDataToChange.female = false; profileForm.$setDirty()\"\r" +
    "\n" +
    "                                       ng-class=\"{'active': userDataToChange.female === false}\">Mann</label>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"form-group\">\r" +
    "\n" +
    "                        <div class=\"col-sm-offset-4 col-sm-8\">\r" +
    "\n" +
    "                            <div>\r" +
    "\n" +
    "                                <ely-send-button button-description=\"Profil ändern\" send-data=\"submitProfileData\"\r" +
    "\n" +
    "                                                 error-placement=\"right\" model=\"userDataToChange\" ></ely-send-button>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </form>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div id=\"leftColNav\" ng-include=\"'app/modules/settings/leftNavCol.html'\"></div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('app/modules/util/dialog/yesNoDialog.html',
    "<div class=\"modal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\r" +
    "\n" +
    "    <div id=\"modal-yes-no-dialog\" class=\"modal-dialog\">\r" +
    "\n" +
    "        <div class=\"modal-content\">\r" +
    "\n" +
    "            <div class=\"modal-header\" ng-show=\"title\"><h4 class=\"modal-title\" ng-bind=\"title\"></h4></div>\r" +
    "\n" +
    "            <div class=\"modal-body\" ng-bind=\"content\"></div>\r" +
    "\n" +
    "            <div class=\"modal-footer\">\r" +
    "\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-click=\"abort()\">Nein</button>\r" +
    "\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-click=\"confirm()\">Ja</button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('app/modules/util/file/previewFile.html',
    "<div class=\"modal\" tabindex=\"-1\" role=\"dialog\" ng-controller=\"FileCtrl\">\r" +
    "\n" +
    "    <div class=\"modal-dialog\" id=\"modal-preview-file\">\r" +
    "\n" +
    "        <div class=\"modal-content\">\r" +
    "\n" +
    "            <div class=\"modal-body\">\r" +
    "\n" +
    "                <div class=\"cropArea\">\r" +
    "\n" +
    "                    <ely-image-cropper ng-if=\"!uploadRunning\"\r" +
    "\n" +
    "                                       reset=\"resetImage\"\r" +
    "\n" +
    "                                       image=\"imageForUploadPreview\"\r" +
    "\n" +
    "                                       image-result-data=\"imageResultData\"\r" +
    "\n" +
    "                                       ratio=\"0.75\"\r" +
    "\n" +
    "                                       original-size=\"checkOriginalSize\" min-width=\"300\" min-height=\"200\"></ely-image-cropper>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"cropArea-orientation\">\r" +
    "\n" +
    "                    <div class=\"btn-group-vertical\" role=\"group\">\r" +
    "\n" +
    "                        <button type=\"button\" class=\"btn btn-default cropArea-orientation-img\" ng-class=\"{'active': isLandscape === false}\"><img\r" +
    "\n" +
    "                                src=\"app/img/portraitFormat.png\" ng-click=\"setFormat(0.75, false)\"></button>\r" +
    "\n" +
    "                        <button type=\"button\" class=\"btn btn-default cropArea-orientation-img\" ng-class=\"{'active': isLandscape === true}\"><img\r" +
    "\n" +
    "                                src=\"app/img/landscapeFormat.png\" ng-click=\"setFormat(1.25, true)\"></button>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <ely-spin ng-if=\"uploadRunning\"></ely-spin>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"modal-footer\">\r" +
    "\n" +
    "                <span class=\"btn btn-default btn-file\" ng-class=\"{disabled: uploadRunning}\">\r" +
    "\n" +
    "                    Bild auswählen...<input type=\"file\" ely-file-model=\"imageForUpload\"\r" +
    "\n" +
    "                                            accept=\".jpg, .png, jpeg\">\r" +
    "\n" +
    "                </span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div class=\"upload-file-error\" ng-show=\"uploadError\">\r" +
    "\n" +
    "                    {{uploadError}}\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <button type=\"button\" class=\"btn btn-default\"\r" +
    "\n" +
    "                        ng-class=\"{disabled: uploadRunning}\" ng-click=\"$hide()\">Abbrechen\r" +
    "\n" +
    "                </button>\r" +
    "\n" +
    "                <button type=\"button\" class=\"btn btn-default\"\r" +
    "\n" +
    "                        ng-class=\"{disabled: !imageForUploadPreview || uploadRunning || uploadError}\"\r" +
    "\n" +
    "                        ng-click=\"getPreview()\">\r" +
    "\n" +
    "                    Auswählen\r" +
    "\n" +
    "                </button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('app/modules/util/file/uploadFile.html',
    "<div class=\"modal\" tabindex=\"-1\" role=\"dialog\" ng-controller=\"FileCtrl\">\r" +
    "\n" +
    "    <div class=\"modal-dialog\">\r" +
    "\n" +
    "        <div class=\"modal-content\">\r" +
    "\n" +
    "            <div class=\"modal-body\">\r" +
    "\n" +
    "                <div class=\"cropArea\">\r" +
    "\n" +
    "                    <ely-image-cropper ng-if=\"!uploadRunning\"\r" +
    "\n" +
    "                                       reset=\"resetImage\"\r" +
    "\n" +
    "                                       image=\"imageForUploadPreview\"\r" +
    "\n" +
    "                                       image-result-data=\"imageResultData\"\r" +
    "\n" +
    "                                       ratio=\"1\"></ely-image-cropper>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <ely-spin ng-if=\"uploadRunning\"></ely-spin>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"modal-footer\">\r" +
    "\n" +
    "                <span class=\"btn btn-default btn-file\" ng-class=\"{disabled: uploadRunning}\">\r" +
    "\n" +
    "                    Bild auswählen...<input type=\"file\" ely-file-model=\"imageForUpload\"\r" +
    "\n" +
    "                                            accept=\".jpg, .png, jpeg\">\r" +
    "\n" +
    "                </span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div class=\"upload-file-error\" ng-show=\"uploadError\">\r" +
    "\n" +
    "                    {{uploadError}}\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <button type=\"button\" class=\"btn btn-default\"\r" +
    "\n" +
    "                        ng-class=\"{disabled: uploadRunning}\" ng-click=\"$hide()\">Abbrechen\r" +
    "\n" +
    "                </button>\r" +
    "\n" +
    "                <button type=\"button\" class=\"btn btn-default\"\r" +
    "\n" +
    "                        ng-class=\"{disabled: !imageForUploadPreview || uploadRunning}\"\r" +
    "\n" +
    "                        ng-click=\"startUpload()\">\r" +
    "\n" +
    "                    Hochladen\r" +
    "\n" +
    "                </button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('app/modules/util/tooltip/tooltipError.html',
    "<div class=\"tooltip in ely-tooltip-error\" ng-show=\"title\">\r" +
    "\n" +
    "    <div class=\"tooltip-arrow\"></div>\r" +
    "\n" +
    "    <div class=\"tooltip-inner\" ng-bind=\"title\"></div>\r" +
    "\n" +
    "</div>"
  );

}]);
