for (int i = 0; i < _source.userAsContact.size(); i++) {
    if (_source.userAsContact[i].id == userId) {
        return _source.userAsContact[i].blocked;
    }
}
return null;