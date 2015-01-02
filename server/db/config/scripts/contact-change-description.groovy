if(!ctx._source.userAsContact.id.contains(contactId)) {
    ctx._source.userAsContact += contact;}
else {
    for (int i = 0; i < ctx._source.userAsContact.size(); i++) {
        if (ctx._source.userAsContact[i].id == contactId) {
            ctx._source.userAsContact[i].description = description;
            break;
        }
    }
}