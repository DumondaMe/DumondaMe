<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="650px" :fullscreen="$vuetify.breakpoint.xsOnly"
                  id="import-contact-dialog">
            <v-card id="import-contact-container">
                <div>

                </div>
                <v-card-text class="mobile-dialog-content">
                    <div class="import-source-container" @click="openGoogleImport">
                        <img :src="getImportUrl('gmail.png')"/>
                    </div>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click.native="$emit('close-dialog')">
                        {{$t("common:button.close")}}
                    </v-btn>
                    <v-btn color="primary" @click.native="$emit('close-dialog')">
                        {{$t("common:button.ok")}}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>

    import oAuthWindow from './oAuthWindow';
    import parseGoogleOAuthUrl from './parseGoogleOAuthUrl';

    export default {
        data() {
            return {dialog: true, oAuthWindow: null, checkWindowInterval: null, contacts: []}
        },
        components: {},
        methods: {
            getImportUrl(image) {
                return `${process.env.staticUrl}/img/import/${image}`;
            },
            openGoogleImport() {
                if (this.oAuthWindow === null) {
                    let sendImportRequest = this.sendImportRequest;
                    let window = oAuthWindow.open(process.env.oAuthGoogleClientUrl,
                        async function (url) {
                            try {
                                if (typeof url === 'string') {
                                    let code = parseGoogleOAuthUrl.parse(url);
                                    await sendImportRequest(code);
                                }
                            } catch (e) {
                                console.error(e);
                            }
                        });
                    this.oAuthWindow = window.window;
                    this.checkWindowInterval = window.interval;
                }
            },
            async sendImportRequest(code) {
                let response = await this.$axios.$get('import/contact/gmail', {params: {code}});
                debugger
                this.contacts = response.addresses;
            },
            closeOAuthWindow() {
                if (this.oAuthWindow && this.oAuthWindow.close) {
                    this.oAuthWindow.close();
                    this.oAuthWindow = null;
                }
                if (this.checkWindowInterval) {
                    clearInterval(this.checkWindowInterval);
                }
            }
        },
        beforeDestroy() {
            this.closeOAuthWindow();
        },
        computed: {}
    }
</script>

<style lang="scss">
    #import-contact-dialog {
        #import-contact-container {
            .import-source-container {
                cursor: pointer;
            }
        }
    }
</style>
