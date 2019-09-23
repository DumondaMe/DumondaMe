<template>
    <v-dialog v-model="dialog" scrollable persistent max-width="250" class="dialog-login">
        <v-card id="dialog-login-required">
            <v-card-text id="dialog-login-required-content">
                <p v-if="loginDescription">{{loginDescription}}</p>
                <p v-else>{{$t("common:loginRequiredInfo")}}</p>
                <div>
                    <v-btn color="primary" outlined @click="goToLogin()" class="link-button">
                        {{$t("common:toolbar.login")}}
                    </v-btn>
                </div>
                <div>
                    <v-btn color="secondary" @click="goToRegister()" class="link-button">
                        {{$t("common:button.register")}}
                    </v-btn>
                </div>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="action-container">
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click.native="$emit('close-dialog')">
                    {{$t("common:button.close")}}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        props: ['loginDescription'],
        data() {
            return {dialog: true}
        },
        methods: {
            goToLogin() {
                this.$router.push({name: 'login'});
                this.$emit('close-dialog');
            },
            goToRegister() {
                this.$router.push({name: 'register'});
                this.$emit('close-dialog');
            }
        }
    }
</script>

<style lang="scss">
    #dialog-login-required {
        max-width: 250px;

        #dialog-login-required-content {
            max-width: 250px;
            padding-top: 16px;

            p {
                font-size: 16px;
                font-weight: 300;
            }

            .link-button {
                width: 100%;
                margin: 6px 0 6px 0;
            }
        }
    }

    .v-dialog__container.dialog-login {
        .v-dialog {
            min-width: auto;
        }
    }
</style>
