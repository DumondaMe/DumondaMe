const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const passport = require('passport');
const config = require('./nuxt.config.json');
config.session.session.store = new RedisStore(config.session.redisSession);

passport.deserializeUser(function (user, done) {
    done(null, user);
});

module.exports = {
    head: {
        title: 'Elyoos',
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {hid: 'description', name: 'description', content: 'Nuxt.js project'}
        ],
        link: [
            {rel: 'icon', type: 'image/x-icon', href: 'favicon.ico'}
        ]
    },
    modules: [
        'nuxt-sass-resources-loader'
    ],
    sassResources: [
        path.resolve(__dirname, 'assets/style/variables.scss')
    ],
    loading: {color: '#3B8070'},
    build: {
        vendor: ['axios']
    },
    plugins: [
        { src: '~/plugins/axios', ssr: true }
    ],
    serverMiddleware: [

        bodyParser.json(),
        session(config.session.session),

        passport.initialize(),
        passport.session()
    ]
};
