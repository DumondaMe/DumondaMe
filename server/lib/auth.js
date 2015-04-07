/**
 * Module that will handle our authentication tasks
 */
'use strict';

var UserModel = require('../models/user/user');
var LocalStrategy = require('passport-local').Strategy;
var passwordEncryption = require('./passwordEncryption');
var logger = requireLogger.getLogger(__filename);

/**
 * A helper method to retrieve a user from a local DB and ensure that the provided password matches.
 * @param req
 * @param res
 * @param next
 */
exports.localStrategy = function () {

    return new LocalStrategy(function (username, password, done) {

        var dbUser;
        //Retrieve the user from the database by login
        UserModel.searchUserWithEmail(username).then(function (user) {

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
