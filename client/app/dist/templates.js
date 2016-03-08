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


  $templateCache.put('app/modules/home/template.html',
    "<md-content id=ely-home><div class=pinwall-container ely-infinite-scroll=ctrl.nextPinwallInfo()><ely-pinwall pinwall=ctrl.home.pinwall gap=true></ely-pinwall></div><md-card class=pinwall-no-element ng-if=ctrl.noPinwall><md-content><div class=no-pinwall-title>Deine Pinwall ist noch leer. Gründe dafür könnten sein:</div><ul><li class=action>Du hast noch keine <span class=link ui-sref=contact.overview>Kontakte</span></li><li class=action>Du hast noch keinen <span ng-click=ctrl.createBlog() class=link>Blog</span> geschrieben</li></ul></md-content></md-card><md-button class=\"md-fab create-blog-fab\" aria-label=\"Create blog\" ng-click=ctrl.createBlog()><md-icon md-svg-icon=navFAB:add></md-icon></md-button></md-content>"
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
    "<div><div class=sidnav-header layout=column><div layout=row><img ng-src={{ctrl.userInfo.profileImagePreview}} class=user-preview flex=\"none\"><div class=header-commands layout=row layout-align=\"end none\" flex=grow><md-icon md-svg-icon=sidenavHeader:edit class=icon-header ng-click=ctrl.goToProfile()></md-icon></div></div><div class=user-info><div class=user-name>{{ctrl.userInfo.name}}</div><div class=user-email>{{ctrl.userInfo.email}}</div></div></div><md-divider class=ely-divider></md-divider><md-content class=left-nav-content><ely-left-nav-element state=home base-state=home icon=nav:home description=Home></ely-left-nav-element><ely-left-nav-element state=contact.overview base-state=contact icon=nav:contact description=Kontakte></ely-left-nav-element><ely-left-nav-element state=message.threads base-state=message icon=nav:thread description=Nachrichten></ely-left-nav-element><ely-left-nav-element state=problem.home base-state=problem icon=nav:problem description=Problemstellungen></ely-left-nav-element></md-content><md-divider class=ely-divider></md-divider><md-content class=left-nav-content><div class=nav-element ng-click=ctrl.logout()><md-icon md-svg-icon=nav:logout class=icon></md-icon><div class=\"description md-body-2\">Logout</div></div></md-content></div>"
  );


  $templateCache.put('app/modules/navigation/leftNav/element/template.html',
    "<div class=nav-element ng-click=ctrl.goToState() ng-class=\"{'highlighted': ctrl.$state.includes(ctrl.baseState)}\"><md-icon md-svg-icon={{ctrl.icon}} class=icon ng-style=ctrl.highlightedStyle></md-icon><div class=\"description md-body-2\">{{ctrl.description}}</div></div>"
  );


  $templateCache.put('app/modules/navigation/toolbar/messageInfo/template.html',
    "<div class=ely-message-info><md-button class=md-icon-button aria-label=\"Open Thread Overview\" ng-click=ctrl.openThreadOverview()><md-icon md-svg-icon=system:chat></md-icon></md-button><div class=number layout=row layout-align=\"center center\" ng-if=\"ctrl.count > 0\" ng-click=ctrl.openThreadOverview()><div>{{ctrl.count}}</div></div></div>"
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


  $templateCache.put('app/modules/pinwall/pinwallElement/blog/detail/detail.html',
    "<md-dialog id=blog-detail aria-label=\"Detail Blog\" ng-cloak><div id=blog-header layout=row flex=none><img ng-src={{ctrl.element.profileUrl}} class=user-avatar flex=none ng-click=ctrl.openUserDetail()><div class=title-container flex ng-click=ctrl.openUserDetail()><div class=\"title md-title\">{{ctrl.element.name}}</div><div class=\"subtitle md-subhead\">{{ctrl.getFormattedDate(ctrl.element.created, 'LLL')}}</div></div><md-button class=\"md-icon-button md-primary\" aria-label=\"Close Detail\" ng-click=ctrl.cancel()><md-icon md-svg-icon=nav:close class=icon></md-icon></md-button></div><md-dialog-content><img ng-src={{ctrl.element.urlFull}} class=detail-image ng-show=ctrl.element.urlFull><div class=blog-text>{{ctrl.element.text}}</div></md-dialog-content></md-dialog>"
  );


  $templateCache.put('app/modules/pinwall/pinwallElement/blog/template.html',
    "<md-card class=pinwall-blog-card><md-card-header><md-card-avatar ng-click=ctrl.openUserDetail()><img class=md-user-avatar ng-src=\"{{ctrl.element.profileUrl}}\"></md-card-avatar><md-card-header-text ng-click=ctrl.openUserDetail()><span class=\"md-title user-name\">{{ctrl.element.name}}</span> <span class=md-subhead>{{ctrl.getFormattedDate(ctrl.element.created, 'LLL')}}</span></md-card-header-text></md-card-header><div class=blog-image-container ng-if=ctrl.element.url ng-click=ctrl.openDetail()><img ng-src={{ctrl.element.url}} class=md-card-image></div><md-card-content><div class=\"md-body-1 blog-text\" ng-click=ctrl.openDetail()>{{ctrl.previewText}}</div></md-card-content><md-card-actions layout=row lauout-align=\"end center\" ng-if=ctrl.element.isAdmin><md-button ng-click=ctrl.deleteBlog() ng-disabled=ctrl.requestBlogDeleteRunning>Löschen</md-button></md-card-actions><md-divider></md-divider><md-progress-linear ng-if=ctrl.requestBlogDeleteRunning md-mode=indeterminate></md-progress-linear></md-card>"
  );


  $templateCache.put('app/modules/pinwall/pinwallElement/recommendation/book/template.html',
    "<div layout=row class=book-recommendation><img flex=none class=preview-img ng-src={{ctrl.element.url}}><div class=content-container flex><div class=title>{{ctrl.element.title}}</div><div class=recommended>Bewertet {{ctrl.getFormattedDate(ctrl.element.created, 'LLL')}} von</div><div layout=row><img class=user-avatar ng-src={{ctrl.element.profileUrl}} felx=\"none\"><div flex><div class=user-name>{{ctrl.element.name}}</div><ely-star-rating class=page-rating is-readonly=true is-x-small=true number-of-selected-stars-readonly=ctrl.element.rating></ely-star-rating></div></div><div class=actions></div></div></div>"
  );


  $templateCache.put('app/modules/pinwall/pinwallElement/recommendation/template.html',
    "<md-card class=pinwall-recommendation-card><ely-pinwall-recommendation-book element=ctrl.element ng-if=\"ctrl.element.label === 'Book'\"></ely-pinwall-recommendation-book><ely-pinwall-recommendation-youtube element=ctrl.element ng-if=\"ctrl.element.label === 'Youtube'\"></ely-pinwall-recommendation-youtube></md-card>"
  );


  $templateCache.put('app/modules/pinwall/pinwallElement/recommendation/youtube/template.html',
    "<div class=youtube-recommendation><md-card-header><md-card-avatar><img class=md-user-avatar ng-src=\"{{ctrl.element.profileUrl}}\"></md-card-avatar><md-card-header-text><span class=\"md-title user-name\">{{ctrl.element.name}}</span> <span class=md-subhead>Bewertet {{ctrl.getFormattedDate(ctrl.element.created, 'LLL')}}</span></md-card-header-text></md-card-header><div class=content-container><div layout=column><ely-iframe flex=100 height=230 secure-link=\"https://www.youtube.com/embed/\" src=ctrl.element.link></ely-iframe><div class=description flex><div class=page-title>{{ctrl.element.title}}</div><ely-star-rating class=page-rating is-readonly=true is-x-small=true number-of-selected-stars-readonly=ctrl.element.rating></ely-star-rating></div></div></div></div>"
  );


  $templateCache.put('app/modules/pinwall/pinwallElement/template.html',
    "<div><ely-pinwall-blog element=ctrl.element on-blog-removed=ctrl.onBlogRemoved ng-if=\"ctrl.element.pinwallType === 'Blog'\"></ely-pinwall-blog><ely-pinwall-recommendation element=ctrl.element ng-if=\"ctrl.element.pinwallType === 'Recommendation'\"></ely-pinwall-recommendation></div>"
  );


  $templateCache.put('app/modules/pinwall/template.html',
    "<div class=md-padding layout-wrap layout=row><div flex=100 ng-repeat=\"pinwallElement in ctrl.pinwall\"><ely-pinwall-element on-blog-removed=ctrl.blogRemoved element=pinwallElement></ely-pinwall-element></div><div class=pinwall-gab ng-if=\"ctrl.gap && ctrl.pinwall.length > 0\"></div></div>"
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


  $templateCache.put('app/modules/settings/modal/addGroup/template.html',
    "<md-dialog id=add-group aria-label=\"Add Group\" ng-cloak><form name=ctrl.createGroupForm><md-dialog-content class=\"md-dialog-content ely-dialog-content\"><div class=\"md-title title\">Neue Gruppe erstellen</div><md-input-container class=ely-input-container><label>Name</label><input name=groupName class=blog-input ng-model=ctrl.groupName required md-maxlength=30 ng-disabled=ctrl.uploadStarted ng-change=\"ctrl.nameChanged()\"><div ng-messages=ctrl.createGroupForm.groupName.$error ng-show=ctrl.createGroupForm.groupName.$dirty><div ng-message=required>Wird benötigt!</div><div ng-message=md-maxlength>Text ist zu lang</div><div ng-message=ely-types-exist>Diese Gruppe existiert bereits</div></div></md-input-container><md-checkbox ng-model=ctrl.profileVisible aria-label=\"Profile visible\" class=select-privacy ng-disabled=ctrl.uploadStarted>Mein Profil ist sichtbar</md-checkbox><md-checkbox ng-model=ctrl.contactsVisible ng-disabled=\"!ctrl.profileVisible || ctrl.uploadStarted\" aria-label=\"Contacts visible\" class=select-privacy>Meine Kontakte sind sichtbar</md-checkbox><md-checkbox ng-model=ctrl.imageVisible ng-disabled=\"!ctrl.profileVisible || ctrl.uploadStarted\" aria-label=\"Image visible\" class=select-privacy>Mein Profilbild ist sichtbar</md-checkbox><md-checkbox ng-model=ctrl.profileDataVisible ng-disabled=\"!ctrl.profileVisible || ctrl.uploadStarted\" aria-label=\"Profile Data visible\" class=select-privacy>Meine Profildaten sind sichtbar</md-checkbox></md-dialog-content><md-dialog-actions><md-button ng-click=ctrl.cancel()>Abbrechen</md-button><md-button class=md-primary ng-click=ctrl.accept() ng-disabled=\"!ctrl.validGroupName || ctrl.createGroupForm.groupName.$invalid || ctrl.uploadStarted\">Hinzufügen</md-button></md-dialog-actions></form><md-progress-linear ng-if=ctrl.uploadStarted md-mode=indeterminate></md-progress-linear></md-dialog>"
  );


  $templateCache.put('app/modules/settings/modal/changePassword/template.html',
    "<md-dialog id=change-password aria-label=\"Change Password\" ng-cloak><form name=ctrl.changePasswordForm><md-dialog-content class=\"md-dialog-content ely-dialog-content\"><div class=\"md-title title\">Passwort ändern</div><md-input-container class=ely-input-container><label>Altes Passwort</label><input name=oldPassword class=blog-input ng-model=ctrl.oldPassword required type=password ng-disabled=\"ctrl.running\"><div ng-messages=ctrl.changePasswordForm.oldPassword.$error ng-show=ctrl.changePasswordForm.oldPassword.$dirty><div ng-message=required>Wird benötigt!</div></div></md-input-container><md-input-container class=ely-input-container><label>Neues Passwort</label><input name=newPassword class=blog-input ng-model=ctrl.newPassword required type=password ng-disabled=ctrl.running ng-change=\"ctrl.newPasswordChanged()\"><div ng-messages=ctrl.changePasswordForm.newPassword.$error ng-show=ctrl.changePasswordForm.newPassword.$dirty><div ng-message=required>Wird benötigt!</div><div ng-message=ely-min-length>Das Passwort muss mindestens 8 Zeichen lang sein</div><div ng-message=ely-char-missing>Das Passwort muss mindestens ein Grossbuchstaben und eine Zahl enthalten</div></div></md-input-container><md-input-container class=ely-input-container><label>Neues Passwort bestätigen</label><input name=confirmNewPassword class=blog-input ng-model=ctrl.confirmNewPassword required type=password ng-disabled=ctrl.running ng-change=\"ctrl.confirmNewPasswordChanged()\"><div ng-messages=ctrl.changePasswordForm.confirmNewPassword.$error ng-show=ctrl.changePasswordForm.confirmNewPassword.$dirty><div ng-message=required>Wird benötigt!</div><div ng-message=ely-compare>Die Passwörter stimmen nicht überein</div></div></md-input-container></md-dialog-content><md-dialog-actions><md-button ng-click=ctrl.cancel()>Abbrechen</md-button><md-button class=md-primary ng-click=ctrl.changePassword() ng-disabled=\"ctrl.running || !ctrl.uploadValid || ctrl.changePasswordForm.$invalid\">Ändern</md-button></md-dialog-actions></form><md-progress-linear ng-if=ctrl.running md-mode=indeterminate></md-progress-linear></md-dialog>"
  );


  $templateCache.put('app/modules/settings/modal/changeProfileData/template.html',
    "<md-dialog id=change-profile-data aria-label=\"Change Profile Data\" ng-cloak><form name=ctrl.changeProfileForm><md-dialog-content class=\"md-dialog-content ely-dialog-content\"><div class=\"md-title title\">Profile änderen</div><md-input-container class=ely-input-container><label>Vorname</label><input name=forename ng-model=ctrl.userDataToChange.forename required ng-disabled=ctrl.running ng-change=\"ctrl.change()\"><div ng-messages=ctrl.changeProfileForm.forename.$error ng-show=ctrl.changeProfileForm.forename.$dirty><div ng-message=required>Wird benötigt!</div></div></md-input-container><md-input-container class=ely-input-container><label>Nachname</label><input name=surname ng-model=ctrl.userDataToChange.surname required ng-disabled=ctrl.running ng-change=\"ctrl.change()\"><div ng-messages=ctrl.changeProfileForm.surname.$error ng-show=ctrl.changeProfileForm.surname.$dirty><div ng-message=required>Wird benötigt!</div></div></md-input-container><md-input-container class=ely-input-container><label>Geburtstag</label><input name=birthday ng-model=ctrl.userDataToChange.birthday required ng-disabled=ctrl.running ng-change=\"ctrl.change()\"><div ng-messages=ctrl.changeProfileForm.birthday.$error ng-show=ctrl.changeProfileForm.birthday.$dirty><div ng-message=required>Wird benötigt!</div><div ng-message=birthday-format>Ungültiges Datum (z.B {{ctrl.getDateExample()}})</div></div></md-input-container><md-input-container class=ely-input-container><label>Strasse (optional)</label><input name=street ng-model=ctrl.userDataToChange.street ng-disabled=ctrl.running ng-change=\"ctrl.change()\"></md-input-container><md-input-container class=ely-input-container><label>Ort (optional)</label><input name=place ng-model=ctrl.userDataToChange.place ng-disabled=ctrl.running ng-change=\"ctrl.change()\"></md-input-container><md-input-container class=ely-input-container><label>Land</label><md-select ng-model=ctrl.userDataToChange.selectedCountryCode ng-model-options=\"{trackBy: '$value.code'}\" ng-change=ctrl.change()><md-option ng-repeat=\"countryCode in ctrl.countryCodes\" ng-value=countryCode>{{countryCode.country}}</md-option></md-select></md-input-container><md-radio-group ng-model=ctrl.userDataToChange.female layout=row class=select-gender ng-change=ctrl.change()><md-radio-button value=false>Mann</md-radio-button><md-radio-button value=true>Frau</md-radio-button></md-radio-group></md-dialog-content><md-dialog-actions><md-button ng-click=ctrl.cancel()>Abbrechen</md-button><md-button class=md-primary ng-click=ctrl.upload() ng-disabled=\"ctrl.running || !ctrl.uploadValid || ctrl.changeProfileForm.$invalid\">Ändern</md-button></md-dialog-actions></form><md-progress-linear ng-if=ctrl.running md-mode=indeterminate></md-progress-linear></md-dialog>"
  );


  $templateCache.put('app/modules/settings/modal/deleteGroup/template.html',
    "<md-dialog id=delete-group aria-label=\"Delete Group\" ng-cloak><form name=ctrl.deleteGroupForm><md-dialog-content class=\"md-dialog-content ely-dialog-content\"><div class=\"md-title title\">Gruppe <span class=name>{{ctrl.groupName}}</span> löschen</div><div class=\"md-body-1 description\">Kontakte werden in folgende Gruppe verschoben:</div><md-radio-group ng-model=ctrl.selectedGroup><md-radio-button ng-repeat=\"group in ctrl.groups\" value={{group}} aria-label={{group}} ng-disable=ctrl.uploadStarted>{{group}}</md-radio-button></md-radio-group></md-dialog-content><md-dialog-actions><md-button ng-click=ctrl.cancel()>Abbrechen</md-button><md-button class=md-primary ng-click=ctrl.accept() ng-disabled=\" ctrl.uploadStarted\">Löschen</md-button></md-dialog-actions></form><md-progress-linear ng-if=ctrl.uploadStarted md-mode=indeterminate></md-progress-linear></md-dialog>"
  );


  $templateCache.put('app/modules/settings/modal/modifyGroupSettings/directive/template.html',
    "<div id=modify-group-setting ng-cloak><form name=ctrl.modifyGroupForm><md-dialog-content class=\"md-dialog-content ely-dialog-content\"><div class=\"md-title title\" ng-if=ctrl.setting.type>Gruppe <span class=group>{{ctrl.setting.type}}</span> bearbeiten</div><div class=\"md-title title\" ng-if=!ctrl.setting.type>Privatspähren Einstellung für Personen die kein Kontakt sind</div><md-checkbox ng-model=ctrl.setting.profileVisible aria-label=\"Profile visible\" class=select-privacy ng-change=ctrl.selectChanged() ng-disabled=ctrl.uploadStarted>Mein Profil ist sichtbar</md-checkbox><md-checkbox ng-model=ctrl.setting.contactsVisible ng-disabled=\"!ctrl.setting.profileVisible || ctrl.uploadStarted\" ng-change=ctrl.selectChanged() aria-label=\"Contacts visible\" class=select-privacy>Meine Kontakte sind sichtbar</md-checkbox><md-checkbox ng-model=ctrl.setting.imageVisible ng-disabled=\"!ctrl.setting.profileVisible || ctrl.uploadStarted\" ng-change=ctrl.selectChanged() aria-label=\"Image visible\" class=select-privacy>Mein Profilbild ist sichtbar</md-checkbox><md-checkbox ng-model=ctrl.setting.profileDataVisible ng-disabled=\"!ctrl.setting.profileVisible || ctrl.uploadStarted\" ng-change=ctrl.selectChanged() aria-label=\"Profile Data visible\" class=select-privacy>Meine Profildaten sind sichtbar</md-checkbox></md-dialog-content><md-dialog-actions><md-button ng-click=ctrl.cancel()>Abbrechen</md-button><md-button class=md-primary ng-click=ctrl.accept() ng-disabled=\"ctrl.uploadStarted || !ctrl.uploadAllowed\">Ändern</md-button></md-dialog-actions></form><md-progress-linear ng-if=ctrl.uploadStarted md-mode=indeterminate></md-progress-linear></div>"
  );


  $templateCache.put('app/modules/settings/modal/modifyGroupSettings/template.html',
    "<md-dialog id=modify-group-setting-dialog aria-label=\"Modify Group Setting\"><ely-modify-privacy-group ng-if=ctrl.setting setting=ctrl.setting abort=ctrl.cancel finish=ctrl.accept></ely-modify-privacy-group></md-dialog>"
  );


  $templateCache.put('app/modules/settings/modal/overviewGroupSettings/group/template.html',
    "<div class=privacy-container><div class=title-container layout=row><div class=\"md-title title\">{{ctrl.title}}</div><div flex=none class=change-button><md-button class=\"md-icon-button md-primary\" ng-click=ctrl.openEdit(ctrl.group)><md-icon md-svg-icon=cardActions:edit></md-icon></md-button></div></div><ul ng-if=!ctrl.group.profileVisible><li class=description>Sehen nur Deinen Namen</li></ul><ul ng-if=\"ctrl.group.profileVisible && ctrl.isPublic\"><li class=description>Sehen Dein komplettes Profil</li></ul><ul ng-if=\"ctrl.group.profileVisible && !ctrl.isPublic\"><li class=description ng-if=ctrl.group.contactsVisible>Sieht Deine Kontakte</li><li class=description ng-if=ctrl.group.imageVisible>Sieht Deine Profilbild</li><li class=description ng-if=ctrl.group.profileDataVisible>Sieht Deine Profiel Daten</li></ul></div>"
  );


  $templateCache.put('app/modules/settings/modal/overviewGroupSettings/template.html',
    "<md-dialog id=overview-group-setting aria-label=\"Overview Group Setting\" ng-cloak><md-dialog-content class=\"md-dialog-content ely-dialog-content\" ng-if=!ctrl.editMode><div class=\"md-title title\">Privatsphären Übersicht</div><div class=privacy-description>Hier kannst Du bestimmen, wer was von Deinem Profil sehen kann.</div><ely-settings-privacy-group title=\"Personen die keine Kontakte sind\" group=ctrl.settings.noContact open-edit=ctrl.openEdit></ely-settings-privacy-group><ely-settings-privacy-group title=\"Personen die der Gruppe {{group.type}} angehören\" group=group open-edit=ctrl.openEdit ng-repeat=\"group in ctrl.settings.normal\"></ely-settings-privacy-group></md-dialog-content><md-dialog-actions ng-if=!ctrl.editMode><md-button ng-click=ctrl.cancel()>Schliessen</md-button></md-dialog-actions><ely-modify-privacy-group ng-if=ctrl.editMode setting=ctrl.editGroup abort=ctrl.closeEdit finish=ctrl.closeEdit></ely-modify-privacy-group></md-dialog>"
  );


  $templateCache.put('app/modules/settings/profile/image/template.html',
    "<md-card id=ely-setting-profile-image><md-card-content><div layout=column layout-align=\"none center\"><img ng-src={{ctrl.profile.profileImage}} class=profile-image><div><md-button class=md-primary ng-click=ctrl.uploadProfileImage()>Bild ändern</md-button></div></div></md-card-content></md-card>"
  );


  $templateCache.put('app/modules/settings/profile/settingsOverview/template.html',
    "<md-card id=ely-setting-overview><div class=title ng-click=\"ctrl.colapsed = !ctrl.colapsed\"><md-icon md-svg-icon=cardActions:setting class=setting-icon-left></md-icon><div class=description-container layout=row layout-align=\"center center\"><div class=description>Einstellungen</div></div><span flex></span><md-icon ng-if=ctrl.colapsed md-svg-icon=cardActions:arrowDown class=setting-icon-right></md-icon><md-icon ng-if=!ctrl.colapsed md-svg-icon=cardActions:arrowUp class=setting-icon-right></md-icon></div><div ng-if=!ctrl.colapsed class=content><div class=setting layout=row layout-align=\"center center\" ng-click=ctrl.openChangeProfileData()><div class=setting-description>Profil</div></div><div class=setting layout=row layout-align=\"center center\" ng-click=ctrl.openChangePassword()><div class=setting-description>Passwort ändern</div></div><div class=setting layout=row layout-align=\"center center\" ng-click=ctrl.openPrivacyOverview()><div class=setting-description>Privatsphäre</div></div></div></md-card>"
  );


  $templateCache.put('app/modules/settings/profile/template.html',
    "<md-content id=ely-setting-profile><div class=container layout=column layout-align=\"start center\"><ely-settings-profile-image profile=ctrl.profile></ely-settings-profile-image><ely-settings-overview></ely-settings-overview><ely-settings-user-pinwall></ely-settings-user-pinwall></div></md-content>"
  );


  $templateCache.put('app/modules/settings/profile/userPinwall/template.html',
    "<div id=setting-user-pinwall><div class=title>Deine Pinwand</div><div class=pinwall-container ely-infinite-scroll=ctrl.nextPinwallInfo()><ely-pinwall pinwall=ctrl.user.pinwall gap=false></ely-pinwall></div><md-card class=pinwall-no-element ng-if=ctrl.noPinwall><md-content><div class=no-pinwall-title>Du hast noch keinen Blog geschreiben oder eine Empfehlung gemacht.</div></md-content></md-card></div>"
  );


  $templateCache.put('app/modules/util/file/previewFile.html',
    "<div class=modal tabindex=-1 role=dialog ng-controller=FileCtrl><div class=modal-dialog id=modal-preview-file><div class=modal-content><div class=modal-body><div class=cropArea><ely-image-cropper ng-if=!uploadRunning reset=resetImage image=image.imageForUploadPreview image-result-data=imageResultData ratio=0.62745 original-size=checkOriginalSize min-width=100 min-height=160></ely-image-cropper></div><ely-spin ng-if=uploadRunning></ely-spin></div><div class=modal-footer><md-button class=\"md-primary md-raised ely-button btn-file\" ng-disabled=uploadRunning>Bild auswählen...<input type=file ely-file-model=image.imageForUpload accept=\".jpg, .png, jpeg\"></md-button><div class=upload-file-error ng-show=uploadError>{{uploadError}}</div><md-button class=\"md-primary ely-button\" ng-disabled=uploadRunning ng-click=$hide()>Abbrechen</md-button><md-button class=\"md-primary md-raised ely-button\" ng-disabled=\"!image.imageForUploadPreview || uploadRunning || uploadError\" ng-click=getPreview()>Auswählen</md-button></div></div></div></div>"
  );


  $templateCache.put('app/modules/util/file/previewPicture/template.html',
    "<div class=modal-body><div class=cropArea><ely-image-cropper commands=ctrl.commands image-result-data=ctrl.imageResultData ratio=0.62745 original-size=ctrl.checkOriginalSize min-width=100 min-height=160></ely-image-cropper></div></div><div class=modal-footer><md-button class=\"md-primary md-raised ely-button btn-file\">Bild auswählen...<input type=file ely-file-model=image.imageForUpload accept=\".jpg, .png, jpeg\"></md-button><div class=upload-file-error ng-show=ctrl.uploadError>{{ctrl.uploadError}}</div><md-button class=\"md-primary ely-button\" ng-click=ctrl.cancel()>Abbrechen</md-button><md-button class=\"md-primary md-raised ely-button\" ng-disabled=\"!ctrl.imageForUploadPreview || uploadError\" ng-click=ctrl.continue()>Auswählen</md-button></div>"
  );


  $templateCache.put('app/modules/util/file/uploadCropImage/template.html',
    "<md-dialog id=ely-upload-crop-image><div class=cropArea layout=row layout-align=\"center center\"><ely-image-cropper commands=ctrl.commands image=ctrl.imageForUploadPreview image-result-data=ctrl.startImageUpload ratio={{ctrl.ratio}} min-width=100 min-height=100 ng-if=!ctrl.unsupportedFile></ely-image-cropper><div class=unsupported-file ng-if=ctrl.unsupportedFile>Dieser File Type kann nicht hochgeladen werden</div></div><md-card-actions layout=row layout-align=\"start center\"><md-card-icon-actions><md-button class=\"action-icon md-icon-button\" aria-label=\"Add Photo\"><label for=upload-photo><md-icon md-svg-icon=createBlog:addPhoto class=icon></md-icon></label></md-button><input type=file ely-file-model=imageForUpload id=upload-photo ng-hide=true accept=\".jpg , .png , jpeg\"></md-card-icon-actions><md-button ng-click=ctrl.cancel()>Abbrechen</md-button><md-button class=md-primary ng-disabled=\"ctrl.running || !ctrl.hasImage\" ng-click=ctrl.uploadImage()>Hochladen</md-button></md-card-actions><md-progress-linear ng-if=ctrl.running md-mode=indeterminate></md-progress-linear></md-dialog>"
  );


  $templateCache.put('app/modules/util/tooltip/tooltipError.html',
    "<div class=\"tooltip in ely-tooltip-error\" ng-show=title><div class=tooltip-arrow></div><div class=tooltip-inner ng-bind=title></div></div>"
  );


  $templateCache.put('app/modules/viewPort/template.html',
    "<div class=viewport><ely-toolbar id=toolbar-header ng-if=\"!ctrl.$mdMedia('gt-md')\"></ely-toolbar><md-sidenav md-component-id=left class=\"md-sidenav-left md-whiteframe-z2\" md-is-locked-open=false ng-if=\"!ctrl.$mdMedia('gt-md')\"><ely-left-nav-container class=ely-sidnav></ely-left-nav-container></md-sidenav><div class=content ui-view=content ng-cloak ng-if=\"!ctrl.$mdMedia('gt-md')\"></div><div ng-if=\"ctrl.$mdMedia('gt-md')\" layout=row class=ely-gt-md-content><md-sidenav flex=none md-component-id=left class=\"md-sidenav-left md-whiteframe-z2 ely-sidnav-expanded\" md-is-locked-open=true ng-if=ctrl.showLeftNav><ely-left-nav-container class=ely-sidnav></ely-left-nav-container></md-sidenav><div class=ely-gt-md-content-container ng-style=ctrl.loginStyle><ely-toolbar id=toolbar-header></ely-toolbar><div class=content ui-view=content ng-cloak></div></div></div></div>"
  );

}]);
