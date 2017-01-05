/**
 * Module that will handle our authentication tasks
 */
'use strict';

let user = require('./user')();
let LocalStrategy = require('passport-local').Strategy;
let passwordEncryption = require('./passwordEncryption');
let logger = require('./logging').getLogger(__filename);

/**
 * A helper method to retrieve a user from a local DB and ensure that the provided password matches.
 * @param req
 * @param res
 * @param next
 */
exports.localStrategy = function () {

    return new LocalStrategy(function (username, password, done) {

        let dbUser;
        //Retrieve the user from the database by login
        user.searchUserWithEmail(username).then(function (user) {

            //If we couldn't find a matching user, flash a message explaining what happened
            if (!user) {
                logger.warn('User ' + username + ' could not be found on database ');
                return done(null, false, {
                    message: 'Login not found'
                });
            }
            dbUser = user;
            return passwordEncryption.comparePassword(password, user.password);
        }).then(function (samePassword) {
            if (!samePassword) {
                logger.warn('Wrong password for user ' + username);
                return done(null, false, {
                    message: 'Incorrect Password'
                });
            }
            done(null, dbUser);
        }).catch(function (err) {
            logger.error('Database error when looking for user on database ' + username, {}, {error: err});
            return done(err);
        });
    });
};

exports.isAuthenticated = function () {
    return function (req, res, next) {
        if (req.isAuthenticated()) {
            next();
        } else {
            next(new Error(401));
        }
    };
};
