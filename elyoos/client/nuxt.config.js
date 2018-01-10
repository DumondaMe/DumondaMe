const path = require('path');
const nodeExternals = require('webpack-node-externals');
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
            {rel: 'icon', type: 'image/x-icon', href: 'favicon.ico'},
            {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500|Material+Icons'}
        ]
    },
    modules: [
        'nuxt-sass-resources-loader'
    ],
    sassResources: [
        path.resolve(__dirname, 'assets/style/variables.scss')
    ],
    loading: false,
    transition: {
        name: 'page',
        mode: 'out-in',
        css: false,
        duration: 0
    },
    build: {
        babel: {
            plugins: [
                ["transform-imports", {
                    "vuetify": {
                        "transform": "vuetify/es5/components/${member}",
                        "preventFullImport": true
                    }
                }]
            ]
        },

        vendor: ['babel-polyfill',
            'i18next',
            '@panter/vue-i18next',
            '~/plugins/axios.js',
            '~/plugins/veeValidate.js',
            '~/plugins/vuetify.js'],

        extend (config, ctx) {
            if (ctx.isServer) {
                config.externals = [
                    nodeExternals({
                        whitelist: [/^vuetify/]
                    })
                ]
            }
        }
    },
    plugins: ['~/plugins/axios.js',
        '~/plugins/i18n.js',
        '~/plugins/veeValidate.js',
        '~/plugins/vuetify.js'],
    css: [
        '~/assets/style/app.styl'
    ],
    serverMiddleware: [

        bodyParser.json(),
        session(config.session.session),

        passport.initialize(),
        passport.session()
    ]
};
