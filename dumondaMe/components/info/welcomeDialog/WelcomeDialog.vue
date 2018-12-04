<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="750px" :fullscreen="$vuetify.breakpoint.xsOnly">
            <welcome v-if="showPage === 0" @close-dialog="$emit('close-dialog')" @next="showPage++"
                     :loading="loading" class="welcome-dialog">
            </welcome>
            <profile-image v-if="showPage === 1" @close-dialog="$emit('close-dialog')" @next="showPage++"
                           class="welcome-dialog">
                <stepper slot="header" :selected-step="showPage" @navigate-to-step="navigateToStep"></stepper>
            </profile-image>
            <privacy v-if="showPage === 2" @close-dialog="$emit('close-dialog')" @next="showPage++" @back="showPage--"
                     :init-privacy-mode="settings.privacyMode" class="welcome-dialog"
                     :init-show-profile-activity="settings.showProfileActivity"
                     @privacy-mode-changed="privacyModeChanged">
                <stepper slot="header" :selected-step="showPage" @navigate-to-step="navigateToStep"></stepper>
            </privacy>
            <topics v-if="showPage === 3" @close-dialog="$emit('close-dialog')" @next="nextTopics" @back="showPage--"
                    :init-topics="settings.interestedTopics" class="welcome-dialog">
                <stepper slot="header" :selected-step="showPage" @navigate-to-step="navigateToStep"></stepper>
            </topics>
            <question v-if="showPage === 4" @close-dialog="$emit('close-dialog')" @next="showPage++" @back="showPage--"
                      class="welcome-dialog">
                <stepper slot="header" :selected-step="showPage" @navigate-to-step="navigateToStep"></stepper>
            </question>
            <commitment v-if="showPage === 5" @close-dialog="$emit('close-dialog')" @next="showPage++"
                        @back="showPage--" class="welcome-dialog">
                <stepper slot="header" :selected-step="showPage" @navigate-to-step="navigateToStep"></stepper>
            </commitment>
            <trust-circle v-if="showPage === 6" @close-dialog="$emit('close-dialog')" @next="finish" @back="showPage--"
                          class="welcome-dialog" :loading="loading">
                <stepper slot="header" :selected-step="showPage" @navigate-to-step="navigateToStep"></stepper>
            </trust-circle>
        </v-dialog>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
        <v-snackbar top v-model="showWarning" color="warning" :timeout="0">
            {{$t("pages:commitment.createDialog.warningToSmallImage")}}
            <v-btn dark flat @click="showWarning = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </v-layout>
</template>

<script>
    import Welcome from './Welcome';
    import ProfileImage from './ProfileImage';
    import Privacy from './Privacy';
    import Topics from './Topics';
    import Question from './Question';
    import Commitment from './Commitment';
    import TrustCircle from './TrustCircle';
    import Stepper from './Stepper';

    export default {
        data() {
            return {dialog: true, showPage: 0, loading: false, showError: false, showWarning: false, settings: {}}
        },
        async mounted() {
            try {
                this.settings = await this.$axios.$get(`user/settings`);
            } catch (error) {
                this.showError = true;
            } finally {
                this.loading = false;
            }
        },
        components: {Stepper, Welcome, ProfileImage, Privacy, Topics, Question, Commitment, TrustCircle},
        methods: {
            async finish() {
                try {
                    this.loading = true;
                    await this.$axios.$post(`user/settings/finishWelcome`);
                    this.$emit('close-dialog');
                } catch (error) {
                    this.showError = true;
                } finally {
                    this.loading = false;
                }
            },
            nextTopics(topics) {
                this.settings.interestedTopics = topics;
                this.showPage++;
            },
            privacyModeChanged(newPrivacyMode) {
                this.settings.privacyMode = newPrivacyMode;
            },
            navigateToStep(step) {
                this.showPage = step;
            }
        }
    }
</script>

<style lang="scss">
    .welcome-dialog {
        #welcome-dialog-title {
            text-align: center;
            font-size: 28px;
            color: $primary-color;
            margin-bottom: 18px;
            @media screen and (max-width: $xs) {
                font-size: 22px;
            }
        }

        .mobile-dialog-content {
            padding-top: 0;
        }
    }
</style>
