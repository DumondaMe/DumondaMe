'use strict';

let getTestData = function () {
    return `{"@odata.context":"https://outlook.office.com/api/v2.0/$metadata#Me/Contacts",
    "value":[
    {"@odata.id":"https://outlook.office.com/api/v2.0/Users('00037ffe-0745-1b16-0000-000000000000@84df9e7f-e9f6-40af-b435-aaaaaaaaaaaa')/Contacts('AQMkADAwATM3ZmYAZS0wNzQ1LTFiMTYtMDACLTAwCgBGAAADBnODfiIFxkaPlrNMF4C4lwcAb5ktbIj080OVCpQSxeyWEwAAAgEOAAAAb5ktbIj080OVCpQSxeyWEwAAAQFRJAAAAA==')",
    "@odata.etag":"WEQAAABYAAABvmS1siPTzQ5UKlBLF7JYTAAAAAVEi",
    "Id":"AQMkADAwATM3ZmYAZS0wNzQ1LTFiMTYtMDACLTAwCgBGAAADBnODfiIFxkaPlrNMF4C4lwcAb5ktbIj080OVCpQSxeyWEwAAAgEOAAAAb5ktbIj080OVCpQSxeyWEwAAAQFRJAAAAA==",
    "CreatedDateTime":"2017-02-19T11:13:53Z",
    "LastModifiedDateTime":"2017-02-19T11:13:54Z",
    "ChangeKey":"EQAAABYAAABvmS1siPTzQ5UKlBLF7JYTAAAAAVEi",
    "Categories":[],
    "ParentFolderId":"AQMkADAwATM3ZmYAZS0wNzQ1LTFiMTYtMDACLTAwCgAuAAADBnODfiIFxkaPlrNMF4C4lwEAb5ktbIj080OVCpQSxeyWEwAAAgEOAAAA",
    "Birthday":null,
    "FileAs":"Muster2, Hans",
    "DisplayName":"Hans Muster2",
    "GivenName":"Hans",
    "Initials":null,
    "MiddleName":null,
    "NickName":null,
    "Surname":"Muster2",
    "Title":null,
    "YomiGivenName":null,
    "YomiSurname":null,
    "YomiCompanyName":null,
    "Generation":null,
    "ImAddresses":[],
    "JobTitle":null,
    "CompanyName":null,
    "Department":null,
    "OfficeLocation":null,
    "Profession":null,
    "BusinessHomePage":null,
    "AssistantName":null,
    "Manager":null,
    "HomePhones":[],
    "MobilePhone1":null,
    "BusinessPhones":[],
    "SpouseName":null,
    "PersonalNotes":null,
    "Children":[],
    "EmailAddresses":[{"Name":"irgendwas","Address":"hans.muster2@dumonda.me"}],
    "HomeAddress":{},
    "BusinessAddress":{},
    "OtherAddress":{}},
    {"@odata.id":"https://outlook.office.com/api/v2.0/Users('00037ffe-0745-1b16-0000-000000000000@84df9e7f-e9f6-40af-b435-aaaaaaaaaaaa')/Contacts('AQMkADAwATM3ZmYAZS0wNzQ1LTFiMTYtMDACLTAwCgBGAAADBnODfiIFxkaPlrNMF4C4lwcAb5ktbIj080OVCpQSxeyWEwAAAgEOAAAAb5ktbIj080OVCpQSxeyWEwAAAQFRIwAAAA==')",
    "@odata.etag":"WEQAAABYAAABvmS1siPTzQ5UKlBLF7JYTAAAAAVEh",
    "Id":"AQMkADAwATM3ZmYAZS0wNzQ1LTFiMTYtMDACLTAwCgBGAAADBnODfiIFxkaPlrNMF4C4lwcAb5ktbIj080OVCpQSxeyWEwAAAgEOAAAAb5ktbIj080OVCpQSxeyWEwAAAQFRIwAAAA==",
    "CreatedDateTime":"2017-02-19T11:13:30Z",
    "LastModifiedDateTime":"2017-02-19T11:13:30Z",
    "ChangeKey":"EQAAABYAAABvmS1siPTzQ5UKlBLF7JYTAAAAAVEh",
    "Categories":[],
    "ParentFolderId":"AQMkADAwATM3ZmYAZS0wNzQ1LTFiMTYtMDACLTAwCgAuAAADBnODfiIFxkaPlrNMF4C4lwEAb5ktbIj080OVCpQSxeyWEwAAAgEOAAAA",
    "Birthday":null,
    "FileAs":"Kaiser, Sisi",
    "DisplayName":"Sisi Kaiser",
    "GivenName":"Sisi",
    "Initials":null,
    "MiddleName":null,
    "NickName":null,
    "Surname":"Kaiser",
    "Title":null,
    "YomiGivenName":null,
    "YomiSurname":null,
    "YomiCompanyName":null,
    "Generation":null,
    "ImAddresses":[],
    "JobTitle":null,
    "CompanyName":null,
    "Department":null,
    "OfficeLocation":null,
    "Profession":null,
    "BusinessHomePage":null,
    "AssistantName":null,
    "Manager":null,
    "HomePhones":[],
    "MobilePhone1":null,
    "BusinessPhones":[],
    "SpouseName":null,
    "PersonalNotes":null,
    "Children":[],
    "EmailAddresses":[],
    "HomeAddress":{},
    "BusinessAddress":{},
    "OtherAddress":{}},
    {"@odata.id":"https://outlook.office.com/api/v2.0/Users('00037ffe-0745-1b16-0000-000000000000@84df9e7f-e9f6-40af-b435-aaaaaaaaaaaa')/Contacts('AQMkADAwATM3ZmYAZS0wNzQ1LTFiMTYtMDACLTAwCgBGAAADBnODfiIFxkaPlrNMF4C4lwcAb5ktbIj080OVCpQSxeyWEwAAAgEOAAAAb5ktbIj080OVCpQSxeyWEwAAAQFRIgAAAA==')",
    "@odata.etag":"WEQAAABYAAABvmS1siPTzQ5UKlBLF7JYTAAAAAVEg",
    "Id":"AQMkADAwATM3ZmYAZS0wNzQ1LTFiMTYtMDACLTAwCgBGAAADBnODfiIFxkaPlrNMF4C4lwcAb5ktbIj080OVCpQSxeyWEwAAAgEOAAAAb5ktbIj080OVCpQSxeyWEwAAAQFRIgAAAA==",
    "CreatedDateTime":"2017-02-19T11:13:10Z",
    "LastModifiedDateTime":"2017-02-19T11:13:10Z",
    "ChangeKey":"EQAAABYAAABvmS1siPTzQ5UKlBLF7JYTAAAAAVEg",
    "Categories":[],
    "ParentFolderId":"AQMkADAwATM3ZmYAZS0wNzQ1LTFiMTYtMDACLTAwCgAuAAADBnODfiIFxkaPlrNMF4C4lwEAb5ktbIj080OVCpQSxeyWEwAAAgEOAAAA",
    "Birthday":null,
    "FileAs":"Muster,Hans",
    "DisplayName":"Hans Muster",
    "GivenName":"Hans",
    "Initials":null,
    "MiddleName":null,
    "NickName":null,
    "Surname":"Muster",
    "Title":null,
    "YomiGivenName":null,
    "YomiSurname":null,
    "YomiCompanyName":null,
    "Generation":null,
    "ImAddresses":[],
    "JobTitle":null,
    "CompanyName":null,
    "Department":null,
    "OfficeLocation":null,
    "Profession":null,
    "BusinessHomePage":null,
    "AssistantName":null,
    "Manager":null,
    "HomePhones":[],
    "MobilePhone1":null,
    "BusinessPhones":[],
    "SpouseName":null,
    "PersonalNotes":null,
    "Children":[],
    "EmailAddresses":[{"Name":"hans.muster@dumonda.me","Address":"hans.muster@dumonda.me"}],
    "HomeAddress":{},
    "BusinessAddress":{},
    "OtherAddress":{}},
    {"@odata.id":"https://outlook.office.com/api/v2.0/Users('00037ffe-0745-1b16-0000-000000000000@84df9e7f-e9f6-40af-b435-aaaaaaaaaaaa')/Contacts('AQMkADAwATM3ZmYAZS0wNzQ1LTFiMTYtMDACLTAwCgBGAAADBnODfiIFxkaPlrNMF4C4lwcAb5ktbIj080OVCpQSxeyWEwAAAgEOAAAAb5ktbIj080OVCpQSxeyWEwAAAQFRIgAAAA==')",
    "@odata.etag":"WEQAAABYAAABvmS1siPTzQ5UKlBLF7JYTAAAAAVEg",
    "Id":"AQMkADAwATM3ZmYAZS0wNzQ1LTFiMTYtMDACLTAwCgBGAAADBnODfiIFxkaPlrNMF4C4lwcAb5ktbIj080OVCpQSxeyWEwAAAgEOAAAAb5ktbIj080OVCpQSxeyWEwAAAQFRIgAAAA==",
    "CreatedDateTime":"2017-02-19T11:13:10Z",
    "LastModifiedDateTime":"2017-02-19T11:13:10Z",
    "ChangeKey":"EQAAABYAAABvmS1siPTzQ5UKlBLF7JYTAAAAAVEg",
    "Categories":[],
    "ParentFolderId":"AQMkADAwATM3ZmYAZS0wNzQ1LTFiMTYtMDACLTAwCgAuAAADBnODfiIFxkaPlrNMF4C4lwEAb5ktbIj080OVCpQSxeyWEwAAAgEOAAAA",
    "Birthday":null,
    "FileAs":"Muster,Hans",
    "DisplayName":null,
    "GivenName":"Hans",
    "Initials":null,
    "MiddleName":null,
    "NickName":null,
    "Surname":"Muster",
    "Title":null,
    "YomiGivenName":null,
    "YomiSurname":null,
    "YomiCompanyName":null,
    "Generation":null,
    "ImAddresses":[],
    "JobTitle":null,
    "CompanyName":null,
    "Department":null,
    "OfficeLocation":null,
    "Profession":null,
    "BusinessHomePage":null,
    "AssistantName":null,
    "Manager":null,
    "HomePhones":[],
    "MobilePhone1":null,
    "BusinessPhones":[],
    "SpouseName":null,
    "PersonalNotes":null,
    "Children":[],
    "EmailAddresses":[{"Name":"hans.muster3@dumonda.me","Address":"hans.muster3@dumonda.me"}],
    "HomeAddress":{},
    "BusinessAddress":{},
    "OtherAddress":{}}
    ]}`;
};

module.exports = {
    getTestData: getTestData
};
