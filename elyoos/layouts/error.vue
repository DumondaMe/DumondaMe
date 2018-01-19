<template>
    <div>
        <div v-if="error.statusCode !== 401">
            <div class="error-page">
                <h1 class="error-code">{{ error.statusCode }}</h1>
                <div class="error-wrapper-message">
                    <h2 class="error-message">{{ error.message }}</h2>
                </div>
                <p v-if="error.statusCode === 404">
                    <nuxt-link class="error-link" to="/">Zurück zur Startseite</nuxt-link>
                </p>
            </div>
        </div>
        <div v-else>
            <div id="status-info">
                <p id="status-info-text">Um auf diese Seite zugreifen zu können muss du eingeloggt sein.</p>
            </div>
            <v-layout row wrap>
                <v-flex xs12 md6>
                    <login email=""></login>
                </v-flex>
                <v-flex xs12 md6>
                    <register-link></register-link>
                </v-flex>
            </v-layout>
        </div>
    </div>
</template>

<script>
    import Login from '~/components/login/Login.vue';
    import RegisterLink from '~/components/login/RegisterLink.vue';

    export default {
        props: ['error'],
        components: {Login, RegisterLink}
    }
</script>

<style scoped>
    .error-page {
        color: #000;
        background: #fff;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        position: absolute;
        text-align: center;
        padding-top: 20%;
    }

    #status-info {
        margin-bottom: 24px;
        color: #EF5350;
    }

    .error-code {
        display: inline-block;
        font-size: 24px;
        font-weight: 500;
        vertical-align: top;
        border-right: 1px solid rgba(0, 0, 0, 0.298039);
        margin: 0px 20px 0px 0px;
        padding: 10px 23px;
    }

    .error-wrapper-message {
        display: inline-block;
        text-align: left;
        line-height: 49px;
        height: 49px;
        vertical-align: middle;
    }

    .error-message {
        font-size: 14px;
        font-weight: normal;
        margin: 0px;
        padding: 0px;
    }

    .error-link {
        color: #00BCD4;
        font-weight: normal;
        text-decoration: none;
        font-size: 14px;
    }
</style>
