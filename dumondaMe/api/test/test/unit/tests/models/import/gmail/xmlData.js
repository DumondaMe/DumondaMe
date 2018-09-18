'use strict';

let getTestXML = function () {
return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:batch="http://schemas.google.com/gdata/batch" xmlns:gContact="http://schemas.google.com/contact/2008" xmlns:gd="http://schemas.google.com/g/2005" xmlns:openSearch="http://a9.com/-/spec/opensearchrss/1.0/">
 <id>climberwoodi@gmail.com</id>
 <updated>2017-02-18T14:55:34.758Z</updated>
 <category scheme="http://schemas.google.com/g/2005#kind" term="http://schemas.google.com/contact/2008#contact"/>
 <title type="text">Roger Waldvogel's Contacts</title>
 <link rel="alternate" type="text/html" href="https://www.google.com/"/>
 <link rel="http://schemas.google.com/g/2005#feed" type="application/atom+xml" href="https://www.google.com/m8/feeds/contacts/climberwoodi%40gmail.com/full"/>
 <link rel="http://schemas.google.com/g/2005#post" type="application/atom+xml" href="https://www.google.com/m8/feeds/contacts/climberwoodi%40gmail.com/full"/>
 <link rel="http://schemas.google.com/g/2005#batch" type="application/atom+xml" href="https://www.google.com/m8/feeds/contacts/climberwoodi%40gmail.com/full/batch"/>
 <link rel="self" type="application/atom+xml" href="https://www.google.com/m8/feeds/contacts/climberwoodi%40gmail.com/full?max-results=25"/>
 <link rel="next" type="application/atom+xml" href="https://www.google.com/m8/feeds/contacts/climberwoodi%40gmail.com/full?max-results=25&amp;start-index=26"/>
 <author>
  <name>Roger Waldvogel</name>
  <email>climberwoodi@gmail.com</email>
 </author>
 <generator version="1.0" uri="http://www.google.com/m8/feeds">Contacts</generator>
 <openSearch:totalResults>203</openSearch:totalResults>
 <openSearch:startIndex>1</openSearch:startIndex>
 <openSearch:itemsPerPage>25</openSearch:itemsPerPage>
 <entry>
  <id>http://www.google.com/m8/feeds/contacts/climberwoodi%40gmail.com/base/454dc78ddb2c5c</id>
  <updated>2014-01-22T17:37:52.546Z</updated>
  <category scheme="http://schemas.google.com/g/2005#kind" term="http://schemas.google.com/contact/2008#contact"/>
  <title type="text">Hans Muster</title>
  <link rel="http://schemas.google.com/contacts/2008/rel#edit-photo" type="image/*" href="https://www.google.com/m8/feeds/photos/media/climberwoodi%40gmail.com/454dc78ddb2c5c/1B2M2Y8AsgTpgAmY7PhCfg"/>
  <link rel="self" type="application/atom+xml" href="https://www.google.com/m8/feeds/contacts/climberwoodi%40gmail.com/full/454dc78ddb2c5c"/>
  <link rel="edit" type="application/atom+xml" href="https://www.google.com/m8/feeds/contacts/climberwoodi%40gmail.com/full/454dc78ddb2c5c/1390412272546001"/>
  <gd:phoneNumber rel="http://schemas.google.com/g/2005#mobile" uri="tel:+41-79-111-11-111">+41791111111</gd:phoneNumber>
 </entry>
 <entry>
  <id>http://www.google.com/m8/feeds/contacts/climberwoodi%40gmail.com/base/7453d18ea96385</id>
  <updated>2016-11-06T09:39:32.480Z</updated>
  <category scheme="http://schemas.google.com/g/2005#kind" term="http://schemas.google.com/contact/2008#contact"/>
  <title type="text"/>
  <link rel="http://schemas.google.com/contacts/2008/rel#edit-photo" type="image/*" href="https://www.google.com/m8/feeds/photos/media/climberwoodi%40gmail.com/7453d18ea96385/1B2M2Y8AsgTpgAmY7PhCfg"/>
  <link rel="self" type="application/atom+xml" href="https://www.google.com/m8/feeds/contacts/climberwoodi%40gmail.com/full/7453d18ea96385"/>
  <link rel="edit" type="application/atom+xml" href="https://www.google.com/m8/feeds/contacts/climberwoodi%40gmail.com/full/7453d18ea96385/1478425172480000"/>
  <gd:email rel="http://schemas.google.com/g/2005#other" address="test.dumondaMe1@dumonda.me" primary="true"/>
 </entry>
 <entry>
  <id>http://www.google.com/m8/feeds/contacts/climberwoodi%40gmail.com/base/88238090e05c038</id>
  <updated>2016-09-21T10:04:47.340Z</updated>
  <category scheme="http://schemas.google.com/g/2005#kind" term="http://schemas.google.com/contact/2008#contact"/>
  <title type="text">Hans Muster3</title>
  <link rel="http://schemas.google.com/contacts/2008/rel#edit-photo" type="image/*" href="https://www.google.com/m8/feeds/photos/media/climberwoodi%40gmail.com/88238090e05c038/1B2M2Y8AsgTpgAmY7PhCfg"/>
  <link rel="self" type="application/atom+xml" href="https://www.google.com/m8/feeds/contacts/climberwoodi%40gmail.com/full/88238090e05c038"/>
  <link rel="edit" type="application/atom+xml" href="https://www.google.com/m8/feeds/contacts/climberwoodi%40gmail.com/full/88238090e05c038/1474452287340001"/>
  <gd:email rel="http://schemas.google.com/g/2005#other" address="test.dumondaMe2@dumonda.me" primary="true"/>
 </entry>
 <entry>
  <id>http://www.google.com/m8/feeds/contacts/climberwoodi%40gmail.com/base/88238090e05c038</id>
  <updated>2016-09-21T10:04:47.340Z</updated>
  <category scheme="http://schemas.google.com/g/2005#kind" term="http://schemas.google.com/contact/2008#contact"/>
  <title type="text">Hans Muster4</title>
  <link rel="http://schemas.google.com/contacts/2008/rel#edit-photo" type="image/*" href="https://www.google.com/m8/feeds/photos/media/climberwoodi%40gmail.com/88238090e05c038/1B2M2Y8AsgTpgAmY7PhCfg"/>
  <link rel="self" type="application/atom+xml" href="https://www.google.com/m8/feeds/contacts/climberwoodi%40gmail.com/full/88238090e05c038"/>
  <link rel="edit" type="application/atom+xml" href="https://www.google.com/m8/feeds/contacts/climberwoodi%40gmail.com/full/88238090e05c038/1474452287340001"/>
  <gd:email rel="http://schemas.google.com/g/2005#other" address="test.dumondaMe3@dumonda.me" primary="true"/>
 </entry>
</feed>`;
};

module.exports = {
    getTestXML: getTestXML
};
