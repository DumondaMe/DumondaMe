<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="500px"
                  :fullscreen="$vuetify.breakpoint.xsOnly">
            <v-card id="register-info-dialog">
                <v-card-text id="register-info-dialog-content" class="mobile-dialog-content">
                    <div id="image-networking">
                        <img :src="imageUrl"/>
                    </div>
                    <div v-html="$t('dialog:registerInfo.description')" class="register-text"></div>
                    <v-btn color="secondary" @click.native="navigateToRegister" class="register-button">
                        {{$t("dialog:registerInfo.register")}}
                    </v-btn>
                    <v-btn color="primary" outlined @click.native="navigateToLogin"
                           class="login-button">
                        {{$t("dialog:registerInfo.login")}}
                    </v-btn>
                    <v-btn color="primary" text @click.native="$emit('close-dialog')">
                        {{$t("dialog:registerInfo.buttonLater")}}
                    </v-btn>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
    export default {
        data() {
            return {dialog: true}
        },
        methods: {
            navigateToRegister() {
                this.$router.push({name: 'register'});
                this.$emit('close-dialog');
            },
            navigateToLogin() {
                this.$router.push({name: 'login'});
                this.$emit('close-dialog');
            }
        },
        computed: {
            imageUrl() {
                return `${process.env.staticUrl}/img/landingPagePublic/signUp.jpg`;
            }
        }
    }
</script>

<style lang="scss">
    #register-info-dialog {
        max-width: 700px;

        #dumonda-me-dialog-header {
            max-width: 700px;
            color: $secondary-color;
            text-align: center;
            font-size: 20px;
        }

        #register-info-dialog-content {
            max-width: 500px;
            text-align: center;
            font-size: 16px;
            color: $primary-text;
            font-weight: 300;

            #image-networking {
                img {
                    display: block;
                    margin: 0 auto 12px auto;
                    width: 250px;
                }
            }

            .register-text {
                margin-bottom: 18px;
            }

            .register-button {
                min-width: 250px;
                display: block;
                margin: 0 auto 12px auto;
            }

            .login-button {
                min-width: 250px;
                display: block;
                margin: 0 auto 18px auto;
            }
        }
    }
</style>
