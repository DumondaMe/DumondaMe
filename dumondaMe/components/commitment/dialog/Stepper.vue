<template>
    <stepper-header>
        <step :name="$t('pages:commitment.createDialog.stepRegion')" :number="1" :selected-step="selectedStep"
              @navigate-to-step="(number) => $emit('navigate-to-step', number)">
        </step>
        <v-divider></v-divider>
        <step :name="$t('pages:commitment.createDialog.stepTopic')" :number="2" :selected-step="selectedStep"
              @navigate-to-step="(number) => $emit('navigate-to-step', number)">
        </step>
        <v-divider></v-divider>
        <step :name="$t('pages:commitment.createDialog.stepWebsite')" :number="3" :selected-step="selectedStep"
              @navigate-to-step="(number) => $emit('navigate-to-step', number)">
        </step>
        <v-divider></v-divider>
        <step :name="$t('pages:commitment.createDialog.stepData')" :number="4" :selected-step="selectedStep"
              @navigate-to-step="(number) => $emit('navigate-to-step', number)">
        </step>
    </stepper-header>
</template>

<script>
    import StepperHeader from '~/components/common/stepper/StepperHeader'
    import Step from '~/components/common/stepper/Step'

    export default {
        props: {selectedStep: Number},
        components: {StepperHeader, Step},
    }
</script>
