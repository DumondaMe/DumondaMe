'use strict';

let getTestXML = function () {
return `<?xml version="1.0" encoding="UTF-8" standalone="no"?><D:multistatus xmlns:D="DAV:"><D:response><D:href>/CardDavProxy/carddav/AddressBook/2876184//Contact/AddressBook/2876184/Contact/418615909</D:href><D:propstat><D:prop><C:address-data xmlns:C="urn:ietf:params:xml:ns:carddav">BEGIN:VCARD&#13;
VERSION:3.0&#13;
N:Muster;Hans;;;&#13;
FN:Hans Muster&#13;
NAME:Muster&#13;
UID:346e8334-a478-3e9c-9724-2ca1af22c8ce&#13;
EMAIL;TYPE=HOME:test@elyoos.org&#13;
CATEGORIES:Neuzugänge&#13;
PRODID:-//1&amp;1 Mail &amp; Media GmbH/GMX.NET CardDAV Server 10/NONSGML//DE&#13;
END:VCARD&#13;
</C:address-data></D:prop><D:status>HTTP/1.1 200 OK</D:status></D:propstat></D:response><D:response><D:href>/CardDavProxy/carddav/AddressBook/2876184//Contact/AddressBook/2876184/Contact/567546749</D:href><D:propstat><D:prop><C:address-data xmlns:C="urn:ietf:params:xml:ns:carddav">BEGIN:VCARD&#13;
VERSION:3.0&#13;
N:;Hans;;;&#13;
FN:Hans Muster2&#13;
UID:324c4f21-0a6a-3536-b3a9-4a1c824395ce&#13;
EMAIL;TYPE=HOME:test2@elyoos.org&#13;
PRODID:-//1&amp;1 Mail &amp; Media GmbH/GMX.NET CardDAV Server 10/NONSGML//DE&#13;
END:VCARD&#13;
</C:address-data></D:prop><D:status>HTTP/1.1 200 OK</D:status></D:propstat></D:response></D:multistatus>`;
};

module.exports = {
    getTestXML: getTestXML
};
