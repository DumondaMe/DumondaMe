<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="750px" :fullscreen="$vuetify.breakpoint.xsOnly">
            <question v-if="showPage === 1" @close-dialog="$emit('close-dialog')" @next="showPage++"
                      class="welcome-dialog" :hide-back-button="true">
                <stepper slot="header" :selected-step="showPage" @navigate-to-step="navigateToStep"></stepper>
            </question>
            <commitment v-if="showPage === 2" @close-dialog="$emit('close-dialog')" @next="showPage++"
                        @back="showPage--" class="welcome-dialog">
                <stepper slot="header" :selected-step="showPage" @navigate-to-step="navigateToStep"></stepper>
            </commitment>
            <trust-circle v-if="showPage === 3" @close-dialog="$emit('close-dialog')" @next="$emit('close-dialog')"
                          @back="showPage--" class="welcome-dialog" :loading="loading">
                <stepper slot="header" :selected-step="showPage" @navigate-to-step="navigateToStep"></stepper>
            </trust-circle>
        </v-dialog>
    </v-layout>
</template>

<script>
    import Question from '../welcomeDialog/Question';
    import Commitment from '../welcomeDialog/Commitment';
    import TrustCircle from '../welcomeDialog/TrustCircle';
    import Stepper from './Stepper';

    export default {
        data() {
            return {dialog: true, showPage: 1, loading: false}
        },
        components: {Stepper,  Question, Commitment, TrustCircle},
        methods: {
            navigateToStep(step) {
                this.showPage = step;
            }
        }
    }
</script>

<style lang="scss">

</style>
