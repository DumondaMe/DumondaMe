(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
angular.module('elyoosApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/modules/auth/checkLoginState/template.html',
    "<div id=check-login layout=column layout-align=\"center center\"><md-progress-circular md-mode=indeterminate md-diameter=100></md-progress-circular></div>"
  );


  $templateCache.put('app/modules/auth/login/template.html',
    "<div id=loginform layout=column layout-align=\"center center\"><md-card id=login-card><md-card-header><md-card-header-text class=md-headline>Login</md-card-header-text></md-card-header><md-card-content layout-padding><form name=loginForm><md-input-container class=\"input-element md-block\"><label>Email</label><input required type=email name=username id=id_username aria-label=Email ng-model=ctrl.loginuser.email><div ng-messages=loginForm.username.$error><div ng-message=required>Dieses Feld wird benötigt!</div><div ng-message=email>Keine gültige E-Mail Adresse!</div></div></md-input-container><md-input-container class=\"input-element md-block\"><label>Passwort</label><input type=password required name=password id=id_password aria-label=Passwort md-autofocus ng-model=ctrl.loginuser.password><div ng-messages=loginForm.password.$error><div ng-message=required>Dieses Feld wird benötigt!</div></div></md-input-container></form><div class=\"error-message alert alert-danger\" role=alert ng-show=ctrl.error>{{ctrl.error}}</div></md-card-content><md-card-actions layout=row layout-align=\"end center\"><md-button id=login class=md-primary type=submit ng-click=ctrl.login() ng-disabled=\"loginForm.$invalid || ctrl.loginRunning\">Anmelden</md-button></md-card-actions><md-progress-linear ng-if=ctrl.loginRunning md-mode=indeterminate></md-progress-linear></md-card></div>"
  );


  $templateCache.put('app/modules/auth/register.html',
    "<div id=content-settings-profile><div id=centerCol><div id=inner-centerCol><div id=manage-profile><form class=form-horizontal name=profileForm role=form novalidate><div class=form-group><label for=inputEmail class=\"col-sm-4 control-label\">E-Mail</label><div class=col-sm-8><input name=inputEmail ng-model=userDataToChange.email class=form-control id=inputEmail placeholder=Email></div></div><div class=form-group><label for=inputPassword class=\"col-sm-4 control-label\">Passwort</label><div class=col-sm-8><input name=inputEmail ng-model=userDataToChange.password class=form-control id=inputPassword></div></div><div class=form-group ng-class=\"{'has-error': profileForm.inputForename.$invalid && (visitedForename || submitFailed)}\"><label for=inputForenameId class=\"col-sm-4 control-label\">Vorname</label><div class=col-sm-8><input name=inputForename ng-model=userDataToChange.forename class=form-control id=inputForenameId ng-blur=\"visitedForename = true\" placeholder=Vorname required ng-maxlength=30><div class=\"alert-input alert-danger\" ng-show=\"profileForm.inputForename.$error.required && (visitedForename || submitFailed)\"><span>Es wird ein Vorname benötigt</span></div><div class=\"alert-input alert-danger\" ng-show=\"profileForm.inputForename.$error.maxlength && (visitedForename || submitFailed)\"><span>Der Vorname darf nicht länger als 30 Zeichen sein</span></div></div></div><div class=form-group ng-class=\"{'has-error': profileForm.inputSurename.$invalid && (visitedSurename || submitFailed)}\"><label for=inputSurename class=\"col-sm-4 control-label\">Nachname</label><div class=col-sm-8><input name=inputSurename ng-model=userDataToChange.surname class=form-control id=inputSurename ng-blur=\"visitedSurename = true\" placeholder=Nachname required ng-maxlength=50><div class=\"alert-input alert-danger\" ng-show=\"profileForm.inputSurename.$error.required && (visitedSurename || submitFailed)\"><span>Es wird ein Nachname benötigt</span></div><div class=\"alert-input alert-danger\" ng-show=\"profileForm.inputSurename.$error.maxlength && (visitedSurename || submitFailed)\"><span>Der Nachname darf nicht länger als 50 Zeichen sein</span></div></div></div><div class=form-group ng-class=\"{'has-error': profileForm.inputBirthday.$invalid && (visitedBirthday || submitFailed)}\"><label for=inputBirthday class=\"col-sm-4 control-label\">Geburtstag</label><div class=col-sm-8><input name=inputBirthday ng-model=userDataToChange.birthday class=form-control id=inputBirthday ng-blur=\"visitedBirthday = true\" placeholder=\"z.B {{getDateExample()}}\" required><div class=\"alert-input alert-danger\" ng-show=\"profileForm.inputBirthday.$error.required && (visitedBirthday || submitFailed)\"><span>Bitte gib deinen Geburtstag an</span></div><div class=\"alert-input alert-danger\" ng-show=\"profileForm.inputBirthday.$error.date && (visitedBirthday || submitFailed)\"><span>Gib einen gültigen Geburtstag ein (z.B. {{getDateExample()}})</span></div></div></div><div class=form-group ng-class=\"{'has-error': profileForm.inputCountry.$invalid && (visitedCountry || submitFailed)}\"><label for=inputCountryId class=\"col-sm-4 control-label\">Land</label><div class=col-sm-8><button type=button class=\"btn btn-default\" ng-model=selectedCountryCode name=inputCountry id=inputCountryId bs-options=\"countryCode.country as countryCode.country for countryCode in countryCodes\" data-placeholder=Land bs-select>Action <span class=caret></span></button></div></div><div class=form-group><label for=inputGender class=\"col-sm-4 control-label\">Geschlecht</label><div class=col-sm-8><div class=btn-group id=inputGender><label class=\"btn btn-default\" ng-click=\"userDataToChange.female = true; profileForm.$setDirty()\" ng-class=\"{'active': userDataToChange.female == true}\">Frau</label><label class=\"btn btn-default\" ng-click=\"userDataToChange.female = false; profileForm.$setDirty()\" ng-class=\"{'active': userDataToChange.female == false}\">Mann</label></div></div></div><div class=form-group><div class=\"col-sm-offset-4 col-sm-8\"><div><button id=submit-change-profile type=submit class=\"btn btn-default\" ng-click=submitProfileData()>Profil erstellen</button></div><div class=\"alert-input alert-danger\" ng-show=\"profileForm.$invalid && submitFailed\"><span>Bitte fülle alle Werte korrekt aus</span></div><div class=\"alert-input alert-danger\" ng-show=\"profileForm.$invalid == false && submitFailedToServer\"><span>Fehler auf dem Server. Die Werte konnten nicht gespeichert werden</span></div><div class=\"alert-input alert-success\" ng-show=\"successUserDataChange && profileForm.$pristine\"><span>Profil erfolgreich erstellt</span></div></div></div></form></div></div></div></div>"
  );


  $templateCache.put('app/modules/common/expandText/template.html',
    "<div class=ely-expand-text><div class=ely-expand-text-description ng-style=descriptionStyle>{{description}}</div><div class=ely-expand-expand ng-click=expand() ng-show=\"showExpand && !expanded\">Mehr lesen</div></div>"
  );


  $templateCache.put('app/modules/common/formTextInput/template.html',
    "<div class=\"form-group ely-form-text-input\" ng-class=\"{'has-error': showError && (visited || submitFailed)}\"><label for={{inputName}} class=\"col-sm-4 control-label\" ng-hide=showWithoutLabel>{{label}} <em ng-show=\"elyRequired !== 'true'\">(optional)</em></label><div ng-class=\"{'col-sm-8': !showWithoutLabel}\"><input name={{inputName}} ng-model=submitModel class=form-control id={{inputName}} placeholder={{inputPlaceholder}} ng-blur=\"visited = true\" ng-maxlength={{maxLength}} ng-required=\"{{elyRequired === 'true'}}\"><div class=ely-input-error-wrapper><div class=ely-input-image-error ng-show=\"showError && (visited || submitFailed)\" data-template-url=app/modules/util/tooltip/tooltipError.html data-trigger=hover data-placement=left data-container=body bs-tooltip=errorDescription><img src=\"app/img/error.png\"></div></div></div></div>"
  );


  $templateCache.put('app/modules/common/iframe/template.html',
    "<div class=ely-iframe layout=column><iframe width={{width}} height={{height}} ng-src={{link}} ng-if=width></iframe><iframe flex height={{height}} ng-src={{link}} ng-if=!width></iframe></div>"
  );


  $templateCache.put('app/modules/common/imageCropper/template.html',
    "<div class=cropper-outer-container><img src=\"\" ng-show=\"image && image.trim() !== ''\"></div>"
  );


  $templateCache.put('app/modules/common/loadScreen/template.html',
    "<div id=ely-loading-screen layout-align=\"center center\" layout=row><md-progress-circular md-mode=indeterminate md-diameter=72></md-progress-circular></div>"
  );


  $templateCache.put('app/modules/common/paginationNextPrevious/template.html',
    "<div class=paginationNextPrevious><div class=paginationNextPrevious-wrapper><div class=paginationElement ng-class=\"{disabled: currentPagination === 1}\" ng-click=clickPrevious()><img src=app/img/arrow-previous.png></div><div class=paginationElement ng-class=\"{disabled: currentPagination === currentPaginationRange}\" ng-click=clickNext()><img src=app/img/arrow-next.png></div></div></div>"
  );


  $templateCache.put('app/modules/common/searchBox/template.html',
    "<div class=searchBoxForm><div class=input-group><input class=form-control placeholder={{description}} ng-model=query ng-keypress=sendGetQuery($event) bs-options=\"querySuggestion.name as querySuggestion.name for querySuggestion in getQuerySuggestion($viewValue)\" data-trigger=click bs-typeahead> <span class=input-group-btn><button class=\"btn btn-default\" type=button ng-click=getQuery(query)><span class=\"glyphicon glyphicon-search\" aria-hidden=true></span></button></span></div></div>"
  );


  $templateCache.put('app/modules/common/sendButton/template.html',
    "<div class=ely-submit-button><button type=submit class=\"btn btn-default\" ng-click=sendAllData() ng-class=\"{disabled: categoryFinishedButtonDisabled}\">{{buttonDescription}}</button><div class=ely-submit-button-error ng-show=showError><img src=app/img/error.png ng-show=showError data-template-url=app/modules/util/tooltip/tooltipError.html data-trigger=hover data-placement={{errorPlacement}} bs-tooltip=\"errorDescription\"></div><div class=ely-submit-button-success ng-show=showSuccess><img src=app/img/success.png ng-show=\"showSuccess\"></div></div>"
  );


  $templateCache.put('app/modules/common/starRating/template.html',
    "<div class=ely-star-rating ng-mouseleave=resetToSelected()><md-icon md-svg-icon=rating:{{star[0]}} aria-label=\"\" ng-mouseover=mouseOverStar(0) ng-mousedown=starSelected(1) ng-class=\"{'ely-star-rating-small': isSmall, 'ely-star-rating-x-small': isXSmall}\" ng-if=\"star.length === 5\"></md-icon><md-icon md-svg-icon=rating:{{star[1]}} aria-label=\"\" ng-mouseover=mouseOverStar(1) ng-mousedown=starSelected(2) ng-class=\"{'ely-star-rating-small': isSmall, 'ely-star-rating-x-small': isXSmall}\" ng-if=\"star.length === 5\"></md-icon><md-icon md-svg-icon=rating:{{star[2]}} aria-label=\"\" ng-mouseover=mouseOverStar(2) ng-mousedown=starSelected(3) ng-class=\"{'ely-star-rating-small': isSmall, 'ely-star-rating-x-small': isXSmall}\" ng-if=\"star.length === 5\"></md-icon><md-icon md-svg-icon=rating:{{star[3]}} aria-label=\"\" ng-mouseover=mouseOverStar(3) ng-mousedown=starSelected(4) ng-class=\"{'ely-star-rating-small': isSmall, 'ely-star-rating-x-small': isXSmall}\" ng-if=\"star.length === 5\"></md-icon><md-icon md-svg-icon=rating:{{star[4]}} aria-label=\"\" ng-mouseover=mouseOverStar(4) ng-mousedown=starSelected(5) ng-class=\"{'ely-star-rating-small': isSmall, 'ely-star-rating-x-small': isXSmall}\" ng-if=\"star.length === 5\"></md-icon></div>"
  );


  $templateCache.put('app/modules/contact/contactPreview/template.html',
    "<div class=ely-contact-preview><div class=type-preview layout=row><div class=\"type md-title\" ng-click=ctrl.toggleExpand()>{{ctrl.statistic.type}}</div><div class=\"count md-subhead\" ng-click=ctrl.toggleExpand() ng-if=\"ctrl.statistic.count > 0\">{{ctrl.statistic.count}} Kontakte</div><div class=\"count md-subhead\" ng-if=\"ctrl.statistic.count === 0\">leer</div><span flex ng-click=ctrl.toggleExpand() class=ely-spacer></span><md-menu md-position-mode=\"target-right target\"><md-button ng-click=$mdOpenMenu($event) class=\"md-icon-button setting\" aria-label=\"Settings Gruppe\"><md-icon md-svg-icon=system:moreVert></md-icon></md-button><md-menu-content><md-menu-item><md-button ng-click=ctrl.openGroupSetting()>Gruppen Settings</md-button></md-menu-item><md-menu-item><md-button ng-click=ctrl.changeGroupName()>Gruppe umbennen</md-button></md-menu-item><md-menu-item ng-if=\"ctrl.statistics.length > 1\"><md-button ng-click=ctrl.deleteGroup()>Gruppe löschen</md-button></md-menu-item></md-menu-content></md-menu></div><div class=contact-previews ng-show=\"ctrl.isExpanded && ctrl.overview.contacts.length > 0\"><div class=contact-preview ng-repeat=\"contact in ctrl.overview.contacts\" layout=row><img class=profile-img ng-src={{contact.profileUrl}} ng-click=\"ctrl.goToDetail(contact.userId)\"><div class=\"md-title name\" ng-click=ctrl.goToDetail(contact.userId)>{{contact.name}}</div><span flex class=ely-spacer ng-click=ctrl.goToDetail(contact.userId)></span><md-menu md-position-mode=\"target-right target\"><md-button ng-click=$mdOpenMenu($event) class=\"md-icon-button setting-contact\" aria-label=\"Settings Contact\"><md-icon md-svg-icon=system:moreVert></md-icon></md-button><md-menu-content><md-menu-item><md-button ng-click=\"ctrl.moveContact(contact.userId, contact.name)\">Gruppe wechseln</md-button></md-menu-item><md-menu-item><md-button ng-click=ctrl.deleteContact(contact.userId)>Kontakt entfernen</md-button></md-menu-item><md-menu-item><md-button ng-click=ctrl.blockContact(contact.userId)>Kontakt blockieren</md-button></md-menu-item></md-menu-content></md-menu></div><div class=next-contacts ng-show=ctrl.hasNext layout=row layout-align=\"center center\"><div flex=nogrow><md-button ng-click=ctrl.nextOverview()>Mehr Kontakte</md-button></div></div></div></div>"
  );


  $templateCache.put('app/modules/contact/contactPreviewSquare/template.html',
    "<md-card class=ely-contact-preview-square layout=column layout-align=\"none center\"><img ng-src={{ctrl.user.profileUrl}} class=\"md-card-image user-preview-img\" ng-click=ctrl.goToDetail()><div class=user-name ng-click=ctrl.goToDetail()>{{ctrl.user.name}}</div><div class=contact-type ng-if=!ctrl.user.blocked>{{ctrl.user.type}}</div><div class=user-blocked ng-if=ctrl.user.blocked>BLOCKIERT</div><div class=user-commands><md-button class=md-icon-button aria-label=\"Add to contact\" ng-if=\"!ctrl.user.type && !ctrl.user.blocked\" ng-click=ctrl.addContact()><md-icon md-svg-icon=cardActions:addContact></md-icon></md-button><md-button class=md-icon-button aria-label=\"Remove contact\" ng-if=\"ctrl.user.type && !ctrl.user.blocked\" ng-click=ctrl.deleteContact()><md-icon md-svg-icon=cardActions:removeContact></md-icon></md-button><md-button class=md-warn ng-if=ctrl.user.blocked ng-click=ctrl.unblockContact()>aufheben</md-button></div></md-card>"
  );


  $templateCache.put('app/modules/contact/detail/contact/template.html',
    "<md-card id=ely-user-detail-contact-preview><div class=header layout=row layout-align=\"none end\"><div class=title><span class=number-contact>{{ctrl.detail.numberOfContacts}}</span> Kontakte</div><div class=subtitle ng-if=\"ctrl.detail.numberOfSameContacts === 1\">{{ctrl.detail.numberOfSameContacts}} gemeinsamer Kontakt</div><div class=subtitle ng-if=\"ctrl.detail.numberOfSameContacts > 1\">{{ctrl.detail.numberOfSameContacts}} gemeinsame Kontakte</div></div><div class=preview-container><div class=preview-image ng-repeat=\"contact in ctrl.detail.contacts\" ng-click=ctrl.openUserDetail(contact.userId)><img ng-src={{contact.profileUrl}} class=image><div class=name>{{contact.name}}</div></div></div></md-card>"
  );


  $templateCache.put('app/modules/contact/detail/profile/template.html',
    "<md-card id=ely-user-detail-profile><md-card-content><div layout=column layout-align=\"none center\"><img ng-src={{ctrl.detail.user.profileUrl}} class=profile-image><div class=name>{{ctrl.detail.user.name}}</div><div class=type ng-if=\"ctrl.detail.user.type && !ctrl.detail.user.blocked\">{{ctrl.detail.user.type}}</div><div class=blocked ng-if=ctrl.detail.user.blocked>BLOCKIERT</div></div></md-card-content><md-card-actions layout=row layout-align=\"start center\"><md-card-icon-actions><md-button class=md-icon-button aria-label=\"Add to contact\" ng-if=\"!ctrl.detail.user.type && !ctrl.detail.user.blocked\" ng-click=ctrl.addContact()><md-icon md-svg-icon=cardActions:addContact></md-icon></md-button><md-button class=md-icon-button aria-label=\"Open chat\" ng-if=!ctrl.detail.user.blocked ng-click=ctrl.writeMessage()><md-icon md-svg-icon=cardActions:chat></md-icon></md-button><md-button class=md-icon-button aria-label=\"Open info\" ng-if=!ctrl.detail.user.blocked ng-click=ctrl.openInfo()><md-icon md-svg-icon=cardActions:info></md-icon></md-button></md-card-icon-actions><md-menu md-position-mode=\"target-right target\"><md-button ng-click=$mdOpenMenu($event) class=\"md-icon-button setting-contact\" aria-label=\"Settings Contact\"><md-icon md-svg-icon=cardActions:moreVert></md-icon></md-button><md-menu-content><md-menu-item ng-if=\"ctrl.detail.user.type && ctrl.numberOfGroups > 1\"><md-button ng-click=ctrl.moveContact()>Gruppe wechseln</md-button></md-menu-item><md-menu-item ng-if=ctrl.detail.user.type><md-button ng-click=ctrl.deleteContact()>Kontakt entfernen</md-button></md-menu-item><md-menu-item ng-if=!ctrl.detail.user.blocked><md-button ng-click=ctrl.blockContact()>Benutzter blockieren</md-button></md-menu-item><md-menu-item ng-if=ctrl.detail.user.blocked><md-button ng-click=ctrl.unblockContact()>Blockierung aufheben</md-button></md-menu-item></md-menu-content></md-menu></md-card-actions></md-card>"
  );


  $templateCache.put('app/modules/contact/detail/template.html',
    "<md-content id=ely-user-detail><div class=container layout=row layout-align=center layout-wrap ng-if=\"ctrl.$mdMedia('xs')\"><ely-user-detail-profile flex=100 detail=ctrl.userDetail number-of-groups=ctrl.numberOfGroups></ely-user-detail-profile><ely-user-detail-contacts-preview flex=100 detail=ctrl.userDetail ng-if=\"ctrl.userDetail.contacts.length > 0\"></ely-user-detail-contacts-preview></div></md-content>"
  );


  $templateCache.put('app/modules/contact/modal/addContact/template.html',
    "<md-dialog id=add-contact aria-label=\"Select Contact Group\" ng-cloak><form name=ctrl.addContactForm><md-dialog-content class=md-dialog-content><div class=\"md-title title\"><span class=name>{{ctrl.name}}</span> den Kontakten hinzufügen</div><md-radio-group ng-model=ctrl.selectedType><md-radio-button ng-repeat=\"typeValue in ctrl.types\" value={{typeValue}} aria-label={{typeValue}} ng-disable=ctrl.uploadStarted>{{typeValue}}</md-radio-button></md-radio-group></md-dialog-content><md-dialog-actions><md-button ng-click=ctrl.cancel()>Abbrechen</md-button><md-button class=\"md-raised md-primary\" ng-click=ctrl.accept() ng-disable=ctrl.uploadStarted>Hinzufügen</md-button></md-dialog-actions></form><md-progress-linear ng-if=ctrl.uploadStarted md-mode=indeterminate></md-progress-linear></md-dialog>"
  );


  $templateCache.put('app/modules/contact/modal/moveContact/template.html',
    "<md-dialog id=move-contact aria-label=\"Move Contact\" ng-cloak><form name=ctrl.moveContactForm><md-dialog-content class=md-dialog-content><div class=\"md-title title\"><span class=name>{{ctrl.name}}</span> in neue Gruppe verschieben</div><md-radio-group ng-model=ctrl.selectedType><md-radio-button ng-repeat=\"typeValue in ctrl.types\" value={{typeValue}} aria-label={{typeValue}} ng-disable=ctrl.uploadStarted>{{typeValue}}</md-radio-button></md-radio-group></md-dialog-content><md-dialog-actions><md-button ng-click=ctrl.cancel()>Abbrechen</md-button><md-button class=\"md-raised md-primary\" ng-click=ctrl.accept() ng-disable=ctrl.uploadStarted>Verschieben</md-button></md-dialog-actions></form><md-progress-linear ng-if=ctrl.uploadStarted md-mode=indeterminate></md-progress-linear></md-dialog>"
  );


  $templateCache.put('app/modules/contact/overview/template.html',
    "<md-content id=ely-contact-overview><div class=preview-container ng-repeat=\"statistic in ctrl.statistics.statistic\"><ely-contact-preview statistic=statistic statistics=ctrl.statistics.statistic delete-group=ctrl.deleteGroup(name)></ely-contact-preview></div><div layout=row class=add-new-group><span flex></span><md-button md-no-ink class=md-primary ng-click=ctrl.newGroup()>Neue Gruppe</md-button></div></md-content>"
  );


  $templateCache.put('app/modules/contact/overviewContacting/template.html',
    "<md-content id=ely-contacting-overview><div ely-infinite-scroll=ctrl.nextContacting()><div class=md-padding layout-wrap layout=row><div flex=100><md-card id=overview-text><md-card-content><div class=number-of-contacting ng-if=\"ctrl.users.numberOfAllContactings > 0\"><span class=number>{{ctrl.users.numberOfAllContactings}}</span> Personen haben Dich als Kontakt</div><div class=number-of-contacting ng-if=\"ctrl.users.numberOfAllContactings === 0\">Noch niemand hat Dich in seine Kontaktliste aufgenommen</div></md-card-content></md-card></div><div flex=100 ng-repeat=\"contactingUsers in ctrl.users.contactingUsers\"><ely-contact-preview-square user=contactingUsers></ely-contact-preview-square></div></div></div></md-content>"
  );


  $templateCache.put('app/modules/contact/overviewSearchUser/template.html',
    "<md-content id=ely-user-search-overview><div class=preview-container ng-repeat=\"user in ctrl.users\"><ely-contact-preview-square user=user></ely-contact-preview-square></div></md-content>"
  );


  $templateCache.put('app/modules/contact/template.html',
    "<md-content id=ely-contact><md-tabs md-border-bottom md-center-tabs class=contact-tabs ng-if=\"!ctrl.requestRunning && !ctrl.showUserQuery\"><md-tab label=Kontakte md-on-select=\"ctrl.contactSelect = true\" md-on-deselect=\"ctrl.contactSelect = false\"><md-content class=contact-tab-content ng-if=ctrl.contactSelect><ely-contact-overview></ely-contact-overview></md-content></md-tab><md-tab label=Follower md-on-select=\"ctrl.contactingSelect = true\" md-on-deselect=\"ctrl.contactingSelect = false\"><md-content class=contact-tab-content ng-if=ctrl.contactingSelect><ely-contacting-overview></ely-contacting-overview></md-content></md-tab></md-tabs><ely-load-screen ng-if=ctrl.requestRunning></ely-load-screen><ely-contact-search-user-overview ng-if=\"!ctrl.requestRunning && ctrl.showUserQuery\" users=ctrl.userQueryResult></ely-contact-search-user-overview></md-content>"
  );


  $templateCache.put('app/modules/home/createBlog/create/template.html',
    "<div layout=column><div class=header layout=row><img class=user-avatar ng-src={{ctrl.userInfo.profileImagePreview}} flex=none><div class=header-content><span class=user-name>{{ctrl.userInfo.name}}</span> <svg width=18px height=18px viewbox=\"0 0 48 48\" fill=#757575 class=divider><path d=\"M20 34l10-10 -10-10z\"></path></svg> <span class=visibility ng-click=ctrl.openVisibility()>{{ctrl.visibility}}</span></div></div><form name=createBlogForm class=content-form><div class=content><md-input-container class=blog-input-container><label>Schreibe einen Beitrag...</label><textarea name=blogText class=blog-input ng-model=blogText required md-maxlength=10000 ng-disabled=ctrl.blogUploadStarted></textarea><div ng-messages=createBlogForm.blogText.$error ng-show=createBlogForm.blogText.$dirty><div ng-message=required>Wird benötigt!</div><div ng-message=md-maxlength>Text ist zu lang</div></div></md-input-container><div class=load-preview-photo ng-if=ctrl.imageForUploadPreviewStart layout layout-align=\"center center\"><md-progress-circular md-mode=indeterminate md-diameter=60></md-progress-circular></div><div class=preview-photo-container ng-if=ctrl.imageForUploadPreview><img ng-src={{ctrl.imageForUploadPreview}} class=preview-photo></div><div class=actions layout=row><md-button class=\"action-icon md-icon-button\" aria-label=\"Add Photo\"><label for=upload-photo><md-icon md-svg-icon=createBlog:addPhoto class=icon></md-icon></label></md-button><input type=file ely-file-model=imageForUpload id=upload-photo ng-hide=true accept=\".jpg, .png, jpeg\"></div><div class=actions-2 layout=row layout-align=\"end center\"><md-button aria-label=abort ng-click=ctrl.cancel() ng-disabled=ctrl.blogUploadStarted>Abbrechen</md-button><md-button class=\"md-raised md-primary post-button\" aria-label=post ng-disabled=\"!ctrl.sendBlogAllowed || ctrl.blogUploadStarted\" ng-click=ctrl.uploadBlog()>Posten</md-button></div></div></form><md-progress-linear ng-if=ctrl.blogUploadStarted md-mode=indeterminate></md-progress-linear></div>"
  );


  $templateCache.put('app/modules/home/createBlog/template.html',
    "<md-dialog id=blog-create aria-label=\"Create Blog\" ng-cloak layout=row><ely-create-blog ng-show=ctrl.mainView on-open-visibility-event=ctrl.openVisibility() commands=ctrl.createBlogCommands class=blog-create-container></ely-create-blog><ely-create-blog-visibility ng-show=!ctrl.mainView on-close-visibility-event=ctrl.closeVisibility() class=blog-create-container></ely-create-blog-visibility></md-dialog>"
  );


  $templateCache.put('app/modules/home/createBlog/visibility/template.html',
    "<div class=visibility-container><div class=header><span class=title>Sichtbarkeit des Blog</span><md-button class=\"md-raised md-primary done\" aria-label=done ng-click=ctrl.closeVisibility() ng-disabled=!ctrl.validVisibility>Fertig</md-button></div><md-divider></md-divider><div class=public><md-checkbox ng-model=ctrl.isPublic ng-change=ctrl.isPublicChanged() aria-label=\"Visible to Public\" class=box>Alle</md-checkbox></div><md-divider></md-divider><div class=section-types><div class=type ng-repeat=\"privacyTypes in ctrl.privacyTypesSelected\"><md-checkbox ng-model=privacyTypes.selected aria-label=\"Visible to {{privacyTypes.type}}\" ng-change=ctrl.privacyTypesSelectedChanged(privacyTypes) ng-disabled=ctrl.isPublic>{{privacyTypes.type}}</md-checkbox></div></div></div>"
  );


  $templateCache.put('app/modules/home/pinwallElement/blog/detail/detail.html',
    "<md-dialog id=blog-detail aria-label=\"Detail Blog\" ng-cloak><div id=blog-header layout=row flex=none><img ng-src={{ctrl.element.profileUrl}} class=user-avatar flex=none ng-click=ctrl.openUserDetail()><div class=title-container flex ng-click=ctrl.openUserDetail()><div class=\"title md-title\">{{ctrl.element.name}}</div><div class=\"subtitle md-subhead\">{{ctrl.getFormattedDate(ctrl.element.created, 'LLL')}}</div></div><md-button class=\"md-icon-button md-primary\" aria-label=\"Close Detail\" ng-click=ctrl.cancel()><md-icon md-svg-icon=nav:close class=icon></md-icon></md-button></div><md-dialog-content><img ng-src={{ctrl.element.urlFull}} class=detail-image ng-show=ctrl.element.urlFull><div class=blog-text>{{ctrl.element.text}}</div></md-dialog-content></md-dialog>"
  );


  $templateCache.put('app/modules/home/pinwallElement/blog/template.html',
    "<md-card class=pinwall-blog-card><md-card-header><md-card-avatar ng-click=ctrl.openUserDetail()><img class=md-user-avatar ng-src=\"{{ctrl.element.profileUrl}}\"></md-card-avatar><md-card-header-text ng-click=ctrl.openUserDetail()><span class=\"md-title user-name\">{{ctrl.element.name}}</span> <span class=md-subhead>{{ctrl.getFormattedDate(ctrl.element.created, 'LLL')}}</span></md-card-header-text></md-card-header><div class=blog-image-container ng-if=ctrl.element.url ng-click=ctrl.openDetail()><img ng-src={{ctrl.element.url}} class=md-card-image></div><md-card-content><div class=\"md-body-1 blog-text\" ng-click=ctrl.openDetail()>{{ctrl.previewText}}</div></md-card-content><md-card-actions layout=row lauout-align=\"end center\" ng-if=ctrl.element.isAdmin><md-button ng-click=ctrl.deleteBlog() ng-disabled=ctrl.requestBlogDeleteRunning>Löschen</md-button></md-card-actions><md-divider></md-divider><md-progress-linear ng-if=ctrl.requestBlogDeleteRunning md-mode=indeterminate></md-progress-linear></md-card>"
  );


  $templateCache.put('app/modules/home/pinwallElement/recommendation/book/template.html',
    "<div layout=row class=book-recommendation><img flex=none class=preview-img ng-src={{ctrl.element.url}}><div class=content-container flex><div class=title>{{ctrl.element.title}}</div><div class=recommended>Bewertet {{ctrl.getFormattedDate(ctrl.element.created, 'LLL')}} von</div><div layout=row><img class=user-avatar ng-src={{ctrl.element.profileUrl}} felx=\"none\"><div flex><div class=user-name>{{ctrl.element.name}}</div><ely-star-rating class=page-rating is-readonly=true is-x-small=true number-of-selected-stars-readonly=ctrl.element.rating></ely-star-rating></div></div><div class=actions></div></div></div>"
  );


  $templateCache.put('app/modules/home/pinwallElement/recommendation/template.html',
    "<md-card class=pinwall-recommendation-card><ely-pinwall-recommendation-book element=ctrl.element ng-if=\"ctrl.element.label === 'Book'\"></ely-pinwall-recommendation-book><ely-pinwall-recommendation-youtube element=ctrl.element ng-if=\"ctrl.element.label === 'Youtube'\"></ely-pinwall-recommendation-youtube></md-card>"
  );


  $templateCache.put('app/modules/home/pinwallElement/recommendation/youtube/template.html',
    "<div class=youtube-recommendation><md-card-header><md-card-avatar><img class=md-user-avatar ng-src=\"{{ctrl.element.profileUrl}}\"></md-card-avatar><md-card-header-text><span class=\"md-title user-name\">{{ctrl.element.name}}</span> <span class=md-subhead>Bewertet {{ctrl.getFormattedDate(ctrl.element.created, 'LLL')}}</span></md-card-header-text></md-card-header><div class=content-container><div layout=column><ely-iframe flex=100 height=230 secure-link=\"https://www.youtube.com/embed/\" src=ctrl.element.link></ely-iframe><div class=description flex><div class=page-title>{{ctrl.element.title}}</div><ely-star-rating class=page-rating is-readonly=true is-x-small=true number-of-selected-stars-readonly=ctrl.element.rating></ely-star-rating></div></div></div></div>"
  );


  $templateCache.put('app/modules/home/pinwallElement/template.html',
    "<div><ely-pinwall-blog element=ctrl.element on-blog-removed=ctrl.onBlogRemoved ng-if=\"ctrl.element.pinwallType === 'Blog'\"></ely-pinwall-blog><ely-pinwall-recommendation element=ctrl.element ng-if=\"ctrl.element.pinwallType === 'Recommendation'\"></ely-pinwall-recommendation></div>"
  );


  $templateCache.put('app/modules/home/template.html',
    "<md-content id=ely-home><div class=pinwall-container ely-infinite-scroll=ctrl.nextPinwallInfo()><div class=md-padding layout-wrap layout=row><div flex=100 ng-repeat=\"pinwallElement in ctrl.home.pinwall\"><ely-pinwall-element on-blog-removed=ctrl.blogRemoved element=pinwallElement></ely-pinwall-element></div><div class=pinwall-gab></div></div></div><md-button class=\"md-fab create-blog-fab\" aria-label=\"Create blog\" ng-click=ctrl.createBlog()><md-icon md-svg-icon=navFAB:add></md-icon></md-button></md-content>"
  );


  $templateCache.put('app/modules/messages/conversation/createMessage/template.html',
    "<md-dialog aria-label=\"Send new Message\" ng-cloak id=ely-conversation-message-create><form name=createMessageForm class=content-form><md-dialog-content class=md-dialog-content><div class=\"md-title title\">Nachricht an <span class=name>{{ctrl.description}}</span> schreiben</div><md-input-container class=message-input-container><label>Nachricht...</label><textarea name=messageText class=message-input ng-model=ctrl.newMessage required md-maxlength=1000 ng-disabled=ctrl.uploadStarted ng-change=ctrl.messageTextChanged()></textarea><div ng-messages=createMessageForm.messageText.$error ng-show=createMessageForm.messageText.$dirty><div ng-message=required>Wird benötigt!</div><div ng-message=md-maxlength>Text ist zu lang</div></div></md-input-container></md-dialog-content><md-dialog-actions><md-button ng-click=ctrl.cancel() ng-disabled=ctrl.uploadStarted>Abbrechen</md-button><md-button class=\"md-raised md-primary\" ng-click=ctrl.sendMessage() ng-disabled=\"ctrl.uploadStarted || createMessageForm.$invalid || !ctrl.uploadAllowed\">Senden</md-button></md-dialog-actions></form><md-progress-linear ng-if=ctrl.uploadStarted md-mode=indeterminate></md-progress-linear></md-dialog>"
  );


  $templateCache.put('app/modules/messages/conversation/message/template.html',
    "<div class=ely-conversation-message><div class=chat-bubble ng-class=\"{'right-in': ctrl.message.isUser, 'left-in': !ctrl.message.isUser}\"><div class=\"text md-body-1\">{{ctrl.message.text}}</div><div class=time>{{ctrl.dateFormatter.getTime(ctrl.message.timestamp)}}</div></div></div>"
  );


  $templateCache.put('app/modules/messages/conversation/template.html',
    "<div id=ely-conversation layout=row><div class=conversation-description layout=row layout-align=\"start center\"><div class=description>{{ctrl.thread.threadDescription}}</div></div><md-content id=ely-conversation-content flex><div class=conversation-container ely-infinite-scroll=ctrl.nextMessages()><div class=md-padding layout-wrap layout=row><div flex=100 ng-repeat=\"message in ctrl.thread.messages\"><div class=date-container ng-if=\"ctrl.checkIsNewDay($index, ctrl.thread.messages)\"><div class=date>{{ctrl.format(message.timestamp)}}</div></div><ely-message message=message></ely-message></div></div></div></md-content><md-sidenav class=\"md-sidenav-right md-whiteframe-z2\" md-component-id=right md-is-locked-open=\"$mdMedia('gt-md')\"><ely-thread-overview ng-if=\"ctrl.$mdMedia('gt-md')\"></ely-thread-overview></md-sidenav><md-button class=\"md-fab md-mini create-message-fab\" aria-label=\"Create Message\" ng-click=ctrl.createMessage()><md-icon md-svg-icon=navFAB:add></md-icon></md-button></div>"
  );


  $templateCache.put('app/modules/messages/template.html',
    "<md-content id=ely-messages><ely-thread-overview></ely-thread-overview></md-content>"
  );


  $templateCache.put('app/modules/messages/threadOverview/template.html',
    "<div id=ely-thread-overview><div class=thread-container ely-infinite-scroll=ctrl.nextThreads() ng-show=!ctrl.showThreadSearch><div layout-wrap layout=row><div flex=100 ng-repeat=\"thread in ctrl.messages.threads\" layout=row layout-align=center><ely-messages-thread thread=thread></ely-messages-thread></div><div class=no-thread ng-if=\"ctrl.messages.threads.length === 0 && !ctrl.showLoad\">Du hast noch keine Nachrichten erhalten oder verschickt.</div></div></div><div class=thread-container ng-show=ctrl.showThreadSearch><div layout-wrap layout=row><div flex=100 ng-repeat=\"thread in ctrl.threadSearchResult.threads\" layout=row layout-align=center><ely-messages-thread thread=thread></ely-messages-thread></div><div class=no-thread ng-if=\"ctrl.threadSearchResult.threads.length === 0 && !ctrl.showLoad\">Für diese Anfrage wurde niemand gefunden.</div></div></div><ely-load-screen ng-if=ctrl.showLoad></ely-load-screen></div>"
  );


  $templateCache.put('app/modules/messages/threadOverview/thread/template.html',
    "<div class=thread><div layout=row class=thread-container ng-click=ctrl.goToConversation()><img ng-src={{ctrl.thread.profileUrl}} class=image-preview flex=none><div class=text flex><div class=description ng-class=\"{'unread-messages': ctrl.thread.numberOfUnreadMessages > 0}\">{{ctrl.thread.description}}</div><div class=preview-text ng-class=\"{'unread-messages': ctrl.thread.numberOfUnreadMessages > 0}\" ng-if=!ctrl.thread.type>{{ctrl.thread.previewText}}</div><div class=\"preview-text contact\" ng-if=ctrl.thread.type>{{ctrl.thread.type}}</div></div><div flex=none class=info layout=column layout-align=\"start center\" ng-if=ctrl.thread.lastUpdate><div class=date ng-class=\"{'unread-messages': ctrl.thread.numberOfUnreadMessages > 0}\">{{ctrl.getFormattedDate(ctrl.thread.lastUpdate)}}</div><div class=count ng-if=\"ctrl.thread.numberOfUnreadMessages > 0\">{{ctrl.thread.numberOfUnreadMessages}}</div></div><div flex=none class=action layout=column layout-align=\"center center\" ng-if=!ctrl.thread.lastUpdate><md-button class=md-icon-button aria-label=\"Open chat\" ng-click=ctrl.writeMessage()><md-icon md-svg-icon=cardActions:chat></md-icon></md-button></div></div><md-divider></md-divider></div>"
  );


  $templateCache.put('app/modules/navigation/leftNav/container/template.html',
    "<div><div class=sidnav-header layout=column><div layout=row><img ng-src={{ctrl.userInfo.profileImagePreview}} class=user-preview flex=\"none\"><div class=header-commands layout=row layout-align=\"end none\" flex=grow><md-icon md-svg-icon=sidenavHeader:edit class=icon-header></md-icon></div></div><div class=user-info><div class=user-name>{{ctrl.userInfo.name}}</div><div class=user-email>{{ctrl.userInfo.email}}</div></div></div><md-divider class=ely-divider></md-divider><md-content class=left-nav-content><ely-left-nav-element state=home base-state=home icon=nav:home description=Home></ely-left-nav-element><ely-left-nav-element state=contact.overview base-state=contact icon=nav:contact description=Kontakte></ely-left-nav-element><ely-left-nav-element state=message.threads base-state=message icon=nav:thread description=Nachrichten></ely-left-nav-element><ely-left-nav-element state=problem.home base-state=problem icon=nav:problem description=Problemstellungen></ely-left-nav-element></md-content><md-divider class=ely-divider></md-divider><md-content class=left-nav-content><div class=nav-element ng-click=ctrl.logout()><md-icon md-svg-icon=nav:logout class=icon></md-icon><div class=\"description md-body-2\">Logout</div></div></md-content></div>"
  );


  $templateCache.put('app/modules/navigation/leftNav/element/template.html',
    "<div class=nav-element ng-click=ctrl.goToState() ng-class=\"{'highlighted': ctrl.$state.includes(ctrl.baseState)}\"><md-icon md-svg-icon={{ctrl.icon}} class=icon ng-style=ctrl.highlightedStyle></md-icon><div class=\"description md-body-2\">{{ctrl.description}}</div></div>"
  );


  $templateCache.put('app/modules/navigation/toolbar/messageInfo/template.html',
    "<div class=ely-message-info><md-button class=md-icon-button aria-label=\"Open Thread Overview\" ng-click=ctrl.openThreadOverview()><md-icon md-svg-icon=system:chat></md-icon></md-button><div class=number layout=row layout-align=\"center center\" ng-if=\"ctrl.count > 0\"><div>{{ctrl.count}}</div></div></div>"
  );


  $templateCache.put('app/modules/navigation/toolbar/search/contactSearch/template.html',
    "<div class=autocomplete-container><md-autocomplete ng-disabled=false md-autofocus=true md-no-cache=true md-delay=50 md-min-length=2 md-search-text=ctrl.searchText md-selected-item-change=ctrl.selectedItemChanged() md-items=\"item in ctrl.querySearch(ctrl.searchText)\" md-item-text=item.name md-input-id=toolbar-search-input md-menu-class=toolbar-search-preview placeholder=\"Suche Person\" ng-keypress=ctrl.keyPressed($event)><md-item-template>{{item.name}}</md-item-template></md-autocomplete></div>"
  );


  $templateCache.put('app/modules/navigation/toolbar/search/template.html',
    "<div ng-class=\"{'ely-toolbar-search-expanded': ctrl.isExpanded, 'ely-toolbar-search-collapse': !ctrl.isExpanded}\"><div id=ely-toolbar-search ng-if=ctrl.isExpanded><div class=search-container><md-icon md-svg-icon=system:search class=search-icon></md-icon><ely-toolbar-contact-search ng-if=\"ctrl.serviceName === 'contact'\" commands=ctrl.commands></ely-toolbar-contact-search><ely-toolbar-thread-search ng-if=\"ctrl.serviceName === 'threads'\" commands=ctrl.commands></ely-toolbar-thread-search><md-icon md-svg-icon=system:close class=search-close-icon ng-click=ctrl.closeExpand()></md-icon></div></div><div ng-if=!ctrl.isExpanded class=ely-toolbar-menu><md-button class=md-icon-button aria-label=Search ng-click=ctrl.openExpand()><md-icon md-svg-icon=system:search></md-icon></md-button></div></div>"
  );


  $templateCache.put('app/modules/navigation/toolbar/search/threadSearch/template.html',
    "<div class=autocomplete-container><md-autocomplete ng-disabled=false md-autofocus=true md-no-cache=true md-delay=50 md-min-length=2 md-search-text=ctrl.searchText md-selected-item-change=ctrl.selectedItemChanged() md-items=\"item in ctrl.querySearch(ctrl.searchText)\" md-item-text=item.description md-input-id=toolbar-search-input md-menu-class=toolbar-search-preview placeholder=\"Suche Person\" ng-keypress=ctrl.keyPressed($event)><md-item-template>{{item.description}}</md-item-template></md-autocomplete></div>"
  );


  $templateCache.put('app/modules/navigation/toolbar/template.html',
    "<div layout=column loyout-fill><md-toolbar><div class=md-toolbar-tools ng-show=ctrl.isLoggedIn layout=row><div flex=none hide-gt-md><md-button class=\"md-icon-button ely-toolbar-menu\" aria-label=Settings ng-click=ctrl.openLeftNav()><md-icon md-svg-icon=system:menu></md-icon></md-button></div><div flex=none ng-if=\"ctrl.hasBackNav && !ctrl.searchExpanded\" hide-gt-md><md-button class=md-icon-button aria-label=Back ng-click=ctrl.navigateBack()><md-icon md-svg-icon=system:arrowBack></md-icon></md-button></div><div flex class=title ng-if=ctrl.title hide-md hide-sm hide-xs>{{ctrl.title}}</div><span flex></span><ely-toolbar-message-info ng-if=!ctrl.searchExpanded count=ctrl.count></ely-toolbar-message-info><ely-toolbar-search ng-show=ctrl.hasSearch search-open=ctrl.searchOpen() search-close=ctrl.searchClose()></ely-toolbar-search></div></md-toolbar></div>"
  );


  $templateCache.put('app/modules/page/handlingPages/categorySelection/template.html',
    "<div id=page-category-selection><div class=card-element><div class=description aria-hidden=false>Kategorie</div><div id=content><form name=categoryForm><div layout=row class=row-select-category layout-wrap><div flex=33><md-checkbox class=md-primary ng-model=ctrl.categories.Book aria-label=Buch ng-disabled=\"(ctrl.isSingleSelectionDisabled && !ctrl.categories.Book) || ctrl.isEditMode\" ng-change=ctrl.categoriesSelectionChanged()>Buch</md-checkbox></div><div flex=33><md-checkbox class=md-primary ng-model=ctrl.categories.Youtube aria-label=\"Video (Youtube)\" ng-disabled=\"(ctrl.isSingleSelectionDisabled && !ctrl.categories.Youtube) || ctrl.isEditMode\" ng-change=ctrl.categoriesSelectionChanged()>Video (Youtube)</md-checkbox></div></div><div layout=row><button type=button class=\"btn btn-default content-create-edit-category-element\" ng-model=ctrl.selectedLanguage ng-change=ctrl.languageChanged() name=inputLanguage id=inputLanguageId bs-options=\"language.description as language.description for language in ctrl.languages\" data-placeholder=\"Sprache der Seite auswählen\" ng-class=ctrl.isLanguageDisabled ng-disabled=ctrl.isEditMode bs-select=\"\" tabindex=0 aria-invalid=false>Sprache der Seite auswählen<span class=caret></span></button></div><div layout=row><md-input-container id=inputTitleId><label>Titel</label><input ng-model=ctrl.title ng-change=ctrl.titleChanged() name=categoryTitle md-maxlength=100 required ng-disabled=ctrl.isEditMode><div ng-messages=categoryForm.categoryTitle.$error ng-hide=ctrl.isEditMode><div ng-message=required>Dieses Feld wird benötigt!</div></div></md-input-container></div><div layout=row class=content-create-edit-category-element><md-button class=\"md-primary md-raised ely-button category-select-finished\" ng-show=ctrl.showContinueButton ng-hide=ctrl.isEditMode ng-click=ctrl.categorySelectFinished() ng-disabled=ctrl.isFinishDisabled aria-hidden=false aria-disabled=true disabled><span>Weiter</span></md-button></div></form></div></div></div>"
  );


  $templateCache.put('app/modules/page/handlingPages/compareExistingPages/template.html',
    "<div id=compare-existing-pages ng-show=ctrl.showPreviews><ely-page-preview-container video-width=160 video-height=255 title=\"Existiert die Seite bereits?\" service=ctrl.SearchPage page-request-start=ctrl.pageRequest hide-preview=false container-max-width=780></ely-page-preview-container><div class=commands><md-button class=\"md-primary md-raised ely-button command-buttons\" ng-click=ctrl.continue()>Weiter</md-button><md-button class=\"md-primary ely-button command-buttons\" ng-click=ctrl.abortHandlingPage()>Seite Erstellen Abbrechen</md-button></div></div>"
  );


  $templateCache.put('app/modules/page/handlingPages/details/book/template.html',
    "<div id=page-handling-details-book><div class=card-element><form name=commonForm><div class=description>Buch</div><ely-page-handling-detail-select-picture image-changed=ctrl.editDataHasChanged image-preview-url=ctrl.imagePreview></ely-page-handling-detail-select-picture><div id=create-book-page><div><md-input-container><label>Autor</label><input md-maxlength=255 required name=inputAuthor aria-label=Autor ng-model=ctrl.authors ng-change=ctrl.editDataHasChanged()><div ng-messages=commonForm.inputAuthor.$error><div ng-message=required>Dieses Feld wird benötigt!</div><div ng-message=md-maxlength>Text ist zu lang!</div></div></md-input-container><md-input-container><label>Erscheinungsdatum</label><input name=inputPublicationDate aria-label=Erscheinungsdatum ng-model=ctrl.publishDate ng-change=ctrl.publishDateChanged()><div ng-messages=commonForm.inputPublicationDate.$error><div ng-message=custom>Gib ein gütiges Datum an (z.B. {{ctrl.getDateExample()}})</div></div></md-input-container></div></div><div id=description-area><md-content><md-input-container><label>Beschreibung</label><textarea md-maxlength=10000 required name=inputDescriptionArea aria-label=Beschreibung ng-model=ctrl.description ng-change=ctrl.editDataHasChanged()></textarea><div ng-messages=commonForm.inputDescriptionArea.$error><div ng-message=required>Dieses Feld wird benötigt!</div><div ng-message=md-maxlength>Text ist zu lang!</div></div></md-input-container></md-content></div><md-button class=\"md-primary md-raised ely-button\" ng-click=ctrl.uploadPage() ng-disabled=commonForm.$invalid ng-hide=ctrl.isEditMode>Seite erstellen</md-button><md-button class=\"md-primary md-raised ely-button\" ng-click=ctrl.uploadPage() ng-disabled=\"commonForm.$invalid || !ctrl.editDataChanged\" ng-show=ctrl.isEditMode>Änderung speichern</md-button></form></div></div>"
  );


  $templateCache.put('app/modules/page/handlingPages/details/selectPicture/template.html',
    "<div id=picture-area><img ng-src={{ctrl.imagePreview}} class=picture><div><md-button class=\"md-primary md-raised ely-button get-picture\" ng-click=ctrl.selectTitlePicture()>Titelbild ...</md-button></div></div>"
  );


  $templateCache.put('app/modules/page/handlingPages/details/template.html',
    "<div id=page-handling-details ng-show=ctrl.showPreviews><ely-page-handling-detail-book ng-if=\"ctrl.selected.indexOf('Book') !== -1\"></ely-page-handling-detail-book><ely-page-handling-detail-youtube ng-if=\"ctrl.selected.indexOf('Youtube') !== -1\"></ely-page-handling-detail-youtube></div>"
  );


  $templateCache.put('app/modules/page/handlingPages/details/youtube/template.html',
    "<div id=page-handling-details-youtube><div class=card-element><form name=commonForm><div class=description>Buch</div><div><md-input-container><label>Link zum Youtube Video</label><input name=inputYoutubeLink required aria-label=\"Link zum Youtube Video\" ng-model=ctrl.youtubeLink ng-change=ctrl.youtubeLinkChanged()><div ng-messages=commonForm.inputYoutubeLink.$error><div ng-message=required>Dieses Feld wird benötigt!</div><div ng-message=custom>Der Link muss folgende Sequenz enthalten: https://www.youtube.com/embed/ oder https://www.youtube.com/watch?v=\"</div></div></md-input-container><ely-iframe width=500 height=400 secure-link=\"https://www.youtube.com/embed/\" src=ctrl.youtubeLinkFormatted ng-show=\"commonForm.inputYoutubeLink.$valid && commonForm.inputYoutubeLink.$dirty\"></ely-iframe><img src=app/img/defaultVideo.png ng-hide=\"commonForm.inputYoutubeLink.$valid && commonForm.inputYoutubeLink.$dirty\"></div><div id=description-area><md-content><md-input-container><label>Beschreibung</label><textarea md-maxlength=10000 required name=inputDescriptionArea aria-label=Beschreibung ng-model=ctrl.description ng-change=ctrl.descriptionChanged()></textarea><div ng-messages=commonForm.inputDescriptionArea.$error><div ng-message=required>Dieses Feld wird benötigt!</div><div ng-message=md-maxlength>Text ist zu lang!</div></div></md-input-container></md-content></div><md-button class=\"md-primary md-raised ely-button\" ng-click=ctrl.uploadPage() ng-disabled=commonForm.$invalid ng-hide=ctrl.isEditMode>Seite erstellen</md-button><md-button class=\"md-primary md-raised ely-button\" ng-click=ctrl.uploadPage() ng-disabled=\"commonForm.$invalid || !ctrl.editDataChanged\" ng-show=ctrl.isEditMode>Änderung speichern</md-button></form></div></div>"
  );


  $templateCache.put('app/modules/page/handlingPages/template.html',
    "<div id=page-handling><div id=centerCol><div id=inner-centerCol><ely-page-category-selection></ely-page-category-selection><ely-page-compare-existing-pages></ely-page-compare-existing-pages><ely-page-handling-details></ely-page-handling-details></div></div></div>"
  );


  $templateCache.put('app/modules/page/overview/template.html',
    "<div id=content-page-overview><div id=centerCol><div id=inner-centerCol><ely-page-preview-container video-width=160 video-height=255 title=Suchergebnisse service=ctrl.SearchPage page-request-start=ctrl.searchPageRequest hide-preview=!ctrl.hide></ely-page-preview-container><ely-page-preview-container title=\"Beliebteste Bücher deiner Kontakte\" service=ctrl.PopularPages page-request-start=ctrl.popularBooksContact hide-preview=ctrl.hide></ely-page-preview-container><ely-page-preview-container video-width=160 video-height=255 title=\"Beliebteste Youtube Videos deiner Kontakte\" service=ctrl.PopularPages page-request-start=ctrl.popularYoutubeContact hide-preview=ctrl.hide></ely-page-preview-container><ely-page-preview-container title=\"Beliebteste Bücher\" service=ctrl.PopularPages page-request-start=ctrl.popularBooksAll hide-preview=ctrl.hide></ely-page-preview-container><ely-page-preview-container video-width=160 video-height=255 title=\"Beliebteste Youtube Videos\" service=ctrl.PopularPages page-request-start=ctrl.popularYoutubeAll hide-preview=ctrl.hide></ely-page-preview-container><div id=search-box-container><ely-search-box description=\"Suche nach Seite...\" query=ctrl.query get-query-suggestion=ctrl.getUserSuggestion get-query=ctrl.searchPage></ely-search-box></div></div></div></div>"
  );


  $templateCache.put('app/modules/page/pageDetail/book.html',
    "<div id=ely-book-page><div class=header><div class=book-image><img ng-src={{pageDetail.page.titleUrl}}></div><div class=header-content><div class=book-title>{{pageDetail.page.title}}</div><div class=authors>von {{pageDetail.page.author.name}}<div class=author ng-repeat=\"author in pageDetail.page.author\">{{author.name}}</div></div><div class=header-commands ng-controller=AddRemoveRecommendationCtrl><md-button class=\"md-raised md-primary ely-button\" ng-click=\"addNewRecommendation(pageDetail, pageId, pageDetail.page.title)\" ng-hide=pageDetail.recommendation.user>Bewerten</md-button></div><div ng-include=\"'app/modules/page/pageDetail/common/ratingOverview.html'\"></div></div></div><div ng-include=\"'app/modules/page/pageDetail/common/commonBody.html'\"></div></div>"
  );


  $templateCache.put('app/modules/page/pageDetail/common/commonBody.html',
    "<div><div class=page-element><h2 class=website-structure-title>Beschreibung</h2><ely-expand-text description={{pageDetail.page.description}}></ely-expand-text></div><div class=page-element ng-show=pageDetail.recommendation.user><div class=user-recommendation-element ng-controller=AddRemoveRecommendationCtrl><h2 class=website-structure-title>Meine Bewertung</h2><ely-star-rating is-readonly=true is-small=true number-of-selected-stars-readonly=pageDetail.recommendation.user.rating></ely-star-rating><div id=user-recommendation>bewertet am {{pageDetail.recommendation.user.created}}</div><md-button class=\"md-fab md-mini md-primary user-recommendation-remove\" aria-label=\"Bewertung entfernen\" ng-click=\"removeRecommendation(pageDetail, pageId, label)\"><md-icon md-svg-icon=system:delete aria-label=\"\"></md-icon></md-button><div id=user-recommendation-comment>{{pageDetail.recommendation.user.comment}}</div></div></div><div ng-if=\"pageDetail.recommendation.summary.contact.numberOfRatings > 0 || pageDetail.recommendation.summary.all.numberOfRatings > 0 && startLoad\"><ely-page-review only-contacts=true title=\"Bewertungen deiner Kontakte\" ng-if=\"pageDetail.recommendation.summary.contact.numberOfRatings > 0\"></ely-page-review><ely-page-review only-contacts=false title=\"Alle Bewertungen\" ng-if=\"pageDetail.recommendation.summary.all.numberOfRatings > 0 && pageDetail.recommendation.summary.contact.numberOfRatings === 0\"></ely-page-review></div></div>"
  );


  $templateCache.put('app/modules/page/pageDetail/common/ratingOverview.html',
    "<div class=page-detail-commons><div class=rating-overviews><div class=rating-overview ng-show=\"pageDetail.recommendation.summary.contact.numberOfRatings > 0\"><ely-star-rating is-readonly=true is-small=true number-of-selected-stars-readonly=pageDetail.recommendation.summary.contact.rating></ely-star-rating><div class=rating-overview-description>(Kontakte {{pageDetail.recommendation.summary.contact.numberOfRatings}})</div></div><div class=rating-overview ng-show=\"pageDetail.recommendation.summary.contact.numberOfRatings === 0 && pageDetail.recommendation.summary.all.numberOfRatings > 0\"><div class=no-rating-description>Noch keine Bewertungen durch deine Kontakte</div></div><div class=rating-overview ng-show=\"pageDetail.recommendation.summary.all.numberOfRatings > 0\"><ely-star-rating is-readonly=true is-small=true number-of-selected-stars-readonly=pageDetail.recommendation.summary.all.rating></ely-star-rating><div class=rating-overview-description>(Alle {{pageDetail.recommendation.summary.all.numberOfRatings}})</div></div><div class=rating-overview ng-show=\"pageDetail.recommendation.summary.contact.numberOfRatings === 0 && pageDetail.recommendation.summary.all.numberOfRatings === 0\"><div class=no-rating-description>Noch keine Bewertungen</div></div></div></div>"
  );


  $templateCache.put('app/modules/page/pageDetail/detailReview/template.html',
    "<div class=page-element><h2 class=website-structure-title>{{title}}</h2><div class=page-rating-review ng-hide=showCommentDetail><div class=page-rating-review-summary><div class=page-rating-review-number>{{summaryRating}}</div><ely-star-rating is-readonly=true is-x-small=true number-of-selected-stars-readonly=summaryRating></ely-star-rating><div class=page-rating-review-total>{{totalNumberOfRatings}} total</div></div><div class=page-rating-review-diagram><div class=page-rating-review-line><md-icon md-svg-icon=rating:full class=page-rating-review-line-star aria-label=\"\"></md-icon><div class=page-rating-review-line-number>5</div><div class=page-rating-review-line-block><div class=page-rating-review-line-block-5 ng-style=\"{'width': rating[4].width + '%'}\">{{rating[4].numberOfRatings}}</div></div></div><div class=page-rating-review-line><md-icon md-svg-icon=rating:full class=page-rating-review-line-star aria-label=\"\"></md-icon><div class=page-rating-review-line-number>4</div><div class=page-rating-review-line-block><div class=page-rating-review-line-block-4 ng-style=\"{'width': rating[3].width + '%'}\">{{rating[3].numberOfRatings}}</div></div></div><div class=page-rating-review-line><md-icon md-svg-icon=rating:full class=page-rating-review-line-star aria-label=\"\"></md-icon><div class=page-rating-review-line-number>3</div><div class=page-rating-review-line-block><div class=page-rating-review-line-block-3 ng-style=\"{'width': rating[2].width + '%'}\">{{rating[2].numberOfRatings}}</div></div></div><div class=page-rating-review-line><md-icon md-svg-icon=rating:full class=page-rating-review-line-star aria-label=\"\"></md-icon><div class=page-rating-review-line-number>2</div><div class=page-rating-review-line-block><div class=page-rating-review-line-block-2 ng-style=\"{'width': rating[1].width + '%'}\">{{rating[1].numberOfRatings}}</div></div></div><div class=page-rating-review-line><md-icon md-svg-icon=rating:full class=page-rating-review-line-star aria-label=\"\"></md-icon><div class=page-rating-review-line-number>1</div><div class=page-rating-review-line-block><div class=page-rating-review-line-block-1 ng-style=\"{'width': rating[0].width + '%'}\">{{rating[0].numberOfRatings}}</div></div></div></div></div><div class=page-rating-comments-detail><md-button class=page-rating-comments-nav ng-click=previousComments() aria-label=\"\" ng-show=\"skipComments > 0\"><md-icon md-svg-icon=nav:arrowBack class=comments-nav-icon></md-icon></md-button><div class=page-rating-comments-previews ng-style=beginningSkip><div ng-repeat=\"userReview in review.reviews\" class=page-rating-comment-preview><div class=page-rating-comment-left><img ng-src={{userReview.profileUrl}} class=\"img-circle page-rating-comment-img\"></div><div class=page-rating-comment-right><div class=page-rating-comment-header><div class=page-rating-comment-name>{{userReview.name}}</div><div class=page-rating-comment-created>{{userReview.created}}</div></div><ely-star-rating is-readonly=true is-x-small=true number-of-selected-stars-readonly=userReview.rating></ely-star-rating><div class=page-rating-comment-description>{{userReview.comment}}</div></div></div><div class=comment-clear></div></div><md-button class=page-rating-comments-nav ng-click=nextComments() aria-label=\"\" ng-show=\"totalNumberOfRatings > skipComments + numberOfElements\"><md-icon md-svg-icon=nav:arrowNext class=comments-nav-icon></md-icon></md-button></div></div>"
  );


  $templateCache.put('app/modules/page/pageDetail/pageDetail.html',
    "<div id=ely-page-detail><div id=main-content><div class=card-element><div class=header-title>{{category}}<div class=options ng-show=pageDetail.administrators.isAdmin><md-menu><md-button ng-click=$mdOpenMenu($event) class=\"md-icon-button md-primary\" aria-label=Settings><md-icon md-svg-icon=system:setting></md-icon></md-button><md-menu-content><md-menu-item><md-button ng-click=\"goEditPage(pageId, label)\">Seite Bearbeiten</md-button></md-menu-item></md-menu-content></md-menu></div></div><div ng-include=\"'app/modules/page/pageDetail/book.html'\" ng-if=\"label === 'Book'\"></div><div ng-include=\"'app/modules/page/pageDetail/youtube.html'\" ng-if=\"label === 'Youtube'\"></div></div></div></div>"
  );


  $templateCache.put('app/modules/page/pageDetail/pageDetailEducation.html',
    "<div ng-controller=PageDetailEducationCtrl><div class=page-detail-bottom-element><div class=page-detail-bottom-element-inner><h1 class=website-structure-title>Kurse</h1><div class=page-preview-expand-container><div ng-repeat=\"course in pageDetail.page.course\" class=page-preview-inner-cross-container><ely-page-preview page-preview=course video-width=160 format=cross video-height=255></ely-page-preview></div></div></div></div></div>"
  );


  $templateCache.put('app/modules/page/pageDetail/pageHeaderActivityPreview.html',
    "<div class=page-detail-header-preview ng-show=\"pageDetail.page.activities.length > 0\" ng-controller=pageHeaderActivityPreviewCtrl><div class=page-detail-header-preview-title>N&auml;chste Kurse</div><div class=page-detail-activity ng-repeat=\"activity in pageDetail.page.activities\"><div ng-click=\"openDetail(activity.pageId, activity.label)\"><div class=page-detail-activity-time>{{getTime(activity.startTime)}}</div><div class=page-detail-activity-title>{{activity.title}}</div></div></div></div>"
  );


  $templateCache.put('app/modules/page/pageDetail/youtube.html',
    "<div id=ely-youtube-page><div class=header><div class=youtube-embedded><ely-iframe width=650 height=400 secure-link=\"https://www.youtube.com/embed/\" src=pageDetail.page.link></ely-iframe></div><div class=header-content><div class=youtube-title>{{pageDetail.page.title}}</div><div class=youtube-commands ng-controller=AddRemoveRecommendationCtrl><md-button class=\"md-raised md-primary ely-button\" ng-click=\"addNewRecommendation(pageDetail, pageId, pageDetail.page.title)\" ng-hide=pageDetail.recommendation.user>Bewerten</md-button></div><div ng-include=\"'app/modules/page/pageDetail/common/ratingOverview.html'\"></div></div></div><div ng-include=\"'app/modules/page/pageDetail/common/commonBody.html'\"></div></div>"
  );


  $templateCache.put('app/modules/page/pagePreview/commentDialog.html',
    "<div id=modal-comment-dialog><div class=modal-header ng-show=title><h4 class=modal-title ng-bind=title></h4></div><div class=modal-body><img ng-src={{contact.url}} class=\"modal-body-profile-img img-circle\"><div class=modal-body-user-info><div class=modal-body-name>{{contact.name}}</div><ely-star-rating is-readonly=true is-x-small=true class=modal-body-rating number-of-selected-stars-readonly=contact.rating></ely-star-rating></div><div class=modal-body-comment>{{contact.comment}}</div></div><div class=modal-footer><md-button class=\"md-primary md-raised ely-button\" ng-click=ctrl.$close()>Ok</md-button></div></div>"
  );


  $templateCache.put('app/modules/page/pagePreview/template.html',
    "<div><div class=page-preview><div class=page-preview-image-container ng-click=\"openDetail(pagePreview.pageId, pagePreview.label)\"><img ng-src={{cacheUrl(pagePreview.url)}} class=page-preview-image ng-hide=\"pagePreview.label === 'Youtube'\"><ely-iframe width={{videoWidth}} height={{videoHeight}} secure-link=\"https://www.youtube.com/embed/\" src=pagePreview.link ng-show=\"pagePreview.label === 'Youtube'\"></ely-iframe></div><div class=page-preview-title ng-click=\"openDetail(pagePreview.pageId, pagePreview.label)\">{{pagePreview.title}}</div><div class=page-preview-language ng-click=\"openDetail(pagePreview.pageId, pagePreview.label)\">{{pagePreview.labelShow}}, {{pagePreview.languageShow}}</div><div class=page-preview-contact ng-if=\"format === 'long'\" ng-click=\"openDetail(pagePreview.pageId, pagePreview.label)\"><div class=page-preview-contact-name>{{pagePreview.recommendation.contact.name}}</div></div><ely-star-rating is-readonly=true is-x-small=true class=page-preview-rating ng-show=\"pagePreview.recommendation.summary.numberOfRatings > 0\" number-of-selected-stars-readonly=pagePreview.recommendation.summary.rating></ely-star-rating><ely-star-rating is-readonly=true is-x-small=true class=page-preview-rating ng-show=pagePreview.recommendation.contact.rating number-of-selected-stars-readonly=pagePreview.recommendation.contact.rating ng-click=showComment(pagePreview.recommendation.contact)></ely-star-rating><img src=app/img/comment.png class=page-preview-rating-comment ng-show=pagePreview.recommendation.contact.comment ng-click=showComment(pagePreview.recommendation.contact)></div></div>"
  );


  $templateCache.put('app/modules/page/pagePreviewContainer/template.html',
    "<div ng-show=\"ctrl.pagePreviews.length > 0 && !ctrl.hidePreview\" class=page-overview-container ng-style=\"{'width': ctrl.containerWidth + 'px', 'display': 'block'}\"><div class=website-structure-header><h1 class=website-structure-title>{{ctrl.title}}</h1><md-button class=\"md-primary md-raised ely-button page-overview-expand\" ng-click=ctrl.startExpand() ng-show=\"!ctrl.expand && ctrl.numberOfElements < ctrl.totalNumberOfPages\">Mehr</md-button></div><div class=page-preview-container ng-class=\"{'page-preview-expand-container': ctrl.expand}\"><div ng-repeat=\"pagePreview in ctrl.pagePreviews\" class=page-preview-inner-container><ely-page-preview page-preview=pagePreview video-width={{ctrl.videoWidth}} video-height={{ctrl.videoHeight}}></ely-page-preview></div></div><div class=page-overview-next ng-click=ctrl.nextPages() ng-show=\"ctrl.expand && ctrl.expandSkipPages + ctrl.expandNumberOfPages < ctrl.totalNumberOfPages\"><img src=app/img/expand-down.png></div></div>"
  );


  $templateCache.put('app/modules/page/userAdministrator/template.html',
    "<div id=content-page-user-administration><div id=centerCol><div id=inner-centerCol ng-controller=GetPageAndExtendCtrl><div ng-show=\"noSearchResult && !noPage\"><div class=website-structure-header><h1 class=website-structure-title>Keine Suchergebnisse</h1></div><div><b>{{query}}</b> liefert kein Suchresultat</div></div><div ng-show=noPage><div class=website-structure-header><h1 class=website-structure-title>Du hast noch keine eigene Seite erstellt</h1></div><div>Um Seiten zu bewerten gehe zu <a ui-sref=page.create>Seite erstellen</a></div></div><div class=page-preview-expand-container ng-hide=noSearchResult><div ng-repeat=\"pagePreview in pagePreviews.pages\" class=page-preview-inner-container><ely-page-preview page-preview=pagePreview video-width=160 video-height=255></ely-page-preview></div></div><button type=button class=\"btn btn-default page-user-recommendation-expand\" ng-click=getNextPages() ng-show=\"pagePreviews.pages.length < pagePreviews.totalNumberOfPages\">Mehr</button><div class=page-user-recommendation-expand></div><div id=search-box-container><ely-search-box description=\"Suche nach Seite von welcher Du Administrator bist...\" query=query get-query-suggestion=searchSuggestionPage get-query=searchPage></ely-search-box></div></div></div></div>"
  );


  $templateCache.put('app/modules/page/userRecommendation/template.html',
    "<div id=content-page-user-recommendation><div id=centerCol><div id=inner-centerCol ng-controller=GetPageAndExtendCtrl><div ng-show=\"noSearchResult && !noPage\"><div class=website-structure-header><h1 class=website-structure-title>Keine Suchergebnisse</h1></div><div><b>{{query}}</b> liefert kein Suchresultat</div></div><div ng-show=noPage><div class=website-structure-header><h1 class=website-structure-title>Du hast noch keine Seite bewertet</h1></div><div>Um Seiten zu bewerten gehe zu <a ui-sref=page.overview>Empfehlungen</a></div></div><div class=page-preview-expand-container ng-hide=noSearchResult><div ng-repeat=\"pagePreview in pagePreviews.pages\" class=page-preview-inner-container><ely-page-preview page-preview=pagePreview video-width=160 video-height=255></ely-page-preview></div></div><button type=button class=\"btn btn-default page-user-recommendation-expand\" ng-click=getNextPages() ng-show=\"pagePreviews.pages.length < pagePreviews.totalNumberOfPages\">Mehr</button><div class=page-user-recommendation-expand></div><div id=search-box-container><ely-search-box description=\"Suche nach Seite mit einer Bewertung von Dir...\" query=query get-query-suggestion=searchSuggestionPage get-query=searchPage></ely-search-box></div></div></div></div>"
  );


  $templateCache.put('app/modules/problem/createProblem/template.html',
    "<md-dialog id=problem-create aria-label=\"Create Problem\" ng-cloak layout=row><div layout=column class=problem-create-container><div class=\"header-title md-title\">Erstelle eine neue Problemstellung</div><form name=createProblemForm class=content-form><div class=content><md-input-container class=ely-input-container><label>Beschreibung...</label><textarea name=problemText class=blog-input ng-model=problemText required md-maxlength=160 ng-disabled=ctrl.blogUploadStarted></textarea><div ng-messages=createProblemForm.problemText.$error ng-show=createProblemForm.problemText.$dirty><div ng-message=required>Wird benötigt!</div><div ng-message=md-maxlength>Text ist zu lang</div></div></md-input-container><div class=actions layout=row></div><div class=actions-2 layout=row layout-align=\"end center\"><md-button aria-label=abort ng-click=ctrl.cancel() ng-disabled=ctrl.blogUploadStarted>Abbrechen</md-button><md-button class=\"md-raised md-primary upload-button\" aria-label=post ng-disabled=\"!ctrl.sendBlogAllowed || ctrl.blogUploadStarted\" ng-click=ctrl.uploadProblem()>Erstellen</md-button></div></div></form><md-progress-linear ng-if=ctrl.blogUploadStarted md-mode=indeterminate></md-progress-linear></div></md-dialog>"
  );


  $templateCache.put('app/modules/problem/detail/reason/create/template.html',
    "<md-dialog id=reason-create aria-label=\"Create Reason\" ng-cloak layout=row><div layout=column class=reason-create-container><div class=\"header-title md-title\">Erstelle eine neuen Grund</div><form name=createReasonForm class=content-form><div class=content><md-input-container class=ely-input-container><label>Titel</label><textarea name=titleReason ng-model=titleReason required md-maxlength=160 ng-disabled=ctrl.uploadStarted></textarea><div ng-messages=createReasonForm.titleReason.$error ng-show=createReasonForm.titleReason.$dirty><div ng-message=required>Wird benötigt!</div><div ng-message=md-maxlength>Text ist zu lang</div></div></md-input-container><md-input-container class=ely-input-container><label>Beschreibung</label><textarea name=descriptionReason ng-model=descriptionReason required md-maxlength=1000 ng-disabled=ctrl.uploadStarted></textarea><div ng-messages=createReasonForm.descriptionReason.$error ng-show=createReasonForm.descriptionReason.$dirty><div ng-message=required>Wird benötigt!</div><div ng-message=md-maxlength>Text ist zu lang</div></div></md-input-container><div class=actions layout=row></div><div class=actions-2 layout=row layout-align=\"end center\"><md-button aria-label=abort ng-click=ctrl.cancel() ng-disabled=ctrl.uploadStarted>Abbrechen</md-button><md-button class=\"md-raised md-primary upload-button\" aria-label=post ng-disabled=\"!ctrl.sendReasonAllowed || ctrl.uploadStarted\" ng-click=ctrl.uploadReason()>Erstellen</md-button></div></div></form><md-progress-linear ng-if=ctrl.blogUploadStarted md-mode=indeterminate></md-progress-linear></div></md-dialog>"
  );


  $templateCache.put('app/modules/problem/detail/reason/detail/template.html',
    "<md-content id=ely-problem-reason-detail><md-card id=detail-container><md-card-header><div class=rating-container layout=column layout-align=\"start center\" ng-click=ctrl.rateReason()><md-button class=\"md-icon-button arrow\" aria-label=like><md-icon md-svg-icon=cardActions:arrowUp ng-class=\"{'enabled': !ctrl.detail.reason.ratedByUser}\"></md-icon></md-button><div class=number-of-rating>{{ctrl.detail.reason.numberOfRatings}}</div><md-button class=\"md-icon-button arrow\" aria-label=dislike ng-click=ctrl.removeRatingReason()><md-icon md-svg-icon=cardActions:arrowDown ng-class=\"{'enabled': ctrl.detail.reason.ratedByUser}\"></md-icon></md-button></div><md-card-header-text class=\"md-title title\" ng-click=ctrl.openReasonDetail()>{{ctrl.detail.reason.title}}</md-card-header-text></md-card-header><md-card-content><div class=\"md-body-1 description\">{{ctrl.detail.reason.description}}</div><md-divider></md-divider><div class=\"md-caption caption-problem\">Grund gehört zu folgendem Problem:</div><div class=\"md-body-1 text-problem\" ng-click=ctrl.goToProblem()>{{ctrl.detail.reason.problem.description}}</div></md-card-content></md-card><md-fab-speed-dial md-direction=up class=\"md-fling edit-mode-fab\"><md-fab-trigger><md-button class=md-fab aria-label=\"Change to Edit Mode\" ng-click=ctrl.edit()><md-icon md-svg-icon=navFAB:add></md-icon></md-button></md-fab-trigger><md-fab-actions><md-button aria-label=\"Add new Page\" class=\"md-fab md-raised md-mini\"><md-icon md-svg-src=navFAB:pageAction aria-label=\"Add new Page\"></md-icon></md-button><md-button aria-label=\"Add new Link\" class=\"md-fab md-raised md-mini\"><md-icon md-svg-src=navFAB:linkAction aria-label=\"Add new Link\"></md-icon></md-button></md-fab-actions></md-fab-speed-dial></md-content>"
  );


  $templateCache.put('app/modules/problem/detail/reason/overviewElement/template.html',
    "<md-card class=reason-overview-element><md-card-header><div class=rating-container layout=column layout-align=\"start center\" ng-click=ctrl.rateReason()><md-button class=\"md-icon-button arrow\" aria-label=like><md-icon md-svg-icon=cardActions:arrowUp ng-class=\"{'enabled': !ctrl.element.ratedByUser}\"></md-icon></md-button><div class=number-of-rating>{{ctrl.element.numberOfRatings}}</div><md-button class=\"md-icon-button arrow\" aria-label=dislike ng-click=ctrl.removeRatingReason()><md-icon md-svg-icon=cardActions:arrowDown ng-class=\"{'enabled': ctrl.element.ratedByUser}\"></md-icon></md-button></div><md-card-header-text class=\"md-title title\" ng-click=ctrl.openReasonDetail()>{{ctrl.element.title}}</md-card-header-text></md-card-header></md-card>"
  );


  $templateCache.put('app/modules/problem/detail/reason/template.html',
    "<div id=ely-problem-overview-reason><md-card class=card-problem-description><md-card-content><div class=\"problem-description md-title\">{{ctrl.problemDescription}}</div></md-card-content></md-card><div class=overview-container ely-infinite-scroll=ctrl.nextReasons() ng-if=\"ctrl.overview.reasons.length !== 0\"><div layout-wrap layout=row><div flex=100 ng-repeat=\"reason in ctrl.overview.reasons\"><ely-problem-reason-overview-element element=reason sort-request=ctrl.sortRequest()></ely-problem-reason-overview-element></div><div class=pinwall-gab></div></div></div><md-card ng-if=\"ctrl.overview.reasons.length === 0\"><md-card-content><div class=no-reason>Für dieses Problem wurde noch kein Grund erstellt</div></md-card-content></md-card><md-button class=\"md-fab create-reason-fab\" aria-label=\"Create Reason\" ng-click=ctrl.createReason()><md-icon md-svg-icon=navFAB:add></md-icon></md-button></div>"
  );


  $templateCache.put('app/modules/problem/detail/template.html',
    "<div id=ely-problem-detail><md-tabs md-border-bottom md-center-tabs class=detail-tabs><md-tab label=Gründe><md-content class=detail-container><ely-problem-overview-reason problem-description={{ctrl.detail.description}}></ely-problem-overview-reason></md-content></md-tab><md-tab label=Lösungen><md-content class=detail-container></md-content></md-tab></md-tabs></div>"
  );


  $templateCache.put('app/modules/problem/overview/element/template.html',
    "<md-card class=overview-element><div class=description ng-click=ctrl.openDetail(ctrl.element.problemId)>{{ctrl.element.description}}</div></md-card>"
  );


  $templateCache.put('app/modules/problem/overview/template.html',
    "<md-content id=ely-problem-overview><div class=problem-overview-container ely-infinite-scroll=ctrl.nextOverview()><div class=md-padding layout-wrap layout=row><div flex=100 ng-repeat=\"problem in ctrl.overview.problems\"><ely-problem-overview-element element=problem></ely-problem-overview-element></div></div></div></md-content>"
  );


  $templateCache.put('app/modules/problem/template.html',
    "<md-content id=ely-problem><ely-problem-overview></ely-problem-overview><md-button class=\"md-fab create-problem-fab\" aria-label=\"Create Problem\" ng-click=ctrl.createProblem()><md-icon md-svg-icon=navFAB:add></md-icon></md-button></md-content>"
  );


  $templateCache.put('app/modules/recommendation/modalAddRecommendation.html',
    "<div id=modal-dialog-add-recommendation><div class=modal-header><h4 class=modal-title>Deine Bewertung für<div class=title>{{ title}}</div></h4></div><div class=modal-body><div class=description><textarea class=form-control ng-model=ctrl.recommendationDescription maxlength=1000></textarea></div></div><div class=modal-footer><ely-star-rating number-of-selected-stars=ctrl.numberOfSelectedStars></ely-star-rating><div class=error ng-show=ctrl.error>{{ctrl.error}}</div><md-button class=\"md-primary ely-button\" ng-click=ctrl.abort()>Abbrechen</md-button><md-button class=\"md-primary md-raised ely-button\" ng-click=ctrl.addRecommendation() ng-disabled=\"ctrl.numberOfSelectedStars === -1\">Hinzufügen</md-button></div></div>"
  );


  $templateCache.put('app/modules/settings/changePassword.html',
    "<div id=content-settings-password><div id=centerCol><div id=inner-centerCol><div id=manage-profile><form class=form-horizontal name=profileForm role=form novalidate><div class=form-group><label for=inputPasswordActual class=\"col-sm-4 control-label\">Aktuelles Passwort</label><div class=col-sm-8><input name=inputPasswordActual ng-model=password.actualPassword class=form-control type=password id=inputPasswordActual required ng-maxlength=55 ng-minlength=1><div class=\"alert-input alert-danger\" ng-show=profileForm.inputPasswordActual.$error.minlength><span>Das Passwort muss mindestens 1 Zeichen lang sein</span></div><div class=\"alert-input alert-danger\" ng-show=profileForm.inputPasswordActual.$error.maxlength><span>Das Passwort darf nicht länger als 55 Zeichen sein</span></div></div></div><div class=form-group><label for=inputPassword class=\"col-sm-4 control-label\">Neu</label><div class=col-sm-8><input name=inputPassword ng-model=password.newPassword class=form-control type=password id=inputPassword required ng-maxlength=55 ng-pattern=\"/^(?=.*[A-Z])(?=.*\\d)/\"><div class=\"alert-input alert-danger\" ng-show=profileForm.inputPassword.$error.pattern><span>Das Passwort muss mindestens eine Zahl und einen Grossbuchstaben beinhalten</span></div><div class=\"alert-input alert-danger\" ng-show=profileForm.inputPassword.$error.minlength><span>Das Passwort muss mindestens 8 Zeichen lang sein</span></div><div class=\"alert-input alert-danger\" ng-show=profileForm.inputPassword.$error.maxlength><span>Das Passwort darf nicht länger als 55 Zeichen sein</span></div></div></div><div class=form-group><label id=label-password-confirm for=inputPasswordConfirm class=\"col-sm-4 control-label\">Neues Passwort erneut eingeben</label><div class=col-sm-8><input name=inputPasswordConfirm ng-model=password.newPasswordConfirm class=form-control type=password id=inputPasswordConfirm required ng-maxlength=55></div></div><div class=form-group><div class=\"col-sm-offset-4 col-sm-8\"><div><button id=submit-change-profile type=submit class=\"btn btn-default\" ng-click=submitNewPassword()>Passwort ändern</button></div><div class=\"alert-input alert-danger\" ng-show=\"profileForm.$invalid && submitFailed\"><span>Bitte fülle alle Werte korrekt aus</span></div><div class=\"alert-input alert-danger\" ng-show=newPasswordNotEqual><span>Das neue Passwort stimmt nicht überein</span></div><div class=\"alert-input alert-danger\" ng-show=\"profileForm.$invalid == false && submitFailedToServer\"><span>Fehler auf dem Server. Die Werte konnten nicht gespeichert werden</span></div><div class=\"alert-input alert-success\" ng-show=\"successUserDataChange && profileForm.$pristine\"><span>Passwort erfolgreich geändert</span></div></div></div></form></div></div></div></div>"
  );


  $templateCache.put('app/modules/settings/modal/addGroup/template.html',
    "<md-dialog id=add-group aria-label=\"Add Group\" ng-cloak><form name=ctrl.createGroupForm><md-dialog-content class=\"md-dialog-content ely-dialog-content\"><div class=\"md-title title\">Neue Gruppe erstellen</div><md-input-container class=ely-input-container><label>Name</label><input name=groupName class=blog-input ng-model=ctrl.groupName required md-maxlength=30 ng-disabled=ctrl.uploadStarted ng-change=\"ctrl.nameChanged()\"><div ng-messages=ctrl.createGroupForm.groupName.$error ng-show=ctrl.createGroupForm.groupName.$dirty><div ng-message=required>Wird benötigt!</div><div ng-message=md-maxlength>Text ist zu lang</div><div ng-message=ely-types-exist>Diese Gruppe existiert bereits</div></div></md-input-container><md-checkbox ng-model=ctrl.profileVisible aria-label=\"Profile visible\" class=select-privacy ng-disabled=ctrl.uploadStarted>Mein Profil ist sichtbar</md-checkbox><md-checkbox ng-model=ctrl.contactsVisible ng-disabled=\"!ctrl.profileVisible || ctrl.uploadStarted\" aria-label=\"Contacts visible\" class=select-privacy>Meine Kontakte sind sichtbar</md-checkbox><md-checkbox ng-model=ctrl.imageVisible ng-disabled=\"!ctrl.profileVisible || ctrl.uploadStarted\" aria-label=\"Image visible\" class=select-privacy>Mein Profilbild ist sichtbar</md-checkbox><md-checkbox ng-model=ctrl.profileDataVisible ng-disabled=\"!ctrl.profileVisible || ctrl.uploadStarted\" aria-label=\"Profile Data visible\" class=select-privacy>Meine Profildaten sind sichtbar</md-checkbox></md-dialog-content><md-dialog-actions><md-button ng-click=ctrl.cancel()>Abbrechen</md-button><md-button class=md-primary ng-click=ctrl.accept() ng-disabled=\"!ctrl.validGroupName || ctrl.createGroupForm.groupName.$invalid || ctrl.uploadStarted\">Hinzufügen</md-button></md-dialog-actions></form><md-progress-linear ng-if=ctrl.uploadStarted md-mode=indeterminate></md-progress-linear></md-dialog>"
  );


  $templateCache.put('app/modules/settings/modal/deleteGroup/template.html',
    "<md-dialog id=delete-group aria-label=\"Delete Group\" ng-cloak><form name=ctrl.deleteGroupForm><md-dialog-content class=\"md-dialog-content ely-dialog-content\"><div class=\"md-title title\">Gruppe <span class=name>{{ctrl.groupName}}</span> löschen</div><div class=\"md-body-1 description\">Kontakte werden in folgende Gruppe verschoben:</div><md-radio-group ng-model=ctrl.selectedGroup><md-radio-button ng-repeat=\"group in ctrl.groups\" value={{group}} aria-label={{group}} ng-disable=ctrl.uploadStarted>{{group}}</md-radio-button></md-radio-group></md-dialog-content><md-dialog-actions><md-button ng-click=ctrl.cancel()>Abbrechen</md-button><md-button class=md-primary ng-click=ctrl.accept() ng-disabled=\" ctrl.uploadStarted\">Löschen</md-button></md-dialog-actions></form><md-progress-linear ng-if=ctrl.uploadStarted md-mode=indeterminate></md-progress-linear></md-dialog>"
  );


  $templateCache.put('app/modules/settings/modal/modifyGroupSettings/template.html',
    "<md-dialog id=modify-group-setting aria-label=\"Modify Group Setting\" ng-cloak><form name=ctrl.modifyGroupForm><md-dialog-content class=\"md-dialog-content ely-dialog-content\"><div class=\"md-title title\">Gruppe <span class=group>{{ctrl.groupName}}</span> bearbeiten</div><md-checkbox ng-model=ctrl.setting.profileVisible aria-label=\"Profile visible\" class=select-privacy ng-change=ctrl.selectChanged() ng-disabled=ctrl.uploadStarted>Mein Profil ist sichtbar</md-checkbox><md-checkbox ng-model=ctrl.setting.contactsVisible ng-disabled=\"!ctrl.setting.profileVisible || ctrl.uploadStarted\" ng-change=ctrl.selectChanged() aria-label=\"Contacts visible\" class=select-privacy>Meine Kontakte sind sichtbar</md-checkbox><md-checkbox ng-model=ctrl.setting.imageVisible ng-disabled=\"!ctrl.setting.profileVisible || ctrl.uploadStarted\" ng-change=ctrl.selectChanged() aria-label=\"Image visible\" class=select-privacy>Mein Profilbild ist sichtbar</md-checkbox><md-checkbox ng-model=ctrl.setting.profileDataVisible ng-disabled=\"!ctrl.setting.profileVisible || ctrl.uploadStarted\" ng-change=ctrl.selectChanged() aria-label=\"Profile Data visible\" class=select-privacy>Meine Profildaten sind sichtbar</md-checkbox></md-dialog-content><md-dialog-actions><md-button ng-click=ctrl.cancel()>Abbrechen</md-button><md-button class=md-primary ng-click=ctrl.accept() ng-disabled=\"ctrl.uploadStarted || !ctrl.uploadAllowed\">Ändern</md-button></md-dialog-actions></form><md-progress-linear ng-if=ctrl.uploadStarted md-mode=indeterminate></md-progress-linear></md-dialog>"
  );


  $templateCache.put('app/modules/settings/popoverDeletePrivacy.html',
    "<div class=popover ng-controller=DeletePrivacyCtrl><div class=arrow></div><div class=popover-content><form name=popoverForm><div class=popover-element-description>Kontakte <b>{{privacy.type}}</b> werden beim löschen der Privatsphären Einstellung verschoben nach:</div><button type=button class=\"btn btn-default popover-element-right\" ng-model=otherPrivacySettingType bs-options=\"privacyType for privacyType in otherPrivacySettingTypes\" bs-select>Action <span class=caret></span></button><div class=popover-element-divider></div><div class=popover-element-right><button type=submit class=\"btn btn-default\" ng-click=deletePrivacySetting()>Löschen</button></div><div class=popover-element><button type=submit class=\"btn btn-default\" ng-click=$hide()>Abbrechen</button></div></form></div></div>"
  );


  $templateCache.put('app/modules/settings/popoverRenamePrivacy.html',
    "<div class=popover ng-controller=RenamePrivacyCtrl><div class=arrow></div><div class=popover-content><form name=popoverForm><div class=popover-element-description>Privatsphären Einstellung <b>{{privacy.type}}</b> umbennen in:</div><div class=popover-element><input class=form-control ng-model=renameType bs-options=\"type for type in types\" bs-typeahead></div><div class=popover-element><button type=submit class=\"btn btn-default\" ng-class=\"{'disabled': renameType === privacy.type || renameType.trim() === '' || renameExists}\" ng-click=renamePrivacySetting()>Ändern</button></div><div class=popover-element><div class=\"alert-input alert-danger\" ng-if=\"renameExists && renameType !== privacy.type\"><span>Diese Privatspähren Einstellung existiert bereits.</span></div></div></form></div></div>"
  );


  $templateCache.put('app/modules/settings/privacy.html',
    "<div id=content-settings-security><div id=centerCol><div id=inner-centerCol><h1 class=website-structure-title>Privatsphäre Einstellung für {{selectedType.type}}</h1><div class=content-privacy><div class=privacy-setting-row><div class=select-privacy-settings><input type=checkbox ng-model=selectedType.profileVisible><div class=select-privacy-settings-text>Mein Profil ist sichtbar</div><div class=select-privacy-settings-description ng-show=privacySettings.noContactSelected>Wenn diese Funktion deaktiviert ist, können andere User die Du nicht zu deinen Kontakten hinzugefügt hast nur deinen Namen sehen. Alle anderen Profildaten bleiben verborgen.</div><div class=select-privacy-settings-description ng-show=!privacySettings.noContactSelected>Wenn diese Funktion deaktiviert ist, können andere User die Du der Gruppe {{selectedType.type}} hinzugefügt hast nur deinen Namen sehen. Alle anderen Profildaten bleiben verborgen.</div></div></div><div class=privacy-setting-row><div class=select-privacy-settings><input type=checkbox ng-model=selectedType.contactsVisible ng-disabled=!selectedType.profileVisible><div ng-class=\"{'select-privacy-settings-text': selectedType.profileVisible, 'select-privacy-settings-text-disabled': !selectedType.profileVisible}\">Meine Kontakte sind sichtbar</div><div class=select-privacy-settings-description ng-show=privacySettings.noContactSelected>Bestimmt ob User die Du nicht als Kontakte hinzugefügt hast deine Kontakte sehen können.</div><div class=select-privacy-settings-description ng-show=!privacySettings.noContactSelected>Bestimmt ob User die Du der Gruppe {{selectedType.type}} hinzugefügt hast deine Kontake sehen können.</div></div></div><div class=privacy-setting-row><div class=select-privacy-settings><input type=checkbox ng-model=selectedType.imageVisible ng-disabled=!selectedType.profileVisible><div ng-class=\"{'select-privacy-settings-text': selectedType.profileVisible, 'select-privacy-settings-text-disabled': !selectedType.profileVisible}\">Mein Profilbild ist sichtbar</div><div class=select-privacy-settings-description ng-show=privacySettings.noContactSelected>Bestimmt ob User die Du nicht als Kontakte hinzugefügt hast dein Profilbild sehen können.</div><div class=select-privacy-settings-description ng-show=!privacySettings.noContactSelected>Bestimmt ob User die Du der Gruppe {{selectedType.type}} hinzugefügt hast dein Profilbild sehen können.</div></div></div><div class=privacy-setting-row><div class=select-privacy-settings><input type=checkbox ng-model=selectedType.profileDataVisible ng-disabled=!selectedType.profileVisible><div ng-class=\"{'select-privacy-settings-text': selectedType.profileVisible, 'select-privacy-settings-text-disabled': !selectedType.profileVisible}\">Meine Profildaten sind sichtbar</div><div class=select-privacy-settings-description ng-show=privacySettings.noContactSelected>Bestimmt ob User die Du nicht als Kontakte hinzugefügt hast deine Profil Daten, wie z.B. deinen Geburtstag, sehen können.</div><div class=select-privacy-settings-description ng-show=!privacySettings.noContactSelected>Bestimmt ob User die Du der Gruppe {{selectedType.type}} hinzugefügt hast deine Profil Daten, wie z.B. deinen Geburtstag, sehen können.</div></div></div><div class=privacy-setting-button-row><ely-send-button button-description=\"Änderung übernehmen\" send-data=updatePrivacyType error-placement=right model=selectedType></ely-send-button></div></div></div></div><div id=privacy-setting-overview><ul class=list-group><div><li class=list-group-item ng-click=setPrivacyTypeNoContact() ng-class=\"{'group-selected': privacySettings.noContactSelected}\"><div class=privacy-type-description>Kein Kontakt</div></li></div><div ng-repeat=\"privacy in privacySettings.normal\"><li class=list-group-item ng-class=\"{'group-selected': selectedType.type === privacy.type}\"><div class=list-group-item-container><img ng-if=\"privacySettings.normal.length > 1\" class=list-group-item-icons src=app/img/delete.png trigger=click data-auto-close=true data-placement=bottom data-template-url=app/modules/settings/popoverDeletePrivacy.html bs-popover></div><div class=list-group-item-container><img class=list-group-item-icons src=app/img/edit.png trigger=click data-auto-close=true data-placement=bottom data-template-url=app/modules/settings/popoverRenamePrivacy.html bs-popover></div><div class=privacy-type-description ng-click=setPrivacyType(privacy.type)>{{privacy.type}}</div></li></div><div><div class=privacy-adding ng-if=\"!showNewPrivacySettingInput && privacySettings.normal.length < 10\"><a href=# ng-click=showAddingNewPrivacySetting()>Neuer Privatsphären Typ hinzufügen...</a></div><div class=privacy-adding-input ng-if=showNewPrivacySettingInput><input class=form-control placeholder=\"Privatsphären Typ\" ng-maxlength=30 ng-model=addingPrivacy.newPrivacyName> <button class=\"btn btn-default\" type=button ng-click=addPrivacySetting() ng-class=\"{disabled: addingPrivacy.newPrivacyName.trim() === ''}\">Hinzufügen</button> <button class=\"btn btn-default privacy-abort-adding\" type=button ng-click=abortAddingNewPrivacy()>Abbrechen</button></div></div></ul></div></div>"
  );


  $templateCache.put('app/modules/settings/profile.html',
    "<div id=content-settings-profile><div id=centerCol><div id=inner-centerCol><div id=manage-profile-photo-container><div><img class=\"img-rounded img-responsive\" ng-src=\"{{userDataToChange.profileImage}}\"></div><button id=change-profile-image type=button class=\"btn btn-default\" data-animation=am-fade-and-scale data-placement=center data-backdrop=static data-template-url=app/modules/util/file/uploadFile.html bs-modal=modal>Foto ändern..</button></div><div id=manage-profile><form class=form-horizontal name=profileForm role=form novalidate><div class=form-group><label for=inputEmail class=\"col-sm-4 control-label\">E-Mail</label><div class=col-sm-8><input name=inputEmail ng-model=userDataToChange.email class=form-control id=inputEmail ng-disabled=true></div></div><div class=form-group><div class=col-sm-4></div><div class=col-sm-5><a ui-sref=settings.profile.changePassword><button id=change-profile-password type=button class=\"btn btn-default\">Passwort ändern..</button></a></div></div><ely-form-text-input label=Vorname input-name=inputForename input-placeholder=Vorname profile-form=profileForm submit-model=userDataToChange.forename max-length=30 ely-required=true></ely-form-text-input><ely-form-text-input label=Nachname input-name=inputSurename input-placeholder=Nachname profile-form=profileForm submit-model=userDataToChange.surname max-length=50 ely-required=true></ely-form-text-input><ely-form-text-input label=Geburtstag input-name=inputBirthday input-placeholder=\"z.B {{getDateExample()}}\" profile-form=profileForm submit-model=userDataToChange.birthday ely-required=true custom-error-description=\"Gib einen gültigen Geburtstag ein (z.B. {{getDateExample()}})\"></ely-form-text-input><ely-form-text-input label=Strasse input-name=inputStreet input-placeholder=Strasse profile-form=profileForm submit-model=userDataToChange.street max-length=80></ely-form-text-input><ely-form-text-input label=Ort input-name=inputPlace input-placeholder=Ort profile-form=profileForm submit-model=userDataToChange.place max-length=80></ely-form-text-input><div class=form-group ng-class=\"{'has-error': profileForm.inputCountry.$invalid && (visitedCountry || submitFailed)}\"><label for=inputCountryId class=\"col-sm-4 control-label\">Land</label><div class=col-sm-8><button type=button class=\"btn btn-default\" ng-model=selectedCountryCode name=inputCountry id=inputCountryId bs-options=\"countryCode.country as countryCode.country for countryCode in countryCodes\" data-placeholder=Land bs-select>Action <span class=caret></span></button></div></div><div class=form-group><label for=inputGender class=\"col-sm-4 control-label\">Geschlecht</label><div class=col-sm-8><div class=btn-group id=inputGender><label class=\"btn btn-default\" ng-click=\"userDataToChange.female = true; profileForm.$setDirty()\" ng-class=\"{'active': userDataToChange.female === true}\">Frau</label><label class=\"btn btn-default\" ng-click=\"userDataToChange.female = false; profileForm.$setDirty()\" ng-class=\"{'active': userDataToChange.female === false}\">Mann</label></div></div></div><div class=form-group><div class=\"col-sm-offset-4 col-sm-8\"><div><ely-send-button button-description=\"Profil ändern\" send-data=submitProfileData error-placement=right model=userDataToChange></ely-send-button></div></div></div></form></div></div></div></div>"
  );


  $templateCache.put('app/modules/util/file/previewFile.html',
    "<div class=modal tabindex=-1 role=dialog ng-controller=FileCtrl><div class=modal-dialog id=modal-preview-file><div class=modal-content><div class=modal-body><div class=cropArea><ely-image-cropper ng-if=!uploadRunning reset=resetImage image=image.imageForUploadPreview image-result-data=imageResultData ratio=0.62745 original-size=checkOriginalSize min-width=100 min-height=160></ely-image-cropper></div><ely-spin ng-if=uploadRunning></ely-spin></div><div class=modal-footer><md-button class=\"md-primary md-raised ely-button btn-file\" ng-disabled=uploadRunning>Bild auswählen...<input type=file ely-file-model=image.imageForUpload accept=\".jpg, .png, jpeg\"></md-button><div class=upload-file-error ng-show=uploadError>{{uploadError}}</div><md-button class=\"md-primary ely-button\" ng-disabled=uploadRunning ng-click=$hide()>Abbrechen</md-button><md-button class=\"md-primary md-raised ely-button\" ng-disabled=\"!image.imageForUploadPreview || uploadRunning || uploadError\" ng-click=getPreview()>Auswählen</md-button></div></div></div></div>"
  );


  $templateCache.put('app/modules/util/file/previewPicture/template.html',
    "<div class=modal-body><div class=cropArea><ely-image-cropper commands=ctrl.commands image-result-data=ctrl.imageResultData ratio=0.62745 original-size=ctrl.checkOriginalSize min-width=100 min-height=160></ely-image-cropper></div></div><div class=modal-footer><md-button class=\"md-primary md-raised ely-button btn-file\">Bild auswählen...<input type=file ely-file-model=image.imageForUpload accept=\".jpg, .png, jpeg\"></md-button><div class=upload-file-error ng-show=ctrl.uploadError>{{ctrl.uploadError}}</div><md-button class=\"md-primary ely-button\" ng-click=ctrl.cancel()>Abbrechen</md-button><md-button class=\"md-primary md-raised ely-button\" ng-disabled=\"!ctrl.imageForUploadPreview || uploadError\" ng-click=ctrl.continue()>Auswählen</md-button></div>"
  );


  $templateCache.put('app/modules/util/file/uploadFile.html',
    "<div class=modal tabindex=-1 role=dialog ng-controller=FileCtrl><div class=modal-dialog><div class=modal-content><div class=modal-body><div class=cropArea><ely-image-cropper ng-if=!uploadRunning reset=resetImage image=imageForUploadPreview image-result-data=imageResultData ratio=1></ely-image-cropper></div><ely-spin ng-if=uploadRunning></ely-spin></div><div class=modal-footer><md-button class=\"md-primary md-raised ely-button btn-file\" ng-disabled=uploadRunning>Bild auswählen...<input type=file ely-file-model=image.imageForUpload accept=\".jpg, .png, jpeg\"></md-button><div class=upload-file-error ng-show=uploadError>{{uploadError}}</div><md-button class=\"md-primary ely-button\" ng-disabled=uploadRunning ng-click=$hide()>Abbrechen</md-button><md-button class=\"md-primary md-raised ely-button\" ng-disabled=\"!image.imageForUploadPreview || uploadRunning || uploadError\" ng-click=startUpload()>Hochladen</md-button></div></div></div></div>"
  );


  $templateCache.put('app/modules/util/tooltip/tooltipError.html',
    "<div class=\"tooltip in ely-tooltip-error\" ng-show=title><div class=tooltip-arrow></div><div class=tooltip-inner ng-bind=title></div></div>"
  );


  $templateCache.put('app/modules/viewPort/template.html',
    "<div class=viewport><ely-toolbar id=toolbar-header ng-if=\"!ctrl.$mdMedia('gt-md')\"></ely-toolbar><md-sidenav md-component-id=left class=\"md-sidenav-left md-whiteframe-z2\" md-is-locked-open=false ng-if=\"!ctrl.$mdMedia('gt-md')\"><ely-left-nav-container class=ely-sidnav></ely-left-nav-container></md-sidenav><div class=content ui-view=content ng-cloak ng-if=\"!ctrl.$mdMedia('gt-md')\"></div><div ng-if=\"ctrl.$mdMedia('gt-md')\" layout=row class=ely-gt-md-content><md-sidenav flex=none md-component-id=left class=\"md-sidenav-left md-whiteframe-z2 ely-sidnav-expanded\" md-is-locked-open=true ng-if=ctrl.showLeftNav><ely-left-nav-container class=ely-sidnav></ely-left-nav-container></md-sidenav><div class=ely-gt-md-content-container ng-style=ctrl.loginStyle><ely-toolbar id=toolbar-header></ely-toolbar><div class=content ui-view=content ng-cloak></div></div></div></div>"
  );

}]);

},{}],2:[function(require,module,exports){
/**
 * State-based routing for AngularJS
 * @version v0.2.15
 * @link http://angular-ui.github.com/
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
"undefined"!=typeof module&&"undefined"!=typeof exports&&module.exports===exports&&(module.exports="ui.router"),function(a,b,c){"use strict";function d(a,b){return N(new(N(function(){},{prototype:a})),b)}function e(a){return M(arguments,function(b){b!==a&&M(b,function(b,c){a.hasOwnProperty(c)||(a[c]=b)})}),a}function f(a,b){var c=[];for(var d in a.path){if(a.path[d]!==b.path[d])break;c.push(a.path[d])}return c}function g(a){if(Object.keys)return Object.keys(a);var b=[];return M(a,function(a,c){b.push(c)}),b}function h(a,b){if(Array.prototype.indexOf)return a.indexOf(b,Number(arguments[2])||0);var c=a.length>>>0,d=Number(arguments[2])||0;for(d=0>d?Math.ceil(d):Math.floor(d),0>d&&(d+=c);c>d;d++)if(d in a&&a[d]===b)return d;return-1}function i(a,b,c,d){var e,i=f(c,d),j={},k=[];for(var l in i)if(i[l].params&&(e=g(i[l].params),e.length))for(var m in e)h(k,e[m])>=0||(k.push(e[m]),j[e[m]]=a[e[m]]);return N({},j,b)}function j(a,b,c){if(!c){c=[];for(var d in a)c.push(d)}for(var e=0;e<c.length;e++){var f=c[e];if(a[f]!=b[f])return!1}return!0}function k(a,b){var c={};return M(a,function(a){c[a]=b[a]}),c}function l(a){var b={},c=Array.prototype.concat.apply(Array.prototype,Array.prototype.slice.call(arguments,1));return M(c,function(c){c in a&&(b[c]=a[c])}),b}function m(a){var b={},c=Array.prototype.concat.apply(Array.prototype,Array.prototype.slice.call(arguments,1));for(var d in a)-1==h(c,d)&&(b[d]=a[d]);return b}function n(a,b){var c=L(a),d=c?[]:{};return M(a,function(a,e){b(a,e)&&(d[c?d.length:e]=a)}),d}function o(a,b){var c=L(a)?[]:{};return M(a,function(a,d){c[d]=b(a,d)}),c}function p(a,b){var d=1,f=2,i={},j=[],k=i,l=N(a.when(i),{$$promises:i,$$values:i});this.study=function(i){function n(a,c){if(s[c]!==f){if(r.push(c),s[c]===d)throw r.splice(0,h(r,c)),new Error("Cyclic dependency: "+r.join(" -> "));if(s[c]=d,J(a))q.push(c,[function(){return b.get(a)}],j);else{var e=b.annotate(a);M(e,function(a){a!==c&&i.hasOwnProperty(a)&&n(i[a],a)}),q.push(c,a,e)}r.pop(),s[c]=f}}function o(a){return K(a)&&a.then&&a.$$promises}if(!K(i))throw new Error("'invocables' must be an object");var p=g(i||{}),q=[],r=[],s={};return M(i,n),i=r=s=null,function(d,f,g){function h(){--u||(v||e(t,f.$$values),r.$$values=t,r.$$promises=r.$$promises||!0,delete r.$$inheritedValues,n.resolve(t))}function i(a){r.$$failure=a,n.reject(a)}function j(c,e,f){function j(a){l.reject(a),i(a)}function k(){if(!H(r.$$failure))try{l.resolve(b.invoke(e,g,t)),l.promise.then(function(a){t[c]=a,h()},j)}catch(a){j(a)}}var l=a.defer(),m=0;M(f,function(a){s.hasOwnProperty(a)&&!d.hasOwnProperty(a)&&(m++,s[a].then(function(b){t[a]=b,--m||k()},j))}),m||k(),s[c]=l.promise}if(o(d)&&g===c&&(g=f,f=d,d=null),d){if(!K(d))throw new Error("'locals' must be an object")}else d=k;if(f){if(!o(f))throw new Error("'parent' must be a promise returned by $resolve.resolve()")}else f=l;var n=a.defer(),r=n.promise,s=r.$$promises={},t=N({},d),u=1+q.length/3,v=!1;if(H(f.$$failure))return i(f.$$failure),r;f.$$inheritedValues&&e(t,m(f.$$inheritedValues,p)),N(s,f.$$promises),f.$$values?(v=e(t,m(f.$$values,p)),r.$$inheritedValues=m(f.$$values,p),h()):(f.$$inheritedValues&&(r.$$inheritedValues=m(f.$$inheritedValues,p)),f.then(h,i));for(var w=0,x=q.length;x>w;w+=3)d.hasOwnProperty(q[w])?h():j(q[w],q[w+1],q[w+2]);return r}},this.resolve=function(a,b,c,d){return this.study(a)(b,c,d)}}function q(a,b,c){this.fromConfig=function(a,b,c){return H(a.template)?this.fromString(a.template,b):H(a.templateUrl)?this.fromUrl(a.templateUrl,b):H(a.templateProvider)?this.fromProvider(a.templateProvider,b,c):null},this.fromString=function(a,b){return I(a)?a(b):a},this.fromUrl=function(c,d){return I(c)&&(c=c(d)),null==c?null:a.get(c,{cache:b,headers:{Accept:"text/html"}}).then(function(a){return a.data})},this.fromProvider=function(a,b,d){return c.invoke(a,null,d||{params:b})}}function r(a,b,e){function f(b,c,d,e){if(q.push(b),o[b])return o[b];if(!/^\w+(-+\w+)*(?:\[\])?$/.test(b))throw new Error("Invalid parameter name '"+b+"' in pattern '"+a+"'");if(p[b])throw new Error("Duplicate parameter name '"+b+"' in pattern '"+a+"'");return p[b]=new P.Param(b,c,d,e),p[b]}function g(a,b,c,d){var e=["",""],f=a.replace(/[\\\[\]\^$*+?.()|{}]/g,"\\$&");if(!b)return f;switch(c){case!1:e=["(",")"+(d?"?":"")];break;case!0:e=["?(",")?"];break;default:e=["("+c+"|",")?"]}return f+e[0]+b+e[1]}function h(e,f){var g,h,i,j,k;return g=e[2]||e[3],k=b.params[g],i=a.substring(m,e.index),h=f?e[4]:e[4]||("*"==e[1]?".*":null),j=P.type(h||"string")||d(P.type("string"),{pattern:new RegExp(h,b.caseInsensitive?"i":c)}),{id:g,regexp:h,segment:i,type:j,cfg:k}}b=N({params:{}},K(b)?b:{});var i,j=/([:*])([\w\[\]]+)|\{([\w\[\]]+)(?:\:((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g,k=/([:]?)([\w\[\]-]+)|\{([\w\[\]-]+)(?:\:((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g,l="^",m=0,n=this.segments=[],o=e?e.params:{},p=this.params=e?e.params.$$new():new P.ParamSet,q=[];this.source=a;for(var r,s,t;(i=j.exec(a))&&(r=h(i,!1),!(r.segment.indexOf("?")>=0));)s=f(r.id,r.type,r.cfg,"path"),l+=g(r.segment,s.type.pattern.source,s.squash,s.isOptional),n.push(r.segment),m=j.lastIndex;t=a.substring(m);var u=t.indexOf("?");if(u>=0){var v=this.sourceSearch=t.substring(u);if(t=t.substring(0,u),this.sourcePath=a.substring(0,m+u),v.length>0)for(m=0;i=k.exec(v);)r=h(i,!0),s=f(r.id,r.type,r.cfg,"search"),m=j.lastIndex}else this.sourcePath=a,this.sourceSearch="";l+=g(t)+(b.strict===!1?"/?":"")+"$",n.push(t),this.regexp=new RegExp(l,b.caseInsensitive?"i":c),this.prefix=n[0],this.$$paramNames=q}function s(a){N(this,a)}function t(){function a(a){return null!=a?a.toString().replace(/\//g,"%2F"):a}function e(a){return null!=a?a.toString().replace(/%2F/g,"/"):a}function f(){return{strict:p,caseInsensitive:m}}function i(a){return I(a)||L(a)&&I(a[a.length-1])}function j(){for(;w.length;){var a=w.shift();if(a.pattern)throw new Error("You cannot override a type's .pattern at runtime.");b.extend(u[a.name],l.invoke(a.def))}}function k(a){N(this,a||{})}P=this;var l,m=!1,p=!0,q=!1,u={},v=!0,w=[],x={string:{encode:a,decode:e,is:function(a){return null==a||!H(a)||"string"==typeof a},pattern:/[^/]*/},"int":{encode:a,decode:function(a){return parseInt(a,10)},is:function(a){return H(a)&&this.decode(a.toString())===a},pattern:/\d+/},bool:{encode:function(a){return a?1:0},decode:function(a){return 0!==parseInt(a,10)},is:function(a){return a===!0||a===!1},pattern:/0|1/},date:{encode:function(a){return this.is(a)?[a.getFullYear(),("0"+(a.getMonth()+1)).slice(-2),("0"+a.getDate()).slice(-2)].join("-"):c},decode:function(a){if(this.is(a))return a;var b=this.capture.exec(a);return b?new Date(b[1],b[2]-1,b[3]):c},is:function(a){return a instanceof Date&&!isNaN(a.valueOf())},equals:function(a,b){return this.is(a)&&this.is(b)&&a.toISOString()===b.toISOString()},pattern:/[0-9]{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2][0-9]|3[0-1])/,capture:/([0-9]{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/},json:{encode:b.toJson,decode:b.fromJson,is:b.isObject,equals:b.equals,pattern:/[^/]*/},any:{encode:b.identity,decode:b.identity,equals:b.equals,pattern:/.*/}};t.$$getDefaultValue=function(a){if(!i(a.value))return a.value;if(!l)throw new Error("Injectable functions cannot be called at configuration time");return l.invoke(a.value)},this.caseInsensitive=function(a){return H(a)&&(m=a),m},this.strictMode=function(a){return H(a)&&(p=a),p},this.defaultSquashPolicy=function(a){if(!H(a))return q;if(a!==!0&&a!==!1&&!J(a))throw new Error("Invalid squash policy: "+a+". Valid policies: false, true, arbitrary-string");return q=a,a},this.compile=function(a,b){return new r(a,N(f(),b))},this.isMatcher=function(a){if(!K(a))return!1;var b=!0;return M(r.prototype,function(c,d){I(c)&&(b=b&&H(a[d])&&I(a[d]))}),b},this.type=function(a,b,c){if(!H(b))return u[a];if(u.hasOwnProperty(a))throw new Error("A type named '"+a+"' has already been defined.");return u[a]=new s(N({name:a},b)),c&&(w.push({name:a,def:c}),v||j()),this},M(x,function(a,b){u[b]=new s(N({name:b},a))}),u=d(u,{}),this.$get=["$injector",function(a){return l=a,v=!1,j(),M(x,function(a,b){u[b]||(u[b]=new s(a))}),this}],this.Param=function(a,b,d,e){function f(a){var b=K(a)?g(a):[],c=-1===h(b,"value")&&-1===h(b,"type")&&-1===h(b,"squash")&&-1===h(b,"array");return c&&(a={value:a}),a.$$fn=i(a.value)?a.value:function(){return a.value},a}function j(b,c,d){if(b.type&&c)throw new Error("Param '"+a+"' has two type configurations.");return c?c:b.type?b.type instanceof s?b.type:new s(b.type):"config"===d?u.any:u.string}function k(){var b={array:"search"===e?"auto":!1},c=a.match(/\[\]$/)?{array:!0}:{};return N(b,c,d).array}function m(a,b){var c=a.squash;if(!b||c===!1)return!1;if(!H(c)||null==c)return q;if(c===!0||J(c))return c;throw new Error("Invalid squash policy: '"+c+"'. Valid policies: false, true, or arbitrary string")}function p(a,b,d,e){var f,g,i=[{from:"",to:d||b?c:""},{from:null,to:d||b?c:""}];return f=L(a.replace)?a.replace:[],J(e)&&f.push({from:e,to:c}),g=o(f,function(a){return a.from}),n(i,function(a){return-1===h(g,a.from)}).concat(f)}function r(){if(!l)throw new Error("Injectable functions cannot be called at configuration time");var a=l.invoke(d.$$fn);if(null!==a&&a!==c&&!w.type.is(a))throw new Error("Default value ("+a+") for parameter '"+w.id+"' is not an instance of Type ("+w.type.name+")");return a}function t(a){function b(a){return function(b){return b.from===a}}function c(a){var c=o(n(w.replace,b(a)),function(a){return a.to});return c.length?c[0]:a}return a=c(a),H(a)?w.type.$normalize(a):r()}function v(){return"{Param:"+a+" "+b+" squash: '"+z+"' optional: "+y+"}"}var w=this;d=f(d),b=j(d,b,e);var x=k();b=x?b.$asArray(x,"search"===e):b,"string"!==b.name||x||"path"!==e||d.value!==c||(d.value="");var y=d.value!==c,z=m(d,y),A=p(d,x,y,z);N(this,{id:a,type:b,location:e,array:x,squash:z,replace:A,isOptional:y,value:t,dynamic:c,config:d,toString:v})},k.prototype={$$new:function(){return d(this,N(new k,{$$parent:this}))},$$keys:function(){for(var a=[],b=[],c=this,d=g(k.prototype);c;)b.push(c),c=c.$$parent;return b.reverse(),M(b,function(b){M(g(b),function(b){-1===h(a,b)&&-1===h(d,b)&&a.push(b)})}),a},$$values:function(a){var b={},c=this;return M(c.$$keys(),function(d){b[d]=c[d].value(a&&a[d])}),b},$$equals:function(a,b){var c=!0,d=this;return M(d.$$keys(),function(e){var f=a&&a[e],g=b&&b[e];d[e].type.equals(f,g)||(c=!1)}),c},$$validates:function(a){var d,e,f,g,h,i=this.$$keys();for(d=0;d<i.length&&(e=this[i[d]],f=a[i[d]],f!==c&&null!==f||!e.isOptional);d++){if(g=e.type.$normalize(f),!e.type.is(g))return!1;if(h=e.type.encode(g),b.isString(h)&&!e.type.pattern.exec(h))return!1}return!0},$$parent:c},this.ParamSet=k}function u(a,d){function e(a){var b=/^\^((?:\\[^a-zA-Z0-9]|[^\\\[\]\^$*+?.()|{}]+)*)/.exec(a.source);return null!=b?b[1].replace(/\\(.)/g,"$1"):""}function f(a,b){return a.replace(/\$(\$|\d{1,2})/,function(a,c){return b["$"===c?0:Number(c)]})}function g(a,b,c){if(!c)return!1;var d=a.invoke(b,b,{$match:c});return H(d)?d:!0}function h(d,e,f,g){function h(a,b,c){return"/"===p?a:b?p.slice(0,-1)+a:c?p.slice(1)+a:a}function m(a){function b(a){var b=a(f,d);return b?(J(b)&&d.replace().url(b),!0):!1}if(!a||!a.defaultPrevented){o&&d.url()===o;o=c;var e,g=j.length;for(e=0;g>e;e++)if(b(j[e]))return;k&&b(k)}}function n(){return i=i||e.$on("$locationChangeSuccess",m)}var o,p=g.baseHref(),q=d.url();return l||n(),{sync:function(){m()},listen:function(){return n()},update:function(a){return a?void(q=d.url()):void(d.url()!==q&&(d.url(q),d.replace()))},push:function(a,b,e){var f=a.format(b||{});null!==f&&b&&b["#"]&&(f+="#"+b["#"]),d.url(f),o=e&&e.$$avoidResync?d.url():c,e&&e.replace&&d.replace()},href:function(c,e,f){if(!c.validates(e))return null;var g=a.html5Mode();b.isObject(g)&&(g=g.enabled);var i=c.format(e);if(f=f||{},g||null===i||(i="#"+a.hashPrefix()+i),null!==i&&e&&e["#"]&&(i+="#"+e["#"]),i=h(i,g,f.absolute),!f.absolute||!i)return i;var j=!g&&i?"/":"",k=d.port();return k=80===k||443===k?"":":"+k,[d.protocol(),"://",d.host(),k,j,i].join("")}}}var i,j=[],k=null,l=!1;this.rule=function(a){if(!I(a))throw new Error("'rule' must be a function");return j.push(a),this},this.otherwise=function(a){if(J(a)){var b=a;a=function(){return b}}else if(!I(a))throw new Error("'rule' must be a function");return k=a,this},this.when=function(a,b){var c,h=J(b);if(J(a)&&(a=d.compile(a)),!h&&!I(b)&&!L(b))throw new Error("invalid 'handler' in when()");var i={matcher:function(a,b){return h&&(c=d.compile(b),b=["$match",function(a){return c.format(a)}]),N(function(c,d){return g(c,b,a.exec(d.path(),d.search()))},{prefix:J(a.prefix)?a.prefix:""})},regex:function(a,b){if(a.global||a.sticky)throw new Error("when() RegExp must not be global or sticky");return h&&(c=b,b=["$match",function(a){return f(c,a)}]),N(function(c,d){return g(c,b,a.exec(d.path()))},{prefix:e(a)})}},j={matcher:d.isMatcher(a),regex:a instanceof RegExp};for(var k in j)if(j[k])return this.rule(i[k](a,b));throw new Error("invalid 'what' in when()")},this.deferIntercept=function(a){a===c&&(a=!0),l=a},this.$get=h,h.$inject=["$location","$rootScope","$injector","$browser"]}function v(a,e){function f(a){return 0===a.indexOf(".")||0===a.indexOf("^")}function m(a,b){if(!a)return c;var d=J(a),e=d?a:a.name,g=f(e);if(g){if(!b)throw new Error("No reference point given for path '"+e+"'");b=m(b);for(var h=e.split("."),i=0,j=h.length,k=b;j>i;i++)if(""!==h[i]||0!==i){if("^"!==h[i])break;if(!k.parent)throw new Error("Path '"+e+"' not valid for state '"+b.name+"'");k=k.parent}else k=b;h=h.slice(i).join("."),e=k.name+(k.name&&h?".":"")+h}var l=z[e];return!l||!d&&(d||l!==a&&l.self!==a)?c:l}function n(a,b){A[a]||(A[a]=[]),A[a].push(b)}function p(a){for(var b=A[a]||[];b.length;)q(b.shift())}function q(b){b=d(b,{self:b,resolve:b.resolve||{},toString:function(){return this.name}});var c=b.name;if(!J(c)||c.indexOf("@")>=0)throw new Error("State must have a valid name");if(z.hasOwnProperty(c))throw new Error("State '"+c+"'' is already defined");var e=-1!==c.indexOf(".")?c.substring(0,c.lastIndexOf(".")):J(b.parent)?b.parent:K(b.parent)&&J(b.parent.name)?b.parent.name:"";if(e&&!z[e])return n(e,b.self);for(var f in C)I(C[f])&&(b[f]=C[f](b,C.$delegates[f]));return z[c]=b,!b[B]&&b.url&&a.when(b.url,["$match","$stateParams",function(a,c){y.$current.navigable==b&&j(a,c)||y.transitionTo(b,a,{inherit:!0,location:!1})}]),p(c),b}function r(a){return a.indexOf("*")>-1}function s(a){for(var b=a.split("."),c=y.$current.name.split("."),d=0,e=b.length;e>d;d++)"*"===b[d]&&(c[d]="*");return"**"===b[0]&&(c=c.slice(h(c,b[1])),c.unshift("**")),"**"===b[b.length-1]&&(c.splice(h(c,b[b.length-2])+1,Number.MAX_VALUE),c.push("**")),b.length!=c.length?!1:c.join("")===b.join("")}function t(a,b){return J(a)&&!H(b)?C[a]:I(b)&&J(a)?(C[a]&&!C.$delegates[a]&&(C.$delegates[a]=C[a]),C[a]=b,this):this}function u(a,b){return K(a)?b=a:b.name=a,q(b),this}function v(a,e,f,h,l,n,p,q,t){function u(b,c,d,f){var g=a.$broadcast("$stateNotFound",b,c,d);if(g.defaultPrevented)return p.update(),D;if(!g.retry)return null;if(f.$retry)return p.update(),E;var h=y.transition=e.when(g.retry);return h.then(function(){return h!==y.transition?A:(b.options.$retry=!0,y.transitionTo(b.to,b.toParams,b.options))},function(){return D}),p.update(),h}function v(a,c,d,g,i,j){function m(){var c=[];return M(a.views,function(d,e){var g=d.resolve&&d.resolve!==a.resolve?d.resolve:{};g.$template=[function(){return f.load(e,{view:d,locals:i.globals,params:n,notify:j.notify})||""}],c.push(l.resolve(g,i.globals,i.resolve,a).then(function(c){if(I(d.controllerProvider)||L(d.controllerProvider)){var f=b.extend({},g,i.globals);c.$$controller=h.invoke(d.controllerProvider,null,f)}else c.$$controller=d.controller;c.$$state=a,c.$$controllerAs=d.controllerAs,i[e]=c}))}),e.all(c).then(function(){return i.globals})}var n=d?c:k(a.params.$$keys(),c),o={$stateParams:n};i.resolve=l.resolve(a.resolve,o,i.resolve,a);var p=[i.resolve.then(function(a){i.globals=a})];return g&&p.push(g),e.all(p).then(m).then(function(a){return i})}var A=e.reject(new Error("transition superseded")),C=e.reject(new Error("transition prevented")),D=e.reject(new Error("transition aborted")),E=e.reject(new Error("transition failed"));return x.locals={resolve:null,globals:{$stateParams:{}}},y={params:{},current:x.self,$current:x,transition:null},y.reload=function(a){return y.transitionTo(y.current,n,{reload:a||!0,inherit:!1,notify:!0})},y.go=function(a,b,c){return y.transitionTo(a,b,N({inherit:!0,relative:y.$current},c))},y.transitionTo=function(b,c,f){c=c||{},f=N({location:!0,inherit:!1,relative:null,notify:!0,reload:!1,$retry:!1},f||{});var g,j=y.$current,l=y.params,o=j.path,q=m(b,f.relative),r=c["#"];if(!H(q)){var s={to:b,toParams:c,options:f},t=u(s,j.self,l,f);if(t)return t;if(b=s.to,c=s.toParams,f=s.options,q=m(b,f.relative),!H(q)){if(!f.relative)throw new Error("No such state '"+b+"'");throw new Error("Could not resolve '"+b+"' from state '"+f.relative+"'")}}if(q[B])throw new Error("Cannot transition to abstract state '"+b+"'");if(f.inherit&&(c=i(n,c||{},y.$current,q)),!q.params.$$validates(c))return E;c=q.params.$$values(c),b=q;var z=b.path,D=0,F=z[D],G=x.locals,I=[];if(f.reload){if(J(f.reload)||K(f.reload)){if(K(f.reload)&&!f.reload.name)throw new Error("Invalid reload state object");var L=f.reload===!0?o[0]:m(f.reload);if(f.reload&&!L)throw new Error("No such reload state '"+(J(f.reload)?f.reload:f.reload.name)+"'");for(;F&&F===o[D]&&F!==L;)G=I[D]=F.locals,D++,F=z[D]}}else for(;F&&F===o[D]&&F.ownParams.$$equals(c,l);)G=I[D]=F.locals,D++,F=z[D];if(w(b,c,j,l,G,f))return r&&(c["#"]=r),y.params=c,O(y.params,n),f.location&&b.navigable&&b.navigable.url&&(p.push(b.navigable.url,c,{$$avoidResync:!0,replace:"replace"===f.location}),p.update(!0)),y.transition=null,e.when(y.current);if(c=k(b.params.$$keys(),c||{}),f.notify&&a.$broadcast("$stateChangeStart",b.self,c,j.self,l).defaultPrevented)return a.$broadcast("$stateChangeCancel",b.self,c,j.self,l),p.update(),C;for(var M=e.when(G),P=D;P<z.length;P++,F=z[P])G=I[P]=d(G),M=v(F,c,F===b,M,G,f);var Q=y.transition=M.then(function(){var d,e,g;if(y.transition!==Q)return A;for(d=o.length-1;d>=D;d--)g=o[d],g.self.onExit&&h.invoke(g.self.onExit,g.self,g.locals.globals),g.locals=null;for(d=D;d<z.length;d++)e=z[d],e.locals=I[d],e.self.onEnter&&h.invoke(e.self.onEnter,e.self,e.locals.globals);return r&&(c["#"]=r),y.transition!==Q?A:(y.$current=b,y.current=b.self,y.params=c,O(y.params,n),y.transition=null,f.location&&b.navigable&&p.push(b.navigable.url,b.navigable.locals.globals.$stateParams,{$$avoidResync:!0,replace:"replace"===f.location}),f.notify&&a.$broadcast("$stateChangeSuccess",b.self,c,j.self,l),p.update(!0),y.current)},function(d){return y.transition!==Q?A:(y.transition=null,g=a.$broadcast("$stateChangeError",b.self,c,j.self,l,d),g.defaultPrevented||p.update(),e.reject(d))});return Q},y.is=function(a,b,d){d=N({relative:y.$current},d||{});var e=m(a,d.relative);return H(e)?y.$current!==e?!1:b?j(e.params.$$values(b),n):!0:c},y.includes=function(a,b,d){if(d=N({relative:y.$current},d||{}),J(a)&&r(a)){if(!s(a))return!1;a=y.$current.name}var e=m(a,d.relative);return H(e)?H(y.$current.includes[e.name])?b?j(e.params.$$values(b),n,g(b)):!0:!1:c},y.href=function(a,b,d){d=N({lossy:!0,inherit:!0,absolute:!1,relative:y.$current},d||{});var e=m(a,d.relative);if(!H(e))return null;d.inherit&&(b=i(n,b||{},y.$current,e));var f=e&&d.lossy?e.navigable:e;return f&&f.url!==c&&null!==f.url?p.href(f.url,k(e.params.$$keys().concat("#"),b||{}),{absolute:d.absolute}):null},y.get=function(a,b){if(0===arguments.length)return o(g(z),function(a){return z[a].self});var c=m(a,b||y.$current);return c&&c.self?c.self:null},y}function w(a,b,c,d,e,f){function g(a,b,c){function d(b){return"search"!=a.params[b].location}var e=a.params.$$keys().filter(d),f=l.apply({},[a.params].concat(e)),g=new P.ParamSet(f);return g.$$equals(b,c)}return!f.reload&&a===c&&(e===c.locals||a.self.reloadOnSearch===!1&&g(c,d,b))?!0:void 0}var x,y,z={},A={},B="abstract",C={parent:function(a){if(H(a.parent)&&a.parent)return m(a.parent);var b=/^(.+)\.[^.]+$/.exec(a.name);return b?m(b[1]):x},data:function(a){return a.parent&&a.parent.data&&(a.data=a.self.data=N({},a.parent.data,a.data)),a.data},url:function(a){var b=a.url,c={params:a.params||{}};if(J(b))return"^"==b.charAt(0)?e.compile(b.substring(1),c):(a.parent.navigable||x).url.concat(b,c);if(!b||e.isMatcher(b))return b;throw new Error("Invalid url '"+b+"' in state '"+a+"'")},navigable:function(a){return a.url?a:a.parent?a.parent.navigable:null},ownParams:function(a){var b=a.url&&a.url.params||new P.ParamSet;return M(a.params||{},function(a,c){b[c]||(b[c]=new P.Param(c,null,a,"config"))}),b},params:function(a){return a.parent&&a.parent.params?N(a.parent.params.$$new(),a.ownParams):new P.ParamSet},views:function(a){var b={};return M(H(a.views)?a.views:{"":a},function(c,d){d.indexOf("@")<0&&(d+="@"+a.parent.name),b[d]=c}),b},path:function(a){return a.parent?a.parent.path.concat(a):[]},includes:function(a){var b=a.parent?N({},a.parent.includes):{};return b[a.name]=!0,b},$delegates:{}};x=q({name:"",url:"^",views:null,"abstract":!0}),x.navigable=null,this.decorator=t,this.state=u,this.$get=v,v.$inject=["$rootScope","$q","$view","$injector","$resolve","$stateParams","$urlRouter","$location","$urlMatcherFactory"]}function w(){function a(a,b){return{load:function(c,d){var e,f={template:null,controller:null,view:null,locals:null,notify:!0,async:!0,params:{}};return d=N(f,d),d.view&&(e=b.fromConfig(d.view,d.params,d.locals)),e&&d.notify&&a.$broadcast("$viewContentLoading",d),e}}}this.$get=a,a.$inject=["$rootScope","$templateFactory"]}function x(){var a=!1;this.useAnchorScroll=function(){a=!0},this.$get=["$anchorScroll","$timeout",function(b,c){return a?b:function(a){return c(function(){a[0].scrollIntoView()},0,!1)}}]}function y(a,c,d,e){function f(){return c.has?function(a){return c.has(a)?c.get(a):null}:function(a){try{return c.get(a)}catch(b){return null}}}function g(a,b){var c=function(){return{enter:function(a,b,c){b.after(a),c()},leave:function(a,b){a.remove(),b()}}};if(j)return{enter:function(a,b,c){var d=j.enter(a,null,b,c);d&&d.then&&d.then(c)},leave:function(a,b){var c=j.leave(a,b);c&&c.then&&c.then(b)}};if(i){var d=i&&i(b,a);return{enter:function(a,b,c){d.enter(a,null,b),c()},leave:function(a,b){d.leave(a),b()}}}return c()}var h=f(),i=h("$animator"),j=h("$animate"),k={restrict:"ECA",terminal:!0,priority:400,transclude:"element",compile:function(c,f,h){return function(c,f,i){function j(){l&&(l.remove(),l=null),n&&(n.$destroy(),n=null),m&&(r.leave(m,function(){l=null}),l=m,m=null)}function k(g){var k,l=A(c,i,f,e),s=l&&a.$current&&a.$current.locals[l];if(g||s!==o){k=c.$new(),o=a.$current.locals[l];var t=h(k,function(a){r.enter(a,f,function(){n&&n.$emit("$viewContentAnimationEnded"),(b.isDefined(q)&&!q||c.$eval(q))&&d(a)}),j()});m=t,n=k,n.$emit("$viewContentLoaded"),n.$eval(p)}}var l,m,n,o,p=i.onload||"",q=i.autoscroll,r=g(i,c);c.$on("$stateChangeSuccess",function(){k(!1)}),c.$on("$viewContentLoading",function(){k(!1)}),k(!0)}}};return k}function z(a,b,c,d){return{restrict:"ECA",priority:-400,compile:function(e){var f=e.html();return function(e,g,h){var i=c.$current,j=A(e,h,g,d),k=i&&i.locals[j];if(k){g.data("$uiView",{name:j,state:k.$$state}),g.html(k.$template?k.$template:f);var l=a(g.contents());if(k.$$controller){k.$scope=e,k.$element=g;var m=b(k.$$controller,k);k.$$controllerAs&&(e[k.$$controllerAs]=m),g.data("$ngControllerController",m),g.children().data("$ngControllerController",m)}l(e)}}}}}function A(a,b,c,d){var e=d(b.uiView||b.name||"")(a),f=c.inheritedData("$uiView");return e.indexOf("@")>=0?e:e+"@"+(f?f.state.name:"")}function B(a,b){var c,d=a.match(/^\s*({[^}]*})\s*$/);if(d&&(a=b+"("+d[1]+")"),c=a.replace(/\n/g," ").match(/^([^(]+?)\s*(\((.*)\))?$/),!c||4!==c.length)throw new Error("Invalid state ref '"+a+"'");return{state:c[1],paramExpr:c[3]||null}}function C(a){var b=a.parent().inheritedData("$uiView");return b&&b.state&&b.state.name?b.state:void 0}function D(a,c){var d=["location","inherit","reload","absolute"];return{restrict:"A",require:["?^uiSrefActive","?^uiSrefActiveEq"],link:function(e,f,g,h){var i=B(g.uiSref,a.current.name),j=null,k=C(f)||a.$current,l="[object SVGAnimatedString]"===Object.prototype.toString.call(f.prop("href"))?"xlink:href":"href",m=null,n="A"===f.prop("tagName").toUpperCase(),o="FORM"===f[0].nodeName,p=o?"action":l,q=!0,r={relative:k,inherit:!0},s=e.$eval(g.uiSrefOpts)||{};b.forEach(d,function(a){a in s&&(r[a]=s[a])});var t=function(c){if(c&&(j=b.copy(c)),q){m=a.href(i.state,j,r);var d=h[1]||h[0];return d&&d.$$addStateInfo(i.state,j),null===m?(q=!1,!1):void g.$set(p,m)}};i.paramExpr&&(e.$watch(i.paramExpr,function(a,b){a!==j&&t(a)},!0),j=b.copy(e.$eval(i.paramExpr))),t(),o||f.bind("click",function(b){var d=b.which||b.button;if(!(d>1||b.ctrlKey||b.metaKey||b.shiftKey||f.attr("target"))){var e=c(function(){a.go(i.state,j,r)});b.preventDefault();var g=n&&!m?1:0;b.preventDefault=function(){g--<=0&&c.cancel(e)}}})}}}function E(a,b,c){return{restrict:"A",controller:["$scope","$element","$attrs",function(b,d,e){function f(){g()?d.addClass(i):d.removeClass(i)}function g(){for(var a=0;a<j.length;a++)if(h(j[a].state,j[a].params))return!0;return!1}function h(b,c){return"undefined"!=typeof e.uiSrefActiveEq?a.is(b.name,c):a.includes(b.name,c)}var i,j=[];i=c(e.uiSrefActiveEq||e.uiSrefActive||"",!1)(b),this.$$addStateInfo=function(b,c){var e=a.get(b,C(d));j.push({state:e||{name:b},params:c}),f()},b.$on("$stateChangeSuccess",f)}]}}function F(a){var b=function(b){return a.is(b)};return b.$stateful=!0,b}function G(a){var b=function(b){return a.includes(b)};return b.$stateful=!0,b}var H=b.isDefined,I=b.isFunction,J=b.isString,K=b.isObject,L=b.isArray,M=b.forEach,N=b.extend,O=b.copy;b.module("ui.router.util",["ng"]),b.module("ui.router.router",["ui.router.util"]),b.module("ui.router.state",["ui.router.router","ui.router.util"]),b.module("ui.router",["ui.router.state"]),b.module("ui.router.compat",["ui.router"]),p.$inject=["$q","$injector"],b.module("ui.router.util").service("$resolve",p),q.$inject=["$http","$templateCache","$injector"],b.module("ui.router.util").service("$templateFactory",q);var P;r.prototype.concat=function(a,b){var c={caseInsensitive:P.caseInsensitive(),strict:P.strictMode(),squash:P.defaultSquashPolicy()};return new r(this.sourcePath+a+this.sourceSearch,N(c,b),this)},r.prototype.toString=function(){return this.source},r.prototype.exec=function(a,b){function c(a){function b(a){return a.split("").reverse().join("")}function c(a){return a.replace(/\\-/g,"-")}var d=b(a).split(/-(?!\\)/),e=o(d,b);return o(e,c).reverse()}var d=this.regexp.exec(a);if(!d)return null;b=b||{};var e,f,g,h=this.parameters(),i=h.length,j=this.segments.length-1,k={};if(j!==d.length-1)throw new Error("Unbalanced capture group in route '"+this.source+"'");for(e=0;j>e;e++){g=h[e];var l=this.params[g],m=d[e+1];for(f=0;f<l.replace;f++)l.replace[f].from===m&&(m=l.replace[f].to);m&&l.array===!0&&(m=c(m)),k[g]=l.value(m)}for(;i>e;e++)g=h[e],k[g]=this.params[g].value(b[g]);return k},r.prototype.parameters=function(a){return H(a)?this.params[a]||null:this.$$paramNames},r.prototype.validates=function(a){return this.params.$$validates(a)},r.prototype.format=function(a){function b(a){return encodeURIComponent(a).replace(/-/g,function(a){return"%5C%"+a.charCodeAt(0).toString(16).toUpperCase()})}a=a||{};var c=this.segments,d=this.parameters(),e=this.params;if(!this.validates(a))return null;var f,g=!1,h=c.length-1,i=d.length,j=c[0];for(f=0;i>f;f++){var k=h>f,l=d[f],m=e[l],n=m.value(a[l]),p=m.isOptional&&m.type.equals(m.value(),n),q=p?m.squash:!1,r=m.type.encode(n);if(k){var s=c[f+1];if(q===!1)null!=r&&(j+=L(r)?o(r,b).join("-"):encodeURIComponent(r)),j+=s;else if(q===!0){var t=j.match(/\/$/)?/\/?(.*)/:/(.*)/;j+=s.match(t)[1]}else J(q)&&(j+=q+s)}else{if(null==r||p&&q!==!1)continue;L(r)||(r=[r]),r=o(r,encodeURIComponent).join("&"+l+"="),j+=(g?"&":"?")+(l+"="+r),g=!0}}return j},s.prototype.is=function(a,b){return!0},s.prototype.encode=function(a,b){return a},s.prototype.decode=function(a,b){return a},s.prototype.equals=function(a,b){return a==b},s.prototype.$subPattern=function(){var a=this.pattern.toString();return a.substr(1,a.length-2)},s.prototype.pattern=/.*/,s.prototype.toString=function(){return"{Type:"+this.name+"}"},s.prototype.$normalize=function(a){return this.is(a)?a:this.decode(a)},s.prototype.$asArray=function(a,b){function d(a,b){function d(a,b){return function(){return a[b].apply(a,arguments)}}function e(a){return L(a)?a:H(a)?[a]:[]}function f(a){switch(a.length){case 0:return c;case 1:return"auto"===b?a[0]:a;default:return a}}function g(a){return!a}function h(a,b){return function(c){c=e(c);var d=o(c,a);return b===!0?0===n(d,g).length:f(d)}}function i(a){return function(b,c){var d=e(b),f=e(c);if(d.length!==f.length)return!1;for(var g=0;g<d.length;g++)if(!a(d[g],f[g]))return!1;return!0}}this.encode=h(d(a,"encode")),this.decode=h(d(a,"decode")),this.is=h(d(a,"is"),!0),this.equals=i(d(a,"equals")),this.pattern=a.pattern,this.$normalize=h(d(a,"$normalize")),this.name=a.name,this.$arrayMode=b}if(!a)return this;if("auto"===a&&!b)throw new Error("'auto' array mode is for query parameters only");return new d(this,a)},b.module("ui.router.util").provider("$urlMatcherFactory",t),b.module("ui.router.util").run(["$urlMatcherFactory",function(a){}]),u.$inject=["$locationProvider","$urlMatcherFactoryProvider"],b.module("ui.router.router").provider("$urlRouter",u),v.$inject=["$urlRouterProvider","$urlMatcherFactoryProvider"],b.module("ui.router.state").value("$stateParams",{}).provider("$state",v),w.$inject=[],b.module("ui.router.state").provider("$view",w),b.module("ui.router.state").provider("$uiViewScroll",x),y.$inject=["$state","$injector","$uiViewScroll","$interpolate"],z.$inject=["$compile","$controller","$state","$interpolate"],b.module("ui.router.state").directive("uiView",y),b.module("ui.router.state").directive("uiView",z),D.$inject=["$state","$timeout"],E.$inject=["$state","$stateParams","$interpolate"],b.module("ui.router.state").directive("uiSref",D).directive("uiSrefActive",E).directive("uiSrefActiveEq",E),F.$inject=["$state"],G.$inject=["$state"],b.module("ui.router.state").filter("isState",F).filter("includedByState",G)}(window,window.angular);
},{}],3:[function(require,module,exports){
//! moment.js
//! version : 2.10.3
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com
!function(a,b){"object"==typeof exports&&"undefined"!=typeof module?module.exports=b():"function"==typeof define&&define.amd?define(b):a.moment=b()}(this,function(){"use strict";function a(){return Gd.apply(null,arguments)}function b(a){Gd=a}function c(a){return"[object Array]"===Object.prototype.toString.call(a)}function d(a){return a instanceof Date||"[object Date]"===Object.prototype.toString.call(a)}function e(a,b){var c,d=[];for(c=0;c<a.length;++c)d.push(b(a[c],c));return d}function f(a,b){return Object.prototype.hasOwnProperty.call(a,b)}function g(a,b){for(var c in b)f(b,c)&&(a[c]=b[c]);return f(b,"toString")&&(a.toString=b.toString),f(b,"valueOf")&&(a.valueOf=b.valueOf),a}function h(a,b,c,d){return za(a,b,c,d,!0).utc()}function i(){return{empty:!1,unusedTokens:[],unusedInput:[],overflow:-2,charsLeftOver:0,nullInput:!1,invalidMonth:null,invalidFormat:!1,userInvalidated:!1,iso:!1}}function j(a){return null==a._pf&&(a._pf=i()),a._pf}function k(a){if(null==a._isValid){var b=j(a);a._isValid=!isNaN(a._d.getTime())&&b.overflow<0&&!b.empty&&!b.invalidMonth&&!b.nullInput&&!b.invalidFormat&&!b.userInvalidated,a._strict&&(a._isValid=a._isValid&&0===b.charsLeftOver&&0===b.unusedTokens.length&&void 0===b.bigHour)}return a._isValid}function l(a){var b=h(0/0);return null!=a?g(j(b),a):j(b).userInvalidated=!0,b}function m(a,b){var c,d,e;if("undefined"!=typeof b._isAMomentObject&&(a._isAMomentObject=b._isAMomentObject),"undefined"!=typeof b._i&&(a._i=b._i),"undefined"!=typeof b._f&&(a._f=b._f),"undefined"!=typeof b._l&&(a._l=b._l),"undefined"!=typeof b._strict&&(a._strict=b._strict),"undefined"!=typeof b._tzm&&(a._tzm=b._tzm),"undefined"!=typeof b._isUTC&&(a._isUTC=b._isUTC),"undefined"!=typeof b._offset&&(a._offset=b._offset),"undefined"!=typeof b._pf&&(a._pf=j(b)),"undefined"!=typeof b._locale&&(a._locale=b._locale),Id.length>0)for(c in Id)d=Id[c],e=b[d],"undefined"!=typeof e&&(a[d]=e);return a}function n(b){m(this,b),this._d=new Date(+b._d),Jd===!1&&(Jd=!0,a.updateOffset(this),Jd=!1)}function o(a){return a instanceof n||null!=a&&null!=a._isAMomentObject}function p(a){var b=+a,c=0;return 0!==b&&isFinite(b)&&(c=b>=0?Math.floor(b):Math.ceil(b)),c}function q(a,b,c){var d,e=Math.min(a.length,b.length),f=Math.abs(a.length-b.length),g=0;for(d=0;e>d;d++)(c&&a[d]!==b[d]||!c&&p(a[d])!==p(b[d]))&&g++;return g+f}function r(){}function s(a){return a?a.toLowerCase().replace("_","-"):a}function t(a){for(var b,c,d,e,f=0;f<a.length;){for(e=s(a[f]).split("-"),b=e.length,c=s(a[f+1]),c=c?c.split("-"):null;b>0;){if(d=u(e.slice(0,b).join("-")))return d;if(c&&c.length>=b&&q(e,c,!0)>=b-1)break;b--}f++}return null}function u(a){var b=null;if(!Kd[a]&&"undefined"!=typeof module&&module&&module.exports)try{b=Hd._abbr,require("./locale/"+a),v(b)}catch(c){}return Kd[a]}function v(a,b){var c;return a&&(c="undefined"==typeof b?x(a):w(a,b),c&&(Hd=c)),Hd._abbr}function w(a,b){return null!==b?(b.abbr=a,Kd[a]||(Kd[a]=new r),Kd[a].set(b),v(a),Kd[a]):(delete Kd[a],null)}function x(a){var b;if(a&&a._locale&&a._locale._abbr&&(a=a._locale._abbr),!a)return Hd;if(!c(a)){if(b=u(a))return b;a=[a]}return t(a)}function y(a,b){var c=a.toLowerCase();Ld[c]=Ld[c+"s"]=Ld[b]=a}function z(a){return"string"==typeof a?Ld[a]||Ld[a.toLowerCase()]:void 0}function A(a){var b,c,d={};for(c in a)f(a,c)&&(b=z(c),b&&(d[b]=a[c]));return d}function B(b,c){return function(d){return null!=d?(D(this,b,d),a.updateOffset(this,c),this):C(this,b)}}function C(a,b){return a._d["get"+(a._isUTC?"UTC":"")+b]()}function D(a,b,c){return a._d["set"+(a._isUTC?"UTC":"")+b](c)}function E(a,b){var c;if("object"==typeof a)for(c in a)this.set(c,a[c]);else if(a=z(a),"function"==typeof this[a])return this[a](b);return this}function F(a,b,c){for(var d=""+Math.abs(a),e=a>=0;d.length<b;)d="0"+d;return(e?c?"+":"":"-")+d}function G(a,b,c,d){var e=d;"string"==typeof d&&(e=function(){return this[d]()}),a&&(Pd[a]=e),b&&(Pd[b[0]]=function(){return F(e.apply(this,arguments),b[1],b[2])}),c&&(Pd[c]=function(){return this.localeData().ordinal(e.apply(this,arguments),a)})}function H(a){return a.match(/\[[\s\S]/)?a.replace(/^\[|\]$/g,""):a.replace(/\\/g,"")}function I(a){var b,c,d=a.match(Md);for(b=0,c=d.length;c>b;b++)Pd[d[b]]?d[b]=Pd[d[b]]:d[b]=H(d[b]);return function(e){var f="";for(b=0;c>b;b++)f+=d[b]instanceof Function?d[b].call(e,a):d[b];return f}}function J(a,b){return a.isValid()?(b=K(b,a.localeData()),Od[b]||(Od[b]=I(b)),Od[b](a)):a.localeData().invalidDate()}function K(a,b){function c(a){return b.longDateFormat(a)||a}var d=5;for(Nd.lastIndex=0;d>=0&&Nd.test(a);)a=a.replace(Nd,c),Nd.lastIndex=0,d-=1;return a}function L(a,b,c){ce[a]="function"==typeof b?b:function(a){return a&&c?c:b}}function M(a,b){return f(ce,a)?ce[a](b._strict,b._locale):new RegExp(N(a))}function N(a){return a.replace("\\","").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,function(a,b,c,d,e){return b||c||d||e}).replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")}function O(a,b){var c,d=b;for("string"==typeof a&&(a=[a]),"number"==typeof b&&(d=function(a,c){c[b]=p(a)}),c=0;c<a.length;c++)de[a[c]]=d}function P(a,b){O(a,function(a,c,d,e){d._w=d._w||{},b(a,d._w,d,e)})}function Q(a,b,c){null!=b&&f(de,a)&&de[a](b,c._a,c,a)}function R(a,b){return new Date(Date.UTC(a,b+1,0)).getUTCDate()}function S(a){return this._months[a.month()]}function T(a){return this._monthsShort[a.month()]}function U(a,b,c){var d,e,f;for(this._monthsParse||(this._monthsParse=[],this._longMonthsParse=[],this._shortMonthsParse=[]),d=0;12>d;d++){if(e=h([2e3,d]),c&&!this._longMonthsParse[d]&&(this._longMonthsParse[d]=new RegExp("^"+this.months(e,"").replace(".","")+"$","i"),this._shortMonthsParse[d]=new RegExp("^"+this.monthsShort(e,"").replace(".","")+"$","i")),c||this._monthsParse[d]||(f="^"+this.months(e,"")+"|^"+this.monthsShort(e,""),this._monthsParse[d]=new RegExp(f.replace(".",""),"i")),c&&"MMMM"===b&&this._longMonthsParse[d].test(a))return d;if(c&&"MMM"===b&&this._shortMonthsParse[d].test(a))return d;if(!c&&this._monthsParse[d].test(a))return d}}function V(a,b){var c;return"string"==typeof b&&(b=a.localeData().monthsParse(b),"number"!=typeof b)?a:(c=Math.min(a.date(),R(a.year(),b)),a._d["set"+(a._isUTC?"UTC":"")+"Month"](b,c),a)}function W(b){return null!=b?(V(this,b),a.updateOffset(this,!0),this):C(this,"Month")}function X(){return R(this.year(),this.month())}function Y(a){var b,c=a._a;return c&&-2===j(a).overflow&&(b=c[fe]<0||c[fe]>11?fe:c[ge]<1||c[ge]>R(c[ee],c[fe])?ge:c[he]<0||c[he]>24||24===c[he]&&(0!==c[ie]||0!==c[je]||0!==c[ke])?he:c[ie]<0||c[ie]>59?ie:c[je]<0||c[je]>59?je:c[ke]<0||c[ke]>999?ke:-1,j(a)._overflowDayOfYear&&(ee>b||b>ge)&&(b=ge),j(a).overflow=b),a}function Z(b){a.suppressDeprecationWarnings===!1&&"undefined"!=typeof console&&console.warn&&console.warn("Deprecation warning: "+b)}function $(a,b){var c=!0,d=a+"\n"+(new Error).stack;return g(function(){return c&&(Z(d),c=!1),b.apply(this,arguments)},b)}function _(a,b){ne[a]||(Z(b),ne[a]=!0)}function aa(a){var b,c,d=a._i,e=oe.exec(d);if(e){for(j(a).iso=!0,b=0,c=pe.length;c>b;b++)if(pe[b][1].exec(d)){a._f=pe[b][0]+(e[6]||" ");break}for(b=0,c=qe.length;c>b;b++)if(qe[b][1].exec(d)){a._f+=qe[b][0];break}d.match(_d)&&(a._f+="Z"),ta(a)}else a._isValid=!1}function ba(b){var c=re.exec(b._i);return null!==c?void(b._d=new Date(+c[1])):(aa(b),void(b._isValid===!1&&(delete b._isValid,a.createFromInputFallback(b))))}function ca(a,b,c,d,e,f,g){var h=new Date(a,b,c,d,e,f,g);return 1970>a&&h.setFullYear(a),h}function da(a){var b=new Date(Date.UTC.apply(null,arguments));return 1970>a&&b.setUTCFullYear(a),b}function ea(a){return fa(a)?366:365}function fa(a){return a%4===0&&a%100!==0||a%400===0}function ga(){return fa(this.year())}function ha(a,b,c){var d,e=c-b,f=c-a.day();return f>e&&(f-=7),e-7>f&&(f+=7),d=Aa(a).add(f,"d"),{week:Math.ceil(d.dayOfYear()/7),year:d.year()}}function ia(a){return ha(a,this._week.dow,this._week.doy).week}function ja(){return this._week.dow}function ka(){return this._week.doy}function la(a){var b=this.localeData().week(this);return null==a?b:this.add(7*(a-b),"d")}function ma(a){var b=ha(this,1,4).week;return null==a?b:this.add(7*(a-b),"d")}function na(a,b,c,d,e){var f,g,h=da(a,0,1).getUTCDay();return h=0===h?7:h,c=null!=c?c:e,f=e-h+(h>d?7:0)-(e>h?7:0),g=7*(b-1)+(c-e)+f+1,{year:g>0?a:a-1,dayOfYear:g>0?g:ea(a-1)+g}}function oa(a){var b=Math.round((this.clone().startOf("day")-this.clone().startOf("year"))/864e5)+1;return null==a?b:this.add(a-b,"d")}function pa(a,b,c){return null!=a?a:null!=b?b:c}function qa(a){var b=new Date;return a._useUTC?[b.getUTCFullYear(),b.getUTCMonth(),b.getUTCDate()]:[b.getFullYear(),b.getMonth(),b.getDate()]}function ra(a){var b,c,d,e,f=[];if(!a._d){for(d=qa(a),a._w&&null==a._a[ge]&&null==a._a[fe]&&sa(a),a._dayOfYear&&(e=pa(a._a[ee],d[ee]),a._dayOfYear>ea(e)&&(j(a)._overflowDayOfYear=!0),c=da(e,0,a._dayOfYear),a._a[fe]=c.getUTCMonth(),a._a[ge]=c.getUTCDate()),b=0;3>b&&null==a._a[b];++b)a._a[b]=f[b]=d[b];for(;7>b;b++)a._a[b]=f[b]=null==a._a[b]?2===b?1:0:a._a[b];24===a._a[he]&&0===a._a[ie]&&0===a._a[je]&&0===a._a[ke]&&(a._nextDay=!0,a._a[he]=0),a._d=(a._useUTC?da:ca).apply(null,f),null!=a._tzm&&a._d.setUTCMinutes(a._d.getUTCMinutes()-a._tzm),a._nextDay&&(a._a[he]=24)}}function sa(a){var b,c,d,e,f,g,h;b=a._w,null!=b.GG||null!=b.W||null!=b.E?(f=1,g=4,c=pa(b.GG,a._a[ee],ha(Aa(),1,4).year),d=pa(b.W,1),e=pa(b.E,1)):(f=a._locale._week.dow,g=a._locale._week.doy,c=pa(b.gg,a._a[ee],ha(Aa(),f,g).year),d=pa(b.w,1),null!=b.d?(e=b.d,f>e&&++d):e=null!=b.e?b.e+f:f),h=na(c,d,e,g,f),a._a[ee]=h.year,a._dayOfYear=h.dayOfYear}function ta(b){if(b._f===a.ISO_8601)return void aa(b);b._a=[],j(b).empty=!0;var c,d,e,f,g,h=""+b._i,i=h.length,k=0;for(e=K(b._f,b._locale).match(Md)||[],c=0;c<e.length;c++)f=e[c],d=(h.match(M(f,b))||[])[0],d&&(g=h.substr(0,h.indexOf(d)),g.length>0&&j(b).unusedInput.push(g),h=h.slice(h.indexOf(d)+d.length),k+=d.length),Pd[f]?(d?j(b).empty=!1:j(b).unusedTokens.push(f),Q(f,d,b)):b._strict&&!d&&j(b).unusedTokens.push(f);j(b).charsLeftOver=i-k,h.length>0&&j(b).unusedInput.push(h),j(b).bigHour===!0&&b._a[he]<=12&&b._a[he]>0&&(j(b).bigHour=void 0),b._a[he]=ua(b._locale,b._a[he],b._meridiem),ra(b),Y(b)}function ua(a,b,c){var d;return null==c?b:null!=a.meridiemHour?a.meridiemHour(b,c):null!=a.isPM?(d=a.isPM(c),d&&12>b&&(b+=12),d||12!==b||(b=0),b):b}function va(a){var b,c,d,e,f;if(0===a._f.length)return j(a).invalidFormat=!0,void(a._d=new Date(0/0));for(e=0;e<a._f.length;e++)f=0,b=m({},a),null!=a._useUTC&&(b._useUTC=a._useUTC),b._f=a._f[e],ta(b),k(b)&&(f+=j(b).charsLeftOver,f+=10*j(b).unusedTokens.length,j(b).score=f,(null==d||d>f)&&(d=f,c=b));g(a,c||b)}function wa(a){if(!a._d){var b=A(a._i);a._a=[b.year,b.month,b.day||b.date,b.hour,b.minute,b.second,b.millisecond],ra(a)}}function xa(a){var b,e=a._i,f=a._f;return a._locale=a._locale||x(a._l),null===e||void 0===f&&""===e?l({nullInput:!0}):("string"==typeof e&&(a._i=e=a._locale.preparse(e)),o(e)?new n(Y(e)):(c(f)?va(a):f?ta(a):d(e)?a._d=e:ya(a),b=new n(Y(a)),b._nextDay&&(b.add(1,"d"),b._nextDay=void 0),b))}function ya(b){var f=b._i;void 0===f?b._d=new Date:d(f)?b._d=new Date(+f):"string"==typeof f?ba(b):c(f)?(b._a=e(f.slice(0),function(a){return parseInt(a,10)}),ra(b)):"object"==typeof f?wa(b):"number"==typeof f?b._d=new Date(f):a.createFromInputFallback(b)}function za(a,b,c,d,e){var f={};return"boolean"==typeof c&&(d=c,c=void 0),f._isAMomentObject=!0,f._useUTC=f._isUTC=e,f._l=c,f._i=a,f._f=b,f._strict=d,xa(f)}function Aa(a,b,c,d){return za(a,b,c,d,!1)}function Ba(a,b){var d,e;if(1===b.length&&c(b[0])&&(b=b[0]),!b.length)return Aa();for(d=b[0],e=1;e<b.length;++e)b[e][a](d)&&(d=b[e]);return d}function Ca(){var a=[].slice.call(arguments,0);return Ba("isBefore",a)}function Da(){var a=[].slice.call(arguments,0);return Ba("isAfter",a)}function Ea(a){var b=A(a),c=b.year||0,d=b.quarter||0,e=b.month||0,f=b.week||0,g=b.day||0,h=b.hour||0,i=b.minute||0,j=b.second||0,k=b.millisecond||0;this._milliseconds=+k+1e3*j+6e4*i+36e5*h,this._days=+g+7*f,this._months=+e+3*d+12*c,this._data={},this._locale=x(),this._bubble()}function Fa(a){return a instanceof Ea}function Ga(a,b){G(a,0,0,function(){var a=this.utcOffset(),c="+";return 0>a&&(a=-a,c="-"),c+F(~~(a/60),2)+b+F(~~a%60,2)})}function Ha(a){var b=(a||"").match(_d)||[],c=b[b.length-1]||[],d=(c+"").match(we)||["-",0,0],e=+(60*d[1])+p(d[2]);return"+"===d[0]?e:-e}function Ia(b,c){var e,f;return c._isUTC?(e=c.clone(),f=(o(b)||d(b)?+b:+Aa(b))-+e,e._d.setTime(+e._d+f),a.updateOffset(e,!1),e):Aa(b).local();return c._isUTC?Aa(b).zone(c._offset||0):Aa(b).local()}function Ja(a){return 15*-Math.round(a._d.getTimezoneOffset()/15)}function Ka(b,c){var d,e=this._offset||0;return null!=b?("string"==typeof b&&(b=Ha(b)),Math.abs(b)<16&&(b=60*b),!this._isUTC&&c&&(d=Ja(this)),this._offset=b,this._isUTC=!0,null!=d&&this.add(d,"m"),e!==b&&(!c||this._changeInProgress?$a(this,Va(b-e,"m"),1,!1):this._changeInProgress||(this._changeInProgress=!0,a.updateOffset(this,!0),this._changeInProgress=null)),this):this._isUTC?e:Ja(this)}function La(a,b){return null!=a?("string"!=typeof a&&(a=-a),this.utcOffset(a,b),this):-this.utcOffset()}function Ma(a){return this.utcOffset(0,a)}function Na(a){return this._isUTC&&(this.utcOffset(0,a),this._isUTC=!1,a&&this.subtract(Ja(this),"m")),this}function Oa(){return this._tzm?this.utcOffset(this._tzm):"string"==typeof this._i&&this.utcOffset(Ha(this._i)),this}function Pa(a){return a=a?Aa(a).utcOffset():0,(this.utcOffset()-a)%60===0}function Qa(){return this.utcOffset()>this.clone().month(0).utcOffset()||this.utcOffset()>this.clone().month(5).utcOffset()}function Ra(){if(this._a){var a=this._isUTC?h(this._a):Aa(this._a);return this.isValid()&&q(this._a,a.toArray())>0}return!1}function Sa(){return!this._isUTC}function Ta(){return this._isUTC}function Ua(){return this._isUTC&&0===this._offset}function Va(a,b){var c,d,e,g=a,h=null;return Fa(a)?g={ms:a._milliseconds,d:a._days,M:a._months}:"number"==typeof a?(g={},b?g[b]=a:g.milliseconds=a):(h=xe.exec(a))?(c="-"===h[1]?-1:1,g={y:0,d:p(h[ge])*c,h:p(h[he])*c,m:p(h[ie])*c,s:p(h[je])*c,ms:p(h[ke])*c}):(h=ye.exec(a))?(c="-"===h[1]?-1:1,g={y:Wa(h[2],c),M:Wa(h[3],c),d:Wa(h[4],c),h:Wa(h[5],c),m:Wa(h[6],c),s:Wa(h[7],c),w:Wa(h[8],c)}):null==g?g={}:"object"==typeof g&&("from"in g||"to"in g)&&(e=Ya(Aa(g.from),Aa(g.to)),g={},g.ms=e.milliseconds,g.M=e.months),d=new Ea(g),Fa(a)&&f(a,"_locale")&&(d._locale=a._locale),d}function Wa(a,b){var c=a&&parseFloat(a.replace(",","."));return(isNaN(c)?0:c)*b}function Xa(a,b){var c={milliseconds:0,months:0};return c.months=b.month()-a.month()+12*(b.year()-a.year()),a.clone().add(c.months,"M").isAfter(b)&&--c.months,c.milliseconds=+b-+a.clone().add(c.months,"M"),c}function Ya(a,b){var c;return b=Ia(b,a),a.isBefore(b)?c=Xa(a,b):(c=Xa(b,a),c.milliseconds=-c.milliseconds,c.months=-c.months),c}function Za(a,b){return function(c,d){var e,f;return null===d||isNaN(+d)||(_(b,"moment()."+b+"(period, number) is deprecated. Please use moment()."+b+"(number, period)."),f=c,c=d,d=f),c="string"==typeof c?+c:c,e=Va(c,d),$a(this,e,a),this}}function $a(b,c,d,e){var f=c._milliseconds,g=c._days,h=c._months;e=null==e?!0:e,f&&b._d.setTime(+b._d+f*d),g&&D(b,"Date",C(b,"Date")+g*d),h&&V(b,C(b,"Month")+h*d),e&&a.updateOffset(b,g||h)}function _a(a){var b=a||Aa(),c=Ia(b,this).startOf("day"),d=this.diff(c,"days",!0),e=-6>d?"sameElse":-1>d?"lastWeek":0>d?"lastDay":1>d?"sameDay":2>d?"nextDay":7>d?"nextWeek":"sameElse";return this.format(this.localeData().calendar(e,this,Aa(b)))}function ab(){return new n(this)}function bb(a,b){var c;return b=z("undefined"!=typeof b?b:"millisecond"),"millisecond"===b?(a=o(a)?a:Aa(a),+this>+a):(c=o(a)?+a:+Aa(a),c<+this.clone().startOf(b))}function cb(a,b){var c;return b=z("undefined"!=typeof b?b:"millisecond"),"millisecond"===b?(a=o(a)?a:Aa(a),+a>+this):(c=o(a)?+a:+Aa(a),+this.clone().endOf(b)<c)}function db(a,b,c){return this.isAfter(a,c)&&this.isBefore(b,c)}function eb(a,b){var c;return b=z(b||"millisecond"),"millisecond"===b?(a=o(a)?a:Aa(a),+this===+a):(c=+Aa(a),+this.clone().startOf(b)<=c&&c<=+this.clone().endOf(b))}function fb(a){return 0>a?Math.ceil(a):Math.floor(a)}function gb(a,b,c){var d,e,f=Ia(a,this),g=6e4*(f.utcOffset()-this.utcOffset());return b=z(b),"year"===b||"month"===b||"quarter"===b?(e=hb(this,f),"quarter"===b?e/=3:"year"===b&&(e/=12)):(d=this-f,e="second"===b?d/1e3:"minute"===b?d/6e4:"hour"===b?d/36e5:"day"===b?(d-g)/864e5:"week"===b?(d-g)/6048e5:d),c?e:fb(e)}function hb(a,b){var c,d,e=12*(b.year()-a.year())+(b.month()-a.month()),f=a.clone().add(e,"months");return 0>b-f?(c=a.clone().add(e-1,"months"),d=(b-f)/(f-c)):(c=a.clone().add(e+1,"months"),d=(b-f)/(c-f)),-(e+d)}function ib(){return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")}function jb(){var a=this.clone().utc();return 0<a.year()&&a.year()<=9999?"function"==typeof Date.prototype.toISOString?this.toDate().toISOString():J(a,"YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"):J(a,"YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]")}function kb(b){var c=J(this,b||a.defaultFormat);return this.localeData().postformat(c)}function lb(a,b){return this.isValid()?Va({to:this,from:a}).locale(this.locale()).humanize(!b):this.localeData().invalidDate()}function mb(a){return this.from(Aa(),a)}function nb(a,b){return this.isValid()?Va({from:this,to:a}).locale(this.locale()).humanize(!b):this.localeData().invalidDate()}function ob(a){return this.to(Aa(),a)}function pb(a){var b;return void 0===a?this._locale._abbr:(b=x(a),null!=b&&(this._locale=b),this)}function qb(){return this._locale}function rb(a){switch(a=z(a)){case"year":this.month(0);case"quarter":case"month":this.date(1);case"week":case"isoWeek":case"day":this.hours(0);case"hour":this.minutes(0);case"minute":this.seconds(0);case"second":this.milliseconds(0)}return"week"===a&&this.weekday(0),"isoWeek"===a&&this.isoWeekday(1),"quarter"===a&&this.month(3*Math.floor(this.month()/3)),this}function sb(a){return a=z(a),void 0===a||"millisecond"===a?this:this.startOf(a).add(1,"isoWeek"===a?"week":a).subtract(1,"ms")}function tb(){return+this._d-6e4*(this._offset||0)}function ub(){return Math.floor(+this/1e3)}function vb(){return this._offset?new Date(+this):this._d}function wb(){var a=this;return[a.year(),a.month(),a.date(),a.hour(),a.minute(),a.second(),a.millisecond()]}function xb(){return k(this)}function yb(){return g({},j(this))}function zb(){return j(this).overflow}function Ab(a,b){G(0,[a,a.length],0,b)}function Bb(a,b,c){return ha(Aa([a,11,31+b-c]),b,c).week}function Cb(a){var b=ha(this,this.localeData()._week.dow,this.localeData()._week.doy).year;return null==a?b:this.add(a-b,"y")}function Db(a){var b=ha(this,1,4).year;return null==a?b:this.add(a-b,"y")}function Eb(){return Bb(this.year(),1,4)}function Fb(){var a=this.localeData()._week;return Bb(this.year(),a.dow,a.doy)}function Gb(a){return null==a?Math.ceil((this.month()+1)/3):this.month(3*(a-1)+this.month()%3)}function Hb(a,b){if("string"==typeof a)if(isNaN(a)){if(a=b.weekdaysParse(a),"number"!=typeof a)return null}else a=parseInt(a,10);return a}function Ib(a){return this._weekdays[a.day()]}function Jb(a){return this._weekdaysShort[a.day()]}function Kb(a){return this._weekdaysMin[a.day()]}function Lb(a){var b,c,d;for(this._weekdaysParse||(this._weekdaysParse=[]),b=0;7>b;b++)if(this._weekdaysParse[b]||(c=Aa([2e3,1]).day(b),d="^"+this.weekdays(c,"")+"|^"+this.weekdaysShort(c,"")+"|^"+this.weekdaysMin(c,""),this._weekdaysParse[b]=new RegExp(d.replace(".",""),"i")),this._weekdaysParse[b].test(a))return b}function Mb(a){var b=this._isUTC?this._d.getUTCDay():this._d.getDay();return null!=a?(a=Hb(a,this.localeData()),this.add(a-b,"d")):b}function Nb(a){var b=(this.day()+7-this.localeData()._week.dow)%7;return null==a?b:this.add(a-b,"d")}function Ob(a){return null==a?this.day()||7:this.day(this.day()%7?a:a-7)}function Pb(a,b){G(a,0,0,function(){return this.localeData().meridiem(this.hours(),this.minutes(),b)})}function Qb(a,b){return b._meridiemParse}function Rb(a){return"p"===(a+"").toLowerCase().charAt(0)}function Sb(a,b,c){return a>11?c?"pm":"PM":c?"am":"AM"}function Tb(a){G(0,[a,3],0,"millisecond")}function Ub(){return this._isUTC?"UTC":""}function Vb(){return this._isUTC?"Coordinated Universal Time":""}function Wb(a){return Aa(1e3*a)}function Xb(){return Aa.apply(null,arguments).parseZone()}function Yb(a,b,c){var d=this._calendar[a];return"function"==typeof d?d.call(b,c):d}function Zb(a){var b=this._longDateFormat[a];return!b&&this._longDateFormat[a.toUpperCase()]&&(b=this._longDateFormat[a.toUpperCase()].replace(/MMMM|MM|DD|dddd/g,function(a){return a.slice(1)}),this._longDateFormat[a]=b),b}function $b(){return this._invalidDate}function _b(a){return this._ordinal.replace("%d",a)}function ac(a){return a}function bc(a,b,c,d){var e=this._relativeTime[c];return"function"==typeof e?e(a,b,c,d):e.replace(/%d/i,a)}function cc(a,b){var c=this._relativeTime[a>0?"future":"past"];return"function"==typeof c?c(b):c.replace(/%s/i,b)}function dc(a){var b,c;for(c in a)b=a[c],"function"==typeof b?this[c]=b:this["_"+c]=b;this._ordinalParseLenient=new RegExp(this._ordinalParse.source+"|"+/\d{1,2}/.source)}function ec(a,b,c,d){var e=x(),f=h().set(d,b);return e[c](f,a)}function fc(a,b,c,d,e){if("number"==typeof a&&(b=a,a=void 0),a=a||"",null!=b)return ec(a,b,c,e);var f,g=[];for(f=0;d>f;f++)g[f]=ec(a,f,c,e);return g}function gc(a,b){return fc(a,b,"months",12,"month")}function hc(a,b){return fc(a,b,"monthsShort",12,"month")}function ic(a,b){return fc(a,b,"weekdays",7,"day")}function jc(a,b){return fc(a,b,"weekdaysShort",7,"day")}function kc(a,b){return fc(a,b,"weekdaysMin",7,"day")}function lc(){var a=this._data;return this._milliseconds=Ue(this._milliseconds),this._days=Ue(this._days),this._months=Ue(this._months),a.milliseconds=Ue(a.milliseconds),a.seconds=Ue(a.seconds),a.minutes=Ue(a.minutes),a.hours=Ue(a.hours),a.months=Ue(a.months),a.years=Ue(a.years),this}function mc(a,b,c,d){var e=Va(b,c);return a._milliseconds+=d*e._milliseconds,a._days+=d*e._days,a._months+=d*e._months,a._bubble()}function nc(a,b){return mc(this,a,b,1)}function oc(a,b){return mc(this,a,b,-1)}function pc(){var a,b,c,d=this._milliseconds,e=this._days,f=this._months,g=this._data,h=0;return g.milliseconds=d%1e3,a=fb(d/1e3),g.seconds=a%60,b=fb(a/60),g.minutes=b%60,c=fb(b/60),g.hours=c%24,e+=fb(c/24),h=fb(qc(e)),e-=fb(rc(h)),f+=fb(e/30),e%=30,h+=fb(f/12),f%=12,g.days=e,g.months=f,g.years=h,this}function qc(a){return 400*a/146097}function rc(a){return 146097*a/400}function sc(a){var b,c,d=this._milliseconds;if(a=z(a),"month"===a||"year"===a)return b=this._days+d/864e5,c=this._months+12*qc(b),"month"===a?c:c/12;switch(b=this._days+Math.round(rc(this._months/12)),a){case"week":return b/7+d/6048e5;case"day":return b+d/864e5;case"hour":return 24*b+d/36e5;case"minute":return 1440*b+d/6e4;case"second":return 86400*b+d/1e3;case"millisecond":return Math.floor(864e5*b)+d;default:throw new Error("Unknown unit "+a)}}function tc(){return this._milliseconds+864e5*this._days+this._months%12*2592e6+31536e6*p(this._months/12)}function uc(a){return function(){return this.as(a)}}function vc(a){return a=z(a),this[a+"s"]()}function wc(a){return function(){return this._data[a]}}function xc(){return fb(this.days()/7)}function yc(a,b,c,d,e){return e.relativeTime(b||1,!!c,a,d)}function zc(a,b,c){var d=Va(a).abs(),e=jf(d.as("s")),f=jf(d.as("m")),g=jf(d.as("h")),h=jf(d.as("d")),i=jf(d.as("M")),j=jf(d.as("y")),k=e<kf.s&&["s",e]||1===f&&["m"]||f<kf.m&&["mm",f]||1===g&&["h"]||g<kf.h&&["hh",g]||1===h&&["d"]||h<kf.d&&["dd",h]||1===i&&["M"]||i<kf.M&&["MM",i]||1===j&&["y"]||["yy",j];return k[2]=b,k[3]=+a>0,k[4]=c,yc.apply(null,k)}function Ac(a,b){return void 0===kf[a]?!1:void 0===b?kf[a]:(kf[a]=b,!0)}function Bc(a){var b=this.localeData(),c=zc(this,!a,b);return a&&(c=b.pastFuture(+this,c)),b.postformat(c)}function Cc(){var a=lf(this.years()),b=lf(this.months()),c=lf(this.days()),d=lf(this.hours()),e=lf(this.minutes()),f=lf(this.seconds()+this.milliseconds()/1e3),g=this.asSeconds();return g?(0>g?"-":"")+"P"+(a?a+"Y":"")+(b?b+"M":"")+(c?c+"D":"")+(d||e||f?"T":"")+(d?d+"H":"")+(e?e+"M":"")+(f?f+"S":""):"P0D"}
//! moment.js locale configuration
//! locale : belarusian (be)
//! author : Dmitry Demidov : https://github.com/demidov91
//! author: Praleska: http://praleska.pro/
//! Author : Menelion Elensúle : https://github.com/Oire
    function Dc(a,b){var c=a.split("_");return b%10===1&&b%100!==11?c[0]:b%10>=2&&4>=b%10&&(10>b%100||b%100>=20)?c[1]:c[2]}function Ec(a,b,c){var d={mm:b?"хвіліна_хвіліны_хвілін":"хвіліну_хвіліны_хвілін",hh:b?"гадзіна_гадзіны_гадзін":"гадзіну_гадзіны_гадзін",dd:"дзень_дні_дзён",MM:"месяц_месяцы_месяцаў",yy:"год_гады_гадоў"};return"m"===c?b?"хвіліна":"хвіліну":"h"===c?b?"гадзіна":"гадзіну":a+" "+Dc(d[c],+a)}function Fc(a,b){var c={nominative:"студзень_люты_сакавік_красавік_травень_чэрвень_ліпень_жнівень_верасень_кастрычнік_лістапад_снежань".split("_"),accusative:"студзеня_лютага_сакавіка_красавіка_траўня_чэрвеня_ліпеня_жніўня_верасня_кастрычніка_лістапада_снежня".split("_")},d=/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(b)?"accusative":"nominative";return c[d][a.month()]}function Gc(a,b){var c={nominative:"нядзеля_панядзелак_аўторак_серада_чацвер_пятніца_субота".split("_"),accusative:"нядзелю_панядзелак_аўторак_сераду_чацвер_пятніцу_суботу".split("_")},d=/\[ ?[Вв] ?(?:мінулую|наступную)? ?\] ?dddd/.test(b)?"accusative":"nominative";return c[d][a.day()]}
//! moment.js locale configuration
//! locale : breton (br)
//! author : Jean-Baptiste Le Duigou : https://github.com/jbleduigou
    function Hc(a,b,c){var d={mm:"munutenn",MM:"miz",dd:"devezh"};return a+" "+Kc(d[c],a)}function Ic(a){switch(Jc(a)){case 1:case 3:case 4:case 5:case 9:return a+" bloaz";default:return a+" vloaz"}}function Jc(a){return a>9?Jc(a%10):a}function Kc(a,b){return 2===b?Lc(a):a}function Lc(a){var b={m:"v",b:"v",d:"z"};return void 0===b[a.charAt(0)]?a:b[a.charAt(0)]+a.substring(1)}
//! moment.js locale configuration
//! locale : bosnian (bs)
//! author : Nedim Cholich : https://github.com/frontyard
//! based on (hr) translation by Bojan Marković
    function Mc(a,b,c){var d=a+" ";switch(c){case"m":return b?"jedna minuta":"jedne minute";case"mm":return d+=1===a?"minuta":2===a||3===a||4===a?"minute":"minuta";case"h":return b?"jedan sat":"jednog sata";case"hh":return d+=1===a?"sat":2===a||3===a||4===a?"sata":"sati";case"dd":return d+=1===a?"dan":"dana";case"MM":return d+=1===a?"mjesec":2===a||3===a||4===a?"mjeseca":"mjeseci";case"yy":return d+=1===a?"godina":2===a||3===a||4===a?"godine":"godina"}}function Nc(a){return a>1&&5>a&&1!==~~(a/10)}function Oc(a,b,c,d){var e=a+" ";switch(c){case"s":return b||d?"pár sekund":"pár sekundami";case"m":return b?"minuta":d?"minutu":"minutou";case"mm":return b||d?e+(Nc(a)?"minuty":"minut"):e+"minutami";break;case"h":return b?"hodina":d?"hodinu":"hodinou";case"hh":return b||d?e+(Nc(a)?"hodiny":"hodin"):e+"hodinami";break;case"d":return b||d?"den":"dnem";case"dd":return b||d?e+(Nc(a)?"dny":"dní"):e+"dny";break;case"M":return b||d?"měsíc":"měsícem";case"MM":return b||d?e+(Nc(a)?"měsíce":"měsíců"):e+"měsíci";break;case"y":return b||d?"rok":"rokem";case"yy":return b||d?e+(Nc(a)?"roky":"let"):e+"lety"}}
//! moment.js locale configuration
//! locale : austrian german (de-at)
//! author : lluchs : https://github.com/lluchs
//! author: Menelion Elensúle: https://github.com/Oire
//! author : Martin Groller : https://github.com/MadMG
    function Pc(a,b,c,d){var e={m:["eine Minute","einer Minute"],h:["eine Stunde","einer Stunde"],d:["ein Tag","einem Tag"],dd:[a+" Tage",a+" Tagen"],M:["ein Monat","einem Monat"],MM:[a+" Monate",a+" Monaten"],y:["ein Jahr","einem Jahr"],yy:[a+" Jahre",a+" Jahren"]};return b?e[c][0]:e[c][1]}
//! moment.js locale configuration
//! locale : german (de)
//! author : lluchs : https://github.com/lluchs
//! author: Menelion Elensúle: https://github.com/Oire
    function Qc(a,b,c,d){var e={m:["eine Minute","einer Minute"],h:["eine Stunde","einer Stunde"],d:["ein Tag","einem Tag"],dd:[a+" Tage",a+" Tagen"],M:["ein Monat","einem Monat"],MM:[a+" Monate",a+" Monaten"],y:["ein Jahr","einem Jahr"],yy:[a+" Jahre",a+" Jahren"]};return b?e[c][0]:e[c][1]}
//! moment.js locale configuration
//! locale : estonian (et)
//! author : Henry Kehlmann : https://github.com/madhenry
//! improvements : Illimar Tambek : https://github.com/ragulka
    function Rc(a,b,c,d){var e={s:["mõne sekundi","mõni sekund","paar sekundit"],m:["ühe minuti","üks minut"],mm:[a+" minuti",a+" minutit"],h:["ühe tunni","tund aega","üks tund"],hh:[a+" tunni",a+" tundi"],d:["ühe päeva","üks päev"],M:["kuu aja","kuu aega","üks kuu"],MM:[a+" kuu",a+" kuud"],y:["ühe aasta","aasta","üks aasta"],yy:[a+" aasta",a+" aastat"]};return b?e[c][2]?e[c][2]:e[c][1]:d?e[c][0]:e[c][1]}function Sc(a,b,c,d){var e="";switch(c){case"s":return d?"muutaman sekunnin":"muutama sekunti";case"m":return d?"minuutin":"minuutti";case"mm":e=d?"minuutin":"minuuttia";break;case"h":return d?"tunnin":"tunti";case"hh":e=d?"tunnin":"tuntia";break;case"d":return d?"päivän":"päivä";case"dd":e=d?"päivän":"päivää";break;case"M":return d?"kuukauden":"kuukausi";case"MM":e=d?"kuukauden":"kuukautta";break;case"y":return d?"vuoden":"vuosi";case"yy":e=d?"vuoden":"vuotta"}return e=Tc(a,d)+" "+e}function Tc(a,b){return 10>a?b?If[a]:Hf[a]:a}
//! moment.js locale configuration
//! locale : hrvatski (hr)
//! author : Bojan Marković : https://github.com/bmarkovic
    function Uc(a,b,c){var d=a+" ";switch(c){case"m":return b?"jedna minuta":"jedne minute";case"mm":return d+=1===a?"minuta":2===a||3===a||4===a?"minute":"minuta";case"h":return b?"jedan sat":"jednog sata";case"hh":return d+=1===a?"sat":2===a||3===a||4===a?"sata":"sati";case"dd":return d+=1===a?"dan":"dana";case"MM":return d+=1===a?"mjesec":2===a||3===a||4===a?"mjeseca":"mjeseci";case"yy":return d+=1===a?"godina":2===a||3===a||4===a?"godine":"godina"}}function Vc(a,b,c,d){var e=a;switch(c){case"s":return d||b?"néhány másodperc":"néhány másodperce";case"m":return"egy"+(d||b?" perc":" perce");case"mm":return e+(d||b?" perc":" perce");case"h":return"egy"+(d||b?" óra":" órája");case"hh":return e+(d||b?" óra":" órája");case"d":return"egy"+(d||b?" nap":" napja");case"dd":return e+(d||b?" nap":" napja");case"M":return"egy"+(d||b?" hónap":" hónapja");case"MM":return e+(d||b?" hónap":" hónapja");case"y":return"egy"+(d||b?" év":" éve");case"yy":return e+(d||b?" év":" éve")}return""}function Wc(a){return(a?"":"[múlt] ")+"["+Nf[this.day()]+"] LT[-kor]"}
//! moment.js locale configuration
//! locale : Armenian (hy-am)
//! author : Armendarabyan : https://github.com/armendarabyan
    function Xc(a,b){var c={nominative:"հունվար_փետրվար_մարտ_ապրիլ_մայիս_հունիս_հուլիս_օգոստոս_սեպտեմբեր_հոկտեմբեր_նոյեմբեր_դեկտեմբեր".split("_"),accusative:"հունվարի_փետրվարի_մարտի_ապրիլի_մայիսի_հունիսի_հուլիսի_օգոստոսի_սեպտեմբերի_հոկտեմբերի_նոյեմբերի_դեկտեմբերի".split("_")},d=/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(b)?"accusative":"nominative";return c[d][a.month()]}function Yc(a,b){var c="հնվ_փտր_մրտ_ապր_մյս_հնս_հլս_օգս_սպտ_հկտ_նմբ_դկտ".split("_");return c[a.month()]}function Zc(a,b){var c="կիրակի_երկուշաբթի_երեքշաբթի_չորեքշաբթի_հինգշաբթի_ուրբաթ_շաբաթ".split("_");return c[a.day()]}
//! moment.js locale configuration
//! locale : icelandic (is)
//! author : Hinrik Örn Sigurðsson : https://github.com/hinrik
    function $c(a){return a%100===11?!0:a%10===1?!1:!0}function _c(a,b,c,d){var e=a+" ";switch(c){case"s":return b||d?"nokkrar sekúndur":"nokkrum sekúndum";case"m":return b?"mínúta":"mínútu";case"mm":return $c(a)?e+(b||d?"mínútur":"mínútum"):b?e+"mínúta":e+"mínútu";case"hh":return $c(a)?e+(b||d?"klukkustundir":"klukkustundum"):e+"klukkustund";case"d":return b?"dagur":d?"dag":"degi";case"dd":return $c(a)?b?e+"dagar":e+(d?"daga":"dögum"):b?e+"dagur":e+(d?"dag":"degi");case"M":return b?"mánuður":d?"mánuð":"mánuði";case"MM":return $c(a)?b?e+"mánuðir":e+(d?"mánuði":"mánuðum"):b?e+"mánuður":e+(d?"mánuð":"mánuði");case"y":return b||d?"ár":"ári";case"yy":return $c(a)?e+(b||d?"ár":"árum"):e+(b||d?"ár":"ári")}}
//! moment.js locale configuration
//! locale : Georgian (ka)
//! author : Irakli Janiashvili : https://github.com/irakli-janiashvili
    function ad(a,b){var c={nominative:"იანვარი_თებერვალი_მარტი_აპრილი_მაისი_ივნისი_ივლისი_აგვისტო_სექტემბერი_ოქტომბერი_ნოემბერი_დეკემბერი".split("_"),accusative:"იანვარს_თებერვალს_მარტს_აპრილის_მაისს_ივნისს_ივლისს_აგვისტს_სექტემბერს_ოქტომბერს_ნოემბერს_დეკემბერს".split("_")},d=/D[oD] *MMMM?/.test(b)?"accusative":"nominative";return c[d][a.month()]}function bd(a,b){var c={nominative:"კვირა_ორშაბათი_სამშაბათი_ოთხშაბათი_ხუთშაბათი_პარასკევი_შაბათი".split("_"),accusative:"კვირას_ორშაბათს_სამშაბათს_ოთხშაბათს_ხუთშაბათს_პარასკევს_შაბათს".split("_")},d=/(წინა|შემდეგ)/.test(b)?"accusative":"nominative";return c[d][a.day()]}
//! moment.js locale configuration
//! locale : Luxembourgish (lb)
//! author : mweimerskirch : https://github.com/mweimerskirch, David Raison : https://github.com/kwisatz
    function cd(a,b,c,d){var e={m:["eng Minutt","enger Minutt"],h:["eng Stonn","enger Stonn"],d:["een Dag","engem Dag"],M:["ee Mount","engem Mount"],y:["ee Joer","engem Joer"]};return b?e[c][0]:e[c][1]}function dd(a){var b=a.substr(0,a.indexOf(" "));return fd(b)?"a "+a:"an "+a}function ed(a){var b=a.substr(0,a.indexOf(" "));return fd(b)?"viru "+a:"virun "+a}function fd(a){if(a=parseInt(a,10),isNaN(a))return!1;if(0>a)return!0;if(10>a)return a>=4&&7>=a?!0:!1;if(100>a){var b=a%10,c=a/10;return fd(0===b?c:b)}if(1e4>a){for(;a>=10;)a/=10;return fd(a)}return a/=1e3,fd(a)}function gd(a,b,c,d){return b?"kelios sekundės":d?"kelių sekundžių":"kelias sekundes"}function hd(a,b,c,d){return b?jd(c)[0]:d?jd(c)[1]:jd(c)[2]}function id(a){return a%10===0||a>10&&20>a}function jd(a){return Of[a].split("_")}function kd(a,b,c,d){var e=a+" ";return 1===a?e+hd(a,b,c[0],d):b?e+(id(a)?jd(c)[1]:jd(c)[0]):d?e+jd(c)[1]:e+(id(a)?jd(c)[1]:jd(c)[2])}function ld(a,b){var c=-1===b.indexOf("dddd HH:mm"),d=Pf[a.day()];return c?d:d.substring(0,d.length-2)+"į"}function md(a,b,c){return c?b%10===1&&11!==b?a[2]:a[3]:b%10===1&&11!==b?a[0]:a[1]}function nd(a,b,c){return a+" "+md(Qf[c],a,b)}function od(a,b,c){return md(Qf[c],a,b)}function pd(a,b){return b?"dažas sekundes":"dažām sekundēm"}function qd(a){return 5>a%10&&a%10>1&&~~(a/10)%10!==1}function rd(a,b,c){var d=a+" ";switch(c){case"m":return b?"minuta":"minutę";case"mm":return d+(qd(a)?"minuty":"minut");case"h":return b?"godzina":"godzinę";case"hh":return d+(qd(a)?"godziny":"godzin");case"MM":return d+(qd(a)?"miesiące":"miesięcy");case"yy":return d+(qd(a)?"lata":"lat")}}
//! moment.js locale configuration
//! locale : romanian (ro)
//! author : Vlad Gurdiga : https://github.com/gurdiga
//! author : Valentin Agachi : https://github.com/avaly
    function sd(a,b,c){var d={mm:"minute",hh:"ore",dd:"zile",MM:"luni",yy:"ani"},e=" ";return(a%100>=20||a>=100&&a%100===0)&&(e=" de "),a+e+d[c]}
//! moment.js locale configuration
//! locale : russian (ru)
//! author : Viktorminator : https://github.com/Viktorminator
//! Author : Menelion Elensúle : https://github.com/Oire
    function td(a,b){var c=a.split("_");return b%10===1&&b%100!==11?c[0]:b%10>=2&&4>=b%10&&(10>b%100||b%100>=20)?c[1]:c[2]}function ud(a,b,c){var d={mm:b?"минута_минуты_минут":"минуту_минуты_минут",hh:"час_часа_часов",dd:"день_дня_дней",MM:"месяц_месяца_месяцев",yy:"год_года_лет"};return"m"===c?b?"минута":"минуту":a+" "+td(d[c],+a)}function vd(a,b){var c={nominative:"январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split("_"),accusative:"января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря".split("_")},d=/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(b)?"accusative":"nominative";return c[d][a.month()]}function wd(a,b){var c={nominative:"янв_фев_март_апр_май_июнь_июль_авг_сен_окт_ноя_дек".split("_"),accusative:"янв_фев_мар_апр_мая_июня_июля_авг_сен_окт_ноя_дек".split("_")},d=/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(b)?"accusative":"nominative";return c[d][a.month()]}function xd(a,b){var c={nominative:"воскресенье_понедельник_вторник_среда_четверг_пятница_суббота".split("_"),accusative:"воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу".split("_")},d=/\[ ?[Вв] ?(?:прошлую|следующую|эту)? ?\] ?dddd/.test(b)?"accusative":"nominative";return c[d][a.day()]}function yd(a){return a>1&&5>a}function zd(a,b,c,d){var e=a+" ";switch(c){case"s":return b||d?"pár sekúnd":"pár sekundami";case"m":return b?"minúta":d?"minútu":"minútou";case"mm":return b||d?e+(yd(a)?"minúty":"minút"):e+"minútami";break;case"h":return b?"hodina":d?"hodinu":"hodinou";case"hh":return b||d?e+(yd(a)?"hodiny":"hodín"):e+"hodinami";break;case"d":return b||d?"deň":"dňom";case"dd":return b||d?e+(yd(a)?"dni":"dní"):e+"dňami";break;case"M":return b||d?"mesiac":"mesiacom";case"MM":return b||d?e+(yd(a)?"mesiace":"mesiacov"):e+"mesiacmi";break;case"y":return b||d?"rok":"rokom";case"yy":return b||d?e+(yd(a)?"roky":"rokov"):e+"rokmi"}}
//! moment.js locale configuration
//! locale : slovenian (sl)
//! author : Robert Sedovšek : https://github.com/sedovsek
    function Ad(a,b,c,d){var e=a+" ";switch(c){case"s":return b||d?"nekaj sekund":"nekaj sekundami";case"m":return b?"ena minuta":"eno minuto";case"mm":return e+=1===a?b?"minuta":"minuto":2===a?b||d?"minuti":"minutama":5>a?b||d?"minute":"minutami":b||d?"minut":"minutami";case"h":return b?"ena ura":"eno uro";case"hh":return e+=1===a?b?"ura":"uro":2===a?b||d?"uri":"urama":5>a?b||d?"ure":"urami":b||d?"ur":"urami";case"d":return b||d?"en dan":"enim dnem";case"dd":return e+=1===a?b||d?"dan":"dnem":2===a?b||d?"dni":"dnevoma":b||d?"dni":"dnevi";case"M":return b||d?"en mesec":"enim mesecem";case"MM":return e+=1===a?b||d?"mesec":"mesecem":2===a?b||d?"meseca":"mesecema":5>a?b||d?"mesece":"meseci":b||d?"mesecev":"meseci";case"y":return b||d?"eno leto":"enim letom";case"yy":return e+=1===a?b||d?"leto":"letom":2===a?b||d?"leti":"letoma":5>a?b||d?"leta":"leti":b||d?"let":"leti"}}
//! moment.js locale configuration
//! locale : ukrainian (uk)
//! author : zemlanin : https://github.com/zemlanin
//! Author : Menelion Elensúle : https://github.com/Oire
    function Bd(a,b){var c=a.split("_");return b%10===1&&b%100!==11?c[0]:b%10>=2&&4>=b%10&&(10>b%100||b%100>=20)?c[1]:c[2]}function Cd(a,b,c){var d={mm:"хвилина_хвилини_хвилин",hh:"година_години_годин",dd:"день_дні_днів",MM:"місяць_місяці_місяців",yy:"рік_роки_років"};return"m"===c?b?"хвилина":"хвилину":"h"===c?b?"година":"годину":a+" "+Bd(d[c],+a)}function Dd(a,b){var c={nominative:"січень_лютий_березень_квітень_травень_червень_липень_серпень_вересень_жовтень_листопад_грудень".split("_"),accusative:"січня_лютого_березня_квітня_травня_червня_липня_серпня_вересня_жовтня_листопада_грудня".split("_")},d=/D[oD]? *MMMM?/.test(b)?"accusative":"nominative";return c[d][a.month()]}function Ed(a,b){var c={nominative:"неділя_понеділок_вівторок_середа_четвер_п’ятниця_субота".split("_"),accusative:"неділю_понеділок_вівторок_середу_четвер_п’ятницю_суботу".split("_"),genitive:"неділі_понеділка_вівторка_середи_четверга_п’ятниці_суботи".split("_")},d=/(\[[ВвУу]\]) ?dddd/.test(b)?"accusative":/\[?(?:минулої|наступної)? ?\] ?dddd/.test(b)?"genitive":"nominative";return c[d][a.day()]}function Fd(a){return function(){return a+"о"+(11===this.hours()?"б":"")+"] LT"}}var Gd,Hd,Id=a.momentProperties=[],Jd=!1,Kd={},Ld={},Md=/(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|x|X|zz?|ZZ?|.)/g,Nd=/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,Od={},Pd={},Qd=/\d/,Rd=/\d\d/,Sd=/\d{3}/,Td=/\d{4}/,Ud=/[+-]?\d{6}/,Vd=/\d\d?/,Wd=/\d{1,3}/,Xd=/\d{1,4}/,Yd=/[+-]?\d{1,6}/,Zd=/\d+/,$d=/[+-]?\d+/,_d=/Z|[+-]\d\d:?\d\d/gi,ae=/[+-]?\d+(\.\d{1,3})?/,be=/[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,ce={},de={},ee=0,fe=1,ge=2,he=3,ie=4,je=5,ke=6;G("M",["MM",2],"Mo",function(){return this.month()+1}),G("MMM",0,0,function(a){return this.localeData().monthsShort(this,a)}),G("MMMM",0,0,function(a){return this.localeData().months(this,a)}),y("month","M"),L("M",Vd),L("MM",Vd,Rd),L("MMM",be),L("MMMM",be),O(["M","MM"],function(a,b){b[fe]=p(a)-1}),O(["MMM","MMMM"],function(a,b,c,d){var e=c._locale.monthsParse(a,d,c._strict);null!=e?b[fe]=e:j(c).invalidMonth=a});var le="January_February_March_April_May_June_July_August_September_October_November_December".split("_"),me="Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),ne={};a.suppressDeprecationWarnings=!1;var oe=/^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,pe=[["YYYYYY-MM-DD",/[+-]\d{6}-\d{2}-\d{2}/],["YYYY-MM-DD",/\d{4}-\d{2}-\d{2}/],["GGGG-[W]WW-E",/\d{4}-W\d{2}-\d/],["GGGG-[W]WW",/\d{4}-W\d{2}/],["YYYY-DDD",/\d{4}-\d{3}/]],qe=[["HH:mm:ss.SSSS",/(T| )\d\d:\d\d:\d\d\.\d+/],["HH:mm:ss",/(T| )\d\d:\d\d:\d\d/],["HH:mm",/(T| )\d\d:\d\d/],["HH",/(T| )\d\d/]],re=/^\/?Date\((\-?\d+)/i;a.createFromInputFallback=$("moment construction falls back to js Date. This is discouraged and will be removed in upcoming major release. Please refer to https://github.com/moment/moment/issues/1407 for more info.",function(a){a._d=new Date(a._i+(a._useUTC?" UTC":""))}),G(0,["YY",2],0,function(){return this.year()%100}),G(0,["YYYY",4],0,"year"),G(0,["YYYYY",5],0,"year"),G(0,["YYYYYY",6,!0],0,"year"),y("year","y"),L("Y",$d),L("YY",Vd,Rd),L("YYYY",Xd,Td),L("YYYYY",Yd,Ud),L("YYYYYY",Yd,Ud),O(["YYYY","YYYYY","YYYYYY"],ee),O("YY",function(b,c){c[ee]=a.parseTwoDigitYear(b)}),a.parseTwoDigitYear=function(a){return p(a)+(p(a)>68?1900:2e3)};var se=B("FullYear",!1);G("w",["ww",2],"wo","week"),G("W",["WW",2],"Wo","isoWeek"),y("week","w"),y("isoWeek","W"),L("w",Vd),L("ww",Vd,Rd),L("W",Vd),L("WW",Vd,Rd),P(["w","ww","W","WW"],function(a,b,c,d){b[d.substr(0,1)]=p(a)});var te={dow:0,doy:6};G("DDD",["DDDD",3],"DDDo","dayOfYear"),y("dayOfYear","DDD"),L("DDD",Wd),L("DDDD",Sd),O(["DDD","DDDD"],function(a,b,c){c._dayOfYear=p(a)}),a.ISO_8601=function(){};var ue=$("moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548",function(){var a=Aa.apply(null,arguments);return this>a?this:a}),ve=$("moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548",function(){var a=Aa.apply(null,arguments);return a>this?this:a});Ga("Z",":"),Ga("ZZ",""),L("Z",_d),L("ZZ",_d),O(["Z","ZZ"],function(a,b,c){c._useUTC=!0,c._tzm=Ha(a)});var we=/([\+\-]|\d\d)/gi;a.updateOffset=function(){};var xe=/(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,ye=/^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;Va.fn=Ea.prototype;var ze=Za(1,"add"),Ae=Za(-1,"subtract");a.defaultFormat="YYYY-MM-DDTHH:mm:ssZ";var Be=$("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.",function(a){return void 0===a?this.localeData():this.locale(a)});G(0,["gg",2],0,function(){return this.weekYear()%100}),G(0,["GG",2],0,function(){return this.isoWeekYear()%100}),Ab("gggg","weekYear"),Ab("ggggg","weekYear"),Ab("GGGG","isoWeekYear"),Ab("GGGGG","isoWeekYear"),y("weekYear","gg"),y("isoWeekYear","GG"),L("G",$d),L("g",$d),L("GG",Vd,Rd),L("gg",Vd,Rd),L("GGGG",Xd,Td),L("gggg",Xd,Td),L("GGGGG",Yd,Ud),L("ggggg",Yd,Ud),P(["gggg","ggggg","GGGG","GGGGG"],function(a,b,c,d){b[d.substr(0,2)]=p(a)}),P(["gg","GG"],function(b,c,d,e){c[e]=a.parseTwoDigitYear(b)}),G("Q",0,0,"quarter"),y("quarter","Q"),L("Q",Qd),O("Q",function(a,b){b[fe]=3*(p(a)-1)}),G("D",["DD",2],"Do","date"),y("date","D"),L("D",Vd),L("DD",Vd,Rd),L("Do",function(a,b){return a?b._ordinalParse:b._ordinalParseLenient}),O(["D","DD"],ge),O("Do",function(a,b){b[ge]=p(a.match(Vd)[0],10)});var Ce=B("Date",!0);G("d",0,"do","day"),G("dd",0,0,function(a){return this.localeData().weekdaysMin(this,a)}),G("ddd",0,0,function(a){return this.localeData().weekdaysShort(this,a)}),G("dddd",0,0,function(a){return this.localeData().weekdays(this,a)}),G("e",0,0,"weekday"),G("E",0,0,"isoWeekday"),y("day","d"),y("weekday","e"),y("isoWeekday","E"),L("d",Vd),L("e",Vd),L("E",Vd),L("dd",be),L("ddd",be),L("dddd",be),P(["dd","ddd","dddd"],function(a,b,c){var d=c._locale.weekdaysParse(a);null!=d?b.d=d:j(c).invalidWeekday=a}),P(["d","e","E"],function(a,b,c,d){b[d]=p(a)});var De="Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),Ee="Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),Fe="Su_Mo_Tu_We_Th_Fr_Sa".split("_");G("H",["HH",2],0,"hour"),G("h",["hh",2],0,function(){return this.hours()%12||12}),Pb("a",!0),Pb("A",!1),y("hour","h"),L("a",Qb),L("A",Qb),L("H",Vd),L("h",Vd),L("HH",Vd,Rd),L("hh",Vd,Rd),O(["H","HH"],he),O(["a","A"],function(a,b,c){c._isPm=c._locale.isPM(a),c._meridiem=a}),O(["h","hh"],function(a,b,c){b[he]=p(a),j(c).bigHour=!0});var Ge=/[ap]\.?m?\.?/i,He=B("Hours",!0);G("m",["mm",2],0,"minute"),y("minute","m"),L("m",Vd),L("mm",Vd,Rd),O(["m","mm"],ie);var Ie=B("Minutes",!1);G("s",["ss",2],0,"second"),y("second","s"),L("s",Vd),L("ss",Vd,Rd),O(["s","ss"],je);var Je=B("Seconds",!1);G("S",0,0,function(){return~~(this.millisecond()/100)}),G(0,["SS",2],0,function(){return~~(this.millisecond()/10)}),Tb("SSS"),Tb("SSSS"),y("millisecond","ms"),L("S",Wd,Qd),L("SS",Wd,Rd),L("SSS",Wd,Sd),L("SSSS",Zd),O(["S","SS","SSS","SSSS"],function(a,b){b[ke]=p(1e3*("0."+a))});var Ke=B("Milliseconds",!1);G("z",0,0,"zoneAbbr"),G("zz",0,0,"zoneName");var Le=n.prototype;Le.add=ze,Le.calendar=_a,Le.clone=ab,Le.diff=gb,Le.endOf=sb,Le.format=kb,Le.from=lb,Le.fromNow=mb,Le.to=nb,Le.toNow=ob,Le.get=E,Le.invalidAt=zb,Le.isAfter=bb,Le.isBefore=cb,Le.isBetween=db,Le.isSame=eb,Le.isValid=xb,Le.lang=Be,Le.locale=pb,Le.localeData=qb,Le.max=ve,Le.min=ue,Le.parsingFlags=yb,Le.set=E,Le.startOf=rb,Le.subtract=Ae,Le.toArray=wb,Le.toDate=vb,Le.toISOString=jb,Le.toJSON=jb,Le.toString=ib,Le.unix=ub,Le.valueOf=tb,Le.year=se,Le.isLeapYear=ga,Le.weekYear=Cb,Le.isoWeekYear=Db,Le.quarter=Le.quarters=Gb,Le.month=W,Le.daysInMonth=X,Le.week=Le.weeks=la,Le.isoWeek=Le.isoWeeks=ma,Le.weeksInYear=Fb,Le.isoWeeksInYear=Eb,Le.date=Ce,Le.day=Le.days=Mb,Le.weekday=Nb,Le.isoWeekday=Ob,Le.dayOfYear=oa,Le.hour=Le.hours=He,Le.minute=Le.minutes=Ie,Le.second=Le.seconds=Je,Le.millisecond=Le.milliseconds=Ke,Le.utcOffset=Ka,Le.utc=Ma,Le.local=Na,Le.parseZone=Oa,Le.hasAlignedHourOffset=Pa,Le.isDST=Qa,Le.isDSTShifted=Ra,Le.isLocal=Sa,Le.isUtcOffset=Ta,Le.isUtc=Ua,Le.isUTC=Ua,Le.zoneAbbr=Ub,Le.zoneName=Vb,Le.dates=$("dates accessor is deprecated. Use date instead.",Ce),Le.months=$("months accessor is deprecated. Use month instead",W),Le.years=$("years accessor is deprecated. Use year instead",se),Le.zone=$("moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779",La);var Me=Le,Ne={sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},Oe={LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY LT",LLLL:"dddd, MMMM D, YYYY LT"},Pe="Invalid date",Qe="%d",Re=/\d{1,2}/,Se={future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},Te=r.prototype;Te._calendar=Ne,Te.calendar=Yb,Te._longDateFormat=Oe,Te.longDateFormat=Zb,Te._invalidDate=Pe,Te.invalidDate=$b,Te._ordinal=Qe,Te.ordinal=_b,Te._ordinalParse=Re,Te.preparse=ac,Te.postformat=ac,Te._relativeTime=Se,Te.relativeTime=bc,Te.pastFuture=cc,Te.set=dc,Te.months=S,Te._months=le,Te.monthsShort=T,Te._monthsShort=me,Te.monthsParse=U,Te.week=ia,Te._week=te,Te.firstDayOfYear=ka,Te.firstDayOfWeek=ja,Te.weekdays=Ib,Te._weekdays=De,Te.weekdaysMin=Kb,Te._weekdaysMin=Fe,Te.weekdaysShort=Jb,Te._weekdaysShort=Ee,Te.weekdaysParse=Lb,Te.isPM=Rb,Te._meridiemParse=Ge,Te.meridiem=Sb,v("en",{ordinalParse:/\d{1,2}(th|st|nd|rd)/,ordinal:function(a){var b=a%10,c=1===p(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c}}),a.lang=$("moment.lang is deprecated. Use moment.locale instead.",v),a.langData=$("moment.langData is deprecated. Use moment.localeData instead.",x);var Ue=Math.abs,Ve=uc("ms"),We=uc("s"),Xe=uc("m"),Ye=uc("h"),Ze=uc("d"),$e=uc("w"),_e=uc("M"),af=uc("y"),bf=wc("milliseconds"),cf=wc("seconds"),df=wc("minutes"),ef=wc("hours"),ff=wc("days"),gf=wc("months"),hf=wc("years"),jf=Math.round,kf={s:45,m:45,h:22,d:26,M:11},lf=Math.abs,mf=Ea.prototype;mf.abs=lc,mf.add=nc,mf.subtract=oc,mf.as=sc,mf.asMilliseconds=Ve,mf.asSeconds=We,mf.asMinutes=Xe,mf.asHours=Ye,mf.asDays=Ze,mf.asWeeks=$e,mf.asMonths=_e,mf.asYears=af,mf.valueOf=tc,mf._bubble=pc,mf.get=vc,mf.milliseconds=bf,mf.seconds=cf,mf.minutes=df,mf.hours=ef,mf.days=ff,mf.weeks=xc,mf.months=gf,mf.years=hf,mf.humanize=Bc,mf.toISOString=Cc,mf.toString=Cc,mf.toJSON=Cc,mf.locale=pb,mf.localeData=qb,mf.toIsoString=$("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)",Cc),mf.lang=Be,G("X",0,0,"unix"),G("x",0,0,"valueOf"),L("x",$d),L("X",ae),O("X",function(a,b,c){c._d=new Date(1e3*parseFloat(a,10))}),O("x",function(a,b,c){c._d=new Date(p(a))}),
//! moment.js
//! version : 2.10.3
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com
        a.version="2.10.3",b(Aa),a.fn=Me,a.min=Ca,a.max=Da,a.utc=h,a.unix=Wb,a.months=gc,a.isDate=d,a.locale=v,a.invalid=l,a.duration=Va,a.isMoment=o,a.weekdays=ic,a.parseZone=Xb,a.localeData=x,a.isDuration=Fa,a.monthsShort=hc,a.weekdaysMin=kc,a.defineLocale=w,a.weekdaysShort=jc,a.normalizeUnits=z,a.relativeTimeThreshold=Ac;var nf=a,of=(nf.defineLocale("af",{months:"Januarie_Februarie_Maart_April_Mei_Junie_Julie_Augustus_September_Oktober_November_Desember".split("_"),monthsShort:"Jan_Feb_Mar_Apr_Mei_Jun_Jul_Aug_Sep_Okt_Nov_Des".split("_"),weekdays:"Sondag_Maandag_Dinsdag_Woensdag_Donderdag_Vrydag_Saterdag".split("_"),weekdaysShort:"Son_Maa_Din_Woe_Don_Vry_Sat".split("_"),weekdaysMin:"So_Ma_Di_Wo_Do_Vr_Sa".split("_"),meridiemParse:/vm|nm/i,isPM:function(a){return/^nm$/i.test(a)},meridiem:function(a,b,c){return 12>a?c?"vm":"VM":c?"nm":"NM"},longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Vandag om] LT",nextDay:"[Môre om] LT",nextWeek:"dddd [om] LT",lastDay:"[Gister om] LT",lastWeek:"[Laas] dddd [om] LT",sameElse:"L"},relativeTime:{future:"oor %s",past:"%s gelede",s:"'n paar sekondes",m:"'n minuut",mm:"%d minute",h:"'n uur",hh:"%d ure",d:"'n dag",dd:"%d dae",M:"'n maand",MM:"%d maande",y:"'n jaar",yy:"%d jaar"},ordinalParse:/\d{1,2}(ste|de)/,ordinal:function(a){return a+(1===a||8===a||a>=20?"ste":"de")},week:{dow:1,doy:4}}),nf.defineLocale("ar-ma",{months:"يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),monthsShort:"يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),weekdays:"الأحد_الإتنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"احد_اتنين_ثلاثاء_اربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[اليوم على الساعة] LT",nextDay:"[غدا على الساعة] LT",nextWeek:"dddd [على الساعة] LT",lastDay:"[أمس على الساعة] LT",lastWeek:"dddd [على الساعة] LT",sameElse:"L"},relativeTime:{future:"في %s",past:"منذ %s",s:"ثوان",m:"دقيقة",mm:"%d دقائق",h:"ساعة",hh:"%d ساعات",d:"يوم",dd:"%d أيام",M:"شهر",MM:"%d أشهر",y:"سنة",yy:"%d سنوات"},week:{dow:6,doy:12}}),{1:"١",2:"٢",3:"٣",4:"٤",5:"٥",6:"٦",7:"٧",8:"٨",9:"٩",0:"٠"}),pf={"١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","٠":"0"},qf=(nf.defineLocale("ar-sa",{months:"يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),monthsShort:"يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),weekdays:"الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},meridiemParse:/ص|م/,isPM:function(a){return"م"===a},meridiem:function(a,b,c){return 12>a?"ص":"م"},calendar:{sameDay:"[اليوم على الساعة] LT",nextDay:"[غدا على الساعة] LT",nextWeek:"dddd [على الساعة] LT",lastDay:"[أمس على الساعة] LT",lastWeek:"dddd [على الساعة] LT",sameElse:"L"},relativeTime:{future:"في %s",past:"منذ %s",s:"ثوان",m:"دقيقة",mm:"%d دقائق",h:"ساعة",hh:"%d ساعات",d:"يوم",dd:"%d أيام",M:"شهر",MM:"%d أشهر",y:"سنة",yy:"%d سنوات"},preparse:function(a){return a.replace(/[١٢٣٤٥٦٧٨٩٠]/g,function(a){return pf[a]}).replace(/،/g,",")},postformat:function(a){return a.replace(/\d/g,function(a){return of[a]}).replace(/,/g,"،")},week:{dow:6,doy:12}}),nf.defineLocale("ar-tn",{months:"جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),monthsShort:"جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),weekdays:"الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[اليوم على الساعة] LT",nextDay:"[غدا على الساعة] LT",nextWeek:"dddd [على الساعة] LT",lastDay:"[أمس على الساعة] LT",lastWeek:"dddd [على الساعة] LT",sameElse:"L"},relativeTime:{future:"في %s",past:"منذ %s",s:"ثوان",m:"دقيقة",mm:"%d دقائق",h:"ساعة",hh:"%d ساعات",d:"يوم",dd:"%d أيام",M:"شهر",MM:"%d أشهر",y:"سنة",yy:"%d سنوات"},week:{dow:1,doy:4}}),{1:"١",2:"٢",3:"٣",4:"٤",5:"٥",6:"٦",7:"٧",8:"٨",9:"٩",0:"٠"}),rf={"١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","٠":"0"},sf=function(a){return 0===a?0:1===a?1:2===a?2:a%100>=3&&10>=a%100?3:a%100>=11?4:5},tf={s:["أقل من ثانية","ثانية واحدة",["ثانيتان","ثانيتين"],"%d ثوان","%d ثانية","%d ثانية"],m:["أقل من دقيقة","دقيقة واحدة",["دقيقتان","دقيقتين"],"%d دقائق","%d دقيقة","%d دقيقة"],h:["أقل من ساعة","ساعة واحدة",["ساعتان","ساعتين"],"%d ساعات","%d ساعة","%d ساعة"],d:["أقل من يوم","يوم واحد",["يومان","يومين"],"%d أيام","%d يومًا","%d يوم"],M:["أقل من شهر","شهر واحد",["شهران","شهرين"],"%d أشهر","%d شهرا","%d شهر"],y:["أقل من عام","عام واحد",["عامان","عامين"],"%d أعوام","%d عامًا","%d عام"]},uf=function(a){return function(b,c,d,e){var f=sf(b),g=tf[a][sf(b)];return 2===f&&(g=g[c?0:1]),g.replace(/%d/i,b)}},vf=["كانون الثاني يناير","شباط فبراير","آذار مارس","نيسان أبريل","أيار مايو","حزيران يونيو","تموز يوليو","آب أغسطس","أيلول سبتمبر","تشرين الأول أكتوبر","تشرين الثاني نوفمبر","كانون الأول ديسمبر"],wf=(nf.defineLocale("ar",{months:vf,monthsShort:vf,weekdays:"الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"D/‏M/‏YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},meridiemParse:/ص|م/,isPM:function(a){return"م"===a},meridiem:function(a,b,c){return 12>a?"ص":"م"},calendar:{sameDay:"[اليوم عند الساعة] LT",nextDay:"[غدًا عند الساعة] LT",nextWeek:"dddd [عند الساعة] LT",lastDay:"[أمس عند الساعة] LT",lastWeek:"dddd [عند الساعة] LT",sameElse:"L"},relativeTime:{future:"بعد %s",past:"منذ %s",s:uf("s"),m:uf("m"),mm:uf("m"),h:uf("h"),hh:uf("h"),d:uf("d"),dd:uf("d"),M:uf("M"),MM:uf("M"),y:uf("y"),yy:uf("y")},preparse:function(a){return a.replace(/\u200f/g,"").replace(/[١٢٣٤٥٦٧٨٩٠]/g,function(a){return rf[a]}).replace(/،/g,",")},postformat:function(a){return a.replace(/\d/g,function(a){return qf[a]}).replace(/,/g,"،")},week:{dow:6,doy:12}}),{1:"-inci",5:"-inci",8:"-inci",70:"-inci",80:"-inci",2:"-nci",7:"-nci",20:"-nci",50:"-nci",3:"-üncü",4:"-üncü",100:"-üncü",6:"-ncı",9:"-uncu",10:"-uncu",30:"-uncu",60:"-ıncı",90:"-ıncı"}),xf=(nf.defineLocale("az",{months:"yanvar_fevral_mart_aprel_may_iyun_iyul_avqust_sentyabr_oktyabr_noyabr_dekabr".split("_"),monthsShort:"yan_fev_mar_apr_may_iyn_iyl_avq_sen_okt_noy_dek".split("_"),weekdays:"Bazar_Bazar ertəsi_Çərşənbə axşamı_Çərşənbə_Cümə axşamı_Cümə_Şənbə".split("_"),weekdaysShort:"Baz_BzE_ÇAx_Çər_CAx_Cüm_Şən".split("_"),weekdaysMin:"Bz_BE_ÇA_Çə_CA_Cü_Şə".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[bugün saat] LT",nextDay:"[sabah saat] LT",nextWeek:"[gələn həftə] dddd [saat] LT",lastDay:"[dünən] LT",lastWeek:"[keçən həftə] dddd [saat] LT",sameElse:"L"},relativeTime:{future:"%s sonra",past:"%s əvvəl",s:"birneçə saniyyə",m:"bir dəqiqə",mm:"%d dəqiqə",h:"bir saat",hh:"%d saat",d:"bir gün",dd:"%d gün",M:"bir ay",MM:"%d ay",y:"bir il",yy:"%d il"},meridiemParse:/gecə|səhər|gündüz|axşam/,isPM:function(a){return/^(gündüz|axşam)$/.test(a)},meridiem:function(a,b,c){return 4>a?"gecə":12>a?"səhər":17>a?"gündüz":"axşam"},ordinalParse:/\d{1,2}-(ıncı|inci|nci|üncü|ncı|uncu)/,ordinal:function(a){if(0===a)return a+"-ıncı";var b=a%10,c=a%100-b,d=a>=100?100:null;return a+(wf[b]||wf[c]||wf[d])},week:{dow:1,doy:7}}),nf.defineLocale("be",{months:Fc,monthsShort:"студ_лют_сак_крас_трав_чэрв_ліп_жнів_вер_каст_ліст_снеж".split("_"),weekdays:Gc,weekdaysShort:"нд_пн_ат_ср_чц_пт_сб".split("_"),weekdaysMin:"нд_пн_ат_ср_чц_пт_сб".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY г.",LLL:"D MMMM YYYY г., LT",LLLL:"dddd, D MMMM YYYY г., LT"},calendar:{sameDay:"[Сёння ў] LT",nextDay:"[Заўтра ў] LT",lastDay:"[Учора ў] LT",nextWeek:function(){return"[У] dddd [ў] LT"},lastWeek:function(){switch(this.day()){case 0:case 3:case 5:case 6:return"[У мінулую] dddd [ў] LT";case 1:case 2:case 4:return"[У мінулы] dddd [ў] LT"}},sameElse:"L"},relativeTime:{future:"праз %s",past:"%s таму",s:"некалькі секунд",m:Ec,mm:Ec,h:Ec,hh:Ec,d:"дзень",dd:Ec,M:"месяц",MM:Ec,y:"год",yy:Ec},meridiemParse:/ночы|раніцы|дня|вечара/,isPM:function(a){return/^(дня|вечара)$/.test(a)},meridiem:function(a,b,c){return 4>a?"ночы":12>a?"раніцы":17>a?"дня":"вечара"},ordinalParse:/\d{1,2}-(і|ы|га)/,ordinal:function(a,b){switch(b){case"M":case"d":case"DDD":case"w":case"W":return a%10!==2&&a%10!==3||a%100===12||a%100===13?a+"-ы":a+"-і";case"D":return a+"-га";default:return a}},week:{dow:1,doy:7}}),nf.defineLocale("bg",{months:"януари_февруари_март_април_май_юни_юли_август_септември_октомври_ноември_декември".split("_"),monthsShort:"янр_фев_мар_апр_май_юни_юли_авг_сеп_окт_ное_дек".split("_"),weekdays:"неделя_понеделник_вторник_сряда_четвъртък_петък_събота".split("_"),weekdaysShort:"нед_пон_вто_сря_чет_пет_съб".split("_"),weekdaysMin:"нд_пн_вт_ср_чт_пт_сб".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"D.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Днес в] LT",nextDay:"[Утре в] LT",nextWeek:"dddd [в] LT",lastDay:"[Вчера в] LT",lastWeek:function(){switch(this.day()){case 0:case 3:case 6:return"[В изминалата] dddd [в] LT";case 1:case 2:case 4:case 5:return"[В изминалия] dddd [в] LT"}},sameElse:"L"},relativeTime:{future:"след %s",past:"преди %s",s:"няколко секунди",m:"минута",mm:"%d минути",h:"час",hh:"%d часа",d:"ден",dd:"%d дни",M:"месец",MM:"%d месеца",y:"година",yy:"%d години"},ordinalParse:/\d{1,2}-(ев|ен|ти|ви|ри|ми)/,ordinal:function(a){var b=a%10,c=a%100;return 0===a?a+"-ев":0===c?a+"-ен":c>10&&20>c?a+"-ти":1===b?a+"-ви":2===b?a+"-ри":7===b||8===b?a+"-ми":a+"-ти"},week:{dow:1,doy:7}}),{1:"১",2:"২",3:"৩",4:"৪",5:"৫",6:"৬",7:"৭",8:"৮",9:"৯",0:"০"}),yf={"১":"1","২":"2","৩":"3","৪":"4","৫":"5","৬":"6","৭":"7","৮":"8","৯":"9","০":"0"},zf=(nf.defineLocale("bn",{months:"জানুয়ারী_ফেবুয়ারী_মার্চ_এপ্রিল_মে_জুন_জুলাই_অগাস্ট_সেপ্টেম্বর_অক্টোবর_নভেম্বর_ডিসেম্বর".split("_"),monthsShort:"জানু_ফেব_মার্চ_এপর_মে_জুন_জুল_অগ_সেপ্ট_অক্টো_নভ_ডিসেম্".split("_"),weekdays:"রবিবার_সোমবার_মঙ্গলবার_বুধবার_বৃহস্পত্তিবার_শুক্রুবার_শনিবার".split("_"),weekdaysShort:"রবি_সোম_মঙ্গল_বুধ_বৃহস্পত্তি_শুক্রু_শনি".split("_"),weekdaysMin:"রব_সম_মঙ্গ_বু_ব্রিহ_শু_শনি".split("_"),longDateFormat:{LT:"A h:mm সময়",LTS:"A h:mm:ss সময়",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, LT",LLLL:"dddd, D MMMM YYYY, LT"},calendar:{sameDay:"[আজ] LT",nextDay:"[আগামীকাল] LT",nextWeek:"dddd, LT",lastDay:"[গতকাল] LT",lastWeek:"[গত] dddd, LT",sameElse:"L"},relativeTime:{future:"%s পরে",past:"%s আগে",s:"কএক সেকেন্ড",m:"এক মিনিট",mm:"%d মিনিট",h:"এক ঘন্টা",hh:"%d ঘন্টা",d:"এক দিন",dd:"%d দিন",M:"এক মাস",MM:"%d মাস",y:"এক বছর",yy:"%d বছর"},preparse:function(a){return a.replace(/[১২৩৪৫৬৭৮৯০]/g,function(a){return yf[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return xf[a]})},meridiemParse:/রাত|শকাল|দুপুর|বিকেল|রাত/,isPM:function(a){return/^(দুপুর|বিকেল|রাত)$/.test(a)},meridiem:function(a,b,c){return 4>a?"রাত":10>a?"শকাল":17>a?"দুপুর":20>a?"বিকেল":"রাত"},week:{dow:0,doy:6}}),{1:"༡",2:"༢",3:"༣",4:"༤",5:"༥",6:"༦",7:"༧",8:"༨",9:"༩",0:"༠"}),Af={"༡":"1","༢":"2","༣":"3","༤":"4","༥":"5","༦":"6","༧":"7","༨":"8","༩":"9","༠":"0"},Bf=(nf.defineLocale("bo",{months:"ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ".split("_"),monthsShort:"ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ".split("_"),weekdays:"གཟའ་ཉི་མ་_གཟའ་ཟླ་བ་_གཟའ་མིག་དམར་_གཟའ་ལྷག་པ་_གཟའ་ཕུར་བུ_གཟའ་པ་སངས་_གཟའ་སྤེན་པ་".split("_"),weekdaysShort:"ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་".split("_"),weekdaysMin:"ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་".split("_"),longDateFormat:{LT:"A h:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, LT",LLLL:"dddd, D MMMM YYYY, LT"},calendar:{sameDay:"[དི་རིང] LT",nextDay:"[སང་ཉིན] LT",nextWeek:"[བདུན་ཕྲག་རྗེས་མ], LT",lastDay:"[ཁ་སང] LT",lastWeek:"[བདུན་ཕྲག་མཐའ་མ] dddd, LT",sameElse:"L"},relativeTime:{future:"%s ལ་",past:"%s སྔན་ལ",s:"ལམ་སང",m:"སྐར་མ་གཅིག",mm:"%d སྐར་མ",h:"ཆུ་ཚོད་གཅིག",hh:"%d ཆུ་ཚོད",d:"ཉིན་གཅིག",dd:"%d ཉིན་",M:"ཟླ་བ་གཅིག",MM:"%d ཟླ་བ",y:"ལོ་གཅིག",yy:"%d ལོ"},preparse:function(a){return a.replace(/[༡༢༣༤༥༦༧༨༩༠]/g,function(a){return Af[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return zf[a]})},meridiemParse:/མཚན་མོ|ཞོགས་ཀས|ཉིན་གུང|དགོང་དག|མཚན་མོ/,isPM:function(a){return/^(ཉིན་གུང|དགོང་དག|མཚན་མོ)$/.test(a)},meridiem:function(a,b,c){return 4>a?"མཚན་མོ":10>a?"ཞོགས་ཀས":17>a?"ཉིན་གུང":20>a?"དགོང་དག":"མཚན་མོ"},week:{dow:0,doy:6}}),nf.defineLocale("br",{months:"Genver_C'hwevrer_Meurzh_Ebrel_Mae_Mezheven_Gouere_Eost_Gwengolo_Here_Du_Kerzu".split("_"),monthsShort:"Gen_C'hwe_Meu_Ebr_Mae_Eve_Gou_Eos_Gwe_Her_Du_Ker".split("_"),weekdays:"Sul_Lun_Meurzh_Merc'her_Yaou_Gwener_Sadorn".split("_"),weekdaysShort:"Sul_Lun_Meu_Mer_Yao_Gwe_Sad".split("_"),weekdaysMin:"Su_Lu_Me_Mer_Ya_Gw_Sa".split("_"),longDateFormat:{LT:"h[e]mm A",LTS:"h[e]mm:ss A",L:"DD/MM/YYYY",LL:"D [a viz] MMMM YYYY",LLL:"D [a viz] MMMM YYYY LT",LLLL:"dddd, D [a viz] MMMM YYYY LT"},calendar:{sameDay:"[Hiziv da] LT",nextDay:"[Warc'hoazh da] LT",nextWeek:"dddd [da] LT",lastDay:"[Dec'h da] LT",lastWeek:"dddd [paset da] LT",sameElse:"L"},relativeTime:{future:"a-benn %s",past:"%s 'zo",s:"un nebeud segondennoù",m:"ur vunutenn",mm:Hc,h:"un eur",hh:"%d eur",d:"un devezh",dd:Hc,M:"ur miz",MM:Hc,y:"ur bloaz",yy:Ic},ordinalParse:/\d{1,2}(añ|vet)/,ordinal:function(a){var b=1===a?"añ":"vet";return a+b},week:{dow:1,doy:4}}),nf.defineLocale("bs",{months:"januar_februar_mart_april_maj_juni_juli_august_septembar_oktobar_novembar_decembar".split("_"),monthsShort:"jan._feb._mar._apr._maj._jun._jul._aug._sep._okt._nov._dec.".split("_"),weekdays:"nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split("_"),weekdaysShort:"ned._pon._uto._sri._čet._pet._sub.".split("_"),weekdaysMin:"ne_po_ut_sr_če_pe_su".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[danas u] LT",nextDay:"[sutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedjelju] [u] LT";case 3:return"[u] [srijedu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[jučer u] LT",lastWeek:function(){switch(this.day()){case 0:case 3:return"[prošlu] dddd [u] LT";case 6:return"[prošle] [subote] [u] LT";case 1:case 2:case 4:case 5:return"[prošli] dddd [u] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"prije %s",s:"par sekundi",m:Mc,mm:Mc,h:Mc,hh:Mc,d:"dan",dd:Mc,M:"mjesec",MM:Mc,y:"godinu",yy:Mc},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),nf.defineLocale("ca",{months:"gener_febrer_març_abril_maig_juny_juliol_agost_setembre_octubre_novembre_desembre".split("_"),monthsShort:"gen._febr._mar._abr._mai._jun._jul._ag._set._oct._nov._des.".split("_"),weekdays:"diumenge_dilluns_dimarts_dimecres_dijous_divendres_dissabte".split("_"),weekdaysShort:"dg._dl._dt._dc._dj._dv._ds.".split("_"),weekdaysMin:"Dg_Dl_Dt_Dc_Dj_Dv_Ds".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:function(){return"[avui a "+(1!==this.hours()?"les":"la")+"] LT"},nextDay:function(){return"[demà a "+(1!==this.hours()?"les":"la")+"] LT"},nextWeek:function(){return"dddd [a "+(1!==this.hours()?"les":"la")+"] LT"},lastDay:function(){return"[ahir a "+(1!==this.hours()?"les":"la")+"] LT"},lastWeek:function(){return"[el] dddd [passat a "+(1!==this.hours()?"les":"la")+"] LT"},sameElse:"L"},relativeTime:{future:"en %s",past:"fa %s",s:"uns segons",m:"un minut",mm:"%d minuts",h:"una hora",hh:"%d hores",d:"un dia",dd:"%d dies",M:"un mes",MM:"%d mesos",y:"un any",yy:"%d anys"},ordinalParse:/\d{1,2}(r|n|t|è|a)/,ordinal:function(a,b){var c=1===a?"r":2===a?"n":3===a?"r":4===a?"t":"è";return("w"===b||"W"===b)&&(c="a"),a+c},week:{dow:1,doy:4}}),"leden_únor_březen_duben_květen_červen_červenec_srpen_září_říjen_listopad_prosinec".split("_")),Cf="led_úno_bře_dub_kvě_čvn_čvc_srp_zář_říj_lis_pro".split("_"),Df=(nf.defineLocale("cs",{months:Bf,monthsShort:Cf,monthsParse:function(a,b){var c,d=[];for(c=0;12>c;c++)d[c]=new RegExp("^"+a[c]+"$|^"+b[c]+"$","i");return d}(Bf,Cf),weekdays:"neděle_pondělí_úterý_středa_čtvrtek_pátek_sobota".split("_"),weekdaysShort:"ne_po_út_st_čt_pá_so".split("_"),weekdaysMin:"ne_po_út_st_čt_pá_so".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd D. MMMM YYYY LT"},calendar:{sameDay:"[dnes v] LT",nextDay:"[zítra v] LT",nextWeek:function(){switch(this.day()){case 0:return"[v neděli v] LT";case 1:case 2:return"[v] dddd [v] LT";case 3:return"[ve středu v] LT";case 4:return"[ve čtvrtek v] LT";case 5:return"[v pátek v] LT";case 6:return"[v sobotu v] LT"}},lastDay:"[včera v] LT",lastWeek:function(){switch(this.day()){case 0:return"[minulou neděli v] LT";case 1:case 2:return"[minulé] dddd [v] LT";case 3:return"[minulou středu v] LT";case 4:case 5:return"[minulý] dddd [v] LT";case 6:return"[minulou sobotu v] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"před %s",s:Oc,m:Oc,mm:Oc,h:Oc,hh:Oc,d:Oc,dd:Oc,M:Oc,MM:Oc,y:Oc,yy:Oc},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),nf.defineLocale("cv",{months:"кӑрлач_нарӑс_пуш_ака_май_ҫӗртме_утӑ_ҫурла_авӑн_юпа_чӳк_раштав".split("_"),monthsShort:"кӑр_нар_пуш_ака_май_ҫӗр_утӑ_ҫур_авн_юпа_чӳк_раш".split("_"),weekdays:"вырсарникун_тунтикун_ытларикун_юнкун_кӗҫнерникун_эрнекун_шӑматкун".split("_"),weekdaysShort:"выр_тун_ытл_юн_кӗҫ_эрн_шӑм".split("_"),weekdaysMin:"вр_тн_ыт_юн_кҫ_эр_шм".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD-MM-YYYY",LL:"YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ]",LLL:"YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], LT",LLLL:"dddd, YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], LT"},calendar:{sameDay:"[Паян] LT [сехетре]",nextDay:"[Ыран] LT [сехетре]",lastDay:"[Ӗнер] LT [сехетре]",nextWeek:"[Ҫитес] dddd LT [сехетре]",lastWeek:"[Иртнӗ] dddd LT [сехетре]",sameElse:"L"},relativeTime:{future:function(a){var b=/сехет$/i.exec(a)?"рен":/ҫул$/i.exec(a)?"тан":"ран";return a+b},past:"%s каялла",s:"пӗр-ик ҫеккунт",m:"пӗр минут",mm:"%d минут",h:"пӗр сехет",hh:"%d сехет",d:"пӗр кун",dd:"%d кун",M:"пӗр уйӑх",MM:"%d уйӑх",y:"пӗр ҫул",yy:"%d ҫул"},ordinalParse:/\d{1,2}-мӗш/,ordinal:"%d-мӗш",week:{dow:1,doy:7}}),nf.defineLocale("cy",{months:"Ionawr_Chwefror_Mawrth_Ebrill_Mai_Mehefin_Gorffennaf_Awst_Medi_Hydref_Tachwedd_Rhagfyr".split("_"),monthsShort:"Ion_Chwe_Maw_Ebr_Mai_Meh_Gor_Aws_Med_Hyd_Tach_Rhag".split("_"),weekdays:"Dydd Sul_Dydd Llun_Dydd Mawrth_Dydd Mercher_Dydd Iau_Dydd Gwener_Dydd Sadwrn".split("_"),weekdaysShort:"Sul_Llun_Maw_Mer_Iau_Gwe_Sad".split("_"),weekdaysMin:"Su_Ll_Ma_Me_Ia_Gw_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Heddiw am] LT",nextDay:"[Yfory am] LT",nextWeek:"dddd [am] LT",lastDay:"[Ddoe am] LT",lastWeek:"dddd [diwethaf am] LT",sameElse:"L"},relativeTime:{future:"mewn %s",past:"%s yn ôl",s:"ychydig eiliadau",m:"munud",mm:"%d munud",h:"awr",hh:"%d awr",d:"diwrnod",dd:"%d diwrnod",M:"mis",MM:"%d mis",y:"blwyddyn",yy:"%d flynedd"},ordinalParse:/\d{1,2}(fed|ain|af|il|ydd|ed|eg)/,ordinal:function(a){var b=a,c="",d=["","af","il","ydd","ydd","ed","ed","ed","fed","fed","fed","eg","fed","eg","eg","fed","eg","eg","fed","eg","fed"];return b>20?c=40===b||50===b||60===b||80===b||100===b?"fed":"ain":b>0&&(c=d[b]),a+c},week:{dow:1,doy:4}}),nf.defineLocale("da",{months:"januar_februar_marts_april_maj_juni_juli_august_september_oktober_november_december".split("_"),monthsShort:"jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),weekdays:"søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),weekdaysShort:"søn_man_tir_ons_tor_fre_lør".split("_"),weekdaysMin:"sø_ma_ti_on_to_fr_lø".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd [d.] D. MMMM YYYY LT"},calendar:{sameDay:"[I dag kl.] LT",nextDay:"[I morgen kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[I går kl.] LT",lastWeek:"[sidste] dddd [kl] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"%s siden",s:"få sekunder",m:"et minut",mm:"%d minutter",h:"en time",hh:"%d timer",d:"en dag",dd:"%d dage",M:"en måned",MM:"%d måneder",y:"et år",yy:"%d år"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),nf.defineLocale("de-at",{months:"Jänner_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),monthsShort:"Jän._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),weekdays:"Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),weekdaysShort:"So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),weekdaysMin:"So_Mo_Di_Mi_Do_Fr_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[Heute um] LT [Uhr]",sameElse:"L",nextDay:"[Morgen um] LT [Uhr]",nextWeek:"dddd [um] LT [Uhr]",lastDay:"[Gestern um] LT [Uhr]",lastWeek:"[letzten] dddd [um] LT [Uhr]"},relativeTime:{future:"in %s",past:"vor %s",s:"ein paar Sekunden",m:Pc,mm:"%d Minuten",h:Pc,hh:"%d Stunden",d:Pc,dd:Pc,M:Pc,MM:Pc,y:Pc,yy:Pc},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),nf.defineLocale("de",{months:"Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),monthsShort:"Jan._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),weekdays:"Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),weekdaysShort:"So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),weekdaysMin:"So_Mo_Di_Mi_Do_Fr_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[Heute um] LT [Uhr]",sameElse:"L",nextDay:"[Morgen um] LT [Uhr]",nextWeek:"dddd [um] LT [Uhr]",lastDay:"[Gestern um] LT [Uhr]",lastWeek:"[letzten] dddd [um] LT [Uhr]"},relativeTime:{future:"in %s",past:"vor %s",s:"ein paar Sekunden",m:Qc,mm:"%d Minuten",h:Qc,hh:"%d Stunden",d:Qc,dd:Qc,M:Qc,MM:Qc,y:Qc,yy:Qc},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),nf.defineLocale("el",{monthsNominativeEl:"Ιανουάριος_Φεβρουάριος_Μάρτιος_Απρίλιος_Μάιος_Ιούνιος_Ιούλιος_Αύγουστος_Σεπτέμβριος_Οκτώβριος_Νοέμβριος_Δεκέμβριος".split("_"),monthsGenitiveEl:"Ιανουαρίου_Φεβρουαρίου_Μαρτίου_Απριλίου_Μαΐου_Ιουνίου_Ιουλίου_Αυγούστου_Σεπτεμβρίου_Οκτωβρίου_Νοεμβρίου_Δεκεμβρίου".split("_"),months:function(a,b){return/D/.test(b.substring(0,b.indexOf("MMMM")))?this._monthsGenitiveEl[a.month()]:this._monthsNominativeEl[a.month()]},monthsShort:"Ιαν_Φεβ_Μαρ_Απρ_Μαϊ_Ιουν_Ιουλ_Αυγ_Σεπ_Οκτ_Νοε_Δεκ".split("_"),weekdays:"Κυριακή_Δευτέρα_Τρίτη_Τετάρτη_Πέμπτη_Παρασκευή_Σάββατο".split("_"),weekdaysShort:"Κυρ_Δευ_Τρι_Τετ_Πεμ_Παρ_Σαβ".split("_"),weekdaysMin:"Κυ_Δε_Τρ_Τε_Πε_Πα_Σα".split("_"),meridiem:function(a,b,c){return a>11?c?"μμ":"ΜΜ":c?"πμ":"ΠΜ"},isPM:function(a){return"μ"===(a+"").toLowerCase()[0]},meridiemParse:/[ΠΜ]\.?Μ?\.?/i,longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendarEl:{sameDay:"[Σήμερα {}] LT",nextDay:"[Αύριο {}] LT",nextWeek:"dddd [{}] LT",lastDay:"[Χθες {}] LT",lastWeek:function(){switch(this.day()){case 6:return"[το προηγούμενο] dddd [{}] LT";default:return"[την προηγούμενη] dddd [{}] LT"}},sameElse:"L"},calendar:function(a,b){var c=this._calendarEl[a],d=b&&b.hours();return"function"==typeof c&&(c=c.apply(b)),c.replace("{}",d%12===1?"στη":"στις")},relativeTime:{future:"σε %s",past:"%s πριν",s:"λίγα δευτερόλεπτα",m:"ένα λεπτό",mm:"%d λεπτά",h:"μία ώρα",hh:"%d ώρες",d:"μία μέρα",dd:"%d μέρες",M:"ένας μήνας",MM:"%d μήνες",y:"ένας χρόνος",yy:"%d χρόνια"},ordinalParse:/\d{1,2}η/,ordinal:"%dη",week:{dow:1,doy:4}}),nf.defineLocale("en-au",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},ordinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(a){var b=a%10,c=1===~~(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c},week:{dow:1,doy:4}}),nf.defineLocale("en-ca",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"YYYY-MM-DD",LL:"D MMMM, YYYY",LLL:"D MMMM, YYYY LT",LLLL:"dddd, D MMMM, YYYY LT"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},ordinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(a){var b=a%10,c=1===~~(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c}}),nf.defineLocale("en-gb",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},ordinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(a){var b=a%10,c=1===~~(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c},week:{dow:1,doy:4}}),nf.defineLocale("eo",{months:"januaro_februaro_marto_aprilo_majo_junio_julio_aŭgusto_septembro_oktobro_novembro_decembro".split("_"),monthsShort:"jan_feb_mar_apr_maj_jun_jul_aŭg_sep_okt_nov_dec".split("_"),weekdays:"Dimanĉo_Lundo_Mardo_Merkredo_Ĵaŭdo_Vendredo_Sabato".split("_"),weekdaysShort:"Dim_Lun_Mard_Merk_Ĵaŭ_Ven_Sab".split("_"),weekdaysMin:"Di_Lu_Ma_Me_Ĵa_Ve_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"YYYY-MM-DD",LL:"D[-an de] MMMM, YYYY",LLL:"D[-an de] MMMM, YYYY LT",LLLL:"dddd, [la] D[-an de] MMMM, YYYY LT"},meridiemParse:/[ap]\.t\.m/i,isPM:function(a){return"p"===a.charAt(0).toLowerCase()},meridiem:function(a,b,c){return a>11?c?"p.t.m.":"P.T.M.":c?"a.t.m.":"A.T.M."},calendar:{sameDay:"[Hodiaŭ je] LT",nextDay:"[Morgaŭ je] LT",nextWeek:"dddd [je] LT",lastDay:"[Hieraŭ je] LT",lastWeek:"[pasinta] dddd [je] LT",sameElse:"L"},relativeTime:{future:"je %s",past:"antaŭ %s",s:"sekundoj",m:"minuto",mm:"%d minutoj",h:"horo",hh:"%d horoj",d:"tago",dd:"%d tagoj",M:"monato",MM:"%d monatoj",y:"jaro",yy:"%d jaroj"},ordinalParse:/\d{1,2}a/,ordinal:"%da",week:{dow:1,doy:7}}),"Ene._Feb._Mar._Abr._May._Jun._Jul._Ago._Sep._Oct._Nov._Dic.".split("_")),Ef="Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic".split("_"),Ff=(nf.defineLocale("es",{months:"Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split("_"),monthsShort:function(a,b){return/-MMM-/.test(b)?Ef[a.month()]:Df[a.month()]},weekdays:"Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado".split("_"),weekdaysShort:"Dom._Lun._Mar._Mié._Jue._Vie._Sáb.".split("_"),weekdaysMin:"Do_Lu_Ma_Mi_Ju_Vi_Sá".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY LT",LLLL:"dddd, D [de] MMMM [de] YYYY LT"},calendar:{sameDay:function(){return"[hoy a la"+(1!==this.hours()?"s":"")+"] LT"},nextDay:function(){return"[mañana a la"+(1!==this.hours()?"s":"")+"] LT"},nextWeek:function(){return"dddd [a la"+(1!==this.hours()?"s":"")+"] LT"},lastDay:function(){return"[ayer a la"+(1!==this.hours()?"s":"")+"] LT"},lastWeek:function(){return"[el] dddd [pasado a la"+(1!==this.hours()?"s":"")+"] LT"},sameElse:"L"},relativeTime:{future:"en %s",past:"hace %s",s:"unos segundos",m:"un minuto",mm:"%d minutos",h:"una hora",hh:"%d horas",d:"un día",dd:"%d días",M:"un mes",MM:"%d meses",y:"un año",yy:"%d años"},ordinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:4}}),nf.defineLocale("et",{months:"jaanuar_veebruar_märts_aprill_mai_juuni_juuli_august_september_oktoober_november_detsember".split("_"),monthsShort:"jaan_veebr_märts_apr_mai_juuni_juuli_aug_sept_okt_nov_dets".split("_"),weekdays:"pühapäev_esmaspäev_teisipäev_kolmapäev_neljapäev_reede_laupäev".split("_"),weekdaysShort:"P_E_T_K_N_R_L".split("_"),weekdaysMin:"P_E_T_K_N_R_L".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[Täna,] LT",nextDay:"[Homme,] LT",nextWeek:"[Järgmine] dddd LT",lastDay:"[Eile,] LT",lastWeek:"[Eelmine] dddd LT",sameElse:"L"},relativeTime:{future:"%s pärast",past:"%s tagasi",s:Rc,m:Rc,mm:Rc,h:Rc,hh:Rc,d:Rc,dd:"%d päeva",M:Rc,MM:Rc,y:Rc,yy:Rc},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),nf.defineLocale("eu",{months:"urtarrila_otsaila_martxoa_apirila_maiatza_ekaina_uztaila_abuztua_iraila_urria_azaroa_abendua".split("_"),monthsShort:"urt._ots._mar._api._mai._eka._uzt._abu._ira._urr._aza._abe.".split("_"),weekdays:"igandea_astelehena_asteartea_asteazkena_osteguna_ostirala_larunbata".split("_"),weekdaysShort:"ig._al._ar._az._og._ol._lr.".split("_"),weekdaysMin:"ig_al_ar_az_og_ol_lr".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"YYYY-MM-DD",LL:"YYYY[ko] MMMM[ren] D[a]",LLL:"YYYY[ko] MMMM[ren] D[a] LT",LLLL:"dddd, YYYY[ko] MMMM[ren] D[a] LT",l:"YYYY-M-D",ll:"YYYY[ko] MMM D[a]",lll:"YYYY[ko] MMM D[a] LT",llll:"ddd, YYYY[ko] MMM D[a] LT"},calendar:{sameDay:"[gaur] LT[etan]",nextDay:"[bihar] LT[etan]",nextWeek:"dddd LT[etan]",lastDay:"[atzo] LT[etan]",lastWeek:"[aurreko] dddd LT[etan]",sameElse:"L"},relativeTime:{future:"%s barru",past:"duela %s",s:"segundo batzuk",m:"minutu bat",mm:"%d minutu",h:"ordu bat",hh:"%d ordu",d:"egun bat",
        dd:"%d egun",M:"hilabete bat",MM:"%d hilabete",y:"urte bat",yy:"%d urte"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),{1:"۱",2:"۲",3:"۳",4:"۴",5:"۵",6:"۶",7:"۷",8:"۸",9:"۹",0:"۰"}),Gf={"۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9","۰":"0"},Hf=(nf.defineLocale("fa",{months:"ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر".split("_"),monthsShort:"ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر".split("_"),weekdays:"یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه".split("_"),weekdaysShort:"یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه".split("_"),weekdaysMin:"ی_د_س_چ_پ_ج_ش".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},meridiemParse:/قبل از ظهر|بعد از ظهر/,isPM:function(a){return/بعد از ظهر/.test(a)},meridiem:function(a,b,c){return 12>a?"قبل از ظهر":"بعد از ظهر"},calendar:{sameDay:"[امروز ساعت] LT",nextDay:"[فردا ساعت] LT",nextWeek:"dddd [ساعت] LT",lastDay:"[دیروز ساعت] LT",lastWeek:"dddd [پیش] [ساعت] LT",sameElse:"L"},relativeTime:{future:"در %s",past:"%s پیش",s:"چندین ثانیه",m:"یک دقیقه",mm:"%d دقیقه",h:"یک ساعت",hh:"%d ساعت",d:"یک روز",dd:"%d روز",M:"یک ماه",MM:"%d ماه",y:"یک سال",yy:"%d سال"},preparse:function(a){return a.replace(/[۰-۹]/g,function(a){return Gf[a]}).replace(/،/g,",")},postformat:function(a){return a.replace(/\d/g,function(a){return Ff[a]}).replace(/,/g,"،")},ordinalParse:/\d{1,2}م/,ordinal:"%dم",week:{dow:6,doy:12}}),"nolla yksi kaksi kolme neljä viisi kuusi seitsemän kahdeksan yhdeksän".split(" ")),If=["nolla","yhden","kahden","kolmen","neljän","viiden","kuuden",Hf[7],Hf[8],Hf[9]],Jf=(nf.defineLocale("fi",{months:"tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu".split("_"),monthsShort:"tammi_helmi_maalis_huhti_touko_kesä_heinä_elo_syys_loka_marras_joulu".split("_"),weekdays:"sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai".split("_"),weekdaysShort:"su_ma_ti_ke_to_pe_la".split("_"),weekdaysMin:"su_ma_ti_ke_to_pe_la".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD.MM.YYYY",LL:"Do MMMM[ta] YYYY",LLL:"Do MMMM[ta] YYYY, [klo] LT",LLLL:"dddd, Do MMMM[ta] YYYY, [klo] LT",l:"D.M.YYYY",ll:"Do MMM YYYY",lll:"Do MMM YYYY, [klo] LT",llll:"ddd, Do MMM YYYY, [klo] LT"},calendar:{sameDay:"[tänään] [klo] LT",nextDay:"[huomenna] [klo] LT",nextWeek:"dddd [klo] LT",lastDay:"[eilen] [klo] LT",lastWeek:"[viime] dddd[na] [klo] LT",sameElse:"L"},relativeTime:{future:"%s päästä",past:"%s sitten",s:Sc,m:Sc,mm:Sc,h:Sc,hh:Sc,d:Sc,dd:Sc,M:Sc,MM:Sc,y:Sc,yy:Sc},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),nf.defineLocale("fo",{months:"januar_februar_mars_apríl_mai_juni_juli_august_september_oktober_november_desember".split("_"),monthsShort:"jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),weekdays:"sunnudagur_mánadagur_týsdagur_mikudagur_hósdagur_fríggjadagur_leygardagur".split("_"),weekdaysShort:"sun_mán_týs_mik_hós_frí_ley".split("_"),weekdaysMin:"su_má_tý_mi_hó_fr_le".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D. MMMM, YYYY LT"},calendar:{sameDay:"[Í dag kl.] LT",nextDay:"[Í morgin kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[Í gjár kl.] LT",lastWeek:"[síðstu] dddd [kl] LT",sameElse:"L"},relativeTime:{future:"um %s",past:"%s síðani",s:"fá sekund",m:"ein minutt",mm:"%d minuttir",h:"ein tími",hh:"%d tímar",d:"ein dagur",dd:"%d dagar",M:"ein mánaði",MM:"%d mánaðir",y:"eitt ár",yy:"%d ár"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),nf.defineLocale("fr-ca",{months:"janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),monthsShort:"janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),weekdays:"dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),weekdaysShort:"dim._lun._mar._mer._jeu._ven._sam.".split("_"),weekdaysMin:"Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"YYYY-MM-DD",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[Aujourd'hui à] LT",nextDay:"[Demain à] LT",nextWeek:"dddd [à] LT",lastDay:"[Hier à] LT",lastWeek:"dddd [dernier à] LT",sameElse:"L"},relativeTime:{future:"dans %s",past:"il y a %s",s:"quelques secondes",m:"une minute",mm:"%d minutes",h:"une heure",hh:"%d heures",d:"un jour",dd:"%d jours",M:"un mois",MM:"%d mois",y:"un an",yy:"%d ans"},ordinalParse:/\d{1,2}(er|)/,ordinal:function(a){return a+(1===a?"er":"")}}),nf.defineLocale("fr",{months:"janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),monthsShort:"janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),weekdays:"dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),weekdaysShort:"dim._lun._mar._mer._jeu._ven._sam.".split("_"),weekdaysMin:"Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[Aujourd'hui à] LT",nextDay:"[Demain à] LT",nextWeek:"dddd [à] LT",lastDay:"[Hier à] LT",lastWeek:"dddd [dernier à] LT",sameElse:"L"},relativeTime:{future:"dans %s",past:"il y a %s",s:"quelques secondes",m:"une minute",mm:"%d minutes",h:"une heure",hh:"%d heures",d:"un jour",dd:"%d jours",M:"un mois",MM:"%d mois",y:"un an",yy:"%d ans"},ordinalParse:/\d{1,2}(er|)/,ordinal:function(a){return a+(1===a?"er":"")},week:{dow:1,doy:4}}),"jan._feb._mrt._apr._mai_jun._jul._aug._sep._okt._nov._des.".split("_")),Kf="jan_feb_mrt_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),Lf=(nf.defineLocale("fy",{months:"jannewaris_febrewaris_maart_april_maaie_juny_july_augustus_septimber_oktober_novimber_desimber".split("_"),monthsShort:function(a,b){return/-MMM-/.test(b)?Kf[a.month()]:Jf[a.month()]},weekdays:"snein_moandei_tiisdei_woansdei_tongersdei_freed_sneon".split("_"),weekdaysShort:"si._mo._ti._wo._to._fr._so.".split("_"),weekdaysMin:"Si_Mo_Ti_Wo_To_Fr_So".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD-MM-YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[hjoed om] LT",nextDay:"[moarn om] LT",nextWeek:"dddd [om] LT",lastDay:"[juster om] LT",lastWeek:"[ôfrûne] dddd [om] LT",sameElse:"L"},relativeTime:{future:"oer %s",past:"%s lyn",s:"in pear sekonden",m:"ien minút",mm:"%d minuten",h:"ien oere",hh:"%d oeren",d:"ien dei",dd:"%d dagen",M:"ien moanne",MM:"%d moannen",y:"ien jier",yy:"%d jierren"},ordinalParse:/\d{1,2}(ste|de)/,ordinal:function(a){return a+(1===a||8===a||a>=20?"ste":"de")},week:{dow:1,doy:4}}),nf.defineLocale("gl",{months:"Xaneiro_Febreiro_Marzo_Abril_Maio_Xuño_Xullo_Agosto_Setembro_Outubro_Novembro_Decembro".split("_"),monthsShort:"Xan._Feb._Mar._Abr._Mai._Xuñ._Xul._Ago._Set._Out._Nov._Dec.".split("_"),weekdays:"Domingo_Luns_Martes_Mércores_Xoves_Venres_Sábado".split("_"),weekdaysShort:"Dom._Lun._Mar._Mér._Xov._Ven._Sáb.".split("_"),weekdaysMin:"Do_Lu_Ma_Mé_Xo_Ve_Sá".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:function(){return"[hoxe "+(1!==this.hours()?"ás":"á")+"] LT"},nextDay:function(){return"[mañá "+(1!==this.hours()?"ás":"á")+"] LT"},nextWeek:function(){return"dddd ["+(1!==this.hours()?"ás":"a")+"] LT"},lastDay:function(){return"[onte "+(1!==this.hours()?"á":"a")+"] LT"},lastWeek:function(){return"[o] dddd [pasado "+(1!==this.hours()?"ás":"a")+"] LT"},sameElse:"L"},relativeTime:{future:function(a){return"uns segundos"===a?"nuns segundos":"en "+a},past:"hai %s",s:"uns segundos",m:"un minuto",mm:"%d minutos",h:"unha hora",hh:"%d horas",d:"un día",dd:"%d días",M:"un mes",MM:"%d meses",y:"un ano",yy:"%d anos"},ordinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:7}}),nf.defineLocale("he",{months:"ינואר_פברואר_מרץ_אפריל_מאי_יוני_יולי_אוגוסט_ספטמבר_אוקטובר_נובמבר_דצמבר".split("_"),monthsShort:"ינו׳_פבר׳_מרץ_אפר׳_מאי_יוני_יולי_אוג׳_ספט׳_אוק׳_נוב׳_דצמ׳".split("_"),weekdays:"ראשון_שני_שלישי_רביעי_חמישי_שישי_שבת".split("_"),weekdaysShort:"א׳_ב׳_ג׳_ד׳_ה׳_ו׳_ש׳".split("_"),weekdaysMin:"א_ב_ג_ד_ה_ו_ש".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D [ב]MMMM YYYY",LLL:"D [ב]MMMM YYYY LT",LLLL:"dddd, D [ב]MMMM YYYY LT",l:"D/M/YYYY",ll:"D MMM YYYY",lll:"D MMM YYYY LT",llll:"ddd, D MMM YYYY LT"},calendar:{sameDay:"[היום ב־]LT",nextDay:"[מחר ב־]LT",nextWeek:"dddd [בשעה] LT",lastDay:"[אתמול ב־]LT",lastWeek:"[ביום] dddd [האחרון בשעה] LT",sameElse:"L"},relativeTime:{future:"בעוד %s",past:"לפני %s",s:"מספר שניות",m:"דקה",mm:"%d דקות",h:"שעה",hh:function(a){return 2===a?"שעתיים":a+" שעות"},d:"יום",dd:function(a){return 2===a?"יומיים":a+" ימים"},M:"חודש",MM:function(a){return 2===a?"חודשיים":a+" חודשים"},y:"שנה",yy:function(a){return 2===a?"שנתיים":a%10===0&&10!==a?a+" שנה":a+" שנים"}}}),{1:"१",2:"२",3:"३",4:"४",5:"५",6:"६",7:"७",8:"८",9:"९",0:"०"}),Mf={"१":"1","२":"2","३":"3","४":"4","५":"5","६":"6","७":"7","८":"8","९":"9","०":"0"},Nf=(nf.defineLocale("hi",{months:"जनवरी_फ़रवरी_मार्च_अप्रैल_मई_जून_जुलाई_अगस्त_सितम्बर_अक्टूबर_नवम्बर_दिसम्बर".split("_"),monthsShort:"जन._फ़र._मार्च_अप्रै._मई_जून_जुल._अग._सित._अक्टू._नव._दिस.".split("_"),weekdays:"रविवार_सोमवार_मंगलवार_बुधवार_गुरूवार_शुक्रवार_शनिवार".split("_"),weekdaysShort:"रवि_सोम_मंगल_बुध_गुरू_शुक्र_शनि".split("_"),weekdaysMin:"र_सो_मं_बु_गु_शु_श".split("_"),longDateFormat:{LT:"A h:mm बजे",LTS:"A h:mm:ss बजे",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, LT",LLLL:"dddd, D MMMM YYYY, LT"},calendar:{sameDay:"[आज] LT",nextDay:"[कल] LT",nextWeek:"dddd, LT",lastDay:"[कल] LT",lastWeek:"[पिछले] dddd, LT",sameElse:"L"},relativeTime:{future:"%s में",past:"%s पहले",s:"कुछ ही क्षण",m:"एक मिनट",mm:"%d मिनट",h:"एक घंटा",hh:"%d घंटे",d:"एक दिन",dd:"%d दिन",M:"एक महीने",MM:"%d महीने",y:"एक वर्ष",yy:"%d वर्ष"},preparse:function(a){return a.replace(/[१२३४५६७८९०]/g,function(a){return Mf[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return Lf[a]})},meridiemParse:/रात|सुबह|दोपहर|शाम/,meridiemHour:function(a,b){return 12===a&&(a=0),"रात"===b?4>a?a:a+12:"सुबह"===b?a:"दोपहर"===b?a>=10?a:a+12:"शाम"===b?a+12:void 0},meridiem:function(a,b,c){return 4>a?"रात":10>a?"सुबह":17>a?"दोपहर":20>a?"शाम":"रात"},week:{dow:0,doy:6}}),nf.defineLocale("hr",{months:"siječanj_veljača_ožujak_travanj_svibanj_lipanj_srpanj_kolovoz_rujan_listopad_studeni_prosinac".split("_"),monthsShort:"sij._velj._ožu._tra._svi._lip._srp._kol._ruj._lis._stu._pro.".split("_"),weekdays:"nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split("_"),weekdaysShort:"ned._pon._uto._sri._čet._pet._sub.".split("_"),weekdaysMin:"ne_po_ut_sr_če_pe_su".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[danas u] LT",nextDay:"[sutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedjelju] [u] LT";case 3:return"[u] [srijedu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[jučer u] LT",lastWeek:function(){switch(this.day()){case 0:case 3:return"[prošlu] dddd [u] LT";case 6:return"[prošle] [subote] [u] LT";case 1:case 2:case 4:case 5:return"[prošli] dddd [u] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"prije %s",s:"par sekundi",m:Uc,mm:Uc,h:Uc,hh:Uc,d:"dan",dd:Uc,M:"mjesec",MM:Uc,y:"godinu",yy:Uc},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),"vasárnap hétfőn kedden szerdán csütörtökön pénteken szombaton".split(" ")),Of=(nf.defineLocale("hu",{months:"január_február_március_április_május_június_július_augusztus_szeptember_október_november_december".split("_"),monthsShort:"jan_feb_márc_ápr_máj_jún_júl_aug_szept_okt_nov_dec".split("_"),weekdays:"vasárnap_hétfő_kedd_szerda_csütörtök_péntek_szombat".split("_"),weekdaysShort:"vas_hét_kedd_sze_csüt_pén_szo".split("_"),weekdaysMin:"v_h_k_sze_cs_p_szo".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"YYYY.MM.DD.",LL:"YYYY. MMMM D.",LLL:"YYYY. MMMM D., LT",LLLL:"YYYY. MMMM D., dddd LT"},meridiemParse:/de|du/i,isPM:function(a){return"u"===a.charAt(1).toLowerCase()},meridiem:function(a,b,c){return 12>a?c===!0?"de":"DE":c===!0?"du":"DU"},calendar:{sameDay:"[ma] LT[-kor]",nextDay:"[holnap] LT[-kor]",nextWeek:function(){return Wc.call(this,!0)},lastDay:"[tegnap] LT[-kor]",lastWeek:function(){return Wc.call(this,!1)},sameElse:"L"},relativeTime:{future:"%s múlva",past:"%s",s:Vc,m:Vc,mm:Vc,h:Vc,hh:Vc,d:Vc,dd:Vc,M:Vc,MM:Vc,y:Vc,yy:Vc},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),nf.defineLocale("hy-am",{months:Xc,monthsShort:Yc,weekdays:Zc,weekdaysShort:"կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ".split("_"),weekdaysMin:"կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY թ.",LLL:"D MMMM YYYY թ., LT",LLLL:"dddd, D MMMM YYYY թ., LT"},calendar:{sameDay:"[այսօր] LT",nextDay:"[վաղը] LT",lastDay:"[երեկ] LT",nextWeek:function(){return"dddd [օրը ժամը] LT"},lastWeek:function(){return"[անցած] dddd [օրը ժամը] LT"},sameElse:"L"},relativeTime:{future:"%s հետո",past:"%s առաջ",s:"մի քանի վայրկյան",m:"րոպե",mm:"%d րոպե",h:"ժամ",hh:"%d ժամ",d:"օր",dd:"%d օր",M:"ամիս",MM:"%d ամիս",y:"տարի",yy:"%d տարի"},meridiemParse:/գիշերվա|առավոտվա|ցերեկվա|երեկոյան/,isPM:function(a){return/^(ցերեկվա|երեկոյան)$/.test(a)},meridiem:function(a){return 4>a?"գիշերվա":12>a?"առավոտվա":17>a?"ցերեկվա":"երեկոյան"},ordinalParse:/\d{1,2}|\d{1,2}-(ին|րդ)/,ordinal:function(a,b){switch(b){case"DDD":case"w":case"W":case"DDDo":return 1===a?a+"-ին":a+"-րդ";default:return a}},week:{dow:1,doy:7}}),nf.defineLocale("id",{months:"Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember".split("_"),monthsShort:"Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nov_Des".split("_"),weekdays:"Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu".split("_"),weekdaysShort:"Min_Sen_Sel_Rab_Kam_Jum_Sab".split("_"),weekdaysMin:"Mg_Sn_Sl_Rb_Km_Jm_Sb".split("_"),longDateFormat:{LT:"HH.mm",LTS:"LT.ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [pukul] LT",LLLL:"dddd, D MMMM YYYY [pukul] LT"},meridiemParse:/pagi|siang|sore|malam/,meridiemHour:function(a,b){return 12===a&&(a=0),"pagi"===b?a:"siang"===b?a>=11?a:a+12:"sore"===b||"malam"===b?a+12:void 0},meridiem:function(a,b,c){return 11>a?"pagi":15>a?"siang":19>a?"sore":"malam"},calendar:{sameDay:"[Hari ini pukul] LT",nextDay:"[Besok pukul] LT",nextWeek:"dddd [pukul] LT",lastDay:"[Kemarin pukul] LT",lastWeek:"dddd [lalu pukul] LT",sameElse:"L"},relativeTime:{future:"dalam %s",past:"%s yang lalu",s:"beberapa detik",m:"semenit",mm:"%d menit",h:"sejam",hh:"%d jam",d:"sehari",dd:"%d hari",M:"sebulan",MM:"%d bulan",y:"setahun",yy:"%d tahun"},week:{dow:1,doy:7}}),nf.defineLocale("is",{months:"janúar_febrúar_mars_apríl_maí_júní_júlí_ágúst_september_október_nóvember_desember".split("_"),monthsShort:"jan_feb_mar_apr_maí_jún_júl_ágú_sep_okt_nóv_des".split("_"),weekdays:"sunnudagur_mánudagur_þriðjudagur_miðvikudagur_fimmtudagur_föstudagur_laugardagur".split("_"),weekdaysShort:"sun_mán_þri_mið_fim_fös_lau".split("_"),weekdaysMin:"Su_Má_Þr_Mi_Fi_Fö_La".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY [kl.] LT",LLLL:"dddd, D. MMMM YYYY [kl.] LT"},calendar:{sameDay:"[í dag kl.] LT",nextDay:"[á morgun kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[í gær kl.] LT",lastWeek:"[síðasta] dddd [kl.] LT",sameElse:"L"},relativeTime:{future:"eftir %s",past:"fyrir %s síðan",s:_c,m:_c,mm:_c,h:"klukkustund",hh:_c,d:_c,dd:_c,M:_c,MM:_c,y:_c,yy:_c},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),nf.defineLocale("it",{months:"gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre".split("_"),monthsShort:"gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic".split("_"),weekdays:"Domenica_Lunedì_Martedì_Mercoledì_Giovedì_Venerdì_Sabato".split("_"),weekdaysShort:"Dom_Lun_Mar_Mer_Gio_Ven_Sab".split("_"),weekdaysMin:"D_L_Ma_Me_G_V_S".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Oggi alle] LT",nextDay:"[Domani alle] LT",nextWeek:"dddd [alle] LT",lastDay:"[Ieri alle] LT",lastWeek:function(){switch(this.day()){case 0:return"[la scorsa] dddd [alle] LT";default:return"[lo scorso] dddd [alle] LT"}},sameElse:"L"},relativeTime:{future:function(a){return(/^[0-9].+$/.test(a)?"tra":"in")+" "+a},past:"%s fa",s:"alcuni secondi",m:"un minuto",mm:"%d minuti",h:"un'ora",hh:"%d ore",d:"un giorno",dd:"%d giorni",M:"un mese",MM:"%d mesi",y:"un anno",yy:"%d anni"},ordinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:4}}),nf.defineLocale("ja",{months:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),weekdays:"日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日".split("_"),weekdaysShort:"日_月_火_水_木_金_土".split("_"),weekdaysMin:"日_月_火_水_木_金_土".split("_"),longDateFormat:{LT:"Ah時m分",LTS:"LTs秒",L:"YYYY/MM/DD",LL:"YYYY年M月D日",LLL:"YYYY年M月D日LT",LLLL:"YYYY年M月D日LT dddd"},meridiemParse:/午前|午後/i,isPM:function(a){return"午後"===a},meridiem:function(a,b,c){return 12>a?"午前":"午後"},calendar:{sameDay:"[今日] LT",nextDay:"[明日] LT",nextWeek:"[来週]dddd LT",lastDay:"[昨日] LT",lastWeek:"[前週]dddd LT",sameElse:"L"},relativeTime:{future:"%s後",past:"%s前",s:"数秒",m:"1分",mm:"%d分",h:"1時間",hh:"%d時間",d:"1日",dd:"%d日",M:"1ヶ月",MM:"%dヶ月",y:"1年",yy:"%d年"}}),nf.defineLocale("jv",{months:"Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_Nopember_Desember".split("_"),monthsShort:"Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nop_Des".split("_"),weekdays:"Minggu_Senen_Seloso_Rebu_Kemis_Jemuwah_Septu".split("_"),weekdaysShort:"Min_Sen_Sel_Reb_Kem_Jem_Sep".split("_"),weekdaysMin:"Mg_Sn_Sl_Rb_Km_Jm_Sp".split("_"),longDateFormat:{LT:"HH.mm",LTS:"LT.ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [pukul] LT",LLLL:"dddd, D MMMM YYYY [pukul] LT"},meridiemParse:/enjing|siyang|sonten|ndalu/,meridiemHour:function(a,b){return 12===a&&(a=0),"enjing"===b?a:"siyang"===b?a>=11?a:a+12:"sonten"===b||"ndalu"===b?a+12:void 0},meridiem:function(a,b,c){return 11>a?"enjing":15>a?"siyang":19>a?"sonten":"ndalu"},calendar:{sameDay:"[Dinten puniko pukul] LT",nextDay:"[Mbenjang pukul] LT",nextWeek:"dddd [pukul] LT",lastDay:"[Kala wingi pukul] LT",lastWeek:"dddd [kepengker pukul] LT",sameElse:"L"},relativeTime:{future:"wonten ing %s",past:"%s ingkang kepengker",s:"sawetawis detik",m:"setunggal menit",mm:"%d menit",h:"setunggal jam",hh:"%d jam",d:"sedinten",dd:"%d dinten",M:"sewulan",MM:"%d wulan",y:"setaun",yy:"%d taun"},week:{dow:1,doy:7}}),nf.defineLocale("ka",{months:ad,monthsShort:"იან_თებ_მარ_აპრ_მაი_ივნ_ივლ_აგვ_სექ_ოქტ_ნოე_დეკ".split("_"),weekdays:bd,weekdaysShort:"კვი_ორშ_სამ_ოთხ_ხუთ_პარ_შაბ".split("_"),weekdaysMin:"კვ_ორ_სა_ოთ_ხუ_პა_შა".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[დღეს] LT[-ზე]",nextDay:"[ხვალ] LT[-ზე]",lastDay:"[გუშინ] LT[-ზე]",nextWeek:"[შემდეგ] dddd LT[-ზე]",lastWeek:"[წინა] dddd LT-ზე",sameElse:"L"},relativeTime:{future:function(a){return/(წამი|წუთი|საათი|წელი)/.test(a)?a.replace(/ი$/,"ში"):a+"ში"},past:function(a){return/(წამი|წუთი|საათი|დღე|თვე)/.test(a)?a.replace(/(ი|ე)$/,"ის წინ"):/წელი/.test(a)?a.replace(/წელი$/,"წლის წინ"):void 0},s:"რამდენიმე წამი",m:"წუთი",mm:"%d წუთი",h:"საათი",hh:"%d საათი",d:"დღე",dd:"%d დღე",M:"თვე",MM:"%d თვე",y:"წელი",yy:"%d წელი"},ordinalParse:/0|1-ლი|მე-\d{1,2}|\d{1,2}-ე/,ordinal:function(a){return 0===a?a:1===a?a+"-ლი":20>a||100>=a&&a%20===0||a%100===0?"მე-"+a:a+"-ე"},week:{dow:1,doy:7}}),nf.defineLocale("km",{months:"មករា_កុម្ភៈ_មិនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ".split("_"),monthsShort:"មករា_កុម្ភៈ_មិនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ".split("_"),weekdays:"អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),weekdaysShort:"អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),weekdaysMin:"អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[ថ្ងៃនៈ ម៉ោង] LT",nextDay:"[ស្អែក ម៉ោង] LT",nextWeek:"dddd [ម៉ោង] LT",lastDay:"[ម្សិលមិញ ម៉ោង] LT",lastWeek:"dddd [សប្តាហ៍មុន] [ម៉ោង] LT",sameElse:"L"},relativeTime:{future:"%sទៀត",past:"%sមុន",s:"ប៉ុន្មានវិនាទី",m:"មួយនាទី",mm:"%d នាទី",h:"មួយម៉ោង",hh:"%d ម៉ោង",d:"មួយថ្ងៃ",dd:"%d ថ្ងៃ",M:"មួយខែ",MM:"%d ខែ",y:"មួយឆ្នាំ",yy:"%d ឆ្នាំ"},week:{dow:1,doy:4}}),nf.defineLocale("ko",{months:"1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),monthsShort:"1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),weekdays:"일요일_월요일_화요일_수요일_목요일_금요일_토요일".split("_"),weekdaysShort:"일_월_화_수_목_금_토".split("_"),weekdaysMin:"일_월_화_수_목_금_토".split("_"),longDateFormat:{LT:"A h시 m분",LTS:"A h시 m분 s초",L:"YYYY.MM.DD",LL:"YYYY년 MMMM D일",LLL:"YYYY년 MMMM D일 LT",LLLL:"YYYY년 MMMM D일 dddd LT"},calendar:{sameDay:"오늘 LT",nextDay:"내일 LT",nextWeek:"dddd LT",lastDay:"어제 LT",lastWeek:"지난주 dddd LT",sameElse:"L"},relativeTime:{future:"%s 후",past:"%s 전",s:"몇초",ss:"%d초",m:"일분",mm:"%d분",h:"한시간",hh:"%d시간",d:"하루",dd:"%d일",M:"한달",MM:"%d달",y:"일년",yy:"%d년"},ordinalParse:/\d{1,2}일/,ordinal:"%d일",meridiemParse:/오전|오후/,isPM:function(a){return"오후"===a},meridiem:function(a,b,c){return 12>a?"오전":"오후"}}),nf.defineLocale("lb",{months:"Januar_Februar_Mäerz_Abrëll_Mee_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),monthsShort:"Jan._Febr._Mrz._Abr._Mee_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),weekdays:"Sonndeg_Méindeg_Dënschdeg_Mëttwoch_Donneschdeg_Freideg_Samschdeg".split("_"),weekdaysShort:"So._Mé._Dë._Më._Do._Fr._Sa.".split("_"),weekdaysMin:"So_Mé_Dë_Më_Do_Fr_Sa".split("_"),longDateFormat:{LT:"H:mm [Auer]",LTS:"H:mm:ss [Auer]",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[Haut um] LT",sameElse:"L",nextDay:"[Muer um] LT",nextWeek:"dddd [um] LT",lastDay:"[Gëschter um] LT",lastWeek:function(){switch(this.day()){case 2:case 4:return"[Leschten] dddd [um] LT";default:return"[Leschte] dddd [um] LT"}}},relativeTime:{future:dd,past:ed,s:"e puer Sekonnen",m:cd,mm:"%d Minutten",h:cd,hh:"%d Stonnen",d:cd,dd:"%d Deeg",M:cd,MM:"%d Méint",y:cd,yy:"%d Joer"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),{m:"minutė_minutės_minutę",mm:"minutės_minučių_minutes",h:"valanda_valandos_valandą",hh:"valandos_valandų_valandas",d:"diena_dienos_dieną",dd:"dienos_dienų_dienas",M:"mėnuo_mėnesio_mėnesį",MM:"mėnesiai_mėnesių_mėnesius",y:"metai_metų_metus",yy:"metai_metų_metus"}),Pf="sekmadienis_pirmadienis_antradienis_trečiadienis_ketvirtadienis_penktadienis_šeštadienis".split("_"),Qf=(nf.defineLocale("lt",{months:"sausio_vasario_kovo_balandžio_gegužės_birželio_liepos_rugpjūčio_rugsėjo_spalio_lapkričio_gruodžio".split("_"),monthsShort:"sau_vas_kov_bal_geg_bir_lie_rgp_rgs_spa_lap_grd".split("_"),weekdays:ld,weekdaysShort:"Sek_Pir_Ant_Tre_Ket_Pen_Šeš".split("_"),weekdaysMin:"S_P_A_T_K_Pn_Š".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"YYYY-MM-DD",LL:"YYYY [m.] MMMM D [d.]",LLL:"YYYY [m.] MMMM D [d.], LT [val.]",LLLL:"YYYY [m.] MMMM D [d.], dddd, LT [val.]",l:"YYYY-MM-DD",ll:"YYYY [m.] MMMM D [d.]",lll:"YYYY [m.] MMMM D [d.], LT [val.]",llll:"YYYY [m.] MMMM D [d.], ddd, LT [val.]"},calendar:{sameDay:"[Šiandien] LT",nextDay:"[Rytoj] LT",nextWeek:"dddd LT",lastDay:"[Vakar] LT",lastWeek:"[Praėjusį] dddd LT",sameElse:"L"},relativeTime:{future:"po %s",past:"prieš %s",s:gd,m:hd,mm:kd,h:hd,hh:kd,d:hd,dd:kd,M:hd,MM:kd,y:hd,yy:kd},ordinalParse:/\d{1,2}-oji/,ordinal:function(a){return a+"-oji"},week:{dow:1,doy:4}}),{m:"minūtes_minūtēm_minūte_minūtes".split("_"),mm:"minūtes_minūtēm_minūte_minūtes".split("_"),h:"stundas_stundām_stunda_stundas".split("_"),hh:"stundas_stundām_stunda_stundas".split("_"),d:"dienas_dienām_diena_dienas".split("_"),dd:"dienas_dienām_diena_dienas".split("_"),M:"mēneša_mēnešiem_mēnesis_mēneši".split("_"),MM:"mēneša_mēnešiem_mēnesis_mēneši".split("_"),y:"gada_gadiem_gads_gadi".split("_"),yy:"gada_gadiem_gads_gadi".split("_")}),Rf=(nf.defineLocale("lv",{months:"janvāris_februāris_marts_aprīlis_maijs_jūnijs_jūlijs_augusts_septembris_oktobris_novembris_decembris".split("_"),monthsShort:"jan_feb_mar_apr_mai_jūn_jūl_aug_sep_okt_nov_dec".split("_"),weekdays:"svētdiena_pirmdiena_otrdiena_trešdiena_ceturtdiena_piektdiena_sestdiena".split("_"),weekdaysShort:"Sv_P_O_T_C_Pk_S".split("_"),weekdaysMin:"Sv_P_O_T_C_Pk_S".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD.MM.YYYY.",LL:"YYYY. [gada] D. MMMM",LLL:"YYYY. [gada] D. MMMM, LT",LLLL:"YYYY. [gada] D. MMMM, dddd, LT"},calendar:{sameDay:"[Šodien pulksten] LT",nextDay:"[Rīt pulksten] LT",nextWeek:"dddd [pulksten] LT",lastDay:"[Vakar pulksten] LT",lastWeek:"[Pagājušā] dddd [pulksten] LT",sameElse:"L"},relativeTime:{future:"pēc %s",past:"pirms %s",s:pd,m:od,mm:nd,h:od,hh:nd,d:od,dd:nd,M:od,MM:nd,y:od,yy:nd},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),{words:{m:["jedan minut","jednog minuta"],mm:["minut","minuta","minuta"],h:["jedan sat","jednog sata"],hh:["sat","sata","sati"],dd:["dan","dana","dana"],MM:["mjesec","mjeseca","mjeseci"],yy:["godina","godine","godina"]},correctGrammaticalCase:function(a,b){return 1===a?b[0]:a>=2&&4>=a?b[1]:b[2]},translate:function(a,b,c){var d=Rf.words[c];return 1===c.length?b?d[0]:d[1]:a+" "+Rf.correctGrammaticalCase(a,d)}}),Sf=(nf.defineLocale("me",{months:["januar","februar","mart","april","maj","jun","jul","avgust","septembar","oktobar","novembar","decembar"],monthsShort:["jan.","feb.","mar.","apr.","maj","jun","jul","avg.","sep.","okt.","nov.","dec."],weekdays:["nedjelja","ponedjeljak","utorak","srijeda","četvrtak","petak","subota"],weekdaysShort:["ned.","pon.","uto.","sri.","čet.","pet.","sub."],weekdaysMin:["ne","po","ut","sr","če","pe","su"],longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[danas u] LT",nextDay:"[sjutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedjelju] [u] LT";case 3:return"[u] [srijedu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[juče u] LT",lastWeek:function(){var a=["[prošle] [nedjelje] [u] LT","[prošlog] [ponedjeljka] [u] LT","[prošlog] [utorka] [u] LT","[prošle] [srijede] [u] LT","[prošlog] [četvrtka] [u] LT","[prošlog] [petka] [u] LT","[prošle] [subote] [u] LT"];return a[this.day()]},sameElse:"L"},relativeTime:{future:"za %s",past:"prije %s",s:"nekoliko sekundi",m:Rf.translate,mm:Rf.translate,h:Rf.translate,hh:Rf.translate,d:"dan",dd:Rf.translate,M:"mjesec",MM:Rf.translate,y:"godinu",yy:Rf.translate},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),nf.defineLocale("mk",{months:"јануари_февруари_март_април_мај_јуни_јули_август_септември_октомври_ноември_декември".split("_"),monthsShort:"јан_фев_мар_апр_мај_јун_јул_авг_сеп_окт_ное_дек".split("_"),weekdays:"недела_понеделник_вторник_среда_четврток_петок_сабота".split("_"),weekdaysShort:"нед_пон_вто_сре_чет_пет_саб".split("_"),weekdaysMin:"нe_пo_вт_ср_че_пе_сa".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"D.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Денес во] LT",nextDay:"[Утре во] LT",nextWeek:"dddd [во] LT",lastDay:"[Вчера во] LT",lastWeek:function(){switch(this.day()){case 0:case 3:case 6:return"[Во изминатата] dddd [во] LT";case 1:case 2:case 4:case 5:return"[Во изминатиот] dddd [во] LT"}},sameElse:"L"},relativeTime:{future:"после %s",past:"пред %s",s:"неколку секунди",m:"минута",mm:"%d минути",h:"час",hh:"%d часа",d:"ден",dd:"%d дена",M:"месец",MM:"%d месеци",y:"година",yy:"%d години"},ordinalParse:/\d{1,2}-(ев|ен|ти|ви|ри|ми)/,ordinal:function(a){var b=a%10,c=a%100;return 0===a?a+"-ев":0===c?a+"-ен":c>10&&20>c?a+"-ти":1===b?a+"-ви":2===b?a+"-ри":7===b||8===b?a+"-ми":a+"-ти"},week:{dow:1,doy:7}}),nf.defineLocale("ml",{months:"ജനുവരി_ഫെബ്രുവരി_മാർച്ച്_ഏപ്രിൽ_മേയ്_ജൂൺ_ജൂലൈ_ഓഗസ്റ്റ്_സെപ്റ്റംബർ_ഒക്ടോബർ_നവംബർ_ഡിസംബർ".split("_"),monthsShort:"ജനു._ഫെബ്രു._മാർ._ഏപ്രി._മേയ്_ജൂൺ_ജൂലൈ._ഓഗ._സെപ്റ്റ._ഒക്ടോ._നവം._ഡിസം.".split("_"),weekdays:"ഞായറാഴ്ച_തിങ്കളാഴ്ച_ചൊവ്വാഴ്ച_ബുധനാഴ്ച_വ്യാഴാഴ്ച_വെള്ളിയാഴ്ച_ശനിയാഴ്ച".split("_"),weekdaysShort:"ഞായർ_തിങ്കൾ_ചൊവ്വ_ബുധൻ_വ്യാഴം_വെള്ളി_ശനി".split("_"),weekdaysMin:"ഞാ_തി_ചൊ_ബു_വ്യാ_വെ_ശ".split("_"),longDateFormat:{LT:"A h:mm -നു",LTS:"A h:mm:ss -നു",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, LT",LLLL:"dddd, D MMMM YYYY, LT"},calendar:{sameDay:"[ഇന്ന്] LT",nextDay:"[നാളെ] LT",nextWeek:"dddd, LT",lastDay:"[ഇന്നലെ] LT",lastWeek:"[കഴിഞ്ഞ] dddd, LT",sameElse:"L"},relativeTime:{future:"%s കഴിഞ്ഞ്",past:"%s മുൻപ്",s:"അൽപ നിമിഷങ്ങൾ",m:"ഒരു മിനിറ്റ്",mm:"%d മിനിറ്റ്",h:"ഒരു മണിക്കൂർ",hh:"%d മണിക്കൂർ",d:"ഒരു ദിവസം",dd:"%d ദിവസം",M:"ഒരു മാസം",MM:"%d മാസം",y:"ഒരു വർഷം",yy:"%d വർഷം"},meridiemParse:/രാത്രി|രാവിലെ|ഉച്ച കഴിഞ്ഞ്|വൈകുന്നേരം|രാത്രി/i,isPM:function(a){return/^(ഉച്ച കഴിഞ്ഞ്|വൈകുന്നേരം|രാത്രി)$/.test(a)},meridiem:function(a,b,c){return 4>a?"രാത്രി":12>a?"രാവിലെ":17>a?"ഉച്ച കഴിഞ്ഞ്":20>a?"വൈകുന്നേരം":"രാത്രി"}}),{1:"१",2:"२",3:"३",4:"४",5:"५",6:"६",7:"७",8:"८",9:"९",0:"०"}),Tf={"१":"1","२":"2","३":"3","४":"4","५":"5","६":"6","७":"7","८":"8","९":"9","०":"0"},Uf=(nf.defineLocale("mr",{months:"जानेवारी_फेब्रुवारी_मार्च_एप्रिल_मे_जून_जुलै_ऑगस्ट_सप्टेंबर_ऑक्टोबर_नोव्हेंबर_डिसेंबर".split("_"),monthsShort:"जाने._फेब्रु._मार्च._एप्रि._मे._जून._जुलै._ऑग._सप्टें._ऑक्टो._नोव्हें._डिसें.".split("_"),weekdays:"रविवार_सोमवार_मंगळवार_बुधवार_गुरूवार_शुक्रवार_शनिवार".split("_"),weekdaysShort:"रवि_सोम_मंगळ_बुध_गुरू_शुक्र_शनि".split("_"),weekdaysMin:"र_सो_मं_बु_गु_शु_श".split("_"),longDateFormat:{LT:"A h:mm वाजता",LTS:"A h:mm:ss वाजता",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, LT",LLLL:"dddd, D MMMM YYYY, LT"},calendar:{sameDay:"[आज] LT",nextDay:"[उद्या] LT",nextWeek:"dddd, LT",lastDay:"[काल] LT",lastWeek:"[मागील] dddd, LT",sameElse:"L"},relativeTime:{future:"%s नंतर",past:"%s पूर्वी",s:"सेकंद",m:"एक मिनिट",mm:"%d मिनिटे",h:"एक तास",hh:"%d तास",d:"एक दिवस",dd:"%d दिवस",M:"एक महिना",MM:"%d महिने",y:"एक वर्ष",yy:"%d वर्षे"},preparse:function(a){return a.replace(/[१२३४५६७८९०]/g,function(a){return Tf[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return Sf[a]})},meridiemParse:/रात्री|सकाळी|दुपारी|सायंकाळी/,meridiemHour:function(a,b){return 12===a&&(a=0),"रात्री"===b?4>a?a:a+12:"सकाळी"===b?a:"दुपारी"===b?a>=10?a:a+12:"सायंकाळी"===b?a+12:void 0},meridiem:function(a,b,c){return 4>a?"रात्री":10>a?"सकाळी":17>a?"दुपारी":20>a?"सायंकाळी":"रात्री"},week:{dow:0,doy:6}}),nf.defineLocale("ms-my",{months:"Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember".split("_"),monthsShort:"Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis".split("_"),weekdays:"Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu".split("_"),weekdaysShort:"Ahd_Isn_Sel_Rab_Kha_Jum_Sab".split("_"),weekdaysMin:"Ah_Is_Sl_Rb_Km_Jm_Sb".split("_"),longDateFormat:{LT:"HH.mm",LTS:"LT.ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [pukul] LT",LLLL:"dddd, D MMMM YYYY [pukul] LT"},meridiemParse:/pagi|tengahari|petang|malam/,meridiemHour:function(a,b){return 12===a&&(a=0),"pagi"===b?a:"tengahari"===b?a>=11?a:a+12:"petang"===b||"malam"===b?a+12:void 0},meridiem:function(a,b,c){return 11>a?"pagi":15>a?"tengahari":19>a?"petang":"malam"},calendar:{sameDay:"[Hari ini pukul] LT",nextDay:"[Esok pukul] LT",nextWeek:"dddd [pukul] LT",lastDay:"[Kelmarin pukul] LT",lastWeek:"dddd [lepas pukul] LT",sameElse:"L"},relativeTime:{future:"dalam %s",past:"%s yang lepas",s:"beberapa saat",m:"seminit",mm:"%d minit",h:"sejam",hh:"%d jam",d:"sehari",dd:"%d hari",M:"sebulan",MM:"%d bulan",y:"setahun",yy:"%d tahun"},week:{dow:1,doy:7}}),{1:"၁",2:"၂",3:"၃",4:"၄",5:"၅",6:"၆",7:"၇",8:"၈",9:"၉",0:"၀"}),Vf={"၁":"1","၂":"2","၃":"3","၄":"4","၅":"5",
        "၆":"6","၇":"7","၈":"8","၉":"9","၀":"0"},Wf=(nf.defineLocale("my",{months:"ဇန်နဝါရီ_ဖေဖော်ဝါရီ_မတ်_ဧပြီ_မေ_ဇွန်_ဇူလိုင်_သြဂုတ်_စက်တင်ဘာ_အောက်တိုဘာ_နိုဝင်ဘာ_ဒီဇင်ဘာ".split("_"),monthsShort:"ဇန်_ဖေ_မတ်_ပြီ_မေ_ဇွန်_လိုင်_သြ_စက်_အောက်_နို_ဒီ".split("_"),weekdays:"တနင်္ဂနွေ_တနင်္လာ_အင်္ဂါ_ဗုဒ္ဓဟူး_ကြာသပတေး_သောကြာ_စနေ".split("_"),weekdaysShort:"နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ".split("_"),weekdaysMin:"နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[ယနေ.] LT [မှာ]",nextDay:"[မနက်ဖြန်] LT [မှာ]",nextWeek:"dddd LT [မှာ]",lastDay:"[မနေ.က] LT [မှာ]",lastWeek:"[ပြီးခဲ့သော] dddd LT [မှာ]",sameElse:"L"},relativeTime:{future:"လာမည့် %s မှာ",past:"လွန်ခဲ့သော %s က",s:"စက္ကန်.အနည်းငယ်",m:"တစ်မိနစ်",mm:"%d မိနစ်",h:"တစ်နာရီ",hh:"%d နာရီ",d:"တစ်ရက်",dd:"%d ရက်",M:"တစ်လ",MM:"%d လ",y:"တစ်နှစ်",yy:"%d နှစ်"},preparse:function(a){return a.replace(/[၁၂၃၄၅၆၇၈၉၀]/g,function(a){return Vf[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return Uf[a]})},week:{dow:1,doy:4}}),nf.defineLocale("nb",{months:"januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split("_"),monthsShort:"jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),weekdays:"søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),weekdaysShort:"søn_man_tirs_ons_tors_fre_lør".split("_"),weekdaysMin:"sø_ma_ti_on_to_fr_lø".split("_"),longDateFormat:{LT:"H.mm",LTS:"LT.ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY [kl.] LT",LLLL:"dddd D. MMMM YYYY [kl.] LT"},calendar:{sameDay:"[i dag kl.] LT",nextDay:"[i morgen kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[i går kl.] LT",lastWeek:"[forrige] dddd [kl.] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"for %s siden",s:"noen sekunder",m:"ett minutt",mm:"%d minutter",h:"en time",hh:"%d timer",d:"en dag",dd:"%d dager",M:"en måned",MM:"%d måneder",y:"ett år",yy:"%d år"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),{1:"१",2:"२",3:"३",4:"४",5:"५",6:"६",7:"७",8:"८",9:"९",0:"०"}),Xf={"१":"1","२":"2","३":"3","४":"4","५":"5","६":"6","७":"7","८":"8","९":"9","०":"0"},Yf=(nf.defineLocale("ne",{months:"जनवरी_फेब्रुवरी_मार्च_अप्रिल_मई_जुन_जुलाई_अगष्ट_सेप्टेम्बर_अक्टोबर_नोभेम्बर_डिसेम्बर".split("_"),monthsShort:"जन._फेब्रु._मार्च_अप्रि._मई_जुन_जुलाई._अग._सेप्ट._अक्टो._नोभे._डिसे.".split("_"),weekdays:"आइतबार_सोमबार_मङ्गलबार_बुधबार_बिहिबार_शुक्रबार_शनिबार".split("_"),weekdaysShort:"आइत._सोम._मङ्गल._बुध._बिहि._शुक्र._शनि.".split("_"),weekdaysMin:"आइ._सो._मङ्_बु._बि._शु._श.".split("_"),longDateFormat:{LT:"Aको h:mm बजे",LTS:"Aको h:mm:ss बजे",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, LT",LLLL:"dddd, D MMMM YYYY, LT"},preparse:function(a){return a.replace(/[१२३४५६७८९०]/g,function(a){return Xf[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return Wf[a]})},meridiemParse:/राती|बिहान|दिउँसो|बेलुका|साँझ|राती/,meridiemHour:function(a,b){return 12===a&&(a=0),"राती"===b?3>a?a:a+12:"बिहान"===b?a:"दिउँसो"===b?a>=10?a:a+12:"बेलुका"===b||"साँझ"===b?a+12:void 0},meridiem:function(a,b,c){return 3>a?"राती":10>a?"बिहान":15>a?"दिउँसो":18>a?"बेलुका":20>a?"साँझ":"राती"},calendar:{sameDay:"[आज] LT",nextDay:"[भोली] LT",nextWeek:"[आउँदो] dddd[,] LT",lastDay:"[हिजो] LT",lastWeek:"[गएको] dddd[,] LT",sameElse:"L"},relativeTime:{future:"%sमा",past:"%s अगाडी",s:"केही समय",m:"एक मिनेट",mm:"%d मिनेट",h:"एक घण्टा",hh:"%d घण्टा",d:"एक दिन",dd:"%d दिन",M:"एक महिना",MM:"%d महिना",y:"एक बर्ष",yy:"%d बर्ष"},week:{dow:1,doy:7}}),"jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.".split("_")),Zf="jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec".split("_"),$f=(nf.defineLocale("nl",{months:"januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december".split("_"),monthsShort:function(a,b){return/-MMM-/.test(b)?Zf[a.month()]:Yf[a.month()]},weekdays:"zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag".split("_"),weekdaysShort:"zo._ma._di._wo._do._vr._za.".split("_"),weekdaysMin:"Zo_Ma_Di_Wo_Do_Vr_Za".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD-MM-YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[vandaag om] LT",nextDay:"[morgen om] LT",nextWeek:"dddd [om] LT",lastDay:"[gisteren om] LT",lastWeek:"[afgelopen] dddd [om] LT",sameElse:"L"},relativeTime:{future:"over %s",past:"%s geleden",s:"een paar seconden",m:"één minuut",mm:"%d minuten",h:"één uur",hh:"%d uur",d:"één dag",dd:"%d dagen",M:"één maand",MM:"%d maanden",y:"één jaar",yy:"%d jaar"},ordinalParse:/\d{1,2}(ste|de)/,ordinal:function(a){return a+(1===a||8===a||a>=20?"ste":"de")},week:{dow:1,doy:4}}),nf.defineLocale("nn",{months:"januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split("_"),monthsShort:"jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),weekdays:"sundag_måndag_tysdag_onsdag_torsdag_fredag_laurdag".split("_"),weekdaysShort:"sun_mån_tys_ons_tor_fre_lau".split("_"),weekdaysMin:"su_må_ty_on_to_fr_lø".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[I dag klokka] LT",nextDay:"[I morgon klokka] LT",nextWeek:"dddd [klokka] LT",lastDay:"[I går klokka] LT",lastWeek:"[Føregåande] dddd [klokka] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"for %s sidan",s:"nokre sekund",m:"eit minutt",mm:"%d minutt",h:"ein time",hh:"%d timar",d:"ein dag",dd:"%d dagar",M:"ein månad",MM:"%d månader",y:"eit år",yy:"%d år"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),"styczeń_luty_marzec_kwiecień_maj_czerwiec_lipiec_sierpień_wrzesień_październik_listopad_grudzień".split("_")),_f="stycznia_lutego_marca_kwietnia_maja_czerwca_lipca_sierpnia_września_października_listopada_grudnia".split("_"),ag=(nf.defineLocale("pl",{months:function(a,b){return""===b?"("+_f[a.month()]+"|"+$f[a.month()]+")":/D MMMM/.test(b)?_f[a.month()]:$f[a.month()]},monthsShort:"sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru".split("_"),weekdays:"niedziela_poniedziałek_wtorek_środa_czwartek_piątek_sobota".split("_"),weekdaysShort:"nie_pon_wt_śr_czw_pt_sb".split("_"),weekdaysMin:"N_Pn_Wt_Śr_Cz_Pt_So".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Dziś o] LT",nextDay:"[Jutro o] LT",nextWeek:"[W] dddd [o] LT",lastDay:"[Wczoraj o] LT",lastWeek:function(){switch(this.day()){case 0:return"[W zeszłą niedzielę o] LT";case 3:return"[W zeszłą środę o] LT";case 6:return"[W zeszłą sobotę o] LT";default:return"[W zeszły] dddd [o] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"%s temu",s:"kilka sekund",m:rd,mm:rd,h:rd,hh:rd,d:"1 dzień",dd:"%d dni",M:"miesiąc",MM:rd,y:"rok",yy:rd},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),nf.defineLocale("pt-br",{months:"Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro".split("_"),monthsShort:"Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez".split("_"),weekdays:"Domingo_Segunda-Feira_Terça-Feira_Quarta-Feira_Quinta-Feira_Sexta-Feira_Sábado".split("_"),weekdaysShort:"Dom_Seg_Ter_Qua_Qui_Sex_Sáb".split("_"),weekdaysMin:"Dom_2ª_3ª_4ª_5ª_6ª_Sáb".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY [às] LT",LLLL:"dddd, D [de] MMMM [de] YYYY [às] LT"},calendar:{sameDay:"[Hoje às] LT",nextDay:"[Amanhã às] LT",nextWeek:"dddd [às] LT",lastDay:"[Ontem às] LT",lastWeek:function(){return 0===this.day()||6===this.day()?"[Último] dddd [às] LT":"[Última] dddd [às] LT"},sameElse:"L"},relativeTime:{future:"em %s",past:"%s atrás",s:"segundos",m:"um minuto",mm:"%d minutos",h:"uma hora",hh:"%d horas",d:"um dia",dd:"%d dias",M:"um mês",MM:"%d meses",y:"um ano",yy:"%d anos"},ordinalParse:/\d{1,2}º/,ordinal:"%dº"}),nf.defineLocale("pt",{months:"Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro".split("_"),monthsShort:"Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez".split("_"),weekdays:"Domingo_Segunda-Feira_Terça-Feira_Quarta-Feira_Quinta-Feira_Sexta-Feira_Sábado".split("_"),weekdaysShort:"Dom_Seg_Ter_Qua_Qui_Sex_Sáb".split("_"),weekdaysMin:"Dom_2ª_3ª_4ª_5ª_6ª_Sáb".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY LT",LLLL:"dddd, D [de] MMMM [de] YYYY LT"},calendar:{sameDay:"[Hoje às] LT",nextDay:"[Amanhã às] LT",nextWeek:"dddd [às] LT",lastDay:"[Ontem às] LT",lastWeek:function(){return 0===this.day()||6===this.day()?"[Último] dddd [às] LT":"[Última] dddd [às] LT"},sameElse:"L"},relativeTime:{future:"em %s",past:"há %s",s:"segundos",m:"um minuto",mm:"%d minutos",h:"uma hora",hh:"%d horas",d:"um dia",dd:"%d dias",M:"um mês",MM:"%d meses",y:"um ano",yy:"%d anos"},ordinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:4}}),nf.defineLocale("ro",{months:"ianuarie_februarie_martie_aprilie_mai_iunie_iulie_august_septembrie_octombrie_noiembrie_decembrie".split("_"),monthsShort:"ian._febr._mart._apr._mai_iun._iul._aug._sept._oct._nov._dec.".split("_"),weekdays:"duminică_luni_marți_miercuri_joi_vineri_sâmbătă".split("_"),weekdaysShort:"Dum_Lun_Mar_Mie_Joi_Vin_Sâm".split("_"),weekdaysMin:"Du_Lu_Ma_Mi_Jo_Vi_Sâ".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY H:mm",LLLL:"dddd, D MMMM YYYY H:mm"},calendar:{sameDay:"[azi la] LT",nextDay:"[mâine la] LT",nextWeek:"dddd [la] LT",lastDay:"[ieri la] LT",lastWeek:"[fosta] dddd [la] LT",sameElse:"L"},relativeTime:{future:"peste %s",past:"%s în urmă",s:"câteva secunde",m:"un minut",mm:sd,h:"o oră",hh:sd,d:"o zi",dd:sd,M:"o lună",MM:sd,y:"un an",yy:sd},week:{dow:1,doy:7}}),nf.defineLocale("ru",{months:vd,monthsShort:wd,weekdays:xd,weekdaysShort:"вс_пн_вт_ср_чт_пт_сб".split("_"),weekdaysMin:"вс_пн_вт_ср_чт_пт_сб".split("_"),monthsParse:[/^янв/i,/^фев/i,/^мар/i,/^апр/i,/^ма[й|я]/i,/^июн/i,/^июл/i,/^авг/i,/^сен/i,/^окт/i,/^ноя/i,/^дек/i],longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY г.",LLL:"D MMMM YYYY г., LT",LLLL:"dddd, D MMMM YYYY г., LT"},calendar:{sameDay:"[Сегодня в] LT",nextDay:"[Завтра в] LT",lastDay:"[Вчера в] LT",nextWeek:function(){return 2===this.day()?"[Во] dddd [в] LT":"[В] dddd [в] LT"},lastWeek:function(a){if(a.week()===this.week())return 2===this.day()?"[Во] dddd [в] LT":"[В] dddd [в] LT";switch(this.day()){case 0:return"[В прошлое] dddd [в] LT";case 1:case 2:case 4:return"[В прошлый] dddd [в] LT";case 3:case 5:case 6:return"[В прошлую] dddd [в] LT"}},sameElse:"L"},relativeTime:{future:"через %s",past:"%s назад",s:"несколько секунд",m:ud,mm:ud,h:"час",hh:ud,d:"день",dd:ud,M:"месяц",MM:ud,y:"год",yy:ud},meridiemParse:/ночи|утра|дня|вечера/i,isPM:function(a){return/^(дня|вечера)$/.test(a)},meridiem:function(a,b,c){return 4>a?"ночи":12>a?"утра":17>a?"дня":"вечера"},ordinalParse:/\d{1,2}-(й|го|я)/,ordinal:function(a,b){switch(b){case"M":case"d":case"DDD":return a+"-й";case"D":return a+"-го";case"w":case"W":return a+"-я";default:return a}},week:{dow:1,doy:7}}),nf.defineLocale("si",{months:"ජනවාරි_පෙබරවාරි_මාර්තු_අප්‍රේල්_මැයි_ජූනි_ජූලි_අගෝස්තු_සැප්තැම්බර්_ඔක්තෝබර්_නොවැම්බර්_දෙසැම්බර්".split("_"),monthsShort:"ජන_පෙබ_මාර්_අප්_මැයි_ජූනි_ජූලි_අගෝ_සැප්_ඔක්_නොවැ_දෙසැ".split("_"),weekdays:"ඉරිදා_සඳුදා_අඟහරුවාදා_බදාදා_බ්‍රහස්පතින්දා_සිකුරාදා_සෙනසුරාදා".split("_"),weekdaysShort:"ඉරි_සඳු_අඟ_බදා_බ්‍රහ_සිකු_සෙන".split("_"),weekdaysMin:"ඉ_ස_අ_බ_බ්‍ර_සි_සෙ".split("_"),longDateFormat:{LT:"a h:mm",LTS:"a h:mm:ss",L:"YYYY/MM/DD",LL:"YYYY MMMM D",LLL:"YYYY MMMM D, LT",LLLL:"YYYY MMMM D [වැනි] dddd, LTS"},calendar:{sameDay:"[අද] LT[ට]",nextDay:"[හෙට] LT[ට]",nextWeek:"dddd LT[ට]",lastDay:"[ඊයේ] LT[ට]",lastWeek:"[පසුගිය] dddd LT[ට]",sameElse:"L"},relativeTime:{future:"%sකින්",past:"%sකට පෙර",s:"තත්පර කිහිපය",m:"මිනිත්තුව",mm:"මිනිත්තු %d",h:"පැය",hh:"පැය %d",d:"දිනය",dd:"දින %d",M:"මාසය",MM:"මාස %d",y:"වසර",yy:"වසර %d"},ordinalParse:/\d{1,2} වැනි/,ordinal:function(a){return a+" වැනි"},meridiem:function(a,b,c){return a>11?c?"ප.ව.":"පස් වරු":c?"පෙ.ව.":"පෙර වරු"}}),"január_február_marec_apríl_máj_jún_júl_august_september_október_november_december".split("_")),bg="jan_feb_mar_apr_máj_jún_júl_aug_sep_okt_nov_dec".split("_"),cg=(nf.defineLocale("sk",{months:ag,monthsShort:bg,monthsParse:function(a,b){var c,d=[];for(c=0;12>c;c++)d[c]=new RegExp("^"+a[c]+"$|^"+b[c]+"$","i");return d}(ag,bg),weekdays:"nedeľa_pondelok_utorok_streda_štvrtok_piatok_sobota".split("_"),weekdaysShort:"ne_po_ut_st_št_pi_so".split("_"),weekdaysMin:"ne_po_ut_st_št_pi_so".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd D. MMMM YYYY LT"},calendar:{sameDay:"[dnes o] LT",nextDay:"[zajtra o] LT",nextWeek:function(){switch(this.day()){case 0:return"[v nedeľu o] LT";case 1:case 2:return"[v] dddd [o] LT";case 3:return"[v stredu o] LT";case 4:return"[vo štvrtok o] LT";case 5:return"[v piatok o] LT";case 6:return"[v sobotu o] LT"}},lastDay:"[včera o] LT",lastWeek:function(){switch(this.day()){case 0:return"[minulú nedeľu o] LT";case 1:case 2:return"[minulý] dddd [o] LT";case 3:return"[minulú stredu o] LT";case 4:case 5:return"[minulý] dddd [o] LT";case 6:return"[minulú sobotu o] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"pred %s",s:zd,m:zd,mm:zd,h:zd,hh:zd,d:zd,dd:zd,M:zd,MM:zd,y:zd,yy:zd},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),nf.defineLocale("sl",{months:"januar_februar_marec_april_maj_junij_julij_avgust_september_oktober_november_december".split("_"),monthsShort:"jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.".split("_"),weekdays:"nedelja_ponedeljek_torek_sreda_četrtek_petek_sobota".split("_"),weekdaysShort:"ned._pon._tor._sre._čet._pet._sob.".split("_"),weekdaysMin:"ne_po_to_sr_če_pe_so".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[danes ob] LT",nextDay:"[jutri ob] LT",nextWeek:function(){switch(this.day()){case 0:return"[v] [nedeljo] [ob] LT";case 3:return"[v] [sredo] [ob] LT";case 6:return"[v] [soboto] [ob] LT";case 1:case 2:case 4:case 5:return"[v] dddd [ob] LT"}},lastDay:"[včeraj ob] LT",lastWeek:function(){switch(this.day()){case 0:return"[prejšnjo] [nedeljo] [ob] LT";case 3:return"[prejšnjo] [sredo] [ob] LT";case 6:return"[prejšnjo] [soboto] [ob] LT";case 1:case 2:case 4:case 5:return"[prejšnji] dddd [ob] LT"}},sameElse:"L"},relativeTime:{future:"čez %s",past:"pred %s",s:Ad,m:Ad,mm:Ad,h:Ad,hh:Ad,d:Ad,dd:Ad,M:Ad,MM:Ad,y:Ad,yy:Ad},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),nf.defineLocale("sq",{months:"Janar_Shkurt_Mars_Prill_Maj_Qershor_Korrik_Gusht_Shtator_Tetor_Nëntor_Dhjetor".split("_"),monthsShort:"Jan_Shk_Mar_Pri_Maj_Qer_Kor_Gus_Sht_Tet_Nën_Dhj".split("_"),weekdays:"E Diel_E Hënë_E Martë_E Mërkurë_E Enjte_E Premte_E Shtunë".split("_"),weekdaysShort:"Die_Hën_Mar_Mër_Enj_Pre_Sht".split("_"),weekdaysMin:"D_H_Ma_Më_E_P_Sh".split("_"),meridiemParse:/PD|MD/,isPM:function(a){return"M"===a.charAt(0)},meridiem:function(a,b,c){return 12>a?"PD":"MD"},longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Sot në] LT",nextDay:"[Nesër në] LT",nextWeek:"dddd [në] LT",lastDay:"[Dje në] LT",lastWeek:"dddd [e kaluar në] LT",sameElse:"L"},relativeTime:{future:"në %s",past:"%s më parë",s:"disa sekonda",m:"një minutë",mm:"%d minuta",h:"një orë",hh:"%d orë",d:"një ditë",dd:"%d ditë",M:"një muaj",MM:"%d muaj",y:"një vit",yy:"%d vite"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),{words:{m:["један минут","једне минуте"],mm:["минут","минуте","минута"],h:["један сат","једног сата"],hh:["сат","сата","сати"],dd:["дан","дана","дана"],MM:["месец","месеца","месеци"],yy:["година","године","година"]},correctGrammaticalCase:function(a,b){return 1===a?b[0]:a>=2&&4>=a?b[1]:b[2]},translate:function(a,b,c){var d=cg.words[c];return 1===c.length?b?d[0]:d[1]:a+" "+cg.correctGrammaticalCase(a,d)}}),dg=(nf.defineLocale("sr-cyrl",{months:["јануар","фебруар","март","април","мај","јун","јул","август","септембар","октобар","новембар","децембар"],monthsShort:["јан.","феб.","мар.","апр.","мај","јун","јул","авг.","сеп.","окт.","нов.","дец."],weekdays:["недеља","понедељак","уторак","среда","четвртак","петак","субота"],weekdaysShort:["нед.","пон.","уто.","сре.","чет.","пет.","суб."],weekdaysMin:["не","по","ут","ср","че","пе","су"],longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[данас у] LT",nextDay:"[сутра у] LT",nextWeek:function(){switch(this.day()){case 0:return"[у] [недељу] [у] LT";case 3:return"[у] [среду] [у] LT";case 6:return"[у] [суботу] [у] LT";case 1:case 2:case 4:case 5:return"[у] dddd [у] LT"}},lastDay:"[јуче у] LT",lastWeek:function(){var a=["[прошле] [недеље] [у] LT","[прошлог] [понедељка] [у] LT","[прошлог] [уторка] [у] LT","[прошле] [среде] [у] LT","[прошлог] [четвртка] [у] LT","[прошлог] [петка] [у] LT","[прошле] [суботе] [у] LT"];return a[this.day()]},sameElse:"L"},relativeTime:{future:"за %s",past:"пре %s",s:"неколико секунди",m:cg.translate,mm:cg.translate,h:cg.translate,hh:cg.translate,d:"дан",dd:cg.translate,M:"месец",MM:cg.translate,y:"годину",yy:cg.translate},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),{words:{m:["jedan minut","jedne minute"],mm:["minut","minute","minuta"],h:["jedan sat","jednog sata"],hh:["sat","sata","sati"],dd:["dan","dana","dana"],MM:["mesec","meseca","meseci"],yy:["godina","godine","godina"]},correctGrammaticalCase:function(a,b){return 1===a?b[0]:a>=2&&4>=a?b[1]:b[2]},translate:function(a,b,c){var d=dg.words[c];return 1===c.length?b?d[0]:d[1]:a+" "+dg.correctGrammaticalCase(a,d)}}),eg=(nf.defineLocale("sr",{months:["januar","februar","mart","april","maj","jun","jul","avgust","septembar","oktobar","novembar","decembar"],monthsShort:["jan.","feb.","mar.","apr.","maj","jun","jul","avg.","sep.","okt.","nov.","dec."],weekdays:["nedelja","ponedeljak","utorak","sreda","četvrtak","petak","subota"],weekdaysShort:["ned.","pon.","uto.","sre.","čet.","pet.","sub."],weekdaysMin:["ne","po","ut","sr","če","pe","su"],longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[danas u] LT",nextDay:"[sutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedelju] [u] LT";case 3:return"[u] [sredu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[juče u] LT",lastWeek:function(){var a=["[prošle] [nedelje] [u] LT","[prošlog] [ponedeljka] [u] LT","[prošlog] [utorka] [u] LT","[prošle] [srede] [u] LT","[prošlog] [četvrtka] [u] LT","[prošlog] [petka] [u] LT","[prošle] [subote] [u] LT"];return a[this.day()]},sameElse:"L"},relativeTime:{future:"za %s",past:"pre %s",s:"nekoliko sekundi",m:dg.translate,mm:dg.translate,h:dg.translate,hh:dg.translate,d:"dan",dd:dg.translate,M:"mesec",MM:dg.translate,y:"godinu",yy:dg.translate},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),nf.defineLocale("sv",{months:"januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december".split("_"),monthsShort:"jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),weekdays:"söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag".split("_"),weekdaysShort:"sön_mån_tis_ons_tor_fre_lör".split("_"),weekdaysMin:"sö_må_ti_on_to_fr_lö".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"YYYY-MM-DD",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[Idag] LT",nextDay:"[Imorgon] LT",lastDay:"[Igår] LT",nextWeek:"[På] dddd LT",lastWeek:"[I] dddd[s] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"för %s sedan",s:"några sekunder",m:"en minut",mm:"%d minuter",h:"en timme",hh:"%d timmar",d:"en dag",dd:"%d dagar",M:"en månad",MM:"%d månader",y:"ett år",yy:"%d år"},ordinalParse:/\d{1,2}(e|a)/,ordinal:function(a){var b=a%10,c=1===~~(a%100/10)?"e":1===b?"a":2===b?"a":"e";return a+c},week:{dow:1,doy:4}}),nf.defineLocale("ta",{months:"ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்".split("_"),monthsShort:"ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்".split("_"),weekdays:"ஞாயிற்றுக்கிழமை_திங்கட்கிழமை_செவ்வாய்கிழமை_புதன்கிழமை_வியாழக்கிழமை_வெள்ளிக்கிழமை_சனிக்கிழமை".split("_"),weekdaysShort:"ஞாயிறு_திங்கள்_செவ்வாய்_புதன்_வியாழன்_வெள்ளி_சனி".split("_"),weekdaysMin:"ஞா_தி_செ_பு_வி_வெ_ச".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, LT",LLLL:"dddd, D MMMM YYYY, LT"},calendar:{sameDay:"[இன்று] LT",nextDay:"[நாளை] LT",nextWeek:"dddd, LT",lastDay:"[நேற்று] LT",lastWeek:"[கடந்த வாரம்] dddd, LT",sameElse:"L"},relativeTime:{future:"%s இல்",past:"%s முன்",s:"ஒரு சில விநாடிகள்",m:"ஒரு நிமிடம்",mm:"%d நிமிடங்கள்",h:"ஒரு மணி நேரம்",hh:"%d மணி நேரம்",d:"ஒரு நாள்",dd:"%d நாட்கள்",M:"ஒரு மாதம்",MM:"%d மாதங்கள்",y:"ஒரு வருடம்",yy:"%d ஆண்டுகள்"},ordinalParse:/\d{1,2}வது/,ordinal:function(a){return a+"வது"},meridiemParse:/யாமம்|வைகறை|காலை|நண்பகல்|எற்பாடு|மாலை/,meridiem:function(a,b,c){return 2>a?" யாமம்":6>a?" வைகறை":10>a?" காலை":14>a?" நண்பகல்":18>a?" எற்பாடு":22>a?" மாலை":" யாமம்"},meridiemHour:function(a,b){return 12===a&&(a=0),"யாமம்"===b?2>a?a:a+12:"வைகறை"===b||"காலை"===b?a:"நண்பகல்"===b&&a>=10?a:a+12},week:{dow:0,doy:6}}),nf.defineLocale("th",{months:"มกราคม_กุมภาพันธ์_มีนาคม_เมษายน_พฤษภาคม_มิถุนายน_กรกฎาคม_สิงหาคม_กันยายน_ตุลาคม_พฤศจิกายน_ธันวาคม".split("_"),monthsShort:"มกรา_กุมภา_มีนา_เมษา_พฤษภา_มิถุนา_กรกฎา_สิงหา_กันยา_ตุลา_พฤศจิกา_ธันวา".split("_"),weekdays:"อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์".split("_"),weekdaysShort:"อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัส_ศุกร์_เสาร์".split("_"),weekdaysMin:"อา._จ._อ._พ._พฤ._ศ._ส.".split("_"),longDateFormat:{LT:"H นาฬิกา m นาที",LTS:"LT s วินาที",L:"YYYY/MM/DD",LL:"D MMMM YYYY",LLL:"D MMMM YYYY เวลา LT",LLLL:"วันddddที่ D MMMM YYYY เวลา LT"},meridiemParse:/ก่อนเที่ยง|หลังเที่ยง/,isPM:function(a){return"หลังเที่ยง"===a},meridiem:function(a,b,c){return 12>a?"ก่อนเที่ยง":"หลังเที่ยง"},calendar:{sameDay:"[วันนี้ เวลา] LT",nextDay:"[พรุ่งนี้ เวลา] LT",nextWeek:"dddd[หน้า เวลา] LT",lastDay:"[เมื่อวานนี้ เวลา] LT",lastWeek:"[วัน]dddd[ที่แล้ว เวลา] LT",sameElse:"L"},relativeTime:{future:"อีก %s",past:"%sที่แล้ว",s:"ไม่กี่วินาที",m:"1 นาที",mm:"%d นาที",h:"1 ชั่วโมง",hh:"%d ชั่วโมง",d:"1 วัน",dd:"%d วัน",M:"1 เดือน",MM:"%d เดือน",y:"1 ปี",yy:"%d ปี"}}),nf.defineLocale("tl-ph",{months:"Enero_Pebrero_Marso_Abril_Mayo_Hunyo_Hulyo_Agosto_Setyembre_Oktubre_Nobyembre_Disyembre".split("_"),monthsShort:"Ene_Peb_Mar_Abr_May_Hun_Hul_Ago_Set_Okt_Nob_Dis".split("_"),weekdays:"Linggo_Lunes_Martes_Miyerkules_Huwebes_Biyernes_Sabado".split("_"),weekdaysShort:"Lin_Lun_Mar_Miy_Huw_Biy_Sab".split("_"),weekdaysMin:"Li_Lu_Ma_Mi_Hu_Bi_Sab".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"MM/D/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY LT",LLLL:"dddd, MMMM DD, YYYY LT"},calendar:{sameDay:"[Ngayon sa] LT",nextDay:"[Bukas sa] LT",nextWeek:"dddd [sa] LT",lastDay:"[Kahapon sa] LT",lastWeek:"dddd [huling linggo] LT",sameElse:"L"},relativeTime:{future:"sa loob ng %s",past:"%s ang nakalipas",s:"ilang segundo",m:"isang minuto",mm:"%d minuto",h:"isang oras",hh:"%d oras",d:"isang araw",dd:"%d araw",M:"isang buwan",MM:"%d buwan",y:"isang taon",yy:"%d taon"},ordinalParse:/\d{1,2}/,ordinal:function(a){return a},week:{dow:1,doy:4}}),{1:"'inci",5:"'inci",8:"'inci",70:"'inci",80:"'inci",2:"'nci",7:"'nci",20:"'nci",50:"'nci",3:"'üncü",4:"'üncü",100:"'üncü",6:"'ncı",9:"'uncu",10:"'uncu",30:"'uncu",60:"'ıncı",90:"'ıncı"}),fg=(nf.defineLocale("tr",{months:"Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık".split("_"),monthsShort:"Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara".split("_"),weekdays:"Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi".split("_"),weekdaysShort:"Paz_Pts_Sal_Çar_Per_Cum_Cts".split("_"),weekdaysMin:"Pz_Pt_Sa_Ça_Pe_Cu_Ct".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[bugün saat] LT",nextDay:"[yarın saat] LT",nextWeek:"[haftaya] dddd [saat] LT",lastDay:"[dün] LT",lastWeek:"[geçen hafta] dddd [saat] LT",sameElse:"L"},relativeTime:{future:"%s sonra",past:"%s önce",s:"birkaç saniye",m:"bir dakika",mm:"%d dakika",h:"bir saat",hh:"%d saat",d:"bir gün",dd:"%d gün",M:"bir ay",MM:"%d ay",y:"bir yıl",yy:"%d yıl"},ordinalParse:/\d{1,2}'(inci|nci|üncü|ncı|uncu|ıncı)/,ordinal:function(a){if(0===a)return a+"'ıncı";var b=a%10,c=a%100-b,d=a>=100?100:null;return a+(eg[b]||eg[c]||eg[d])},week:{dow:1,doy:7}}),nf.defineLocale("tzm-latn",{months:"innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir".split("_"),monthsShort:"innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir".split("_"),weekdays:"asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),weekdaysShort:"asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),weekdaysMin:"asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[asdkh g] LT",nextDay:"[aska g] LT",nextWeek:"dddd [g] LT",lastDay:"[assant g] LT",lastWeek:"dddd [g] LT",sameElse:"L"},relativeTime:{future:"dadkh s yan %s",past:"yan %s",s:"imik",m:"minuḍ",mm:"%d minuḍ",h:"saɛa",hh:"%d tassaɛin",d:"ass",dd:"%d ossan",M:"ayowr",MM:"%d iyyirn",y:"asgas",yy:"%d isgasn"},week:{dow:6,doy:12}}),nf.defineLocale("tzm",{months:"ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ".split("_"),monthsShort:"ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ".split("_"),weekdays:"ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),weekdaysShort:"ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),weekdaysMin:"ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[ⴰⵙⴷⵅ ⴴ] LT",nextDay:"[ⴰⵙⴽⴰ ⴴ] LT",nextWeek:"dddd [ⴴ] LT",lastDay:"[ⴰⵚⴰⵏⵜ ⴴ] LT",lastWeek:"dddd [ⴴ] LT",sameElse:"L"},relativeTime:{future:"ⴷⴰⴷⵅ ⵙ ⵢⴰⵏ %s",past:"ⵢⴰⵏ %s",s:"ⵉⵎⵉⴽ",m:"ⵎⵉⵏⵓⴺ",mm:"%d ⵎⵉⵏⵓⴺ",h:"ⵙⴰⵄⴰ",hh:"%d ⵜⴰⵙⵙⴰⵄⵉⵏ",d:"ⴰⵙⵙ",dd:"%d oⵙⵙⴰⵏ",M:"ⴰⵢoⵓⵔ",MM:"%d ⵉⵢⵢⵉⵔⵏ",y:"ⴰⵙⴳⴰⵙ",yy:"%d ⵉⵙⴳⴰⵙⵏ"},week:{dow:6,doy:12}}),nf.defineLocale("uk",{months:Dd,monthsShort:"січ_лют_бер_квіт_трав_черв_лип_серп_вер_жовт_лист_груд".split("_"),weekdays:Ed,weekdaysShort:"нд_пн_вт_ср_чт_пт_сб".split("_"),weekdaysMin:"нд_пн_вт_ср_чт_пт_сб".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY р.",LLL:"D MMMM YYYY р., LT",LLLL:"dddd, D MMMM YYYY р., LT"},calendar:{sameDay:Fd("[Сьогодні "),nextDay:Fd("[Завтра "),lastDay:Fd("[Вчора "),nextWeek:Fd("[У] dddd ["),lastWeek:function(){switch(this.day()){case 0:case 3:case 5:case 6:return Fd("[Минулої] dddd [").call(this);case 1:case 2:case 4:return Fd("[Минулого] dddd [").call(this)}},sameElse:"L"},relativeTime:{future:"за %s",past:"%s тому",s:"декілька секунд",m:Cd,mm:Cd,h:"годину",hh:Cd,d:"день",dd:Cd,M:"місяць",MM:Cd,y:"рік",yy:Cd},meridiemParse:/ночі|ранку|дня|вечора/,isPM:function(a){return/^(дня|вечора)$/.test(a)},meridiem:function(a,b,c){return 4>a?"ночі":12>a?"ранку":17>a?"дня":"вечора"},ordinalParse:/\d{1,2}-(й|го)/,ordinal:function(a,b){switch(b){case"M":case"d":case"DDD":case"w":case"W":return a+"-й";case"D":return a+"-го";default:return a}},week:{dow:1,doy:7}}),nf.defineLocale("uz",{months:"январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split("_"),monthsShort:"янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек".split("_"),weekdays:"Якшанба_Душанба_Сешанба_Чоршанба_Пайшанба_Жума_Шанба".split("_"),weekdaysShort:"Якш_Душ_Сеш_Чор_Пай_Жум_Шан".split("_"),weekdaysMin:"Як_Ду_Се_Чо_Па_Жу_Ша".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"D MMMM YYYY, dddd LT"},calendar:{sameDay:"[Бугун соат] LT [да]",nextDay:"[Эртага] LT [да]",nextWeek:"dddd [куни соат] LT [да]",lastDay:"[Кеча соат] LT [да]",lastWeek:"[Утган] dddd [куни соат] LT [да]",sameElse:"L"},relativeTime:{future:"Якин %s ичида",past:"Бир неча %s олдин",s:"фурсат",m:"бир дакика",mm:"%d дакика",h:"бир соат",hh:"%d соат",d:"бир кун",dd:"%d кун",M:"бир ой",MM:"%d ой",y:"бир йил",yy:"%d йил"},week:{dow:1,doy:7}}),nf.defineLocale("vi",{months:"tháng 1_tháng 2_tháng 3_tháng 4_tháng 5_tháng 6_tháng 7_tháng 8_tháng 9_tháng 10_tháng 11_tháng 12".split("_"),monthsShort:"Th01_Th02_Th03_Th04_Th05_Th06_Th07_Th08_Th09_Th10_Th11_Th12".split("_"),weekdays:"chủ nhật_thứ hai_thứ ba_thứ tư_thứ năm_thứ sáu_thứ bảy".split("_"),weekdaysShort:"CN_T2_T3_T4_T5_T6_T7".split("_"),weekdaysMin:"CN_T2_T3_T4_T5_T6_T7".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM [năm] YYYY",LLL:"D MMMM [năm] YYYY LT",LLLL:"dddd, D MMMM [năm] YYYY LT",l:"DD/M/YYYY",ll:"D MMM YYYY",lll:"D MMM YYYY LT",llll:"ddd, D MMM YYYY LT"},calendar:{sameDay:"[Hôm nay lúc] LT",nextDay:"[Ngày mai lúc] LT",nextWeek:"dddd [tuần tới lúc] LT",lastDay:"[Hôm qua lúc] LT",lastWeek:"dddd [tuần rồi lúc] LT",sameElse:"L"},relativeTime:{future:"%s tới",past:"%s trước",s:"vài giây",m:"một phút",mm:"%d phút",h:"một giờ",hh:"%d giờ",d:"một ngày",dd:"%d ngày",M:"một tháng",MM:"%d tháng",y:"một năm",yy:"%d năm"},ordinalParse:/\d{1,2}/,ordinal:function(a){return a},week:{dow:1,doy:4}}),nf.defineLocale("zh-cn",{months:"一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),weekdays:"星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),weekdaysShort:"周日_周一_周二_周三_周四_周五_周六".split("_"),weekdaysMin:"日_一_二_三_四_五_六".split("_"),longDateFormat:{LT:"Ah点mm分",LTS:"Ah点m分s秒",L:"YYYY-MM-DD",LL:"YYYY年MMMD日",LLL:"YYYY年MMMD日LT",LLLL:"YYYY年MMMD日ddddLT",l:"YYYY-MM-DD",ll:"YYYY年MMMD日",lll:"YYYY年MMMD日LT",llll:"YYYY年MMMD日ddddLT"},meridiemParse:/凌晨|早上|上午|中午|下午|晚上/,meridiemHour:function(a,b){return 12===a&&(a=0),"凌晨"===b||"早上"===b||"上午"===b?a:"下午"===b||"晚上"===b?a+12:a>=11?a:a+12},meridiem:function(a,b,c){var d=100*a+b;return 600>d?"凌晨":900>d?"早上":1130>d?"上午":1230>d?"中午":1800>d?"下午":"晚上"},calendar:{sameDay:function(){return 0===this.minutes()?"[今天]Ah[点整]":"[今天]LT"},nextDay:function(){return 0===this.minutes()?"[明天]Ah[点整]":"[明天]LT"},lastDay:function(){return 0===this.minutes()?"[昨天]Ah[点整]":"[昨天]LT"},nextWeek:function(){var a,b;return a=nf().startOf("week"),b=this.unix()-a.unix()>=604800?"[下]":"[本]",0===this.minutes()?b+"dddAh点整":b+"dddAh点mm"},lastWeek:function(){var a,b;return a=nf().startOf("week"),b=this.unix()<a.unix()?"[上]":"[本]",0===this.minutes()?b+"dddAh点整":b+"dddAh点mm"},sameElse:"LL"},ordinalParse:/\d{1,2}(日|月|周)/,ordinal:function(a,b){switch(b){case"d":case"D":case"DDD":return a+"日";case"M":return a+"月";case"w":case"W":return a+"周";default:return a}},relativeTime:{future:"%s内",past:"%s前",s:"几秒",m:"1 分钟",mm:"%d 分钟",h:"1 小时",hh:"%d 小时",d:"1 天",dd:"%d 天",M:"1 个月",MM:"%d 个月",y:"1 年",yy:"%d 年"},week:{dow:1,doy:4}}),nf.defineLocale("zh-tw",{months:"一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),weekdays:"星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),weekdaysShort:"週日_週一_週二_週三_週四_週五_週六".split("_"),weekdaysMin:"日_一_二_三_四_五_六".split("_"),longDateFormat:{LT:"Ah點mm分",LTS:"Ah點m分s秒",L:"YYYY年MMMD日",LL:"YYYY年MMMD日",LLL:"YYYY年MMMD日LT",LLLL:"YYYY年MMMD日ddddLT",l:"YYYY年MMMD日",ll:"YYYY年MMMD日",lll:"YYYY年MMMD日LT",llll:"YYYY年MMMD日ddddLT"},meridiemParse:/早上|上午|中午|下午|晚上/,meridiemHour:function(a,b){return 12===a&&(a=0),"早上"===b||"上午"===b?a:"中午"===b?a>=11?a:a+12:"下午"===b||"晚上"===b?a+12:void 0},meridiem:function(a,b,c){var d=100*a+b;

        return 900>d?"早上":1130>d?"上午":1230>d?"中午":1800>d?"下午":"晚上"},calendar:{sameDay:"[今天]LT",nextDay:"[明天]LT",nextWeek:"[下]ddddLT",lastDay:"[昨天]LT",lastWeek:"[上]ddddLT",sameElse:"L"},ordinalParse:/\d{1,2}(日|月|週)/,ordinal:function(a,b){switch(b){case"d":case"D":case"DDD":return a+"日";case"M":return a+"月";case"w":case"W":return a+"週";default:return a}},relativeTime:{future:"%s內",past:"%s前",s:"幾秒",m:"一分鐘",mm:"%d分鐘",h:"一小時",hh:"%d小時",d:"一天",dd:"%d天",M:"一個月",MM:"%d個月",y:"一年",yy:"%d年"}}),nf);return fg});
},{}],4:[function(require,module,exports){
'use strict';

require('angular-ui-route');

var app = angular.module('elyoosApp', [
    'ui.router',
    'ngSanitize',
    'ngCookies',
    'ngAnimate',
    'ngResource',
    'ngMessages',
    'ngMaterial'
]);

app.constant('VERSION', require('../../package.json').version);

require('templates');

var setMaterialDesignSettings = function ($mdThemingProvider, $mdIconProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('indigo')
        .accentPalette('red');

    $mdThemingProvider.theme('error-toast');

    $mdIconProvider.iconSet('system', 'app/img/system.svg', 24);
    $mdIconProvider.iconSet('rating', 'app/img/rating.svg', 24);
    $mdIconProvider.iconSet('nav', 'app/img/navigation.svg', 24);
    $mdIconProvider.iconSet('sidenavHeader', 'app/img/sideNavHeader.svg', 24);
    $mdIconProvider.iconSet('navFAB', 'app/img/fabNavigation.svg', 24);
    $mdIconProvider.iconSet('createBlog', 'app/img/createBlog.svg', 24);
    $mdIconProvider.iconSet('cardActions', 'app/img/cardActions.svg', 24);
};

app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider', '$compileProvider', '$mdThemingProvider',
    '$mdIconProvider',
    function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider, $compileProvider, $mdThemingProvider,
              $mdIconProvider) {

        $compileProvider.debugInfoEnabled(false);

        $urlRouterProvider.otherwise('/home/');
        $urlRouterProvider.when('', '/home/');

        $stateProvider
            .state('home', {
                url: '/home/{cache}',
                views: {
                    content: {
                        template: '<ely-home></ely-home>'
                    }
                },
                data: {hasBackNav: false}
            })
            .state('checkLoginState', {
                url: '/',
                views: {
                    content: {
                        template: '<ely-check-login-state></ely-check-login-state>'
                    }
                }
            });

        $locationProvider.html5Mode(true);

        $httpProvider.interceptors.push(['$q', '$location', 'loginStateHandler', function ($q, $location, loginStateHandler) {
            return {
                'responseError': function (response) {
                    if (response.status === 401 || response.status === 403) {
                        loginStateHandler.logoutEvent();
                        $location.path('/login');
                    }
                    return $q.reject(response);
                }
            };
        }]);

        setMaterialDesignSettings($mdThemingProvider, $mdIconProvider);

    }]).run(['$rootScope', '$state', 'CheckLoginStateParamsContainer', 'loginStateHandler', 'userInfo',
    function ($rootScope, $state, CheckLoginStateParamsContainer, loginStateHandler, userInfo) {
        var firstRun = true;

        loginStateHandler.register(userInfo);

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
            if (firstRun) {
                firstRun = false;
                event.preventDefault();
                CheckLoginStateParamsContainer.setParams(toState.name, toParams);
                $state.go('checkLoginState', null, {location: false});
            }
        });
    }]);
},{"../../package.json":328,"angular-ui-route":2,"templates":1}],5:[function(require,module,exports){
'use strict';

module.exports = ['$http', 'loginStateHandler', '$q', function ($http, loginStateHandler, $q) {

    this.login = function (user) {
        var deferred = $q.defer();
        $http.post('/api/login', user).success(function (loggedinUser) {
            loginStateHandler.loginEvent();
            deferred.resolve(loggedinUser);
        }).error(deferred.reject);
        return deferred.promise;
    };
    this.logout = function () {
        var deferred = $q.defer();
        $http.post('/api/logout').success(function () {
            loginStateHandler.logoutEvent();
            deferred.resolve();
        }).error(deferred.reject);
        return deferred.promise;
    };
}];

},{}],6:[function(require,module,exports){
'use strict';

module.exports = ['$state', 'IsAuth', 'loginStateHandler', 'CheckLoginStateParamsContainer',
    function ($state, IsAuth, loginStateHandler, CheckLoginStateParamsContainer) {

    var isAuth = IsAuth.get(null, function () {
        if (isAuth.isLoggedIn) {
            loginStateHandler.loginEvent();
            if(CheckLoginStateParamsContainer.getNext() !== 'login' && CheckLoginStateParamsContainer.getNext() !== 'checkLoginState' ) {
                $state.go(CheckLoginStateParamsContainer.getNext(), CheckLoginStateParamsContainer.getParams());
            } else {
                $state.go('home');
            }
        } else {
            loginStateHandler.logoutEvent();
            $state.go('login');
        }
    });
}];
},{}],7:[function(require,module,exports){
'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: 'app/modules/auth/checkLoginState/template.html',
            controllerAs: 'ctrl',
            controller: require('./controller.js')
        };
    }],
    name: 'elyCheckLoginState'
};

},{"./controller.js":6}],8:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.service('IsAuth', require('./isAuth'));
app.service('CheckLoginStateParamsContainer', require('./paramsContainer'));

app.directive(directive.name, directive.directive);

},{"./directive.js":7,"./isAuth":9,"./paramsContainer":10}],9:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/user/auth');
}];

},{}],10:[function(require,module,exports){
'use strict';


module.exports = [
    function () {
        var params;
        var next;

        this.setParams = function (newNext, newParams) {
            params = newParams;
            next = newNext;
        };

        this.getParams = function () {
            return params;
        };

        this.getNext = function () {
            return next;
        };
    }];

},{}],11:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');

app.controller('RegisterCtrl', require('./registerCtrl'));

app.factory('Register', require('./register'));

app.service('Auth', require('./auth'));

app.config(['$stateProvider', function ($stateProvider) {

    $stateProvider
        .state('login', {
            url: '/login',
            views: {
                'content@': {
                    template: '<ely-login></ely-login>'
                }
            },
            isPublic: true
        })
        .state('register', {
            url: '/register',
            views: {
                'content@': {
                    templateUrl: 'app/modules/auth/register.html',
                    controller: 'RegisterCtrl'
                }
            }
        });
}]);
},{"./auth":5,"./register":15,"./registerCtrl":16}],12:[function(require,module,exports){
'use strict';

module.exports = ['$scope', '$state', 'Auth', 'UrlCache', 'IsAuth', function ($scope, $state, Auth, UrlCache, IsAuth) {
    var ctrl = this;

    ctrl.loginRunning = false;

    ctrl.login = function () {
        delete ctrl.error;
        ctrl.loginRunning = true;
        //First do a get request to get the correct csrf token
        IsAuth.get(null, function () {
            Auth.login({
                username: ctrl.loginuser.email,
                password: ctrl.loginuser.password
            }).then(function () {
                ctrl.loginRunning = false;
                UrlCache.reset();
                $scope.$broadcast('elyoos.login');
                $state.go('home');
            }, function () {
                ctrl.loginRunning = false;
                ctrl.error = "Benuztername existiert nicht oder das Passwort ist falsch!";
            });
        }, function () {
            ctrl.loginRunning = false;
            ctrl.error = "Unbekannter Fehler beim Anmelden. Versuche es später noch einmal.";
        });
    };
}];
},{}],13:[function(require,module,exports){
'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: 'app/modules/auth/login/template.html',
            controllerAs: 'ctrl',
            controller: require('./controller.js')
        };
    }],
    name: 'elyLogin'
};

},{"./controller.js":12}],14:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

},{"./directive.js":13}],15:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/register');
}];

},{}],16:[function(require,module,exports){
'use strict';

module.exports = ['$scope', 'Register', 'moment', 'CountryCodeConverter',
    function ($scope, Register, moment, CountryCodeConverter) {

        var isDateValid = function (date) {
            return moment(date, 'l', moment.locale(), true).isValid();
        };

        $scope.userDataToChange = {};
        $scope.countryCodes = CountryCodeConverter.countryCodes;
        $scope.selectedCountryCode = '';
        $scope.submitFailed = false;
        $scope.submitFailedToServer = false;
        $scope.successUserDataChange = false;

        $scope.submitProfileData = function () {
            if (!$scope.profileForm.$invalid) {
                $scope.submitFailed = false;

                var submittedUser = {
                    email: $scope.userDataToChange.email,
                    password: $scope.userDataToChange.password,
                    forename: $scope.userDataToChange.forename,
                    surname: $scope.userDataToChange.surname,
                    birthday: moment.utc($scope.userDataToChange.birthday, 'l', moment.locale(), true).valueOf() / 1000,
                    country: CountryCodeConverter.getCountryCode($scope.selectedCountryCode),
                    female: $scope.userDataToChange.female
                };
                if (submittedUser.country) {
                    Register.save(submittedUser, function () {
                        $scope.profileForm.$setPristine();
                        $scope.successUserDataChange = true;
                        $scope.submitFailedToServer = false;
                    }, function () {
                        $scope.submitFailedToServer = true;
                        $scope.successUserDataChange = false;
                    });
                } else {
                    $scope.submitFailed = true;
                }
            } else {
                $scope.submitFailed = true;
            }
        };

        $scope.getDateExample = function () {
            var unixTimestamp = 385974036;
            return moment.unix(unixTimestamp).format('l');
        };

        $scope.$watch('userDataToChange.birthday', function (newBirthday) {
            if (newBirthday && $scope.profileForm && $scope.profileForm.inputBirthday) {
                $scope.profileForm.inputBirthday.$setValidity('date', isDateValid(newBirthday));
            }
        });
    }];

},{}],17:[function(require,module,exports){
'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$scope', function ($scope) {

            $scope.expand = function () {
                $scope.expanded = true;
                if ($scope.maxHeight) {
                    $scope.descriptionStyle = {'max-height': $scope.maxHeight, 'overflow-y': 'auto'};
                } else {
                    $scope.descriptionStyle = {'max-height': 'none'};
                }

            };
        }];
    }
};

},{}],18:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');
var link = require('./link.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                description: '@',
                maxHeight: '@'
            },
            templateUrl: 'app/modules/common/expandText/template.html',
            controller: controller.directiveCtrl(),
            link: link.directiveLink()
        };
    }],
    name: 'elyExpandText'
};

},{"./controller.js":17,"./link.js":20}],19:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"./directive.js":18,"dup":14}],20:[function(require,module,exports){
'use strict';

module.exports = {
    directiveLink: function () {
        return function ($scope, element) {

            $scope.$watch('description', function (newDescription) {
                    var textElement = element.find('.ely-expand-text-description');
                    if (newDescription && textElement.length > 0) {
                        if (textElement[0].scrollHeight > textElement[0].clientHeight) {
                            $scope.showExpand = true;
                        }
                    }
                }
            );
        };
    }
};

},{}],21:[function(require,module,exports){
'use strict';

var setShowError = function ($scope) {
    if ($scope.showErrorMaxLength || $scope.showErrorRequired || $scope.showErrorCustom) {
        $scope.showError = true;
    } else {
        $scope.showError = false;
    }
};

var setError = function ($scope, newValue, errorName, errorDescription) {
    if (newValue) {
        $scope[errorName] = true;
        $scope.lastErrorDescription.unshift({title: errorDescription});
        $scope.errorDescription = $scope.lastErrorDescription[0];
    } else {
        $scope.lastErrorDescription.shift();
        if ($scope.lastErrorDescription.length > 0) {
            $scope.errorDescription = $scope.lastErrorDescription[0];
        }

        $scope[errorName] = false;
    }
    setShowError($scope);
};

module.exports = {
    directiveCtrl: function () {
        return ['$scope', function ($scope) {

            $scope.lastErrorDescription = [];
            $scope.showErrorCounter = 0;

            $scope.$watch(function () {
                return $scope.profileForm[$scope.inputName].$error.maxlength;
            }, function (newValue) {
                setError($scope, newValue, 'showErrorMaxLength', 'Darf maximal ' + $scope.maxLength + ' Zeichen haben');
            });

            $scope.$watch(function () {
                return $scope.profileForm[$scope.inputName].$error.required;
            }, function (newValue) {
                setError($scope, newValue, 'showErrorRequired', $scope.label + ' wird ben\u00f6tigt');
            });

            $scope.$watch(function () {
                return $scope.profileForm[$scope.inputName].$error.custom;
            }, function (newValue) {
                setError($scope, newValue, 'showErrorCustom', $scope.customErrorDescription);
            });
        }];
    }
};

},{}],22:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                label: '@',
                inputName: '@',
                inputPlaceholder: '@',
                showWithoutLabel: '@',
                profileForm: '=',
                submitModel: '=',
                maxLength: '@',
                minLength: '@',
                elyRequired: '@',
                customErrorDescription: '@'
            },
            templateUrl: 'app/modules/common/formTextInput/template.html',
            controller: controller.directiveCtrl()
        };
    }],
    name: 'elyFormTextInput'
};

},{"./controller.js":21}],23:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"./directive.js":22,"dup":14}],24:[function(require,module,exports){
'use strict';

var link = require('./link');

module.exports = {
    directive: ['$sce', function ($sce) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/modules/common/iframe/template.html',
            scope: {
                secureLink: '@',
                width: '@',
                height: '@',
                src: '='
            },
            link: link.directiveLink($sce)
        };
    }],
    name: 'elyIframe'
};

},{"./link":26}],25:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"./directive.js":24,"dup":14}],26:[function(require,module,exports){
'use strict';


module.exports = {
    directiveLink: function ($sce) {
        return function ($scope) {
            $scope.$watch('src', function (newSrc) {
                if (newSrc && $scope.secureLink && angular.isString(newSrc) && newSrc.search($scope.secureLink) !== -1) {
                    $scope.link = $sce.trustAsResourceUrl($scope.secureLink + newSrc.replace($scope.secureLink, ''));
                } else {
                    $scope.link = '';
                }
            });
        };
    }
};

},{}],27:[function(require,module,exports){
'use strict';

var previousHeight, previousWidth;

var checkRatio = function (ctrl, $image) {
    var size, ratio;
    if (ctrl.minRatio && ctrl.maxRatio && previousHeight && previousWidth) {
        size = $image.cropper('getCropBoxData');
        if (previousHeight !== size.height || previousWidth !== size.width) {
            ratio = size.height / size.width;
            if (ratio < ctrl.minRatio || ratio > ctrl.maxRatio) {
                $image.cropper('setCropBoxData', {
                    left: size.left,
                    top: size.top,
                    width: previousWidth,
                    height: previousHeight
                });
                return;
            }
            previousHeight = size.height;
            previousWidth = size.width;
        }
    }
};

module.exports = {
    directiveCtrl: function () {
        return ['$element', function ($element) {
            var ctrl = this;
            var $image = $($element.find('img')[0]),
                cropperSettings = {
                    minCropBoxWidth: 200,
                    minCropBoxHeight: 200,
                    guides: false,
                    zoomable: false,
                    rotatable: false,
                    built: function () {
                        var size = $image.cropper('getImageData'), cropWidth;
                        if (this.originalSize) {
                            this.originalSize(size.naturalWidth, size.naturalHeight);
                        }
                        if (this.minRatio && this.maxRatio) {
                            cropWidth = size.height / this.maxRatio;
                            $image.cropper('setCropBoxData', {
                                left: (size.width - cropWidth) / 2,
                                top: 0,
                                width: cropWidth,
                                height: size.height
                            });
                            previousHeight = size.height;
                            previousWidth = cropWidth;
                        }
                    },
                    crop: function () {
                        checkRatio(ctrl, $image);
                    }
                };

            if (this.ratio) {
                cropperSettings.aspectRatio = this.ratio;
            }
            if (this.minWidth) {
                cropperSettings.minCropBoxWidth = this.minWidth;
            }
            if (this.minHeight) {
                cropperSettings.minCropBoxHeight = this.minHeight;
            }

            $image.cropper(cropperSettings);

            this.commands.getData = function () {
                ctrl.imageResultData($image.cropper('getCroppedCanvas'));
            };

            this.commands.setImage = function (image) {
                $image.cropper('reset', true).cropper('replace', image);
            };

            /*$scope.$on('image.cropper.set.ratio', function (event, ratio) {
                $image.cropper('setAspectRatio', ratio);
            });

            $scope.$watch('image', function (newImage) {
                if (newImage) {
                    $image.cropper('reset', true).cropper('replace', newImage);
                }
            });*/
        }];
    }
};

},{}],28:[function(require,module,exports){
'use strict';

var controller = require('./controller');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/modules/common/imageCropper/template.html',
            scope: {},
            bindToController: {
                commands: '=',
                imageResultData: '=',
                originalSize: '=',
                ratio: '@',
                minRatio: '@',
                maxRatio: '@',
                minHeight: '@',
                minWidth: '@'
            },
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl'
        };
    }],
    name: 'elyImageCropper'
};

},{"./controller":27}],29:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"./directive.js":28,"dup":14}],30:[function(require,module,exports){
'use strict';

var link = require('./link.js');

module.exports = {
    directive: [ function () {
        return {
            scope: {elyInfiniteScroll: '&'},
            link: link.directiveLink()
        };
    }],
    name: 'elyInfiniteScroll'
};

},{"./link.js":32}],31:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"./directive.js":30,"dup":14}],32:[function(require,module,exports){
'use strict';


module.exports = {
    directiveLink: function () {
        return function (scope, elm) {
            var raw = elm[0];

            elm.bind('scroll', function () {
                if ((raw.scrollTop * 1.2 ) + raw.offsetHeight >= raw.scrollHeight) {
                    return scope.$apply(scope.elyInfiniteScroll);
                }
            });
        };
    }
};

},{}],33:[function(require,module,exports){
'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: 'app/modules/common/loadScreen/template.html',
            controller: function () {
            }
        };
    }],
    name: 'elyLoadScreen'
};

},{}],34:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"./directive.js":33,"dup":14}],35:[function(require,module,exports){
'use strict';

var resetPagination = function ($scope, totalItems) {
    $scope.currentPagination = 1;
    $scope.currentPaginationRange = Math.ceil(totalItems / $scope.itemsPerPage);
};

module.exports = {
    directiveCtrl: function () {
        return ['$scope', function ($scope) {
            var lastValidTotalItems;
            $scope.currentPagination = 1;
            $scope.currentPaginationRange = 1;

            $scope.$watch($scope.totalItems, function (newTotalItems) {
                if (newTotalItems && $scope.itemsPerPage) {
                    newTotalItems = parseInt(newTotalItems, 10);
                    if (!lastValidTotalItems || newTotalItems !== lastValidTotalItems) {
                        lastValidTotalItems = newTotalItems;
                        resetPagination($scope, newTotalItems);
                    }
                }
            });

            $scope.$on('pagination.next.previous.reset', function () {
                $scope.currentPagination = 1;
            });

            $scope.clickPrevious = function () {
                if ($scope.currentPagination > 1) {
                    $scope.currentPagination = $scope.currentPagination - 1;
                    $scope.getPaginationSet($scope.currentPagination);
                }
            };

            $scope.clickNext = function () {
                if ($scope.currentPagination < $scope.currentPaginationRange) {
                    $scope.currentPagination = $scope.currentPagination + 1;
                    $scope.getPaginationSet($scope.currentPagination);
                }
            };
        }];
    }
};

},{}],36:[function(require,module,exports){
'use strict';
var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                totalItems: '&',
                itemsPerPage: '@',
                getPaginationSet: '='
            },
            templateUrl: 'app/modules/common/paginationNextPrevious/template.html',
            controller: controller.directiveCtrl()
        };
    }],
    name: 'elyPaginationNextPrevious'
};

},{"./controller.js":35}],37:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"./directive.js":36,"dup":14}],38:[function(require,module,exports){
'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$scope', function ($scope) {
            $scope.sendGetQuery = function ($event) {
                if ($event.keyCode === 13) {
                    $scope.getQuery($scope.query);
                }
            };

            $scope.$on('$typeahead.select', function (value, index) {
                $scope.getQuery(index);
            });
        }];
    }
};

},{}],39:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                description: '@',
                query: '=',
                getQuerySuggestion: '=',
                getQuery: '='
            },
            templateUrl: 'app/modules/common/searchBox/template.html',
            controller: controller.directiveCtrl()
        };
    }],
    name: 'elySearchBox'
};

},{"./controller.js":38}],40:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"./directive.js":39,"dup":14}],41:[function(require,module,exports){
'use strict';

var resetMessageNotification = function ($scope) {
    $scope.showError = false;
    $scope.showSuccess = false;
};

module.exports = {
    directiveCtrl: function () {
        return ['$scope', function ($scope) {

            var originalModel, lastModel;

            $scope.categoryFinishedButtonDisabled = true;

            resetMessageNotification($scope);

            $scope.$watchCollection('model', function (newValue) {

                if (newValue.isInit && !originalModel) {
                    originalModel = {};
                    angular.copy($scope.model, originalModel);
                }
                if (originalModel && newValue) {
                    lastModel = newValue;
                    if (angular.equals(originalModel, newValue)) {
                        $scope.categoryFinishedButtonDisabled = true;
                    } else {
                        $scope.categoryFinishedButtonDisabled = false;
                        $scope.showSuccess = false;
                    }
                }
            });

            $scope.sendAllData = function () {
                resetMessageNotification($scope);
                $scope.sendData();
            };

            $scope.$on('ely.send.button.error', function (event, errorDescription) {
                $scope.errorDescription = {title: errorDescription};
                $scope.showError = true;
                $scope.showSuccess = false;
            });

            $scope.$on('ely.send.button.success', function () {
                angular.copy($scope.model, originalModel);
                $scope.categoryFinishedButtonDisabled = true;
                $scope.showError = false;
                $scope.showSuccess = true;
            });

            $scope.$on('ely.send.button.model.changed', function (event, newModel) {
                angular.copy(newModel, originalModel);
                $scope.categoryFinishedButtonDisabled = true;
                $scope.showError = false;
                $scope.showSuccess = false;
            });
        }];
    }
};

},{}],42:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                buttonDescription: '@',
                errorPlacement: '@',
                sendData: '=',
                model: '='
            },
            templateUrl: 'app/modules/common/sendButton/template.html',
            controller: controller.directiveCtrl()
        };
    }],
    name: 'elySendButton'
};

},{"./controller.js":41}],43:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"./directive.js":42,"dup":14}],44:[function(require,module,exports){
'use strict';

var setStars = function (starValue, $scope) {

    function setStar (index, iconName) {
        if($scope.star.length < 5) {
            $scope.star.push(iconName);
        } else {
            $scope.star[index] = iconName;
        }
    }

    var i;
    for (i = 0; i < 5; i++) {
        if (i <= starValue) {
            setStar(i, 'full');
        } else if (i - 0.75 <= starValue && i - 0.2 > starValue) {
            setStar(i, 'half');
        } else {
            setStar(i, 'empty');
        }
    }
};

module.exports = {
    directiveCtrl: function () {
        return ['$scope', function ($scope) {

            $scope.isReadonly = $scope.isReadonly === 'true';
            $scope.isSmall = $scope.isSmall === 'true';
            $scope.isXSmall = $scope.isXSmall === 'true';

            if (!$scope.isReadonly) {
                $scope.star = ['empty', 'empty', 'empty', 'empty', 'empty'];
            } else {
                $scope.star = [];
            }

            $scope.mouseOverStar = function (star) {
                if (!$scope.isReadonly) {
                    setStars(star, $scope);
                }
            };

            $scope.resetToSelected = function () {
                if (!$scope.isReadonly) {
                    setStars($scope.numberOfSelectedStars - 1, $scope);
                }
            };

            $scope.starSelected = function (star) {
                if (!$scope.isReadonly) {
                    $scope.numberOfSelectedStars = star;
                }
            };

            $scope.$watch($scope.numberOfSelectedStarsReadonly, function (newValue) {
                if (newValue && newValue > 0) {
                    setStars(newValue - 1, $scope);
                }
            });

        }];
    }
};

},{}],45:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                isReadonly: '@',
                isSmall: '@',
                isXSmall: '@',
                numberOfSelectedStars: '=',
                numberOfSelectedStarsReadonly: '&'
            },
            templateUrl: 'app/modules/common/starRating/template.html',
            controller: controller.directiveCtrl()
        };
    }],
    name: 'elyStarRating'
};

},{"./controller.js":44}],46:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"./directive.js":45,"dup":14}],47:[function(require,module,exports){
'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['UserStateService', 'ContactStatisticTypes', '$state',
            function (UserStateService, ContactStatisticTypes, $state) {
                var ctrl = this;

                ctrl.addContact = function () {
                    UserStateService.addContact(ctrl.user.userId, ctrl.user.name).then(function (type) {
                        ctrl.user.type = type;
                        ContactStatisticTypes.addContactByName(ctrl.user.type);
                    });
                };

                ctrl.deleteContact = function () {
                    UserStateService.deleteContact(ctrl.user.userId).then(function () {
                        ContactStatisticTypes.removeContactByName(ctrl.user.type);
                        delete ctrl.user.type;
                    });
                };

                ctrl.unblockContact = function () {
                    UserStateService.unblockContact(ctrl.user.userId).then(function () {
                        delete ctrl.user.blocked;
                    });
                };

                ctrl.goToDetail = function () {
                    $state.go('user.detail', {userId: ctrl.user.userId});
                };
            }];
    }
};


},{}],48:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            bindToController: {
                user: '='
            },
            templateUrl: 'app/modules/contact/contactPreviewSquare/template.html'
        };
    }],
    name: 'elyContactPreviewSquare'
};

},{"./controller.js":47}],49:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);
},{"./directive.js":48}],50:[function(require,module,exports){
'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['ScrollRequest', 'Contact', 'ContactOverviewResponseHandler', 'UserStateService', 'GroupSettingsService', 'ContactStatisticTypes',
            '$state',
            function (ScrollRequest, Contact, ContactOverviewResponseHandler, UserStateService, GroupSettingsService, ContactStatisticTypes, $state) {
                var ctrl = this;
                var scrollRequestName = 'ContactOverview' + ctrl.statistic.type;
                var requestedContacts = false;
                ctrl.overview = {contacts: []};
                ctrl.isExpanded = false;
                ctrl.hasNext = false;

                ctrl.toggleExpand = function () {
                    if (!requestedContacts && !ctrl.isExpanded) {
                        requestedContacts = true;
                        ctrl.isExpanded = true;
                        ctrl.nextOverview();
                    } else {
                        ctrl.isExpanded = !ctrl.isExpanded;
                    }
                };

                ScrollRequest.reset(scrollRequestName, Contact.get, ContactOverviewResponseHandler);

                ctrl.nextOverview = function () {
                    var params = {types: [ctrl.statistic.type]};
                    ctrl.hasNext = false;
                    ScrollRequest.nextRequest(scrollRequestName, ctrl.overview.contacts, params).then(function (overview) {
                        ctrl.overview = overview;
                        ctrl.hasNext = ScrollRequest.hasNext(scrollRequestName);
                    });
                };

                ctrl.statistic.reloadContact = function () {
                    ctrl.overview = {contacts: []};
                    ScrollRequest.reset(scrollRequestName, Contact.get, ContactOverviewResponseHandler);
                    ctrl.nextOverview();
                };

                ctrl.changeGroupName = function () {

                };

                ctrl.deleteGroup = function () {
                    GroupSettingsService.deleteGroup(ctrl.statistic.type, ctrl.statistic.count);
                };

                ctrl.openGroupSetting = function () {
                    GroupSettingsService.modifyGroupSetting(ctrl.statistic.type);
                };

                ctrl.blockContact = function (contactId) {
                    UserStateService.blockContact(contactId).then(function () {
                        UserStateService.removeContact(ctrl.overview.contacts, contactId);
                        ScrollRequest.removedElement(scrollRequestName);
                        ContactStatisticTypes.removeContact(ctrl.statistic);
                    });
                };

                ctrl.deleteContact = function (contactId) {
                    UserStateService.deleteContact(contactId).then(function () {
                        UserStateService.removeContact(ctrl.overview.contacts, contactId);
                        ScrollRequest.removedElement(scrollRequestName);
                        ContactStatisticTypes.removeContact(ctrl.statistic);
                    });
                };

                ctrl.moveContact = function (contactId, name) {
                    UserStateService.moveContact(contactId, name, ctrl.statistic.type).then(function (newGroup) {
                        UserStateService.removeContact(ctrl.overview.contacts, contactId);
                        ScrollRequest.removedElement(scrollRequestName);
                        ContactStatisticTypes.moveContact(ctrl.statistic, newGroup);
                    });
                };

                ctrl.goToDetail = function (userId) {
                    $state.go('user.detail', {userId: userId});
                };
            }];
    }
};


},{}],51:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            bindToController: {
                statistics: '=',
                statistic: '='
            },
            templateUrl: 'app/modules/contact/contactPreview/template.html'
        };
    }],
    name: 'elyContactPreview'
};

},{"./controller.js":50}],52:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('ContactOverviewResponseHandler', require('./services/scrollRequestResponseHandler'));
},{"./directive.js":51,"./services/scrollRequestResponseHandler":53}],53:[function(require,module,exports){
'use strict';

module.exports = [function () {

    this.handlingResponse = function (newOverview, previousOverview) {
        newOverview.contacts = previousOverview.concat(newOverview.contacts);
    };

    this.checkRequestPinwall = function (overview, requestedNumberOfElements) {
        return overview.numberOfContacts > requestedNumberOfElements;
    };
}];

},{}],54:[function(require,module,exports){
'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['SearchService', 'SearchUsers',
            function (SearchService, SearchUsers) {
                var ctrl = this;
                ctrl.requestRunning = false;
                ctrl.showUserQuery = false;

                SearchService.register(ctrl, SearchUsers.query, SearchUsers.query);

                ctrl.requestStarted = function () {
                    ctrl.requestRunning = true;
                };

                ctrl.requestFinished = function (resp) {
                    ctrl.requestRunning = false;
                    if (angular.isArray(resp)) {
                        ctrl.showUserQuery = true;
                        ctrl.userQueryResult = resp;
                    }
                };

                ctrl.abortSearch = function () {
                    ctrl.requestRunning = false;
                    ctrl.showUserQuery = false;
                    ctrl.userQueryResult = null;
                };
            }];
    }
};


},{}],55:[function(require,module,exports){
'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$state',
            function ($state) {
                var ctrl = this;

                ctrl.openUserDetail = function (userId) {
                    $state.go('user.detail', {userId: userId});
                };
            }];
    }
};


},{}],56:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            bindToController: {
                detail: '='
            },
            templateUrl: 'app/modules/contact/detail/contact/template.html'
        };
    }],
    name: 'elyUserDetailContactsPreview'
};

},{"./controller.js":55}],57:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"./directive.js":56,"dup":14}],58:[function(require,module,exports){
'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['UserDetail', '$stateParams', '$mdMedia', 'ContactStatisticTypes',
            function (UserDetail, $stateParams, $mdMedia, ContactStatisticTypes) {
                var ctrl = this;

                ctrl.$mdMedia = $mdMedia;

                ctrl.userDetail = UserDetail.get({userId: $stateParams.userId}, function () {
                    ContactStatisticTypes.setStatistic(ctrl.userDetail.contactTypeStatistic);
                    ctrl.numberOfGroups = ctrl.userDetail.contactTypeStatistic.length;
                });
            }];
    }
};


},{}],59:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            bindToController: true,
            templateUrl: 'app/modules/contact/detail/template.html'
        };
    }],
    name: 'elyUserDetail'
};

},{"./controller.js":58}],60:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"./directive.js":59,"dup":14}],61:[function(require,module,exports){
'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['UserStateService', 'ContactStatisticTypes', 'ElyModal', '$state',
            function (UserStateService, ContactStatisticTypes, ElyModal, $state) {
                var ctrl = this;

                ctrl.moveContact = function () {
                    UserStateService.moveContact(ctrl.detail.user.userId, ctrl.detail.user.name, ctrl.detail.user.type).then(function (newGroup) {
                        ctrl.detail.user.type = newGroup;
                    });
                };

                ctrl.addContact = function () {
                    UserStateService.addContact(ctrl.detail.user.userId, ctrl.detail.user.name).then(function (type) {
                        ctrl.detail.user.type = type;
                        ContactStatisticTypes.addContactByName(ctrl.detail.user.type);
                    });
                };

                ctrl.deleteContact = function () {
                    UserStateService.deleteContact(ctrl.detail.user.userId).then(function () {
                        ContactStatisticTypes.removeContactByName(ctrl.detail.user.type);
                        delete ctrl.detail.user.type;
                    });
                };

                ctrl.blockContact = function () {
                    UserStateService.blockContact(ctrl.detail.user.userId).then(function () {
                        ctrl.detail.user.blocked = true;
                    });
                };

                ctrl.unblockContact = function () {
                    UserStateService.unblockContact(ctrl.detail.user.userId).then(function () {
                        delete ctrl.detail.user.blocked;
                        delete ctrl.detail.user.type;
                    });
                };

                ctrl.writeMessage = function () {
                    ElyModal.show('CreateMessageCtrl', 'app/modules/messages/conversation/createMessage/template.html',
                        {destinationUserId: ctrl.detail.user.userId, description: ctrl.detail.user.name})
                        .then(function (newMessage) {
                            $state.go('message.threads.detail', {threadId: newMessage.threadId});
                        });
                };
            }];
    }
};


},{}],62:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            bindToController: {
                detail: '=',
                numberOfGroups: '='
            },
            templateUrl: 'app/modules/contact/detail/profile/template.html'
        };
    }],
    name: 'elyUserDetailProfile'
};

},{"./controller.js":61}],63:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"./directive.js":62,"dup":14}],64:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            bindToController: true,
            templateUrl: 'app/modules/contact/template.html'
        };
    }],
    name: 'elyContact'
};

},{"./controller.js":54}],65:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.factory('Contact', require('./services/contact'));
app.factory('ContactStatistic', require('./services/contactStatistic'));
app.factory('UserDetail', require('./services/userDetail'));
app.factory('SearchUsers', require('./services/searchUsers'));
app.factory('Contacting', require('./services/contacting'));

app.service('UserStateService', require('./services/userStateService'));
app.service('ContactStatisticTypes', require('./services/contactStatisticTypes'));

app.config(['$stateProvider', function ($stateProvider) {

    $stateProvider
        .state('contact', {
            abstract: true,
            url: '/contact'
        })
        .state('contact.overview', {
            url: '/overview',
            views: {
                'content@': {
                    template: '<ely-contact></ely-contact>'
                }
            },
            data: {hasSearch: true, searchServiceName: 'contact'}
        })
        .state('user', {
            abstract: true,
            url: '/user'
        })
        .state('user.detail', {
            url: '/details/{userId}',
            views: {
                'content@': {
                    template: '<ely-user-detail></ely-user-detail>'
                }
            },
            data: {hasBackNav: true, backNavToState: true}
        });
}]);
},{"./directive.js":64,"./services/contact":79,"./services/contactStatistic":80,"./services/contactStatisticTypes":81,"./services/contacting":82,"./services/searchUsers":83,"./services/userDetail":84,"./services/userStateService":85}],66:[function(require,module,exports){
'use strict';

module.exports = ['ContactStatisticTypes', '$mdDialog', 'Contact', 'errorToast',
    function (ContactStatisticTypes, $mdDialog, Contact, errorToast) {
        var ctrl = this;

        ctrl.types = ContactStatisticTypes.getTypes();
        if (ctrl.types.length > 0) {
            ctrl.selectedType = ctrl.types[0];
        }

        ctrl.cancel = function () {
            $mdDialog.cancel();
        };

        ctrl.accept = function () {
            ctrl.uploadStarted = true;
            Contact.save({
                contactIds: [ctrl.contactId],
                mode: 'addContact',
                description: ctrl.selectedType
            },function () {
                $mdDialog.hide(ctrl.selectedType);
            }, function () {
                errorToast.showError('Es ist ein Fehler aufgetretten!');
                ctrl.uploadStarted = false;
            });
        };

    }];


},{}],67:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');

app.controller('AddContactController', require('./addContact/controller'));
app.controller('MoveContactController', require('./moveContact/controller'));

},{"./addContact/controller":66,"./moveContact/controller":68}],68:[function(require,module,exports){
'use strict';

module.exports = ['ContactStatisticTypes', '$mdDialog', 'Contact', 'errorToast',
    function (ContactStatisticTypes, $mdDialog, Contact, errorToast) {
        var ctrl = this;

        ctrl.types = ContactStatisticTypes.getTypes(ctrl.previousType);
        if (ctrl.types.length > 0) {
            ctrl.selectedType = ctrl.types[0];
        }

        ctrl.cancel = function () {
            $mdDialog.cancel();
        };

        ctrl.accept = function () {
            ctrl.uploadStarted = true;
            Contact.save({
                contactIds: [ctrl.contactId],
                mode: 'changeState',
                description: ctrl.selectedType
            },function () {
                $mdDialog.hide(ctrl.selectedType);
            }, function () {
                errorToast.showError('Es ist ein Fehler aufgetretten!');
                ctrl.uploadStarted = false;
            });
        };

    }];


},{}],69:[function(require,module,exports){
'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['Contacting', 'ScrollRequest', 'ContactingOverviewResponseHandler',
            function (Contacting, ScrollRequest, ContactingOverviewResponseHandler) {
                var ctrl = this;
                ctrl.users = {contactingUsers: []};

                ScrollRequest.reset('contacting', Contacting.get, ContactingOverviewResponseHandler);

                ctrl.nextContacting = function () {
                    ScrollRequest.nextRequest('contacting', ctrl.users.contactingUsers).then(function (users) {
                        ctrl.users = users;
                    });
                };

                ctrl.nextContacting();
            }];
    }
};


},{}],70:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            bindToController: {},
            templateUrl: 'app/modules/contact/overviewContacting/template.html'
        };
    }],
    name: 'elyContactingOverview'
};

},{"./controller.js":69}],71:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('ContactingOverviewResponseHandler', require('./services/scrollRequestResponseHandler'));
},{"./directive.js":70,"./services/scrollRequestResponseHandler":72}],72:[function(require,module,exports){
'use strict';

module.exports = [function () {

    this.handlingResponse = function (newOverview, previousOverview) {
        newOverview.contactingUsers = previousOverview.concat(newOverview.contactingUsers);
    };

    this.checkRequestPinwall = function (overview, requestedNumberOfElements) {
        return overview.contactingUsers.length === requestedNumberOfElements;
    };
}];

},{}],73:[function(require,module,exports){
'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['ContactStatistic',
            function (ContactStatistic) {
                var ctrl = this;

            }];
    }
};


},{}],74:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            bindToController: {
                users: '='
            },
            templateUrl: 'app/modules/contact/overviewSearchUser/template.html'
        };
    }],
    name: 'elyContactSearchUserOverview'
};

},{"./controller.js":73}],75:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"./directive.js":74,"dup":14}],76:[function(require,module,exports){
'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['ContactStatistic', 'ContactStatisticTypes', 'GroupSettingsService',
            function (ContactStatistic, ContactStatisticTypes, GroupSettingsService) {
                var ctrl = this;

                ctrl.statistics = ContactStatistic.get(function () {
                    ContactStatisticTypes.setStatistic(ctrl.statistics.statistic);
                });

                ctrl.newGroup = function () {
                    GroupSettingsService.addGroup().then(function (groupName) {
                        ctrl.statistics.statistic.push({type: groupName, count: 0});
                    });
                };
            }];
    }
};


},{}],77:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            bindToController: true,
            templateUrl: 'app/modules/contact/overview/template.html'
        };
    }],
    name: 'elyContactOverview'
};

},{"./controller.js":76}],78:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"./directive.js":77,"dup":14}],79:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {

    return $resource('/api/user/contact', null, {
        'delete': {method: 'POST', headers: {'X-HTTP-Method-Override': 'DELETE'}}
    });
}];

},{}],80:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('/api/user/contact/statistic');
}];

},{}],81:[function(require,module,exports){
'use strict';

var getStatistic = function (statistics, type) {
    var result = null;
    angular.forEach(statistics, function (statisticElement) {
        if (type === statisticElement.type) {
            result = statisticElement;
        }
    });
    return result;
};

var addCountToNewStatistic = function (elements, oldStatisticCount, newStatisticType) {
    if (oldStatisticCount > 0 && newStatisticType) {
        angular.forEach(elements, function (statisticElement) {
            if (newStatisticType === statisticElement.type) {
                statisticElement.count = statisticElement.count + oldStatisticCount;
            }
        });
    }
};

module.exports = [
    function () {

        var statistic, service = this;

        service.setStatistic = function (newStatistic) {
            statistic = newStatistic;
        };

        service.getTypes = function (excludedGroup) {
            var types = [];
            angular.forEach(statistic, function (statisticElement) {
                if (excludedGroup !== statisticElement.type) {
                    types.push(statisticElement.type);
                }
            });
            return types;
        };

        service.removeType = function (type, newType) {
            var elementToRemove = getStatistic(statistic, type);
            addCountToNewStatistic(statistic, elementToRemove.count, newType);
            if (elementToRemove) {
                statistic.splice(statistic.indexOf(elementToRemove), 1);
            }
        };

        service.removeContact = function (statisticObject) {
            if (statisticObject.count > 0) {
                statisticObject.count = statisticObject.count - 1;
            }
        };

        service.removeContactByName = function (statisticName) {
            var statisticObject = getStatistic(statistic, statisticName);
            if (statisticObject && statisticObject.count > 0) {
                statisticObject.count = statisticObject.count - 1;
            }
        };

        service.addContactByName = function (statisticName) {
            var statisticObject = getStatistic(statistic, statisticName);
            statisticObject.count = statisticObject.count + 1;
        };

        service.moveContact = function (previousStatistic, newGroupName) {
            var newStatistic = getStatistic(statistic, newGroupName);
            service.removeContact(previousStatistic);
            newStatistic.count = newStatistic.count + 1;
            if (newStatistic.hasOwnProperty('reloadContact')) {
                newStatistic.reloadContact();
            }
        };
    }];

},{}],82:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {

    return $resource('/api/user/contact/contacting', null, {});
}];

},{}],83:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {

    return $resource('/api/user/contact/search');
}];

},{}],84:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {

    return $resource('/api/user/detail', null, {});
}];

},{}],85:[function(require,module,exports){
'use strict';

module.exports = ['Contact', '$q', '$mdDialog',
    function (Contact, $q, $mdDialog) {

        this.addContact = function (contactId, name) {
            if (angular.isString(contactId) && angular.isString(name)) {

                return $mdDialog.show({
                    templateUrl: 'app/modules/contact/modal/addContact/template.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: false,
                    escapeToClose: false,
                    controller: 'AddContactController',
                    locals: {name: name, contactId: contactId},
                    bindToController: true,
                    controllerAs: 'ctrl'
                });
            }
            return $q.reject();
        };

        this.deleteContact = function (contactId) {
            if (angular.isString(contactId)) {
                return Contact.delete({
                    contactIds: [contactId]
                }).$promise;
            }
            return $q.reject();
        };

        this.blockContact = function (contactId) {
            if (angular.isString(contactId)) {
                return Contact.save({
                    mode: 'blockContact',
                    contactIds: [contactId]
                }).$promise;
            }
            return $q.reject();
        };

        this.unblockContact = function (contactId) {
            if (angular.isString(contactId)) {
                return Contact.save({
                    mode: 'unblockContact',
                    contactIds: [contactId]
                }).$promise;
            }
            return $q.reject();
        };

        this.removeContact = function (overviewCollection, contactId) {
            var elementToRemove;
            angular.forEach(overviewCollection, function (contactPreview) {
                if (contactPreview.userId === contactId) {
                    elementToRemove = contactPreview;
                }
            });
            if (elementToRemove) {
                overviewCollection.splice(overviewCollection.indexOf(elementToRemove), 1);
            }
        };

        this.moveContact = function (contactId, name, previousType) {
            if (angular.isString(contactId) && angular.isString(name)) {

                return $mdDialog.show({
                    templateUrl: 'app/modules/contact/modal/moveContact/template.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: false,
                    escapeToClose: false,
                    controller: 'MoveContactController',
                    locals: {name: name, contactId: contactId, previousType: previousType},
                    bindToController: true,
                    controllerAs: 'ctrl'
                });
            }
            return $q.reject();
        };
    }];

},{}],86:[function(require,module,exports){
'use strict';

module.exports = function () {
    return function (items, start, numberOfItems) {
        var filtered = [], i;
        for (i = 0; i < items.length; i = i + 1) {
            if (i >= start && i < numberOfItems + start) {
                filtered.push(items[i]);
            }
        }
        return filtered;
    };
};

},{}],87:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');


app.filter('fromTo', require('./fromToFilter'));
},{"./fromToFilter":86}],88:[function(require,module,exports){
'use strict';

module.exports = {
    directiveCtrl: function () {
        return [ 'Home', '$mdDialog', 'ScrollRequest', 'HomePinwall','HomeScrollRequestResponseHandler',
            function (Home, $mdDialog, ScrollRequest, HomePinwall, HomeScrollRequestResponseHandler) {
                var ctrl = this;
                ctrl.home = {};

                ctrl.createBlog = function () {
                    $mdDialog.show({
                        templateUrl: 'app/modules/home/createBlog/template.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose: false,
                        escapeToClose: false,
                        controller: 'HomePinwallCreateBlog',
                        locals: {element: ctrl.element},
                        bindToController: true,
                        controllerAs: 'ctrl'
                    }).then(function (resp) {
                        HomePinwall.addBlog(ctrl.home.pinwall, resp);
                    });
                };

                ScrollRequest.reset('home', Home.get, HomeScrollRequestResponseHandler);

                ctrl.nextPinwallInfo = function () {
                    ScrollRequest.nextRequest('home', ctrl.home.pinwall).then(function (pinwall) {
                        ctrl.home = pinwall;
                    });
                };

                ctrl.blogRemoved = function (blogId) {
                    HomePinwall.removeBlog(ctrl.home.pinwall, blogId);
                };

                ctrl.nextPinwallInfo();
            }];
    }
};


},{}],89:[function(require,module,exports){
'use strict';

module.exports = [
    function () {
        var ctrl = this;
        ctrl.mainView = true;
        ctrl.createBlogCommands = {};

        ctrl.openVisibility = function () {
            ctrl.mainView = false;
        };

        ctrl.closeVisibility = function () {
            ctrl.mainView = true;
            ctrl.createBlogCommands.activateVisibility();
        };
    }];


},{}],90:[function(require,module,exports){
'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$scope', 'userInfo', 'CreateBlogVisibility', '$mdDialog', 'FileReader', 'FileReaderUtil', 'CreateBlogCheck', 'UploadBlog',
            function ($scope, userInfo, CreateBlogVisibility, $mdDialog, FileReader, FileReaderUtil, CreateBlogCheck, UploadBlog) {
                var ctrl = this;
                ctrl.userInfo = userInfo.getUserInfo();
                ctrl.visibility = "Alle";
                ctrl.internalCommands = ctrl.commands || {};
                ctrl.blogUploadStarted = false;

                CreateBlogVisibility.reset();

                ctrl.cancel = function () {
                    FileReader.abort();
                    $mdDialog.cancel();
                };

                ctrl.openVisibility = function () {
                    if (!ctrl.blogUploadStarted) {
                        ctrl.onOpenVisibilityEvent();
                    }
                };

                ctrl.internalCommands.activateVisibility = function () {
                    if (CreateBlogVisibility.isPublic()) {
                        ctrl.visibility = "Alle";
                    } else {
                        ctrl.visibility = CreateBlogVisibility.getVisibilityDescription();
                    }
                };

                ctrl.uploadBlog = function () {
                    if (ctrl.sendBlogAllowed && !ctrl.blogUploadStarted) {
                        ctrl.blogUploadStarted = true;
                        UploadBlog.upload($scope.blogText, ctrl.imageForUploadPreviewData).then(function (resp) {
                            $mdDialog.hide(resp);
                        });
                    }
                };

                $scope.$watch('blogText', function (newBlogText) {
                    ctrl.sendBlogAllowed = CreateBlogCheck.isSendBlogAllowed(newBlogText, ctrl.imageForUploadPreviewStart);
                });

                $scope.$watch('imageForUpload', function (newImage) {
                    if (newImage) {
                        FileReader.onloadend = function () {
                            $scope.$apply(function () {
                                ctrl.imageForUploadPreviewStart = false;
                                ctrl.sendBlogAllowed = CreateBlogCheck.isSendBlogAllowed($scope.blogText, ctrl.imageForUploadPreviewStart);
                                ctrl.imageForUploadPreview = FileReader.result;
                                ctrl.imageForUploadPreviewData = FileReaderUtil.dataURItoBlob(ctrl.imageForUploadPreview);
                            });
                        };
                        FileReader.onloadstart = function () {
                            $scope.$apply(function () {
                                ctrl.sendBlogAllowed = false;
                                ctrl.imageForUploadPreviewStart = true;
                            });
                        };
                        FileReader.readAsDataURL(newImage);
                    }
                });
            }];
    }
};


},{}],91:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [ function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            bindToController: {
                onOpenVisibilityEvent: '&',
                commands: '='
            },
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/home/createBlog/create/template.html'
        };
    }],
    name: 'elyCreateBlog'
};

},{"./controller.js":90}],92:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('UploadBlog', require('./services/uploadBlog'));

},{"./directive.js":91,"./services/uploadBlog":93}],93:[function(require,module,exports){
'use strict';

var getParams = function (CreateBlogVisibility, blogText) {
    var params = {addBlog: {text: blogText}}, visibility = [];
    if (!CreateBlogVisibility.isPublic()) {
        angular.forEach(CreateBlogVisibility.getPrivacyTypesSelected(), function (type) {
            visibility.push(type.type);
        });
        params.addBlog.visibility = visibility;
    }
    return params;
};

module.exports = ['CreateBlogVisibility', 'CreateBlogCheck', 'fileUpload', '$q',
    function (CreateBlogVisibility, CreateBlogCheck, fileUpload, $q) {

        var uploadBlogIsRunning = false;
        this.upload = function (blogText, blogImage) {
            var deferred = $q.defer();
            if (CreateBlogCheck.isSendBlogAllowed(blogText, false) && !uploadBlogIsRunning) {
                uploadBlogIsRunning = true;
                fileUpload.uploadFileAndJson(blogImage, getParams(CreateBlogVisibility, blogText), 'api/user/blog').success(function (resp) {
                    uploadBlogIsRunning = false;
                    resp.isAdmin = true;
                    resp.pinwallType = "Blog";
                    deferred.resolve(resp);
                }).error(function () {
                    uploadBlogIsRunning = false;
                    deferred.reject({});
                });
            } else {
                deferred.reject({});
            }
            return deferred.promise;
        };
    }];

},{}],94:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');

app.service('CreateBlogVisibility', require('./services/createBlogVisibility'));
app.service('CreateBlogCheck', require('./services/createBlogCheck'));

app.controller('HomePinwallCreateBlog', require('./controller'));

},{"./controller":89,"./services/createBlogCheck":95,"./services/createBlogVisibility":96}],95:[function(require,module,exports){
'use strict';


module.exports = [
    function () {

        this.isSendBlogAllowed = function (blogText, imageLoading) {
            if (!imageLoading && blogText) {
                return blogText.trim() !== '';
            }
            return false;
        };
    }];

},{}],96:[function(require,module,exports){
'use strict';


module.exports = ['userInfo',
    function (userInfo) {

        var isPublic = true;
        var privacyTypesSelected = [];

        this.reset = function () {
            isPublic = true;
            privacyTypesSelected = [];
            angular.forEach(userInfo.getUserInfo().privacyTypes, function (privacyType) {
                privacyTypesSelected.push({type: privacyType, selected: false});
            });
        };

        this.setIsPublic = function (newIsPublic) {
            isPublic = newIsPublic;
        };

        this.isPublic = function () {
            return isPublic;
        };

        this.setPrivacyTypesSelected = function (newPrivacyType) {
            angular.forEach(privacyTypesSelected, function (privacyType) {
                if (privacyType.type === newPrivacyType.type) {
                    privacyType.selected = newPrivacyType.selected;
                }
            });
        };

        this.getPrivacyTypesSelected = function () {
            return privacyTypesSelected;
        };

        this.getVisibilityDescription = function () {
            var visibility = "";
            angular.forEach(privacyTypesSelected, function (privacyType) {
                if (privacyType.selected) {
                    visibility = visibility.concat(privacyType.type + ", ");
                }
            });
            return visibility.substring(0, visibility.length - 2);
        };

        this.isValidVisibility = function () {
            var isValid = false;
            if (isPublic) {
                isValid = true;
            }
            angular.forEach(privacyTypesSelected, function (privacyType) {
                if (privacyType.selected) {
                    isValid = true;
                }
            });
            return isValid;
        };
    }];

},{}],97:[function(require,module,exports){
'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['CreateBlogVisibility', function (CreateBlogVisibility) {
            var ctrl = this;
            ctrl.validVisibility = CreateBlogVisibility.isValidVisibility();
            ctrl.isPublic = CreateBlogVisibility.isPublic();
            ctrl.privacyTypesSelected = CreateBlogVisibility.getPrivacyTypesSelected();

            ctrl.isPublicChanged = function () {
                CreateBlogVisibility.setIsPublic(ctrl.isPublic);
                ctrl.validVisibility = CreateBlogVisibility.isValidVisibility();
            };

            ctrl.privacyTypesSelectedChanged = function (type) {
                CreateBlogVisibility.setPrivacyTypesSelected(type);
                ctrl.validVisibility = CreateBlogVisibility.isValidVisibility();
            };

            ctrl.closeVisibility = function () {
                ctrl.onCloseVisibilityEvent();
            };
        }];
    }
};


},{}],98:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [ function () {
        return {
            restrict: 'E',
            replace: false,
            scope: {},
            bindToController: {
                onCloseVisibilityEvent: '&'
            },
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/home/createBlog/visibility/template.html'
        };
    }],
    name: 'elyCreateBlogVisibility'
};

},{"./controller.js":97}],99:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

},{"./directive.js":98}],100:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [ function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
            },
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            bindToController: true,
            templateUrl: 'app/modules/home/template.html'
        };
    }],
    name: 'elyHome'
};

},{"./controller.js":88}],101:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.factory('Home', require('./services/home'));
app.factory('Blog', require('./services/blog'));

app.service('HomeScrollRequestResponseHandler', require('./pinwall/scrollRequestResponseHandler'));
app.service('HomePinwallElements', require('./pinwall/pinwallElements'));
app.service('HomePinwall', require('./pinwall/pinwall'));
app.service('HomePinwallHeightCalculator', require('./pinwall/heightCalculator'));

},{"./directive.js":100,"./pinwall/heightCalculator":117,"./pinwall/pinwall":118,"./pinwall/pinwallElements":119,"./pinwall/scrollRequestResponseHandler":120,"./services/blog":121,"./services/home":122}],102:[function(require,module,exports){
'use strict';

var getPreviewText = function (text) {
    var previewText = text;
    if (text) {
        if (text.length > 120) {
            previewText = text.substring(0, 120) + "...";
        }
    }
    return previewText;
};

var checkHasDetail = function (text, image) {
    return (angular.isString(text) && text.length > 120) || angular.isString(image);
};

module.exports = {
    directiveCtrl: function () {
        return ['dateFormatter', '$mdDialog', 'Blog', 'errorToast', '$state',
            function (dateFormatter, $mdDialog, Blog, errorToast, $state) {
                var ctrl = this, hasDetail;

                ctrl.requestBlogDeleteRunning = false;

                ctrl.getFormattedDate = dateFormatter.formatRelativeTimes;

                ctrl.previewText = getPreviewText(ctrl.element.text);

                hasDetail = checkHasDetail(ctrl.element.text, ctrl.element.url);

                ctrl.openUserDetail = function() {
                    $state.go('user.detail', {userId: ctrl.element.userId});
                };

                ctrl.openDetail = function () {
                    if (hasDetail) {
                        $mdDialog.show({
                            templateUrl: 'app/modules/home/pinwallElement/blog/detail/detail.html',
                            parent: angular.element(document.body),
                            clickOutsideToClose: true,
                            controller: 'HomePinwallBlogDetail',
                            locals: {element: ctrl.element},
                            bindToController: true,
                            controllerAs: 'ctrl'
                        });
                    }
                };

                ctrl.deleteBlog = function () {
                    var confirm = $mdDialog.confirm()
                        .title("Blog löschen")
                        .textContent("Willst Du diesen Blog wirklich löschen?")
                        .ariaLabel("Delete Blog")
                        .ok("Löschen")
                        .cancel("Abbrechen");
                    $mdDialog.show(confirm).then(function () {
                        ctrl.requestBlogDeleteRunning = true;
                        Blog.delete({
                            blogId: ctrl.element.blogId
                        }, function () {
                            ctrl.requestBlogDeleteRunning = false;
                            ctrl.onBlogRemoved(ctrl.element.blogId);
                        }, function () {
                            ctrl.requestBlogDeleteRunning = false;
                            errorToast.showError("Fehler beim Löschen des Blogs");
                        });
                    });
                };
            }];
    }
};


},{}],103:[function(require,module,exports){
'use strict';

module.exports = ['dateFormatter', '$mdDialog', '$state', function (dateFormatter, $mdDialog, $state) {
    var ctrl = this;
    ctrl.getFormattedDate = dateFormatter.formatRelativeTimes;

    ctrl.cancel = function() {
        $mdDialog.cancel();
    };

    ctrl.openUserDetail = function () {
        $mdDialog.cancel();
        $state.go('user.detail', {userId: ctrl.element.userId});
    };
}];


},{}],104:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            bindToController: {
                element: '=',
                onBlogRemoved: '='
            },
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/home/pinwallElement/blog/template.html'
        };
    }],
    name: 'elyPinwallBlog'
};

},{"./controller.js":102}],105:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.controller('HomePinwallBlogDetail', require('./detail/blogDetailCtrl'));
},{"./detail/blogDetailCtrl":103,"./directive.js":104}],106:[function(require,module,exports){
'use strict';

module.exports = {
    directiveCtrl: function () {
        return [function () {

        }];
    }
};


},{}],107:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            bindToController: {
                element: '=',
                onBlogRemoved: '='
            },
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/home/pinwallElement/template.html'
        };
    }],
    name: 'elyPinwallElement'
};

},{"./controller.js":106}],108:[function(require,module,exports){
arguments[4][99][0].apply(exports,arguments)
},{"./directive.js":107,"dup":99}],109:[function(require,module,exports){
'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['dateFormatter', function (dateFormatter) {
            var ctrl = this;

            ctrl.getFormattedDate = dateFormatter.formatRelativeTimes;
        }];
    }
};


},{}],110:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            bindToController: {
                element: '='
            },
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/home/pinwallElement/recommendation/book/template.html'
        };
    }],
    name: 'elyPinwallRecommendationBook'
};

},{"./controller.js":109}],111:[function(require,module,exports){
arguments[4][99][0].apply(exports,arguments)
},{"./directive.js":110,"dup":99}],112:[function(require,module,exports){
'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            bindToController: {
                element: '='
            },
            controller: function () {
            },
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/home/pinwallElement/recommendation/template.html'
        };
    }],
    name: 'elyPinwallRecommendation'
};

},{}],113:[function(require,module,exports){
arguments[4][99][0].apply(exports,arguments)
},{"./directive.js":112,"dup":99}],114:[function(require,module,exports){
arguments[4][109][0].apply(exports,arguments)
},{"dup":109}],115:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            bindToController: {
                element: '='
            },
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/home/pinwallElement/recommendation/youtube/template.html'
        };
    }],
    name: 'elyPinwallRecommendationYoutube'
};

},{"./controller.js":114}],116:[function(require,module,exports){
arguments[4][99][0].apply(exports,arguments)
},{"./directive.js":115,"dup":99}],117:[function(require,module,exports){
'use strict';

var setMessageContacting = function (element, collectionName) {
    element.pinwallHeight = 41;
    element.pinwallHeight += element[collectionName].length * 52;
};

var heightCalculator = {
    Blog: function (blog) {
        blog.pinwallHeight = 170;
        if (blog.hasOwnProperty('heightPreviewImage')) {
            blog.pinwallHeight += blog.heightPreviewImage;
        }
    },
    Recommendation: function (recommendation) {
        recommendation.pinwallHeight = 325;
    },
    NewMessages: function (newMessage) {
        setMessageContacting(newMessage, 'messages');
    },
    Contacting: function (contacting) {
        setMessageContacting(contacting, 'contacting');
    }
};

module.exports = [
    function () {

        this.calculator = heightCalculator;

        this.setHeightPinwallElements = function (pinwall) {
            angular.forEach(pinwall, function (pinwallElement) {
                if (pinwallElement.hasOwnProperty('type')) {
                    if (heightCalculator[pinwallElement.type]) {
                        heightCalculator[pinwallElement.type](pinwallElement);
                    }
                }
            });
        };
    }];

},{}],118:[function(require,module,exports){
'use strict';


module.exports = [ 'ScrollRequest',
    function (ScrollRequest) {

        this.removeBlog = function (pinwall, blogId) {
            var elementToRemove;
            angular.forEach(pinwall, function (pinwallElement) {
                if (pinwallElement.pinwallType === "Blog" && pinwallElement.blogId === blogId) {
                    elementToRemove = pinwallElement;
                }
            });
            if (elementToRemove) {
                pinwall.splice(pinwall.indexOf(elementToRemove), 1);
                ScrollRequest.removedElement('home');
            }
        };

        this.addBlog = function (pinwall, blog) {
            pinwall.unshift(blog);
            ScrollRequest.addedElement('home');
        };
    }];

},{}],119:[function(require,module,exports){
'use strict';

var pinwall,
    userInfo;

var setPinwallType = function (pinwallElements, type) {
    angular.forEach(pinwallElements, function (pinwallElement) {
        pinwallElement.type = type;
    });
};

var setRecommendation = function (newPinwall) {
    var tempPinwall = [];
    if (newPinwall && newPinwall.hasOwnProperty('pinwall')) {
        if (newPinwall.pinwall.length > 0) {
            setPinwallType(newPinwall.pinwall, 'Recommendation');
            tempPinwall = tempPinwall.concat(newPinwall.pinwall);
        }
    }
    return tempPinwall;
};

var setBlog = function (newPinwall, tempPinwall) {
    if (newPinwall && newPinwall.hasOwnProperty('blog')) {
        if (newPinwall.blog.length > 0) {
            setPinwallType(newPinwall.blog, 'Blog');
            tempPinwall = tempPinwall.concat(newPinwall.blog);
        }
    }
    return tempPinwall;
};

var sortPinwall = function (tempPinwall) {
    return tempPinwall.sort(function (a, b) {
        return b.created - a.created;
    });
};

var setNewMessages = function (newPinwall) {
    if (newPinwall.hasOwnProperty('messages') && newPinwall.messages.length > 0) {
        pinwall.unshift({messages: newPinwall.messages, type: 'NewMessages'});
    }
};

var setContacting = function (newPinwall) {
    if (newPinwall.hasOwnProperty('contacting') && newPinwall.contacting.hasOwnProperty('users')) {
        if (newPinwall.contacting.users.length > 0) {
            pinwall.unshift({
                contacting: newPinwall.contacting.users,
                numberOfContacting: newPinwall.contacting.numberOfContacting,
                type: 'Contacting'
            });
        }
    }
};

var setUserInfo = function (newPinwall) {
    if (newPinwall && newPinwall.hasOwnProperty('user') && newPinwall.user.hasOwnProperty('privacyTypes')) {
        userInfo = newPinwall.user;
    }
};

module.exports = ['HomePinwallHeightCalculator',
    function (HomePinwallHeightCalculator) {

        var reset = function () {
            pinwall = [];
            userInfo = null;
        };
        reset();
        this.reset = reset;

        this.getPinwall = function () {
            return pinwall;
        };

        this.getUserInfo = function () {
            return userInfo;
        };

        this.setPinwallElements = function (newPinwall) {
            var tempPinwall = setRecommendation(newPinwall);
            tempPinwall = setBlog(newPinwall, tempPinwall);
            sortPinwall(tempPinwall);
            pinwall = pinwall.concat(tempPinwall);

            if (pinwall.length === 0) {
                pinwall.unshift({type: 'NoRecommendations'});
            }

            setNewMessages(newPinwall);
            setContacting(newPinwall);
            setUserInfo(newPinwall);

            HomePinwallHeightCalculator.setHeightPinwallElements(pinwall);

            return tempPinwall;
        };

        this.addBlog = function (blog) {
            blog.type = 'Blog';
            HomePinwallHeightCalculator.calculator.Blog(blog);
            pinwall.unshift(blog);
        };

        this.messageChanged = function (newMessages) {
            var exist = false;
            angular.forEach(pinwall, function (element) {
                if (element.type === 'NewMessages') {
                    element.messages = newMessages;
                    exist = true;
                }
            });
            if (!exist) {
                pinwall.unshift({messages: newMessages, type: 'NewMessages'});
            }
        };
    }];

},{}],120:[function(require,module,exports){
'use strict';

module.exports = [function () {

    this.handlingResponse = function (newPinwall, previousPinwall) {
        newPinwall.pinwall = previousPinwall.concat(newPinwall.pinwall);
    };

    this.checkRequestPinwall = function (pinwall, requestedNumberOfElements) {
        return pinwall.pinwall.length === requestedNumberOfElements;
    };
}];

},{}],121:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/user/blog', null, {'delete': {method: 'POST', headers: {'X-HTTP-Method-Override': 'DELETE'}}});
}];

},{}],122:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/user/home', null, {
        'get': {method: 'GET', cache: true}
    });
}];

},{}],123:[function(require,module,exports){
'use strict';

module.exports = {
    directiveCtrl: function () {
        return [
            function () {
                var ctrl = this;

            }];
    }
};


},{}],124:[function(require,module,exports){
'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['ScrollRequest', 'Conversation', 'MessagesScrollRequestResponseHandler', '$stateParams', '$mdMedia', 'MessageNextDayService',
            'dateFormatter', 'ElyModal', 'ToolbarService',
            function (ScrollRequest, Conversation, MessagesScrollRequestResponseHandler, $stateParams, $mdMedia, MessageNextDayService,
                      dateFormatter, ElyModal, ToolbarService) {
                var ctrl = this;
                ctrl.showLoad = true;
                ctrl.$mdMedia = $mdMedia;
                ctrl.checkIsNewDay = MessageNextDayService.checkIsNewDay;
                ctrl.format = dateFormatter.format;

                ctrl.thread = {messages: []};
                ctrl.threadId = $stateParams.threadId;
                ctrl.isGroupThread = $stateParams.isGroupThread === 'true';

                ScrollRequest.reset('messages', Conversation.get, MessagesScrollRequestResponseHandler);

                ctrl.nextMessages = function () {
                    ScrollRequest.nextRequest('messages', ctrl.thread.messages, {
                        threadId: ctrl.threadId
                    }).then(function (thread) {
                        ctrl.showLoad = false;
                        ctrl.thread = thread;
                        ToolbarService.setUnreadMessage(ctrl.thread.totalUnreadMessages);
                    });
                };

                ctrl.nextMessages();

                ctrl.createMessage = function () {
                    ElyModal.show('CreateMessageCtrl', 'app/modules/messages/conversation/createMessage/template.html',
                        {threadId: ctrl.threadId, description: ctrl.thread.threadDescription})
                        .then(function (newMessage) {
                            ctrl.thread.messages.unshift(newMessage);
                        });
                };
            }];
    }
};


},{}],125:[function(require,module,exports){
'use strict';

module.exports =
    ['Conversation', 'ConversationMessageService', 'ElyModal', 'CreateMessageCheck', 'errorToast',
        function (Conversation, ConversationMessageService, ElyModal, CreateMessageCheck, errorToast) {
            var ctrl = this;
            ctrl.newMessage = '';
            ctrl.uploadAllowed = false;

            ctrl.messageTextChanged = function () {
                ctrl.uploadAllowed = CreateMessageCheck.isSendMessageAllowed(ctrl.newMessage);
            };

            ctrl.cancel = function () {
                ElyModal.cancel();
            };

            ctrl.sendMessage = function () {
                var message;
                if (ctrl.uploadAllowed) {
                    message = ConversationMessageService.getMessage(ctrl.destinationUserId, ctrl.threadId, ctrl.newMessage);
                    ctrl.uploadStarted = true;
                    Conversation.save(message, function (resp) {
                        ctrl.uploadStarted = false;
                        resp.message.isUser = true;
                        ElyModal.hide(resp.message);
                    }, function() {
                        ctrl.uploadStarted = false;
                        errorToast.showError('Beim Senden der Nachricht ist ein Fehler aufgetretten!');
                    });
                }
            };
        }];


},{}],126:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');

app.service('ConversationMessageService', require('./services/conversationMessage'));
app.service('CreateMessageCheck', require('./services/createMessageCheck'));

app.controller('CreateMessageCtrl', require('./controller'));
},{"./controller":125,"./services/conversationMessage":127,"./services/createMessageCheck":128}],127:[function(require,module,exports){
'use strict';

module.exports = [function () {


    this.getMessage = function (destinationUserId, threadId, newMessage) {
        var message;
        if (destinationUserId) {
            message = {
                addMessageUser: {
                    userId: destinationUserId,
                    text: newMessage
                }
            };
        } else {
            message = {
                addMessageThread: {
                    threadId: threadId,
                    text: newMessage
                }
            };
        }
        return message;
    };

}];

},{}],128:[function(require,module,exports){
'use strict';


module.exports = [
    function () {

        this.isSendMessageAllowed = function (messageText) {
            if (messageText) {
                return messageText.trim() !== '' && messageText.length <= 1000;
            }
            return false;
        };
    }];

},{}],129:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            bindToController: true,
            templateUrl: 'app/modules/messages/conversation/template.html'
        };
    }],
    name: 'elyConversation'
};

},{"./controller.js":124}],130:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('MessagesScrollRequestResponseHandler', require('./services/scrollRequestResponseHandler'));
app.service('MessageNextDayService', require('./services/messageNextDay'));
},{"./directive.js":129,"./services/messageNextDay":134,"./services/scrollRequestResponseHandler":135}],131:[function(require,module,exports){
'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['dateFormatter',
            function (dateFormatter) {
                var ctrl = this;

                ctrl.dateFormatter = dateFormatter;

            }];
    }
};


},{}],132:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            bindToController: {
                message: '='
            },
            templateUrl: 'app/modules/messages/conversation/message/template.html'
        };
    }],
    name: 'elyMessage'
};

},{"./controller.js":131}],133:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"./directive.js":132,"dup":14}],134:[function(require,module,exports){
'use strict';

module.exports = ['moment', function (moment) {

    this.checkIsNewDay = function (index, messages) {
        var actualMessage, previousMessage;
        if (index === 0) {
            return true;
        }
        previousMessage = moment.unix(messages[index - 1].timestamp).format('l');
        actualMessage = moment.unix(messages[index].timestamp).format('l');
        return previousMessage !== actualMessage;
    };
}];

},{}],135:[function(require,module,exports){
'use strict';

module.exports = [function () {

    this.handlingResponse = function (newThreads, previousThreads) {
        newThreads.messages = previousThreads.concat(newThreads.messages);
    };

    this.checkRequestPinwall = function (threads, requestedNumberOfElements) {
        return threads.numberOfMessages === requestedNumberOfElements;
    };
}];

},{}],136:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            bindToController: true,
            templateUrl: 'app/modules/messages/template.html'
        };
    }],
    name: 'elyMessages'
};

},{"./controller.js":123}],137:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.factory('ThreadOverview', require('./services/thread'));
app.factory('SearchThread', require('./services/searchThread'));
app.factory('Conversation', require('./services/conversation'));
app.factory('SearchUserToSendMessage', require('./services/searchUserToSendMessage'));

app.config(['$stateProvider', function ($stateProvider) {

    $stateProvider
        .state('message', {
            abstract: true,
            url: '/message'
        })
        .state('message.threads', {
            url: '/threads',
            views: {
                'content@': {
                    template: '<ely-messages></ely-messages>'
                }
            },
            data: {title: 'Nachrichten', hasSearch: true, searchServiceName: 'threads'}
        })
        .state('message.threads.detail', {
            url: '/conversation/{threadId}',
            views: {
                'content@': {
                    template: '<ely-conversation></ely-conversation>'
                }
            },
            data: {hasBackNav: true, backNavToState: true}
        });
}]);
},{"./directive.js":136,"./services/conversation":138,"./services/searchThread":139,"./services/searchUserToSendMessage":140,"./services/thread":141}],138:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/user/messages/conversation');
}];

},{}],139:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('/api/user/messages/search');
}];

},{}],140:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/user/messages/search');
}];

},{}],141:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/user/messages/thread');
}];

},{}],142:[function(require,module,exports){
'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['SearchService', 'SearchThread', 'ThreadOverview', 'ScrollRequest', 'ThreadOverviewScrollRequestResponseHandler', 'ToolbarService',
            function (SearchService, SearchThread, ThreadOverview, ScrollRequest, ThreadOverviewScrollRequestResponseHandler, ToolbarService) {
                var ctrl = this;

                ctrl.messages = {threads: []};
                ctrl.showLoad = true;
                ctrl.showThreadSearch = false;

                ScrollRequest.reset('threadOverview', ThreadOverview.get, ThreadOverviewScrollRequestResponseHandler);

                ctrl.nextThreads = function () {
                    ScrollRequest.nextRequest('threadOverview', ctrl.messages.threads).then(function (messages) {
                        ctrl.showLoad = false;
                        ctrl.messages = messages;
                        ToolbarService.setUnreadMessage(ctrl.messages.totalUnreadMessages);
                    });
                };

                ctrl.nextThreads();

                SearchService.register(ctrl, SearchThread.query, SearchThread.get);

                ctrl.requestStarted = function () {
                    ctrl.showLoad = true;
                };

                ctrl.requestFinished = function (resp) {
                    ctrl.showLoad = false;
                    ctrl.showThreadSearch = true;
                    ctrl.threadSearchResult = resp;
                };

                ctrl.abortSearch = function () {
                    ctrl.showLoad = false;
                    ctrl.showThreadSearch = false;
                    delete ctrl.threadSearchResult;
                };
            }];
    }
};


},{}],143:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            bindToController: true,
            templateUrl: 'app/modules/messages/threadOverview/template.html'
        };
    }],
    name: 'elyThreadOverview'
};

},{"./controller.js":142}],144:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('ThreadOverviewScrollRequestResponseHandler', require('./services/scrollRequestResponseHandler'));
},{"./directive.js":143,"./services/scrollRequestResponseHandler":145}],145:[function(require,module,exports){
'use strict';

module.exports = [function () {

    this.handlingResponse = function (newThreads, previousThreads) {
        newThreads.threads = previousThreads.concat(newThreads.threads);
    };

    this.checkRequestPinwall = function (threads, requestedNumberOfElements) {
        return threads.numberOfThreads === requestedNumberOfElements;
    };
}];

},{}],146:[function(require,module,exports){
'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['dateFormatter', '$state', 'ElyModal',
            function (dateFormatter, $state, ElyModal) {
                var ctrl = this;

                ctrl.getFormattedDate = dateFormatter.format;

                ctrl.goToConversation = function () {
                    $state.go('message.threads.detail', {threadId: ctrl.thread.threadId});
                };

                ctrl.writeMessage = function () {
                    ElyModal.show('CreateMessageCtrl', 'app/modules/messages/conversation/createMessage/template.html',
                        {destinationUserId: ctrl.thread.userId, description: ctrl.thread.description})
                        .then(function (newMessage) {
                            $state.go('message.threads.detail', {threadId: newMessage.threadId});
                        });
                };
            }];
    }
};


},{}],147:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            bindToController: {
                thread: '='
            },
            templateUrl: 'app/modules/messages/threadOverview/thread/template.html'
        };
    }],
    name: 'elyMessagesThread'
};

},{"./controller.js":146}],148:[function(require,module,exports){
arguments[4][49][0].apply(exports,arguments)
},{"./directive.js":147,"dup":49}],149:[function(require,module,exports){
'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['Auth', '$state', '$mdSidenav', 'userInfo', function (Auth, $state, $mdSidenav, userInfo) {
            var ctrl = this;

            ctrl.userInfo = userInfo.getUserInfo();
            userInfo.register('leftNav', ctrl);

            ctrl.userInfoChanged = function () {
                ctrl.userInfo = userInfo.getUserInfo();
            };

            ctrl.logout = function () {
                Auth.logout().then(function () {
                    $mdSidenav("left").close();
                    $state.go('login');
                });
            };

        }];
    }
};

},{}],150:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: false,
            scope: {},
            templateUrl: 'app/modules/navigation/leftNav/container/template.html',
            controllerAs: 'ctrl',
            controller: controller.directiveCtrl()
        };
    }],
    name: 'elyLeftNavContainer'
};

},{"./controller.js":149}],151:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"./directive.js":150,"dup":14}],152:[function(require,module,exports){
'use strict';

var getHighlightedStyle = function ($state, baseState) {

    if ($state.includes(baseState)) {
        return {'color': '#3F51B5'};
    }
    return {};
};

module.exports = {
    directiveCtrl: function () {
        return ['$state', '$rootScope', '$mdSidenav', function ($state, $rootScope, $mdSidenav) {

            var ctrl = this;

            ctrl.$state = $state;

            ctrl.goToState = function () {
                $mdSidenav("left").close();
                $state.go(ctrl.state);
            };

            $rootScope.$on('$stateChangeSuccess', function () {
                ctrl.highlightedStyle = getHighlightedStyle($state, ctrl.baseState);
            });
        }];
    }
};

},{}],153:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            bindToController: {
                state: '@',
                baseState: '@',
                icon: '@',
                description: '@'
            },
            templateUrl: 'app/modules/navigation/leftNav/element/template.html',
            controllerAs: 'ctrl',
            controller: controller.directiveCtrl()
        };
    }],
    name: 'elyLeftNavElement'
};

},{"./controller.js":152}],154:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"./directive.js":153,"dup":14}],155:[function(require,module,exports){
'use strict';

module.exports = ['$rootScope', '$mdSidenav', 'loginStateHandler', '$state', 'ToolbarService', 'userInfo',
    function ($rootScope, $mdSidenav, loginStateHandler, $state, ToolbarService, userInfo) {
        var ctrl = this, previousState, previousParams, backNavToState;
        loginStateHandler.register(ctrl);
        ToolbarService.registerToolbar(ctrl);
        userInfo.register('toolbar', ctrl);
        ctrl.isLoggedIn = false;
        ctrl.hasSearch = false;
        ctrl.hasBackNav = true;
        ctrl.searchExpanded = false;

        ctrl.openLeftNav = function () {
            $mdSidenav("left").toggle();
        };

        ctrl.loginEvent = function () {
            ctrl.isLoggedIn = true;
        };

        ctrl.logoutEvent = function () {
            ctrl.isLoggedIn = false;
        };

        ctrl.searchOpen = function () {
            ctrl.searchExpanded = true;
        };

        ctrl.searchClose = function () {
            ctrl.searchExpanded = false;
        };

        ctrl.navigateBack = function () {
            if (backNavToState && previousState) {
                $state.go(previousState, previousParams);
            } else {
                $state.go('home');
            }
        };

        ctrl.modificationChanged = function (modification) {
            ctrl.count = modification.totalUnreadMessages;
        };

        ctrl.userInfoChanged = function (userInfo) {
            ctrl.count = userInfo.totalUnreadMessages;
        };

        //Functions for toolbarService
        ctrl.setTitle = function (title) {
            ctrl.title = title;
        };

        ctrl.setUnreadMessage = function (count) {
            ctrl.count = count;
        };

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            ctrl.hasSearch = false;
            ctrl.hasBackNav = true;
            backNavToState = false;
            ctrl.searchExpanded = false;

            if (fromState.name !== 'checkLoginState' && !fromState.abstract) {
                previousState = fromState;
                previousParams = fromParams;
            }

            if (toState.hasOwnProperty('data')) {
                ctrl.hasSearch = toState.data.hasSearch;
                ctrl.title = toState.data.title;
                if (toState.data.hasOwnProperty('hasBackNav')) {
                    ctrl.hasBackNav = toState.data.hasBackNav;
                }
                backNavToState = toState.data.backNavToState;
            }
        });
    }];
},{}],156:[function(require,module,exports){
'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: 'app/modules/navigation/toolbar/template.html',
            controllerAs: 'ctrl',
            controller: require('./controller.js')
        };
    }],
    name: 'elyToolbar'
};

},{"./controller.js":155}],157:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.service('ToolbarService', require('./services/toolbarService'));

app.directive(directive.name, directive.directive);

},{"./directive.js":156,"./services/toolbarService":169}],158:[function(require,module,exports){
'use strict';

module.exports = ['$state',
    function ($state) {
        var ctrl = this;

        ctrl.openThreadOverview = function () {
            $state.go('message.threads');
        };
    }];
},{}],159:[function(require,module,exports){
'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: 'app/modules/navigation/toolbar/messageInfo/template.html',
            controllerAs: 'ctrl',
            controller: require('./controller.js'),
            bindToController: {
                count: '='
            }
        };
    }],
    name: 'elyToolbarMessageInfo'
};

},{"./controller.js":158}],160:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"./directive.js":159,"dup":14}],161:[function(require,module,exports){
'use strict';

var charCodeEnter = 13;

module.exports = ['$scope', 'SearchService',
    function ($scope, SearchService) {
        var ctrl = this;

        ctrl.querySearch = SearchService.querySuggestion;

        ctrl.commands.abortSearch = function () {
            SearchService.abortSearch();
        };

        ctrl.selectedItemChanged = function () {
            SearchService.startSearchRequest(ctrl.searchText);
        };

        ctrl.keyPressed = function ($event) {
            if ($event.charCode === charCodeEnter || $event.keyCode === charCodeEnter) {
                $scope.$$childHead.$mdAutocompleteCtrl.hidden = true;
                SearchService.startSearchRequest(ctrl.searchText);
            }
        };
    }];
},{}],162:[function(require,module,exports){
'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/modules/navigation/toolbar/search/contactSearch/template.html',
            scope: {},
            controllerAs: 'ctrl',
            bindToController: {
                commands: '='
            },
            controller: require('./controller.js')
        };
    }],
    name: 'elyToolbarContactSearch'
};

},{"./controller.js":161}],163:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"./directive.js":162,"dup":14}],164:[function(require,module,exports){
'use strict';

module.exports = ['$rootScope',
    function ($rootScope) {
        var ctrl = this;
        ctrl.commands = {};
        ctrl.isExpanded = false;

        ctrl.closeExpand = function () {
            ctrl.isExpanded = false;
            ctrl.commands.abortSearch();
            ctrl.searchClose();
        };

        ctrl.openExpand = function () {
            ctrl.isExpanded = true;
            ctrl.searchOpen();
        };

        $rootScope.$on('$stateChangeSuccess', function (event, toState) {

            ctrl.isExpanded = false;

            if (toState.hasOwnProperty('data') && toState.data.hasOwnProperty('searchServiceName')) {
                    ctrl.serviceName = toState.data.searchServiceName;
            }
        });
    }];
},{}],165:[function(require,module,exports){
'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: 'app/modules/navigation/toolbar/search/template.html',
            controllerAs: 'ctrl',
            controller: require('./controller.js'),
            bindToController: {
                searchOpen: '&',
                searchClose: '&'
            }
        };
    }],
    name: 'elyToolbarSearch'
};

},{"./controller.js":164}],166:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"./directive.js":165,"dup":14}],167:[function(require,module,exports){
'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/modules/navigation/toolbar/search/threadSearch/template.html',
            scope: {},
            controllerAs: 'ctrl',
            bindToController: {
                commands: '='
            },
            controller: require('./../contactSearch/controller.js')
        };
    }],
    name: 'elyToolbarThreadSearch'
};

},{"./../contactSearch/controller.js":161}],168:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"./directive.js":167,"dup":14}],169:[function(require,module,exports){
'use strict';

module.exports = [
    function () {

        var service = this, toolbar;

        service.registerToolbar = function (newToolbar) {
            toolbar = newToolbar;
        };

        service.setTitle = function (title) {
            toolbar.setTitle(title);
        };

        service.setUnreadMessage = function (count) {
            toolbar.setUnreadMessage(count);
        };
    }];

},{}],170:[function(require,module,exports){
'use strict';

module.exports = ['$scope', 'ElyModal', 'PageRecommendation', 'moment',
    function ($scope, ElyModal, PageRecommendation, moment) {


        $scope.addNewRecommendation = function (page, pageId, title) {
            ElyModal.show({
                scope: {title: " " + title},
                templateUrl: 'app/modules/recommendation/modalAddRecommendation.html',
                controller: 'ModalAddRecommendationCtrl',
                resolve: {
                    pageId: function () {
                        return pageId;
                    }
                }

            }).then(function (resp) {
                if (!page.recommendation) {
                    page.recommendation = {};
                }
                page.recommendation.user = {
                    rating: resp.rating,
                    comment: resp.comment,
                    profileUrl: resp.profileUrl,
                    recommendationId: resp.recommendationId,
                    created: moment.unix(resp.created).format('LL')
                };
                page.recommendation.summary.contact = resp.recommendation.contact;
                page.recommendation.summary.all = resp.recommendation.all;
                $scope.$emit('page.detail.edit');
            });
        };

        $scope.removeRecommendation = function (page, pageId) {
            ElyModal.show({
                scope: {
                    title: 'Bewertung löschen',
                    content: 'Willst Du die Bewertung wirklich löschen?'
                },
                size: 'sm',
                templateUrl: 'app/modules/util/dialog/yesNoDialog.html'
            }).then(function () {
                PageRecommendation.delete({
                    recommendationId: page.recommendation.user.recommendationId,
                    pageId: pageId
                }, function (resp) {
                    delete page.recommendation.user;
                    page.recommendation.summary.contact = resp.recommendation.contact;
                    page.recommendation.summary.all = resp.recommendation.all;
                    $scope.$emit('page.detail.edit');
                });
            });
        };
    }];

},{}],171:[function(require,module,exports){
'use strict';

var checkStateChanged = function (PageCategoryHandler, PageHandlingState) {
    if (PageCategoryHandler.stateChanged()) {
        PageHandlingState.goToState(1);
    } else {
        PageHandlingState.goToPreviousState();
    }
};

var handleEditMode = function($stateParams, PageLoader, ctrl, Languages, PageCategoryHandler, PageHandlingState, PageEditModeService) {
    if ($stateParams.pageId) {
        PageLoader.load($stateParams.label, $stateParams.pageId).then(function () {
            ctrl.categories = PageLoader.getCategories();
            ctrl.title = PageLoader.getTitle();
            ctrl.selectedLanguage = Languages.getLanguage(PageLoader.getLanguage());
            PageCategoryHandler.setSelected(ctrl.categories);
            PageCategoryHandler.setTitle(ctrl.title);
            PageCategoryHandler.setLanguage(ctrl.selectedLanguage);
            PageHandlingState.goToState(3);
        });
        ctrl.isEditMode = true;
        ctrl.isSingleSelectionDisabled = true;
        ctrl.isMultipleSelectionDisabled = true;
        PageEditModeService.setEditMode();
    }
};

module.exports = {
    directiveCtrl: function () {
        return ['$stateParams', 'PageLeftNavElements', 'Languages', 'PageCategoryHandler', 'PageHandlingState', 'PageLoader', 'PageEditModeService',
            function ($stateParams, PageLeftNavElements, Languages, PageCategoryHandler, PageHandlingState, PageLoader, PageEditModeService) {
                var ctrl = this;
                ctrl.categories = {};
                ctrl.isEditMode = false;
                ctrl.isSingleSelectionDisabled = false;
                ctrl.isMultipleSelectionDisabled = false;
                ctrl.isFinishDisabled = true;
                ctrl.isLanguageDisabled = false;
                ctrl.languages = Languages.languages;
                ctrl.showContinueButton = true;

                handleEditMode($stateParams, PageLoader, ctrl, Languages, PageCategoryHandler, PageHandlingState, PageEditModeService);

                ctrl.categoriesSelectionChanged = function () {
                    var isDisabled;
                    ctrl.isFinishDisabled = !PageCategoryHandler.setSelected(ctrl.categories);
                    isDisabled = PageCategoryHandler.categoriesDisabled();
                    ctrl.isSingleSelectionDisabled = isDisabled.single;
                    ctrl.isMultipleSelectionDisabled = isDisabled.multiple;
                    checkStateChanged(PageCategoryHandler, PageHandlingState);
                };

                ctrl.languageChanged = function () {
                    ctrl.isFinishDisabled = !PageCategoryHandler.setLanguage(ctrl.selectedLanguage);
                    checkStateChanged(PageCategoryHandler, PageHandlingState);
                };

                ctrl.titleChanged = function () {
                    ctrl.isFinishDisabled = !PageCategoryHandler.setTitle(ctrl.title);
                    checkStateChanged(PageCategoryHandler, PageHandlingState);
                };

                ctrl.categorySelectFinished = function () {
                    PageCategoryHandler.setPreviousState(ctrl.title);
                    PageHandlingState.goToState(2);
                };

                PageHandlingState.registerStateChange(ctrl);
                ctrl.stateChanged = function (state) {
                    ctrl.showContinueButton = state === 1;
                };
            }];
    }
};

},{}],172:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {

            },
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/page/handlingPages/categorySelection/template.html'
        };
    }],
    name: 'elyPageCategorySelection'
};

},{"./controller.js":171}],173:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('PageCategoryHandler', require('./services/categoryHandler'));
app.service('PageLoader', require('./services/pageLoader'));
},{"./directive.js":172,"./services/categoryHandler":174,"./services/pageLoader":175}],174:[function(require,module,exports){
'use strict';

var containsSelectedElements = function (selected) {
    var isSelected = false;
    angular.forEach(selected, function (value) {
        if (value === true) {
            isSelected = true;
        }
    });
    return isSelected;
};

var isCategoryValid = function (actual) {
    return containsSelectedElements(actual.selected) && actual.title && actual.title.trim() !== "" && actual.language;
};

module.exports = ['Languages',
    function (Languages) {
        var actual = {};
        var previous;
        var singleSelectedItems = ['Book', 'Youtube', 'Video'];

        this.reset = function () {
            actual = {};
            previous = null;
        };

        this.setSelected = function (selectedValues) {
            actual.selected = selectedValues;
            return isCategoryValid(actual);
        };

        this.getSelected = function () {
            var selectedItems = [];
            angular.forEach(actual.selected, function (value, name) {
                if (value === true) {
                    selectedItems.push(name);
                }
            });
            return selectedItems;
        };

        this.setLanguage = function (newLanguage) {
            actual.language = newLanguage;
            return isCategoryValid(actual);
        };

        this.getLanguageCode = function () {
            return Languages.getCode(actual.language);
        };

        this.setTitle = function (newTitle) {
            actual.title = newTitle;
            return isCategoryValid(actual);
        };

        this.setPreviousState = function () {
            previous = angular.copy(actual);
        };

        this.stateChanged = function () {
            if (previous) {
                return actual.title !== previous.title || actual.language !== previous.language || !angular.equals(actual.selected, previous.selected);
            }
            return false;
        };

        this.getTitle = function () {
            return actual.title;
        };

        this.categoriesDisabled = function () {

            function isSingleElement(selectedElement, name) {
                return singleSelectedItems.indexOf(name) !== -1 && selectedElement === true;
            }

            function isMultipleElement(selectedElement, name) {
                return singleSelectedItems.indexOf(name) === -1 && selectedElement === true;
            }

            var isDisabled = {single: false, multiple: false};
            angular.forEach(actual.selected, function (selectedElement, name) {
                if (isSingleElement(selectedElement, name)) {
                    isDisabled = {single: true, multiple: true};
                } else if (isMultipleElement(selectedElement, name)) {
                    isDisabled = {single: true, multiple: false};
                }
            });
            return isDisabled;
        };
    }];

},{}],175:[function(require,module,exports){
'use strict';

module.exports = ['$q', 'PageDetail',
    function ($q, PageDetail) {
        var service = this;
        var pageDetails;
        //Only temporary
        var lastLabel = '';

        service.reset = function () {
            pageDetails = null;
        };

        service.load = function (label, pageId) {
            var deferred = $q.defer();
            pageDetails = PageDetail.get({pageId: pageId, label: label}, function () {
                lastLabel = label;
                deferred.resolve();
            });
            return deferred.promise;
        };

        service.getCategories = function () {
            var selected = {};
            selected[lastLabel] = true;
            return selected;
        };

        service.getTitle = function () {
            return pageDetails.page.title;
        };

        service.getLanguage = function () {
            return pageDetails.page.language;
        };

        service.getPageDetails = function () {
            return pageDetails.page;
        };
    }];

},{}],176:[function(require,module,exports){
'use strict';


module.exports = {
    directiveCtrl: function () {
        return ['$state', 'PageHandlingState', 'PageCategoryHandler', 'SearchPage',
            function ($state, PageHandlingState, PageCategoryHandler, SearchPage) {
                var ctrl = this;
                ctrl.showPreviews = false;
                ctrl.pageRequest = {};

                ctrl.continue = function () {
                    PageHandlingState.goToState(3);
                };

                ctrl.abortHandlingPage = function () {
                    $state.go('page.overview');
                };

                ctrl.SearchPage = SearchPage;
                PageHandlingState.registerStateChange(ctrl);

                ctrl.stateChanged = function (state) {
                    if (state === 2) {
                        ctrl.pageRequest.startRequested({
                            search: PageCategoryHandler.getTitle(),
                            filterType: PageCategoryHandler.getSelected(),
                            filterLanguage: PageCategoryHandler.getLanguageCode(),
                            isSuggestion: false
                        });
                    } else {
                        ctrl.showPreviews = false;
                    }
                };

                ctrl.pageRequest.requestFinished = function (pages) {
                    if (pages.length > 0) {
                        ctrl.showPreviews = true;
                    } else {
                        ctrl.showPreviews = false;
                        PageHandlingState.goToState(3);
                    }
                };
            }];
    }
};

},{}],177:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {

            },
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/page/handlingPages/compareExistingPages/template.html'
        };
    }],
    name: 'elyPageCompareExistingPages'
};

},{"./controller.js":176}],178:[function(require,module,exports){
arguments[4][49][0].apply(exports,arguments)
},{"./directive.js":177,"dup":49}],179:[function(require,module,exports){
'use strict';


module.exports = {
    directiveCtrl: function () {
        return ['$scope', 'PageCategoryHandler', 'PageHandlingState', 'PageLoader', 'PageEditModeService', 'PageLeftNavElements',
            function ($scope, PageCategoryHandler, PageHandlingState, PageLoader, PageEditModeService, PageLeftNavElements) {

                //Just temporary, shall be replaced with an observer
                $scope.$emit(PageLeftNavElements.event, PageLeftNavElements.elements);

                PageCategoryHandler.reset();
                PageHandlingState.reset();
                PageLoader.reset();
                PageEditModeService.reset();
            }];
    }
};

},{}],180:[function(require,module,exports){
'use strict';

var isDateValid = function (moment, date) {
    return moment(date, 'l', moment.locale(), true).isValid();
};

module.exports = {
    directiveCtrl: function () {
        return ['$scope', 'PageEditModeService', 'PageLoader', 'moment', 'UploadBookPage', 'EditBookService',
            function ($scope, PageEditModeService, PageLoader, moment, UploadBookPage, EditBookService) {
                var ctrl = this;

                ctrl.imagePreview = 'app/img/default.jpg';
                ctrl.isEditMode = PageEditModeService.isEditMode();
                ctrl.editDataChanged = false;

                ctrl.editDataHasChanged = function (imagePreview, imageData) {
                    if (imagePreview && imageData) {
                        ctrl.imagePreview = imagePreview;
                        ctrl.imagePreviewData = imageData;
                    }
                    ctrl.editDataChanged = PageEditModeService.hasChanged(ctrl, EditBookService.getPreviousValues(),
                        EditBookService.getElementsToCompare());
                };

                ctrl.publishDateChanged = function () {
                    ctrl.editDataChanged = PageEditModeService.hasChanged(ctrl, EditBookService.getPreviousValues(),
                        EditBookService.getElementsToCompare());
                    if (ctrl.publishDate) {
                        $scope.commonForm.inputPublicationDate.$setValidity('custom', isDateValid(moment, ctrl.publishDate));
                    } else if (!ctrl.publishDate || ctrl.publishDate.trim() === '') {
                        $scope.commonForm.inputPublicationDate.$setValidity('custom', true);
                    }
                };

                ctrl.getDateExample = function () {
                    var unixTimestamp = 385974036;
                    return moment.unix(unixTimestamp).format('l');
                };

                ctrl.uploadPage = function () {
                    UploadBookPage.uploadPage(ctrl.description, ctrl.authors, ctrl.publishDate, ctrl.imagePreviewData, ctrl.pageId);
                };

                if (ctrl.isEditMode) {
                    angular.merge(ctrl, EditBookService.getValues());
                }
            }];
    }
};

},{}],181:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/page/handlingPages/details/book/template.html'
        };
    }],
    name: 'elyPageHandlingDetailBook'
};

},{"./controller.js":180}],182:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('UploadBookPage', require('./services/uploadBookPage'));
app.service('EditBookService', require('./services/editBookService'));
},{"./directive.js":181,"./services/editBookService":183,"./services/uploadBookPage":184}],183:[function(require,module,exports){
'use strict';

module.exports = ['PageLoader', 'moment',
    function (PageLoader, moment) {
        var ctrl = this;
        var previousValues = {};

        ctrl.getPreviousValues = function () {
            return previousValues;
        };

        ctrl.getElementsToCompare = function () {
            return ['description', 'authors', 'publishDate', 'imagePreview', 'pageId'];
        };

        ctrl.getValues = function () {
            var pageDetail = PageLoader.getPageDetails(), values = {};
            values.description = pageDetail.description;
            values.authors = pageDetail.author[0].name;
            if (pageDetail.publishDate) {
                values.publishDate = moment.unix(pageDetail.publishDate).format('l');
            }
            values.imagePreview = pageDetail.titleUrl;
            values.pageId = pageDetail.pageId;
            previousValues = angular.copy(values);
            return values;
        };
    }];

},{}],184:[function(require,module,exports){
'use strict';

module.exports = ['PageCategoryHandler', 'PageHandlingUpload', 'moment',
    function (PageCategoryHandler, PageHandlingUpload, moment) {
        var ctrl = this;

        ctrl.uploadPage = function (description, authors, publishDate, imageData, pageId) {
            var json = {
                bookPage: {
                    language: PageCategoryHandler.getLanguageCode(),
                    title: PageCategoryHandler.getTitle(),
                    description: description,
                    author: authors
                }
            };
            if (publishDate) {
                json.bookPage.publishDate = moment.utc(publishDate, 'l', moment.locale(), true).valueOf() / 1000;
            }
            if (pageId) {
                json.bookPage.pageId = pageId;
            }
            PageHandlingUpload.uploadPage(json, pageId, 'Book', imageData);
        };
    }];

},{}],185:[function(require,module,exports){
'use strict';


module.exports = {
    directiveCtrl: function () {
        return ['PageCategoryHandler', 'PageHandlingState',
            function (PageCategoryHandler, PageHandlingState) {
                var ctrl = this;
                ctrl.showPreviews = false;
                ctrl.selected = [];

                PageHandlingState.registerStateChange(ctrl);

                ctrl.stateChanged = function (state) {
                    if (state === 3) {
                        ctrl.showPreviews = true;
                        ctrl.selected = PageCategoryHandler.getSelected();
                    } else {
                        ctrl.showPreviews = false;
                    }
                };
            }];
    }
};

},{}],186:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/page/handlingPages/details/template.html'
        };
    }],
    name: 'elyPageHandlingDetails'
};

},{"./controller.js":185}],187:[function(require,module,exports){
arguments[4][49][0].apply(exports,arguments)
},{"./directive.js":186,"dup":49}],188:[function(require,module,exports){
'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['UtilFilePreviewPicture',
            function (UtilFilePreviewPicture) {
                var ctrl = this;

                ctrl.imagePreview = ctrl.imagePreviewUrl;

                ctrl.selectTitlePicture = function () {
                    UtilFilePreviewPicture.getPreviewPicture().then(function (picture) {
                        ctrl.imagePreview = picture.preview;
                        ctrl.imagePreviewUrl = picture.preview;
                        ctrl.imageCanvas = picture.blob;
                        if (angular.isFunction(ctrl.imageChanged)) {
                            ctrl.imageChanged(picture.preview, picture.blob);
                        }
                    });
                };
            }];
    }
};

},{}],189:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            bindToController: {
                imageChanged: '=',
                imagePreviewUrl: '='
            },
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/page/handlingPages/details/selectPicture/template.html'
        };
    }],
    name: 'elyPageHandlingDetailSelectPicture'
};

},{"./controller.js":188}],190:[function(require,module,exports){
arguments[4][49][0].apply(exports,arguments)
},{"./directive.js":189,"dup":49}],191:[function(require,module,exports){
'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$scope', 'PageEditModeService', 'PageYoutubeLink', 'UploadYoutubePage', 'EditYoutubeService',
            function ($scope, PageEditModeService, PageYoutubeLink, UploadYoutubePage, EditYoutubeService) {
                var ctrl = this;

                ctrl.isEditMode = PageEditModeService.isEditMode();

                ctrl.youtubeLinkChanged = function () {
                    ctrl.descriptionChanged();
                    $scope.commonForm.inputYoutubeLink.$setValidity('custom', PageYoutubeLink.isValidYoutubeLink(ctrl.youtubeLink));
                    ctrl.youtubeLinkFormatted = PageYoutubeLink.getYoutubeLink(ctrl.youtubeLink);
                };

                ctrl.descriptionChanged = function () {
                    ctrl.editDataChanged = PageEditModeService.hasChanged(ctrl, EditYoutubeService.getPreviousValues(),
                        EditYoutubeService.getElementsToCompare());
                };

                ctrl.uploadPage = function () {
                    UploadYoutubePage.uploadPage(ctrl.description, ctrl.youtubeLinkFormatted, ctrl.pageId);
                };

                if (ctrl.isEditMode) {
                    angular.merge(ctrl, EditYoutubeService.getValues());
                }
            }];
    }
};

},{}],192:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/page/handlingPages/details/youtube/template.html'
        };
    }],
    name: 'elyPageHandlingDetailYoutube'
};

},{"./controller.js":191}],193:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('EditYoutubeService', require('./services/editYoutubeService'));
app.service('PageYoutubeLink', require('./services/youtubeLink'));
app.service('UploadYoutubePage', require('./services/uploadYoutubePage'));
},{"./directive.js":192,"./services/editYoutubeService":194,"./services/uploadYoutubePage":195,"./services/youtubeLink":196}],194:[function(require,module,exports){
'use strict';

module.exports = ['PageLoader',
    function (PageLoader) {
        var ctrl = this;
        var previousValues = {};

        ctrl.getPreviousValues = function () {
            return previousValues;
        };

        ctrl.getElementsToCompare = function () {
            return ['youtubeLinkFormatted', 'description', 'pageId'];
        };

        ctrl.getValues = function () {
            var pageDetail = PageLoader.getPageDetails(), values = {};
            values.youtubeLink = pageDetail.link;
            values.youtubeLinkFormatted = pageDetail.link;
            values.description = pageDetail.description;
            values.pageId = pageDetail.pageId;
            previousValues = angular.copy(values);
            return values;
        };
    }];

},{}],195:[function(require,module,exports){
'use strict';

module.exports = ['PageCategoryHandler', 'PageHandlingUpload',
    function (PageCategoryHandler, PageHandlingUpload) {
        var ctrl = this;

        ctrl.uploadPage = function (description, link, pageId) {
            var json = {
                youtubePage: {
                    language: PageCategoryHandler.getLanguageCode(),
                    title: PageCategoryHandler.getTitle(),
                    description: description,
                    link: link,
                    pageId: pageId
                }
            };
            PageHandlingUpload.uploadPage(json, pageId, 'Youtube', null);
        };
    }];

},{}],196:[function(require,module,exports){
'use strict';

module.exports = [
    function () {
        var ctrl = this;

        ctrl.isValidYoutubeLink = function (link) {
            var isValidLink = false;
            if (angular.isString(link)) {
                if (link.indexOf('https://www.youtube.com/embed/') !== -1 || link.indexOf('https://www.youtube.com/watch?v=') !== -1) {
                    isValidLink = true;
                }
            }
            return isValidLink;
        };

        ctrl.getYoutubeLink = function (link) {
            if(ctrl.isValidYoutubeLink(link)) {
                if (link.indexOf('https://www.youtube.com/watch?v=') !== -1) {
                    link = link.replace('https://www.youtube.com/watch?v=', 'https://www.youtube.com/embed/');
                }
            }
            return link;
        };
    }];

},{}],197:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {

            },
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/page/handlingPages/template.html'
        };
    }],
    name: 'elyPageHandlingPages'
};

},{"./controller.js":179}],198:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('PageEditModeService', require('./services/editModeService'));
app.service('PageHandlingState', require('./services/stateHandler'));
app.service('PageHandlingUpload', require('./services/uploadPage'));
},{"./directive.js":197,"./services/editModeService":199,"./services/stateHandler":200,"./services/uploadPage":201}],199:[function(require,module,exports){
'use strict';

module.exports = [
    function () {
        var ctrl = this;
        var isEditMode = false;

        ctrl.reset = function () {
            isEditMode = false;
        };

        ctrl.setEditMode = function () {
            isEditMode = true;
        };

        ctrl.isEditMode = function () {
            return isEditMode;
        };

        ctrl.hasChanged = function (newValues, previousValues, elementsToCompare) {
            var compare = {}, previousCompare = {};
            if (isEditMode) {
                angular.forEach(elementsToCompare, function (elementToCompare) {
                    compare[elementToCompare] = newValues[elementToCompare];
                    previousCompare[elementToCompare] = previousValues[elementToCompare];
                });
                return !angular.equals(compare, previousCompare);
            }
            return false;
        };

    }];

},{}],200:[function(require,module,exports){
'use strict';

var notifyObservables = function (observables, selectedState) {
    angular.forEach(observables, function (observable) {
        observable.stateChanged(selectedState);
    });
};

module.exports = [
    function () {
        var ctrl = this;
        var selectedState;
        var previousState;
        var observables = [];

        ctrl.reset = function () {
            selectedState = 1;
            previousState = 1;
        };

        ctrl.goToPreviousState = function () {
            var hasChanged = selectedState !== previousState;
            selectedState = previousState;
            if (hasChanged) {
                notifyObservables(observables, selectedState);
            }
        };

        ctrl.goToState = function (stateNumber) {
            if (stateNumber !== selectedState) {
                previousState = selectedState;
                selectedState = stateNumber;
                notifyObservables(observables, selectedState);
            }
        };

        ctrl.registerStateChange = function (observable) {
            observables.push(observable);
        };
    }];

},{}],201:[function(require,module,exports){
'use strict';

var goToPageDetail = function (pageId, $state, categoryType) {
    $state.go('page.detail', {
        label: categoryType,
        pageId: pageId
    });
};

var getPageId = function (pageId, resp) {
    if (!pageId) {
        return resp.pageId;
    }
    return pageId;
};

var getApi = function (isEditMode) {
    if (isEditMode) {
        return 'api/user/page/edit';
    }
    return 'api/user/page/create';
};

/**
 * Returns if the upload is in edit mode. When a page Id is present the upload will be as edit mode
 * @param pageId
 * @returns {boolean}
 */
var isEditMode = function (pageId) {
    return pageId !== undefined && pageId !== null;
};

var recommendPage = function (ElyModal, $state, pageId, categoryType) {
    ElyModal.show({
        templateUrl: 'app/modules/recommendation/modalAddRecommendation.html',
        controller: 'ModalAddRecommendationCtrl',
        resolve: {
            pageId: function () {
                return pageId;
            }
        }
    }).then(function () {
        goToPageDetail(pageId, $state, categoryType);
    });
};

module.exports = ['$state', 'errorToast', 'fileUpload', 'ElyModal',
    function ($state, errorToast, fileUpload, ElyModal) {

        var ctrl = this;

        ctrl.uploadPage = function (json, pageId, categoryType, imageToUpload) {
            var api, editMode = isEditMode(pageId);
            api = getApi(editMode);

            fileUpload.uploadFileAndJson(imageToUpload, json, api)
                .success(function (resp) {
                    pageId = getPageId(pageId, resp);
                    if (editMode) {
                        goToPageDetail(pageId, $state, categoryType);
                    } else {
                        recommendPage(ElyModal, $state, pageId, categoryType);
                    }
                })
                .error(function () {
                    errorToast.showError('Fehler! Seite konnte nicht hochgeladen werden');
                });
        };

    }];

},{}],202:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');

app.controller('GetPageAndExtendCtrl', require('./userRecommendation/getPageAndExtendCtrl'));

app.controller('PageDetailCtrl', require('./pageDetail/pageDetailCtrl'));
app.controller('PageDetailEducationCtrl', require('./pageDetail/pageDetailEducationCtrl'));
app.controller('pageHeaderActivityPreviewCtrl', require('./pageDetail/pageHeaderActivityPreviewCtrl'));
app.controller('AddRemoveRecommendationCtrl', require('./addRemoveRecommendationCtrl'));

app.service('PageRecommendationAllContact', require('./services/pageRecommendationAllContact'));
app.service('PageRecommendationOtherUser', require('./services/pageRecommendationOtherUser'));
app.service('PageDetail', require('./services/pageDetail'));
app.service('SearchPage', require('./services/searchPage'));
app.service('PopularPages', require('./services/popularPages'));
app.service('PageCategories', require('./services/categories'));
app.service('PageUserRecommendation', require('./services/pageUserRecommendation'));
app.service('PageUserAdministration', require('./services/pageUserAdministration'));
app.service('PageSearchUserRecommendation', require('./services/pageSearchUserRecommendation'));
app.service('PageSearchUserAdministratedPage', require('./services/pageSearchUserAdministratedPage'));
app.service('PageLeftNavElements', require('./services/leftNavElements'));

app.service('PageDetailReview', require('./pageDetail/services/pageDetailReview'));

app.config(['$stateProvider', function ($stateProvider) {

    $stateProvider
        .state('page', {
            abstract: true,
            url: '/page'

        })
        .state('page.overview', {
            url: '/overview',
            views: {
                'content@': {
                    template: '<ely-page-overview></ely-page-overview>'
                }
            },
            hasNavigation: true
        })
        .state('page.detail', {
            url: '/detail/{label}/{pageId}',
            views: {
                'content@': {
                    templateUrl: 'app/modules/page/pageDetail/pageDetail.html',
                    controller: 'PageDetailCtrl'
                }
            },
            hasNavigation: true
        })
        .state('page.edit', {
            url: '/edit/{label}/{pageId}',
            views: {
                'content@': {
                    template: '<ely-page-handling-pages></ely-page-handling-pages>'
                }
            },
            hasNavigation: true
        })
        .state('page.create', {
            url: '/create',
            views: {
                'content@': {
                    template: '<ely-page-handling-pages></ely-page-handling-pages>'
                }
            },
            hasNavigation: true
        })
        .state('page.userRecommendation', {
            url: '/user/recommendation',
            views: {
                'content@': {
                    template: '<ely-page-user-recommendation></ely-page-user-recommendation>'
                }
            },
            hasNavigation: true
        })
        .state('page.userPageAdmin', {
            url: '/user/admin',
            views: {
                'content@': {
                    template: '<ely-page-user-administrator></ely-page-user-administrator>'
                }
            },
            hasNavigation: true
        });
}]);
},{"./addRemoveRecommendationCtrl":170,"./pageDetail/pageDetailCtrl":209,"./pageDetail/pageDetailEducationCtrl":210,"./pageDetail/pageHeaderActivityPreviewCtrl":211,"./pageDetail/services/pageDetailReview":212,"./services/categories":219,"./services/leftNavElements":220,"./services/pageDetail":221,"./services/pageRecommendationAllContact":222,"./services/pageRecommendationOtherUser":223,"./services/pageSearchUserAdministratedPage":224,"./services/pageSearchUserRecommendation":225,"./services/pageUserAdministration":226,"./services/pageUserRecommendation":227,"./services/popularPages":228,"./services/searchPage":229,"./userRecommendation/getPageAndExtendCtrl":235}],203:[function(require,module,exports){
'use strict';
module.exports = {
    directiveCtrl: function () {
        return ['$scope', 'PageRecommendationAllContact', 'SearchPage', 'PageCategories', 'PopularPages', 'PageLeftNavElements',
            function ($scope, PageRecommendationAllContact, SearchPage, PageCategories, PopularPages, PageLeftNavElements) {

                var ctrl = this;
                ctrl.query = "";
                ctrl.hide = false;

                ctrl.PageRecommendationAllContact = PageRecommendationAllContact;
                ctrl.SearchPage = SearchPage;
                ctrl.PopularPages = PopularPages;
                ctrl.searchPageRequest = {};
                ctrl.popularBooksContact = {initParams: {onlyContacts: true, category: 'Book'}};
                ctrl.popularYoutubeContact = {initParams: {onlyContacts: true, category: 'Youtube'}};
                ctrl.popularBooksAll = {initParams: {onlyContacts: false, category: 'Book'}};
                ctrl.popularYoutubeAll = {initParams: {onlyContacts: false, category: 'Youtube'}};

                $scope.$emit(PageLeftNavElements.event, PageLeftNavElements.elements);

                ctrl.searchPage = function (searchValue) {
                    if (searchValue && searchValue.trim().length > 0) {
                        ctrl.hide = true;
                        ctrl.searchPageRequest.startRequested({
                            search: searchValue,
                            isSuggestion: false
                        });
                    } else {
                        ctrl.hide = false;
                    }
                };

            }];
    }
};

},{}],204:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/page/overview/template.html'
        };
    }],
    name: 'elyPageOverview'
};

},{"./controller.js":203}],205:[function(require,module,exports){
arguments[4][49][0].apply(exports,arguments)
},{"./directive.js":204,"dup":49}],206:[function(require,module,exports){
'use strict';

var initRating = function ($scope) {
    var i;
    $scope.rating = [];
    for (i = 0; i < 5; i++) {
        $scope.rating.push({numberOfRatings: 0, rating: 0, width: 1});
    }
};

var calculateSummaryRating = function ($scope) {
    $scope.totalNumberOfRatings = 0;
    $scope.summaryRating = 0;
    angular.forEach($scope.review.ratings, function (rating) {
        $scope.totalNumberOfRatings += rating.numberOfRatings;
        $scope.summaryRating += (rating.rating * rating.numberOfRatings);
        $scope.rating[rating.rating - 1] = rating;
        $scope.rating[rating.rating - 1].width = 1;
    });
    if ($scope.summaryRating > 0) {
        $scope.summaryRating = Math.round(($scope.summaryRating / $scope.totalNumberOfRatings) * 10) / 10;
    } else {
        $scope.summaryRating = 0;
    }
};

var calculateDiagramBlockWidth = function ($scope) {
    var i;
    $scope.review.ratings.sort(function (a, b) {
        return b.numberOfRatings - a.numberOfRatings;
    });
    for (i = 0; i < $scope.review.ratings.length; i++) {
        if (i === 0) {
            $scope.rating[$scope.review.ratings[0].rating - 1].width = 100;
        } else {
            $scope.rating[$scope.review.ratings[i].rating - 1].width =
                ($scope.review.ratings[i].numberOfRatings / $scope.review.ratings[0].numberOfRatings ) * 100;
        }
    }

};

var setCreateDate = function (reviews, moment) {
    angular.forEach(reviews, function (review) {
        review.created = moment.unix(review.created).format('LL');
    });
};
//$window.scrollTo(
var getRating = function ($scope, $stateParams, PageDetailReview, moment, skip, limit, skipCalculate) {
    $scope.review = PageDetailReview.get({
        skip: skip,
        maxItems: limit,
        onlyContacts: $scope.onlyContacts,
        pageId: $stateParams.pageId,
        label: $stateParams.label
    }, function () {
        if (!skipCalculate) {
            calculateSummaryRating($scope);
            calculateDiagramBlockWidth($scope);
        }
        setCreateDate($scope.review.reviews, moment);
    });
};

module.exports = {
    directiveCtrl: function () {
        return ['$scope', '$stateParams', 'PageDetailReview', 'moment',
            function ($scope, $stateParams, PageDetailReview, moment) {
                $scope.onlyContacts = $scope.onlyContacts === 'true';
                $scope.numberOfElements = 4;
                $scope.skipComments = 0;
                $scope.beginningSkip = {width: '610px'};

                initRating($scope);

                getRating($scope, $stateParams, PageDetailReview, moment, 0, 4);

                $scope.$on('page.detail.edit.child', function () {
                    getRating($scope, $stateParams, PageDetailReview, moment, 0, 4);
                });

                $scope.nextComments = function () {
                    $scope.skipComments += $scope.numberOfElements;
                    $scope.beginningSkip = {};
                    getRating($scope, $stateParams, PageDetailReview, moment, $scope.skipComments, $scope.numberOfElements, true);
                };

                $scope.previousComments = function () {
                    if ($scope.skipComments > 0) {
                        $scope.skipComments -= $scope.numberOfElements;
                        if ($scope.skipComments <= 0) {
                            $scope.skipComments = 0;
                            $scope.beginningSkip = {width: '610px'};
                            getRating($scope, $stateParams, PageDetailReview, moment, 0, 4);
                        } else {
                            getRating($scope, $stateParams, PageDetailReview, moment, $scope.skipComments, $scope.numberOfElements, true);
                        }
                    }
                };
            }];
    }
};

},{}],207:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                onlyContacts: '@',
                title: '@'
            },
            templateUrl: 'app/modules/page/pageDetail/detailReview/template.html',
            controller: controller.directiveCtrl()
        };
    }],
    name: 'elyPageReview'
};

},{"./controller.js":206}],208:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"./directive.js":207,"dup":14}],209:[function(require,module,exports){
'use strict';

module.exports = ['$scope', '$window', '$state', '$stateParams', 'PageDetail', 'PageLeftNavElements', 'moment', 'PageCategories',
    function ($scope, $window, $state, $stateParams, PageDetail, PageLeftNavElements, moment, PageCategories) {

        $scope.$emit(PageLeftNavElements.event, PageLeftNavElements.elements);

        $scope.pageDetail = PageDetail.get({pageId: $stateParams.pageId, label: $stateParams.label}, function () {
            $scope.startLoad = true;
            if ($scope.pageDetail.recommendation && $scope.pageDetail.recommendation.user) {
                $scope.pageDetail.recommendation.user.created = moment.unix($scope.pageDetail.recommendation.user.created).format('LL');
            }
        });

        $scope.category = PageCategories.categories[$stateParams.label].description;
        $scope.pageId = $stateParams.pageId;
        $scope.label = $stateParams.label;

        $scope.openLink = function (link) {
            if (link) {
                $window.open(link, '_blank');
            }
        };

        $scope.openUserDetails = function (userId) {
            $state.go('user.detail', {
                userId: userId
            });
        };

        $scope.getTime = function (time) {
            return moment.unix(time).format('L');
        };

        $scope.goEditPage = function (pageId, label) {
            $state.go('page.edit', {
                pageId: pageId,
                label: label
            });
        };

        $scope.$on('page.detail.edit', function (event) {
            if (event.stopPropagation) {
                event.stopPropagation();
            }
            $scope.$broadcast('page.detail.edit.child');
        });
    }];

},{}],210:[function(require,module,exports){
'use strict';

module.exports = ['$scope',
    function ($scope) {

        $scope.$watch('pageDetail.course', function (newPageDetails) {
            if (newPageDetails) {
                angular.forEach(newPageDetails, function (detail) {
                    detail.label = 'Course';
                });
            }
        });
    }];

},{}],211:[function(require,module,exports){
'use strict';

module.exports = ['$scope', '$state',
    function ($scope, $state) {

        $scope.openDetail = function (pageId, label) {
            $state.go('page.detail', {
                label: label,
                pageId: pageId
            });
        };
    }];

},{}],212:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/page/review');
}];

},{}],213:[function(require,module,exports){
'use strict';

var minScreenSize = 1000;
var maxScreenSize = 1900;

var setContainerWidth = function (ctrl, $scope) {
    var containerSize, screenWidth = $(window).width();
    if (ctrl.containerMaxWidth) {
        ctrl.numberOfElements = Math.floor(ctrl.containerMaxWidth / 190);
    } else if (screenWidth > minScreenSize && screenWidth <= maxScreenSize) {
        containerSize = screenWidth - 270;
        ctrl.numberOfElements = Math.floor(containerSize / 190);
    } else if (screenWidth < minScreenSize) {
        ctrl.numberOfElements = 4;
    } else if (screenWidth > maxScreenSize) {
        ctrl.numberOfElements = 8;
    }

    ctrl.containerWidth = 190 * ctrl.numberOfElements;
    $scope.$applyAsync();
};

var resetPages = function (ctrl) {
    ctrl.pagePreviews = [];
    ctrl.expandSkipPages = 0;
    ctrl.expand = false;
};

var setCategories = function (pages, PageCategories) {
    angular.forEach(pages, function (page) {
        page.category = PageCategories.categories[page.label];
    });
};

var containsPage = function (page, pagePreviews) {
    var exists = false;
    angular.forEach(pagePreviews, function (existingPage) {
        if (existingPage.pageId === page.pageId) {
            exists = true;
        }
    });
    return exists;
};

var addPagePreview = function (ctrl) {
    angular.forEach(ctrl.pagePreviewsTemp.pages, function (page) {
        if (!containsPage(page, ctrl.pagePreviews)) {
            ctrl.pagePreviews.push(page);
        }
    });
};

var getPages = function (ctrl, service, serviceParameter, PageCategories, limit, skip) {
    var params;
    if (service && serviceParameter) {
        params = {
            maxItems: limit,
            skip: skip
        };
        angular.extend(params, serviceParameter);
        ctrl.pagePreviewsTemp = service.get(params, function () {
            setCategories(ctrl.pagePreviewsTemp.pages, PageCategories);
            addPagePreview(ctrl);
            ctrl.totalNumberOfPages = ctrl.pagePreviewsTemp.totalNumberOfPages;
            if (ctrl.pageRequestStart.hasOwnProperty('requestFinished')) {
                ctrl.pageRequestStart.requestFinished(ctrl.pagePreviews);
            }
        });
    }
};

module.exports = {
    directiveCtrl: function () {
        return ['$scope', 'PageCategories', function ($scope, PageCategories) {
            var serviceParameter = {}, ctrl = this;
            resetPages(ctrl);

            if (!ctrl.containerMaxWidth) {
                $(window).resize(function () {
                    setContainerWidth(ctrl, $scope);
                });
            }

            setContainerWidth(ctrl, $scope);

            ctrl.pageRequestStart.startRequested = function (params) {
                serviceParameter = params;
                resetPages(ctrl);
                getPages(ctrl, ctrl.service, params, PageCategories, 9, 0);
            };

            if (ctrl.pageRequestStart.hasOwnProperty('initParams')) {
                ctrl.pageRequestStart.startRequested(ctrl.pageRequestStart.initParams);
            }

            ctrl.startExpand = function () {
                ctrl.expandNumberOfPages = (ctrl.numberOfElements * 2);
                ctrl.expandSkipPages = 0;
                ctrl.expand = true;
                getPages(ctrl, ctrl.service, serviceParameter, PageCategories, ctrl.expandNumberOfPages, ctrl.expandSkipPages);
            };

            ctrl.nextPages = function () {
                ctrl.expandSkipPages += ctrl.expandNumberOfPages;
                getPages(ctrl, ctrl.service, serviceParameter, PageCategories, ctrl.expandNumberOfPages, ctrl.expandSkipPages);
            };
        }];
    }
};

},{}],214:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            bindToController: {
                videoHeight: '@',
                videoWidth: '@',
                containerMaxWidth: '@',
                title: '@',
                hidePreview: '=',
                service: '=',
                pageRequestStart: '='
            },
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/page/pagePreviewContainer/template.html'
        };
    }],
    name: 'elyPagePreviewContainer'
};

},{"./controller.js":213}],215:[function(require,module,exports){
arguments[4][49][0].apply(exports,arguments)
},{"./directive.js":214,"dup":49}],216:[function(require,module,exports){
'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$scope', '$state', 'Languages', 'PageCategories', 'ElyModal', 'UrlCache',
            function ($scope, $state, Languages, PageCategories, ElyModal, UrlCache) {

                $scope.cacheUrl = UrlCache.cacheUrl;

                $scope.$watchCollection('pagePreview', function (newValue) {
                    if (newValue) {
                        $scope.pagePreview.languageShow = Languages.getLanguage($scope.pagePreview.language);
                        $scope.pagePreview.labelShow = PageCategories.categories[$scope.pagePreview.label].description;
                    }
                });

                $scope.openDetail = function (pageId, label) {
                    $state.go('page.detail', {
                        label: label,
                        pageId: pageId
                    });
                };

                $scope.showComment = function (contact) {
                    if (contact && contact.hasOwnProperty('comment') && contact.comment.trim() !== "" && contact.hasOwnProperty('url')) {
                        ElyModal.show({
                            scope: {contact: contact},
                            title: 'Kommentar zu ' + $scope.pagePreview.title,
                            templateUrl: 'app/modules/page/pagePreview/commentDialog.html'
                        });
                    }
                };
            }];
    }
};

},{}],217:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                videoHeight: '@',
                videoWidth: '@',
                pagePreview: '='
            },
            templateUrl: 'app/modules/page/pagePreview/template.html',
            controller: controller.directiveCtrl()
        };
    }],
    name: 'elyPagePreview'
};

},{"./controller.js":216}],218:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"./directive.js":217,"dup":14}],219:[function(require,module,exports){
'use strict';

var categories = {
    Book: {description: 'Buch'},
    Youtube: {description: 'Youtube'},
    Course: {description: 'Kurs'},
    Education: {description: 'Ausbildung'}
};

module.exports = [
    function () {
        this.categories = categories;

        this.getCategories = function () {
            var key, collection = [];
            for (key in categories) {
                if (categories.hasOwnProperty(key)) {
                    collection.push(categories[key].description);
                }
            }
            return collection;
        };

        this.getPageType = function (description) {
            var result = false, key;

            for (key in categories) {
                if (categories[key].description === description) {
                    result = key;
                }
            }
            return result;
        };
    }];

},{}],220:[function(require,module,exports){
'use strict';

module.exports = [
    function () {
        this.event = 'elyoos.leftNav.changed';

        this.elements = [
            {description: 'Empfehlungen', url: 'recommendation', color: '#009688', sref: 'page.overview'},
            {
                description: 'Seite',
                url: 'page',
                color: '#658092',
                sref: 'page.detail',
                onlyShowSelected: true
            },
            {
                description: 'Seite bearbeiten',
                url: 'pageEdit',
                color: '#658092',
                sref: 'page.edit',
                onlyShowSelected: true
            },
            {description: 'Meine Bewertungen', url: 'pageMyRecommendation', color: '#ce5043', sref: 'page.userRecommendation'},
            {description: 'Meine Seiten', url: 'myPage', color: '#1aa1e1', sref: 'page.userPageAdmin'},
            {description: 'Seite erstellen', url: 'add', color: '#FFA000', sref: 'page.create'},
            {description: 'Home', url: 'home', color: '#B3C833', sref: 'home'}];
    }];

},{}],221:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/page/detail');
}];

},{}],222:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/page/recommendationAllContact');
}];

},{}],223:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/page/recommendationOtherUser');
}];

},{}],224:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/user/page/searchAdministration');
}];

},{}],225:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/user/page/searchRecommendation');
}];

},{}],226:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/user/page/administrator');
}];

},{}],227:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/user/page/recommendation');
}];

},{}],228:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/page/popularPages');
}];

},{}],229:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/page/searchPage');
}];

},{}],230:[function(require,module,exports){
'use strict';
module.exports = {
    directiveCtrl: function () {
        return ['$scope', 'PageLeftNavElements', 'PageUserAdministration', 'PageSearchUserAdministratedPage',
            function ($scope, PageLeftNavElements, PageUserAdministration, PageSearchUserAdministratedPage) {

                $scope.getPageService = PageUserAdministration;
                $scope.searchPageService = PageSearchUserAdministratedPage;

                $scope.$emit(PageLeftNavElements.event, PageLeftNavElements.elements);

            }];
    }
};

},{}],231:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/page/userAdministrator/template.html'
        };
    }],
    name: 'elyPageUserAdministrator'
};

},{"./controller.js":230}],232:[function(require,module,exports){
arguments[4][49][0].apply(exports,arguments)
},{"./directive.js":231,"dup":49}],233:[function(require,module,exports){
'use strict';
module.exports = {
    directiveCtrl: function () {
        return ['$scope', 'PageLeftNavElements', 'PageUserRecommendation', 'PageSearchUserRecommendation',
            function ($scope, PageLeftNavElements, PageUserRecommendation, PageSearchUserRecommendation) {

                $scope.getPageService = PageUserRecommendation;
                $scope.searchPageService = PageSearchUserRecommendation;

                $scope.$emit(PageLeftNavElements.event, PageLeftNavElements.elements);
            }];
    }
};

},{}],234:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/page/userRecommendation/template.html'
        };
    }],
    name: 'elyPageUserRecommendation'
};

},{"./controller.js":233}],235:[function(require,module,exports){
'use strict';

var addPagePreviews = function ($scope, paginationNumber) {
    if (paginationNumber === 1 || !$scope.pagePreviews) {
        $scope.pagePreviews = $scope.pagePreviewsTemp;
        if ($scope.pagePreviews.pages.length === 0) {
            $scope.noPage = true;
        }
    } else {
        $scope.pagePreviews.pages.push.apply($scope.pagePreviews.pages, $scope.pagePreviewsTemp.pages);
        $scope.pagePreviews.totalNumberOfPages = $scope.pagePreviewsTemp.totalNumberOfPages;
    }
};

module.exports = ['$scope', function ($scope) {

    var itemsPerPage = 30, searchActive = false, lastSearch = '';
    $scope.noSearchResult = false;
    $scope.noPage = false;
    $scope.currentSkip = 1;

    $scope.getPage = function (paginationNumber) {
        var skip = (paginationNumber - 1) * itemsPerPage;
        $scope.noSearchResult = false;
        $scope.pagePreviewsTemp = $scope.getPageService.get({skip: skip, maxItems: itemsPerPage}, function () {
            searchActive = false;
            $scope.noPage = false;
            addPagePreviews($scope, paginationNumber);
        });
    };

    $scope.searchSuggestionPage = function (searchValue) {
        if (searchValue && searchValue.trim().length > 0) {
            return $scope.searchPageService.query({
                search: searchValue,
                maxItems: 7,
                skip: 0,
                isSuggestion: true
            }).$promise;
        } else {
            if (searchActive) {
                $scope.currentSkip = 1;
                $scope.getPage(1);
            }
        }
    };

    $scope.searchPage = function (searchValue, paginationNumber) {
        var skip = 0;
        if (searchValue && searchValue.trim().length > 0) {
            $scope.noSearchResult = false;
            if (isFinite(paginationNumber)) {
                skip = (paginationNumber - 1) * itemsPerPage;
            } else {
                $scope.currentSkip = 1;
            }
            $scope.pageSearchPreviews = $scope.searchPageService.get({
                search: searchValue,
                maxItems: itemsPerPage,
                skip: skip,
                isSuggestion: false
            }, function () {
                searchActive = true;
                lastSearch = searchValue;
                if ($scope.pageSearchPreviews.pages && $scope.pageSearchPreviews.pages.length > 0) {
                    if (skip === 0) {
                        $scope.pagePreviews = $scope.pageSearchPreviews;
                    } else {
                        $scope.pagePreviews.pages.push.apply($scope.pagePreviews.pages, $scope.pageSearchPreviews.pages);
                        $scope.pagePreviews.totalNumberOfPages = $scope.pageSearchPreviews.totalNumberOfPages;
                    }
                } else {
                    $scope.noSearchResult = true;
                }
            });
        } else {
            $scope.currentSkip = 1;
            $scope.getPage(1);
        }
    };

    $scope.getNextPages = function () {
        $scope.currentSkip++;
        if (searchActive) {
            $scope.searchPage(lastSearch, $scope.currentSkip);
        } else {
            $scope.getPage($scope.currentSkip);
        }

    };

    $scope.getPage(1);
}];

},{}],236:[function(require,module,exports){
arguments[4][49][0].apply(exports,arguments)
},{"./directive.js":234,"dup":49}],237:[function(require,module,exports){
'use strict';

module.exports = {
    directiveCtrl: function () {
        return [ '$mdDialog',
            function ($mdDialog) {
                var ctrl = this;

                ctrl.createProblem = function () {
                    $mdDialog.show({
                        templateUrl: 'app/modules/problem/createProblem/template.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose: false,
                        escapeToClose: false,
                        controller: 'CreateProblemController',
                        locals: {element: ctrl.element},
                        bindToController: true,
                        controllerAs: 'ctrl'
                    }).then(function (resp) {

                    });
                };
            }];
    }
};


},{}],238:[function(require,module,exports){
'use strict';

module.exports = ['$scope', 'userInfo', '$mdDialog', 'CreateProblemCheck', 'UploadProblem',
    function ($scope, userInfo, $mdDialog, CreateProblemCheck, UploadProblem) {
        var ctrl = this;
        ctrl.userInfo = userInfo.getUserInfo();

        ctrl.cancel = function () {
            $mdDialog.cancel();
        };


        ctrl.uploadProblem = function () {
            if (ctrl.sendBlogAllowed && !ctrl.blogUploadStarted) {
                ctrl.blogUploadStarted = true;
                UploadProblem.upload($scope.problemText).then(function (resp) {
                    $mdDialog.hide(resp);
                });
            }
        };

        $scope.$watch('problemText', function (newProblemText) {
            ctrl.sendBlogAllowed = CreateProblemCheck.isSendProblemAllowed(newProblemText);
        });
    }];


},{}],239:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');

app.controller('CreateProblemController', require('./controller'));

app.service('UploadProblem', require('./services/uploadProblem'));

app.service('CreateProblemCheck', require('./services/createProblemCheck'));

},{"./controller":238,"./services/createProblemCheck":240,"./services/uploadProblem":241}],240:[function(require,module,exports){
'use strict';


module.exports = [
    function () {

        this.isSendProblemAllowed = function (text) {
            if (text) {
                return text.trim() !== '';
            }
            return false;
        };
    }];

},{}],241:[function(require,module,exports){
'use strict';


module.exports = ['CreateProblemCheck', 'Problem', '$q',
    function (CreateProblemCheck, Problem, $q) {

        var uploadProblemIsRunning = false;
        this.upload = function (blogText) {
            var deferred = $q.defer();
            if (CreateProblemCheck.isSendProblemAllowed(blogText) && !uploadProblemIsRunning) {
                uploadProblemIsRunning = true;
                Problem.save({description: blogText}, function (resp) {
                    uploadProblemIsRunning = false;
                    resp.isAdmin = true;
                    deferred.resolve(resp);
                }, function () {
                    uploadProblemIsRunning = false;
                    deferred.reject({});
                });
            } else {
                deferred.reject({});
            }
            return deferred.promise;
        };
    }];

},{}],242:[function(require,module,exports){
'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$stateParams', 'ProblemDetail',
            function ($stateParams, ProblemDetail) {
                var ctrl = this;
                ctrl.detail = ProblemDetail.get({id: $stateParams.problemId}, function (resp) {

                });
            }];
    }
};


},{}],243:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            bindToController: true,
            templateUrl: 'app/modules/problem/detail/template.html'
        };
    }],
    name: 'elyProblemDetail'
};

},{"./controller.js":242}],244:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('ProblemDetail', require('./services/problemDetail'));
},{"./directive.js":243,"./services/problemDetail":262}],245:[function(require,module,exports){
'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$stateParams', 'ScrollRequest', 'ProblemReason', 'ScrollProblemReasonService', '$mdDialog', 'SortProblemReasonService',
            function ($stateParams, ScrollRequest, ProblemReason, ScrollProblemReasonService, $mdDialog, SortProblemReasonService) {
                var ctrl = this;
                ctrl.overview = {reasons: []};

                ScrollRequest.reset('ProblemReasons', ProblemReason.get, ScrollProblemReasonService);

                ctrl.nextReasons = function () {
                    ScrollRequest.nextRequest('ProblemReasons', ctrl.overview.reasons, {problemId: $stateParams.problemId})
                        .then(function (overview) {
                            ctrl.overview = overview;
                        });
                };

                ctrl.nextReasons();

                ctrl.createReason = function () {
                    $mdDialog.show({
                        templateUrl: 'app/modules/problem/detail/reason/create/template.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose: false,
                        escapeToClose: false,
                        controller: 'CreateReasonController',
                        bindToController: true,
                        controllerAs: 'ctrl'
                    }).then(function (resp) {

                    });
                };

                ctrl.sortRequest = function () {
                    SortProblemReasonService.sort(ctrl.overview.reasons);
                };
            }];
    }
};


},{}],246:[function(require,module,exports){
'use strict';

module.exports = ['$scope', 'userInfo', '$mdDialog', 'CreateProblemReasonCheck', 'UploadReason', '$stateParams',
    function ($scope, userInfo, $mdDialog, CreateProblemReasonCheck, UploadReason, $stateParams) {
        var ctrl = this;
        ctrl.userInfo = userInfo.getUserInfo();

        ctrl.cancel = function () {
            $mdDialog.cancel();
        };


        ctrl.uploadReason = function () {
            if (ctrl.sendReasonAllowed && !ctrl.uploadStarted) {
                ctrl.uploadStarted = true;
                UploadReason.upload($scope.titleReason, $scope.descriptionReason, $stateParams.problemId).then(function (resp) {
                    $mdDialog.hide(resp);
                });
            }
        };

        $scope.$watch('titleReason', function (newReasonTitle) {
            ctrl.sendReasonAllowed = CreateProblemReasonCheck.isSendReasonAllowed(newReasonTitle, $scope.descriptionReason);
        });

        $scope.$watch('descriptionReason', function (newReasonDescription) {
            ctrl.sendReasonAllowed = CreateProblemReasonCheck.isSendReasonAllowed($scope.titleReason, newReasonDescription);
        });
    }];


},{}],247:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');

app.controller('CreateReasonController', require('./controller'));

app.service('UploadReason', require('./services/uploadReason'));
app.service('CreateProblemReasonCheck', require('./services/createProblemReasonCheck'));

},{"./controller":246,"./services/createProblemReasonCheck":248,"./services/uploadReason":249}],248:[function(require,module,exports){
'use strict';


module.exports = [
    function () {

        this.isSendReasonAllowed = function (title, description) {
            if (description && title) {
                return description.trim() !== '' && title.trim() !== '';
            }
            return false;
        };
    }];

},{}],249:[function(require,module,exports){
'use strict';


module.exports = ['CreateProblemReasonCheck', 'ProblemReason', '$q',
    function (CreateProblemReasonCheck, ProblemReason, $q) {

        var uploadReasonIsRunning = false;
        this.upload = function (titleReason, descriptionReason, problemId) {
            var deferred = $q.defer();
            if (CreateProblemReasonCheck.isSendReasonAllowed(titleReason, descriptionReason) && !uploadReasonIsRunning) {
                uploadReasonIsRunning = true;
                ProblemReason.save({createReason: {description: descriptionReason, title: titleReason, problemId: problemId}}, function (resp) {
                    uploadReasonIsRunning = false;
                    resp.isAdmin = true;
                    deferred.resolve(resp);
                }, function () {
                    uploadReasonIsRunning = false;
                    deferred.reject({});
                });
            } else {
                deferred.reject({});
            }
            return deferred.promise;
        };
    }];

},{}],250:[function(require,module,exports){
'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$stateParams', 'ProblemReasonDetail', '$state',
            function ($stateParams, ProblemReasonDetail, $state) {
                var ctrl = this;

                ctrl.detail = ProblemReasonDetail.get({reasonId: $stateParams.reasonId});

                ctrl.edit = function () {

                };

                ctrl.goToProblem = function () {
                    $state.go("problem.detail", {problemId: ctrl.detail.reason.problem.problemId});
                };
            }];
    }
};


},{}],251:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            bindToController: {
            },
            templateUrl: 'app/modules/problem/detail/reason/detail/template.html'
        };
    }],
    name: 'elyProblemReasonDetail'
};

},{"./controller.js":250}],252:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('ProblemReasonDetail', require('./services/problemReasonDetail'));
},{"./directive.js":251,"./services/problemReasonDetail":253}],253:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/user/problem/reason/detail', null, {'delete': {method: 'POST', headers: {'X-HTTP-Method-Override': 'DELETE'}}});
}];

},{}],254:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            bindToController: {
                problemDescription: '@'
            },
            templateUrl: 'app/modules/problem/detail/reason/template.html'
        };
    }],
    name: 'elyProblemOverviewReason'
};

},{"./controller.js":245}],255:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('ScrollProblemReasonService', require('./services/scrollProblemReasonService'));
app.service('SortProblemReasonService', require('./services/sortProblemReasonService'));
app.service('ProblemReason', require('./services/problemReason'));
},{"./directive.js":254,"./services/problemReason":259,"./services/scrollProblemReasonService":260,"./services/sortProblemReasonService":261}],256:[function(require,module,exports){
'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['ProblemReason', '$state',
            function (ProblemReason, $state) {
                var ctrl = this;

                ctrl.rateReason = function () {
                    if (!ctrl.element.ratedByUser) {
                        ProblemReason.save({positiveRate: {reasonId: ctrl.element.reasonId}}, function (resp) {
                            ctrl.element.ratedByUser = true;
                            ctrl.element.numberOfRatings = resp.numberOfRatings;
                            ctrl.sortRequest();
                        });
                    }
                };

                ctrl.removeRatingReason = function () {
                    if (ctrl.element.ratedByUser) {
                        ProblemReason.save({removePositiveRate: {reasonId: ctrl.element.reasonId}}, function (resp) {
                            ctrl.element.ratedByUser = false;
                            ctrl.element.numberOfRatings = resp.numberOfRatings;
                            ctrl.sortRequest();
                        });
                    }
                };

                ctrl.openReasonDetail = function () {
                    $state.go("problem.reason.detail", {reasonId: ctrl.element.reasonId});
                };
            }];
    }
};


},{}],257:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            bindToController: {
                element: '=',
                sortRequest: '&'
            },
            templateUrl: 'app/modules/problem/detail/reason/overviewElement/template.html'
        };
    }],
    name: 'elyProblemReasonOverviewElement'
};

},{"./controller.js":256}],258:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);
},{"./directive.js":257}],259:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/user/problem/reason', null, {'delete': {method: 'POST', headers: {'X-HTTP-Method-Override': 'DELETE'}}});
}];

},{}],260:[function(require,module,exports){
'use strict';

module.exports = [function () {

    this.handlingResponse = function (newReasons, previousReasons) {
        newReasons.reasons = previousReasons.concat(newReasons.reasons);
    };

    this.checkRequestPinwall = function (overview, requestedNumberOfElements) {
        return overview.reasons.length === requestedNumberOfElements;
    };
}];

},{}],261:[function(require,module,exports){
'use strict';

module.exports = [function () {

    this.sort = function (reasons) {
        reasons.sort(function (a, b) {
            if (a.numberOfRatings > b.numberOfRatings) {
                return -1;
            } else if (a.numberOfRatings === b.numberOfRatings) {
                if (a.created > b.created) {
                    return -1;
                } else {
                    return 1;
                }
            }
            return 1;
        })
    };

}];

},{}],262:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/user/problem/detail', null, {'delete': {method: 'POST', headers: {'X-HTTP-Method-Override': 'DELETE'}}});
}];

},{}],263:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            bindToController: true,
            templateUrl: 'app/modules/problem/template.html'
        };
    }],
    name: 'elyProblem'
};

},{"./controller.js":237}],264:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('Problem', require('./services/problem'));

app.config(['$stateProvider', function ($stateProvider) {

    $stateProvider
        .state('problem', {
            abstract: true,
            url: '/problem'
        })
        .state('problem.home', {
            url: '/home',
            views: {
                'content@': {
                    template: '<ely-problem></ely-problem>'
                }
            },
            hasSearch: true
        })
        .state('problem.detail', {
            url: '/detail/:problemId',
            views: {
                'content@': {
                    template: '<ely-problem-detail></ely-problem-detail>'
                }
            }
        })
        .state('problem.reason', {
            abstract: true,
            url: '/reason'
        })
        .state('problem.reason.detail', {
            url: '/detail/:reasonId',
            views: {
                'content@': {
                    template: '<ely-problem-reason-detail></ely-problem-reason-detail>'
                }
            }
        });
}]);

},{"./directive.js":263,"./services/problem":272}],265:[function(require,module,exports){
'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['ScrollRequest', 'Problem', 'ProblemScrollRequestResponseHandler',
            function (ScrollRequest, Problem, ProblemScrollRequestResponseHandler) {
                var ctrl = this;
                ctrl.overview = {problems: []};

                ScrollRequest.reset('Problem', Problem.get, ProblemScrollRequestResponseHandler);

                ctrl.nextOverview = function () {
                    ScrollRequest.nextRequest('Problem', ctrl.overview.problems).then(function (overview) {
                        ctrl.overview = overview;
                    });
                };

                ctrl.nextOverview();
            }];
    }
};


},{}],266:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            bindToController: true,
            templateUrl: 'app/modules/problem/overview/template.html'
        };
    }],
    name: 'elyProblemOverview'
};

},{"./controller.js":265}],267:[function(require,module,exports){
'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$state',
            function ($state) {
                var ctrl = this;

                ctrl.openDetail = function (problemId) {
                    $state.go('problem.detail', {
                        problemId: problemId
                    });
                };
            }];
    }
};


},{}],268:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            bindToController: {
                element: '='
            },
            templateUrl: 'app/modules/problem/overview/element/template.html'
        };
    }],
    name: 'elyProblemOverviewElement'
};

},{"./controller.js":267}],269:[function(require,module,exports){
arguments[4][99][0].apply(exports,arguments)
},{"./directive.js":268,"dup":99}],270:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('ProblemScrollRequestResponseHandler', require('./services/scrollRequestResponseHandler'));

},{"./directive.js":266,"./services/scrollRequestResponseHandler":271}],271:[function(require,module,exports){
'use strict';

module.exports = [function () {

    this.handlingResponse = function (newOverview, previousOverview) {
        newOverview.problems = previousOverview.concat(newOverview.problems);
    };

    this.checkRequestPinwall = function (overview, requestedNumberOfElements) {
        return overview.problems.length === requestedNumberOfElements;
    };
}];

},{}],272:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/user/problem', null, {'delete': {method: 'POST', headers: {'X-HTTP-Method-Override': 'DELETE'}}});
}];

},{}],273:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');

app.controller('ModalAddRecommendationCtrl', require('./modalAddRecommendationCtrl'));

app.service('PageRecommendation', require('./services/pageRecommendation'));
},{"./modalAddRecommendationCtrl":274,"./services/pageRecommendation":275}],274:[function(require,module,exports){
'use strict';

module.exports = ['$modalInstance', 'PageRecommendation', 'pageId', function ($modalInstance, PageRecommendation, pageId) {
    var ctrl = this;

    ctrl.numberOfSelectedStars = -1;

    ctrl.abort = function () {
        $modalInstance.dismiss();
    };

    ctrl.addRecommendation = function () {
        var data = {
            pageId: pageId,
            comment: ctrl.recommendationDescription,
            rating: ctrl.numberOfSelectedStars
        };

        delete ctrl.error;
        PageRecommendation.save(data, function (res) {
            data.profileUrl = res.profileUrl;
            data.recommendationId = res.recommendationId;
            data.recommendation = res.recommendation;
            data.created = res.created;
            $modalInstance.close(data);
        }, function () {
            ctrl.error = 'Bewertung konnte nicht gespeichert werden';
        });
    };
}];

},{}],275:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/user/recommendation/page', null, {
        'delete': {method: 'POST', headers: {'X-HTTP-Method-Override': 'DELETE'}}
    });
}];

},{}],276:[function(require,module,exports){
'use strict';

module.exports = ['$scope', 'Privacy', function ($scope, Privacy) {

    $scope.otherPrivacySettingTypes = [];
    $scope.otherPrivacySettingType = {};
    angular.forEach($scope.privacySettings.normal, function (setting) {
        if (setting.type !== $scope.privacy.type) {
            $scope.otherPrivacySettingTypes.push(setting.type);
        }
    });
    if ($scope.otherPrivacySettingTypes.length > 0) {
        $scope.otherPrivacySettingType = $scope.otherPrivacySettingTypes[0];
    }

    $scope.deletePrivacySetting = function () {

        Privacy.delete({
            privacyDescription: $scope.privacy.type,
            newPrivacyDescription: $scope.otherPrivacySettingType
        }, function () {
            angular.forEach($scope.privacySettings.normal, function (setting, index) {
                if (setting.type === $scope.privacy.type) {
                    $scope.privacySettings.normal.splice(index, 1);
                }
            });
            $scope.setPrivacyTypeNoContact();
        });
    };
}];

},{}],277:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');

app.controller('ProfileCtrl', require('./profileCtrl'));
app.controller('PasswordCtrl', require('./passwordCtrl'));
app.controller('PrivacyCtrl', require('./privacyCtrl'));
app.controller('RenamePrivacyCtrl', require('./renamePrivacyCtrl'));
app.controller('DeletePrivacyCtrl', require('./deletePrivacyCtrl'));

app.factory('Profile', require('./services/profile'));
app.factory('Privacy', require('./services/privacy'));
app.factory('Password', require('./services/password'));

app.service('GroupSettingsService', require('./services/groupSettingsService'));

app.config(['$stateProvider', function ($stateProvider) {

    $stateProvider
        .state('settings', {
            abstract: true,
            url: '/settings',
            views: {
                header: {
                    templateUrl: 'app/modules/navigation/loggedInHeader.html'
                }
            }
        })
        .state('settings.profile', {
            url: '/profile',
            views: {
                'content@': {
                    templateUrl: 'app/modules/settings/profile.html',
                    controller: 'ProfileCtrl'
                }
            },
            hasNavigation: true
        })
        .state('settings.profile.changePassword', {
            url: '/newPassword',
            views: {
                'content@': {
                    templateUrl: 'app/modules/settings/changePassword.html',
                    controller: 'PasswordCtrl'
                }
            },
            hasNavigation: true
        })
        .state('settings.privacy', {
            url: '/privacy',
            views: {
                'content@': {
                    templateUrl: 'app/modules/settings/privacy.html',
                    controller: 'PrivacyCtrl'
                }
            },
            hasNavigation: true
        });
}]);
},{"./deletePrivacyCtrl":276,"./passwordCtrl":286,"./privacyCtrl":287,"./profileCtrl":288,"./renamePrivacyCtrl":289,"./services/groupSettingsService":290,"./services/password":291,"./services/privacy":292,"./services/profile":293}],278:[function(require,module,exports){
'use strict';

module.exports = ['Privacy', '$mdDialog', 'CheckGroupNameService', 'errorToast',
    function (Privacy, $mdDialog, CheckGroupNameService, errorToast) {
        var ctrl = this;
        ctrl.profileVisible = true;
        ctrl.contactsVisible = true;
        ctrl.imageVisible = true;
        ctrl.profileDataVisible = true;
        ctrl.uploadAllowed = false;

        ctrl.nameChanged = function () {
            ctrl.validGroupName = CheckGroupNameService.checkNameExists(ctrl.groupName);
            ctrl.createGroupForm.groupName.$setValidity('ely-types-exist', ctrl.validGroupName);
        };

        ctrl.cancel = function () {
            $mdDialog.cancel();
        };

        ctrl.accept = function () {
            ctrl.uploadStarted = true;
            Privacy.save({
                addNewPrivacy: {
                    privacySettings: {
                        profileVisible: ctrl.profileVisible,
                        contactsVisible: ctrl.contactsVisible,
                        imageVisible: ctrl.imageVisible,
                        profileDataVisible: ctrl.profileDataVisible
                    }, privacyDescription: ctrl.groupName
                }
            }, function () {
                $mdDialog.hide(ctrl.groupName);
            }, function () {
                errorToast.showError('Es ist ein Fehler aufgetretten!');
                ctrl.uploadStarted = false;
            });
        };

    }];


},{}],279:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');

app.service('CheckGroupNameService', require('./services/checkGroupName'));

app.controller('AddGroupController', require('./controller'));

},{"./controller":278,"./services/checkGroupName":280}],280:[function(require,module,exports){
'use strict';

module.exports = ['ContactStatisticTypes',
    function (ContactStatisticTypes) {

        this.checkNameExists = function (name) {
            var names = ContactStatisticTypes.getTypes();
            var isValid = true;
            if (angular.isString(name)) {
                angular.forEach(names, function (existingName) {
                    if (existingName.toLowerCase() === name.toLowerCase()) {
                        isValid = false;
                    }
                });
            }
            return isValid;
        };
    }]
;

},{}],281:[function(require,module,exports){
'use strict';

module.exports = ['Privacy', '$mdDialog', 'ContactStatisticTypes', 'errorToast',
    function (Privacy, $mdDialog, ContactStatisticTypes, errorToast) {
        var ctrl = this;

        ctrl.groups = ContactStatisticTypes.getTypes(ctrl.groupName);
        ctrl.selectedGroup = ctrl.groups[0];

        ctrl.cancel = function () {
            $mdDialog.cancel();
        };

        ctrl.accept = function () {
            ctrl.uploadStarted = true;
            Privacy.delete({
                privacyDescription: ctrl.groupName,
                newPrivacyDescription: ctrl.selectedGroup
            }, function () {
                $mdDialog.hide(ctrl.selectedGroup);
            }, function () {
                errorToast.showError('Es ist ein Fehler aufgetretten!');
                ctrl.uploadStarted = false;
            });
        };

    }];


},{}],282:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');

app.controller('DeleteGroupController', require('./controller'));

},{"./controller":281}],283:[function(require,module,exports){
'use strict';

module.exports = ['Privacy', '$mdDialog', 'errorToast', 'ModifyGroupNameService',
    function (Privacy, $mdDialog, errorToast, ModifyGroupNameService) {
        var ctrl = this;
        ctrl.uploadStarted = true;
        ctrl.uploadAllowed = false;

        ctrl.settings = Privacy.get({}, function () {
            ctrl.uploadStarted = false;
            ctrl.setting = ModifyGroupNameService.getSetting(ctrl.settings.normal, ctrl.settings.noContact, ctrl.groupName);
        });

        ctrl.cancel = function () {
            $mdDialog.cancel();
        };

        ctrl.selectChanged = function () {
            ctrl.uploadAllowed = ModifyGroupNameService.settingHasChanged(ctrl.setting);
        };

        ctrl.accept = function () {
            ctrl.uploadStarted = true;
            Privacy.save({
                changePrivacySetting: {
                    privacySettings: {
                        profileVisible: ctrl.setting.profileVisible,
                        contactsVisible: ctrl.setting.contactsVisible,
                        imageVisible: ctrl.setting.imageVisible,
                        profileDataVisible: ctrl.setting.profileDataVisible
                    }, privacyDescription: ctrl.groupName
                }
            }, function () {
                $mdDialog.hide(ctrl.groupName);
            }, function () {
                errorToast.showError('Es ist ein Fehler aufgetretten!');
                ctrl.uploadStarted = false;
            });
        };

    }];


},{}],284:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');

app.service('ModifyGroupNameService', require('./services/groupSetting'));

app.controller('ModifyGroupSettingController', require('./controller'));

},{"./controller":283,"./services/groupSetting":285}],285:[function(require,module,exports){
'use strict';

module.exports = [
    function () {

        var lastSetting;

        this.getSetting = function (settingsNormal, settingNoContact, groupName) {
            var setting;
            angular.forEach(settingsNormal, function (group) {
                if (group.type === groupName) {
                    setting = group;
                }
            });
            if (!setting) {
                setting = settingNoContact;
            }
            lastSetting = angular.copy(setting);
            return setting;
        };

        this.settingHasChanged = function (setting) {
            if (setting && lastSetting) {
                return !angular.equals(setting, lastSetting);
            }
            return false;
        }
    }]
;

},{}],286:[function(require,module,exports){
'use strict';

module.exports = ['$scope', 'Password', 'SettingLeftNavElements', function ($scope, Password, SettingLeftNavElements) {

    $scope.password = {};
    $scope.submitFailed = false;
    $scope.newPasswordNotEqual = false;
    $scope.submitFailedToServer = false;
    $scope.successUserDataChange = false;

    $scope.$emit(SettingLeftNavElements.event, SettingLeftNavElements.elements);

    $scope.submitNewPassword = function () {
        function checkMinPasswordLength() {
            return $scope.password.newPassword.trim().length > 7;
        }

        function checkPasswordEqual() {
            return $scope.password.newPassword === $scope.password.newPasswordConfirm;
        }

        $scope.submitFailed = false;
        $scope.newPasswordNotEqual = false;
        $scope.profileForm.inputPassword.$error.minlength = false;

        if (!$scope.profileForm.$invalid) {
            if (checkMinPasswordLength()) {
                if (checkPasswordEqual()) {
                    Password.save({
                        newPassword: $scope.password.newPassword,
                        actualPassword: $scope.password.actualPassword
                    }, function () {
                        $scope.profileForm.$setPristine();
                        $scope.successUserDataChange = true;
                        $scope.submitFailedToServer = false;
                    }, function () {
                        $scope.submitFailedToServer = true;
                        $scope.successUserDataChange = false;
                    });
                } else {
                    $scope.newPasswordNotEqual = true;
                    $scope.password.newPasswordConfirm = '';
                }
            } else {
                $scope.profileForm.inputPassword.$error.minlength = true;
                $scope.password.newPasswordConfirm = '';
            }
        } else {
            $scope.submitFailed = true;
            $scope.password.newPasswordConfirm = '';
        }
    };
}];

},{}],287:[function(require,module,exports){
'use strict';

var sendUpdatePrivacySetting = function (Privacy, $scope, updatePrivacySetting, privacySettings) {

    Privacy.save(updatePrivacySetting, function () {
        if (updatePrivacySetting.changePrivacyNoContactSetting) {
            angular.copy($scope.selectedType, $scope.privacySettings.noContact);
        } else {
            angular.forEach($scope.privacySettings.normal, function (privacy) {
                if (privacy.type === $scope.selectedType.type) {
                    privacy.profileVisible = privacySettings.profileVisible;
                    privacy.profileDataVisible = privacySettings.profileDataVisible;
                    privacy.imageVisible = privacySettings.imageVisible;
                    privacy.contactsVisible = privacySettings.contactsVisible;
                }
            });
        }
        $scope.$broadcast('ely.send.button.success');
    }, function () {

    });
};

module.exports = ['$scope', 'Privacy', 'SettingLeftNavElements', function ($scope, Privacy, SettingLeftNavElements) {

    $scope.allowedToChangePrivacy = false;
    $scope.selectedType = {};
    $scope.addingPrivacy = {};
    $scope.privacySettings = Privacy.get({}, function () {
        $scope.setPrivacyTypeNoContact();
    });
    $scope.privacySettings.noContactSelected = true;

    $scope.$emit(SettingLeftNavElements.event, SettingLeftNavElements.elements);

    $scope.setPrivacyType = function (type) {
        $scope.privacySettings.noContactSelected = false;

        angular.forEach($scope.privacySettings.normal, function (privacySetting) {
            if (privacySetting.type === type) {
                angular.copy(privacySetting, $scope.selectedType);
                $scope.$broadcast('ely.send.button.model.changed', $scope.selectedType);
            }
        });
    };

    $scope.setPrivacyTypeNoContact = function () {
        $scope.privacySettings.noContactSelected = true;
        angular.copy($scope.privacySettings.noContact, $scope.selectedType);
        $scope.selectedType.isInit = true;
        $scope.$broadcast('ely.send.button.model.changed', $scope.selectedType);
        $scope.selectedType.type = 'kein Kontakt';
    };


    $scope.updatePrivacyType = function () {
        var updatePrivacySetting, privacySettings;

        privacySettings = {
            privacySettings: {
                profileVisible: $scope.selectedType.profileVisible,
                profileDataVisible: $scope.selectedType.profileDataVisible,
                imageVisible: $scope.selectedType.imageVisible,
                contactsVisible: $scope.selectedType.contactsVisible
            }
        };

        if ($scope.privacySettings.noContactSelected) {
            updatePrivacySetting = {};
            updatePrivacySetting.changePrivacyNoContactSetting = privacySettings;
        } else {
            updatePrivacySetting = {};
            updatePrivacySetting.changePrivacySetting = privacySettings;
            updatePrivacySetting.changePrivacySetting.privacyDescription = $scope.selectedType.type;
        }

        sendUpdatePrivacySetting(Privacy, $scope, updatePrivacySetting, privacySettings.privacySettings);
    };

    $scope.showAddingNewPrivacySetting = function () {
        $scope.showNewPrivacySettingInput = true;
        $scope.addingPrivacy.newPrivacyName = "";
    };

    $scope.abortAddingNewPrivacy = function () {
        $scope.showNewPrivacySettingInput = false;
    };

    $scope.addPrivacySetting = function () {
        if ($scope.addingPrivacy.newPrivacyName.trim() !== '') {
            var newPrivacyData = {
                addNewPrivacy: {
                    privacySettings: {
                        profileVisible: true,
                        profileDataVisible: false,
                        imageVisible: false,
                        contactsVisible: false
                    },
                    privacyDescription: $scope.addingPrivacy.newPrivacyName
                }
            };

            Privacy.save(newPrivacyData, function () {
                $scope.showNewPrivacySettingInput = false;
                $scope.privacySettings.normal.push({
                    profileVisible: true,
                    profileDataVisible: false,
                    imageVisible: false,
                    contactsVisible: false,
                    type: $scope.addingPrivacy.newPrivacyName
                });
                $scope.setPrivacyType($scope.addingPrivacy.newPrivacyName);
                $scope.$broadcast('ely.send.button.success');
            });
        }
    };
}];

},{}],288:[function(require,module,exports){
'use strict';

module.exports = ['$scope', 'Profile', 'profileImage', 'moment', 'CountryCodeConverter', 'SettingLeftNavElements',
    function ($scope, Profile, profileImage, moment, CountryCodeConverter, SettingLeftNavElements) {

        var isDateValid = function (date) {
            return moment(date, 'l', moment.locale(), true).isValid();
        };

        $scope.countryCodes = CountryCodeConverter.countryCodes;
        $scope.selectedCountryCode = '';
        $scope.userDataToChange = {};
        $scope.submitFailed = false;
        $scope.submitFailedToServer = false;
        $scope.successUserDataChange = false;

        $scope.$emit(SettingLeftNavElements.event, SettingLeftNavElements.elements);

        $scope.getUserData = function () {
            $scope.userDataToChange = Profile.get({}, function () {
                $scope.userDataToChange.birthday = moment.unix($scope.userDataToChange.birthday).format('l');
                $scope.selectedCountryCode = CountryCodeConverter.getCountry($scope.userDataToChange.country);
                $scope.userDataToChange.isInit = true;
            });
        };
        $scope.getUserData();

        profileImage.addProfileImageChangedEvent($scope, function () {
            var profileData = Profile.get({}, function () {
                $scope.userDataToChange.profileImage = profileData.profileImage;
            });
        });

        $scope.submitProfileData = function () {
            $scope.submitFailed = false;

            if (!$scope.profileForm.$invalid) {
                var submittedUser = {
                    forename: $scope.userDataToChange.forename,
                    surname: $scope.userDataToChange.surname,
                    birthday: moment.utc($scope.userDataToChange.birthday, 'l', moment.locale(), true).valueOf() / 1000,
                    street: $scope.userDataToChange.street,
                    place: $scope.userDataToChange.place,
                    country: CountryCodeConverter.getCountryCode($scope.selectedCountryCode),
                    female: $scope.userDataToChange.female
                };
                if (submittedUser.country) {
                    Profile.save(submittedUser, function () {
                        $scope.profileForm.$setPristine();
                        $scope.successUserDataChange = true;
                        $scope.submitFailedToServer = false;
                        $scope.$broadcast('ely.send.button.success');
                    }, function () {
                        $scope.$broadcast('ely.send.button.error', 'Fehler auf dem Server. Die Werte konnten nicht gespeichert werden');
                        $scope.submitFailedToServer = true;
                        $scope.successUserDataChange = false;
                    });
                } else {
                    $scope.submitFailed = true;
                    $scope.$broadcast('ely.send.button.error', 'Bitte ein Land ausw\u00e4hlen');
                }
            } else {
                $scope.$broadcast('ely.send.button.error', 'Bitte f\u00fclle alle Felder korrekt aus');
                $scope.submitFailed = true;
            }
        };

        $scope.getDateExample = function () {
            var unixTimestamp = 385974036;
            return moment.unix(unixTimestamp).format('l');
        };

        $scope.$watch('selectedCountryCode', function (newCountryCode) {
            if (newCountryCode) {
                $scope.userDataToChange.country = CountryCodeConverter.getCountryCode(newCountryCode);
            }
        });

        $scope.$watch('userDataToChange.birthday', function (newBirthday) {
            if (newBirthday && $scope.profileForm && $scope.profileForm.inputBirthday) {
                $scope.profileForm.inputBirthday.$setValidity('custom', isDateValid(newBirthday));
            }
        });
    }];

},{}],289:[function(require,module,exports){
'use strict';

module.exports = ['$scope', 'Privacy', function ($scope, Privacy) {

    $scope.renameType = $scope.privacy.type;
    $scope.renameExists = true;

    $scope.renamePrivacySetting = function () {
        var renamePrivacySettings = {
            renamePrivacy: {
                privacyDescription: $scope.privacy.type,
                newPrivacyDescription: $scope.renameType
            }
        };

        Privacy.save(renamePrivacySettings, function () {
            if ($scope.selectedType.type === $scope.privacy.type) {
                $scope.selectedType.type = $scope.renameType;
            }
            angular.forEach($scope.privacySettings.normal, function (privacySetting) {
                if (privacySetting.type === $scope.privacy.type) {
                    privacySetting.type = $scope.renameType;
                }
            });
            $scope.privacy.type = $scope.renameType;
            $scope.$hide();
        }, function () {

        });
    };

    $scope.$watch('renameType', function (newRenameType) {
        if (newRenameType) {
            $scope.renameExists = false;
            angular.forEach($scope.privacySettings.normal, function (privacySetting) {
                if (privacySetting.type === newRenameType) {
                    $scope.renameExists = true;
                }
            });
        }
    });
}];

},{}],290:[function(require,module,exports){
'use strict';

module.exports = ['Privacy', '$q', '$mdDialog', 'ContactStatisticTypes',
    function (Privacy, $q, $mdDialog, ContactStatisticTypes) {

        this.addGroup = function () {

            return $mdDialog.show({
                templateUrl: 'app/modules/settings/modal/addGroup/template.html',
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                escapeToClose: false,
                controller: 'AddGroupController',
                bindToController: true,
                controllerAs: 'ctrl'
            });
        };

        this.deleteGroup = function (groupName, numberOfContacts) {
            var types = ContactStatisticTypes.getTypes();
            if (types.length > 0) {
                if (numberOfContacts === 0) {
                    return Privacy.delete({
                        privacyDescription: groupName,
                        newPrivacyDescription: types[0]
                    }).$promise.then(function () {
                        ContactStatisticTypes.removeType(groupName);
                    });
                } else {
                    return $mdDialog.show({
                        templateUrl: 'app/modules/settings/modal/deleteGroup/template.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose: false,
                        escapeToClose: false,
                        controller: 'DeleteGroupController',
                        locals: {groupName: groupName},
                        bindToController: true,
                        controllerAs: 'ctrl'
                    }).then(function (newGroupName) {
                        ContactStatisticTypes.removeType(groupName, newGroupName);
                    });
                }
            } else {
                return $q.reject();
            }
        };

        this.modifyGroupSetting = function (groupName) {
            return $mdDialog.show({
                templateUrl: 'app/modules/settings/modal/modifyGroupSettings/template.html',
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                escapeToClose: false,
                controller: 'ModifyGroupSettingController',
                locals: {groupName: groupName},
                bindToController: true,
                controllerAs: 'ctrl'
            });
        }
    }]
;

},{}],291:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/user/password');
}];

},{}],292:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/user/settings/privacy', null, {
        'delete': {method: 'POST', headers: {'X-HTTP-Method-Override': 'DELETE'}}
    });
}];

},{}],293:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/user/settings/profile');
}];

},{}],294:[function(require,module,exports){
'use strict';

var countryCodes = [{country: 'Schweiz', code: 'CH'},
    {country: 'Deutschland', code: 'DE'},
    {country: '\u00d6sterreich', code: 'AT'},
    {country: 'Frankreich', code: 'FR'},
    {country: 'Italien', code: 'IT'}];

module.exports = function () {

    this.countryCodes = countryCodes;

    this.getCountryCode = function (country) {
        var result = false;
        angular.forEach(countryCodes, function (countryCode) {
            if (countryCode.country === country) {
                result = countryCode.code;
            }
        });
        return result;
    };

    this.getCountry = function (code) {
        var result = countryCodes[0].country;
        angular.forEach(countryCodes, function (countryCode) {
            if (countryCode.code === code) {
                result = countryCode.country;
            }
        });
        return result;
    };
};

},{}],295:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');

app.service('Languages', require('./languages'));
app.service('CountryCodeConverter', require('./countryCodeConverter'));
},{"./countryCodeConverter":294,"./languages":296}],296:[function(require,module,exports){
'use strict';

var languages = [{description: 'Deutsch', code: 'de'},
    {description: 'Englisch', code: 'en'},
    {description: 'Franz\u00f6sisch', code: 'fr'},
    {description: 'Italienisch', code: 'it'},
    {description: 'Spanisch', code: 'es'}];

module.exports = [
    function () {
        this.languages = languages;

        this.getCode = function (description) {
            var result = false;
            angular.forEach(languages, function (language) {
                if (language.description === description) {
                    result = language.code;
                }
            });
            return result;
        };

        this.getLanguage = function (code) {
            var result = languages[0].description;
            angular.forEach(languages, function (language) {
                if (language.code === code) {
                    result = language.description;
                }
            });
            return result;
        };
    }];

},{}],297:[function(require,module,exports){
'use strict';

module.exports = ['moment', function (moment) {

    this.format = function (dateValue, format) {
        var endYesterday = moment().subtract(1, 'days').endOf('day'),
            startYesterday = moment().subtract(1, 'days').startOf('day');
        dateValue = moment.unix(dateValue);

        if (dateValue.isBetween(startYesterday, endYesterday)) {
            return 'Gestern';
        }

        if (dateValue.isAfter(endYesterday)) {
            return 'Heute';
        }
        if (format) {
            return dateValue.format(format);
        }
        return dateValue.format('l');
    };

    this.formatRelativeTimes = function (dateValue) {
        return moment.unix(dateValue).fromNow();
    };

    this.formatExact = function (dateValue) {
        var endYesterday = moment().subtract(1, 'days').endOf('day');
        dateValue = moment.unix(dateValue);

        if (dateValue.isAfter(endYesterday)) {
            return dateValue.format('H:mm');
        }
        return dateValue.format('H:mm l');
    };

    this.getTime = function (dateValue) {
        return moment.unix(dateValue).format('H:mm');
    };

    return this;
}];

},{}],298:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');

app.service('dateFormatter', require('./dateFormatter'));
},{"./dateFormatter":297}],299:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');

app.service('profileImage', require('./profileImage'));
},{"./profileImage":300}],300:[function(require,module,exports){
'use strict';

module.exports = [function () {
    this.addProfileImageChangedEvent = function (scope, callback) {
        scope.$on('elyoos.profileImage.change', function () {
            callback();
        });
    };
    return this;
}];

},{}],301:[function(require,module,exports){
'use strict';

module.exports = ['$scope', 'fileUpload', 'FileReader', 'FileReaderUtil', function ($scope, fileUpload, FileReader, FileReaderUtil) {

    $scope.image = {
        imageForUploadPreview: null,
        imageForUpload: null
    };
    //$scope.imageForUploadPreview = null;
    $scope.uploadRunning = false;
    $scope.uploadFile = false;
    $scope.isLandscape = false;

    $scope.imageResultData = function (data) {
        var blob;
        if (data && data.toDataURL && angular.isFunction(data.toDataURL)) {
            delete $scope.uploadError;
            $scope.uploadRunning = true;
            blob = FileReaderUtil.dataURItoBlob(data.toDataURL("image/jpeg", 1.0));
            if ($scope.uploadFile) {
                fileUpload.uploadFileToUrl(blob, '/api/user/settings/uploadProfileImage').
                    success(function () {
                        $scope.uploadRunning = false;
                        $scope.$emit('elyoos.profileImage.change');
                        $scope.$hide();
                    }).
                    error(function () {
                        $scope.uploadRunning = false;
                    });
            } else {
                $scope.$hide();
                $scope.$emit('image.cropper.image.preview', data, blob);
            }
        } else {
            $scope.uploadError = 'File kann nicht hochgeladen werden';
        }
    };

    $scope.$watch('image.imageForUpload', function (newImage) {
        if (newImage) {
            FileReader.onloadend = function () {
                $scope.$apply(function () {
                    $scope.image.imageForUploadPreview = FileReader.result;
                });
            };
            FileReader.readAsDataURL(newImage);
        }
    });

    $scope.startUpload = function () {
        $scope.uploadFile = true;
        $scope.$broadcast('image.cropper.get.data');
    };

    $scope.getPreview = function () {
        $scope.uploadFile = false;
        $scope.$broadcast('image.cropper.get.data');
    };

    $scope.setFormat = function (ratio, isLandsacpe) {
        $scope.$broadcast('image.cropper.set.ratio', ratio);
        $scope.isLandscape = isLandsacpe;
    };

    $scope.checkOriginalSize = function (width, height) {
        if (width < 184 || height < 300) {
            $scope.$apply(function () {
                $scope.uploadError = 'Bild ist zu klein';
            });
        } else {
            $scope.$apply(function () {
                delete $scope.uploadError;
            });
        }
    };
}];

},{}],302:[function(require,module,exports){
'use strict';

module.exports = {
    directive: ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.elyFileModel),
                    modelSetter = model.assign;

                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });

                scope.$watch(attrs.elyFileModel, function (newValue) {
                    if (newValue === null) {
                        //For reset. Files can be selected again after removing
                        element.val('');
                    }
                });
            }
        };
    }],
    name: 'elyFileModel'
};

},{}],303:[function(require,module,exports){
'use strict';

module.exports = function () {
    return new FileReader();
};

},{}],304:[function(require,module,exports){
'use strict';

module.exports = function () {
    this.dataURItoBlob = function (dataURI) {
        var binary = window.atob(dataURI.split(',')[1]),
            array = [],
            i;
        for (i = 0; i < binary.length; i = i + 1) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
    };
};

},{}],305:[function(require,module,exports){
'use strict';

module.exports = ['$http', function ($http) {
    this.uploadFileToUrl = function (file, uploadUrl) {
        var fd = new FormData();
        fd.append('file', file);
        return $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
    };
    this.uploadFileAndJson = function (file, json, uploadUrl) {
        var fd = new FormData();
        if (file) {
            fd.append('file', file);
        }
        fd.append('model', angular.toJson(json));
        return $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
    };
}];

},{}],306:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');
var fileModel = require('./fileModel.js');

app.service('fileUpload', require('./fileUpload'));

app.factory('FileReader', require('./fileReader'));
app.service('FileReaderUtil', require('./fileReaderUtil'));

app.controller('FileCtrl', require('./fileCtrl'));

app.directive(fileModel.name, fileModel.directive);
},{"./fileCtrl":301,"./fileModel.js":302,"./fileReader":303,"./fileReaderUtil":304,"./fileUpload":305}],307:[function(require,module,exports){
'use strict';


module.exports = ['$scope', '$modalInstance', 'FileReader', 'FileReaderUtil',
    function ($scope, $modalInstance, FileReader, FileReaderUtil) {
        var ctrl = this;

        this.cancel = function () {
            $modalInstance.dismiss();
        };

        this.continue = function () {
            ctrl.commands.getData();
        };

        this.imageResultData = function (data) {
            var blob;
            if (data && angular.isFunction(data.toDataURL)) {
                blob = FileReaderUtil.dataURItoBlob(data.toDataURL("image/jpeg", 1.0));
                $modalInstance.close({preview: data.toDataURL("image/jpeg", 1.0), blob: blob});
            }
        };

        this.commands = {};

        $scope.image = {};
        $scope.image.imageForUpload = null;
        $scope.$watch('image.imageForUpload', function (newImage) {
            if (newImage) {
                FileReader.onloadend = function () {
                    $scope.$apply(function () {
                        ctrl.imageForUploadPreview = FileReader.result;
                        ctrl.commands.setImage(FileReader.result);
                    });
                };
                FileReader.readAsDataURL(newImage);
            }
        });
    }];

},{}],308:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');

app.controller('UtilFilePreviewPictureCtrl', require('./controller.js'));
app.service('UtilFilePreviewPicture', require('./service.js'));
},{"./controller.js":307,"./service.js":309}],309:[function(require,module,exports){
'use strict';


module.exports = ['$modal',
    function ($modal) {

        this.getPreviewPicture = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/modules/util/file/previewPicture/template.html',
                controller: 'UtilFilePreviewPictureCtrl',
                controllerAs: 'ctrl',
                bindToController: true,
                backdrop: 'static',
                windowClass: 'center-modal'
            });

            return modalInstance.result;
        }
    }];

},{}],310:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');

app.service('moment', require('./moment'));
app.service('ElyModal', require('./modal'));
app.service('SearchService', require('./searchService'));
app.service('UrlCache', require('./urlCache'));
},{"./modal":311,"./moment":312,"./searchService":315,"./urlCache":320}],311:[function(require,module,exports){
'use strict';

module.exports = ['$mdDialog', '$rootScope', function ($mdDialog, $rootScope) {

    var preventStateChange = false;

    this.show = function (controller, template, locals) {

        var modalParams = {
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            escapeToClose: false,
            bindToController: true,
            controllerAs: 'ctrl',
            controller: controller,
            templateUrl: template,
            locals: locals
        };

        preventStateChange = true;
        return $mdDialog.show(modalParams).then(function (resp) {
            preventStateChange = false;
            return resp;
        });
    };

    this.hide = function (resp) {
        preventStateChange = false;
        $mdDialog.hide(resp);
    };

    this.cancel = function() {
        preventStateChange = false;
        $mdDialog.cancel();
    };

    $rootScope.$on('$stateChangeStart',
        function (event) {
            if(preventStateChange) {
                event.preventDefault();
            }
        });
}];

},{}],312:[function(require,module,exports){
'use strict';

var moment = require('moment');

module.exports = function () {
    moment.locale('de');
    return moment;
};

},{"moment":3}],313:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');

app.service('ScrollRequest', require('./scrollRequest'));

},{"./scrollRequest":314}],314:[function(require,module,exports){
'use strict';

var scrollRequests = {};

var getParams = function (maxItems, skip, additionalParams) {
    var params = {maxItems: maxItems, skip: skip};
    if (additionalParams) {
        angular.extend(params, additionalParams);
    }
    return params;
};

module.exports = ['$q', function ($q) {

    this.reset = function (serviceName, requestService, responseHandler) {

        scrollRequests[serviceName] = {
            request: requestService,
            responseHandler: responseHandler,
            skip: 0,
            itemsPerPage: 30,
            requestPinwallElements: true,
            requestPinwallElementsRunning: false
        };
    };

    this.hasNext = function (serviceName) {
        return scrollRequests[serviceName].requestPinwallElements;
    };

    this.nextRequest = function (serviceName, previousPinwall, additionalParams) {
        var deferred = $q.defer(), newPinwall, scrollRequest = scrollRequests[serviceName];
        if (scrollRequest.requestPinwallElements && !scrollRequest.requestPinwallElementsRunning) {
            if (!previousPinwall) {
                previousPinwall = [];
            }
            scrollRequest.requestPinwallElementsRunning = true;
            newPinwall = scrollRequest.request(getParams(scrollRequest.itemsPerPage, scrollRequest.skip, additionalParams), function () {

                scrollRequest.responseHandler.handlingResponse(newPinwall, previousPinwall);
                scrollRequest.requestPinwallElements = scrollRequest.responseHandler.checkRequestPinwall(newPinwall, scrollRequest.skip);
                scrollRequest.requestPinwallElementsRunning = false;
                deferred.resolve(newPinwall);
            }, function () {
                scrollRequest.requestPinwallElementsRunning = false;
                deferred.reject();
            });
            scrollRequest.skip += scrollRequest.itemsPerPage;
        } else {
            deferred.reject();
        }
        return deferred.promise;
    };

    this.removedElement = function (serviceName) {
        if (scrollRequests[serviceName].skip > 0) {
            scrollRequests[serviceName].skip = scrollRequests[serviceName].skip - 1;
        }
    };

    this.addedElement = function (serviceName) {
        scrollRequests[serviceName].skip = scrollRequests[serviceName].skip + 1;
    };
}];

},{}],315:[function(require,module,exports){
'use strict';

module.exports = [function () {

    var observable, serviceSuggestion, serviceSearch;

    this.register = function (newObservable, newServiceSuggestion, newServiceSearch) {
        observable = newObservable;
        serviceSuggestion = newServiceSuggestion;
        serviceSearch = newServiceSearch;
    };

    this.querySuggestion = function (text) {
        if (text && text.trim().length > 0) {
            return serviceSuggestion({
                search: text,
                maxItems: 7,
                isSuggestion: true
            }).$promise;
        }
    };

    this.startSearchRequest = function (query) {
        if (query && query.trim().length > 0) {
            observable.requestStarted();
            serviceSearch({
                search: query,
                maxItems: 40,
                isSuggestion: false
            }, function (resp) {
                observable.requestFinished(resp);
            }, function () {
                observable.requestFinished();
            });
        }
    };

    this.abortSearch = function () {
        observable.abortSearch();
    };
}];

},{}],316:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');

app.service('loginStateHandler', require('./loginStateHandler'));
},{"./loginStateHandler":317}],317:[function(require,module,exports){
'use strict';

module.exports = [function () {

    var observables = [];

    this.register = function (observable) {
        observables.push(observable);
    };

    this.loginEvent = function () {
      angular.forEach(observables, function (observable) {
          observable.loginEvent();
      });
    };

    this.logoutEvent = function () {
        angular.forEach(observables, function (observable) {
            observable.logoutEvent();
        });
    };

    return this;
}];

},{}],318:[function(require,module,exports){
'use strict';

module.exports = ['$mdToast', function ($mdToast) {

    this.showError = function (errorMessage) {
        var toast = $mdToast.simple()
            .content(errorMessage)
            .theme("error-toast")
            .hideDelay(0)
            .action('OK')
            .highlightAction(false)
            .position('bottom left');
        $mdToast.show(toast);
    };
}];

},{}],319:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');

app.service('errorToast', require('./errorToast'));
},{"./errorToast":318}],320:[function(require,module,exports){
'use strict';

module.exports = ['$log', function ($log) {

    var cache = {};

    this.reset = function () {
        cache = {};
    };

    this.cacheUrl = function (url) {
        var index, key;
        if (angular.isString(url)) {
            index = url.indexOf(".jpg?");
            if (index !== -1) {
                key = url.substring(0, index);
                if (cache[key]) {
                    return cache[key];
                } else {
                    cache[key] = url;
                    return url;
                }
            }
            $log.warn("Nor jpg found for url " + url);
            return url;
        }
        return url;
    };
}];

},{}],321:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');

app.factory('UserInfoRequest', require('./services/userInfoRequest'));
app.factory('Modification', require('./services/modification'));

app.service('userInfo', require('./userInfo'));

},{"./services/modification":322,"./services/userInfoRequest":323,"./userInfo":324}],322:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/modification');
}];

},{}],323:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/user/userInfo');
}];

},{}],324:[function(require,module,exports){
'use strict';

var notifyObervables = function (observables, functionName, functionParam) {
    angular.forEach(observables, function (observable) {
        if (observable.observable.hasOwnProperty(functionName)) {
            observable.observable[functionName](functionParam);
        }
    });
};

module.exports = ['UserInfoRequest', '$interval', 'Modification',
    function (UserInfoRequest, $interval, Modification) {

        var isLoggedIn = false, userInfo, modificationInfo, observables = [];

        this.register = function (name, observable) {
            observables.push({name: name, observable: observable});
        };

        this.loginEvent = function () {
            isLoggedIn = true;
            if (!userInfo) {
                userInfo = UserInfoRequest.get(null, function () {
                    notifyObervables(observables, "userInfoChanged", userInfo);
                    if (isLoggedIn) {
                        modificationInfo = $interval(function () {
                            var modification = Modification.get(null, function () {
                                if (modification.hasChanged) {
                                    notifyObervables(observables, "modificationChanged", modification);
                                }
                            });
                        }, 30000);
                    }
                });
            }
        };

        this.logoutEvent = function () {
            isLoggedIn = false;
            userInfo = undefined;
            notifyObervables(observables, "userInfoChanged");
            $interval.cancel(modificationInfo);
        };

        this.getUserInfo = function () {
            return userInfo;
        };

        return this;
    }];

},{}],325:[function(require,module,exports){
'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$mdMedia', 'loginStateHandler', function ($mdMedia, loginStateHandler) {
            var ctrl = this;

            loginStateHandler.register(ctrl);

            ctrl.loginStyle = {left: 0};
            ctrl.showLeftNav = false;
            ctrl.$mdMedia = $mdMedia;

            ctrl.loginEvent = function () {
                ctrl.loginStyle = {};
                ctrl.showLeftNav = true;
            };

            ctrl.logoutEvent = function () {
                ctrl.loginStyle = {left: 0};
                ctrl.showLeftNav = false;
            };
        }];
    }
};


},{}],326:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [ function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
            },
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            bindToController: true,
            templateUrl: 'app/modules/viewPort/template.html'
        };
    }],
    name: 'elyViewPort'
};

},{"./controller.js":325}],327:[function(require,module,exports){
arguments[4][99][0].apply(exports,arguments)
},{"./directive.js":326,"dup":99}],328:[function(require,module,exports){
module.exports={
  "name": "elyoos-client-test",
  "version": "1.0.0",
  "description": "elyoos",
  "repository": "",
  "dependencies": {
  },
  "devDependencies": {
    "browserify": "12.0.1",
    "phantomjs": "~1.9.19",
    "chai": "3.4.1",
    "mocha": "~2.3.4",
    "karma": "~0.13.15",
    "sinon": "1.17.2",
    "karma-browserify": "4.4.2",
    "karma-chrome-launcher": "^0.2.2",
    "karma-phantomjs-launcher": "^0.1.4",
    "karma-firefox-launcher": "^0.1.4",
    "karma-mocha": "~0.2.1",
    "karma-chai": "~0.1.0",
    "karma-sinon": "~1.0.4",
    "karma-junit-reporter": "~0.3.8",
    "karma-coverage": "0.2.6",
    "karma-ng-html2js-preprocessor": "~0.2.0",
    "browserify-istanbul": "0.2.1",
    "protractor": "~3.0.0",
    "selenium": "~2.20.0",
    "chromedriver": "~2.20.0",
    "underscore": "~1.8.3",
    "matchdep": "~1.0.0",
    "grunt": "~0.4.5",
    "grunt-browserify": "~4.0.1",
    "grunt-contrib-uglify": "~0.11.0",
    "grunt-karma": "~0.12.1",
    "grunt-sonar-runner": "~2.4.4",
    "grunt-angular-templates": "~0.5.9",
    "grunt-contrib-cssmin": "~0.10.0",
    "grunt-contrib-clean": "~0.6.0"
  },
  "browser": {
    "angular-ui-route": "./app/lib/angular/angular-ui-router.min.js",
    "moment": "./app/lib/moment/moment.js",
    "templates": "./app/dist/templates.js"
  }
}

},{}]},{},[4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,50,51,52,53,47,48,49,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,76,77,78,69,70,71,72,73,74,75,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,117,118,119,120,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,216,217,218,213,214,215,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255,256,257,258,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,275,276,277,278,279,280,281,282,283,284,285,286,287,288,289,290,291,292,293,294,295,296,297,298,299,300,301,302,303,304,305,306,307,308,309,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325,326,327]);
