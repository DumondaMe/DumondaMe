(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
angular.module('elyoosApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/modules/auth/login.html',
    "<div id=loginform><div class=card-element><div class=description>Login</div><form name=loginForm><md-input-container class=input-element><label>Email</label><input required type=email name=username id=id_username aria-label=Email autofocus ng-model=loginuser.email><div ng-messages=loginForm.username.$error><div ng-message=required>Dieses Feld wird ben&ouml;tigt!</div><div ng-message=email>Keine gültige E-Mail Adresse!</div></div></md-input-container><md-input-container class=input-element><label>Passwort</label><input type=password required name=password id=id_password aria-label=Passwort autofocus ng-model=loginuser.password><div ng-messages=loginForm.password.$error><div ng-message=required>Dieses Feld wird ben&ouml;tigt!</div></div></md-input-container><md-button id=login type=submit class=\"md-primary md-raised ely-button\" ng-click=login() ng-disabled=loginForm.$invalid>Anmelden</md-button></form></div><div id=error-message class=\"alert alert-danger\" role=alert ng-if=error>{{error}}</div></div>"
  );


  $templateCache.put('app/modules/auth/register.html',
    "<div id=content-settings-profile><div id=centerCol><div id=inner-centerCol><div id=manage-profile><form class=form-horizontal name=profileForm role=form novalidate><div class=form-group><label for=inputEmail class=\"col-sm-4 control-label\">E-Mail</label><div class=col-sm-8><input name=inputEmail ng-model=userDataToChange.email class=form-control id=inputEmail placeholder=Email></div></div><div class=form-group><label for=inputPassword class=\"col-sm-4 control-label\">Passwort</label><div class=col-sm-8><input name=inputEmail ng-model=userDataToChange.password class=form-control id=inputPassword></div></div><div class=form-group ng-class=\"{'has-error': profileForm.inputForename.$invalid && (visitedForename || submitFailed)}\"><label for=inputForenameId class=\"col-sm-4 control-label\">Vorname</label><div class=col-sm-8><input name=inputForename ng-model=userDataToChange.forename class=form-control id=inputForenameId ng-blur=\"visitedForename = true\" placeholder=Vorname required ng-maxlength=30><div class=\"alert-input alert-danger\" ng-show=\"profileForm.inputForename.$error.required && (visitedForename || submitFailed)\"><span>Es wird ein Vorname benötigt</span></div><div class=\"alert-input alert-danger\" ng-show=\"profileForm.inputForename.$error.maxlength && (visitedForename || submitFailed)\"><span>Der Vorname darf nicht länger als 30 Zeichen sein</span></div></div></div><div class=form-group ng-class=\"{'has-error': profileForm.inputSurename.$invalid && (visitedSurename || submitFailed)}\"><label for=inputSurename class=\"col-sm-4 control-label\">Nachname</label><div class=col-sm-8><input name=inputSurename ng-model=userDataToChange.surname class=form-control id=inputSurename ng-blur=\"visitedSurename = true\" placeholder=Nachname required ng-maxlength=50><div class=\"alert-input alert-danger\" ng-show=\"profileForm.inputSurename.$error.required && (visitedSurename || submitFailed)\"><span>Es wird ein Nachname benötigt</span></div><div class=\"alert-input alert-danger\" ng-show=\"profileForm.inputSurename.$error.maxlength && (visitedSurename || submitFailed)\"><span>Der Nachname darf nicht länger als 50 Zeichen sein</span></div></div></div><div class=form-group ng-class=\"{'has-error': profileForm.inputBirthday.$invalid && (visitedBirthday || submitFailed)}\"><label for=inputBirthday class=\"col-sm-4 control-label\">Geburtstag</label><div class=col-sm-8><input name=inputBirthday ng-model=userDataToChange.birthday class=form-control id=inputBirthday ng-blur=\"visitedBirthday = true\" placeholder=\"z.B {{getDateExample()}}\" required><div class=\"alert-input alert-danger\" ng-show=\"profileForm.inputBirthday.$error.required && (visitedBirthday || submitFailed)\"><span>Bitte gib deinen Geburtstag an</span></div><div class=\"alert-input alert-danger\" ng-show=\"profileForm.inputBirthday.$error.date && (visitedBirthday || submitFailed)\"><span>Gib einen gültigen Geburtstag ein (z.B. {{getDateExample()}})</span></div></div></div><div class=form-group ng-class=\"{'has-error': profileForm.inputCountry.$invalid && (visitedCountry || submitFailed)}\"><label for=inputCountryId class=\"col-sm-4 control-label\">Land</label><div class=col-sm-8><button type=button class=\"btn btn-default\" ng-model=selectedCountryCode name=inputCountry id=inputCountryId bs-options=\"countryCode.country as countryCode.country for countryCode in countryCodes\" data-placeholder=Land bs-select>Action <span class=caret></span></button></div></div><div class=form-group><label for=inputGender class=\"col-sm-4 control-label\">Geschlecht</label><div class=col-sm-8><div class=btn-group id=inputGender><label class=\"btn btn-default\" ng-click=\"userDataToChange.female = true; profileForm.$setDirty()\" ng-class=\"{'active': userDataToChange.female == true}\">Frau</label><label class=\"btn btn-default\" ng-click=\"userDataToChange.female = false; profileForm.$setDirty()\" ng-class=\"{'active': userDataToChange.female == false}\">Mann</label></div></div></div><div class=form-group><div class=\"col-sm-offset-4 col-sm-8\"><div><button id=submit-change-profile type=submit class=\"btn btn-default\" ng-click=submitProfileData()>Profil erstellen</button></div><div class=\"alert-input alert-danger\" ng-show=\"profileForm.$invalid && submitFailed\"><span>Bitte fülle alle Werte korrekt aus</span></div><div class=\"alert-input alert-danger\" ng-show=\"profileForm.$invalid == false && submitFailedToServer\"><span>Fehler auf dem Server. Die Werte konnten nicht gespeichert werden</span></div><div class=\"alert-input alert-success\" ng-show=\"successUserDataChange && profileForm.$pristine\"><span>Profil erfolgreich erstellt</span></div></div></div></form></div></div></div></div>"
  );


  $templateCache.put('app/modules/contact/contactPreview/template.html',
    "<div class=contact-preview><img ng-src={{cacheUrl(contact.profileUrl)}} ng-click=openUserDetails()><div class=contact-preview-content><div class=contact-preview-name-container><div ng-click=openUserDetails() class=contact-preview-name>{{contact.name}}</div><div class=description-container><div class=description ng-click=openModalUpdateType($scope) ng-show=\"!contact.blocked && contact.type\">({{contact.type}})</div></div><div class=blocked-description ng-show=contact.blocked>BLOCKIERT</div></div><div class=command-icons><button type=button class=\"btn btn-default btn-xs dropdown-toggle left\" data-toggle=dropdown aria-expanded=false bs-dropdown=contact.actions ng-show=\"!contact.blocked && contact.type\">Aktionen <span class=caret></span></button> <button type=button class=\"btn btn-default btn-xs left\" aria-expanded=false ng-show=\"!contact.blocked && !contact.type\" ng-click=openModalAddNewContact($scope)><span class=\"glyphicon glyphicon-plus\" aria-hidden=true></span> Als Kontakt hinzufügen</button> <button type=button class=\"btn btn-default btn-xs left\" aria-expanded=false ng-show=contact.blocked ng-click=unblockContact($scope)>Blockierung aufheben</button><div class=command-connection-state ng-hide=\"contact.connected === 'none'\" data-trigger=hover data-delay=600 data-title={{tooltipConnectionState.title}} bs-tooltip><img ng-src={{contact.connectionImage}}></div></div></div></div>"
  );


  $templateCache.put('app/modules/contact/contacting.html',
    "<div id=content-page-contacting><div id=centerCol><div id=inner-centerCol><div id=contact-contacting-content><div ng-repeat=\"contact in users.contactingUsers\"><div ng-if=showContactingInfo($index) class=contacting-info><h1 class=website-structure-title>{{getContactingInfo($index)}}</h1></div><ely-contact-preview enable-select=false contact=contact privacy-settings=users.privacySettings statistic=users.statistic></ely-contact-preview></div><div ng-show=\"users.numberOfAllContactings > itemsPerPage\" class=pagination><ely-pagination-next-previous total-items=users.numberOfAllContactings items-per-page={{itemsPerPage}} get-pagination-set=getContacting reset-counter=resetCounter></ely-pagination-next-previous></div><div ng-show=\"users.numberOfAllContactings === 0 && users.contactingUsers.length === 0\"><div class=no-contact-description><h3>Es hat Dich noch niemand als Kontakt hinzugefügt</h3></div></div></div></div></div><div id=my-contact-statistic><h5>Personen die mich als Kontakt hinzugefügt haben:</h5><ul id=contact-counter class=list-group><li class=list-group-item><span class=badge>{{users.numberOfContactingLastDay}}</span><div class=contact-description-count>In den letzten 24h</div></li><li class=list-group-item><span class=badge>{{users.numberOfContactingLastWeek}}</span><div class=contact-description-count>In der letzten Woche</div></li><li class=list-group-item><span class=badge>{{users.numberOfContactingLastMonth}}</span><div class=contact-description-count>Im letzten Monat</div></li><li class=list-group-item><span class=badge>{{users.numberOfAllContactings}}</span><div class=contact-description-count>Gesamt</div></li></ul><div id=my-contact-statistic-bottom></div></div></div>"
  );


  $templateCache.put('app/modules/contact/myContact.html',
    "<div id=content-page-contact><div id=centerCol><div id=inner-centerCol><div ng-repeat=\"contact in users.contacts\"><ely-contact-preview contact=contact statistic=users.statistic privacy-settings=users.privacySettings number-of-contacts=users.numberOfContacts></ely-contact-preview></div><div ng-show=\"!isUserSearch && users.contactsForPagination > itemsPerPage\" class=pagination><ely-pagination-next-previous total-items=users.contactsForPagination items-per-page={{itemsPerPage}} get-pagination-set=paginationChanged></ely-pagination-next-previous></div><div ng-show=\"users.numberOfContacts === 0 && users.contacts.length === 0\"><div class=no-contact-description><h3>Du hast noch keine Kontakte</h3>{{help.content}}</div></div></div><div id=search-box-container><ely-search-box description=\"Suche nach Personen...\" query=query get-query-suggestion=getUserSuggestion get-query=getUser></ely-search-box></div></div><div id=my-contact-statistic><ul id=contact-counter class=list-group ng-controller=DescriptionCounterCtrl><div><li class=list-group-item ng-class=\"{'group-selected': allContactsSelected}\"><span class=badge>{{users.numberOfContacts}}</span><div class=contact-description-count ng-click=selectedAllContacts()>Alle Kontakte</div></li></div><div ng-repeat=\"statistic in users.statistic\"><li class=list-group-item ng-class=\"{'group-selected': statistic.selected}\"><span class=badge>{{statistic.count}}</span><div class=contact-description-count ng-click=selectedStatisticType(statistic)>{{statistic.type}}</div></li></div></ul><div id=privacy-link><a ui-sref=settings.privacy>Privatsphären Einstellungen verwalten...</a></div><div id=help-my-contact data-animation=am-fade-and-scale data-placement=center data-backdrop=false bs-modal=help><img src=/app/img/help.png></div></div></div>"
  );


  $templateCache.put('app/modules/contact/services/userActionsModalDescription.html',
    "<div class=modal tabindex=-1 role=dialog aria-hidden=true><div id=modal-dialog-set-privacy class=modal-dialog><div class=modal-content><div class=modal-header ng-show=title><h4 class=modal-title ng-bind=title></h4></div><div class=modal-body><button type=button class=\"btn btn-default privacy-selection\" ng-model=contact.selectedPrivacySetting trigger=click bs-options=\"privacySetting.type as privacySetting.type for privacySetting in contact.privacySettings\" data-placeholder=\"\" bs-select>Action <span class=caret></span></button><div class=privacy-description>Wähle eine Privatsphären Einstellung</div></div><div class=modal-footer><button type=button class=\"btn btn-default\" ng-click=$hide()>Abbrechen</button> <button type=button class=\"btn btn-default\" ng-click=\"send($scope, $hide)\">{{actionDescription}}</button></div></div></div></div>"
  );


  $templateCache.put('app/modules/contact/userDetail.html',
    "<div id=content-page-contact-details><div id=centerCol><div id=inner-centerCol><div id=profile-detail-header><div id=profile-image><img class=\"img-rounded img-responsive\" ng-src=\"{{contact.profileUrl}}\"></div><div id=profile-data><div id=profile-data-overview><div id=profile-data-name>{{contact.name}}</div><div id=profile-connection-state ng-hide=\"contact.connected === 'none'\" data-trigger=hover data-delay=600 data-title={{tooltipConnectionState.title}} bs-tooltip><img ng-src={{contact.connectionImage}}></div><div id=profile-connection-type><div class=profile-inner-connection-type ng-click=openModalUpdateType($scope) ng-show=contact.type>({{contact.type}})</div></div><div class=profile-data-description>{{contact.country}}</div><div class=profile-data-description>{{contact.birthday}}</div><div class=profile-data-description>{{contact.street}}</div><div class=profile-data-description>{{contact.place}}</div></div><div id=profile-command><button type=button class=\"btn btn-default\" aria-expanded=false ng-show=!contact.type ng-click=openModalAddNewContact($scope)><span class=\"glyphicon glyphicon-plus\" aria-hidden=true></span> Als Kontakt hinzufügen</button> <button type=button class=\"btn btn-default\" aria-expanded=false ng-click=\"sendMessage(userId, contact.name)\">Nachricht senden</button></div></div></div><div class=profile-detail-content-group ng-show=\"contacts.length > 0\"><h1 class=website-structure-title>Kontakte</h1><div class=profile-contacts-description ng-show=contact.female>Sie hat {{numberOfContacts}} Kontakte ({{numberOfSameContacts}} gemeinsame Kontakte)</div><div class=profile-contacts-description ng-show=!contact.female>Er hat {{numberOfContacts}} Kontakte ({{numberOfSameContacts}} gemeinsame Kontakte)</div><div class=user-mini-preview-container><div class=user-mini-preview ng-repeat=\"user in contacts\" ng-click=openUserDetails(user.userId)><div class=user-mini-preview-content><img ng-src={{user.profileUrl}}><div class=user-mini-preview-name><div class=name>{{user.name}}</div></div></div></div><div class=profile-contact-expander-container><div class=profile-contact-expander ng-show=\"contacts.length < numberOfContacts - 1\" ng-click=appendContacts()><img src=\"app/img/expand-down.png\"></div></div></div></div><div class=profile-detail-content-group><div class=profile-detail-content-group-inner><ely-page-preview-container title=\"Buch Bewertungen\" service=PageRecommendationOtherUser service-parameter=bookServiceParameter hide=false></ely-page-preview-container></div><div class=profile-detail-content-group-inner><ely-page-preview-container video-width=160 video-height=255 title=\"Video Bewertungen\" service=PageRecommendationOtherUser service-parameter=videoServiceParameter hide=false></ely-page-preview-container></div></div></div></div></div>"
  );


  $templateCache.put('app/modules/directives/expandText/template.html',
    "<div class=ely-expand-text><div class=ely-expand-text-description ng-style=descriptionStyle>{{description}}</div><div class=ely-expand-expand ng-click=expand() ng-show=\"showExpand && !expanded\">Mehr lesen</div></div>"
  );


  $templateCache.put('app/modules/directives/formTextInput/template.html',
    "<div class=\"form-group ely-form-text-input\" ng-class=\"{'has-error': showError && (visited || submitFailed)}\"><label for={{inputName}} class=\"col-sm-4 control-label\" ng-hide=showWithoutLabel>{{label}} <em ng-show=\"elyRequired !== 'true'\">(optional)</em></label><div ng-class=\"{'col-sm-8': !showWithoutLabel}\"><input name={{inputName}} ng-model=submitModel class=form-control id={{inputName}} placeholder={{inputPlaceholder}} ng-blur=\"visited = true\" ng-maxlength={{maxLength}} ng-required=\"{{elyRequired === 'true'}}\"><div class=ely-input-error-wrapper><div class=ely-input-image-error ng-show=\"showError && (visited || submitFailed)\" data-template-url=app/modules/util/tooltip/tooltipError.html data-trigger=hover data-placement=left data-container=body bs-tooltip=errorDescription><img src=\"app/img/error.png\"></div></div></div></div>"
  );


  $templateCache.put('app/modules/directives/iframe/template.html',
    "<div class=ely-iframe><iframe width={{width}} height={{height}} ng-src={{link}}></iframe></div>"
  );


  $templateCache.put('app/modules/directives/imageCropper/template.html',
    "<div class=cropper-outer-container><img src=\"\" ng-show=\"image && image.trim() !== ''\"></div>"
  );


  $templateCache.put('app/modules/directives/paginationNextPrevious/template.html',
    "<div class=paginationNextPrevious><div class=paginationNextPrevious-wrapper><div class=paginationElement ng-class=\"{disabled: currentPagination === 1}\" ng-click=clickPrevious()><img src=app/img/arrow-previous.png></div><div class=paginationElement ng-class=\"{disabled: currentPagination === currentPaginationRange}\" ng-click=clickNext()><img src=app/img/arrow-next.png></div></div></div>"
  );


  $templateCache.put('app/modules/directives/searchBox/template.html',
    "<div class=searchBoxForm><div class=input-group><input class=form-control placeholder={{description}} ng-model=query ng-keypress=sendGetQuery($event) bs-options=\"querySuggestion.name as querySuggestion.name for querySuggestion in getQuerySuggestion($viewValue)\" data-trigger=click bs-typeahead> <span class=input-group-btn><button class=\"btn btn-default\" type=button ng-click=getQuery(query)><span class=\"glyphicon glyphicon-search\" aria-hidden=true></span></button></span></div></div>"
  );


  $templateCache.put('app/modules/directives/sendButton/template.html',
    "<div class=ely-submit-button><button type=submit class=\"btn btn-default\" ng-click=sendAllData() ng-class=\"{disabled: categoryFinishedButtonDisabled}\">{{buttonDescription}}</button><div class=ely-submit-button-error ng-show=showError><img src=app/img/error.png ng-show=showError data-template-url=app/modules/util/tooltip/tooltipError.html data-trigger=hover data-placement={{errorPlacement}} bs-tooltip=\"errorDescription\"></div><div class=ely-submit-button-success ng-show=showSuccess><img src=app/img/success.png ng-show=\"showSuccess\"></div></div>"
  );


  $templateCache.put('app/modules/directives/spin/template.html',
    "<div class=spin><div id=spinner-content></div></div>"
  );


  $templateCache.put('app/modules/directives/starRating/template.html',
    "<div class=ely-star-rating ng-mouseleave=resetToSelected()><md-icon md-svg-icon=rating:{{star[0]}} aria-label=\"\" ng-mouseover=mouseOverStar(0) ng-mousedown=starSelected(1) ng-class=\"{'ely-star-rating-small': isSmall, 'ely-star-rating-x-small': isXSmall}\" ng-if=\"star.length === 5\"></md-icon><md-icon md-svg-icon=rating:{{star[1]}} aria-label=\"\" ng-mouseover=mouseOverStar(1) ng-mousedown=starSelected(2) ng-class=\"{'ely-star-rating-small': isSmall, 'ely-star-rating-x-small': isXSmall}\" ng-if=\"star.length === 5\"></md-icon><md-icon md-svg-icon=rating:{{star[2]}} aria-label=\"\" ng-mouseover=mouseOverStar(2) ng-mousedown=starSelected(3) ng-class=\"{'ely-star-rating-small': isSmall, 'ely-star-rating-x-small': isXSmall}\" ng-if=\"star.length === 5\"></md-icon><md-icon md-svg-icon=rating:{{star[3]}} aria-label=\"\" ng-mouseover=mouseOverStar(3) ng-mousedown=starSelected(4) ng-class=\"{'ely-star-rating-small': isSmall, 'ely-star-rating-x-small': isXSmall}\" ng-if=\"star.length === 5\"></md-icon><md-icon md-svg-icon=rating:{{star[4]}} aria-label=\"\" ng-mouseover=mouseOverStar(4) ng-mousedown=starSelected(5) ng-class=\"{'ely-star-rating-small': isSmall, 'ely-star-rating-x-small': isXSmall}\" ng-if=\"star.length === 5\"></md-icon></div>"
  );


  $templateCache.put('app/modules/home/home.html',
    "<div id=ely-home><div class=pinwall-container ng-style=\"{'width': containerWidth + 'px'}\"><div infinite-scroll=nextPinwallInfo() infinite-scroll-distance=1><div class=pinwall-blog-container><ely-home-pinwall-blog show-expand=true is-expand=isExpanded user-info=userInfo blog-added=blogAdded number-of-rows=numberOfRows></ely-home-pinwall-blog></div><div class=pinwall-container-column><ely-home-pinwall-blog show-expand=false is-expand=isExpanded></ely-home-pinwall-blog><div ng-repeat=\"pinwallElement in pinwallElements[0]\" class=pinwall-container-element><ely-home-pinwall-element element=pinwallElement element-removed=elementRemoved></ely-home-pinwall-element></div></div><div class=pinwall-container-column ng-if=\"numberOfRows > 1\"><div ng-repeat=\"pinwallElement in pinwallElements[1]\" class=pinwall-container-element><ely-home-pinwall-element element=pinwallElement element-removed=elementRemoved></ely-home-pinwall-element></div></div><div class=pinwall-container-column ng-if=\"numberOfRows > 2\"><div ng-repeat=\"pinwallElement in pinwallElements[2]\" class=pinwall-container-element><ely-home-pinwall-element element=pinwallElement element-removed=elementRemoved></ely-home-pinwall-element></div></div></div></div></div>"
  );


  $templateCache.put('app/modules/home/homePinwallBlog/blog.html',
    "<div><div ng-controller=BlogExtendedCtrl><div class=load-photo ng-if=imageForUploadPreviewStart><ely-spin></ely-spin></div><div class=blog-photo-container ng-if=imageForUploadPreview><div><img ng-src={{imageForUploadPreview}}></div></div><div class=blog-photo-container-commands ng-if=imageForUploadPreview><div class=command-element ng-click=deletePicture() ng-disabled=user.uploadBlogIsRunning><img id=trash src=app/img/trash.png></div></div><div class=blog-attachment><label>Anhang:</label><div class=blog-attachment-element ng-click=attachPhoto()><img src=\"app/img/home/blog/photos.png\"><div class=attachment-text>Photo</div></div><input type=file ely-file-model=imageForUpload id=select-file-dialog ng-hide=true accept=\".jpg, .png, jpeg\" ng-disabled=user.uploadBlogIsRunning></div><div class=blog-visibility><label>Sichtbar:</label><button type=button class=\"btn btn-default\" ng-model=selectedPrivacyType data-html=1 data-multiple=1 data-animation=am-flip-x bs-options=\"privacyType.type for privacyType in userInfo.privacyTypes\" data-max-length=3 data-max-length-html=ausgew&auml;hlt data-placeholder=Gruppe data-sort=false bs-select ng-hide=selectPublic>Action <span class=caret></span></button><div class=blog-select-all ng-class=\"{'is-selected': selectPublic}\"><input type=checkbox ng-model=selectPublic ng-disabled=user.uploadBlogIsRunning> F&uuml;r Alle</div></div><div class=blog-send><md-button class=\"md-raised md-primary ely-button\" ng-click=sendBlog() ng-disabled=\"!sendBlogAllowed || user.uploadBlogIsRunning\">Posten</md-button><md-button class=ely-button ng-click=abort() ng-disabled=user.uploadBlogIsRunning>Abbrechen</md-button><div class=upload-blog-running ng-if=user.uploadBlogIsRunning><ely-spin size=small></ely-spin></div></div></div></div>"
  );


  $templateCache.put('app/modules/home/homePinwallBlog/template.html',
    "<div class=\"card-element pinwall-blog-element\" ng-class=\"{'pinwall-blog-element-extended': showExpand, 'pinwall-blog-element-collapsed': !showExpand, 'one-column': numberOfRows === 1, 'three-column': numberOfRows === 3}\"><div class=blog-input-container><md-input-container><label>Schreibe einen Beitrag...</label><textarea class=blog-input ng-model=user.blogText ng-focus=expandBlog() ng-disabled=user.uploadBlogIsRunning></textarea></md-input-container></div><div ng-include=\"'app/modules/home/homePinwallBlog/blog.html'\" ng-if=showExpand></div></div>"
  );


  $templateCache.put('app/modules/home/homePinwallElement/blog.html',
    "<div ng-controller=HomePinwallElementBlogCtrl><div class=description>Blog<div class=options ng-show=element.isAdmin><md-menu><md-button ng-click=$mdOpenMenu($event) class=\"md-icon-button md-primary\" aria-label=Settings><md-icon md-svg-icon=system:setting></md-icon></md-button><md-menu-content><md-menu-item><md-button ng-click=removeBlog(element.blogId)>L&ouml;schen</md-button></md-menu-item></md-menu-content></md-menu></div></div><img class=\"profile-image img-circle\" ng-src={{cacheUrl(element.profileUrl)}}><div class=profile-description><div class=profile-name>{{element.name}}</div><div class=time>{{getFormattedDate(element.created, 'LLL')}}</div></div><div class=blog-text><ely-expand-text class=blog-text-expand description={{element.text}} ng-if=\"!element.hasOwnProperty('url')\" max-height=30em></ely-expand-text><div class=blog-text-image ng-if=\"element.hasOwnProperty('url')\" ng-click=openFullScreenDetail()>{{element.text}}</div></div><div class=blog-image-preview ng-if=\"element.hasOwnProperty('url')\" ng-click=openFullScreenDetail()><img ng-src={{cacheUrl(element.url)}}></div></div>"
  );


  $templateCache.put('app/modules/home/homePinwallElement/blogDetail/blogDetail.html',
    "<div ng-controller=HomePinwallElementBlogDetailCtrl id=blog-detail-container><div class=image-container><div class=image-inner-container><img ng-src={{fullScreen.data.urlFull}}></div></div><div class=info-container><div class=blog-text>{{fullScreen.data.text}}</div><div class=header><img ng-src={{fullScreen.data.profileUrl}} class=\"image-blogger img-circle\"><div class=profile-description><div class=user-name>{{fullScreen.data.name}}</div><div class=timestamp>{{getFormattedDate(fullScreen.data.created, 'LLL')}}</div></div></div><div class=close-full-screen ng-click=\"fullScreen.show = false\"><div></div></div></div></div>"
  );


  $templateCache.put('app/modules/home/homePinwallElement/contacting.html',
    "<div ng-controller=HomePinwallElementContactingCtrl><div class=description>Personen die Dich als Kontakt hinzugef&uuml;gt haben</div><div class=profile-messages ng-repeat=\"contacting in element.contacting\"><div ng-click=openDetail(contacting.userId)><img class=\"profile-image img-circle\" ng-src={{cacheUrl(contacting.profileUrl)}}><div class=profile-description><div class=profile-name>{{contacting.name}}</div><div class=info>{{getFormattedDate(contacting.contactAdded)}}</div></div></div></div><div class=link ng-show=\"element.numberOfContacting === 4\" ui-sref=contact.contacting>1 weitere Person hat Dich als Kontakt hinzugef&uuml;gt</div><div class=link ng-show=\"element.numberOfContacting > 4\" ui-sref=contact.contacting>{{element.numberOfContacting - 3}} weitere Personen haben Dich als Kontakt hinzugef&uuml;gt</div></div>"
  );


  $templateCache.put('app/modules/home/homePinwallElement/newMessages.html',
    "<div ng-controller=HomePinwallElementNewMessageCtrl><div class=description>Du hast neue Nachrichten</div><div class=profile-messages ng-repeat=\"message in element.messages\"><div ng-click=openThread(message.threadId)><img class=\"profile-image img-circle\" ng-src={{cacheUrl(message.profileUrl)}}><div class=profile-description><div class=profile-name>{{message.name}}</div><div class=info ng-show=\"message.numberOfUnreadMessages === 1\">{{message.numberOfUnreadMessages}} neue Nachricht</div><div class=info ng-show=\"message.numberOfUnreadMessages > 1\">{{message.numberOfUnreadMessages}} neue Nachrichten</div></div></div></div></div>"
  );


  $templateCache.put('app/modules/home/homePinwallElement/noRecommendation.html',
    "<div><div class=description>Information</div><div class=comment ui-sref=contact.myContacts>Suche nach Personen die Du kennst oder denen Du folgen m&ouml;chtest. (Hier klicken)</div></div>"
  );


  $templateCache.put('app/modules/home/homePinwallElement/recommendation.html',
    "<div ng-controller=HomePinwallElementRecommendationCtrl><div class=description>{{category}} Bewertung</div><img class=\"profile-image img-circle\" ng-src={{cacheUrl(element.profileUrl)}}><div class=profile-description><div class=profile-name>{{element.name}}</div><ely-star-rating class=user-rating is-readonly=true is-x-small=true number-of-selected-stars-readonly=element.rating></ely-star-rating><div class=time>{{getFormattedDate(element.created, 'LLL')}}</div></div><div class=content ng-click=\"openDetail(element.pageId, element.label)\"><img class=image ng-hide=\"element.label === 'Youtube'\" ng-src={{cacheUrl(element.url)}}><ely-iframe width=380 height=300 secure-link=\"https://www.youtube.com/embed/\" src=element.link ng-show=\"element.label === 'Youtube'\"></ely-iframe><div ng-class=\"{'content-description': element.label !== 'Youtube', 'content-youtube-description': element.label === 'Youtube'}\"><div class=title>{{element.title}}</div><ely-star-rating is-readonly=true is-x-small=true class=rating number-of-selected-stars-readonly=element.ratingAllContacts ng-show=\"element.numberOfRatingsByContacts > 1\"></ely-star-rating><div class=rating-description ng-show=\"element.numberOfRatingsByContacts > 1\">{{element.numberOfRatingsByContacts}} Bewertungen</div><div class=content-description-text>{{element.description}}</div></div></div></div>"
  );


  $templateCache.put('app/modules/home/homePinwallElement/template.html',
    "<div class=card-element><div ng-include=\"'app/modules/home/homePinwallElement/recommendation.html'\" ng-if=\"element.type === 'Recommendation'\"></div><div ng-include=\"'app/modules/home/homePinwallElement/noRecommendation.html'\" ng-if=\"element.type === 'NoRecommendations'\"></div><div ng-include=\"'app/modules/home/homePinwallElement/newMessages.html'\" ng-if=\"element.type === 'NewMessages'\"></div><div ng-include=\"'app/modules/home/homePinwallElement/contacting.html'\" ng-if=\"element.type === 'Contacting'\"></div><div ng-include=\"'app/modules/home/homePinwallElement/blog.html'\" ng-if=\"element.type === 'Blog'\"></div></div>"
  );


  $templateCache.put('app/modules/messages/conversation.html',
    "<div id=content-messages><div ng-controller=ConversationActionsCtrl><div id=centerCol><div id=inner-centerCol><div class=add-message ng-style=settings.textInputWrapperStyle><div class=input-group><textarea class=form-control placeholder=Nachricht ng-style=settings.textInputStyle ng-keyup=settings.checkHeightOfInput($event) ng-maxlength=1000 ng-model=settings.newMessage></textarea><span class=input-group-btn><button class=\"btn btn-default\" type=button ng-click=sendMessage() ng-style=settings.textInputStyle ng-class=\"{'disabled': settings.newMessage.trim() === ''}\">Senden</button></span></div></div><div ng-repeat=\"message in settings.thread.messages\" class=message-view><div class=message-inner-view><div class=message-view-image><img ng-src={{message.profileUrl}} class=img-rounded></div><div class=message-view-content><div class=message-view-title><div class=message-view-name>{{message.name}}</div><div class=message-view-timestamp>{{getFormattedDate(message.timestamp)}}</div></div><div class=message-view-text>{{message.text}}</div></div></div></div><div ng-show=\"settings.thread.numberOfMessages > settings.itemsPerPage\" class=pagination><ely-pagination-next-previous total-items=settings.thread.numberOfMessages items-per-page={{settings.itemsPerPage}} get-pagination-set=settings.getThread></ely-pagination-next-previous></div></div></div></div></div>"
  );


  $templateCache.put('app/modules/messages/threads.html',
    "<div id=content-threads><div id=centerCol><div id=inner-centerCol><div ng-if=!search><div ng-repeat=\"thread in threads.threads\" class=thread-preview ng-click=\"openThread(thread.threadId, thread.isGroupThread)\"><div class=thread-preview-image><img ng-src={{thread.profileUrl}} class=img-circle></div><div class=thread-preview-text><div class=thread-preview-description>{{thread.description}}</div><div ng-class=\"{'thread-preview-previewText': !thread.hasNotReadMessages, 'thread-preview-previewTextBold': thread.hasNotReadMessages}\">{{thread.previewText}}</div></div><div ng-class=\"{'thread-preview-date': !thread.hasNotReadMessages, 'thread-preview-dateBold': thread.hasNotReadMessages}\">{{getFormattedDate(thread.lastUpdate)}}</div></div><div ng-show=\"threads.numberOfThreads > itemsPerPage\" class=pagination><ely-pagination-next-previous total-items=threads.numberOfThreads items-per-page={{itemsPerPage}} get-pagination-set=getThreads></ely-pagination-next-previous></div></div><div ng-if=\"search.threads.length > 0\"><div ng-repeat=\"thread in search.threads\" class=thread-preview ng-class=\"{'thread-preview-add-thread': !thread.previewText, 'thread-preview': thread.previewText}\" ng-click=\"openThread(thread.threadId, thread.isGroupThread)\"><div class=thread-preview-image><img ng-src={{thread.profileUrl}} class=img-circle></div><div class=thread-preview-text><div ng-class=\"{'thread-preview-description': thread.previewText, 'thread-preview-description-center': !thread.previewText}\">{{thread.description}}</div><div class=thread-preview-previewText ng-if=thread.previewText>{{thread.previewText}}</div></div><div id=add-new-single-thread ng-if=!thread.previewText><button class=\"btn btn-default\" type=button ng-click=\"addNewSingleThread(thread.userId, thread.description)\"><span class=\"glyphicon glyphicon-plus\" aria-hidden=true></span> Konversation starten</button></div></div></div><div ng-if=\"search.threads.length === 0\">Es konnte leider keiner deiner Kontakte mit dem Namen {{query}} gefunden werden. Du kannst nur Nachrichten an Personen senden, welche du als Kontakt hinzugefügt hast.</div><div id=search-box-container><div id=search-box-container-inner><ely-search-box description=\"Nachricht an...\" query=query get-query-suggestion=getSuggestion get-query=getThreadsOrContacts></ely-search-box></div></div></div></div></div>"
  );


  $templateCache.put('app/modules/navigation/leftNav/template.html',
    "<div id=leftCol><div class=left-nav-element-container ng-repeat=\"section in sectionsDisply\" ng-style=containerStyle><div class=left-nav-element ng-style=\"isFirst($first, section.color)\" ng-click=goToState(section.sref)><div class=left-nav-image-container ng-style=\"{'background-color': section.color }\"><md-icon md-svg-icon=nav:{{section.url}} class=left-nav-image aria-label=\"\"></md-icon></div><div class=left-nav-description-container ng-mouseenter=\"containerStyle={'background-color': section.color, 'color': '#fff' }\" ng-mouseleave=\"containerStyle={}\"><div class=left-nav-description>{{section.description}}</div></div></div></div></div>"
  );


  $templateCache.put('app/modules/navigation/leftNavCol.html',
    "<div ng-controller=LeftNavColCtrl id=leftColNav><ely-left-nav sections=sections></ely-left-nav></div>"
  );


  $templateCache.put('app/modules/navigation/loggedInHeader.html',
    "<div id=public-header ng-controller=LoggedInHeaderCtrl><div><div class=leftHeaderNavElement><div id=header-user-name>{{userHeaderInfo.name}}</div><img ng-src={{userHeaderInfo.profileImagePreview}} class=img-circle data-placement=bottom-right data-template-url=app/modules/navigation/profilePreview/profilePreviewPopover.html data-auto-close=true data-trigger=click bs-popover></div></div></div>"
  );


  $templateCache.put('app/modules/navigation/profilePreview/profilePreviewPopover.html',
    "<div class=popover id=popover-profile-preview ng-controller=ProfilePreviewPopoverCtrl><div class=arrow></div><div class=popover-content><div id=profile-preview-content><img ng-src={{userHeaderInfo.profileImagePreview}} id=profile-preview-image class=img-rounded><div id=profile-preview-description><div id=profile-preview-name>{{userHeaderInfo.name}}</div><div id=profile-preview-email>{{userHeaderInfo.email}}</div></div></div><div id=profile-preview-commands><button class=\"btn btn-default\" id=profile-preview-change type=button ng-click=openProfileEdit($hide)>Profil bearbeiten</button> <button class=\"btn btn-default\" id=profile-preview-logout type=button ng-click=logout()>Abmelden</button></div></div></div>"
  );


  $templateCache.put('app/modules/navigation/publicHeader.html',
    "<div id=public-header></div>"
  );


  $templateCache.put('app/modules/page/createEditPage/commonBook.html',
    "<div><div ng-include=\"'app/modules/page/createEditPage/selectPicture.html'\"></div><div id=create-book-page><div ng-controller=PageCommonBookCtrl><md-input-container><label>Autor</label><input md-maxlength=255 required name=inputDescriptionArea aria-label=Autor ng-model=page.authors><div ng-messages=commonForm.inputDescriptionArea.$error><div ng-message=required>Dieses Feld wird ben&ouml;tigt!</div><div ng-message=md-maxlength>Text ist zu lang!</div></div></md-input-container><md-input-container><label>Erscheinungsdatum</label><input name=inputPublicationDate aria-label=Erscheinungsdatum ng-model=page.publishDate><div ng-messages=commonForm.inputPublicationDate.$error><div ng-message=custom>Gib ein g&#252ltiges Datum an (z.B. {{getDateExample()}})</div></div></md-input-container></div></div><div id=description-area><md-content><md-input-container><label>Beschreibung</label><textarea md-maxlength=10000 required name=inputDescriptionArea aria-label=Beschreibung ng-model=page.description></textarea><div ng-messages=commonForm.inputDescriptionArea.$error><div ng-message=required>Dieses Feld wird ben&ouml;tigt!</div><div ng-message=md-maxlength>Text ist zu lang!</div></div></md-input-container></md-content></div></div>"
  );


  $templateCache.put('app/modules/page/createEditPage/commonYoutube.html',
    "<div><div id=content-create-edit-youtube-page-common-area ng-controller=PageCommonYoutubeCtrl><md-input-container><label>Link zum Youtube Video</label><input name=inputYoutubeLink required aria-label=\"Link zum Youtube Video\" ng-model=page.youtubeLink><div ng-messages=commonForm.inputYoutubeLink.$error><div ng-message=required>Dieses Feld wird ben&ouml;tigt!</div><div ng-message=custom>Der Link muss folgende Sequenz enthalten: https://www.youtube.com/embed/ oder https://www.youtube.com/watch?v=\"</div></div></md-input-container><ely-iframe width=500 height=400 secure-link=\"https://www.youtube.com/embed/\" src=page.youtubeLinkFormatted ng-show=\"commonForm.inputYoutubeLink.$valid && commonForm.inputYoutubeLink.$dirty\"></ely-iframe><img src=app/img/defaultVideo.png ng-hide=\"commonForm.inputYoutubeLink.$valid && commonForm.inputYoutubeLink.$dirty\"></div><div id=description-area><md-content><md-input-container><label>Beschreibung</label><textarea md-maxlength=10000 required name=inputDescriptionArea aria-label=Beschreibung ng-model=page.description></textarea><div ng-messages=commonForm.inputDescriptionArea.$error><div ng-message=required>Dieses Feld wird ben&ouml;tigt!</div><div ng-message=md-maxlength>Text ist zu lang!</div></div></md-input-container></md-content></div></div>"
  );


  $templateCache.put('app/modules/page/createEditPage/pageCreateEdit.html',
    "<div id=content-page-create-edit><div id=centerCol><div id=inner-centerCol ng-controller=PageSelectCategoryCtrl><div class=card-element><div class=description ng-hide=mode.edit>Kategorie ausw&aumlhlen</div><div class=description ng-show=mode.edit>Kategorie</div><div id=content-create-edit-category layout=column><form name=categoryForm><div layout=row><button type=button class=\"btn btn-default content-create-edit-category-element\" ng-model=category.selectedCategory name=inputCategory id=inputCategoryId bs-options=\"category as category for category in categories\" data-placeholder=\"Kategorie ausw&aumlhlen\" ng-class=\"{disabled: !categoryFirstSelect || mode.edit}\" bs-select><span class=caret></span></button> <button type=button class=\"btn btn-default content-create-edit-category-element\" ng-model=category.selectedLanguage name=inputLanguage id=inputLanguageId bs-options=\"language.description as language.description for language in languages\" data-placeholder=\"Sprache der Seite ausw&aumlhlen\" ng-class=\"{disabled: !categoryFirstSelect || mode.edit}\" bs-select><span class=caret></span></button></div><div layout=row><md-input-container id=inputTitleId><label>Titel</label><input ng-model=category.title md-maxlength=100></md-input-container></div><div layout=row class=content-create-edit-category-element><md-button class=\"md-primary md-raised ely-button category-select-finished\" ng-click=categorySelectFinished() ng-disabled=categoryFinishedButtonDisabled ng-show=categoryFirstSelect>Weiter</md-button><md-button class=\"md-primary md-raised ely-button category-select-finished\" ng-click=categorySelectFinished() ng-show=\"!categoryFirstSelect && state.actual === 1\">Weiter</md-button></div></form></div></div><div id=content-create-edit-page-suggestions ng-show=\"state.actual === 2\"><ely-page-preview-container video-width=160 video-height=255 title=\"Existiert die Seite bereits?\" service=SearchPage service-parameter=SearchPageParameter hide=false not-request-init-service=true container-width=780></ely-page-preview-container><div id=content-create-edit-page-suggestion-commands><md-button class=\"md-primary md-raised ely-button content-create-edit-page-suggestion-commands-buttons\" ng-click=suggestionContinue()>Weiter</md-button><md-button class=\"md-primary ely-button content-create-edit-page-suggestion-commands-buttons\" ng-click=abortCreateEditPage()>Seite Erstellen Abbrechen</md-button></div></div><div ng-include=\"'app/modules/page/createEditPage/commonSection.html'\"></div></div></div></div>"
  );


  $templateCache.put('app/modules/page/createEditPage/selectPicture.html',
    "<div id=picture-area><img ng-src={{page.imagePreview}} class=picture><div><md-button class=\"md-primary md-raised ely-button get-picture\" data-animation=am-fade-and-scale data-placement=center data-backdrop=static data-template-url=app/modules/util/file/previewFile.html bs-modal=modal>Titelbild ausw&aumlhlen..</md-button></div></div>"
  );


  $templateCache.put('app/modules/page/handlingPages/categorySelection/template.html',
    "<div id=page-category-selection><div class=card-element><div class=description aria-hidden=false>Kategorie</div><div id=content layout=column><form name=categoryForm><div layout=row layout-wrap=\"\" class=row-select-category><div flex=33><md-checkbox class=md-primary ng-model=ctrl.categories.Book aria-label=Buch ng-disabled=\"(ctrl.isSingleSelectionDisabled && !ctrl.categories.Book) || ctrl.isEditMode\" ng-change=ctrl.categoriesSelectionChanged()>Buch</md-checkbox></div><div flex=33><md-checkbox class=md-primary ng-model=ctrl.categories.Youtube aria-label=\"Video (Youtube)\" ng-disabled=\"(ctrl.isSingleSelectionDisabled && !ctrl.categories.Youtube) || ctrl.isEditMode\" ng-change=ctrl.categoriesSelectionChanged()>Video (Youtube)</md-checkbox></div><div flex=33><md-checkbox class=md-primary ng-model=ctrl.categories.Movie aria-label=Film ng-disabled=\"(ctrl.isSingleSelectionDisabled && !ctrl.categories.Movie) || ctrl.isEditMode\" ng-change=ctrl.categoriesSelectionChanged()>Film</md-checkbox></div></div><div layout=row layout-wrap=\"\" class=row-select-category><div flex=33><md-checkbox class=md-primary ng-model=ctrl.categories.School aria-label=Schule ng-disabled=ctrl.isMultipleSelectionDisabled ng-change=ctrl.categoriesSelectionChanged()>Schule</md-checkbox></div><div flex=33><md-checkbox class=md-primary ng-model=ctrl.categories.Seminar aria-label=Seminar ng-disabled=ctrl.isMultipleSelectionDisabled ng-change=ctrl.categoriesSelectionChanged()>Seminar</md-checkbox></div><div flex=33><md-checkbox class=md-primary ng-model=ctrl.categories.Practice aria-label=Praxis ng-disabled=ctrl.isMultipleSelectionDisabled ng-change=ctrl.categoriesSelectionChanged()>Praxis</md-checkbox></div><div flex=33><md-checkbox class=md-primary ng-model=ctrl.categories.Shop aria-label=Shop ng-disabled=ctrl.isMultipleSelectionDisabled ng-change=ctrl.categoriesSelectionChanged()>Shop</md-checkbox></div><div flex=33><md-checkbox class=md-primary ng-model=ctrl.categories.Events aria-label=Events ng-disabled=ctrl.isMultipleSelectionDisabled ng-change=ctrl.categoriesSelectionChanged()>Events</md-checkbox></div><div flex=33><md-checkbox class=md-primary ng-model=ctrl.categories.SeminarCenter aria-label=Seminarzentrum ng-disabled=ctrl.isMultipleSelectionDisabled ng-change=ctrl.categoriesSelectionChanged()>Seminarzentrum</md-checkbox></div><div flex=33><md-checkbox class=md-primary ng-model=ctrl.categories.Travel aria-label=Reisen ng-disabled=ctrl.isMultipleSelectionDisabled ng-change=ctrl.categoriesSelectionChanged()>Reisen</md-checkbox></div></div><div layout=row><button type=button class=\"btn btn-default content-create-edit-category-element\" ng-model=ctrl.selectedLanguage ng-change=ctrl.languageChanged() name=inputLanguage id=inputLanguageId bs-options=\"language.description as language.description for language in ctrl.languages\" data-placeholder=\"Sprache der Seite auswählen\" ng-class=ctrl.isLanguageDisabled ng-disabled=ctrl.isEditMode bs-select=\"\" tabindex=0 aria-invalid=false>Sprache der Seite auswählen<span class=caret></span></button></div><div layout=row><md-input-container id=inputTitleId><label>Titel</label><input ng-model=ctrl.title ng-change=ctrl.titleChanged() name=categoryTitle md-maxlength=100 required ng-disabled=ctrl.isEditMode><div ng-messages=categoryForm.categoryTitle.$error ng-hide=ctrl.isEditMode><div ng-message=required>Dieses Feld wird benötigt!</div></div></md-input-container></div><div layout=row class=content-create-edit-category-element><md-button class=\"md-primary md-raised ely-button category-select-finished\" ng-show=ctrl.showContinueButton ng-hide=ctrl.isEditMode ng-click=ctrl.categorySelectFinished() ng-disabled=ctrl.isFinishDisabled aria-hidden=false aria-disabled=true disabled><span>Weiter</span></md-button></div></form></div></div></div>"
  );


  $templateCache.put('app/modules/page/handlingPages/compareExistingPages/template.html',
    "<div id=compare-existing-pages ng-show=ctrl.showPreviews><ely-page-preview-container video-width=160 video-height=255 title=\"Existiert die Seite bereits?\" service=ctrl.SearchPage page-request-start=ctrl.pageRequest hide=false container-max-width=780></ely-page-preview-container><div class=commands><md-button class=\"md-primary md-raised ely-button command-buttons\" ng-click=ctrl.continue()>Weiter</md-button><md-button class=\"md-primary ely-button command-buttons\" ng-click=ctrl.abortHandlingPage()>Seite Erstellen Abbrechen</md-button></div></div>"
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


  $templateCache.put('app/modules/page/pageDetail/book.html',
    "<div id=ely-book-page><div class=header><div class=book-image><img ng-src={{pageDetail.page.titleUrl}}></div><div class=header-content><div class=book-title>{{pageDetail.page.title}}</div><div class=authors>von {{pageDetail.page.author.name}}<div class=author ng-repeat=\"author in pageDetail.page.author\">{{author.name}}</div></div><div class=header-commands ng-controller=AddRemoveRecommendationCtrl><md-button class=\"md-raised md-primary ely-button\" ng-click=\"addNewRecommendation(pageDetail, pageId, pageDetail.page.title)\" ng-hide=pageDetail.recommendation.user>Bewerten</md-button></div><div ng-include=\"'app/modules/page/pageDetail/common/ratingOverview.html'\"></div></div></div><div ng-include=\"'app/modules/page/pageDetail/common/commonBody.html'\"></div></div>"
  );


  $templateCache.put('app/modules/page/pageDetail/common/commonBody.html',
    "<div><div class=page-element><h2 class=website-structure-title>Beschreibung</h2><ely-expand-text description={{pageDetail.page.description}}></ely-expand-text></div><div class=page-element ng-show=pageDetail.recommendation.user><div class=user-recommendation-element ng-controller=AddRemoveRecommendationCtrl><h2 class=website-structure-title>Meine Bewertung</h2><ely-star-rating is-readonly=true is-small=true number-of-selected-stars-readonly=pageDetail.recommendation.user.rating></ely-star-rating><div id=user-recommendation>bewertet am {{pageDetail.recommendation.user.created}}</div><md-button class=\"md-primary md-raised ely-button user-recommendation-remove\" ng-click=\"removeRecommendation(pageDetail, pageId, label)\">Bewertung entfernen</md-button><div id=user-recommendation-comment>{{pageDetail.recommendation.user.comment}}</div></div></div><div ng-if=\"pageDetail.recommendation.summary.contact.numberOfRatings > 0 || pageDetail.recommendation.summary.all.numberOfRatings > 0 && startLoad\"><ely-page-review only-contacts=true title=\"Bewertungen deiner Kontakte\" ng-if=\"pageDetail.recommendation.summary.contact.numberOfRatings > 0\"></ely-page-review><ely-page-review only-contacts=false title=\"Alle Bewertungen\" ng-if=\"pageDetail.recommendation.summary.all.numberOfRatings > 0 && pageDetail.recommendation.summary.contact.numberOfRatings === 0\"></ely-page-review></div></div>"
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


  $templateCache.put('app/modules/page/pageOverview.html',
    "<div id=content-page-overview><div id=centerCol><div id=inner-centerCol><ely-page-preview-container video-width=160 video-height=255 title=Suchergebnisse service=SearchPage page-request-start=searchPageRequest hide=!hide></ely-page-preview-container><ely-page-preview-container title=\"Beliebteste B&uuml;cher deiner Kontakte\" service=PopularPages page-request-start=popularBooksContact hide=hide></ely-page-preview-container><ely-page-preview-container video-width=160 video-height=255 title=\"Beliebteste Youtube Videos deiner Kontakte\" service=PopularPages page-request-start=popularYoutubeContact hide=hide></ely-page-preview-container><ely-page-preview-container title=\"Beliebteste B&uuml;cher\" service=PopularPages page-request-start=popularBooksAll hide=hide></ely-page-preview-container><ely-page-preview-container video-width=160 video-height=255 title=\"Beliebteste Youtube Videos\" service=PopularPages page-request-start=popularYoutubeAll hide=hide></ely-page-preview-container><div id=search-box-container><ely-search-box description=\"Suche nach Seite...\" query=query get-query-suggestion=getUserSuggestion get-query=searchPage></ely-search-box></div></div></div></div>"
  );


  $templateCache.put('app/modules/page/pagePreview/commentDialog.html',
    "<div class=modal tabindex=-1 role=dialog aria-hidden=true><div id=modal-comment-dialog class=modal-dialog><div class=modal-content><div class=modal-header ng-show=title><h4 class=modal-title ng-bind=title></h4></div><div class=modal-body><img ng-src={{contact.url}} class=\"modal-body-profile-img img-circle\"><div class=modal-body-user-info><div class=modal-body-name>{{contact.name}}</div><ely-star-rating is-readonly=true is-x-small=true class=modal-body-rating number-of-selected-stars-readonly=contact.rating></ely-star-rating></div><div class=modal-body-comment>{{contact.comment}}</div></div><div class=modal-footer><button type=button class=\"btn btn-default\" ng-click=confirm()>Ok</button></div></div></div></div>"
  );


  $templateCache.put('app/modules/page/pagePreview/template.html',
    "<div><div class=page-preview><div class=page-preview-image-container ng-click=\"openDetail(pagePreview.pageId, pagePreview.label)\"><img ng-src={{cacheUrl(pagePreview.url)}} class=page-preview-image ng-hide=\"pagePreview.label === 'Youtube'\"><ely-iframe width={{videoWidth}} height={{videoHeight}} secure-link=\"https://www.youtube.com/embed/\" src=pagePreview.link ng-show=\"pagePreview.label === 'Youtube'\"></ely-iframe></div><div class=page-preview-title ng-click=\"openDetail(pagePreview.pageId, pagePreview.label)\">{{pagePreview.title}}</div><div class=page-preview-language ng-click=\"openDetail(pagePreview.pageId, pagePreview.label)\">{{pagePreview.labelShow}}, {{pagePreview.languageShow}}</div><div class=page-preview-contact ng-if=\"format === 'long'\" ng-click=\"openDetail(pagePreview.pageId, pagePreview.label)\"><div class=page-preview-contact-name>{{pagePreview.recommendation.contact.name}}</div></div><ely-star-rating is-readonly=true is-x-small=true class=page-preview-rating ng-show=\"pagePreview.recommendation.summary.numberOfRatings > 0\" number-of-selected-stars-readonly=pagePreview.recommendation.summary.rating></ely-star-rating><ely-star-rating is-readonly=true is-x-small=true class=page-preview-rating ng-show=pagePreview.recommendation.contact.rating number-of-selected-stars-readonly=pagePreview.recommendation.contact.rating ng-click=showComment(pagePreview.recommendation.contact)></ely-star-rating><img src=app/img/comment.png class=page-preview-rating-comment ng-show=pagePreview.recommendation.contact.comment ng-click=showComment(pagePreview.recommendation.contact)></div></div>"
  );


  $templateCache.put('app/modules/page/pagePreviewContainer/template.html',
    "<div ng-show=\"ctrl.pagePreviews.length > 0 && !ctrl.hide\" class=page-overview-container ng-style=\"{'width': ctrl.containerWidth + 'px', 'display': 'block'}\"><div class=website-structure-header><h1 class=website-structure-title>{{ctrl.title}}</h1><md-button class=\"md-primary md-raised ely-button page-overview-expand\" ng-click=ctrl.startExpand() ng-show=\"!ctrl.expand && ctrl.numberOfElements < ctrl.totalNumberOfPages\">Mehr</md-button></div><div class=page-preview-container ng-class=\"{'page-preview-expand-container': ctrl.expand}\"><div ng-repeat=\"pagePreview in ctrl.pagePreviews\" class=page-preview-inner-container><ely-page-preview page-preview=pagePreview video-width={{ctrl.videoWidth}} video-height={{ctrl.videoHeight}}></ely-page-preview></div></div><div class=page-overview-next ng-click=ctrl.nextPages() ng-show=\"ctrl.expand && ctrl.expandSkipPages + ctrl.expandNumberOfPages < ctrl.totalNumberOfPages\"><img src=app/img/expand-down.png></div></div>"
  );


  $templateCache.put('app/modules/page/userPageAdministration/userPageAdministration.html',
    "<div id=content-page-user-administration><div id=centerCol><div id=inner-centerCol ng-controller=GetPageAndExtendCtrl><div ng-show=\"noSearchResult && !noPage\"><div class=website-structure-header><h1 class=website-structure-title>Keine Suchergebnisse</h1></div><div><b>{{query}}</b> liefert kein Suchresultat</div></div><div ng-show=noPage><div class=website-structure-header><h1 class=website-structure-title>Du hast noch keine eigene Seite erstellt</h1></div><div>Um Seiten zu bewerten gehe zu <a ui-sref=page.create>Seite erstellen</a></div></div><div class=page-preview-expand-container ng-hide=noSearchResult><div ng-repeat=\"pagePreview in pagePreviews.pages\" class=page-preview-inner-container><ely-page-preview page-preview=pagePreview video-width=160 video-height=255></ely-page-preview></div></div><button type=button class=\"btn btn-default page-user-recommendation-expand\" ng-click=getNextPages() ng-show=\"pagePreviews.pages.length < pagePreviews.totalNumberOfPages\">Mehr</button><div class=page-user-recommendation-expand></div><div id=search-box-container><ely-search-box description=\"Suche nach Seite von welcher Du Administrator bist...\" query=query get-query-suggestion=searchSuggestionPage get-query=searchPage></ely-search-box></div></div></div></div>"
  );


  $templateCache.put('app/modules/page/userRecommendation/userRecommendation.html',
    "<div id=content-page-user-recommendation><div id=centerCol><div id=inner-centerCol ng-controller=GetPageAndExtendCtrl><div ng-show=\"noSearchResult && !noPage\"><div class=website-structure-header><h1 class=website-structure-title>Keine Suchergebnisse</h1></div><div><b>{{query}}</b> liefert kein Suchresultat</div></div><div ng-show=noPage><div class=website-structure-header><h1 class=website-structure-title>Du hast noch keine Seite bewertet</h1></div><div>Um Seiten zu bewerten gehe zu <a ui-sref=page.overview>Empfehlungen</a></div></div><div class=page-preview-expand-container ng-hide=noSearchResult><div ng-repeat=\"pagePreview in pagePreviews.pages\" class=page-preview-inner-container><ely-page-preview page-preview=pagePreview video-width=160 video-height=255></ely-page-preview></div></div><button type=button class=\"btn btn-default page-user-recommendation-expand\" ng-click=getNextPages() ng-show=\"pagePreviews.pages.length < pagePreviews.totalNumberOfPages\">Mehr</button><div class=page-user-recommendation-expand></div><div id=search-box-container><ely-search-box description=\"Suche nach Seite mit einer Bewertung von Dir...\" query=query get-query-suggestion=searchSuggestionPage get-query=searchPage></ely-search-box></div></div></div></div>"
  );


  $templateCache.put('app/modules/recommendation/modalAddRecommendation.html',
    "<div id=modal-dialog-add-recommendation><div class=modal-header><h4 class=modal-title>Deine Bewertung für<div class=title>{{ title}}</div></h4></div><div class=modal-body><div class=description><textarea class=form-control ng-model=ctrl.recommendationDescription maxlength=1000></textarea></div></div><div class=modal-footer><ely-star-rating number-of-selected-stars=ctrl.numberOfSelectedStars></ely-star-rating><div class=error ng-show=ctrl.error>{{ctrl.error}}</div><md-button class=\"md-primary ely-button\" ng-click=ctrl.abort()>Abbrechen</md-button><md-button class=\"md-primary md-raised ely-button\" ng-click=ctrl.addRecommendation() ng-disabled=\"ctrl.numberOfSelectedStars === -1\">Hinzufügen</md-button></div></div>"
  );


  $templateCache.put('app/modules/settings/changePassword.html',
    "<div id=content-settings-password><div id=centerCol><div id=inner-centerCol><div id=manage-profile><form class=form-horizontal name=profileForm role=form novalidate><div class=form-group><label for=inputPasswordActual class=\"col-sm-4 control-label\">Aktuelles Passwort</label><div class=col-sm-8><input name=inputPasswordActual ng-model=password.actualPassword class=form-control type=password id=inputPasswordActual required ng-maxlength=55 ng-minlength=1><div class=\"alert-input alert-danger\" ng-show=profileForm.inputPasswordActual.$error.minlength><span>Das Passwort muss mindestens 1 Zeichen lang sein</span></div><div class=\"alert-input alert-danger\" ng-show=profileForm.inputPasswordActual.$error.maxlength><span>Das Passwort darf nicht länger als 55 Zeichen sein</span></div></div></div><div class=form-group><label for=inputPassword class=\"col-sm-4 control-label\">Neu</label><div class=col-sm-8><input name=inputPassword ng-model=password.newPassword class=form-control type=password id=inputPassword required ng-maxlength=55 ng-pattern=\"/^(?=.*[A-Z])(?=.*\\d)/\"><div class=\"alert-input alert-danger\" ng-show=profileForm.inputPassword.$error.pattern><span>Das Passwort muss mindestens eine Zahl und einen Grossbuchstaben beinhalten</span></div><div class=\"alert-input alert-danger\" ng-show=profileForm.inputPassword.$error.minlength><span>Das Passwort muss mindestens 8 Zeichen lang sein</span></div><div class=\"alert-input alert-danger\" ng-show=profileForm.inputPassword.$error.maxlength><span>Das Passwort darf nicht länger als 55 Zeichen sein</span></div></div></div><div class=form-group><label id=label-password-confirm for=inputPasswordConfirm class=\"col-sm-4 control-label\">Neues Passwort erneut eingeben</label><div class=col-sm-8><input name=inputPasswordConfirm ng-model=password.newPasswordConfirm class=form-control type=password id=inputPasswordConfirm required ng-maxlength=55></div></div><div class=form-group><div class=\"col-sm-offset-4 col-sm-8\"><div><button id=submit-change-profile type=submit class=\"btn btn-default\" ng-click=submitNewPassword()>Passwort ändern</button></div><div class=\"alert-input alert-danger\" ng-show=\"profileForm.$invalid && submitFailed\"><span>Bitte fülle alle Werte korrekt aus</span></div><div class=\"alert-input alert-danger\" ng-show=newPasswordNotEqual><span>Das neue Passwort stimmt nicht überein</span></div><div class=\"alert-input alert-danger\" ng-show=\"profileForm.$invalid == false && submitFailedToServer\"><span>Fehler auf dem Server. Die Werte konnten nicht gespeichert werden</span></div><div class=\"alert-input alert-success\" ng-show=\"successUserDataChange && profileForm.$pristine\"><span>Passwort erfolgreich geändert</span></div></div></div></form></div></div></div></div>"
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


  $templateCache.put('app/modules/util/dialog/yesNoDialog.html',
    "<div class=modal-header ng-show=title><h4 class=modal-title ng-bind=title></h4></div><div class=modal-body ng-bind=content></div><div class=modal-footer><md-button class=\"md-primary ely-button\" ng-click=ctrl.$dismiss()>Nein</md-button><md-button class=\"md-primary md-raised ely-button\" ng-click=ctrl.$close()>Ja</md-button></div>"
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


  $templateCache.put('app/modules/util/waitingScreen/waitingScreen.html',
    "<div class=modal tabindex=-1 role=dialog aria-hidden=true><div id=modal-waiting-screen class=modal-dialog><div class=modal-content><div class=waiting-spin><ely-spin size=small></ely-spin></div><div class=description>{{title}}</div></div></div></div>"
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
/**
 * angular-strap
 * @version v2.3.1 - 2015-07-19
 * @link http://mgcrea.github.io/angular-strap
 * @author Olivier Louvignes <olivier@mg-crea.com> (https://github.com/mgcrea)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
!function(e,t,n){'use strict';function a(e,n,a,o,i,r){function s(e,n){return angular.element((n||t).querySelectorAll(e))}function l(e){return u[e]?u[e]:u[e]=n.get(e,{cache:r}).then(function(e){return e.data})}this.compile=function(t){t.template&&/\.html$/.test(t.template)&&(console.warn('Deprecated use of `template` option to pass a file. Please use the `templateUrl` option instead.'),t.templateUrl=t.template,t.template='');var n=t.templateUrl,r=t.template||'',u=t.controller,c=t.controllerAs,d=angular.copy(t.resolve||{}),f=angular.copy(t.locals||{}),p=t.transformTemplate||angular.identity,g=t.bindToController;return angular.forEach(d,function(e,t){d[t]=angular.isString(e)?a.get(e):a.invoke(e)}),angular.extend(d,f),d.$template=n?l(n):e.when(r),t.contentTemplate&&(d.$template=e.all([d.$template,l(t.contentTemplate)]).then(function(e){var n=angular.element(e[0]),a=s('[ng-bind="content"]',n[0]).removeAttr('ng-bind').html(e[1]);return t.templateUrl||a.next().remove(),n[0].outerHTML})),e.all(d).then(function(e){var n=p(e.$template);t.html&&(n=n.replace(/ng-bind="/gi,'ng-bind-html="'));var a=angular.element('<div>').html(n.trim()).contents(),r=o(a);return{locals:e,element:a,link:function(t){if(e.$scope=t,u){var n=i(u,e,!0);g&&angular.extend(n.instance,e);var o=angular.isObject(n)?n:n();a.data('$ngControllerController',o),a.children().data('$ngControllerController',o),c&&(t[c]=o)}return r.apply(null,arguments)}}})};var u={}}angular.module('mgcrea.ngStrap',['mgcrea.ngStrap.modal','mgcrea.ngStrap.aside','mgcrea.ngStrap.alert','mgcrea.ngStrap.button','mgcrea.ngStrap.select','mgcrea.ngStrap.datepicker','mgcrea.ngStrap.timepicker','mgcrea.ngStrap.navbar','mgcrea.ngStrap.tooltip','mgcrea.ngStrap.popover','mgcrea.ngStrap.dropdown','mgcrea.ngStrap.typeahead','mgcrea.ngStrap.scrollspy','mgcrea.ngStrap.affix','mgcrea.ngStrap.tab','mgcrea.ngStrap.collapse']),angular.module('mgcrea.ngStrap.affix',['mgcrea.ngStrap.helpers.dimensions','mgcrea.ngStrap.helpers.debounce']).provider('$affix',function(){var e=this.defaults={offsetTop:'auto',inlineStyles:!0};this.$get=['$window','debounce','dimensions',function(t,n,a){function o(o,s){function l(e,t,n){var a=u(),o=c();return v>=a?'top':null!==e&&a+e<=t.top?'middle':null!==w&&t.top+n+$>=o-w?'bottom':'middle'}function u(){return p[0]===t?t.pageYOffset:p[0].scrollTop}function c(){return p[0]===t?t.document.body.scrollHeight:p[0].scrollHeight}var d={},f=angular.extend({},e,s),p=f.target,g='affix affix-top affix-bottom',m=!1,$=0,h=0,v=0,w=0,y=null,b=null,D=o.parent();if(f.offsetParent)if(f.offsetParent.match(/^\d+$/))for(var k=0;k<1*f.offsetParent-1;k++)D=D.parent();else D=angular.element(f.offsetParent);return d.init=function(){this.$parseOffsets(),h=a.offset(o[0]).top+$,m=!o[0].style.width,p.on('scroll',this.checkPosition),p.on('click',this.checkPositionWithEventLoop),r.on('resize',this.$debouncedOnResize),this.checkPosition(),this.checkPositionWithEventLoop()},d.destroy=function(){p.off('scroll',this.checkPosition),p.off('click',this.checkPositionWithEventLoop),r.off('resize',this.$debouncedOnResize)},d.checkPositionWithEventLoop=function(){setTimeout(d.checkPosition,1)},d.checkPosition=function(){var e=u(),t=a.offset(o[0]),n=a.height(o[0]),r=l(b,t,n);y!==r&&(y=r,o.removeClass(g).addClass('affix'+('middle'!==r?'-'+r:'')),'top'===r?(b=null,m&&o.css('width',''),f.inlineStyles&&(o.css('position',f.offsetParent?'':'relative'),o.css('top',''))):'bottom'===r?(b=f.offsetUnpin?-(1*f.offsetUnpin):t.top-e,m&&o.css('width',''),f.inlineStyles&&(o.css('position',f.offsetParent?'':'relative'),o.css('top',f.offsetParent?'':i[0].offsetHeight-w-n-h+'px'))):(b=null,m&&o.css('width',o[0].offsetWidth+'px'),f.inlineStyles&&(o.css('position','fixed'),o.css('top',$+'px'))))},d.$onResize=function(){d.$parseOffsets(),d.checkPosition()},d.$debouncedOnResize=n(d.$onResize,50),d.$parseOffsets=function(){var e=o.css('position');f.inlineStyles&&o.css('position',f.offsetParent?'':'relative'),f.offsetTop&&('auto'===f.offsetTop&&(f.offsetTop='+0'),f.offsetTop.match(/^[-+]\d+$/)?($=1*-f.offsetTop,v=f.offsetParent?a.offset(D[0]).top+1*f.offsetTop:a.offset(o[0]).top-a.css(o[0],'marginTop',!0)+1*f.offsetTop):v=1*f.offsetTop),f.offsetBottom&&(w=f.offsetParent&&f.offsetBottom.match(/^[-+]\d+$/)?c()-(a.offset(D[0]).top+a.height(D[0]))+1*f.offsetBottom+1:1*f.offsetBottom),f.inlineStyles&&o.css('position',e)},d.init(),d}var i=angular.element(t.document.body),r=angular.element(t);return o}]}).directive('bsAffix',['$affix','$window',function(e,t){return{restrict:'EAC',require:'^?bsAffixTarget',link:function(n,a,o,i){var r={scope:n,target:i?i.$element:angular.element(t)};angular.forEach(['offsetTop','offsetBottom','offsetParent','offsetUnpin','inlineStyles'],function(e){if(angular.isDefined(o[e])){var t=o[e];/true/i.test(t)&&(t=!0),/false/i.test(t)&&(t=!1),r[e]=t}});var s=e(a,r);n.$on('$destroy',function(){s&&s.destroy(),r=null,s=null})}}}]).directive('bsAffixTarget',function(){return{controller:['$element',function(e){this.$element=e}]}}),angular.module('mgcrea.ngStrap.alert',['mgcrea.ngStrap.modal']).provider('$alert',function(){var e=this.defaults={animation:'am-fade',prefixClass:'alert',prefixEvent:'alert',placement:null,templateUrl:'alert/alert.tpl.html',container:!1,element:null,backdrop:!1,keyboard:!0,show:!0,duration:!1,type:!1,dismissable:!0};this.$get=['$modal','$timeout',function(t,n){function a(a){var o={},i=angular.extend({},e,a);o=t(i),o.$scope.dismissable=!!i.dismissable,i.type&&(o.$scope.type=i.type);var r=o.show;return i.duration&&(o.show=function(){r(),n(function(){o.hide()},1e3*i.duration)}),o}return a}]}).directive('bsAlert',['$window','$sce','$alert',function(e,t,n){e.requestAnimationFrame||e.setTimeout;return{restrict:'EAC',scope:!0,link:function(e,a,o,i){var r={scope:e,element:a,show:!1};angular.forEach(['template','templateUrl','controller','controllerAs','placement','keyboard','html','container','animation','duration','dismissable'],function(e){angular.isDefined(o[e])&&(r[e]=o[e])});var s=/^(false|0|)$/i;angular.forEach(['keyboard','html','container','dismissable'],function(e){angular.isDefined(o[e])&&s.test(o[e])&&(r[e]=!1)}),e.hasOwnProperty('title')||(e.title=''),angular.forEach(['title','content','type'],function(n){o[n]&&o.$observe(n,function(a,o){e[n]=t.trustAsHtml(a)})}),o.bsAlert&&e.$watch(o.bsAlert,function(t,n){angular.isObject(t)?angular.extend(e,t):e.content=t},!0);var l=n(r);a.on(o.trigger||'click',l.toggle),e.$on('$destroy',function(){l&&l.destroy(),r=null,l=null})}}}]),angular.module('mgcrea.ngStrap.aside',['mgcrea.ngStrap.modal']).provider('$aside',function(){var e=this.defaults={animation:'am-fade-and-slide-right',prefixClass:'aside',prefixEvent:'aside',placement:'right',templateUrl:'aside/aside.tpl.html',contentTemplate:!1,container:!1,element:null,backdrop:!0,keyboard:!0,html:!1,show:!0};this.$get=['$modal',function(t){function n(n){var a={},o=angular.extend({},e,n);return a=t(o)}return n}]}).directive('bsAside',['$window','$sce','$aside',function(e,t,n){e.requestAnimationFrame||e.setTimeout;return{restrict:'EAC',scope:!0,link:function(e,a,o,i){var r={scope:e,element:a,show:!1};angular.forEach(['template','templateUrl','controller','controllerAs','contentTemplate','placement','backdrop','keyboard','html','container','animation'],function(e){angular.isDefined(o[e])&&(r[e]=o[e])});var s=/^(false|0|)$/i;angular.forEach(['backdrop','keyboard','html','container'],function(e){angular.isDefined(o[e])&&s.test(o[e])&&(r[e]=!1)}),angular.forEach(['title','content'],function(n){o[n]&&o.$observe(n,function(a,o){e[n]=t.trustAsHtml(a)})}),o.bsAside&&e.$watch(o.bsAside,function(t,n){angular.isObject(t)?angular.extend(e,t):e.content=t},!0);var l=n(r);a.on(o.trigger||'click',l.toggle),e.$on('$destroy',function(){l&&l.destroy(),r=null,l=null})}}}]),angular.module('mgcrea.ngStrap.button',[]).provider('$button',function(){var e=this.defaults={activeClass:'active',toggleEvent:'click'};this.$get=function(){return{defaults:e}}}).directive('bsCheckboxGroup',function(){return{restrict:'A',require:'ngModel',compile:function(e,t){e.attr('data-toggle','buttons'),e.removeAttr('ng-model');var n=e[0].querySelectorAll('input[type="checkbox"]');angular.forEach(n,function(e){var n=angular.element(e);n.attr('bs-checkbox',''),n.attr('ng-model',t.ngModel+'.'+n.attr('value'))})}}}).directive('bsCheckbox',['$button','$$rAF',function(e,t){var n=e.defaults,a=/^(true|false|\d+)$/;return{restrict:'A',require:'ngModel',link:function(e,o,i,r){var s=n,l='INPUT'===o[0].nodeName,u=l?o.parent():o,c=angular.isDefined(i.trueValue)?i.trueValue:!0;a.test(i.trueValue)&&(c=e.$eval(i.trueValue));var d=angular.isDefined(i.falseValue)?i.falseValue:!1;a.test(i.falseValue)&&(d=e.$eval(i.falseValue));var f='boolean'!=typeof c||'boolean'!=typeof d;f&&(r.$parsers.push(function(e){return e?c:d}),r.$formatters.push(function(e){return angular.equals(e,c)}),e.$watch(i.ngModel,function(e,t){r.$render()})),r.$render=function(){var e=angular.equals(r.$modelValue,c);t(function(){l&&(o[0].checked=e),u.toggleClass(s.activeClass,e)})},o.bind(s.toggleEvent,function(){e.$apply(function(){l||r.$setViewValue(!u.hasClass('active')),f||r.$render()})})}}}]).directive('bsRadioGroup',function(){return{restrict:'A',require:'ngModel',compile:function(e,t){e.attr('data-toggle','buttons'),e.removeAttr('ng-model');var n=e[0].querySelectorAll('input[type="radio"]');angular.forEach(n,function(e){angular.element(e).attr('bs-radio',''),angular.element(e).attr('ng-model',t.ngModel)})}}}).directive('bsRadio',['$button','$$rAF',function(e,t){var n=e.defaults,a=/^(true|false|\d+)$/;return{restrict:'A',require:'ngModel',link:function(e,o,i,r){var s,l=n,u='INPUT'===o[0].nodeName,c=u?o.parent():o;i.$observe('value',function(t){s=a.test(t)?e.$eval(t):t,r.$render()}),r.$render=function(){var e=angular.equals(r.$modelValue,s);t(function(){u&&(o[0].checked=e),c.toggleClass(l.activeClass,e)})},o.bind(l.toggleEvent,function(){e.$apply(function(){r.$setViewValue(s),r.$render()})})}}}]),angular.module('mgcrea.ngStrap.collapse',[]).provider('$collapse',function(){var e=this.defaults={animation:'am-collapse',disallowToggle:!1,activeClass:'in',startCollapsed:!1,allowMultiple:!1},t=this.controller=function(t,n,a){function o(e){for(var t=l.$targets.$active,n=0;n<t.length;n++)e<t[n]&&(t[n]=t[n]-1),t[n]===l.$targets.length&&(t[n]=l.$targets.length-1)}function i(e){var t=l.$targets.$active;return-1===t.indexOf(e)?!1:!0}function r(e){var t=l.$targets.$active.indexOf(e);-1!==t&&l.$targets.$active.splice(t,1)}function s(e){l.$options.allowMultiple||l.$targets.$active.splice(0,1),-1===l.$targets.$active.indexOf(e)&&l.$targets.$active.push(e)}var l=this;l.$options=angular.copy(e),angular.forEach(['animation','disallowToggle','activeClass','startCollapsed','allowMultiple'],function(e){angular.isDefined(a[e])&&(l.$options[e]=a[e])});var u=/^(false|0|)$/i;angular.forEach(['disallowToggle','startCollapsed','allowMultiple'],function(e){angular.isDefined(a[e])&&u.test(a[e])&&(l.$options[e]=!1)}),l.$toggles=[],l.$targets=[],l.$viewChangeListeners=[],l.$registerToggle=function(e){l.$toggles.push(e)},l.$registerTarget=function(e){l.$targets.push(e)},l.$unregisterToggle=function(e){var t=l.$toggles.indexOf(e);l.$toggles.splice(t,1)},l.$unregisterTarget=function(e){var t=l.$targets.indexOf(e);l.$targets.splice(t,1),l.$options.allowMultiple&&r(e),o(t),l.$viewChangeListeners.forEach(function(e){e()})},l.$targets.$active=l.$options.startCollapsed?[]:[0],l.$setActive=t.$setActive=function(e){angular.isArray(e)?l.$targets.$active=e:l.$options.disallowToggle?s(e):i(e)?r(e):s(e),l.$viewChangeListeners.forEach(function(e){e()})},l.$activeIndexes=function(){return l.$options.allowMultiple?l.$targets.$active:1===l.$targets.$active.length?l.$targets.$active[0]:-1}};this.$get=function(){var n={};return n.defaults=e,n.controller=t,n}}).directive('bsCollapse',['$window','$animate','$collapse',function(e,t,n){n.defaults;return{require:['?ngModel','bsCollapse'],controller:['$scope','$element','$attrs',n.controller],link:function(e,t,n,a){var o=a[0],i=a[1];o&&(i.$viewChangeListeners.push(function(){o.$setViewValue(i.$activeIndexes())}),o.$formatters.push(function(e){if(angular.isArray(e))i.$setActive(e);else{var t=i.$activeIndexes();angular.isArray(t)?-1===t.indexOf(1*e)&&i.$setActive(1*e):t!==1*e&&i.$setActive(1*e)}return e}))}}}]).directive('bsCollapseToggle',function(){return{require:['^?ngModel','^bsCollapse'],link:function(e,t,n,a){var o=(a[0],a[1]);t.attr('data-toggle','collapse'),o.$registerToggle(t),e.$on('$destroy',function(){o.$unregisterToggle(t)}),t.on('click',function(){var a=n.bsCollapseToggle&&'bs-collapse-toggle'!==n.bsCollapseToggle?n.bsCollapseToggle:o.$toggles.indexOf(t);o.$setActive(1*a),e.$apply()})}}}).directive('bsCollapseTarget',['$animate',function(e){return{require:['^?ngModel','^bsCollapse'],link:function(t,n,a,o){function i(){var t=r.$targets.indexOf(n),a=r.$activeIndexes(),o='removeClass';angular.isArray(a)?-1!==a.indexOf(t)&&(o='addClass'):t===a&&(o='addClass'),e[o](n,r.$options.activeClass)}var r=(o[0],o[1]);n.addClass('collapse'),r.$options.animation&&n.addClass(r.$options.animation),r.$registerTarget(n),t.$on('$destroy',function(){r.$unregisterTarget(n)}),r.$viewChangeListeners.push(function(){i()}),i()}}}]),angular.module('mgcrea.ngStrap.datepicker',['mgcrea.ngStrap.helpers.dateParser','mgcrea.ngStrap.helpers.dateFormatter','mgcrea.ngStrap.tooltip']).provider('$datepicker',function(){var e=this.defaults={animation:'am-fade',prefixClass:'datepicker',placement:'bottom-left',templateUrl:'datepicker/datepicker.tpl.html',trigger:'focus',container:!1,keyboard:!0,html:!1,delay:0,useNative:!1,dateType:'date',dateFormat:'shortDate',timezone:null,modelDateFormat:null,dayFormat:'dd',monthFormat:'MMM',yearFormat:'yyyy',monthTitleFormat:'MMMM yyyy',yearTitleFormat:'yyyy',strictFormat:!1,autoclose:!1,minDate:-(1/0),maxDate:+(1/0),startView:0,minView:0,startWeek:0,daysOfWeekDisabled:'',iconLeft:'glyphicon glyphicon-chevron-left',iconRight:'glyphicon glyphicon-chevron-right'};this.$get=['$window','$document','$rootScope','$sce','$dateFormatter','datepickerViews','$tooltip','$timeout',function(t,n,a,o,i,r,s,l){function u(t,n,a){function o(e){e.selected=u.$isSelected(e.date)}function i(){t[0].focus()}var u=s(t,angular.extend({},e,a)),f=a.scope,p=u.$options,g=u.$scope;p.startView&&(p.startView-=p.minView);var m=r(u);u.$views=m.views;var $=m.viewDate;g.$mode=p.startView,g.$iconLeft=p.iconLeft,g.$iconRight=p.iconRight;var h=u.$views[g.$mode];g.$select=function(e){u.select(e)},g.$selectPane=function(e){u.$selectPane(e)},g.$toggleMode=function(){u.setMode((g.$mode+1)%u.$views.length)},u.update=function(e){angular.isDate(e)&&!isNaN(e.getTime())&&(u.$date=e,h.update.call(h,e)),u.$build(!0)},u.updateDisabledDates=function(e){p.disabledDateRanges=e;for(var t=0,n=g.rows.length;n>t;t++)angular.forEach(g.rows[t],u.$setDisabledEl)},u.select=function(e,t){angular.isDate(n.$dateValue)||(n.$dateValue=new Date(e)),!g.$mode||t?(n.$setViewValue(angular.copy(e)),n.$render(),p.autoclose&&!t&&l(function(){u.hide(!0)})):(angular.extend($,{year:e.getFullYear(),month:e.getMonth(),date:e.getDate()}),u.setMode(g.$mode-1),u.$build())},u.setMode=function(e){g.$mode=e,h=u.$views[g.$mode],u.$build()},u.$build=function(e){e===!0&&h.built||(e!==!1||h.built)&&h.build.call(h)},u.$updateSelected=function(){for(var e=0,t=g.rows.length;t>e;e++)angular.forEach(g.rows[e],o)},u.$isSelected=function(e){return h.isSelected(e)},u.$setDisabledEl=function(e){e.disabled=h.isDisabled(e.date)},u.$selectPane=function(e){var t=h.steps,n=new Date(Date.UTC($.year+(t.year||0)*e,$.month+(t.month||0)*e,1));angular.extend($,{year:n.getUTCFullYear(),month:n.getUTCMonth(),date:n.getUTCDate()}),u.$build()},u.$onMouseDown=function(e){if(e.preventDefault(),e.stopPropagation(),d){var t=angular.element(e.target);'button'!==t[0].nodeName.toLowerCase()&&(t=t.parent()),t.triggerHandler('click')}},u.$onKeyDown=function(e){if(/(38|37|39|40|13)/.test(e.keyCode)&&!e.shiftKey&&!e.altKey){if(e.preventDefault(),e.stopPropagation(),13===e.keyCode)return g.$mode?g.$apply(function(){u.setMode(g.$mode-1)}):u.hide(!0);h.onKeyDown(e),f.$digest()}};var v=u.init;u.init=function(){return c&&p.useNative?(t.prop('type','date'),void t.css('-webkit-appearance','textfield')):(d&&(t.prop('type','text'),t.attr('readonly','true'),t.on('click',i)),void v())};var w=u.destroy;u.destroy=function(){c&&p.useNative&&t.off('click',i),w()};var y=u.show;u.show=function(){!d&&t.attr('readonly')||t.attr('disabled')||(y(),l(function(){u.$isShown&&(u.$element.on(d?'touchstart':'mousedown',u.$onMouseDown),p.keyboard&&t.on('keydown',u.$onKeyDown))},0,!1))};var b=u.hide;return u.hide=function(e){u.$isShown&&(u.$element.off(d?'touchstart':'mousedown',u.$onMouseDown),p.keyboard&&t.off('keydown',u.$onKeyDown),b(e))},u}var c=(angular.element(t.document.body),/(ip(a|o)d|iphone|android)/gi.test(t.navigator.userAgent)),d='createTouch'in t.document&&c;return e.lang||(e.lang=i.getDefaultLocale()),u.defaults=e,u}]}).directive('bsDatepicker',['$window','$parse','$q','$dateFormatter','$dateParser','$datepicker',function(e,t,n,a,o,i){var r=(i.defaults,/(ip(a|o)d|iphone|android)/gi.test(e.navigator.userAgent));return{restrict:'EAC',require:'ngModel',link:function(e,t,n,s){function l(e){return e&&e.length?e:null}function u(e){if(angular.isDate(e)){var t=isNaN(p.$options.minDate)||e.getTime()>=p.$options.minDate,n=isNaN(p.$options.maxDate)||e.getTime()<=p.$options.maxDate,a=t&&n;s.$setValidity('date',a),s.$setValidity('min',t),s.$setValidity('max',n),a&&(s.$dateValue=e)}}function c(){return!s.$dateValue||isNaN(s.$dateValue.getTime())?'':m(s.$dateValue,d.dateFormat)}var d={scope:e};angular.forEach(['template','templateUrl','controller','controllerAs','placement','container','delay','trigger','html','animation','autoclose','dateType','dateFormat','timezone','modelDateFormat','dayFormat','strictFormat','startWeek','startDate','useNative','lang','startView','minView','iconLeft','iconRight','daysOfWeekDisabled','id','prefixClass','prefixEvent'],function(e){angular.isDefined(n[e])&&(d[e]=n[e])});var f=/^(false|0|)$/i;angular.forEach(['html','container','autoclose','useNative'],function(e){angular.isDefined(n[e])&&f.test(n[e])&&(d[e]=!1)}),n.bsShow&&e.$watch(n.bsShow,function(e,t){p&&angular.isDefined(e)&&(angular.isString(e)&&(e=!!e.match(/true|,?(datepicker),?/i)),e===!0?p.show():p.hide())});var p=i(t,s,d);d=p.$options,r&&d.useNative&&(d.dateFormat='yyyy-MM-dd');var g=d.lang,m=function(e,t){return a.formatDate(e,t,g)},$=o({format:d.dateFormat,lang:g,strict:d.strictFormat});angular.forEach(['minDate','maxDate'],function(e){angular.isDefined(n[e])&&n.$observe(e,function(t){p.$options[e]=$.getDateForAttribute(e,t),!isNaN(p.$options[e])&&p.$build(!1),u(s.$dateValue)})}),e.$watch(n.ngModel,function(e,t){p.update(s.$dateValue)},!0),angular.isDefined(n.disabledDates)&&e.$watch(n.disabledDates,function(e,t){e=l(e),t=l(t),e&&p.updateDisabledDates(e)}),s.$parsers.unshift(function(e){var t;if(!e)return s.$setValidity('date',!0),null;var n=$.parse(e,s.$dateValue);return!n||isNaN(n.getTime())?void s.$setValidity('date',!1):(u(n),'string'===d.dateType?(t=$.timezoneOffsetAdjust(n,d.timezone,!0),m(t,d.modelDateFormat||d.dateFormat)):(t=$.timezoneOffsetAdjust(s.$dateValue,d.timezone,!0),'number'===d.dateType?t.getTime():'unix'===d.dateType?t.getTime()/1e3:'iso'===d.dateType?t.toISOString():new Date(t)))}),s.$formatters.push(function(e){var t;return t=angular.isUndefined(e)||null===e?0/0:angular.isDate(e)?e:'string'===d.dateType?$.parse(e,null,d.modelDateFormat):new Date('unix'===d.dateType?1e3*e:e),s.$dateValue=$.timezoneOffsetAdjust(t,d.timezone),c()}),s.$render=function(){t.val(c())},e.$on('$destroy',function(){p&&p.destroy(),d=null,p=null})}}}]).provider('datepickerViews',function(){function e(e,t){for(var n=[];e.length>0;)n.push(e.splice(0,t));return n}function t(e,t){return(e%t+t)%t}this.defaults={dayFormat:'dd',daySplit:7};this.$get=['$dateFormatter','$dateParser','$sce',function(n,a,o){return function(i){var r=i.$scope,s=i.$options,l=s.lang,u=function(e,t){return n.formatDate(e,t,l)},c=a({format:s.dateFormat,lang:l,strict:s.strictFormat}),d=n.weekdaysShort(l),f=d.slice(s.startWeek).concat(d.slice(0,s.startWeek)),p=o.trustAsHtml('<th class="dow text-center">'+f.join('</th><th class="dow text-center">')+'</th>'),g=i.$date||(s.startDate?c.getDateForAttribute('startDate',s.startDate):new Date),m={year:g.getFullYear(),month:g.getMonth(),date:g.getDate()},$=[{format:s.dayFormat,split:7,steps:{month:1},update:function(e,t){!this.built||t||e.getFullYear()!==m.year||e.getMonth()!==m.month?(angular.extend(m,{year:i.$date.getFullYear(),month:i.$date.getMonth(),date:i.$date.getDate()}),i.$build()):(e.getDate()!==m.date||1===e.getDate())&&(m.date=i.$date.getDate(),i.$updateSelected())},build:function(){var n=new Date(m.year,m.month,1),a=n.getTimezoneOffset(),o=new Date(+n-864e5*t(n.getDay()-s.startWeek,7)),l=o.getTimezoneOffset(),d=c.timezoneOffsetAdjust(new Date,s.timezone).toDateString();l!==a&&(o=new Date(+o+6e4*(l-a)));for(var f,g=[],$=0;42>$;$++)f=c.daylightSavingAdjust(new Date(o.getFullYear(),o.getMonth(),o.getDate()+$)),g.push({date:f,isToday:f.toDateString()===d,label:u(f,this.format),selected:i.$date&&this.isSelected(f),muted:f.getMonth()!==m.month,disabled:this.isDisabled(f)});r.title=u(n,s.monthTitleFormat),r.showLabels=!0,r.labels=p,r.rows=e(g,this.split),this.built=!0},isSelected:function(e){return i.$date&&e.getFullYear()===i.$date.getFullYear()&&e.getMonth()===i.$date.getMonth()&&e.getDate()===i.$date.getDate()},isDisabled:function(e){var t=e.getTime();if(t<s.minDate||t>s.maxDate)return!0;if(-1!==s.daysOfWeekDisabled.indexOf(e.getDay()))return!0;if(s.disabledDateRanges)for(var n=0;n<s.disabledDateRanges.length;n++)if(t>=s.disabledDateRanges[n].start&&t<=s.disabledDateRanges[n].end)return!0;return!1},onKeyDown:function(e){if(i.$date){var t,n=i.$date.getTime();37===e.keyCode?t=new Date(n-864e5):38===e.keyCode?t=new Date(n-6048e5):39===e.keyCode?t=new Date(n+864e5):40===e.keyCode&&(t=new Date(n+6048e5)),this.isDisabled(t)||i.select(t,!0)}}},{name:'month',format:s.monthFormat,split:4,steps:{year:1},update:function(e,t){this.built&&e.getFullYear()===m.year?e.getMonth()!==m.month&&(angular.extend(m,{month:i.$date.getMonth(),date:i.$date.getDate()}),i.$updateSelected()):(angular.extend(m,{year:i.$date.getFullYear(),month:i.$date.getMonth(),date:i.$date.getDate()}),i.$build())},build:function(){for(var t,n=(new Date(m.year,0,1),[]),a=0;12>a;a++)t=new Date(m.year,a,1),n.push({date:t,label:u(t,this.format),selected:i.$isSelected(t),disabled:this.isDisabled(t)});r.title=u(t,s.yearTitleFormat),r.showLabels=!1,r.rows=e(n,this.split),this.built=!0},isSelected:function(e){return i.$date&&e.getFullYear()===i.$date.getFullYear()&&e.getMonth()===i.$date.getMonth()},isDisabled:function(e){var t=+new Date(e.getFullYear(),e.getMonth()+1,0);return t<s.minDate||e.getTime()>s.maxDate},onKeyDown:function(e){if(i.$date){var t=i.$date.getMonth(),n=new Date(i.$date);37===e.keyCode?n.setMonth(t-1):38===e.keyCode?n.setMonth(t-4):39===e.keyCode?n.setMonth(t+1):40===e.keyCode&&n.setMonth(t+4),this.isDisabled(n)||i.select(n,!0)}}},{name:'year',format:s.yearFormat,split:4,steps:{year:12},update:function(e,t){!this.built||t||parseInt(e.getFullYear()/20,10)!==parseInt(m.year/20,10)?(angular.extend(m,{year:i.$date.getFullYear(),month:i.$date.getMonth(),date:i.$date.getDate()}),i.$build()):e.getFullYear()!==m.year&&(angular.extend(m,{year:i.$date.getFullYear(),month:i.$date.getMonth(),date:i.$date.getDate()}),i.$updateSelected())},build:function(){for(var t,n=m.year-m.year%(3*this.split),a=[],o=0;12>o;o++)t=new Date(n+o,0,1),a.push({date:t,label:u(t,this.format),selected:i.$isSelected(t),disabled:this.isDisabled(t)});r.title=a[0].label+'-'+a[a.length-1].label,r.showLabels=!1,r.rows=e(a,this.split),this.built=!0},isSelected:function(e){return i.$date&&e.getFullYear()===i.$date.getFullYear()},isDisabled:function(e){var t=+new Date(e.getFullYear()+1,0,0);return t<s.minDate||e.getTime()>s.maxDate},onKeyDown:function(e){if(i.$date){var t=i.$date.getFullYear(),n=new Date(i.$date);37===e.keyCode?n.setYear(t-1):38===e.keyCode?n.setYear(t-4):39===e.keyCode?n.setYear(t+1):40===e.keyCode&&n.setYear(t+4),this.isDisabled(n)||i.select(n,!0)}}}];return{views:s.minView?Array.prototype.slice.call($,s.minView):$,viewDate:m}}}]}),angular.module('mgcrea.ngStrap.dropdown',['mgcrea.ngStrap.tooltip']).provider('$dropdown',function(){var e=this.defaults={animation:'am-fade',prefixClass:'dropdown',prefixEvent:'dropdown',placement:'bottom-left',templateUrl:'dropdown/dropdown.tpl.html',trigger:'click',container:!1,keyboard:!0,html:!1,delay:0};this.$get=['$window','$rootScope','$tooltip','$timeout',function(t,n,a,o){function i(t,i){function l(e){return e.target!==t[0]?e.target!==t[0]&&u.hide():void 0}{var u={},c=angular.extend({},e,i);u.$scope=c.scope&&c.scope.$new()||n.$new()}u=a(t,c);var d=t.parent();u.$onKeyDown=function(e){if(/(38|40)/.test(e.keyCode)){e.preventDefault(),e.stopPropagation();var t=angular.element(u.$element[0].querySelectorAll('li:not(.divider) a'));if(t.length){var n;angular.forEach(t,function(e,t){s&&s.call(e,':focus')&&(n=t)}),38===e.keyCode&&n>0?n--:40===e.keyCode&&n<t.length-1?n++:angular.isUndefined(n)&&(n=0),t.eq(n)[0].focus()}}};var f=u.show;u.show=function(){f(),o(function(){c.keyboard&&u.$element&&u.$element.on('keydown',u.$onKeyDown),r.on('click',l)},0,!1),d.hasClass('dropdown')&&d.addClass('open')};var p=u.hide;u.hide=function(){u.$isShown&&(c.keyboard&&u.$element&&u.$element.off('keydown',u.$onKeyDown),r.off('click',l),d.hasClass('dropdown')&&d.removeClass('open'),p())};var g=u.destroy;return u.destroy=function(){r.off('click',l),g()},u}var r=angular.element(t.document.body),s=Element.prototype.matchesSelector||Element.prototype.webkitMatchesSelector||Element.prototype.mozMatchesSelector||Element.prototype.msMatchesSelector||Element.prototype.oMatchesSelector;return i}]}).directive('bsDropdown',['$window','$sce','$dropdown',function(e,t,n){return{restrict:'EAC',scope:!0,link:function(e,t,a,o){var i={scope:e};angular.forEach(['template','templateUrl','controller','controllerAs','placement','container','delay','trigger','keyboard','html','animation','id'],function(e){angular.isDefined(a[e])&&(i[e]=a[e])});var r=/^(false|0|)$/i;angular.forEach(['html','container'],function(e){angular.isDefined(a[e])&&r.test(a[e])&&(i[e]=!1)}),a.bsDropdown&&e.$watch(a.bsDropdown,function(t,n){e.content=t},!0),a.bsShow&&e.$watch(a.bsShow,function(e,t){s&&angular.isDefined(e)&&(angular.isString(e)&&(e=!!e.match(/true|,?(dropdown),?/i)),e===!0?s.show():s.hide())});var s=n(t,i);e.$on('$destroy',function(){s&&s.destroy(),i=null,s=null})}}}]),angular.module('mgcrea.ngStrap.core',[]).service('$bsCompiler',a),a.$inject=['$q','$http','$injector','$compile','$controller','$templateCache'],angular.module('mgcrea.ngStrap.helpers.dateFormatter',[]).service('$dateFormatter',['$locale','dateFilter',function(e,t){function n(e){return/(h+)([:\.])?(m+)([:\.])?(s*)[ ]?(a?)/i.exec(e).slice(1)}this.getDefaultLocale=function(){return e.id},this.getDatetimeFormat=function(t,n){return e.DATETIME_FORMATS[t]||t},this.weekdaysShort=function(t){return e.DATETIME_FORMATS.SHORTDAY},this.hoursFormat=function(e){return n(e)[0]},this.minutesFormat=function(e){return n(e)[2]},this.secondsFormat=function(e){return n(e)[4]},this.timeSeparator=function(e){return n(e)[1]},this.showSeconds=function(e){return!!n(e)[4]},this.showAM=function(e){return!!n(e)[5]},this.formatDate=function(e,n,a,o){return t(e,n,o)}}]),angular.module('mgcrea.ngStrap.helpers.dateParser',[]).provider('$dateParser',['$localeProvider',function(e){function t(){this.year=1970,this.month=0,this.day=1,this.hours=0,this.minutes=0,this.seconds=0,this.milliseconds=0}function n(){}function a(e){return!isNaN(parseFloat(e))&&isFinite(e)}function o(e,t){for(var n=e.length,a=t.toString().toLowerCase(),o=0;n>o;o++)if(e[o].toLowerCase()===a)return o;return-1}t.prototype.setMilliseconds=function(e){this.milliseconds=e},t.prototype.setSeconds=function(e){this.seconds=e},t.prototype.setMinutes=function(e){this.minutes=e},t.prototype.setHours=function(e){this.hours=e},t.prototype.getHours=function(){return this.hours},t.prototype.setDate=function(e){this.day=e},t.prototype.setMonth=function(e){this.month=e},t.prototype.setFullYear=function(e){this.year=e},t.prototype.fromDate=function(e){return this.year=e.getFullYear(),this.month=e.getMonth(),this.day=e.getDate(),this.hours=e.getHours(),this.minutes=e.getMinutes(),this.seconds=e.getSeconds(),this.milliseconds=e.getMilliseconds(),this},t.prototype.toDate=function(){return new Date(this.year,this.month,this.day,this.hours,this.minutes,this.seconds,this.milliseconds)};var i=t.prototype,r=this.defaults={format:'shortDate',strict:!1};this.$get=['$locale','dateFilter',function(e,s){var l=function(l){function u(e){var t,n=Object.keys(h),a=[],o=[],i=e;for(t=0;t<n.length;t++)if(e.split(n[t]).length>1){var r=i.search(n[t]);e=e.split(n[t]).join(''),h[n[t]]&&(a[r]=h[n[t]])}return angular.forEach(a,function(e){e&&o.push(e)}),o}function c(e){return e.replace(/\//g,'[\\/]').replace('/-/g','[-]').replace(/\./g,'[.]').replace(/\\s/g,'[\\s]')}function d(e){var t,n=Object.keys($),a=e;for(t=0;t<n.length;t++)a=a.split(n[t]).join('${'+t+'}');for(t=0;t<n.length;t++)a=a.split('${'+t+'}').join('('+$[n[t]]+')');return e=c(e),new RegExp('^'+a+'$',['i'])}var f,p,g=angular.extend({},r,l),m={},$={sss:'[0-9]{3}',ss:'[0-5][0-9]',s:g.strict?'[1-5]?[0-9]':'[0-9]|[0-5][0-9]',mm:'[0-5][0-9]',m:g.strict?'[1-5]?[0-9]':'[0-9]|[0-5][0-9]',HH:'[01][0-9]|2[0-3]',H:g.strict?'1?[0-9]|2[0-3]':'[01]?[0-9]|2[0-3]',hh:'[0][1-9]|[1][012]',h:g.strict?'[1-9]|1[012]':'0?[1-9]|1[012]',a:'AM|PM',EEEE:e.DATETIME_FORMATS.DAY.join('|'),EEE:e.DATETIME_FORMATS.SHORTDAY.join('|'),dd:'0[1-9]|[12][0-9]|3[01]',d:g.strict?'[1-9]|[1-2][0-9]|3[01]':'0?[1-9]|[1-2][0-9]|3[01]',MMMM:e.DATETIME_FORMATS.MONTH.join('|'),MMM:e.DATETIME_FORMATS.SHORTMONTH.join('|'),MM:'0[1-9]|1[012]',M:g.strict?'[1-9]|1[012]':'0?[1-9]|1[012]',yyyy:'[1]{1}[0-9]{3}|[2]{1}[0-9]{3}',yy:'[0-9]{2}',y:g.strict?'-?(0|[1-9][0-9]{0,3})':'-?0*[0-9]{1,4}'},h={sss:i.setMilliseconds,ss:i.setSeconds,s:i.setSeconds,mm:i.setMinutes,m:i.setMinutes,HH:i.setHours,H:i.setHours,hh:i.setHours,h:i.setHours,EEEE:n,EEE:n,dd:i.setDate,d:i.setDate,a:function(e){var t=this.getHours()%12;return this.setHours(e.match(/pm/i)?t+12:t)},MMMM:function(t){return this.setMonth(o(e.DATETIME_FORMATS.MONTH,t))},MMM:function(t){return this.setMonth(o(e.DATETIME_FORMATS.SHORTMONTH,t))},MM:function(e){return this.setMonth(1*e-1)},M:function(e){return this.setMonth(1*e-1)},yyyy:i.setFullYear,yy:function(e){return this.setFullYear(2e3+1*e)},y:function(e){return this.setFullYear(50>=1*e&&2===e.length?2e3+1*e:1*e)}};return m.init=function(){m.$format=e.DATETIME_FORMATS[g.format]||g.format,f=d(m.$format),p=u(m.$format)},m.isValid=function(e){return angular.isDate(e)?!isNaN(e.getTime()):f.test(e)},m.parse=function(n,a,o,i){o&&(o=e.DATETIME_FORMATS[o]||o),angular.isDate(n)&&(n=s(n,o||m.$format,i));var r=o?d(o):f,l=o?u(o):p,c=r.exec(n);if(!c)return!1;for(var g=(new t).fromDate(a&&!isNaN(a.getTime())?a:new Date(1970,0,1,0)),$=0;$<c.length-1;$++)l[$]&&l[$].call(g,c[$+1]);var h=g.toDate();return parseInt(g.day,10)!==h.getDate()?!1:h},m.getDateForAttribute=function(e,t){var n;if('today'===t){var o=new Date;n=new Date(o.getFullYear(),o.getMonth(),o.getDate()+('maxDate'===e?1:0),0,0,0,'minDate'===e?0:-1)}else n=angular.isString(t)&&t.match(/^".+"$/)?new Date(t.substr(1,t.length-2)):a(t)?new Date(parseInt(t,10)):angular.isString(t)&&0===t.length?'minDate'===e?-(1/0):+(1/0):new Date(t);return n},m.getTimeForAttribute=function(e,t){var n;return n='now'===t?(new Date).setFullYear(1970,0,1):angular.isString(t)&&t.match(/^".+"$/)?new Date(t.substr(1,t.length-2)).setFullYear(1970,0,1):a(t)?new Date(parseInt(t,10)).setFullYear(1970,0,1):angular.isString(t)&&0===t.length?'minTime'===e?-(1/0):+(1/0):m.parse(t,new Date(1970,0,1,0));

},m.daylightSavingAdjust=function(e){return e?(e.setHours(e.getHours()>12?e.getHours()+2:0),e):null},m.timezoneOffsetAdjust=function(e,t,n){return e?(t&&'UTC'===t&&(e=new Date(e.getTime()),e.setMinutes(e.getMinutes()+(n?-1:1)*e.getTimezoneOffset())),e):null},m.init(),m};return l}]}]),angular.module('mgcrea.ngStrap.helpers.debounce',[]).factory('debounce',['$timeout',function(e){return function(t,n,a){var o=null;return function(){var i=this,r=arguments,s=a&&!o;return o&&e.cancel(o),o=e(function(){o=null,a||t.apply(i,r)},n,!1),s&&t.apply(i,r),o}}}]).factory('throttle',['$timeout',function(e){return function(t,n,a){var o=null;return a||(a={}),function(){var i=this,r=arguments;o||(a.leading!==!1&&t.apply(i,r),o=e(function(){o=null,a.trailing!==!1&&t.apply(i,r)},n,!1))}}}]),angular.module('mgcrea.ngStrap.helpers.dimensions',[]).factory('dimensions',['$document','$window',function(t,n){var a=(angular.element,{}),o=a.nodeName=function(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()};a.css=function(t,n,a){var o;return o=t.currentStyle?t.currentStyle[n]:e.getComputedStyle?e.getComputedStyle(t)[n]:t.style[n],a===!0?parseFloat(o)||0:o},a.offset=function(t){var n=t.getBoundingClientRect(),a=t.ownerDocument;return{width:n.width||t.offsetWidth,height:n.height||t.offsetHeight,top:n.top+(e.pageYOffset||a.documentElement.scrollTop)-(a.documentElement.clientTop||0),left:n.left+(e.pageXOffset||a.documentElement.scrollLeft)-(a.documentElement.clientLeft||0)}},a.setOffset=function(e,t,n){var o,i,r,s,l,u,c,d=a.css(e,'position'),f=angular.element(e),p={};'static'===d&&(e.style.position='relative'),l=a.offset(e),r=a.css(e,'top'),u=a.css(e,'left'),c=('absolute'===d||'fixed'===d)&&(r+u).indexOf('auto')>-1,c?(o=a.position(e),s=o.top,i=o.left):(s=parseFloat(r)||0,i=parseFloat(u)||0),angular.isFunction(t)&&(t=t.call(e,n,l)),null!==t.top&&(p.top=t.top-l.top+s),null!==t.left&&(p.left=t.left-l.left+i),'using'in t?t.using.call(f,p):f.css({top:p.top+'px',left:p.left+'px'})},a.position=function(e){var t,n,r={top:0,left:0};return'fixed'===a.css(e,'position')?n=e.getBoundingClientRect():(t=i(e),n=a.offset(e),o(t,'html')||(r=a.offset(t)),r.top+=a.css(t,'borderTopWidth',!0),r.left+=a.css(t,'borderLeftWidth',!0)),{width:e.offsetWidth,height:e.offsetHeight,top:n.top-r.top-a.css(e,'marginTop',!0),left:n.left-r.left-a.css(e,'marginLeft',!0)}};var i=function(e){var t=e.ownerDocument,n=e.offsetParent||t;if(o(n,'#document'))return t.documentElement;for(;n&&!o(n,'html')&&'static'===a.css(n,'position');)n=n.offsetParent;return n||t.documentElement};return a.height=function(e,t){var n=e.offsetHeight;return t?n+=a.css(e,'marginTop',!0)+a.css(e,'marginBottom',!0):n-=a.css(e,'paddingTop',!0)+a.css(e,'paddingBottom',!0)+a.css(e,'borderTopWidth',!0)+a.css(e,'borderBottomWidth',!0),n},a.width=function(e,t){var n=e.offsetWidth;return t?n+=a.css(e,'marginLeft',!0)+a.css(e,'marginRight',!0):n-=a.css(e,'paddingLeft',!0)+a.css(e,'paddingRight',!0)+a.css(e,'borderLeftWidth',!0)+a.css(e,'borderRightWidth',!0),n},a}]),angular.module('mgcrea.ngStrap.helpers.parseOptions',[]).provider('$parseOptions',function(){var e=this.defaults={regexp:/^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+(.*?)(?:\s+track\s+by\s+(.*?))?$/};this.$get=['$parse','$q',function(t,n){function a(a,o){function i(e,t){return e.map(function(e,n){var a,o,i={};return i[c]=e,a=u(t,i),o=p(t,i),{label:a,value:o,index:n}})}var r={},s=angular.extend({},e,o);r.$values=[];var l,u,c,d,f,p,g;return r.init=function(){r.$match=l=a.match(s.regexp),u=t(l[2]||l[1]),c=l[4]||l[6],d=l[5],f=t(l[3]||''),p=t(l[2]?l[1]:c),g=t(l[7])},r.valuesFn=function(e,t){return n.when(g(e,t)).then(function(t){return angular.isArray(t)||(t=[]),r.$values=t.length?i(t,e):[],r.$values})},r.displayValue=function(e){var t={};return t[c]=e,u(t)},r.init(),r}return a}]}),angular.version.minor<3&&angular.version.dot<14&&angular.module('ng').factory('$$rAF',['$window','$timeout',function(e,t){var n=e.requestAnimationFrame||e.webkitRequestAnimationFrame||e.mozRequestAnimationFrame,a=e.cancelAnimationFrame||e.webkitCancelAnimationFrame||e.mozCancelAnimationFrame||e.webkitCancelRequestAnimationFrame,o=!!n,i=o?function(e){var t=n(e);return function(){a(t)}}:function(e){var n=t(e,16.66,!1);return function(){t.cancel(n)}};return i.supported=o,i}]),angular.module('mgcrea.ngStrap.modal',['mgcrea.ngStrap.core','mgcrea.ngStrap.helpers.dimensions']).provider('$modal',function(){var e=this.defaults={animation:'am-fade',backdropAnimation:'am-fade',prefixClass:'modal',prefixEvent:'modal',placement:'top',templateUrl:'modal/modal.tpl.html',template:'',contentTemplate:!1,container:!1,element:null,backdrop:!0,keyboard:!0,html:!1,show:!0};this.$get=['$window','$rootScope','$bsCompiler','$q','$templateCache','$http','$animate','$timeout','$sce','dimensions',function(n,a,o,i,r,s,l,u,c,d){function f(t){function n(){k.$emit(b.prefixEvent+'.show',y)}function i(){k.$emit(b.prefixEvent+'.hide',y),h.removeClass(b.prefixClass+'-open'),b.animation&&h.removeClass(b.prefixClass+'-with-'+b.animation)}function r(){b.backdrop&&(x.on('click',f),C.on('click',f),C.on('wheel',v))}function s(){b.backdrop&&(x.off('click',f),C.off('click',f),C.off('wheel',v))}function u(){b.keyboard&&x.on('keyup',y.$onKeyUp)}function d(){b.keyboard&&x.off('keyup',y.$onKeyUp)}function f(e){e.target===e.currentTarget&&('static'===b.backdrop?y.focus():y.hide())}function v(e){e.preventDefault()}function w(){y.$isShown&&null!==x&&(s(),d()),T&&(T.$destroy(),T=null),x&&(x.remove(),x=y.$element=null)}var y={},b=y.$options=angular.extend({},e,t),D=y.$promise=o.compile(b),k=y.$scope=b.scope&&b.scope.$new()||a.$new();b.element||b.container||(b.container='body'),y.$id=b.id||b.element&&b.element.attr('id')||'',m(['title','content'],function(e){b[e]&&(k[e]=c.trustAsHtml(b[e]))}),k.$hide=function(){k.$$postDigest(function(){y.hide()})},k.$show=function(){k.$$postDigest(function(){y.show()})},k.$toggle=function(){k.$$postDigest(function(){y.toggle()})},y.$isShown=k.$isShown=!1;var S,x,T,C=angular.element('<div class="'+b.prefixClass+'-backdrop"/>');return C.css({position:'fixed',top:'0px',left:'0px',bottom:'0px',right:'0px','z-index':1038}),D.then(function(e){S=e,y.init()}),y.init=function(){b.show&&k.$$postDigest(function(){y.show()})},y.destroy=function(){w(),C&&(C.remove(),C=null),k.$destroy()},y.show=function(){if(!y.$isShown){var e,t;if(angular.isElement(b.container)?(e=b.container,t=b.container[0].lastChild?angular.element(b.container[0].lastChild):null):b.container?(e=g(b.container),t=e[0]&&e[0].lastChild?angular.element(e[0].lastChild):null):(e=null,t=b.element),x&&w(),T=y.$scope.$new(),x=y.$element=S.link(T,function(e,t){}),!k.$emit(b.prefixEvent+'.show.before',y).defaultPrevented){x.css({display:'block'}).addClass(b.placement),b.animation&&(b.backdrop&&C.addClass(b.backdropAnimation),x.addClass(b.animation)),b.backdrop&&l.enter(C,h,null),angular.version.minor<=2?l.enter(x,e,t,n):l.enter(x,e,t).then(n),y.$isShown=k.$isShown=!0,p(k);var a=x[0];$(function(){a.focus()}),h.addClass(b.prefixClass+'-open'),b.animation&&h.addClass(b.prefixClass+'-with-'+b.animation),r(),u()}}},y.hide=function(){y.$isShown&&(k.$emit(b.prefixEvent+'.hide.before',y).defaultPrevented||(angular.version.minor<=2?l.leave(x,i):l.leave(x).then(i),b.backdrop&&l.leave(C),y.$isShown=k.$isShown=!1,p(k),s(),d()))},y.toggle=function(){y.$isShown?y.hide():y.show()},y.focus=function(){x[0].focus()},y.$onKeyUp=function(e){27===e.which&&y.$isShown&&(y.hide(),e.stopPropagation())},y}function p(e){e.$$phase||e.$root&&e.$root.$$phase||e.$digest()}function g(e,n){return angular.element((n||t).querySelectorAll(e))}var m=angular.forEach,$=(String.prototype.trim,n.requestAnimationFrame||n.setTimeout),h=angular.element(n.document.body);return f}]}).directive('bsModal',['$window','$sce','$modal',function(e,t,n){return{restrict:'EAC',scope:!0,link:function(e,a,o,i){var r={scope:e,element:a,show:!1};angular.forEach(['template','templateUrl','controller','controllerAs','contentTemplate','controller','placement','backdrop','keyboard','html','container','animation','id','prefixEvent','prefixClass'],function(e){angular.isDefined(o[e])&&(r[e]=o[e])});var s=/^(false|0|)$/i;angular.forEach(['backdrop','keyboard','html','container'],function(e){angular.isDefined(o[e])&&s.test(o[e])&&(r[e]=!1)}),angular.forEach(['title','content'],function(n){o[n]&&o.$observe(n,function(a,o){e[n]=t.trustAsHtml(a)})}),o.bsModal&&e.$watch(o.bsModal,function(t,n){angular.isObject(t)?angular.extend(e,t):e.content=t},!0);var l=n(r);a.on(o.trigger||'click',l.toggle),e.$on('$destroy',function(){l&&l.destroy(),r=null,l=null})}}}]),angular.module('mgcrea.ngStrap.navbar',[]).provider('$navbar',function(){var e=this.defaults={activeClass:'active',routeAttr:'data-match-route',strict:!1};this.$get=function(){return{defaults:e}}}).directive('bsNavbar',['$window','$location','$navbar',function(e,t,n){var a=n.defaults;return{restrict:'A',link:function(e,n,o,i){var r=angular.copy(a);angular.forEach(Object.keys(a),function(e){angular.isDefined(o[e])&&(r[e]=o[e])}),e.$watch(function(){return t.path()},function(e,t){var a=n[0].querySelectorAll('li['+r.routeAttr+']');angular.forEach(a,function(t){var n=angular.element(t),a=n.attr(r.routeAttr).replace('/','\\/');r.strict&&(a='^'+a+'$');var o=new RegExp(a,'i');o.test(e)?n.addClass(r.activeClass):n.removeClass(r.activeClass)})})}}}]),angular.module('mgcrea.ngStrap.popover',['mgcrea.ngStrap.tooltip']).provider('$popover',function(){var e=this.defaults={animation:'am-fade',customClass:'',container:!1,target:!1,placement:'right',templateUrl:'popover/popover.tpl.html',contentTemplate:!1,trigger:'click',keyboard:!0,html:!1,title:'',content:'',delay:0,autoClose:!1};this.$get=['$tooltip',function(t){function n(n,a){var o=angular.extend({},e,a),i=t(n,o);return o.content&&(i.$scope.content=o.content),i}return n}]}).directive('bsPopover',['$window','$sce','$popover',function(e,t,n){var a=e.requestAnimationFrame||e.setTimeout;return{restrict:'EAC',scope:!0,link:function(e,o,i){var r={scope:e};angular.forEach(['template','templateUrl','controller','controllerAs','contentTemplate','placement','container','delay','trigger','html','animation','customClass','autoClose','id','prefixClass','prefixEvent'],function(e){angular.isDefined(i[e])&&(r[e]=i[e])});var s=/^(false|0|)$/i;angular.forEach(['html','container','autoClose'],function(e){angular.isDefined(i[e])&&s.test(i[e])&&(r[e]=!1)});var l=o.attr('data-target');angular.isDefined(l)&&(r.target=s.test(l)?!1:l),angular.forEach(['title','content'],function(n){i[n]&&i.$observe(n,function(o,i){e[n]=t.trustAsHtml(o),angular.isDefined(i)&&a(function(){u&&u.$applyPlacement()})})}),i.bsPopover&&e.$watch(i.bsPopover,function(t,n){angular.isObject(t)?angular.extend(e,t):e.content=t,angular.isDefined(n)&&a(function(){u&&u.$applyPlacement()})},!0),i.bsShow&&e.$watch(i.bsShow,function(e,t){u&&angular.isDefined(e)&&(angular.isString(e)&&(e=!!e.match(/true|,?(popover),?/i)),e===!0?u.show():u.hide())}),i.viewport&&e.$watch(i.viewport,function(e){u&&angular.isDefined(e)&&u.setViewport(e)});var u=n(o,r);e.$on('$destroy',function(){u&&u.destroy(),r=null,u=null})}}}]),angular.module('mgcrea.ngStrap.scrollspy',['mgcrea.ngStrap.helpers.debounce','mgcrea.ngStrap.helpers.dimensions']).provider('$scrollspy',function(){var e=this.$$spies={},n=this.defaults={debounce:150,throttle:100,offset:100};this.$get=['$window','$document','$rootScope','dimensions','debounce','throttle',function(a,o,i,r,s,l){function u(e,t){return e[0].nodeName&&e[0].nodeName.toLowerCase()===t.toLowerCase()}function c(o){var c=angular.extend({},n,o);c.element||(c.element=p);var g=u(c.element,'body'),m=g?d:c.element,$=g?'window':c.id;if(e[$])return e[$].$$count++,e[$];var h,v,w,y,b,D,k,S,x={},T=x.$trackedElements=[],C=[];return x.init=function(){this.$$count=1,y=s(this.checkPosition,c.debounce),b=l(this.checkPosition,c.throttle),m.on('click',this.checkPositionWithEventLoop),d.on('resize',y),m.on('scroll',b),D=s(this.checkOffsets,c.debounce),h=i.$on('$viewContentLoaded',D),v=i.$on('$includeContentLoaded',D),D(),$&&(e[$]=x)},x.destroy=function(){this.$$count--,this.$$count>0||(m.off('click',this.checkPositionWithEventLoop),d.off('resize',y),m.off('scroll',b),h(),v(),$&&delete e[$])},x.checkPosition=function(){if(C.length){if(S=(g?a.pageYOffset:m.prop('scrollTop'))||0,k=Math.max(a.innerHeight,f.prop('clientHeight')),S<C[0].offsetTop&&w!==C[0].target)return x.$activateElement(C[0]);for(var e=C.length;e--;)if(!angular.isUndefined(C[e].offsetTop)&&null!==C[e].offsetTop&&w!==C[e].target&&!(S<C[e].offsetTop||C[e+1]&&S>C[e+1].offsetTop))return x.$activateElement(C[e])}},x.checkPositionWithEventLoop=function(){setTimeout(x.checkPosition,1)},x.$activateElement=function(e){if(w){var t=x.$getTrackedElement(w);t&&(t.source.removeClass('active'),u(t.source,'li')&&u(t.source.parent().parent(),'li')&&t.source.parent().parent().removeClass('active'))}w=e.target,e.source.addClass('active'),u(e.source,'li')&&u(e.source.parent().parent(),'li')&&e.source.parent().parent().addClass('active')},x.$getTrackedElement=function(e){return T.filter(function(t){return t.target===e})[0]},x.checkOffsets=function(){angular.forEach(T,function(e){var n=t.querySelector(e.target);e.offsetTop=n?r.offset(n).top:null,c.offset&&null!==e.offsetTop&&(e.offsetTop-=1*c.offset)}),C=T.filter(function(e){return null!==e.offsetTop}).sort(function(e,t){return e.offsetTop-t.offsetTop}),y()},x.trackElement=function(e,t){T.push({target:e,source:t})},x.untrackElement=function(e,t){for(var n,a=T.length;a--;)if(T[a].target===e&&T[a].source===t){n=a;break}T=T.splice(n,1)},x.activate=function(e){T[e].addClass('active')},x.init(),x}var d=angular.element(a),f=angular.element(o.prop('documentElement')),p=angular.element(a.document.body);return c}]}).directive('bsScrollspy',['$rootScope','debounce','dimensions','$scrollspy',function(e,t,n,a){return{restrict:'EAC',link:function(e,t,n){var o={scope:e};angular.forEach(['offset','target'],function(e){angular.isDefined(n[e])&&(o[e]=n[e])});var i=a(o);i.trackElement(o.target,t),e.$on('$destroy',function(){i&&(i.untrackElement(o.target,t),i.destroy()),o=null,i=null})}}}]).directive('bsScrollspyList',['$rootScope','debounce','dimensions','$scrollspy',function(e,t,n,a){return{restrict:'A',compile:function(e,t){var n=e[0].querySelectorAll('li > a[href]');angular.forEach(n,function(e){var t=angular.element(e);t.parent().attr('bs-scrollspy','').attr('data-target',t.attr('href'))})}}}]),angular.module('mgcrea.ngStrap.select',['mgcrea.ngStrap.tooltip','mgcrea.ngStrap.helpers.parseOptions']).provider('$select',function(){var e=this.defaults={animation:'am-fade',prefixClass:'select',prefixEvent:'$select',placement:'bottom-left',templateUrl:'select/select.tpl.html',trigger:'focus',container:!1,keyboard:!0,html:!1,delay:0,multiple:!1,allNoneButtons:!1,sort:!0,caretHtml:'&nbsp;<span class="caret"></span>',placeholder:'Choose among the following...',allText:'All',noneText:'None',maxLength:3,maxLengthHtml:'selected',iconCheckmark:'glyphicon glyphicon-ok'};this.$get=['$window','$document','$rootScope','$tooltip','$timeout',function(t,n,a,o,i){function r(t,n,a){var r={},s=angular.extend({},e,a);r=o(t,s);var u=r.$scope;u.$matches=[],u.$activeIndex=s.multiple?[]:-1,u.$isMultiple=s.multiple,u.$showAllNoneButtons=s.allNoneButtons&&s.multiple,u.$iconCheckmark=s.iconCheckmark,u.$allText=s.allText,u.$noneText=s.noneText,u.$activate=function(e){u.$$postDigest(function(){r.activate(e)})},u.$select=function(e,t){u.$$postDigest(function(){r.select(e)})},u.$isVisible=function(){return r.$isVisible()},u.$isActive=function(e){return r.$isActive(e)},u.$selectAll=function(){for(var e=0;e<u.$matches.length;e++)u.$isActive(e)||u.$select(e)},u.$selectNone=function(){for(var e=0;e<u.$matches.length;e++)u.$isActive(e)&&u.$select(e)},r.update=function(e){u.$matches=e,r.$updateActiveIndex()},r.activate=function(e){return s.multiple?(r.$isActive(e)?u.$activeIndex.splice(u.$activeIndex.indexOf(e),1):u.$activeIndex.push(e),s.sort&&u.$activeIndex.sort(function(e,t){return e-t})):u.$activeIndex=e,u.$activeIndex},r.select=function(e){var t=u.$matches[e].value;u.$apply(function(){r.activate(e),s.multiple?n.$setViewValue(u.$activeIndex.map(function(e){return u.$matches[e].value})):(n.$setViewValue(t),r.hide())}),u.$emit(s.prefixEvent+'.select',t,e,r)},r.$updateActiveIndex=function(){n.$modelValue&&u.$matches.length?u.$activeIndex=s.multiple&&angular.isArray(n.$modelValue)?n.$modelValue.map(function(e){return r.$getIndex(e)}):r.$getIndex(n.$modelValue):u.$activeIndex>=u.$matches.length&&(u.$activeIndex=s.multiple?[]:0)},r.$isVisible=function(){return s.minLength&&n?u.$matches.length&&n.$viewValue.length>=s.minLength:u.$matches.length},r.$isActive=function(e){return s.multiple?-1!==u.$activeIndex.indexOf(e):u.$activeIndex===e},r.$getIndex=function(e){var t=u.$matches.length,n=t;if(t){for(n=t;n--&&u.$matches[n].value!==e;);if(!(0>n))return n}},r.$onMouseDown=function(e){if(e.preventDefault(),e.stopPropagation(),l){var t=angular.element(e.target);t.triggerHandler('click')}},r.$onKeyDown=function(e){return/(9|13|38|40)/.test(e.keyCode)?(e.preventDefault(),e.stopPropagation(),s.multiple&&9===e.keyCode?r.hide():s.multiple||13!==e.keyCode&&9!==e.keyCode?void(s.multiple||(38===e.keyCode&&u.$activeIndex>0?u.$activeIndex--:38===e.keyCode&&u.$activeIndex<0?u.$activeIndex=u.$matches.length-1:40===e.keyCode&&u.$activeIndex<u.$matches.length-1?u.$activeIndex++:angular.isUndefined(u.$activeIndex)&&(u.$activeIndex=0),u.$digest())):r.select(u.$activeIndex)):void 0};var c=r.show;r.show=function(){c(),s.multiple&&r.$element.addClass('select-multiple'),i(function(){r.$element.on(l?'touchstart':'mousedown',r.$onMouseDown),s.keyboard&&t.on('keydown',r.$onKeyDown)},0,!1)};var d=r.hide;return r.hide=function(){s.multiple||n.$modelValue||(u.$activeIndex=-1),r.$element.off(l?'touchstart':'mousedown',r.$onMouseDown),s.keyboard&&t.off('keydown',r.$onKeyDown),d(!0)},r}var s=(angular.element(t.document.body),/(ip(a|o)d|iphone|android)/gi.test(t.navigator.userAgent)),l='createTouch'in t.document&&s;return r.defaults=e,r}]}).directive('bsSelect',['$window','$parse','$q','$select','$parseOptions',function(e,t,n,a,o){var i=a.defaults;return{restrict:'EAC',require:'ngModel',link:function(e,t,n,r){var s={scope:e,placeholder:i.placeholder};angular.forEach(['template','templateUrl','controller','controllerAs','placement','container','delay','trigger','keyboard','html','animation','placeholder','allNoneButtons','maxLength','maxLengthHtml','allText','noneText','iconCheckmark','autoClose','id','sort','caretHtml','prefixClass','prefixEvent'],function(e){angular.isDefined(n[e])&&(s[e]=n[e])});var l=/^(false|0|)$/i;angular.forEach(['html','container','allNoneButtons','sort'],function(e){angular.isDefined(n[e])&&l.test(n[e])&&(s[e]=!1)});var u=t.attr('data-multiple');if(angular.isDefined(u)&&(s.multiple=l.test(u)?!1:u),'select'===t[0].nodeName.toLowerCase()){var c=t;c.css('display','none'),t=angular.element('<button type="button" class="btn btn-default"></button>'),c.after(t)}var d=o(n.bsOptions),f=a(t,r,s),p=d.$match[7].replace(/\|.+/,'').trim();e.$watchCollection(p,function(t,n){d.valuesFn(e,r).then(function(e){f.update(e),r.$render()})}),e.$watch(n.ngModel,function(e,t){f.$updateActiveIndex(),r.$render()},!0),r.$render=function(){var e,n;s.multiple&&angular.isArray(r.$modelValue)?(e=r.$modelValue.map(function(e){return n=f.$getIndex(e),angular.isDefined(n)?f.$scope.$matches[n].label:!1}).filter(angular.isDefined),e=e.length>(s.maxLength||i.maxLength)?e.length+' '+(s.maxLengthHtml||i.maxLengthHtml):e.join(', ')):(n=f.$getIndex(r.$modelValue),e=angular.isDefined(n)?f.$scope.$matches[n].label:!1),t.html((e?e:s.placeholder)+(s.caretHtml?s.caretHtml:i.caretHtml))},s.multiple&&(r.$isEmpty=function(e){return!e||0===e.length}),e.$on('$destroy',function(){f&&f.destroy(),s=null,f=null})}}}]),angular.module('mgcrea.ngStrap.timepicker',['mgcrea.ngStrap.helpers.dateParser','mgcrea.ngStrap.helpers.dateFormatter','mgcrea.ngStrap.tooltip']).provider('$timepicker',function(){var e=this.defaults={animation:'am-fade',prefixClass:'timepicker',placement:'bottom-left',templateUrl:'timepicker/timepicker.tpl.html',trigger:'focus',container:!1,keyboard:!0,html:!1,delay:0,useNative:!0,timeType:'date',timeFormat:'shortTime',timezone:null,modelTimeFormat:null,autoclose:!1,minTime:-(1/0),maxTime:+(1/0),length:5,hourStep:1,minuteStep:5,secondStep:5,roundDisplay:!1,iconUp:'glyphicon glyphicon-chevron-up',iconDown:'glyphicon glyphicon-chevron-down',arrowBehavior:'pager'};this.$get=['$window','$document','$rootScope','$sce','$dateFormatter','$tooltip','$timeout',function(t,n,a,o,i,r,s){function l(t,n,a){function o(e){var t=6e4*g.minuteStep;return new Date(Math.floor(e.getTime()/t)*t)}function l(e,n){var a=e+n;if(t[0].createTextRange){var o=t[0].createTextRange();o.collapse(!0),o.moveStart('character',e),o.moveEnd('character',a),o.select()}else t[0].setSelectionRange?t[0].setSelectionRange(e,a):angular.isUndefined(t[0].selectionStart)&&(t[0].selectionStart=e,t[0].selectionEnd=a)}function d(){t[0].focus()}var f=r(t,angular.extend({},e,a)),p=a.scope,g=f.$options,m=f.$scope,$=g.lang,h=function(e,t,n){return i.formatDate(e,t,$,n)},v=0,w=g.roundDisplay?o(new Date):new Date,y=n.$dateValue||w,b={hour:y.getHours(),meridian:y.getHours()<12,minute:y.getMinutes(),second:y.getSeconds(),millisecond:y.getMilliseconds()},D=i.getDatetimeFormat(g.timeFormat,$),k=i.hoursFormat(D),S=i.timeSeparator(D),x=i.minutesFormat(D),T=i.secondsFormat(D),C=i.showSeconds(D),M=i.showAM(D);m.$iconUp=g.iconUp,m.$iconDown=g.iconDown,m.$select=function(e,t){f.select(e,t)},m.$moveIndex=function(e,t){f.$moveIndex(e,t)},m.$switchMeridian=function(e){f.switchMeridian(e)},f.update=function(e){angular.isDate(e)&&!isNaN(e.getTime())?(f.$date=e,angular.extend(b,{hour:e.getHours(),minute:e.getMinutes(),second:e.getSeconds(),millisecond:e.getMilliseconds()}),f.$build()):f.$isBuilt||f.$build()},f.select=function(e,t,a){(!n.$dateValue||isNaN(n.$dateValue.getTime()))&&(n.$dateValue=new Date(1970,0,1)),angular.isDate(e)||(e=new Date(e)),0===t?n.$dateValue.setHours(e.getHours()):1===t?n.$dateValue.setMinutes(e.getMinutes()):2===t&&n.$dateValue.setSeconds(e.getSeconds()),n.$setViewValue(angular.copy(n.$dateValue)),n.$render(),g.autoclose&&!a&&s(function(){f.hide(!0)})},f.switchMeridian=function(e){if(n.$dateValue&&!isNaN(n.$dateValue.getTime())){var t=(e||n.$dateValue).getHours();n.$dateValue.setHours(12>t?t+12:t-12),n.$setViewValue(angular.copy(n.$dateValue)),n.$render()}},f.$build=function(){var e,t,n=m.midIndex=parseInt(g.length/2,10),a=[];for(e=0;e<g.length;e++)t=new Date(1970,0,1,b.hour-(n-e)*g.hourStep),a.push({date:t,label:h(t,k),selected:f.$date&&f.$isSelected(t,0),disabled:f.$isDisabled(t,0)});var o,i=[];for(e=0;e<g.length;e++)o=new Date(1970,0,1,0,b.minute-(n-e)*g.minuteStep),i.push({date:o,label:h(o,x),selected:f.$date&&f.$isSelected(o,1),disabled:f.$isDisabled(o,1)});var r,s=[];for(e=0;e<g.length;e++)r=new Date(1970,0,1,0,0,b.second-(n-e)*g.secondStep),s.push({date:r,label:h(r,T),selected:f.$date&&f.$isSelected(r,2),disabled:f.$isDisabled(r,2)});var l=[];for(e=0;e<g.length;e++)l.push(C?[a[e],i[e],s[e]]:[a[e],i[e]]);m.rows=l,m.showSeconds=C,m.showAM=M,m.isAM=(f.$date||a[n].date).getHours()<12,m.timeSeparator=S,f.$isBuilt=!0},f.$isSelected=function(e,t){return f.$date?0===t?e.getHours()===f.$date.getHours():1===t?e.getMinutes()===f.$date.getMinutes():2===t?e.getSeconds()===f.$date.getSeconds():void 0:!1},f.$isDisabled=function(e,t){var n;return 0===t?n=e.getTime()+6e4*b.minute+1e3*b.second:1===t?n=e.getTime()+36e5*b.hour+1e3*b.second:2===t&&(n=e.getTime()+36e5*b.hour+6e4*b.minute),n<1*g.minTime||n>1*g.maxTime},m.$arrowAction=function(e,t){'picker'===g.arrowBehavior?f.$setTimeByStep(e,t):f.$moveIndex(e,t)},f.$setTimeByStep=function(e,t){var n=new Date(f.$date||y),a=n.getHours(),o=n.getMinutes(),i=n.getSeconds();0===t?n.setHours(a-parseInt(g.hourStep,10)*e):1===t?n.setMinutes(o-parseInt(g.minuteStep,10)*e):2===t&&n.setSeconds(i-parseInt(g.secondStep,10)*e),f.select(n,t,!0)},f.$moveIndex=function(e,t){var n;0===t?(n=new Date(1970,0,1,b.hour+e*g.length,b.minute,b.second),angular.extend(b,{hour:n.getHours()})):1===t?(n=new Date(1970,0,1,b.hour,b.minute+e*g.length*g.minuteStep,b.second),angular.extend(b,{minute:n.getMinutes()})):2===t&&(n=new Date(1970,0,1,b.hour,b.minute,b.second+e*g.length*g.secondStep),angular.extend(b,{second:n.getSeconds()})),f.$build()},f.$onMouseDown=function(e){if('input'!==e.target.nodeName.toLowerCase()&&e.preventDefault(),e.stopPropagation(),c){var t=angular.element(e.target);'button'!==t[0].nodeName.toLowerCase()&&(t=t.parent()),t.triggerHandler('click')}},f.$onKeyDown=function(e){if(/(38|37|39|40|13)/.test(e.keyCode)&&!e.shiftKey&&!e.altKey){if(e.preventDefault(),e.stopPropagation(),13===e.keyCode)return void f.hide(!0);var t=new Date(f.$date),n=t.getHours(),a=h(t,k).length,o=t.getMinutes(),i=h(t,x).length,r=t.getSeconds(),s=h(t,T).length,u=1,c=/(37|39)/.test(e.keyCode),d=2+1*C+1*M;c&&(37===e.keyCode?v=1>v?d-1:v-1:39===e.keyCode&&(v=d-1>v?v+1:0));var m=[0,a],$=0;38===e.keyCode&&($=-1),40===e.keyCode&&($=1);var w=2===v&&C,y=2===v&&!C||3===v&&C;0===v?(t.setHours(n+$*parseInt(g.hourStep,10)),a=h(t,k).length,m=[0,a]):1===v?(t.setMinutes(o+$*parseInt(g.minuteStep,10)),i=h(t,x).length,m=[a+u,i]):w?(t.setSeconds(r+$*parseInt(g.secondStep,10)),s=h(t,T).length,m=[a+u+i+u,s]):y&&(c||f.switchMeridian(),m=[a+u+i+u+(s+u)*C,2]),f.select(t,v,!0),l(m[0],m[1]),p.$digest()}};var E=f.init;f.init=function(){return u&&g.useNative?(t.prop('type','time'),void t.css('-webkit-appearance','textfield')):(c&&(t.prop('type','text'),t.attr('readonly','true'),t.on('click',d)),void E())};var A=f.destroy;f.destroy=function(){u&&g.useNative&&t.off('click',d),A()};var F=f.show;f.show=function(){!c&&t.attr('readonly')||t.attr('disabled')||(F(),s(function(){f.$element&&f.$element.on(c?'touchstart':'mousedown',f.$onMouseDown),g.keyboard&&t&&t.on('keydown',f.$onKeyDown)},0,!1))};var V=f.hide;return f.hide=function(e){f.$isShown&&(f.$element&&f.$element.off(c?'touchstart':'mousedown',f.$onMouseDown),g.keyboard&&t&&t.off('keydown',f.$onKeyDown),V(e))},f}var u=/(ip(a|o)d|iphone|android)/gi.test(t.navigator.userAgent),c='createTouch'in t.document&&u;return e.lang||(e.lang=i.getDefaultLocale()),l.defaults=e,l}]}).directive('bsTimepicker',['$window','$parse','$q','$dateFormatter','$dateParser','$timepicker',function(e,t,a,o,i,r){var s=r.defaults,l=/(ip(a|o)d|iphone|android)/gi.test(e.navigator.userAgent);return{restrict:'EAC',require:'ngModel',link:function(e,t,a,u){function c(e){if(angular.isDate(e)){var t=isNaN(f.minTime)||new Date(e.getTime()).setFullYear(1970,0,1)>=f.minTime,n=isNaN(f.maxTime)||new Date(e.getTime()).setFullYear(1970,0,1)<=f.maxTime,a=t&&n;u.$setValidity('date',a),u.$setValidity('min',t),u.$setValidity('max',n),a&&(u.$dateValue=e)}}function d(){return!u.$dateValue||isNaN(u.$dateValue.getTime())?'':$(u.$dateValue,f.timeFormat)}var f={scope:e};angular.forEach(['template','templateUrl','controller','controllerAs','placement','container','delay','trigger','keyboard','html','animation','autoclose','timeType','timeFormat','timezone','modelTimeFormat','useNative','hourStep','minuteStep','secondStep','length','arrowBehavior','iconUp','iconDown','roundDisplay','id','prefixClass','prefixEvent'],function(e){angular.isDefined(a[e])&&(f[e]=a[e])});var p=/^(false|0|)$/i;angular.forEach(['html','container','autoclose','useNative','roundDisplay'],function(e){angular.isDefined(a[e])&&p.test(a[e])&&(f[e]=!1)}),a.bsShow&&e.$watch(a.bsShow,function(e,t){g&&angular.isDefined(e)&&(angular.isString(e)&&(e=!!e.match(/true|,?(timepicker),?/i)),e===!0?g.show():g.hide())}),l&&(f.useNative||s.useNative)&&(f.timeFormat='HH:mm');var g=r(t,u,f);f=g.$options;var m=f.lang,$=function(e,t,n){return o.formatDate(e,t,m,n)},h=i({format:f.timeFormat,lang:m});angular.forEach(['minTime','maxTime'],function(e){angular.isDefined(a[e])&&a.$observe(e,function(t){g.$options[e]=h.getTimeForAttribute(e,t),!isNaN(g.$options[e])&&g.$build(),c(u.$dateValue)})}),e.$watch(a.ngModel,function(e,t){g.update(u.$dateValue)},!0),u.$parsers.unshift(function(e){var t;if(!e)return u.$setValidity('date',!0),null;var a=angular.isDate(e)?e:h.parse(e,u.$dateValue);return!a||isNaN(a.getTime())?(u.$setValidity('date',!1),n):(c(a),'string'===f.timeType?(t=h.timezoneOffsetAdjust(a,f.timezone,!0),$(t,f.modelTimeFormat||f.timeFormat)):(t=h.timezoneOffsetAdjust(u.$dateValue,f.timezone,!0),'number'===f.timeType?t.getTime():'unix'===f.timeType?t.getTime()/1e3:'iso'===f.timeType?t.toISOString():new Date(t)))}),u.$formatters.push(function(e){var t;return t=angular.isUndefined(e)||null===e?0/0:angular.isDate(e)?e:'string'===f.timeType?h.parse(e,null,f.modelTimeFormat):new Date('unix'===f.timeType?1e3*e:e),u.$dateValue=h.timezoneOffsetAdjust(t,f.timezone),d()}),u.$render=function(){t.val(d())},e.$on('$destroy',function(){g&&g.destroy(),f=null,g=null})}}}]),angular.module('mgcrea.ngStrap.tab',[]).provider('$tab',function(){var e=this.defaults={animation:'am-fade',template:'tab/tab.tpl.html',navClass:'nav-tabs',activeClass:'active'},t=this.controller=function(t,n,a){var o=this;o.$options=angular.copy(e),angular.forEach(['animation','navClass','activeClass'],function(e){angular.isDefined(a[e])&&(o.$options[e]=a[e])}),t.$navClass=o.$options.navClass,t.$activeClass=o.$options.activeClass,o.$panes=t.$panes=[],o.$activePaneChangeListeners=o.$viewChangeListeners=[],o.$push=function(e){angular.isUndefined(o.$panes.$active)&&t.$setActive(e.name||0),o.$panes.push(e)},o.$remove=function(e){var t,n=o.$panes.indexOf(e),a=o.$panes.$active;t=angular.isString(a)?o.$panes.map(function(e){return e.name}).indexOf(a):o.$panes.$active,o.$panes.splice(n,1),t>n?t--:n===t&&t===o.$panes.length&&t--,t>=0&&t<o.$panes.length?o.$setActive(o.$panes[t].name||t):o.$setActive()},o.$setActive=t.$setActive=function(e){o.$panes.$active=e,o.$activePaneChangeListeners.forEach(function(e){e()})},o.$isActive=t.$isActive=function(e,t){return o.$panes.$active===e.name||o.$panes.$active===t}};this.$get=function(){var n={};return n.defaults=e,n.controller=t,n}}).directive('bsTabs',['$window','$animate','$tab','$parse',function(e,t,n,a){var o=n.defaults;return{require:['?ngModel','bsTabs'],transclude:!0,scope:!0,controller:['$scope','$element','$attrs',n.controller],templateUrl:function(e,t){return t.template||o.template},link:function(e,t,n,o){var i=o[0],r=o[1];if(i&&(r.$activePaneChangeListeners.push(function(){i.$setViewValue(r.$panes.$active)}),i.$formatters.push(function(e){return r.$setActive(e),e})),n.bsActivePane){var s=a(n.bsActivePane);r.$activePaneChangeListeners.push(function(){s.assign(e,r.$panes.$active)}),e.$watch(n.bsActivePane,function(e,t){r.$setActive(e)},!0)}}}}]).directive('bsPane',['$window','$animate','$sce',function(e,t,n){return{require:['^?ngModel','^bsTabs'],scope:!0,link:function(e,a,o,i){function r(){var n=s.$panes.indexOf(e);t[s.$isActive(e,n)?'addClass':'removeClass'](a,s.$options.activeClass)}var s=(i[0],i[1]);a.addClass('tab-pane'),o.$observe('title',function(t,a){e.title=n.trustAsHtml(t)}),e.name=o.name,s.$options.animation&&a.addClass(s.$options.animation),o.$observe('disabled',function(t,n){e.disabled=e.$eval(t)}),s.$push(e),e.$on('$destroy',function(){s.$remove(e)}),s.$activePaneChangeListeners.push(function(){r()}),r()}}}]),angular.module('mgcrea.ngStrap.typeahead',['mgcrea.ngStrap.tooltip','mgcrea.ngStrap.helpers.parseOptions']).provider('$typeahead',function(){var e=this.defaults={animation:'am-fade',prefixClass:'typeahead',prefixEvent:'$typeahead',placement:'bottom-left',templateUrl:'typeahead/typeahead.tpl.html',trigger:'focus',container:!1,keyboard:!0,html:!1,delay:0,minLength:1,filter:'bsAsyncFilter',limit:6,autoSelect:!1,comparator:'',trimValue:!0};this.$get=['$window','$rootScope','$tooltip','$$rAF','$timeout',function(t,n,a,o,i){
function r(t,n,r){var l={},u=angular.extend({},e,r);l=a(t,u);var c=r.scope,d=l.$scope;d.$resetMatches=function(){d.$matches=[],d.$activeIndex=u.autoSelect?0:-1},d.$resetMatches(),d.$activate=function(e){d.$$postDigest(function(){l.activate(e)})},d.$select=function(e,t){d.$$postDigest(function(){l.select(e)})},d.$isVisible=function(){return l.$isVisible()},l.update=function(e){d.$matches=e,d.$activeIndex>=e.length&&(d.$activeIndex=u.autoSelect?0:-1),s(d),o(l.$applyPlacement)},l.activate=function(e){d.$activeIndex=e},l.select=function(e){if(-1!==e){var t=d.$matches[e].value;n.$setViewValue(t),n.$render(),d.$resetMatches(),c&&c.$digest(),d.$emit(u.prefixEvent+'.select',t,e,l)}},l.$isVisible=function(){return u.minLength&&n?d.$matches.length&&angular.isString(n.$viewValue)&&n.$viewValue.length>=u.minLength:!!d.$matches.length},l.$getIndex=function(e){var t=d.$matches.length,n=t;if(t){for(n=t;n--&&d.$matches[n].value!==e;);if(!(0>n))return n}},l.$onMouseDown=function(e){e.preventDefault(),e.stopPropagation()},l.$onKeyDown=function(e){/(38|40|13)/.test(e.keyCode)&&(!l.$isVisible()||13===e.keyCode&&-1===d.$activeIndex||(e.preventDefault(),e.stopPropagation()),13===e.keyCode&&d.$matches.length?l.select(d.$activeIndex):38===e.keyCode&&d.$activeIndex>0?d.$activeIndex--:40===e.keyCode&&d.$activeIndex<d.$matches.length-1?d.$activeIndex++:angular.isUndefined(d.$activeIndex)&&(d.$activeIndex=0),d.$digest())};var f=l.show;l.show=function(){f(),i(function(){l.$element&&l.$element.on('mousedown',l.$onMouseDown),u.keyboard&&t&&t.on('keydown',l.$onKeyDown)},0,!1)};var p=l.hide;return l.hide=function(){l.$element&&l.$element.off('mousedown',l.$onMouseDown),u.keyboard&&t&&t.off('keydown',l.$onKeyDown),u.autoSelect||l.activate(-1),p()},l}function s(e){e.$$phase||e.$root&&e.$root.$$phase||e.$digest()}angular.element(t.document.body);return r.defaults=e,r}]}).filter('bsAsyncFilter',['$filter',function(e){return function(t,n,a){return t&&angular.isFunction(t.then)?t.then(function(t){return e('filter')(t,n,a)}):e('filter')(t,n,a)}}]).directive('bsTypeahead',['$window','$parse','$q','$typeahead','$parseOptions',function(e,t,n,a,o){var i=a.defaults;return{restrict:'EAC',require:'ngModel',link:function(e,t,n,r){var s={scope:e};angular.forEach(['template','templateUrl','controller','controllerAs','placement','container','delay','trigger','keyboard','html','animation','filter','limit','minLength','watchOptions','selectMode','autoSelect','comparator','id','prefixEvent','prefixClass'],function(e){angular.isDefined(n[e])&&(s[e]=n[e])});var l=/^(false|0|)$/i;angular.forEach(['html','container','trimValue'],function(e){angular.isDefined(n[e])&&l.test(n[e])&&(s[e]=!1)}),t.attr('autocomplete','false');var u=s.filter||i.filter,c=s.limit||i.limit,d=s.comparator||i.comparator,f=n.bsOptions;u&&(f+=' | '+u+':$viewValue'),d&&(f+=':'+d),c&&(f+=' | limitTo:'+c);var p=o(f),g=a(t,r,s);if(s.watchOptions){var m=p.$match[7].replace(/\|.+/,'').replace(/\(.*\)/g,'').trim();e.$watchCollection(m,function(t,n){p.valuesFn(e,r).then(function(e){g.update(e),r.$render()})})}e.$watch(n.ngModel,function(t,n){e.$modelValue=t,p.valuesFn(e,r).then(function(e){if(s.selectMode&&!e.length&&t.length>0)return void r.$setViewValue(r.$viewValue.substring(0,r.$viewValue.length-1));e.length>c&&(e=e.slice(0,c));var n=g.$isVisible();n&&g.update(e),(1!==e.length||e[0].value!==t)&&(!n&&g.update(e),r.$render())})}),r.$formatters.push(function(e){var t=p.displayValue(e);return t?t:e&&'object'!=typeof e?e:''}),r.$render=function(){if(r.$isEmpty(r.$viewValue))return t.val('');var e=g.$getIndex(r.$modelValue),n=angular.isDefined(e)?g.$scope.$matches[e].label:r.$viewValue;n=angular.isObject(n)?p.displayValue(n):n;var a=n?n.toString().replace(/<(?:.|\n)*?>/gm,''):'';t.val(s.trimValue===!1?a:a.trim())},e.$on('$destroy',function(){g&&g.destroy(),s=null,g=null})}}}]),angular.module('mgcrea.ngStrap.tooltip',['mgcrea.ngStrap.core','mgcrea.ngStrap.helpers.dimensions']).provider('$tooltip',function(){var e=this.defaults={animation:'am-fade',customClass:'',prefixClass:'tooltip',prefixEvent:'tooltip',container:!1,target:!1,placement:'top',templateUrl:'tooltip/tooltip.tpl.html',template:'',contentTemplate:!1,trigger:'hover focus',keyboard:!1,html:!1,show:!1,title:'',type:'',delay:0,autoClose:!1,bsEnabled:!0,viewport:{selector:'body',padding:0}};this.$get=['$window','$rootScope','$bsCompiler','$q','$templateCache','$http','$animate','$sce','dimensions','$$rAF','$timeout',function(n,a,o,i,r,s,l,u,c,d,f){function p(i,r){function s(){P.$emit(V.prefixEvent+'.show',F)}function p(){if(P.$emit(V.prefixEvent+'.hide',F),R===j){if(z&&'focus'===V.trigger)return i[0].blur();A()}}function v(){var e=V.trigger.split(' ');angular.forEach(e,function(e){'click'===e?i.on('click',F.toggle):'manual'!==e&&(i.on('hover'===e?'mouseenter':'focus',F.enter),i.on('hover'===e?'mouseleave':'blur',F.leave),'button'===I&&'hover'!==e&&i.on($?'touchstart':'mousedown',F.$onFocusElementMouseDown))})}function w(){for(var e=V.trigger.split(' '),t=e.length;t--;){var n=e[t];'click'===n?i.off('click',F.toggle):'manual'!==n&&(i.off('hover'===n?'mouseenter':'focus',F.enter),i.off('hover'===n?'mouseleave':'blur',F.leave),'button'===I&&'hover'!==n&&i.off($?'touchstart':'mousedown',F.$onFocusElementMouseDown))}}function y(){'focus'!==V.trigger?R.on('keyup',F.$onKeyUp):i.on('keyup',F.$onFocusKeyUp)}function b(){'focus'!==V.trigger?R.off('keyup',F.$onKeyUp):i.off('keyup',F.$onFocusKeyUp)}function D(){f(function(){R.on('click',S),h.on('click',F.hide),K=!0},0,!1)}function k(){K&&(R.off('click',S),h.off('click',F.hide),K=!1)}function S(e){e.stopPropagation()}function x(e){e=e||V.target||i;var a=e[0],o='BODY'===a.tagName,r=a.getBoundingClientRect(),s={};for(var l in r)s[l]=r[l];null===s.width&&(s=angular.extend({},s,{width:r.right-r.left,height:r.bottom-r.top}));var u=o?{top:0,left:0}:c.offset(a),d={scroll:o?t.documentElement.scrollTop||t.body.scrollTop:e.prop('scrollTop')||0},f=o?{width:t.documentElement.clientWidth,height:n.innerHeight}:null;return angular.extend({},s,d,f,u)}function T(e,t,n,a){var o,i=e.split('-');switch(i[0]){case'right':o={top:t.top+t.height/2-a/2,left:t.left+t.width};break;case'bottom':o={top:t.top+t.height,left:t.left+t.width/2-n/2};break;case'left':o={top:t.top+t.height/2-a/2,left:t.left-n};break;default:o={top:t.top-a,left:t.left+t.width/2-n/2}}if(!i[1])return o;if('top'===i[0]||'bottom'===i[0])switch(i[1]){case'left':o.left=t.left;break;case'right':o.left=t.left+t.width-n}else if('left'===i[0]||'right'===i[0])switch(i[1]){case'top':o.top=t.top-a;break;case'bottom':o.top=t.top+t.height}return o}function C(e,t){var n=R[0],a=n.offsetWidth,o=n.offsetHeight,i=parseInt(c.css(n,'margin-top'),10),r=parseInt(c.css(n,'margin-left'),10);isNaN(i)&&(i=0),isNaN(r)&&(r=0),e.top=e.top+i,e.left=e.left+r,c.setOffset(n,angular.extend({using:function(e){R.css({top:Math.round(e.top)+'px',left:Math.round(e.left)+'px',right:''})}},e),0);var s=n.offsetWidth,l=n.offsetHeight;if('top'===t&&l!==o&&(e.top=e.top+o-l),!/top-left|top-right|bottom-left|bottom-right/.test(t)){var u=M(t,e,s,l);if(u.left?e.left+=u.left:e.top+=u.top,c.setOffset(n,e),/top|right|bottom|left/.test(t)){var d=/top|bottom/.test(t),f=d?2*u.left-a+s:2*u.top-o+l,p=d?'offsetWidth':'offsetHeight';E(f,n[p],d)}}}function M(e,t,n,a){var o={top:0,left:0};if(!F.$viewport)return o;var i=V.viewport&&V.viewport.padding||0,r=x(F.$viewport);if(/right|left/.test(e)){var s=t.top-i-r.scroll,l=t.top+i-r.scroll+a;s<r.top?o.top=r.top-s:l>r.top+r.height&&(o.top=r.top+r.height-l)}else{var u=t.left-i,c=t.left+i+n;u<r.left?o.left=r.left-u:c>r.right&&(o.left=r.left+r.width-c)}return o}function E(e,t,n){var a=m('.tooltip-arrow, .arrow',R[0]);a.css(n?'left':'top',50*(1-e/t)+'%').css(n?'top':'left','')}function A(){clearTimeout(H),F.$isShown&&null!==R&&(V.autoClose&&k(),V.keyboard&&b()),Y&&(Y.$destroy(),Y=null),R&&(R.remove(),R=F.$element=null)}var F={},V=F.$options=angular.extend({},e,r),O=F.$promise=o.compile(V),P=F.$scope=V.scope&&V.scope.$new()||a.$new(),I=i[0].nodeName.toLowerCase();if(V.delay&&angular.isString(V.delay)){var N=V.delay.split(',').map(parseFloat);V.delay=N.length>1?{show:N[0],hide:N[1]}:N[0]}F.$id=V.id||i.attr('id')||'',V.title&&(P.title=u.trustAsHtml(V.title)),P.$setEnabled=function(e){P.$$postDigest(function(){F.setEnabled(e)})},P.$hide=function(){P.$$postDigest(function(){F.hide()})},P.$show=function(){P.$$postDigest(function(){F.show()})},P.$toggle=function(){P.$$postDigest(function(){F.toggle()})},F.$isShown=P.$isShown=!1;var H,L,U,R,q,Y;O.then(function(e){U=e,F.init()}),F.init=function(){V.delay&&angular.isNumber(V.delay)&&(V.delay={show:V.delay,hide:V.delay}),'self'===V.container?q=i:angular.isElement(V.container)?q=V.container:V.container&&(q=m(V.container)),v(),V.target&&(V.target=angular.isElement(V.target)?V.target:m(V.target)),V.show&&P.$$postDigest(function(){'focus'===V.trigger?i[0].focus():F.show()})},F.destroy=function(){w(),A(),P.$destroy()},F.enter=function(){return clearTimeout(H),L='in',V.delay&&V.delay.show?void(H=setTimeout(function(){'in'===L&&F.show()},V.delay.show)):F.show()},F.show=function(){if(V.bsEnabled&&!F.$isShown){P.$emit(V.prefixEvent+'.show.before',F);var e,t;V.container?(e=q,t=q[0].lastChild?angular.element(q[0].lastChild):null):(e=null,t=i),R&&A(),Y=F.$scope.$new(),R=F.$element=U.link(Y,function(e,t){}),R.css({top:'-9999px',left:'-9999px',right:'auto',display:'block',visibility:'hidden'}),V.animation&&R.addClass(V.animation),V.type&&R.addClass(V.prefixClass+'-'+V.type),V.customClass&&R.addClass(V.customClass),t?t.after(R):e.prepend(R),F.$isShown=P.$isShown=!0,g(P),F.$applyPlacement(),angular.version.minor<=2?l.enter(R,e,t,s):l.enter(R,e,t).then(s),g(P),d(function(){R&&R.css({visibility:'visible'})}),V.keyboard&&('focus'!==V.trigger&&F.focus(),y()),V.autoClose&&D()}},F.leave=function(){return clearTimeout(H),L='out',V.delay&&V.delay.hide?void(H=setTimeout(function(){'out'===L&&F.hide()},V.delay.hide)):F.hide()};var z,j;F.hide=function(e){F.$isShown&&(P.$emit(V.prefixEvent+'.hide.before',F),z=e,j=R,angular.version.minor<=2?l.leave(R,p):l.leave(R).then(p),F.$isShown=P.$isShown=!1,g(P),V.keyboard&&null!==R&&b(),V.autoClose&&null!==R&&k())},F.toggle=function(){F.$isShown?F.leave():F.enter()},F.focus=function(){R[0].focus()},F.setEnabled=function(e){V.bsEnabled=e},F.setViewport=function(e){V.viewport=e},F.$applyPlacement=function(){if(R){var t=V.placement,n=/\s?auto?\s?/i,a=n.test(t);a&&(t=t.replace(n,'')||e.placement),R.addClass(V.placement);var o=x(),i=R.prop('offsetWidth'),r=R.prop('offsetHeight');if(F.$viewport=V.viewport&&m(V.viewport.selector||V.viewport),a){var s=t,l=x(F.$viewport);s.indexOf('bottom')>=0&&o.bottom+r>l.bottom?t=s.replace('bottom','top'):s.indexOf('top')>=0&&o.top-r<l.top&&(t=s.replace('top','bottom')),('right'===s||'bottom-left'===s||'top-left'===s)&&o.right+i>l.width?t='right'===s?'left':t.replace('left','right'):('left'===s||'bottom-right'===s||'top-right'===s)&&o.left-i<l.left&&(t='left'===s?'right':t.replace('right','left')),R.removeClass(s).addClass(t)}var u=T(t,o,i,r);C(u,t)}},F.$onKeyUp=function(e){27===e.which&&F.$isShown&&(F.hide(),e.stopPropagation())},F.$onFocusKeyUp=function(e){27===e.which&&(i[0].blur(),e.stopPropagation())},F.$onFocusElementMouseDown=function(e){e.preventDefault(),e.stopPropagation(),F.$isShown?i[0].blur():i[0].focus()};var K=!1;return F}function g(e){e.$$phase||e.$root&&e.$root.$$phase||e.$digest()}function m(e,n){return angular.element((n||t).querySelectorAll(e))}var $=(String.prototype.trim,'createTouch'in n.document),h=angular.element(n.document);return p}]}).directive('bsTooltip',['$window','$location','$sce','$tooltip','$$rAF',function(e,t,n,a,o){return{restrict:'EAC',scope:!0,link:function(e,t,i,r){var s={scope:e};angular.forEach(['template','templateUrl','controller','controllerAs','contentTemplate','placement','container','delay','trigger','html','animation','backdropAnimation','type','customClass','id'],function(e){angular.isDefined(i[e])&&(s[e]=i[e])});var l=/^(false|0|)$/i;angular.forEach(['html','container'],function(e){angular.isDefined(i[e])&&l.test(i[e])&&(s[e]=!1)});var u=t.attr('data-target');angular.isDefined(u)&&(s.target=l.test(u)?!1:u),e.hasOwnProperty('title')||(e.title=''),i.$observe('title',function(t){if(angular.isDefined(t)||!e.hasOwnProperty('title')){var a=e.title;e.title=n.trustAsHtml(t),angular.isDefined(a)&&o(function(){c&&c.$applyPlacement()})}}),i.bsTooltip&&e.$watch(i.bsTooltip,function(t,n){angular.isObject(t)?angular.extend(e,t):e.title=t,angular.isDefined(n)&&o(function(){c&&c.$applyPlacement()})},!0),i.bsShow&&e.$watch(i.bsShow,function(e,t){c&&angular.isDefined(e)&&(angular.isString(e)&&(e=!!e.match(/true|,?(tooltip),?/i)),e===!0?c.show():c.hide())}),i.bsEnabled&&e.$watch(i.bsEnabled,function(e,t){c&&angular.isDefined(e)&&(angular.isString(e)&&(e=!!e.match(/true|1|,?(tooltip),?/i)),c.setEnabled(e===!1?!1:!0))}),i.viewport&&e.$watch(i.viewport,function(e){c&&angular.isDefined(e)&&c.setViewport(e)});var c=a(t,s);e.$on('$destroy',function(){c&&c.destroy(),s=null,c=null})}}}])}(window,document);

},{}],4:[function(require,module,exports){
/**
 * angular-strap
 * @version v2.3.1 - 2015-07-19
 * @link http://mgcrea.github.io/angular-strap
 * @author Olivier Louvignes <olivier@mg-crea.com> (https://github.com/mgcrea)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
!function(t,e,n){'use strict';angular.module('mgcrea.ngStrap.alert').run(['$templateCache',function(t){t.put('alert/alert.tpl.html','<div class="alert" ng-class="[type ? \'alert-\' + type : null]"><button type="button" class="close" ng-if="dismissable" ng-click="$hide()">&times;</button> <strong ng-bind="title"></strong>&nbsp;<span ng-bind-html="content"></span></div>')}]),angular.module('mgcrea.ngStrap.aside').run(['$templateCache',function(t){t.put('aside/aside.tpl.html','<div class="aside" tabindex="-1" role="dialog"><div class="aside-dialog"><div class="aside-content"><div class="aside-header" ng-show="title"><button type="button" class="close" ng-click="$hide()">&times;</button><h4 class="aside-title" ng-bind="title"></h4></div><div class="aside-body" ng-bind="content"></div><div class="aside-footer"><button type="button" class="btn btn-default" ng-click="$hide()">Close</button></div></div></div></div>')}]),angular.module('mgcrea.ngStrap.datepicker').run(['$templateCache',function(t){t.put('datepicker/datepicker.tpl.html','<div class="dropdown-menu datepicker" ng-class="\'datepicker-mode-\' + $mode" style="max-width: 320px"><table style="table-layout: fixed; height: 100%; width: 100%"><thead><tr class="text-center"><th><button tabindex="-1" type="button" class="btn btn-default pull-left" ng-click="$selectPane(-1)"><i class="{{$iconLeft}}"></i></button></th><th colspan="{{ rows[0].length - 2 }}"><button tabindex="-1" type="button" class="btn btn-default btn-block text-strong" ng-click="$toggleMode()"><strong style="text-transform: capitalize" ng-bind="title"></strong></button></th><th><button tabindex="-1" type="button" class="btn btn-default pull-right" ng-click="$selectPane(+1)"><i class="{{$iconRight}}"></i></button></th></tr><tr ng-show="showLabels" ng-bind-html="labels"></tr></thead><tbody><tr ng-repeat="(i, row) in rows" height="{{ 100 / rows.length }}%"><td class="text-center" ng-repeat="(j, el) in row"><button tabindex="-1" type="button" class="btn btn-default" style="width: 100%" ng-class="{\'btn-primary\': el.selected, \'btn-info btn-today\': el.isToday && !el.selected}" ng-click="$select(el.date)" ng-disabled="el.disabled"><span ng-class="{\'text-muted\': el.muted}" ng-bind="el.label"></span></button></td></tr></tbody></table></div>')}]),angular.module('mgcrea.ngStrap.dropdown').run(['$templateCache',function(t){t.put('dropdown/dropdown.tpl.html','<ul tabindex="-1" class="dropdown-menu" role="menu"><li role="presentation" ng-class="{divider: item.divider}" ng-repeat="item in content"><a role="menuitem" tabindex="-1" ng-href="{{item.href}}" ng-if="!item.divider && item.href" target="{{item.target || \'\'}}" ng-bind="item.text"></a> <a role="menuitem" tabindex="-1" href="javascript:void(0)" ng-if="!item.divider && item.click" ng-click="$eval(item.click);$hide()" ng-bind="item.text"></a></li></ul>')}]),angular.module('mgcrea.ngStrap.modal').run(['$templateCache',function(t){t.put('modal/modal.tpl.html','<div class="modal" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header" ng-show="title"><button type="button" class="close" aria-label="Close" ng-click="$hide()"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" ng-bind="title"></h4></div><div class="modal-body" ng-bind="content"></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="$hide()">Close</button></div></div></div></div>')}]),angular.module('mgcrea.ngStrap.popover').run(['$templateCache',function(t){t.put('popover/popover.tpl.html','<div class="popover"><div class="arrow"></div><h3 class="popover-title" ng-bind="title" ng-show="title"></h3><div class="popover-content" ng-bind="content"></div></div>')}]),angular.module('mgcrea.ngStrap.select').run(['$templateCache',function(t){t.put('select/select.tpl.html','<ul tabindex="-1" class="select dropdown-menu" ng-show="$isVisible()" role="select"><li ng-if="$showAllNoneButtons"><div class="btn-group" style="margin-bottom: 5px; margin-left: 5px"><button type="button" class="btn btn-default btn-xs" ng-click="$selectAll()">{{$allText}}</button> <button type="button" class="btn btn-default btn-xs" ng-click="$selectNone()">{{$noneText}}</button></div></li><li role="presentation" ng-repeat="match in $matches" ng-class="{active: $isActive($index)}"><a style="cursor: default" role="menuitem" tabindex="-1" ng-click="$select($index, $event)"><i class="{{$iconCheckmark}} pull-right" ng-if="$isMultiple && $isActive($index)"></i> <span ng-bind="match.label"></span></a></li></ul>')}]),angular.module('mgcrea.ngStrap.timepicker').run(['$templateCache',function(t){t.put('timepicker/timepicker.tpl.html','<div class="dropdown-menu timepicker" style="min-width: 0px;width: auto"><table height="100%"><thead><tr class="text-center"><th><button tabindex="-1" type="button" class="btn btn-default pull-left" ng-click="$arrowAction(-1, 0)"><i class="{{ $iconUp }}"></i></button></th><th>&nbsp;</th><th><button tabindex="-1" type="button" class="btn btn-default pull-left" ng-click="$arrowAction(-1, 1)"><i class="{{ $iconUp }}"></i></button></th><th>&nbsp;</th><th><button ng-if="showSeconds" tabindex="-1" type="button" class="btn btn-default pull-left" ng-click="$arrowAction(-1, 2)"><i class="{{ $iconUp }}"></i></button></th></tr></thead><tbody><tr ng-repeat="(i, row) in rows"><td class="text-center"><button tabindex="-1" style="width: 100%" type="button" class="btn btn-default" ng-class="{\'btn-primary\': row[0].selected}" ng-click="$select(row[0].date, 0)" ng-disabled="row[0].disabled"><span ng-class="{\'text-muted\': row[0].muted}" ng-bind="row[0].label"></span></button></td><td><span ng-bind="i == midIndex ? timeSeparator : \' \'"></span></td><td class="text-center"><button tabindex="-1" ng-if="row[1].date" style="width: 100%" type="button" class="btn btn-default" ng-class="{\'btn-primary\': row[1].selected}" ng-click="$select(row[1].date, 1)" ng-disabled="row[1].disabled"><span ng-class="{\'text-muted\': row[1].muted}" ng-bind="row[1].label"></span></button></td><td><span ng-bind="i == midIndex ? timeSeparator : \' \'"></span></td><td class="text-center"><button tabindex="-1" ng-if="showSeconds && row[2].date" style="width: 100%" type="button" class="btn btn-default" ng-class="{\'btn-primary\': row[2].selected}" ng-click="$select(row[2].date, 2)" ng-disabled="row[2].disabled"><span ng-class="{\'text-muted\': row[2].muted}" ng-bind="row[2].label"></span></button></td><td ng-if="showAM">&nbsp;</td><td ng-if="showAM"><button tabindex="-1" ng-show="i == midIndex - !isAM * 1" style="width: 100%" type="button" ng-class="{\'btn-primary\': !!isAM}" class="btn btn-default" ng-click="$switchMeridian()" ng-disabled="el.disabled">AM</button> <button tabindex="-1" ng-show="i == midIndex + 1 - !isAM * 1" style="width: 100%" type="button" ng-class="{\'btn-primary\': !isAM}" class="btn btn-default" ng-click="$switchMeridian()" ng-disabled="el.disabled">PM</button></td></tr></tbody><tfoot><tr class="text-center"><th><button tabindex="-1" type="button" class="btn btn-default pull-left" ng-click="$arrowAction(1, 0)"><i class="{{ $iconDown }}"></i></button></th><th>&nbsp;</th><th><button tabindex="-1" type="button" class="btn btn-default pull-left" ng-click="$arrowAction(1, 1)"><i class="{{ $iconDown }}"></i></button></th><th>&nbsp;</th><th><button ng-if="showSeconds" tabindex="-1" type="button" class="btn btn-default pull-left" ng-click="$arrowAction(1, 2)"><i class="{{ $iconDown }}"></i></button></th></tr></tfoot></table></div>')}]),angular.module('mgcrea.ngStrap.tab').run(['$templateCache',function(t){t.put('tab/tab.tpl.html','<ul class="nav" ng-class="$navClass" role="tablist"><li role="presentation" ng-repeat="$pane in $panes track by $index" ng-class="[ $isActive($pane, $index) ? $activeClass : \'\', $pane.disabled ? \'disabled\' : \'\' ]"><a role="tab" data-toggle="tab" ng-click="!$pane.disabled && $setActive($pane.name || $index)" data-index="{{ $index }}" ng-bind-html="$pane.title" aria-controls="$pane.title"></a></li></ul><div ng-transclude class="tab-content"></div>')}]),angular.module('mgcrea.ngStrap.typeahead').run(['$templateCache',function(t){t.put('typeahead/typeahead.tpl.html','<ul tabindex="-1" class="typeahead dropdown-menu" ng-show="$isVisible()" role="select"><li role="presentation" ng-repeat="match in $matches" ng-class="{active: $index == $activeIndex}"><a role="menuitem" tabindex="-1" ng-click="$select($index, $event)" ng-bind="match.label"></a></li></ul>')}]),angular.module('mgcrea.ngStrap.tooltip').run(['$templateCache',function(t){t.put('tooltip/tooltip.tpl.html','<div class="tooltip in" ng-show="title"><div class="tooltip-arrow"></div><div class="tooltip-inner" ng-bind="title"></div></div>')}])}(window,document);
},{}],5:[function(require,module,exports){
/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 0.13.3 - 2015-08-09
 * License: MIT
 */
angular.module("ui.bootstrap",["ui.bootstrap.tpls","ui.bootstrap.modal"]),angular.module("ui.bootstrap.tpls",["template/modal/backdrop.html","template/modal/window.html"]),angular.module("ui.bootstrap.modal",[]).factory("$$stackedMap",function(){return{createNew:function(){var e=[];return{add:function(n,t){e.push({key:n,value:t})},get:function(n){for(var t=0;t<e.length;t++)if(n==e[t].key)return e[t]},keys:function(){for(var n=[],t=0;t<e.length;t++)n.push(e[t].key);return n},top:function(){return e[e.length-1]},remove:function(n){for(var t=-1,a=0;a<e.length;a++)if(n==e[a].key){t=a;break}return e.splice(t,1)[0]},removeTop:function(){return e.splice(e.length-1,1)[0]},length:function(){return e.length}}}}}).directive("modalBackdrop",["$animate","$injector","$modalStack",function(e,n,t){function a(n,a,r){r.modalInClass&&(o?o(a,{addClass:r.modalInClass}).start():e.addClass(a,r.modalInClass),n.$on(t.NOW_CLOSING_EVENT,function(n,t){var l=t();o?o(a,{removeClass:r.modalInClass}).start().then(l):e.removeClass(a,r.modalInClass).then(l)}))}var o=null;return n.has("$animateCss")&&(o=n.get("$animateCss")),{restrict:"EA",replace:!0,templateUrl:"template/modal/backdrop.html",compile:function(e,n){return e.addClass(n.backdropClass),a}}}]).directive("modalWindow",["$modalStack","$q","$animate","$injector",function(e,n,t,a){var o=null;return a.has("$animateCss")&&(o=a.get("$animateCss")),{restrict:"EA",scope:{index:"@"},replace:!0,transclude:!0,templateUrl:function(e,n){return n.templateUrl||"template/modal/window.html"},link:function(a,r,l){r.addClass(l.windowClass||""),a.size=l.size,a.close=function(n){var t=e.getTop();t&&t.value.backdrop&&"static"!=t.value.backdrop&&n.target===n.currentTarget&&(n.preventDefault(),n.stopPropagation(),e.dismiss(t.key,"backdrop click"))},a.$isRendered=!0;var s=n.defer();l.$observe("modalRender",function(e){"true"==e&&s.resolve()}),s.promise.then(function(){l.modalInClass&&(o?o(r,{addClass:l.modalInClass}).start():t.addClass(r,l.modalInClass),a.$on(e.NOW_CLOSING_EVENT,function(e,n){var a=n();o?o(r,{removeClass:l.modalInClass}).start().then(a):t.removeClass(r,l.modalInClass).then(a)}));var n=r[0].querySelectorAll("[autofocus]");n.length?n[0].focus():r[0].focus();var s=e.getTop();s&&e.modalRendered(s.key)})}}}]).directive("modalAnimationClass",[function(){return{compile:function(e,n){n.modalAnimation&&e.addClass(n.modalAnimationClass)}}}]).directive("modalTransclude",function(){return{link:function(e,n,t,a,o){o(e.$parent,function(e){n.empty(),n.append(e)})}}}).factory("$modalStack",["$animate","$timeout","$document","$compile","$rootScope","$q","$injector","$$stackedMap",function(e,n,t,a,o,r,l,s){function i(){for(var e=-1,n=$.keys(),t=0;t<n.length;t++)$.get(n[t]).value.backdrop&&(e=t);return e}function d(e,n){var a=t.find("body").eq(0),o=$.get(e).value;$.remove(e),u(o.modalDomEl,o.modalScope,function(){a.toggleClass(e.openedClass||g,$.length()>0)}),c(),n&&n.focus?n.focus():a.focus()}function c(){if(f&&-1==i()){var e=v;u(f,v,function(){e=null}),f=void 0,v=void 0}}function u(n,t,a){function o(){o.done||(o.done=!0,p?p(n,{event:"leave"}).start().then(function(){n.remove()}):e.leave(n),t.$destroy(),a&&a())}var l,s=null,i=function(){return l||(l=r.defer(),s=l.promise),function(){l.resolve()}};return t.$broadcast(b.NOW_CLOSING_EVENT,i),r.when(s).then(o)}function m(e,n,t){return!e.value.modalScope.$broadcast("modal.closing",n,t).defaultPrevented}var p=null;l.has("$animateCss")&&(p=l.get("$animateCss"));var f,v,h,g="modal-open",$=s.createNew(),b={NOW_CLOSING_EVENT:"modal.stack.now-closing"},C=0,k="a[href], area[href], input:not([disabled]), button:not([disabled]),select:not([disabled]), textarea:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable=true]";return o.$watch(i,function(e){v&&(v.index=e)}),t.bind("keydown",function(e){if(e.isDefaultPrevented())return e;var n=$.top();if(n&&n.value.keyboard)switch(e.which){case 27:e.preventDefault(),o.$apply(function(){b.dismiss(n.key,"escape key press")});break;case 9:b.loadFocusElementList(n);var t=!1;e.shiftKey?b.isFocusInFirstItem(e)&&(t=b.focusLastFocusableElement()):b.isFocusInLastItem(e)&&(t=b.focusFirstFocusableElement()),t&&(e.preventDefault(),e.stopPropagation())}}),b.open=function(e,n){var r=t[0].activeElement;$.add(e,{deferred:n.deferred,renderDeferred:n.renderDeferred,modalScope:n.scope,backdrop:n.backdrop,keyboard:n.keyboard,openedClass:n.openedClass});var l=t.find("body").eq(0),s=i();if(s>=0&&!f){v=o.$new(!0),v.index=s;var d=angular.element('<div modal-backdrop="modal-backdrop"></div>');d.attr("backdrop-class",n.backdropClass),n.animation&&d.attr("modal-animation","true"),f=a(d)(v),l.append(f)}var c=angular.element('<div modal-window="modal-window"></div>');c.attr({"template-url":n.windowTemplateUrl,"window-class":n.windowClass,size:n.size,index:$.length()-1,animate:"animate"}).html(n.content),n.animation&&c.attr("modal-animation","true");var u=a(c)(n.scope);$.top().value.modalDomEl=u,$.top().value.modalOpener=r,l.append(u),l.addClass(n.openedClass||g),b.clearFocusListCache()},b.close=function(e,n){var t=$.get(e);return t&&m(t,n,!0)?(t.value.modalScope.$$uibDestructionScheduled=!0,t.value.deferred.resolve(n),d(e,t.value.modalOpener),!0):!t},b.dismiss=function(e,n){var t=$.get(e);return t&&m(t,n,!1)?(t.value.modalScope.$$uibDestructionScheduled=!0,t.value.deferred.reject(n),d(e,t.value.modalOpener),!0):!t},b.dismissAll=function(e){for(var n=this.getTop();n&&this.dismiss(n.key,e);)n=this.getTop()},b.getTop=function(){return $.top()},b.modalRendered=function(e){var n=$.get(e);n&&n.value.renderDeferred.resolve()},b.focusFirstFocusableElement=function(){return h.length>0?(h[0].focus(),!0):!1},b.focusLastFocusableElement=function(){return h.length>0?(h[h.length-1].focus(),!0):!1},b.isFocusInFirstItem=function(e){return h.length>0?(e.target||e.srcElement)==h[0]:!1},b.isFocusInLastItem=function(e){return h.length>0?(e.target||e.srcElement)==h[h.length-1]:!1},b.clearFocusListCache=function(){h=[],C=0},b.loadFocusElementList=function(e){if((void 0===h||!h.length0)&&e){var n=e.value.modalDomEl;n&&n.length&&(h=n[0].querySelectorAll(k))}},b}]).provider("$modal",function(){var e={options:{animation:!0,backdrop:!0,keyboard:!0},$get:["$injector","$rootScope","$q","$templateRequest","$controller","$modalStack",function(n,t,a,o,r,l){function s(e){return e.template?a.when(e.template):o(angular.isFunction(e.templateUrl)?e.templateUrl():e.templateUrl)}function i(e){var t=[];return angular.forEach(e,function(e){angular.isFunction(e)||angular.isArray(e)?t.push(a.when(n.invoke(e))):angular.isString(e)&&t.push(a.when(n.get(e)))}),t}var d={};return d.open=function(n){var o=a.defer(),d=a.defer(),c=a.defer(),u={result:o.promise,opened:d.promise,rendered:c.promise,close:function(e){return l.close(u,e)},dismiss:function(e){return l.dismiss(u,e)}};if(n=angular.extend({},e.options,n),n.resolve=n.resolve||{},!n.template&&!n.templateUrl)throw new Error("One of template or templateUrl options is required.");var m=a.all([s(n)].concat(i(n.resolve)));return m.then(function(e){var a=(n.scope||t).$new();a.$close=u.close,a.$dismiss=u.dismiss,a.$on("$destroy",function(){a.$$uibDestructionScheduled||a.$dismiss("$uibUnscheduledDestruction")});var s,i={},d=1;n.controller&&(i.$scope=a,i.$modalInstance=u,angular.forEach(n.resolve,function(n,t){i[t]=e[d++]}),s=r(n.controller,i),n.controllerAs&&(n.bindToController&&angular.extend(s,a),a[n.controllerAs]=s)),l.open(u,{scope:a,deferred:o,renderDeferred:c,content:e[0],animation:n.animation,backdrop:n.backdrop,keyboard:n.keyboard,backdropClass:n.backdropClass,windowClass:n.windowClass,windowTemplateUrl:n.windowTemplateUrl,size:n.size,openedClass:n.openedClass})},function(e){o.reject(e)}),m.then(function(){d.resolve(!0)},function(e){d.reject(e)}),u},d}]};return e}),angular.module("template/modal/backdrop.html",[]).run(["$templateCache",function(e){e.put("template/modal/backdrop.html",'<div class="modal-backdrop"\n     modal-animation-class="fade"\n     modal-in-class="in"\n     ng-style="{\'z-index\': 1040 + (index && 1 || 0) + index*10}"\n></div>\n')}]),angular.module("template/modal/window.html",[]).run(["$templateCache",function(e){e.put("template/modal/window.html",'<div modal-render="{{$isRendered}}" tabindex="-1" role="dialog" class="modal"\n    modal-animation-class="fade"\n    modal-in-class="in"\n	ng-style="{\'z-index\': 1050 + index*10, display: \'block\'}" ng-click="close($event)">\n    <div class="modal-dialog" ng-class="size ? \'modal-\' + size : \'\'"><div class="modal-content" modal-transclude></div></div>\n</div>\n')}]);
},{}],6:[function(require,module,exports){
/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 0.13.3 - 2015-08-09
 * License: MIT
 */
angular.module("ui.bootstrap",["ui.bootstrap.modal"]),angular.module("ui.bootstrap.modal",[]).factory("$$stackedMap",function(){return{createNew:function(){var e=[];return{add:function(n,t){e.push({key:n,value:t})},get:function(n){for(var t=0;t<e.length;t++)if(n==e[t].key)return e[t]},keys:function(){for(var n=[],t=0;t<e.length;t++)n.push(e[t].key);return n},top:function(){return e[e.length-1]},remove:function(n){for(var t=-1,a=0;a<e.length;a++)if(n==e[a].key){t=a;break}return e.splice(t,1)[0]},removeTop:function(){return e.splice(e.length-1,1)[0]},length:function(){return e.length}}}}}).directive("modalBackdrop",["$animate","$injector","$modalStack",function(e,n,t){function a(n,a,r){r.modalInClass&&(o?o(a,{addClass:r.modalInClass}).start():e.addClass(a,r.modalInClass),n.$on(t.NOW_CLOSING_EVENT,function(n,t){var l=t();o?o(a,{removeClass:r.modalInClass}).start().then(l):e.removeClass(a,r.modalInClass).then(l)}))}var o=null;return n.has("$animateCss")&&(o=n.get("$animateCss")),{restrict:"EA",replace:!0,templateUrl:"template/modal/backdrop.html",compile:function(e,n){return e.addClass(n.backdropClass),a}}}]).directive("modalWindow",["$modalStack","$q","$animate","$injector",function(e,n,t,a){var o=null;return a.has("$animateCss")&&(o=a.get("$animateCss")),{restrict:"EA",scope:{index:"@"},replace:!0,transclude:!0,templateUrl:function(e,n){return n.templateUrl||"template/modal/window.html"},link:function(a,r,l){r.addClass(l.windowClass||""),a.size=l.size,a.close=function(n){var t=e.getTop();t&&t.value.backdrop&&"static"!=t.value.backdrop&&n.target===n.currentTarget&&(n.preventDefault(),n.stopPropagation(),e.dismiss(t.key,"backdrop click"))},a.$isRendered=!0;var s=n.defer();l.$observe("modalRender",function(e){"true"==e&&s.resolve()}),s.promise.then(function(){l.modalInClass&&(o?o(r,{addClass:l.modalInClass}).start():t.addClass(r,l.modalInClass),a.$on(e.NOW_CLOSING_EVENT,function(e,n){var a=n();o?o(r,{removeClass:l.modalInClass}).start().then(a):t.removeClass(r,l.modalInClass).then(a)}));var n=r[0].querySelectorAll("[autofocus]");n.length?n[0].focus():r[0].focus();var s=e.getTop();s&&e.modalRendered(s.key)})}}}]).directive("modalAnimationClass",[function(){return{compile:function(e,n){n.modalAnimation&&e.addClass(n.modalAnimationClass)}}}]).directive("modalTransclude",function(){return{link:function(e,n,t,a,o){o(e.$parent,function(e){n.empty(),n.append(e)})}}}).factory("$modalStack",["$animate","$timeout","$document","$compile","$rootScope","$q","$injector","$$stackedMap",function(e,n,t,a,o,r,l,s){function i(){for(var e=-1,n=g.keys(),t=0;t<n.length;t++)g.get(n[t]).value.backdrop&&(e=t);return e}function d(e,n){var a=t.find("body").eq(0),o=g.get(e).value;g.remove(e),u(o.modalDomEl,o.modalScope,function(){a.toggleClass(e.openedClass||$,g.length()>0)}),c(),n&&n.focus?n.focus():a.focus()}function c(){if(p&&-1==i()){var e=v;u(p,v,function(){e=null}),p=void 0,v=void 0}}function u(n,t,a){function o(){o.done||(o.done=!0,f?f(n,{event:"leave"}).start().then(function(){n.remove()}):e.leave(n),t.$destroy(),a&&a())}var l,s=null,i=function(){return l||(l=r.defer(),s=l.promise),function(){l.resolve()}};return t.$broadcast(b.NOW_CLOSING_EVENT,i),r.when(s).then(o)}function m(e,n,t){return!e.value.modalScope.$broadcast("modal.closing",n,t).defaultPrevented}var f=null;l.has("$animateCss")&&(f=l.get("$animateCss"));var p,v,h,$="modal-open",g=s.createNew(),b={NOW_CLOSING_EVENT:"modal.stack.now-closing"},C=0,k="a[href], area[href], input:not([disabled]), button:not([disabled]),select:not([disabled]), textarea:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable=true]";return o.$watch(i,function(e){v&&(v.index=e)}),t.bind("keydown",function(e){if(e.isDefaultPrevented())return e;var n=g.top();if(n&&n.value.keyboard)switch(e.which){case 27:e.preventDefault(),o.$apply(function(){b.dismiss(n.key,"escape key press")});break;case 9:b.loadFocusElementList(n);var t=!1;e.shiftKey?b.isFocusInFirstItem(e)&&(t=b.focusLastFocusableElement()):b.isFocusInLastItem(e)&&(t=b.focusFirstFocusableElement()),t&&(e.preventDefault(),e.stopPropagation())}}),b.open=function(e,n){var r=t[0].activeElement;g.add(e,{deferred:n.deferred,renderDeferred:n.renderDeferred,modalScope:n.scope,backdrop:n.backdrop,keyboard:n.keyboard,openedClass:n.openedClass});var l=t.find("body").eq(0),s=i();if(s>=0&&!p){v=o.$new(!0),v.index=s;var d=angular.element('<div modal-backdrop="modal-backdrop"></div>');d.attr("backdrop-class",n.backdropClass),n.animation&&d.attr("modal-animation","true"),p=a(d)(v),l.append(p)}var c=angular.element('<div modal-window="modal-window"></div>');c.attr({"template-url":n.windowTemplateUrl,"window-class":n.windowClass,size:n.size,index:g.length()-1,animate:"animate"}).html(n.content),n.animation&&c.attr("modal-animation","true");var u=a(c)(n.scope);g.top().value.modalDomEl=u,g.top().value.modalOpener=r,l.append(u),l.addClass(n.openedClass||$),b.clearFocusListCache()},b.close=function(e,n){var t=g.get(e);return t&&m(t,n,!0)?(t.value.modalScope.$$uibDestructionScheduled=!0,t.value.deferred.resolve(n),d(e,t.value.modalOpener),!0):!t},b.dismiss=function(e,n){var t=g.get(e);return t&&m(t,n,!1)?(t.value.modalScope.$$uibDestructionScheduled=!0,t.value.deferred.reject(n),d(e,t.value.modalOpener),!0):!t},b.dismissAll=function(e){for(var n=this.getTop();n&&this.dismiss(n.key,e);)n=this.getTop()},b.getTop=function(){return g.top()},b.modalRendered=function(e){var n=g.get(e);n&&n.value.renderDeferred.resolve()},b.focusFirstFocusableElement=function(){return h.length>0?(h[0].focus(),!0):!1},b.focusLastFocusableElement=function(){return h.length>0?(h[h.length-1].focus(),!0):!1},b.isFocusInFirstItem=function(e){return h.length>0?(e.target||e.srcElement)==h[0]:!1},b.isFocusInLastItem=function(e){return h.length>0?(e.target||e.srcElement)==h[h.length-1]:!1},b.clearFocusListCache=function(){h=[],C=0},b.loadFocusElementList=function(e){if((void 0===h||!h.length0)&&e){var n=e.value.modalDomEl;n&&n.length&&(h=n[0].querySelectorAll(k))}},b}]).provider("$modal",function(){var e={options:{animation:!0,backdrop:!0,keyboard:!0},$get:["$injector","$rootScope","$q","$templateRequest","$controller","$modalStack",function(n,t,a,o,r,l){function s(e){return e.template?a.when(e.template):o(angular.isFunction(e.templateUrl)?e.templateUrl():e.templateUrl)}function i(e){var t=[];return angular.forEach(e,function(e){angular.isFunction(e)||angular.isArray(e)?t.push(a.when(n.invoke(e))):angular.isString(e)&&t.push(a.when(n.get(e)))}),t}var d={};return d.open=function(n){var o=a.defer(),d=a.defer(),c=a.defer(),u={result:o.promise,opened:d.promise,rendered:c.promise,close:function(e){return l.close(u,e)},dismiss:function(e){return l.dismiss(u,e)}};if(n=angular.extend({},e.options,n),n.resolve=n.resolve||{},!n.template&&!n.templateUrl)throw new Error("One of template or templateUrl options is required.");var m=a.all([s(n)].concat(i(n.resolve)));return m.then(function(e){var a=(n.scope||t).$new();a.$close=u.close,a.$dismiss=u.dismiss,a.$on("$destroy",function(){a.$$uibDestructionScheduled||a.$dismiss("$uibUnscheduledDestruction")});var s,i={},d=1;n.controller&&(i.$scope=a,i.$modalInstance=u,angular.forEach(n.resolve,function(n,t){i[t]=e[d++]}),s=r(n.controller,i),n.controllerAs&&(n.bindToController&&angular.extend(s,a),a[n.controllerAs]=s)),l.open(u,{scope:a,deferred:o,renderDeferred:c,content:e[0],animation:n.animation,backdrop:n.backdrop,keyboard:n.keyboard,backdropClass:n.backdropClass,windowClass:n.windowClass,windowTemplateUrl:n.windowTemplateUrl,size:n.size,openedClass:n.openedClass})},function(e){o.reject(e)}),m.then(function(){d.resolve(!0)},function(e){d.reject(e)}),u},d}]};return e});
},{}],7:[function(require,module,exports){
/* ng-infinite-scroll - v1.2.0 - 2015-02-14 */
var mod;mod=angular.module("infinite-scroll",[]),mod.value("THROTTLE_MILLISECONDS",null),mod.directive("infiniteScroll",["$rootScope","$window","$interval","THROTTLE_MILLISECONDS",function(a,b,c,d){return{scope:{infiniteScroll:"&",infiniteScrollContainer:"=",infiniteScrollDistance:"=",infiniteScrollDisabled:"=",infiniteScrollUseDocumentBottom:"=",infiniteScrollListenForEvent:"@"},link:function(e,f,g){var h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y;return y=angular.element(b),t=null,u=null,i=null,j=null,q=!0,x=!1,w=null,p=function(a){return a=a[0]||a,isNaN(a.offsetHeight)?a.document.documentElement.clientHeight:a.offsetHeight},r=function(a){return a[0].getBoundingClientRect&&!a.css("none")?a[0].getBoundingClientRect().top+s(a):void 0},s=function(a){return a=a[0]||a,isNaN(window.pageYOffset)?a.document.documentElement.scrollTop:a.ownerDocument.defaultView.pageYOffset},o=function(){var b,c,d,g,h;return j===y?(b=p(j)+s(j[0].document.documentElement),d=r(f)+p(f)):(b=p(j),c=0,void 0!==r(j)&&(c=r(j)),d=r(f)-c+p(f)),x&&(d=p((f[0].ownerDocument||f[0].document).documentElement)),g=d-b,h=g<=p(j)*t+1,h?(i=!0,u?e.$$phase||a.$$phase?e.infiniteScroll():e.$apply(e.infiniteScroll):void 0):i=!1},v=function(a,b){var d,e,f;return f=null,e=0,d=function(){var b;return e=(new Date).getTime(),c.cancel(f),f=null,a.call(),b=null},function(){var g,h;return g=(new Date).getTime(),h=b-(g-e),0>=h?(clearTimeout(f),c.cancel(f),f=null,e=g,a.call()):f?void 0:f=c(d,h,1)}},null!=d&&(o=v(o,d)),e.$on("$destroy",function(){return j.unbind("scroll",o),null!=w?(w(),w=null):void 0}),m=function(a){return t=parseFloat(a)||0},e.$watch("infiniteScrollDistance",m),m(e.infiniteScrollDistance),l=function(a){return u=!a,u&&i?(i=!1,o()):void 0},e.$watch("infiniteScrollDisabled",l),l(e.infiniteScrollDisabled),n=function(a){return x=a},e.$watch("infiniteScrollUseDocumentBottom",n),n(e.infiniteScrollUseDocumentBottom),h=function(a){return null!=j&&j.unbind("scroll",o),j=a,null!=a?j.bind("scroll",o):void 0},h(y),e.infiniteScrollListenForEvent&&(w=a.$on(e.infiniteScrollListenForEvent,o)),k=function(a){if(null!=a&&0!==a.length){if(a instanceof HTMLElement?a=angular.element(a):"function"==typeof a.append?a=angular.element(a[a.length-1]):"string"==typeof a&&(a=angular.element(document.querySelector(a))),null!=a)return h(a);throw new Exception("invalid infinite-scroll-container attribute.")}},e.$watch("infiniteScrollContainer",k),k(e.infiniteScrollContainer||[]),null!=g.infiniteScrollParent&&h(angular.element(f.parent())),null!=g.infiniteScrollImmediateCheck&&(q=e.$eval(g.infiniteScrollImmediateCheck)),c(function(){return q?o():void 0},0,1)}}}]);
},{}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
//fgnass.github.com/spin.js#v2.0.1
!function(a,b){"object"==typeof exports?module.exports=b():"function"==typeof define&&define.amd?define(b):a.Spinner=b()}(this,function(){"use strict";function a(a,b){var c,d=document.createElement(a||"div");for(c in b)d[c]=b[c];return d}function b(a){for(var b=1,c=arguments.length;c>b;b++)a.appendChild(arguments[b]);return a}function c(a,b,c,d){var e=["opacity",b,~~(100*a),c,d].join("-"),f=.01+c/d*100,g=Math.max(1-(1-a)/b*(100-f),a),h=j.substring(0,j.indexOf("Animation")).toLowerCase(),i=h&&"-"+h+"-"||"";return l[e]||(m.insertRule("@"+i+"keyframes "+e+"{0%{opacity:"+g+"}"+f+"%{opacity:"+a+"}"+(f+.01)+"%{opacity:1}"+(f+b)%100+"%{opacity:"+a+"}100%{opacity:"+g+"}}",m.cssRules.length),l[e]=1),e}function d(a,b){var c,d,e=a.style;for(b=b.charAt(0).toUpperCase()+b.slice(1),d=0;d<k.length;d++)if(c=k[d]+b,void 0!==e[c])return c;return void 0!==e[b]?b:void 0}function e(a,b){for(var c in b)a.style[d(a,c)||c]=b[c];return a}function f(a){for(var b=1;b<arguments.length;b++){var c=arguments[b];for(var d in c)void 0===a[d]&&(a[d]=c[d])}return a}function g(a,b){return"string"==typeof a?a:a[b%a.length]}function h(a){this.opts=f(a||{},h.defaults,n)}function i(){function c(b,c){return a("<"+b+' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">',c)}m.addRule(".spin-vml","behavior:url(#default#VML)"),h.prototype.lines=function(a,d){function f(){return e(c("group",{coordsize:k+" "+k,coordorigin:-j+" "+-j}),{width:k,height:k})}function h(a,h,i){b(m,b(e(f(),{rotation:360/d.lines*a+"deg",left:~~h}),b(e(c("roundrect",{arcsize:d.corners}),{width:j,height:d.width,left:d.radius,top:-d.width>>1,filter:i}),c("fill",{color:g(d.color,a),opacity:d.opacity}),c("stroke",{opacity:0}))))}var i,j=d.length+d.width,k=2*j,l=2*-(d.width+d.length)+"px",m=e(f(),{position:"absolute",top:l,left:l});if(d.shadow)for(i=1;i<=d.lines;i++)h(i,-2,"progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");for(i=1;i<=d.lines;i++)h(i);return b(a,m)},h.prototype.opacity=function(a,b,c,d){var e=a.firstChild;d=d.shadow&&d.lines||0,e&&b+d<e.childNodes.length&&(e=e.childNodes[b+d],e=e&&e.firstChild,e=e&&e.firstChild,e&&(e.opacity=c))}}var j,k=["webkit","Moz","ms","O"],l={},m=function(){var c=a("style",{type:"text/css"});return b(document.getElementsByTagName("head")[0],c),c.sheet||c.styleSheet}(),n={lines:12,length:7,width:5,radius:10,rotate:0,corners:1,color:"#000",direction:1,speed:1,trail:100,opacity:.25,fps:20,zIndex:2e9,className:"spinner",top:"50%",left:"50%",position:"absolute"};h.defaults={},f(h.prototype,{spin:function(b){this.stop();{var c=this,d=c.opts,f=c.el=e(a(0,{className:d.className}),{position:d.position,width:0,zIndex:d.zIndex});d.radius+d.length+d.width}if(e(f,{left:d.left,top:d.top}),b&&b.insertBefore(f,b.firstChild||null),f.setAttribute("role","progressbar"),c.lines(f,c.opts),!j){var g,h=0,i=(d.lines-1)*(1-d.direction)/2,k=d.fps,l=k/d.speed,m=(1-d.opacity)/(l*d.trail/100),n=l/d.lines;!function o(){h++;for(var a=0;a<d.lines;a++)g=Math.max(1-(h+(d.lines-a)*n)%l*m,d.opacity),c.opacity(f,a*d.direction+i,g,d);c.timeout=c.el&&setTimeout(o,~~(1e3/k))}()}return c},stop:function(){var a=this.el;return a&&(clearTimeout(this.timeout),a.parentNode&&a.parentNode.removeChild(a),this.el=void 0),this},lines:function(d,f){function h(b,c){return e(a(),{position:"absolute",width:f.length+f.width+"px",height:f.width+"px",background:b,boxShadow:c,transformOrigin:"left",transform:"rotate("+~~(360/f.lines*k+f.rotate)+"deg) translate("+f.radius+"px,0)",borderRadius:(f.corners*f.width>>1)+"px"})}for(var i,k=0,l=(f.lines-1)*(1-f.direction)/2;k<f.lines;k++)i=e(a(),{position:"absolute",top:1+~(f.width/2)+"px",transform:f.hwaccel?"translate3d(0,0,0)":"",opacity:f.opacity,animation:j&&c(f.opacity,f.trail,l+k*f.direction,f.lines)+" "+1/f.speed+"s linear infinite"}),f.shadow&&b(i,e(h("#000","0 0 4px #000"),{top:"2px"})),b(d,b(i,h(g(f.color,k),"0 0 1px rgba(0,0,0,.1)")));return d},opacity:function(a,b,c){b<a.childNodes.length&&(a.childNodes[b].style.opacity=c)}});var o=e(a("group"),{behavior:"url(#default#VML)"});return!d(o,"transform")&&o.adj?i():j=d(o,"animation"),h});

},{}],10:[function(require,module,exports){
'use strict';

require('angular-ui-route');
require('angular-strap');
require('angular-strap-tpl');
require('ui-bootstrap');
require('ui-bootstrap-tpls');
require('infinit-scroll');

var app = angular.module('elyoosApp', [
    'ui.router',
    'ngSanitize',
    'ngCookies',
    'ngAnimate',
    'ngResource',
    'ngMessages',
    'ui.bootstrap',
    'mgcrea.ngStrap.select',
    'mgcrea.ngStrap.popover',
    'mgcrea.ngStrap.tooltip',
    'mgcrea.ngStrap.helpers.dimensions',
    'mgcrea.ngStrap.helpers.parseOptions',
    'infinite-scroll',
    'ngMaterial'
]);

app.constant('VERSION', require('../../package.json').version);

require('templates');

var setMaterialDesignSettings = function ($mdThemingProvider, $mdIconProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('teal')
        .accentPalette('light-green');

    $mdThemingProvider.theme('error-toast');

    $mdIconProvider.iconSet('system', 'app/img/system.svg', 24);
    $mdIconProvider.iconSet('rating', 'app/img/rating.svg', 24);
    $mdIconProvider.iconSet('nav', 'app/img/navigation.svg', 24);
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
                        templateUrl: 'app/modules/home/home.html',
                        controller: 'HomeCtrl'
                    },
                    header: {
                        templateUrl: 'app/modules/navigation/loggedInHeader.html',
                        controller: 'LoggedInHeaderCtrl'
                    }
                },
                hasNavigation: true
            })
            .state('public', {
                abstract: true,
                views: {
                    header: {templateUrl: 'app/modules/navigation/publicHeader.html'}
                }
            });

        $locationProvider.html5Mode(true);

        $httpProvider.interceptors.push(['$q', '$location', function ($q, $location) {
            return {
                'responseError': function (response) {
                    if (response.status === 401 || response.status === 403) {
                        $location.path('/login');
                    }
                    return $q.reject(response);
                }
            };
        }]);

        setMaterialDesignSettings($mdThemingProvider, $mdIconProvider);

    }]).run(['$rootScope', '$state', '$window', 'Auth', function ($rootScope, $state, $window, Auth) {
    $rootScope.$state = $state;
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
        if (!Auth.authorize(toState.isPublic)) {
            event.preventDefault();
            $state.go('login');
        } else if ($rootScope.fullScreen.show) {
            event.preventDefault();
            $rootScope.fullScreen.show = false;
            $state.go(fromState);
        } else if (!toState.isPublic) {
            if ($rootScope.isLoggedIn) {
                $rootScope.isLoggedIn();
            }
        }
    });

    //Settings for full screen detail view
    $rootScope.fullScreen = {
        show: false,
        template: ''
    };
}]);
},{"../../package.json":204,"angular-strap":3,"angular-strap-tpl":4,"angular-ui-route":2,"infinit-scroll":7,"templates":1,"ui-bootstrap":6,"ui-bootstrap-tpls":5}],11:[function(require,module,exports){
'use strict';

module.exports = ['$http', '$cookies', '$q', function ($http, $cookies, $q) {

    var currentUser = $cookies.getObject('user') || {username: undefined};

    function changeUser(user) {
        angular.extend(currentUser, user);
    }

    this.authorize = function (isPublic) {
        if (isPublic) {
            return true;
        }
        return currentUser.username !== undefined;
    };
    this.login = function (user) {
        var deferred = $q.defer();
        $http.post('/api/login', user).success(function (loggedinUser) {
            changeUser(loggedinUser);
            deferred.resolve(loggedinUser);
        }).error(deferred.reject);
        return deferred.promise;
    };
    this.logout = function () {
        var deferred = $q.defer();
        $http.post('/api/logout').success(function () {
            changeUser({
                username: undefined
            });
            $cookies.remove('user');
            deferred.resolve();
        }).error(deferred.reject);
        return deferred.promise;
    };
}];

},{}],12:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');

app.controller('LoginCtrl', require('./loginCtrl'));
app.controller('RegisterCtrl', require('./registerCtrl'));

app.factory('Register', require('./register'));

app.service('Auth', require('./auth'));

app.config(['$stateProvider', function ($stateProvider) {

    $stateProvider
        .state('public.login', {
            url: '/login',
            views: {
                'content@': {
                    templateUrl: 'app/modules/auth/login.html',
                    controller: 'LoginCtrl'
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
},{"./auth":11,"./loginCtrl":13,"./register":14,"./registerCtrl":15}],13:[function(require,module,exports){
'use strict';

module.exports = ['$scope', '$rootScope', '$state', 'Auth', 'UrlCache', function ($scope, $rootScope, $state, Auth, UrlCache) {
    $scope.login = function () {
        delete $scope.error;
        Auth.login({
            username: $scope.loginuser.email,
            password: $scope.loginuser.password
        }).then(function () {
            UrlCache.reset();
            $scope.$broadcast('elyoos.login');
            $state.go('home');
        }, function () {
            $scope.error = "Passwort oder Kennwort stimmen nicht.";
        });
    };
}];

},{}],14:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/register');
}];

},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
'use strict';

var setContactActions = function ($scope) {
    $scope.contact.actions = [
        {
            text: "Nachricht senden",
            click: "sendMessage(contact.userId, contact.name)"
        },
        {
            divider: true
        },
        {
            text: "Kontakt löschen",
            click: "deleteContact($scope)"
        },
        {
            text: "Kontakt blockieren",
            click: "blockContact($scope)"
        }
    ];
};


module.exports = {
    directiveCtrl: function () {
        return ['$scope', '$state', 'ContactUserActions', 'UrlCache',
            function ($scope, $state, ContactUserActions, UrlCache) {

                $scope.$scope = $scope;
                $scope.cacheUrl = UrlCache.cacheUrl;
                ContactUserActions.setPrivacySettings($scope);

                setContactActions($scope);

                angular.extend($scope, ContactUserActions);

                ContactUserActions.setConnectionState($scope);

                $scope.openUserDetails = function () {
                    $state.go('contact.detail', {
                        userId: $scope.contact.userId
                    });
                };
            }];
    }
};

},{}],17:[function(require,module,exports){
'use strict';

var controller = require('./contactPreviewCtrl');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                enableSelect: '@',
                contact: '=',
                statistic: '=',
                privacySettings: '=',
                numberOfContacts: '='
            },
            templateUrl: 'app/modules/contact/contactPreview/template.html',
            controller: controller.directiveCtrl()
        };
    }],
    name: 'elyContactPreview'
};

},{"./contactPreviewCtrl":16}],18:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');
var elyContactPreviewDirective = require('./directive.js');

app.directive(elyContactPreviewDirective.name, elyContactPreviewDirective.directive);

},{"./directive.js":17}],19:[function(require,module,exports){
'use strict';

var moment = require('moment');
var secondsDay = 86400;
var secondsWeek = 604800;
var secondsMonth = 2592000;

var isFirst24Hours = function ($scope, index, now) {
    if (index === 0) {
        return $scope.users.contactingUsers[index].userAdded > now - secondsDay;
    }
    return false;
};

var isTransitionDayWeek = function ($scope, index, now) {
    if (index === 0) {
        return $scope.users.contactingUsers[index].userAdded < now - secondsDay &&
            $scope.users.contactingUsers[index].userAdded > now - secondsWeek;
    }
    return $scope.users.contactingUsers[index].userAdded < now - secondsDay &&
        $scope.users.contactingUsers[index].userAdded > now - secondsWeek &&
        $scope.users.contactingUsers[index - 1].userAdded > now - secondsDay;
};

var isTransitionWeekMonth = function ($scope, index, now) {
    if (index === 0) {
        return $scope.users.contactingUsers[index].userAdded < now - secondsWeek &&
            $scope.users.contactingUsers[index].userAdded > now - secondsMonth;
    }
    return $scope.users.contactingUsers[index].userAdded < now - secondsWeek &&
        $scope.users.contactingUsers[index].userAdded > now - secondsMonth &&
        $scope.users.contactingUsers[index - 1].userAdded > now - secondsWeek;
};

var isTransitionMonthLater = function ($scope, index, now) {
    if (index === 0) {
        return $scope.users.contactingUsers[index].userAdded < now - secondsMonth;
    }
    return $scope.users.contactingUsers[index].userAdded < now - secondsMonth &&
        $scope.users.contactingUsers[index - 1].userAdded > now - secondsMonth;
};

var isTransition = function ($scope, index, now) {
    return isFirst24Hours($scope, index, now) || isTransitionDayWeek($scope, index, now) ||
        isTransitionWeekMonth($scope, index, now) || isTransitionMonthLater($scope, index, now);
};

module.exports = ['$scope', 'Contacting', 'ContactLeftNavElements', function ($scope, Contacting, ContactLeftNavElements) {

    $scope.resetCounter = 1;
    $scope.itemsPerPage = 30;

    $scope.getContacting = function (paginationNumber) {

        var skip = (paginationNumber - 1) * $scope.itemsPerPage;

        $scope.users = Contacting.get({itemsPerPage: $scope.itemsPerPage, skip: skip}, function () {
            if (paginationNumber === 1) {
                $scope.resetCounter = $scope.resetCounter + 1;
            }
        });
    };
    $scope.getContacting(1);

    $scope.$emit(ContactLeftNavElements.event, ContactLeftNavElements.elements);

    $scope.showContactingInfo = function (index) {
        var now = Math.floor(moment.utc().valueOf() / 1000);
        return isTransition($scope, index, now);
    };

    $scope.getContactingInfo = function (index) {
        var now = Math.floor(moment.utc().valueOf() / 1000);
        if (isFirst24Hours($scope, index, now)) {
            return 'In den letzten 24 Stunden';
        }
        if (isTransitionDayWeek($scope, index, now)) {
            return 'Vor mehr als 24 Stunden';
        }
        if (isTransitionWeekMonth($scope, index, now)) {
            return 'Vor mehr als eine Woche';
        }
        if (isTransitionMonthLater($scope, index, now)) {
            return 'Vor mehr als 30 Tage';
        }
    };
}];

},{"moment":8}],20:[function(require,module,exports){
'use strict';

module.exports = ['$scope', function ($scope) {

    $scope.dropdownGroupSettings = [
        {
            text: "Nachricht senden",
            href: "#"
        },
        {
            divider: true
        },
        {
            text: "Kontaktgruppe umbenennen",
            href: "#"
        }
    ];
}];

},{}],21:[function(require,module,exports){
'use strict';

module.exports = ['$scope', '$state', '$stateParams', 'ContactDetail', 'moment', 'CountryCodeConverter',
    'ContactUserActions', 'ContactLeftNavElements', 'PageRecommendationOtherUser',
    function ($scope, $state, $stateParams, ContactDetail, moment, CountryCodeConverter, ContactUserActions, ContactLeftNavElements,
              PageRecommendationOtherUser) {

        var contactDetails, numberOfExpand = 0, skipContacts = 7, contactsToAdd = 28;
        $scope.$scope = $scope;
        $scope.PageRecommendationOtherUser = PageRecommendationOtherUser;
        $scope.bookServiceParameter = {
            userId: $stateParams.userId,
            filters: 'Book'
        };
        $scope.videoServiceParameter = {
            userId: $stateParams.userId,
            filters: 'Youtube'
        };
        angular.extend($scope, ContactUserActions);

        $scope.$emit(ContactLeftNavElements.event, ContactLeftNavElements.elements);

        $scope.userId = $stateParams.userId;
        contactDetails = ContactDetail.get({
            userId: $stateParams.userId,
            skipContacts: 0,
            contactsPerPage: 7,
            mode: 'detailOfUser'
        }, function () {

            $scope.contact = contactDetails.contact;
            $scope.contact.userId = $stateParams.userId;
            $scope.statistic = contactDetails.statistic;
            $scope.privacySettings = contactDetails.privacySettings;
            $scope.numberOfContacts = contactDetails.numberOfContacts;
            $scope.numberOfSameContacts = contactDetails.numberOfSameContacts;
            $scope.contacts = contactDetails.contacts;
            if ($scope.contact.country) {
                $scope.contact.country = CountryCodeConverter.getCountry($scope.contact.country);
            }
            if ($scope.contact.birthday) {
                $scope.contact.birthday = 'Geb. ' + moment.unix($scope.contact.birthday).format('l');
            }
            ContactUserActions.setPrivacySettings($scope);
            ContactUserActions.setConnectionState($scope);
        });

        $scope.appendContacts = function () {
            var contactOfUser = ContactDetail.get({
                userId: $stateParams.userId,
                skipContacts: skipContacts,
                contactsPerPage: contactsToAdd,
                mode: 'onlyContacts'
            }, function () {
                if ($scope.contacts) {
                    numberOfExpand = numberOfExpand + 1;
                    $scope.contacts = $scope.contacts.concat(contactOfUser.contacts);
                    if (numberOfExpand === 1) {
                        skipContacts = 35;
                    } else {
                        skipContacts += contactsToAdd;
                    }
                }
            });
        };

        $scope.openUserDetails = function (userId) {
            $state.go('contact.detail', {
                userId: userId
            });
        };
    }];

},{}],22:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');

require('./contactPreview');

app.controller('MyContactCtrl', require('./myContactCtrl'));
app.controller('DetailContactCtrl', require('./detailContactCtrl'));
app.controller('ContactingCtrl', require('./contactingCtrl'));
app.controller('DescriptionCounterCtrl', require('./descriptionCounterCtrl'));


app.factory('Contact', require('./services/contact'));
app.factory('ContactDetail', require('./services/contactDetail'));
app.factory('SearchUsers', require('./services/searchUsers'));
app.factory('Contacting', require('./services/contacting'));

app.service('ContactUserActions', require('./services/userActions'));
app.service('ContactLeftNavElements', require('./services/leftNavElements'));

app.config(['$stateProvider', function ($stateProvider) {

    $stateProvider
        .state('contact', {
            abstract: true,
            url: '/contact',
            views: {
                header: {
                    templateUrl: 'app/modules/navigation/loggedInHeader.html'
                }
            }
        })
        .state('contact.myContacts', {
            url: '/myContacts',
            views: {
                'content@': {
                    templateUrl: 'app/modules/contact/myContact.html',
                    controller: 'MyContactCtrl'
                }
            },
            hasNavigation: true
        })
        .state('contact.contacting', {
            url: '/contacting',
            views: {
                'content@': {
                    templateUrl: 'app/modules/contact/contacting.html',
                    controller: 'ContactingCtrl'
                }
            },
            hasNavigation: true
        })
        .state('contact.detail', {
            url: '/details/{userId}',
            views: {
                'content@': {
                    templateUrl: 'app/modules/contact/userDetail.html',
                    controller: 'DetailContactCtrl'
                }
            },
            hasNavigation: true
        });
}]);
},{"./contactPreview":18,"./contactingCtrl":19,"./descriptionCounterCtrl":20,"./detailContactCtrl":21,"./myContactCtrl":23,"./services/contact":24,"./services/contactDetail":25,"./services/contacting":26,"./services/leftNavElements":27,"./services/searchUsers":28,"./services/userActions":29}],23:[function(require,module,exports){
'use strict';

var getRequestForSelectedTypes = function ($scope, Contact, paginationNumber) {
    var types = '', skip, users;
    angular.forEach($scope.users.statistic, function (stat) {
        if (stat.selected) {
            if (types.length === 0) {
                types = types.concat(stat.type);
            } else {
                types = types.concat(',', stat.type);
            }
        }
    });

    if (types.length > 0) {
        skip = (paginationNumber - 1) * $scope.itemsPerPage;

        users = Contact.get({
            itemsPerPage: $scope.itemsPerPage,
            skip: skip,
            types: types
        }, function () {
            $scope.users.contacts = users.contacts;
            $scope.users.contactsForPagination = users.contactsForPagination;
            $scope.isUserSearch = false;
        });
    } else {
        $scope.getContacts(1);
    }
};

module.exports = ['$scope', 'SearchUsers', 'Contact', 'ContactLeftNavElements',
    function ($scope, SearchUsers, Contact, ContactLeftNavElements) {

        $scope.help = {
            title: 'Hilfe',
            content: 'Du kannst beliebige Personen die bei Elyoos registriert sind als Kontakt ' +
            'hinzufügen. Personen welche Du als Kontakt hinzugefügt hast werden nun bei deinen ' +
            'Kontakten aufgelistet, ohne das der neue Kontakt dies bestätigen muss. Um die Sichtbarkeit ' +
            'deines Profils für die Kontakte zu definieren, werden deine Kontakte einer Privatsphären Gruppe zugeordnet. ' +
            'Mit diesen Einstellungen kannst Du festlegen, wer was von deinem Profil sehen kann.'
        };

        $scope.query = "";
        $scope.itemsPerPage = 30;
        $scope.isUserSearch = false;
        $scope.allContactsSelected = true;

        $scope.$emit(ContactLeftNavElements.event, ContactLeftNavElements.elements);

        $scope.selectedAllContacts = function () {
            $scope.getContacts(1);
        };

        $scope.selectedStatisticType = function (stat) {
            $scope.allContactsSelected = false;
            stat.selected = !stat.selected;
            getRequestForSelectedTypes($scope, Contact, 1);
        };

        $scope.paginationChanged = function (paginationNumber) {
            if ($scope.allContactsSelected) {
                $scope.getContacts(paginationNumber);
            } else {
                getRequestForSelectedTypes($scope, Contact, paginationNumber);
            }
        };

        $scope.getContacts = function (paginationNumber) {

            var skip = (paginationNumber - 1) * $scope.itemsPerPage;

            $scope.users = Contact.get({itemsPerPage: $scope.itemsPerPage, skip: skip}, function () {
                $scope.allContactsSelected = true;
                if (paginationNumber === 1) {
                    $scope.$broadcast('pagination.next.previous.reset');
                }
                $scope.isUserSearch = false;
            });
        };

        $scope.getUserSuggestion = function (searchValue) {
            if (searchValue && searchValue.trim().length > 0) {
                return SearchUsers.query({
                    search: searchValue,
                    maxItems: 7,
                    isSuggestion: true
                }).$promise;
            }
            $scope.getContacts(1);
        };

        $scope.getUser = function (searchValue) {
            var users;
            if (searchValue && searchValue.trim().length > 0) {
                users = SearchUsers.query({
                    search: searchValue,
                    maxItems: 20,
                    isSuggestion: false
                }, function () {
                    $scope.users.contacts = users;
                    $scope.isUserSearch = true;
                    $scope.allContactsSelected = false;
                    angular.forEach($scope.users.statistic, function (stat) {
                        stat.selected = false;
                    });
                });
            } else {
                $scope.getContacts(1);
            }
        };

        $scope.selectedAllContacts();
    }];

},{}],24:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {

    return $resource('/api/user/contact', null, {
        'delete': {method: 'POST', headers: {'X-HTTP-Method-Override': 'DELETE'}}
    });
}];

},{}],25:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {

    return $resource('/api/user/contact/detail', null, {});
}];

},{}],26:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {

    return $resource('/api/user/contact/contacting', null, {});
}];

},{}],27:[function(require,module,exports){
'use strict';

module.exports = [
    function () {
        this.event = 'elyoos.leftNav.changed';

        this.elements = [
            {description: 'Meine Kontakte', url: 'contact', color: '#009688', sref: 'contact.myContacts'},
            {description: 'Mich als Kontakt', url: 'contacting', color: '#FFA000', sref: 'contact.contacting'},
            {
                description: 'Kontakt Details',
                url: 'profile',
                color: '#658092',
                sref: 'contact.detail',
                onlyShowSelected: true
            },
            {description: 'Home', url: 'home', color: '#B3C833', sref: 'home'}];
    }];

},{}],28:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {

    return $resource('/api/user/contact/search');
}];

},{}],29:[function(require,module,exports){
'use strict';

var setConnectionState = function ($scope, moment) {
    if ($scope.contact.connected === 'userToContact') {
        $scope.contact.connectionImage = 'app/img/userToContact.png';
        $scope.tooltipConnectionState.title = "Du hast " + $scope.contact.name + " am "
        + moment.unix($scope.contact.contactAdded).format('lll') + " als Kontakt hinzgef\u00fcgt";
    } else if ($scope.contact.connected === 'contactToUser') {
        $scope.contact.connectionImage = 'app/img/contactToUser.png';
        $scope.tooltipConnectionState.title = "Hat Dich am " + moment.unix($scope.contact.userAdded).format('lll') +
        " als Kontakt hinzgef\u00fcgt";
    } else if ($scope.contact.connected === 'both') {
        $scope.contact.connectionImage = 'app/img/bothContact.png';
        $scope.tooltipConnectionState.title = "Ihr habt Euch beide als Kontakte. Hat Dich am "
        + moment.unix($scope.contact.userAdded).format('lll') + " als Kontakt hinzgef\u00fcgt";
    } else {
        $scope.contact.connected = 'none';
        $scope.contact.connectionImage = '#';
    }
};

var updateConnectionStateWhenModifiyContact = function ($scope, moment) {
    if ($scope.contact.connected === 'contactToUser') {
        $scope.contact.connected = 'both';
    } else {
        $scope.contact.connected = 'userToContact';
    }
    setConnectionState($scope, moment);
};

var updateConnectionStateWhenDeletingContact = function ($scope, moment) {
    if ($scope.contact.connected === 'both') {
        $scope.contact.connected = 'contactToUser';
    } else {
        $scope.contact.connected = 'none';
    }
    setConnectionState($scope, moment);
};

var getPrivacyType = function (statistics, privacyTypes) {
    var setting = null;
    if (statistics && statistics.length > 0) {
        angular.forEach(statistics, function (statistic) {
            if (!setting || setting.count < statistic.count) {
                setting = statistic;
            }
        });
        return setting.type;
    }
    return privacyTypes[0].type;
};

var setPrivacySettings = function ($scope) {
    $scope.tooltipConnectionState = {
        title: "",
        checked: false
    };
    $scope.contact.selectedPrivacySetting = $scope.contact.type;
    $scope.contact.privacySettings = $scope.privacySettings;
};

module.exports = ['$state', '$modal', 'SearchThread', 'Contact', 'moment',
    function ($state, $modal, SearchThread, Contact, moment) {

        this.setPrivacySettings = setPrivacySettings;
        this.setConnectionState = function (scope) {
            setConnectionState(scope, moment);
        };

        this.openModalUpdateType = function ($scope) {
            $scope.send = $scope.updateType;
            $scope.actionDescription = '\u00c4ndern';
            $modal({
                scope: $scope,
                title: '\u00c4nderung der Privatsph\u00e4ren Einstellung f\u00fcr ' + $scope.contact.name,
                templateUrl: 'app/modules/contact/services/userActionsModalDescription.html',
                show: true,
                placement: 'center'
            });
        };

        this.updateType = function ($scope, hide) {
            if ($scope.contact.selectedPrivacySetting) {
                var contact = Contact.save({
                    contactIds: [$scope.contact.userId],
                    mode: 'changeState',
                    description: $scope.contact.selectedPrivacySetting
                }, function () {
                    $scope.statistic = contact.statistic;
                    $scope.contact.type = $scope.contact.selectedPrivacySetting;
                    hide();
                });
            }
        };

        this.openModalAddNewContact = function ($scope) {
            $scope.send = $scope.addNewContact;
            $scope.actionDescription = 'Hinzuf\u00fcgen';
            $scope.contact.selectedPrivacySetting = getPrivacyType($scope.statistic, $scope.contact.privacySettings);
            $modal({
                scope: $scope,
                title: 'Kontakt hinzuf\u00fcgen',
                templateUrl: 'app/modules/contact/services/userActionsModalDescription.html',
                show: true,
                placement: 'center'
            });
        };

        this.addNewContact = function ($scope, hide) {
            var contact;
            if ($scope.contact.selectedPrivacySetting) {
                contact = Contact.save({
                    contactIds: [$scope.contact.userId],
                    mode: 'addContact',
                    description: $scope.contact.selectedPrivacySetting
                }, function () {
                    $scope.statistic = contact.statistic;
                    if (angular.isDefined($scope.numberOfContacts)) {
                        $scope.numberOfContacts = contact.numberOfContacts;
                    }
                    $scope.contact.type = $scope.contact.selectedPrivacySetting;
                    updateConnectionStateWhenModifiyContact($scope, moment);
                    setPrivacySettings($scope);
                    hide();
                });
            }
        };

        this.deleteContact = function ($scope) {
            var contact = Contact.delete({
                contactIds: [$scope.contact.userId]
            }, function () {
                $scope.statistic = contact.statistic;
                if (angular.isDefined($scope.numberOfContacts)) {
                    $scope.numberOfContacts = contact.numberOfContacts;
                }
                delete $scope.contact.type;
                updateConnectionStateWhenDeletingContact($scope, moment);
            });
        };

        this.blockContact = function ($scope) {
            var contact = Contact.save({
                mode: 'blockContact',
                contactIds: [$scope.contact.userId]
            }, function () {
                $scope.statistic = contact.statistic;
                if (angular.isDefined($scope.numberOfContacts)) {
                    $scope.numberOfContacts = contact.numberOfContacts;
                }
                delete $scope.contact.type;
                $scope.contact.blocked = true;
                updateConnectionStateWhenDeletingContact($scope, moment);
            });
        };

        this.unblockContact = function ($scope) {
            var contact = Contact.save({
                mode: 'unblockContact',
                contactIds: [$scope.contact.userId]
            }, function () {
                $scope.statistic = contact.statistic;
                if (angular.isDefined($scope.numberOfContacts)) {
                    $scope.numberOfContacts = contact.numberOfContacts;
                }
                delete $scope.contact.type;
                $scope.contact.blocked = false;
            });
        };

        this.sendMessage = function (id, name) {
            var search = SearchThread.get({
                userId: id
            }, function () {
                if (search.hasExistingThread) {
                    $state.go('message.threads.detail', {
                        threadId: search.threadId,
                        isGroupThread: false
                    });
                } else {
                    $state.go('message.threads.create', {
                        userId: id,
                        name: name
                    });
                }
            });
        };
    }];

},{}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
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
            templateUrl: 'app/modules/directives/expandText/template.html',
            controller: controller.directiveCtrl(),
            link: link.directiveLink()
        };
    }],
    name: 'elyExpandText'
};

},{"./controller.js":30,"./link.js":33}],32:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

},{"./directive.js":31}],33:[function(require,module,exports){
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

},{}],34:[function(require,module,exports){
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

},{}],35:[function(require,module,exports){
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
            templateUrl: 'app/modules/directives/formTextInput/template.html',
            controller: controller.directiveCtrl()
        };
    }],
    name: 'elyFormTextInput'
};

},{"./controller.js":34}],36:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"./directive.js":35,"dup":32}],37:[function(require,module,exports){
'use strict';

var link = require('./link');

module.exports = {
    directive: ['$sce', function ($sce) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/modules/directives/iframe/template.html',
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

},{"./link":39}],38:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"./directive.js":37,"dup":32}],39:[function(require,module,exports){
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

},{}],40:[function(require,module,exports){
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

},{}],41:[function(require,module,exports){
'use strict';

var controller = require('./controller');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/modules/directives/imageCropper/template.html',
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

},{"./controller":40}],42:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"./directive.js":41,"dup":32}],43:[function(require,module,exports){
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

},{}],44:[function(require,module,exports){
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
            templateUrl: 'app/modules/directives/paginationNextPrevious/template.html',
            controller: controller.directiveCtrl()
        };
    }],
    name: 'elyPaginationNextPrevious'
};

},{"./controller.js":43}],45:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"./directive.js":44,"dup":32}],46:[function(require,module,exports){
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

},{}],47:[function(require,module,exports){
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
            templateUrl: 'app/modules/directives/searchBox/template.html',
            controller: controller.directiveCtrl()
        };
    }],
    name: 'elySearchBox'
};

},{"./controller.js":46}],48:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"./directive.js":47,"dup":32}],49:[function(require,module,exports){
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

},{}],50:[function(require,module,exports){
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
            templateUrl: 'app/modules/directives/sendButton/template.html',
            controller: controller.directiveCtrl()
        };
    }],
    name: 'elySendButton'
};

},{"./controller.js":49}],51:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"./directive.js":50,"dup":32}],52:[function(require,module,exports){
'use strict';

var link = require('./link');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                size: '@'
            },
            templateUrl: 'app/modules/directives/spin/template.html',
            link: link.directiveLink()
        };
    }],
    name: 'elySpin'
};

},{"./link":54}],53:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"./directive.js":52,"dup":32}],54:[function(require,module,exports){
'use strict';

var Spinner = require('spin');

module.exports = {
    directiveLink: function () {
        return function ($scope, element) {
            var opts = {
                lines: 11,
                length: 10,
                width: 4,
                radius: 13,
                corners: 1,
                rotate: 11,
                direction: 1,
                color: '#00796B',
                speed: 1.2,
                trail: 60,
                shadow: false,
                hwaccel: false,
                className: 'spinner',
                zIndex: 2e9,
                top: '50%',
                left: '50%'
            }, spinElement, spinner;

            if ($scope.size === 'small') {
                opts.lines = 9;
                opts.length = 5;
                opts.width = 3;
                opts.radius = 4;
            }

            spinElement = element.find('#spinner-content');
            spinner = new Spinner(opts).spin();
            spinElement.append(spinner.el);
        };
    }
};

},{"spin":9}],55:[function(require,module,exports){
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

},{}],56:[function(require,module,exports){
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
            templateUrl: 'app/modules/directives/starRating/template.html',
            controller: controller.directiveCtrl()
        };
    }],
    name: 'elyStarRating'
};

},{"./controller.js":55}],57:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"./directive.js":56,"dup":32}],58:[function(require,module,exports){
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

},{}],59:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');


app.filter('fromTo', require('./fromToFilter'));
},{"./fromToFilter":58}],60:[function(require,module,exports){
'use strict';

var navigationWidth = 240;

var setContainerWidth = function ($scope) {
    var containerWidth, screenWidth = $(window).width();
    containerWidth = screenWidth - navigationWidth;
    $scope.numberOfRows = 1;
    if (containerWidth <= 950) {
        $scope.containerWidth = 450;
    } else if (containerWidth > 950 && containerWidth <= 1400) {
        $scope.containerWidth = 900;
        $scope.numberOfRows = 2;
    } else if (screenWidth > 1400) {
        $scope.containerWidth = 1350;
        $scope.numberOfRows = 3;
    }

    $scope.$applyAsync();
};

var updatePinwall = function ($scope, HomePinwall) {
    var pinwall = HomePinwall.updatePinwall();
    $scope.pinwallElements = pinwall.pinwallElements;
    $scope.userInfo = pinwall.userInfo;
};

module.exports =
    ['$scope', '$rootScope', '$stateParams', 'HomeLeftNavElements', 'HomePinwallRequest', 'HomePinwall', 'WatchRootScope',
        function ($scope, $rootScope, $stateParams, HomeLeftNavElements, HomePinwallRequest, HomePinwall, WatchRootScope) {

            $scope.$emit(HomeLeftNavElements.event, HomeLeftNavElements.elements);

            $scope.isExpanded = false;
            if ($stateParams.cache !== 'cache') {
                HomePinwallRequest.resetCache();
                HomePinwallRequest.requestPinwall().then(function () {
                    updatePinwall($scope, HomePinwall);
                });
            }

            $scope.$watch('numberOfRows', function (newNumberOfRows) {
                if (newNumberOfRows) {
                    HomePinwall.setNumberOfRows(newNumberOfRows);
                    updatePinwall($scope, HomePinwall);
                }
            });

            $scope.nextPinwallInfo = function () {
                HomePinwallRequest.requestPinwall().then(function () {
                    updatePinwall($scope, HomePinwall);
                });
            };

            $scope.$on('message.changed', function (event, newMessages) {
                HomePinwall.messageChanged(newMessages);
            });

            WatchRootScope.addRootScopeEvents($rootScope);

            $scope.elementRemoved = function (element) {
                HomePinwall.elementRemoved(element);
                updatePinwall($scope, HomePinwall);
            };

            $scope.blogAdded = function (blog) {
                HomePinwall.blogAdded(blog);
                updatePinwall($scope, HomePinwall);
            };

            $(window).resize(function () {
                setContainerWidth($scope);
            });

            setContainerWidth($scope);
        }];

},{}],61:[function(require,module,exports){
'use strict';

var isSendBlogAllowed = function (selectedPrivacyType, blogText, selectPublic, imageLoading) {
    if (!imageLoading) {
        if ((blogText && selectPublic) || (selectedPrivacyType && selectedPrivacyType.length > 0 && blogText)) {
            return blogText.trim() !== '';
        }
    }
    return false;
};

var closeBlog = function ($scope, FileReader) {
    FileReader.abort();
    $scope.selectPublic = true;
    $scope.imageForUploadPreviewStart = false;
    $scope.imageForUploadPreview = null;
    $scope.imageForUpload = null;
    $scope.imageForUploadPreviewData = null;
    $scope.user.blogText = '';
};

module.exports = ['$scope', 'FileReader', 'fileUpload', 'FileReaderUtil', function ($scope, FileReader, fileUpload, FileReaderUtil) {
    $scope.selectPublic = true;
    $scope.sendBlogAllowed = false;

    $scope.$watch('imageForUpload', function (newImage) {
        if (newImage) {
            FileReader.onloadend = function () {
                $scope.$apply(function () {
                    $scope.imageForUploadPreviewStart = false;
                    $scope.imageForUploadPreview = FileReader.result;
                    $scope.imageForUploadPreviewData = FileReaderUtil.dataURItoBlob($scope.imageForUploadPreview);
                });
            };
            FileReader.onloadstart = function () {
                $scope.$apply(function () {
                    $scope.imageForUploadPreviewStart = true;
                });
            };
            FileReader.readAsDataURL(newImage);
        }
    });

    $scope.$watch('selectedPrivacyType', function (newPrivacyType) {
        $scope.sendBlogAllowed = isSendBlogAllowed(newPrivacyType,
            $scope.user.blogText, $scope.selectPublic, $scope.imageForUploadPreviewStart);
    });

    $scope.$watch('user.blogText', function (newBlogText) {
        $scope.sendBlogAllowed = isSendBlogAllowed($scope.selectedPrivacyType,
            newBlogText, $scope.selectPublic, $scope.imageForUploadPreviewStart);
    });

    $scope.$watch('selectPublic', function (newSelectPublic) {
        $scope.sendBlogAllowed = isSendBlogAllowed($scope.selectedPrivacyType,
            $scope.user.blogText, newSelectPublic, $scope.imageForUploadPreviewStart);
    });

    $scope.$watch('imageForUploadPreviewStart', function (newImageUpload) {
        $scope.sendBlogAllowed = isSendBlogAllowed($scope.selectedPrivacyType,
            $scope.user.blogText, $scope.selectPublic, newImageUpload);
    });

    $scope.deletePicture = function () {
        $scope.imageForUploadPreview = null;
        $scope.imageForUpload = null;
    };

    $scope.sendBlog = function () {
        function getParameters () {
            var params = {addBlog: {text: $scope.user.blogText}}, visibility = [];
            if (!$scope.selectPublic) {
                angular.forEach($scope.selectedPrivacyType, function (type) {
                    visibility.push(type.type);
                });
                params.addBlog.visibility = visibility;
            }
            return params;
        }

        if (!$scope.user.uploadBlogIsRunning && $scope.sendBlogAllowed) {
            $scope.user.uploadBlogIsRunning = true;
            fileUpload.uploadFileAndJson($scope.imageForUploadPreviewData, getParameters(), 'api/user/blog').
                success(function (resp) {
                    $scope.user.uploadBlogIsRunning = false;
                    resp.isAdmin = true;
                    $scope.blogAdded(resp);
                    $scope.abort();
                }).
                error(function () {
                    $scope.user.uploadBlogIsRunning = false;
                });
        }
    };

    $scope.$on('home.blog.abort', function () {
        if (!$scope.user.uploadBlogIsRunning) {
            closeBlog($scope, FileReader);
        }
    });
}];


},{}],62:[function(require,module,exports){
'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$scope', function ($scope) {
            $scope.user = {blogText: '', uploadBlogIsRunning: false};
        }];
    }
};


},{}],63:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');
var link = require('./link.js');

module.exports = {
    directive: ['$animate', '$timeout', function ($animate, $timeout) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                showExpand: '=',
                isExpand: '=',
                userInfo: '=',
                blogAdded: '=',
                numberOfRows: '='
            },
            link: link.directiveLink($animate, $timeout),
            controller: controller.directiveCtrl(),
            templateUrl: 'app/modules/home/homePinwallBlog/template.html'
        };
    }],
    name: 'elyHomePinwallBlog'
};

},{"./controller.js":62,"./link.js":65}],64:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.controller('BlogExtendedCtrl', require('./blogExtendedCtrl'));
},{"./blogExtendedCtrl":61,"./directive.js":63}],65:[function(require,module,exports){
'use strict';

module.exports = {
    directiveLink: function ($animate, $timeout) {
        return function ($scope, element) {

            $scope.$watch('showExpand', function (newValue) {
                if (newValue) {
                    element.addClass('ng-hide');
                }
            });

            $scope.$watch('isExpand', function (newValue) {
                if ($scope.showExpand === false) {
                    if (newValue) {
                        element.addClass('ng-hide');
                    } else {
                        element.removeClass('ng-hide');
                    }
                } else {
                    if (newValue) {
                        element.removeClass('ng-hide');
                        $animate.addClass(element, 'is-extended');
                        element.find('.blog-input').focus();
                    }
                }
            });

            $scope.abort = function () {
                if ($scope.showExpand) {
                    $animate.removeClass(element, 'is-extended').then(function () {
                        $animate.addClass(element, 'ng-hide');
                        $scope.isExpand = false;
                        $scope.$broadcast('home.blog.abort');
                    });
                }
            };

            $scope.expandBlog = function () {
                if (!$scope.showExpand) {
                    $scope.isExpand = true;
                }
            };

            $scope.attachPhoto = function () {
                $timeout(function () {
                    element.find('#select-file-dialog').trigger('click');
                }, 0, false);
            };
        };
    }
};

},{}],66:[function(require,module,exports){
'use strict';

module.exports = ['$scope', '$rootScope', '$window', '$timeout', 'dateFormatter', 'ElyModal', 'Blog', 'WaitingScreen', 'UrlCache',
    function ($scope, $rootScope, $window, $timeout, dateFormatter, ElyModal, Blog, WaitingScreen, UrlCache) {

        $scope.getFormattedDate = dateFormatter.formatRelativeTimes;
        $scope.cacheUrl = UrlCache.cacheUrl;

        $scope.removeBlog = function (blogId) {
            ElyModal.show()({
                scope: {
                    title: 'Blog löschen',
                    content: 'Willst Du diesen Blog wirklich löschen?'
                },
                templateUrl: 'app/modules/util/dialog/yesNoDialog.html',
                size: 'sm'
            }).then(function () {
                var finished = WaitingScreen.openScreen('Blog wird gelöscht...');
                Blog.delete({
                    blogId: blogId
                }, function () {
                    $scope.elementRemoved($scope.element);
                    finished();
                }, function () {
                    finished();
                });
            });
        };

        $scope.openFullScreenDetail = function () {
            $rootScope.fullScreen.data = $scope.element;
            $rootScope.fullScreen.scrollY = $window.scrollY;
            $rootScope.fullScreen.template = 'app/modules/home/homePinwallElement/blogDetail/blogDetail.html';
            $rootScope.fullScreen.show = true;
        };
    }];


},{}],67:[function(require,module,exports){
'use strict';

module.exports = ['$scope', 'dateFormatter',
    function ($scope, dateFormatter) {
        $scope.getFormattedDate = dateFormatter.formatRelativeTimes;
    }];


},{}],68:[function(require,module,exports){
'use strict';

module.exports = ['$scope', 'dateFormatter', '$state', 'UrlCache', function ($scope, dateFormatter, $state, UrlCache) {

    $scope.cacheUrl = UrlCache.cacheUrl;

    $scope.openDetail = function (userId) {
        if (userId) {
            $state.go('contact.detail', {
                userId: userId
            });
        }
    };

    $scope.getFormattedDate = dateFormatter.formatRelativeTimes;
}];


},{}],69:[function(require,module,exports){
'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                element: '=',
                elementRemoved: '='
            },
            templateUrl: 'app/modules/home/homePinwallElement/template.html'
        };
    }],
    name: 'elyHomePinwallElement'
};

},{}],70:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.controller('HomePinwallElementNewMessageCtrl', require('./newMessageCtrl'));
app.controller('HomePinwallElementRecommendationCtrl', require('./recommendationCtrl'));
app.controller('HomePinwallElementContactingCtrl', require('./contactingCtrl'));
app.controller('HomePinwallElementBlogCtrl', require('./blogCtrl'));
app.controller('HomePinwallElementBlogDetailCtrl', require('./blogDetail/blogDetailCtrl'));

app.directive(directive.name, directive.directive);

},{"./blogCtrl":66,"./blogDetail/blogDetailCtrl":67,"./contactingCtrl":68,"./directive.js":69,"./newMessageCtrl":71,"./recommendationCtrl":72}],71:[function(require,module,exports){
'use strict';

module.exports = ['$scope', '$state', 'UrlCache', function ($scope, $state, UrlCache) {

    $scope.cacheUrl = UrlCache.cacheUrl;

    $scope.openThread = function (threadId) {
        if (threadId) {
            $state.go('message.threads.detail', {
                threadId: threadId,
                isGroupThread: false
            });
        }
    };
}];

},{}],72:[function(require,module,exports){
'use strict';

module.exports = ['$scope', 'dateFormatter', '$state', 'PageCategories', 'UrlCache',
    function ($scope, dateFormatter, $state, PageCategories, UrlCache) {

        $scope.getFormattedDate = dateFormatter.formatRelativeTimes;
        $scope.cacheUrl = UrlCache.cacheUrl;

        $scope.category = PageCategories.categories[$scope.element.label].description;

        $scope.openDetail = function (pageId, label) {
            $state.go('page.detail', {
                label: label,
                pageId: pageId
            });
        };
    }];


},{}],73:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');

app.factory('Home', require('./services/home'));
app.factory('Blog', require('./services/blog'));

app.service('HomeLeftNavElements', require('./services/leftNavElements'));
app.service('HomePinwallRequest', require('./pinwall/pinwallRequest'));
app.service('HomePinwallElements', require('./pinwall/pinwallElements'));
app.service('HomePinwall', require('./pinwall/pinwall'));
app.service('HomePinwallHeightCalculator', require('./pinwall/heightCalculator'));

app.service('WatchRootScope', require('./services/watchRootScope'));

app.controller('HomeCtrl', require('./homeCtrl'));

},{"./homeCtrl":60,"./pinwall/heightCalculator":74,"./pinwall/pinwall":75,"./pinwall/pinwallElements":76,"./pinwall/pinwallRequest":77,"./services/blog":78,"./services/home":79,"./services/leftNavElements":80,"./services/watchRootScope":81}],74:[function(require,module,exports){
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

},{}],75:[function(require,module,exports){
'use strict';

var pinwallElements,
    numberOfRows = 1;

var resetPinwallElements = function () {
    pinwallElements = [[], [], []];
};

var nextColumnIndex = function (heightColumns) {
    var index = 0, smallest = Number.MAX_VALUE;
    angular.forEach(heightColumns, function (heightColumn, key) {
        if (heightColumn < smallest) {
            smallest = heightColumn;
            index = key;
        }
    });
    return index;
};

var addPinwallElementsToColumns = function (pinwall, log) {
    var heightColumns = [], i, index;

    for (i = 0; i < numberOfRows; i++) {
        heightColumns.push(0);
    }

    angular.forEach(pinwall, function (pinwallElement) {
        if (pinwallElement.type === 'NewMessages' || pinwallElement.type === 'Contacting') {
            pinwallElements[numberOfRows - 1].unshift(pinwallElement);
            heightColumns[numberOfRows - 1] += pinwallElement.pinwallHeight;
        } else {
            index = nextColumnIndex(heightColumns);
            if (pinwallElement.hasOwnProperty('pinwallHeight')) {
                heightColumns[index] += pinwallElement.pinwallHeight;
            } else {
                log.warn("Element has no pinwall height");
            }
            pinwallElements[index].push(pinwallElement);
        }
    });
};

module.exports = ['HomePinwallElements', '$log',
    function (HomePinwallElements, $log) {


        var updatePinwall = function () {
            resetPinwallElements();
            addPinwallElementsToColumns(HomePinwallElements.getPinwall(), $log);
            return {
                pinwallElements: pinwallElements,
                userInfo: HomePinwallElements.getUserInfo()
            };
        };

        resetPinwallElements();

        this.setNumberOfRows = function (newNumber) {
            numberOfRows = newNumber;
        };

        this.updatePinwall = updatePinwall;

        this.elementRemoved = function (element) {
            function removeElement(container, elementToRemove) {
                var indexToRemove = null;
                angular.forEach(container, function (containerElement, key) {
                    if (angular.equals(containerElement, elementToRemove)) {
                        indexToRemove = key;
                    }
                });
                if (indexToRemove !== null) {
                    container.splice(indexToRemove, 1);
                }
            }

            removeElement(HomePinwallElements.getPinwall(), element);
            removeElement(pinwallElements[0], element);
            removeElement(pinwallElements[1], element);
            removeElement(pinwallElements[2], element);
        };

        this.blogAdded = function (blog) {
            HomePinwallElements.addBlog(blog);
            updatePinwall();
        };

        this.messageChanged = function (newMessages) {
            HomePinwallElements.messageChanged(newMessages);
            updatePinwall();
        };
    }];

},{}],76:[function(require,module,exports){
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

},{}],77:[function(require,module,exports){
'use strict';

var skip,
    itemsPerPage,
    timestamp,
    requestPinwallElements,
    requestPinwallElementsRunning;

var checkRequestPinwall = function (pinwall, requestedNumberOfElements) {
    function countElements(pinwallElements, type) {
        var count = 0;
        angular.forEach(pinwallElements, function (pinwallElement) {
            if (pinwallElement.type === type) {
                count++;
            }
        });
        return count;
    }

    return !(countElements(pinwall, 'Blog') < requestedNumberOfElements &&
    countElements(pinwall, 'Recommendation') < requestedNumberOfElements );
};

module.exports = ['$q', 'moment', 'Home', 'HomePinwallElements',
    function ($q, moment, Home, HomePinwallElements) {

        this.resetCache = function () {
            timestamp = Math.floor(moment.utc().valueOf() / 1000);
            skip = 0;
            itemsPerPage = 30;
            HomePinwallElements.reset();
            requestPinwallElements = true;
            requestPinwallElementsRunning = false;
        };

        this.resetCache();

        this.requestPinwall = function () {
            var deferred = $q.defer(), newPinwall;
            if (requestPinwallElements && !requestPinwallElementsRunning) {
                requestPinwallElementsRunning = true;
                newPinwall = Home.get({maxItems: itemsPerPage, skip: skip, timestamp: timestamp}, function () {

                    var tempPinwall = HomePinwallElements.setPinwallElements(newPinwall);

                    requestPinwallElements = checkRequestPinwall(tempPinwall, itemsPerPage);
                    requestPinwallElementsRunning = false;
                    deferred.resolve({});
                }, function () {
                    requestPinwallElementsRunning = false;
                    deferred.reject();
                });
                skip += itemsPerPage;
            } else {
                deferred.reject();
            }
            return deferred.promise;
        };
    }];

},{}],78:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/user/blog', null, {'delete': {method: 'POST', headers: {'X-HTTP-Method-Override': 'DELETE'}}});
}];

},{}],79:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/user/home', null, {
        'get': {method: 'GET', cache: true}
    });
}];

},{}],80:[function(require,module,exports){
'use strict';

module.exports = [
    function () {
        this.event = 'elyoos.leftNav.changed';

        this.elements = [
            {description: 'Home', url: 'home', color: '#B3C833', sref: 'home'},
            {description: 'Kontakte', url: 'contact', color: '#009688', sref: 'contact.myContacts'},
            {description: 'Nachrichten', url: 'thread', color: '#ce5043', sref: 'message.threads'},
            {description: 'Empfehlungen', url: 'recommendation', color: '#1aa1e1', sref: 'page.overview'}];
    }];

},{}],81:[function(require,module,exports){
'use strict';

var initialized = false;

module.exports = ['$state', '$timeout', '$window',
    function ($state, $timeout, $window) {
        this.addRootScopeEvents = function ($rootScope) {

            if (!initialized) {
                initialized = true;
                // Navigation from home to recommendation or blog and back to home shall use the cache
                $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
                    if (fromState.name === "home" && (toState.name === "page.detail")) {
                        toState.previousIsHome = true;
                        toState.previousYPos = $window.scrollY;
                    } else if (toState.name === "home") {
                        if (fromState.previousIsHome) {
                            delete fromState.previousIsHome;
                            event.preventDefault();
                            $state.go(toState.name, {
                                cache: "cache"
                            });
                            $timeout(function () {
                                $window.scrollTo(0, fromState.previousYPos);
                            }, 0, false);
                        }
                    } else {
                        delete fromState.previousIsHome;
                    }
                });

                $rootScope.$watch('fullScreen.show', function (newShow) {
                    if (newShow === false && $rootScope.fullScreen && $rootScope.fullScreen.scrollY > 0) {
                        $timeout(function () {
                            $window.scrollTo(0, $rootScope.fullScreen.scrollY);
                        }, 100, false);
                    }
                });
            }
        };
    }];

},{}],82:[function(require,module,exports){
'use strict';

module.exports = ['$scope', '$state', 'Message', 'Conversation',
    function ($scope, $state, Message, Conversation) {

        $scope.settings.getThread = function (paginationNumber) {
            var skip = (paginationNumber - 1) * $scope.settings.itemsPerPage;
            $scope.settings.currentPagination = paginationNumber;
            $scope.settings.thread = Conversation.get({
                itemsPerPage: $scope.settings.itemsPerPage,
                skip: skip,
                threadId: $scope.settings.selectedThreadId,
                isGroupThread: $scope.settings.selectedIsGroupThread
            }, function () {
                $scope.settings.threads = Message.get({itemsPerPage: 30, skip: 0});
            });
        };
        if ($scope.settings.getThreadAtInit) {
            $scope.settings.getThread($scope.settings.currentPagination);
        }

        $scope.settings.openThread = function (threadId, isGroupThread) {
            if ($scope.settings.selectedIsGroupThread === isGroupThread && threadId === $scope.settings.selectedThreadId) {
                $scope.settings.getThread(1);
            } else {
                $state.go('message.threads.detail', {
                    threadId: threadId,
                    isGroupThread: isGroupThread
                });
            }
        };

        $scope.settings.checkHeightOfInput = function ($event) {
            if ($event.target.offsetHeight < 110) {
                $scope.settings.textInputStyle = {height: $event.target.scrollHeight + 2 + 'px'};
                $scope.settings.textInputWrapperStyle = {height: $event.target.scrollHeight + 18 + 'px'};
            } else if ($event.target.offsetHeight < 144) {
                $scope.settings.textInputWrapperStyle = {height: '144px'};
            }
        };

        $scope.settings.resetTextInputStyle = function () {
            $scope.settings.textInputStyle = {};
            $scope.settings.textInputWrapperStyle = {};
        };
    }];

},{}],83:[function(require,module,exports){
'use strict';

module.exports = ['$scope', '$stateParams', 'Conversation', 'Message', 'dateFormatter', 'MessageLeftNavElements',
    function ($scope, $stateParams, Conversation, Message, dateFormatter, MessageLeftNavElements) {

        $scope.settings = {};
        $scope.settings.itemsPerPage = 30;
        $scope.settings.selectedThreadId = $stateParams.threadId;
        $scope.settings.selectedIsGroupThread = $stateParams.isGroupThread === 'true';
        $scope.settings.currentPagination = 1;
        $scope.settings.getThreadAtInit = true;
        $scope.settings.newMessage = '';

        $scope.$emit(MessageLeftNavElements.event, MessageLeftNavElements.elements);

        $scope.$on('message.changed', function () {
            if ($scope.settings.currentPagination === 1) {
                $scope.settings.getThread($scope.settings.currentPagination);
            } else {
                $scope.settings.threads = Message.get({itemsPerPage: 30, skip: 0});
            }
        });

        $scope.getFormattedDate = dateFormatter.formatExact;

        $scope.sendMessage = function () {
            var message;
            if ($scope.settings.newMessage.trim() !== '') {
                if ($scope.settings.selectedIsGroupThread) {
                    message = {
                        addGroupMessage: {
                            threadId: $scope.settings.selectedThreadId,
                            text: $scope.settings.newMessage
                        }
                    };
                } else {
                    message = {
                        addMessage: {
                            threadId: $scope.settings.selectedThreadId,
                            text: $scope.settings.newMessage
                        }
                    };
                }
                Conversation.save(message, function (resp) {
                    $scope.settings.thread.messages.unshift(resp.message);
                    $scope.settings.newMessage = '';
                    $scope.settings.resetTextInputStyle($scope);
                });
            }
        };
    }];

},{}],84:[function(require,module,exports){
'use strict';

module.exports = ['$scope', '$state', '$stateParams', 'Conversation', 'Message', 'MessageLeftNavElements',
    function ($scope, $state, $stateParams, Conversation, Message, MessageLeftNavElements) {

        $scope.settings = {};
        $scope.settings.getThreadAtInit = false;
        $scope.settings.thread = {threadDescription: $stateParams.name};

        $scope.$emit(MessageLeftNavElements.event, MessageLeftNavElements.elements);

        $scope.settings.threads = Message.get({itemsPerPage: 30, skip: 0});

        $scope.sendMessage = function () {
            var message;
            if ($scope.settings.newMessage.trim() !== '') {
                message = {
                    newSingleThread: {
                        contactId: $stateParams.userId,
                        text: $scope.settings.newMessage
                    }
                };
                Conversation.save(message, function (resp) {
                    $state.go('message.threads.detail', {
                        threadId: resp.threadId,
                        isGroupThread: false
                    });
                });
            }
        };
    }];

},{}],85:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');

app.controller('ThreadsCtrl', require('./threadsCtrl'));
app.controller('ConversationCtrl', require('./conversationCtrl'));
app.controller('CreateConversationCtrl', require('./createConversationCtrl'));
app.controller('ConversationActionsCtrl', require('./conversationActionsCtrl'));

app.factory('Message', require('./services/message'));
app.factory('SearchThread', require('./services/searchThread'));
app.factory('Conversation', require('./services/conversation'));
app.factory('SearchUserToSendMessage', require('./services/searchUserToSendMessage'));

app.service('MessageLeftNavElements', require('./services/leftNavElements'));

app.config(['$stateProvider', function ($stateProvider) {

    $stateProvider
        .state('message', {
            abstract: true,
            url: '/message',
            views: {
                header: {
                    templateUrl: 'app/modules/navigation/loggedInHeader.html'
                }
            }
        })
        .state('message.threads', {
            url: '/threads',
            views: {
                'content@': {
                    templateUrl: 'app/modules/messages/threads.html',
                    controller: 'ThreadsCtrl'
                }
            },
            hasNavigation: true
        })
        .state('message.threads.detail', {
            url: '/conversation/{isGroupThread}/{threadId}',
            views: {
                'content@': {
                    templateUrl: 'app/modules/messages/conversation.html',
                    controller: 'ConversationCtrl'
                }
            },
            hasNavigation: true
        })
        .state('message.threads.create', {
            url: '/single/create/{userId}/{name}',
            views: {
                'content@': {
                    templateUrl: 'app/modules/messages/conversation.html',
                    controller: 'CreateConversationCtrl'
                }
            },
            hasNavigation: true
        });
}]);
},{"./conversationActionsCtrl":82,"./conversationCtrl":83,"./createConversationCtrl":84,"./services/conversation":86,"./services/leftNavElements":87,"./services/message":88,"./services/searchThread":89,"./services/searchUserToSendMessage":90,"./threadsCtrl":91}],86:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/user/messages/conversation');
}];

},{}],87:[function(require,module,exports){
'use strict';

module.exports = [
    function () {
        this.event = 'elyoos.leftNav.changed';

        this.elements = [
            {description: '\u00dcbersicht', url: 'thread', color: '#009688', sref: 'message.threads'},
            {
                description: 'Chat',
                url: 'chat',
                color: '#658092',
                sref: 'message.threads.detail',
                onlyShowSelected: true
            },
            {
                description: 'Neuer Chat',
                url: 'add',
                color: '#FFA000',
                sref: 'message.threads.create',
                onlyShowSelected: true
            },
            {description: 'Home', url: 'home', color: '#B3C833', sref: 'home'}];
    }];

},{}],88:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/user/messages');
}];

},{}],89:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('/api/user/messages/singleThread');
}];

},{}],90:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/user/messages/search');
}];

},{}],91:[function(require,module,exports){
'use strict';

module.exports = ['$scope', '$state', 'Message', 'SearchUserToSendMessage', 'dateFormatter', 'MessageLeftNavElements',
    function ($scope, $state, Message, SearchUserToSendMessage, dateFormatter, MessageLeftNavElements) {

        var currentPagination = 1;
        $scope.itemsPerPage = 30;

        $scope.$emit(MessageLeftNavElements.event, MessageLeftNavElements.elements);

        $scope.getThreads = function (paginationNumber) {
            currentPagination = paginationNumber;
            var skip = (paginationNumber - 1) * $scope.itemsPerPage;
            $scope.threads = Message.get({itemsPerPage: $scope.itemsPerPage, skip: skip});
        };
        $scope.getThreads(currentPagination);

        $scope.getFormattedDate = dateFormatter.format;

        $scope.openThread = function (threadId, isGroupThread) {
            if (threadId) {
                $state.go('message.threads.detail', {
                    threadId: threadId,
                    isGroupThread: isGroupThread
                });
            }
        };

        $scope.$on('message.changed', function () {
            $scope.getThreads(currentPagination);
        });

        $scope.getSuggestion = function (searchValue) {
            if (searchValue && searchValue.trim().length > 0) {
                return SearchUserToSendMessage.query({
                    search: searchValue,
                    maxItems: 7,
                    isSuggestion: true
                }).$promise;
            }
            delete $scope.search;
        };

        $scope.getThreadsOrContacts = function (searchValue) {
            if (searchValue && searchValue.trim().length > 0) {
                $scope.search = SearchUserToSendMessage.get({
                    search: searchValue,
                    maxItems: 20,
                    isSuggestion: false
                });
            } else {
                delete $scope.search;
            }
        };

        $scope.addNewSingleThread = function (userId, name) {
            if (userId) {
                $state.go('message.threads.create', {
                    userId: userId,
                    name: name
                });
            }
        };
    }];

},{}],92:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');

app.controller('LoggedInHeaderCtrl', require('./loggedInHeaderCtrl'));
app.controller('LeftNavColCtrl', require('./leftNavColCtrl'));
app.controller('ProfilePreviewPopoverCtrl', require('./profilePreview/profilePreviewPopoverCtrl'));

app.factory('UserInfo', require('./services/userInfo'));
app.factory('Modification', require('./services/modification'));

},{"./leftNavColCtrl":93,"./loggedInHeaderCtrl":97,"./profilePreview/profilePreviewPopoverCtrl":98,"./services/modification":99,"./services/userInfo":100}],93:[function(require,module,exports){
'use strict';

module.exports = ['$scope', '$rootScope', '$state',
    function ($scope, $rootScope) {

        $scope.originalSection = [];

        $rootScope.$on('elyoos.leftNav.changed', function (event, sections) {
            if (!angular.equals(sections, $scope.originalSection)) {
                angular.copy(sections, $scope.originalSection);
                $scope.sections = sections;
            }
        });
    }];

},{}],94:[function(require,module,exports){
'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$scope', '$state', '$rootScope', function ($scope, $state, $rootScope) {

            $scope.originalSection = [];

            $scope.setSections = function (selectedState) {
                $scope.sectionsDisply = [];
                angular.forEach($scope.originalSection, function (section) {
                    if(section.sref === selectedState) {
                        $scope.sectionsDisply.unshift(section);
                    } else if(!section.onlyShowSelected){
                        $scope.sectionsDisply.push(section);
                    }
                });
            };

            $scope.goToState = function (selectedState) {
                $scope.setSections(selectedState);
                $state.go(selectedState);
            };

            $scope.$watch('sections', function (newSection) {
                if (newSection && !angular.equals(newSection, $scope.originalSection)) {
                    angular.copy(newSection, $scope.originalSection);
                    $scope.setSections($state.current.name);
                }
            });

            $scope.isFirst = function(first, color) {
                if(first) {
                    return {'background-color': color, 'color': '#fff' };
                }
                return {};
            };

            $rootScope.$on('$stateChangeSuccess', function (event, toState) {
                $scope.setSections(toState.name);
            });
        }];
    }
};

},{}],95:[function(require,module,exports){
'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                sections: '='
            },
            templateUrl: 'app/modules/navigation/leftNav/template.html',
            controller: controller.directiveCtrl()
        };
    }],
    name: 'elyLeftNav'
};

},{"./controller.js":94}],96:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"./directive.js":95,"dup":32}],97:[function(require,module,exports){
'use strict';

module.exports = ['$scope', '$window', '$interval', '$rootScope', 'UserInfo', 'Modification', 'profileImage', 'Auth',
    function ($scope, $window, $interval, $rootScope, UserInfo, Modification, profileImage, Auth) {

        var modificationInfo, isLoggedIn = false;

        profileImage.addProfileImageChangedEvent($rootScope, function () {
            $rootScope.userHeaderInfo = UserInfo.get(null);
        });

        $rootScope.isLoggedIn = function() {
            if(!isLoggedIn) {
                $rootScope.userHeaderInfo = UserInfo.get(null, function () {
                    isLoggedIn = true;
                    modificationInfo = $interval(function () {
                        var modification = Modification.get(null, function () {
                            if (modification.hasChanged) {
                                $rootScope.$broadcast('message.changed', modification.messages);
                            }
                        });
                    }, 30000);
                });
            }
        };

        $rootScope.isLoggedIn();

        $rootScope.logout = function () {
            Auth.logout().then(function () {
                $interval.cancel(modificationInfo);
                isLoggedIn = false;
                $window.location.href = '/login';
            }, function () {
                $scope.error = "Fehler beim Abmelden";
            });
        };
    }];

},{}],98:[function(require,module,exports){
'use strict';

module.exports = ['$scope', '$state',
    function ($scope, $state) {

        $scope.openProfileEdit = function (hide) {
            $state.go('settings.profile');
            hide();
        };
    }];

},{}],99:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/modification');
}];

},{}],100:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/user/userInfo');
}];

},{}],101:[function(require,module,exports){
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

},{}],102:[function(require,module,exports){
'use strict';

module.exports = ['$scope', '$state', '$stateParams', 'Languages', 'moment',
    function ($scope, $state, $stateParams, Languages, moment) {

        var isDateValid = function (date) {
            return moment(date, 'l', moment.locale(), true).isValid();
        };

        $scope.page.Book = function () {
            var bookPage = {
                bookPage: {
                    language: Languages.getCode($scope.category.selectedLanguage),
                    title: $scope.category.title,
                    description: $scope.page.description,
                    author: $scope.page.authors
                }
            };
            if ($scope.page.publishDate) {
                bookPage.bookPage.publishDate = moment.utc($scope.page.publishDate, 'l', moment.locale(), true).valueOf() / 1000;
            }
            if ($scope.mode.edit) {
                bookPage.bookPage.pageId = $stateParams.pageId;
            }
            return bookPage;
        };

        if ($scope.mode.edit) {
            $scope.$watch('pageDetail.page', function (newPageDetail) {
                $scope.category.selectedLanguage = Languages.getLanguage(newPageDetail.language);
                $scope.category.title = newPageDetail.title;
                $scope.page.description = newPageDetail.description;
                $scope.page.authors = newPageDetail.author[0].name;
                if (newPageDetail.publishDate) {
                    $scope.page.publishDate = moment.unix(newPageDetail.publishDate).format('l');
                }
                $scope.page.imagePreview = newPageDetail.titleUrl;
                $scope.commonSection.toCompare = {};
                $scope.commonSection.toCompareTitle = $scope.category.title;
                angular.copy($scope.page, $scope.commonSection.toCompare);
            });
        }

        $scope.$watch('page.publishDate', function (publicationDate) {
            if ($scope.commonForm && $scope.commonForm.inputPublicationDate) {
                if (publicationDate) {
                    $scope.commonForm.inputPublicationDate.$setValidity('custom', isDateValid(publicationDate));
                } else if (!publicationDate || publicationDate.trim() === '') {
                    $scope.commonForm.inputPublicationDate.$setValidity('custom', true);
                }
            }
        });

        $scope.getDateExample = function () {
            var unixTimestamp = 385974036;
            return moment.unix(unixTimestamp).format('l');
        };
    }];

},{}],103:[function(require,module,exports){
'use strict';

var goToPageDetail = function (pageId, $state, $scope) {
    $scope.uploadRunning = false;
    $state.go('page.detail', {
        label: $scope.category.selectedCategoryType,
        pageId: pageId
    });
};

var getPageId = function (pageId, resp) {
    if (!pageId) {
        return resp.pageId;
    }
    return pageId;
};

var uploadPage = function ($scope, $state, errorToast, fileUpload, api, pageId, PromiseModal) {
    var json = $scope.page[$scope.category.selectedCategoryType](), imageToUpload;

    if (!$scope.uploadRunning) {
        $scope.uploadRunning = true;
        if ($scope.imagePreviewData) {
            imageToUpload = $scope.imagePreviewData;
        }

        fileUpload.uploadFileAndJson(imageToUpload, json, api).
            success(function (resp) {
                var modalScope = $scope.$new(false);
                pageId = getPageId(pageId, resp);
                if ($scope.mode.edit) {
                    goToPageDetail(pageId, $state, $scope);
                } else {
                    modalScope.recommendation = {
                        pageId: pageId
                    };
                    PromiseModal.getModal({
                        scope: modalScope,
                        title: $scope.category.title,
                        templateUrl: 'app/modules/recommendation/modalAddRecommendation.html',
                        placement: 'center',
                        backdrop: 'static'
                    }).show().then(function () {
                        $scope.uploadRunning = false;
                        goToPageDetail(pageId, $state, $scope);
                    }, function () {
                        $scope.uploadRunning = false;
                    });
                }
            }).
            error(function () {
                $scope.uploadRunning = false;
                errorToast.showError('Fehler! Seite konnte nicht hochgeladen werden');
            });
    }
};

module.exports = ['$scope', '$state', '$stateParams', 'errorToast', 'Languages', 'fileUpload', 'moment', 'PageCategories', 'PromiseModal',
    function ($scope, $state, $stateParams, errorToast, Languages, fileUpload, moment, PageCategories, PromiseModal) {

        var imageDefaultPath = 'app/img/default.jpg';
        $scope.page.imagePreview = imageDefaultPath;
        $scope.commonSection = {};
        $scope.editChanged = false;
        $scope.editChangedTitle = false;
        $scope.uploadRunning = false;

        $scope.$on('image.cropper.image.preview', function (event, data, dataToSend) {
            $scope.page.imagePreview = data.toDataURL("image/jpeg", 1.0);
            $scope.imagePreviewData = dataToSend;
        });

        $scope.$watch('category.selectedCategory', function (newValue) {
            if (newValue) {
                $scope.category.selectedCategoryType = PageCategories.getPageType(newValue);
            }
        });

        if ($scope.mode.edit) {
            $scope.$watchCollection('page', function (newValue) {
                if (newValue && $scope.commonSection.toCompare) {
                    if (!angular.equals($scope.commonSection.toCompare, newValue)) {
                        $scope.editChanged = true;
                    } else {
                        $scope.editChanged = false;
                    }
                }
            });

            $scope.$watch('category.title', function (newValue) {
                if (newValue && $scope.commonSection.toCompareTitle) {
                    if ($scope.commonSection.toCompareTitle !== $scope.category.title) {
                        $scope.editChangedTitle = true;
                    } else {
                        $scope.editChangedTitle = false;
                    }
                }
            });
        }

        $scope.createPage = function () {
            uploadPage($scope, $state, errorToast, fileUpload, 'api/user/page/create', $stateParams.pageId, PromiseModal);

        };

        $scope.editPage = function () {
            uploadPage($scope, $state, errorToast, fileUpload, 'api/user/page/edit', $stateParams.pageId, PromiseModal);
        };
    }];

},{}],104:[function(require,module,exports){
'use strict';

var isValidYoutubeLink = function (link) {
    var isValidLink = false;
    if (angular.isString(link)) {
        if (link.indexOf('https://www.youtube.com/embed/') !== -1 || link.indexOf('https://www.youtube.com/watch?v=') !== -1) {
            isValidLink = true;
        }
    }
    return isValidLink;
};

var getYoutubeLink = function (link) {
    if(isValidYoutubeLink(link)) {
        if (link.indexOf('https://www.youtube.com/watch?v=') !== -1) {
            link = link.replace('https://www.youtube.com/watch?v=', 'https://www.youtube.com/embed/');
        }
    }
    return link;
};

module.exports = ['$scope', '$state', '$stateParams', 'Languages',
    function ($scope, $state, $stateParams, Languages) {

        $scope.page.Youtube = function () {
            var page = {
                youtubePage: {
                    language: Languages.getCode($scope.category.selectedLanguage),
                    title: $scope.category.title,
                    description: $scope.page.description,
                    link: $scope.page.youtubeLinkFormatted
                }
            };
            if ($scope.mode.edit) {
                page.youtubePage.pageId = $stateParams.pageId;
            }
            return page;
        };

        if ($scope.mode.edit) {
            if ($scope.mode.edit) {
                $scope.$watch('pageDetail.page', function (newPageDetail) {
                    $scope.category.selectedLanguage = Languages.getLanguage(newPageDetail.language);
                    $scope.category.title = newPageDetail.title;
                    $scope.page.description = newPageDetail.description;
                    $scope.page.youtubeLink = newPageDetail.link;
                    $scope.commonForm.inputYoutubeLink.$dirty = true;
                    $scope.commonSection.toCompare = {};
                    $scope.commonSection.toCompareTitle = $scope.category.title;
                    angular.copy($scope.page, $scope.commonSection.toCompare);
                });
            }
        }

        $scope.$watch('page.youtubeLink', function (link) {
            if ($scope.commonForm && $scope.commonForm.inputYoutubeLink) {
                if (link) {
                    $scope.commonForm.inputYoutubeLink.$setValidity('custom', isValidYoutubeLink(link));
                    $scope.page.youtubeLinkFormatted = getYoutubeLink(link);
                }
            }
        });

    }];

},{}],105:[function(require,module,exports){
'use strict';

module.exports = ['$scope', '$state', 'PageLeftNavElements',
    function ($scope, $state, PageLeftNavElements) {

        $scope.mode = {edit: false};
        $scope.category = {};
        $scope.page = {};
        $scope.state = {actual: 1, previous: 1};

        $scope.$emit(PageLeftNavElements.event, PageLeftNavElements.elements);

        $scope.abortCreateEditPage = function () {
            $state.go('page.overview');
        };
    }];

},{}],106:[function(require,module,exports){
'use strict';

module.exports = ['$scope', '$state', '$stateParams', 'PageLeftNavElements', 'PageCategories', 'PageDetail',
    function ($scope, $state, $stateParams, PageLeftNavElements, PageCategories, PageDetail) {

        $scope.mode = {edit: true};
        $scope.category = {};
        $scope.page = {};
        $scope.state = {actual: 3, previous: 3};

        $scope.$emit(PageLeftNavElements.event, PageLeftNavElements.elements);

        $scope.abortCreateEditPage = function () {
            $state.go('page.detail', {
                pageId: $stateParams.pageId,
                label: $stateParams.label
            });
        };

        $scope.pageDetail = PageDetail.get({pageId: $stateParams.pageId, label: $stateParams.label}, function () {
            var subCategory;
            $scope.category.selectedCategory = PageCategories.categories[$stateParams.label].description;
            if ($scope.pageDetail.page.subCategory) {
                subCategory = PageCategories.categories[$stateParams.label].subCategory[$scope.pageDetail.page.subCategory];
                if (subCategory) {
                    $scope.category.selectedSubCategory = subCategory.description;
                }
            }
        });
    }];

},{}],107:[function(require,module,exports){
'use strict';

module.exports = ['$scope', 'PageCategories', 'Languages', 'SearchPage',
    function ($scope, PageCategories, Languages, SearchPage) {

        $scope.categories = PageCategories.getCategories();
        $scope.languages = Languages.languages;
        $scope.categoryFinishedButtonDisabled = true;
        $scope.categoryFirstSelect = !$scope.mode.edit;
        $scope.categoryTitleChanged = false;

        $scope.SearchPage = SearchPage;
        $scope.SearchPageParameter = {};

        if (!$scope.mode.edit) {
            $scope.$watchCollection('category', function (newCategories) {

                if (newCategories && newCategories.title && newCategories.selectedLanguage && newCategories.selectedCategory) {
                    $scope.categoryFinishedButtonDisabled = false;
                } else {
                    $scope.categoryFinishedButtonDisabled = true;
                }
            });
        }

        $scope.setNextState = function (newState) {
            if (newState !== $scope.state.actual) {
                $scope.state.previous = $scope.state.actual;
                $scope.state.actual = newState;
            }
        };

        $scope.setPreviousState = function () {
            $scope.state.actual = $scope.state.previous;
        };

        $scope.suggestionContinue = function () {
            $scope.setNextState(3);
        };

        $scope.categorySelectFinished = function () {

            $scope.SearchPageParameter = {
                search: $scope.category.title,
                filterType: PageCategories.getPageType($scope.category.selectedCategory),
                filterLanguage: Languages.getCode($scope.category.selectedLanguage),
                isSuggestion: false
            };
        };

        $scope.$on('page.preview.request.finished', function (event, pages) {
            $scope.categoryFirstSelect = false;
            $scope.categoryTitleChanged = false;
            if (!$scope.mode.edit) {
                $scope.categoryTitlePrviouse = $scope.category.title;
            }
            if (pages.length > 0) {
                $scope.setNextState(2);
            } else {
                $scope.setNextState(3);
            }
        });

        $scope.$watch('category.title', function (newValue) {
            if (newValue && newValue.trim() !== '' && !$scope.categoryFirstSelect) {
                if ($scope.mode.edit && !$scope.categoryTitlePrviouse) {
                    $scope.categoryTitlePrviouse = newValue;
                    $scope.categoryTitleChanged = false;
                } else {
                    if (newValue !== $scope.categoryTitlePrviouse) {
                        $scope.categoryTitleChanged = true;
                        $scope.setNextState(1);
                    } else {
                        if ($scope.categoryTitleChanged) {
                            $scope.setPreviousState();
                        }
                        $scope.categoryTitleChanged = false;
                    }
                }
            } else {
                $scope.categoryTitleChanged = false;
            }
        });
    }];

},{}],108:[function(require,module,exports){
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
                    var isDisabled = PageCategoryHandler.categoriesDisabled();
                    ctrl.isFinishDisabled = !PageCategoryHandler.setSelected(ctrl.categories);
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

},{}],109:[function(require,module,exports){
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

},{"./controller.js":108}],110:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('PageCategoryHandler', require('./services/categoryHandler'));
app.service('PageLoader', require('./services/pageLoader'));
},{"./directive.js":109,"./services/categoryHandler":111,"./services/pageLoader":112}],111:[function(require,module,exports){
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

},{}],112:[function(require,module,exports){
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

},{}],113:[function(require,module,exports){
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

},{}],114:[function(require,module,exports){
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

},{"./controller.js":113}],115:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);
},{"./directive.js":114}],116:[function(require,module,exports){
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

},{}],117:[function(require,module,exports){
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

},{}],118:[function(require,module,exports){
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

},{"./controller.js":117}],119:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('UploadBookPage', require('./services/uploadBookPage'));
app.service('EditBookService', require('./services/editBookService'));
},{"./directive.js":118,"./services/editBookService":120,"./services/uploadBookPage":121}],120:[function(require,module,exports){
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

},{}],121:[function(require,module,exports){
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

},{}],122:[function(require,module,exports){
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

},{}],123:[function(require,module,exports){
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

},{"./controller.js":122}],124:[function(require,module,exports){
arguments[4][115][0].apply(exports,arguments)
},{"./directive.js":123,"dup":115}],125:[function(require,module,exports){
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

},{}],126:[function(require,module,exports){
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

},{"./controller.js":125}],127:[function(require,module,exports){
arguments[4][115][0].apply(exports,arguments)
},{"./directive.js":126,"dup":115}],128:[function(require,module,exports){
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
            templateUrl: 'app/modules/page/handlingPages/details/youtube/template.html'
        };
    }],
    name: 'elyPageHandlingDetailYoutube'
};

},{"./controller.js":128}],130:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('EditYoutubeService', require('./services/editYoutubeService'));
app.service('PageYoutubeLink', require('./services/youtubeLink'));
app.service('UploadYoutubePage', require('./services/uploadYoutubePage'));
},{"./directive.js":129,"./services/editYoutubeService":131,"./services/uploadYoutubePage":132,"./services/youtubeLink":133}],131:[function(require,module,exports){
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

},{}],132:[function(require,module,exports){
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

},{}],133:[function(require,module,exports){
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

},{}],134:[function(require,module,exports){
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

},{"./controller.js":116}],135:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('PageEditModeService', require('./services/editModeService'));
app.service('PageHandlingState', require('./services/stateHandler'));
app.service('PageHandlingUpload', require('./services/uploadPage'));
},{"./directive.js":134,"./services/editModeService":136,"./services/stateHandler":137,"./services/uploadPage":138}],136:[function(require,module,exports){
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

},{}],137:[function(require,module,exports){
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

},{}],138:[function(require,module,exports){
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
    return pageId !== undefined || pageId !== null;
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

},{}],139:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');

app.controller('PageCreateCtrl', require('./createEditPage/pageCreateCtrl'));
app.controller('PageEditCtrl', require('./createEditPage/pageEditCtrl'));
app.controller('PageSelectCategoryCtrl', require('./createEditPage/selectCategoryCtrl'));
app.controller('PageCommonSectionCtrl', require('./createEditPage/commonSectionCtrl'));
app.controller('PageCommonBookCtrl', require('./createEditPage/commonBookCtrl'));
app.controller('PageCommonYoutubeCtrl', require('./createEditPage/commonYoutubeCtrl'));
app.controller('UserRecommendationCtrl', require('./userRecommendation/userRecommendationCtrl'));
app.controller('GetPageAndExtendCtrl', require('./userRecommendation/getPageAndExtendCtrl'));
app.controller('UserPageAdministrationCtrl', require('./userPageAdministration/userPageAdministrationCtrl'));

app.controller('PageOverviewCtrl', require('./pageOverviewCtrl'));
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
                    templateUrl: 'app/modules/page/pageOverview.html',
                    controller: 'PageOverviewCtrl'
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
                    templateUrl: 'app/modules/page/userRecommendation/userRecommendation.html',
                    controller: 'UserRecommendationCtrl'
                }
            },
            hasNavigation: true
        })
        .state('page.userPageAdmin', {
            url: '/user/admin',
            views: {
                'content@': {
                    templateUrl: 'app/modules/page/userPageAdministration/userPageAdministration.html',
                    controller: 'UserPageAdministrationCtrl'
                }
            },
            hasNavigation: true
        });
}]);
},{"./addRemoveRecommendationCtrl":101,"./createEditPage/commonBookCtrl":102,"./createEditPage/commonSectionCtrl":103,"./createEditPage/commonYoutubeCtrl":104,"./createEditPage/pageCreateCtrl":105,"./createEditPage/pageEditCtrl":106,"./createEditPage/selectCategoryCtrl":107,"./pageDetail/pageDetailCtrl":143,"./pageDetail/pageDetailEducationCtrl":144,"./pageDetail/pageHeaderActivityPreviewCtrl":145,"./pageDetail/services/pageDetailReview":146,"./pageOverviewCtrl":147,"./services/categories":154,"./services/leftNavElements":155,"./services/pageDetail":156,"./services/pageRecommendationAllContact":157,"./services/pageRecommendationOtherUser":158,"./services/pageSearchUserAdministratedPage":159,"./services/pageSearchUserRecommendation":160,"./services/pageUserAdministration":161,"./services/pageUserRecommendation":162,"./services/popularPages":163,"./services/searchPage":164,"./userPageAdministration/userPageAdministrationCtrl":165,"./userRecommendation/getPageAndExtendCtrl":166,"./userRecommendation/userRecommendationCtrl":167}],140:[function(require,module,exports){
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

},{}],141:[function(require,module,exports){
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

},{"./controller.js":140}],142:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"./directive.js":141,"dup":32}],143:[function(require,module,exports){
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
            $state.go('contact.detail', {
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

},{}],144:[function(require,module,exports){
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

},{}],145:[function(require,module,exports){
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

},{}],146:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/page/review');
}];

},{}],147:[function(require,module,exports){
'use strict';

module.exports = ['$scope', 'PageRecommendationAllContact', 'SearchPage', 'PageCategories', 'PopularPages', 'PageLeftNavElements',
    function ($scope, PageRecommendationAllContact, SearchPage, PageCategories, PopularPages, PageLeftNavElements) {

        $scope.query = "";
        $scope.hide = false;

        $scope.PageRecommendationAllContact = PageRecommendationAllContact;
        $scope.SearchPage = SearchPage;
        $scope.PopularPages = PopularPages;
        $scope.searchPageRequest = {};
        $scope.popularBooksContact = {initParams: {onlyContacts: true, category: 'Book'}};
        $scope.popularYoutubeContact = {initParams: {onlyContacts: true, category: 'Youtube'}};
        $scope.popularBooksAll = {initParams: {onlyContacts: false, category: 'Book'}};
        $scope.popularYoutubeAll = {initParams: {onlyContacts: false, category: 'Youtube'}};

        $scope.$emit(PageLeftNavElements.event, PageLeftNavElements.elements);

        $scope.searchPage = function (searchValue) {
            if (searchValue && searchValue.trim().length > 0) {
                $scope.hide = true;
                $scope.searchPageRequest.startRequested({
                    search: searchValue,
                    isSuggestion: false
                });
            } else {
                $scope.hide = false;
            }
        };

    }];

},{}],148:[function(require,module,exports){
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
            ctrl.notRequestInitService = ctrl.notRequestInitService === 'true';
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

},{}],149:[function(require,module,exports){
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
                hide: '=',
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

},{"./controller.js":148}],150:[function(require,module,exports){
arguments[4][115][0].apply(exports,arguments)
},{"./directive.js":149,"dup":115}],151:[function(require,module,exports){
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

},{}],152:[function(require,module,exports){
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

},{"./controller.js":151}],153:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"./directive.js":152,"dup":32}],154:[function(require,module,exports){
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

},{}],155:[function(require,module,exports){
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

},{}],156:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/page/detail');
}];

},{}],157:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/page/recommendationAllContact');
}];

},{}],158:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/page/recommendationOtherUser');
}];

},{}],159:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/user/page/searchAdministration');
}];

},{}],160:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/user/page/searchRecommendation');
}];

},{}],161:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/user/page/administrator');
}];

},{}],162:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/user/page/recommendation');
}];

},{}],163:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/page/popularPages');
}];

},{}],164:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/page/searchPage');
}];

},{}],165:[function(require,module,exports){
'use strict';

module.exports = ['$scope', 'PageLeftNavElements', 'PageUserAdministration', 'PageSearchUserAdministratedPage',
    function ($scope, PageLeftNavElements, PageUserAdministration, PageSearchUserAdministratedPage) {

        $scope.getPageService = PageUserAdministration;
        $scope.searchPageService = PageSearchUserAdministratedPage;

        $scope.$emit(PageLeftNavElements.event, PageLeftNavElements.elements);

    }];

},{}],166:[function(require,module,exports){
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

},{}],167:[function(require,module,exports){
'use strict';

module.exports = ['$scope', 'PageLeftNavElements', 'PageUserRecommendation', 'PageSearchUserRecommendation',
    function ($scope, PageLeftNavElements, PageUserRecommendation, PageSearchUserRecommendation) {

        $scope.getPageService = PageUserRecommendation;
        $scope.searchPageService = PageSearchUserRecommendation;

        $scope.$emit(PageLeftNavElements.event, PageLeftNavElements.elements);
    }];

},{}],168:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');

app.controller('ModalAddRecommendationCtrl', require('./modalAddRecommendationCtrl'));

app.service('PageRecommendation', require('./services/pageRecommendation'));
},{"./modalAddRecommendationCtrl":169,"./services/pageRecommendation":170}],169:[function(require,module,exports){
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

},{}],170:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/user/recommendation/page', null, {
        'delete': {method: 'POST', headers: {'X-HTTP-Method-Override': 'DELETE'}}
    });
}];

},{}],171:[function(require,module,exports){
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

},{}],172:[function(require,module,exports){
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

app.service('SettingLeftNavElements', require('./services/leftNavElements'));

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
},{"./deletePrivacyCtrl":171,"./passwordCtrl":173,"./privacyCtrl":174,"./profileCtrl":175,"./renamePrivacyCtrl":176,"./services/leftNavElements":177,"./services/password":178,"./services/privacy":179,"./services/profile":180}],173:[function(require,module,exports){
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

},{}],174:[function(require,module,exports){
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

},{}],175:[function(require,module,exports){
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

},{}],176:[function(require,module,exports){
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

},{}],177:[function(require,module,exports){
'use strict';

module.exports = [
    function () {
        this.event = 'elyoos.leftNav.changed';

        this.elements = [
            {description: 'Profile', url: 'profile', color: '#009688', sref: 'settings.profile'},
            {description: 'Privatsph\u00e4re', url: 'security', color: '#FFA000', sref: 'settings.privacy'},
            {description: 'Password', url: 'security', color: '#ce5043', sref: 'settings.profile.changePassword', onlyShowSelected: true},
            {description: 'Home', url: 'home', color: '#B3C833', sref: 'home'}];
    }];

},{}],178:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/user/password');
}];

},{}],179:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/user/settings/privacy', null, {
        'delete': {method: 'POST', headers: {'X-HTTP-Method-Override': 'DELETE'}}
    });
}];

},{}],180:[function(require,module,exports){
'use strict';

module.exports = ['$resource', function ($resource) {
    return $resource('api/user/settings/profile');
}];

},{}],181:[function(require,module,exports){
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

},{}],182:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');

app.service('Languages', require('./languages'));
app.service('CountryCodeConverter', require('./countryCodeConverter'));
},{"./countryCodeConverter":181,"./languages":183}],183:[function(require,module,exports){
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

},{}],184:[function(require,module,exports){
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

    this.formatRelativeTimes =  function (dateValue) {
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

    return this;
}];

},{}],185:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');

app.service('dateFormatter', require('./dateFormatter'));
},{"./dateFormatter":184}],186:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');

app.service('profileImage', require('./profileImage'));
},{"./profileImage":187}],187:[function(require,module,exports){
'use strict';

module.exports = [function () {
    this.addProfileImageChangedEvent = function (scope, callback) {
        scope.$on('elyoos.profileImage.change', function () {
            callback();
        });
    };
    return this;
}];

},{}],188:[function(require,module,exports){
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

},{}],189:[function(require,module,exports){
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

},{}],190:[function(require,module,exports){
'use strict';

module.exports = function () {
    return new FileReader();
};

},{}],191:[function(require,module,exports){
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

},{}],192:[function(require,module,exports){
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

},{}],193:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');
var fileModel = require('./fileModel.js');

app.service('fileUpload', require('./fileUpload'));

app.factory('FileReader', require('./fileReader'));
app.service('FileReaderUtil', require('./fileReaderUtil'));

app.controller('FileCtrl', require('./fileCtrl'));

app.directive(fileModel.name, fileModel.directive);
},{"./fileCtrl":188,"./fileModel.js":189,"./fileReader":190,"./fileReaderUtil":191,"./fileUpload":192}],194:[function(require,module,exports){
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

},{}],195:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');

app.controller('UtilFilePreviewPictureCtrl', require('./controller.js'));
app.service('UtilFilePreviewPicture', require('./service.js'));
},{"./controller.js":194,"./service.js":196}],196:[function(require,module,exports){
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

},{}],197:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');

app.service('moment', require('./moment'));
app.service('ElyModal', require('./modal'));
app.service('UrlCache', require('./urlCache'));
app.service('WaitingScreen', require('./waitingScreen/waitingScreen'));
},{"./modal":198,"./moment":199,"./urlCache":202,"./waitingScreen/waitingScreen":203}],198:[function(require,module,exports){
'use strict';

module.exports = ['$modal', '$rootScope', function ($modal, $rootScope) {

    this.show = function (modalParams) {

        var scope;
        modalParams.animation = true;
        modalParams.controllerAs = 'ctrl';
        modalParams.bindToController = true;
        modalParams.backdrop = 'static';

        if (modalParams.hasOwnProperty('scope')) {
            scope = $rootScope.$new();
            angular.extend(scope, modalParams.scope);
            modalParams.scope = scope;
        }

        if (!modalParams.hasOwnProperty('controller')) {
            modalParams.controller = function () {
            };
        }


        return $modal.open(modalParams).result;
    };
}];

},{}],199:[function(require,module,exports){
'use strict';

var moment = require('moment');

module.exports = function () {
    moment.locale('de');
    return moment;
};

},{"moment":8}],200:[function(require,module,exports){
'use strict';

var toastPosition = {
    bottom: false,
    top: true,
    left: false,
    right: true
};

var getToastPosition = function() {
    return Object.keys(toastPosition)
        .filter(function(pos) { return toastPosition[pos]; })
        .join(' ');
};

module.exports = ['$mdToast', function ($mdToast) {

    this.showError = function (errorMessage) {
        var toast = $mdToast.simple()
            .content(errorMessage)
            .theme("error-toast")
            .hideDelay(0)
            .action('OK')
            .highlightAction(false)
            .position(getToastPosition());
        $mdToast.show(toast);
    };
}];

},{}],201:[function(require,module,exports){
'use strict';

var app = angular.module('elyoosApp');

app.service('errorToast', require('./errorToast'));
},{"./errorToast":200}],202:[function(require,module,exports){
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

},{}],203:[function(require,module,exports){
'use strict';

module.exports = ['$modal', '$rootScope', function ($modal, $rootScope) {

    this.openScreen = function (loadingText) {
        var confirm, modalParams = {}, finished;

        modalParams.scope = $rootScope.$new(false);
        modalParams.show = true;
        modalParams.html = true;
        modalParams.templateUrl = 'app/modules/util/waitingScreen/waitingScreen.html';
        modalParams.placement = 'center';
        modalParams.backdrop = 'static';
        modalParams.title = loadingText;
        confirm = $modal(modalParams);

        finished = function () {
            confirm.hide();
        };

        return finished;
    };
}];

},{}],204:[function(require,module,exports){
module.exports={
  "name": "elyoos-client-test",
  "version": "1.0.0",
  "description": "elyoos",
  "repository": "",
  "dependencies": {
  },
  "devDependencies": {
    "browserify": "11.0.1",
    "babelify": "6.2.0",
    "phantomjs": "~1.9.13",
    "mocha": "~1.21.4",
    "karma": "~0.12.31",
    "karma-browserify": "4.2.1",
    "karma-chrome-launcher": "^0.1.4",
    "karma-phantomjs-launcher": "^0.1.4",
    "karma-firefox-launcher": "^0.1.4",
    "karma-mocha": "~0.1.10",
    "karma-chai": "~0.1.0",
    "karma-sinon": "~1.0.4",
    "karma-junit-reporter": "~0.2.2",
    "karma-coverage": "~0.2.6",
    "karma-ng-html2js-preprocessor": "~0.1.2",
    "browserify-istanbul": "0.1.2",
    "protractor": "~1.3.1",
    "selenium": "~2.20.0",
    "chromedriver": "~2.12.0",
    "underscore": "~1.7.0",
    "matchdep": "~0.3.0",
    "grunt": "~0.4.5",
    "grunt-browserify": "~3.8.0",
    "grunt-contrib-uglify": "~0.9.1",
    "grunt-karma": "~0.9.0",
    "grunt-sonar-runner": "~2.4.2",
    "grunt-angular-templates": "~0.5.7",
    "grunt-contrib-cssmin": "~0.10.0",
    "grunt-contrib-clean": "~0.6.0"
  },
  "browser": {
    "angular-ui-route": "./app/lib/angular/angular-ui-router.min.js",
    "angular-strap": "./app/lib/bootstrap/angular-strap.min.js",
    "angular-strap-tpl": "./app/lib/bootstrap/angular-strap.tpl.min.js",
    "ui-bootstrap": "./app/lib/bootstrap/ui-bootstrap-custom.min.js",
    "ui-bootstrap-tpls": "./app/lib/bootstrap/ui-bootstrap-custom-tpls.min.js",
    "moment": "./app/lib/moment/moment.js",
    "spin": "./app/lib/spin/spin.min.js",
    "infinit-scroll": "./app/lib/infiniteScroll/ng-infinite-scroll.min.js",
    "templates": "./app/dist/templates.js"
  }
}

},{}]},{},[10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,94,95,96,93,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,151,152,153,148,149,150,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203]);
