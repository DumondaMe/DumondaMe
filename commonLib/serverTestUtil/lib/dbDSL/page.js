'use strict';

let db = require('../db');
let Url = require('url-parse');
let dbConnectionHandling = require('./dbConnectionHandling');

let createBookPage = function (pageId, data) {
    data.title = data.title || `page${pageId}Title`;
    data.description = data.description || `page${pageId}Description`;
    data.publishDate = data.publishDate || null;
    data.adminId = data.adminId || '1';
    data.modified = data.modified || data.created;
    dbConnectionHandling.getCommands().push(db.cypher().match(`(user:User {userId: {adminId}})`)
        .create(`(:Page  {title: {title}, label: 'Book', language: {language}, description: {description}, created: {created},
                  modified: {modified}, pageId: {pageId}, author: {author}, publishDate: {publishDate}, topic: {topic}})<-[:IS_ADMIN]-(user)`)
        .end({
            pageId: pageId, title: data.title, description: data.description, adminId: data.adminId,
            language: data.language, topic: data.topic, created: data.created, modified: data.modified, author: data.author, publishDate: data.publishDate
        }).getCommand());
};

let createYoutubePage = function (pageId, data) {
    data.title = data.title || `page${pageId}Title`;
    data.description = data.description || `page${pageId}Description`;
    data.adminId = data.adminId || '1';
    data.modified = data.modified || data.created;
    dbConnectionHandling.getCommands().push(db.cypher().match(`(user:User {userId: {adminId}})`)
        .create(`(:Page  {title: {title}, label: 'Youtube', language: {language}, description: {description}, created: {created},
                 modified: {modified}, pageId: {pageId}, link: {link}, linkEmbed: {linkEmbed}, topic: {topic}})<-[:IS_ADMIN]-(user)`)
        .end({
            pageId: pageId, title: data.title, description: data.description, adminId: data.adminId,
            language: data.language, topic: data.topic, created: data.created, modified: data.modified, link: data.link, linkEmbed: data.linkEmbed
        }).getCommand());
};

let createLinkPage = function (pageId, data) {
    let hostname = new Url(data.link).host;
    data.heightPreviewImage = data.heightPreviewImage || null;
    data.title = data.title || `page${pageId}Title`;
    data.description = data.description || `page${pageId}Description`;
    data.adminId = data.adminId || '1';
    data.modified = data.modified || data.created;
    dbConnectionHandling.getCommands().push(db.cypher().match(`(user:User {userId: {adminId}})`)
        .create(`(:Page  {title: {title}, label: 'Link', language: {language}, description: {description}, created: {created},
                  modified: {modified}, pageId: {pageId}, link: {link}, hostname: {hostname}, heightPreviewImage: {heightPreviewImage}, topic: {topic}, 
                  linkHistory: [], linkHistoryDate: []})<-[:IS_ADMIN]-(user)`)
        .end({
            pageId: pageId, title: data.title, description: data.description, hostname: hostname, adminId: data.adminId,
            language: data.language, topic: data.topic, created: data.created, modified: data.modified, link: data.link, heightPreviewImage: data.heightPreviewImage
        }).getCommand());
};

let createGenericPage = function (pageId, data, addresses) {
    data.title = data.title || `generic${pageId}Title`;
    data.description = data.description || `page${pageId}Description`;
    data.website = data.website || null;
    data.modified = data.modified || data.created;
    data.importTC = data.importTC ? ':ImportTC' : '';
    dbConnectionHandling.getCommands().push(db.cypher().match("(user:User {userId: {adminId}})")
        .create(`(user)-[:IS_ADMIN]->(page:Page${data.importTC} {title: {title}, label: 'Generic', language: {language}, description: {description}, modified: {modified}, created: {created}, topic: {topic},
        pageId: {pageId}, website: {website}}) foreach (address in {addresses} | CREATE (page)-[:HAS]->(:Address {address: address.address, description: address.description, latitude: toFloat(address.lat), 
        longitude: toFloat(address.lng), addressId: address.addressId}))`)
        .end({
            pageId: pageId, adminId: data.adminId, title: data.title, description: data.description, language: data.language, topic: data.topic, created: data.created,
            modified: data.modified, addresses: addresses, website: data.website
        }).getCommand());
};

let addAdminToPage = function (adminId, pageId) {
    dbConnectionHandling.getCommands().push(db.cypher().match("(a:Page {pageId: {pageId}}), (b:User {userId: {adminId}})")
        .create("(b)-[:IS_ADMIN]->(a)")
        .end({pageId: pageId, adminId: adminId}).getCommand());
};

module.exports = {
    createBookPage: createBookPage,
    createYoutubePage: createYoutubePage,
    createLinkPage: createLinkPage,
    createGenericPage: createGenericPage,
    addAdminToPage: addAdminToPage
};