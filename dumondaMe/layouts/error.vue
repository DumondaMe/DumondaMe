<template>
    <div>
        <div v-if="error.statusCode !== 401">
            <div class="error-page">
                <div v-if="error.statusCode === 404">
                    <h1 class="error-code">{{ error.statusCode }}</h1>
                    <div class="error-wrapper-message">
                        <h2 class="error-message">{{$t('pages:error.404.description')}}</h2>
                        <nuxt-link class="error-link" to="/">{{$t('pages:error.404.backToStartPage')}}</nuxt-link>
                    </div>
                </div>
                <div v-else-if="error.statusCode === 600">
                    <div class="error-wrapper-message">
                        <h2 class="error-message">{{$t('pages:error.offline.description')}}</h2>
                    </div>
                </div>
                <div v-else>
                    <h1 class="error-code">{{ error.statusCode }}</h1>
                    <div class="error-wrapper-message">
                        <h2 class="error-message">{{ error.message }}</h2>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <div id="status-info">
                <p id="status-info-text">{{$t('pages:error.401.description')}}</p>
            </div>
            <v-layout row wrap>
                <v-flex xs12 md6>
                    <login email="" :from-route="fromRoute"></login>
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
        components: {Login, RegisterLink},
        data() {
            return {fromRoute: null}
        },
        mounted: function () {
            //This is a workaround for 500 chunk error after deployment
            if (this.error.statusCode === 500
                && /^Loading chunk [0-9]+ failed/.test(this.error.message)
                && window.location.hash !== '#retry') {
                // the chunk might no longer be available due to a recent redeployment of the page
                // mark the page to don't trigger reload infinitely
                window.location.hash = '#retry';
                window.location.reload(true);
            }
        },
        beforeRouteEnter(to, fromRoute, next) {
            next(vm => {
                vm.fromRoute = fromRoute;
            })
        }
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
        font-size: 32px;
        font-weight: 500;
        vertical-align: top;
        color: #009e97;

        margin: 0px 20px 0px 0px;
        padding: 10px 23px;
    }

    .error-wrapper-message {
        font-size: 16px;
        padding-left: 18px;
        padding-right: 18px;
        display: inline-block;
        text-align: left;
        padding-bottom: 28px;
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
