<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="650px" :fullscreen="$vuetify.breakpoint.xsOnly">
            <step1 @close-dialog="$emit('close-dialog')" @next="toStep2" v-show="step === 1">
            </step1>
            <step2 @close-dialog="$emit('close-dialog')" @next="step++" @back="step--" v-show="step === 2">
            </step2>
            <step3 @close-dialog="$emit('close-dialog')" @next="toStep4" @back="step--" v-show="step === 3">
            </step3>
            <step4 @close-dialog="$emit('close-dialog')" @back="step--" v-show="step === 4"
                   :contacts="contacts" :text="text" :language="language">
            </step4>
        </v-dialog>
    </v-layout>
</template>

<script>
    import Step1 from './Step1';
    import Step2 from './Step2';
    import Step3 from './Step3';
    import Step4 from './Step4';

    export default {
        data() {
            return {
                dialog: true, contacts: [], text: '', language: 'de', step: 1
            }
        },
        components:
            {Step1, Step2, Step3, Step4},
        methods: {
            toStep2(contacts) {
                this.contacts = contacts;
                this.step++;
            },
            toStep4({text, language}) {
                this.text = text;
                this.language = language;
                this.step++;
            }
        }
    }
</script>

<style lang="scss">

</style>
