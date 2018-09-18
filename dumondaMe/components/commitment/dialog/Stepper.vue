<template>
    <stepper-header>
        <step :name="$t('pages:commitment.createDialog.stepWebsite')" :number="1" :selected-step="selectedStep">
        </step>
        <v-divider></v-divider>
        <step :name="$t('pages:commitment.createDialog.stepData')" :number="2" :selected-step="selectedStep">
        </step>
        <v-divider></v-divider>
        <step :name="$t('pages:commitment.createDialog.stepRegion')" :number="3" :selected-step="selectedStep">
        </step>
        <v-divider></v-divider>
        <step :name="$t('pages:commitment.createDialog.stepTopic')" :number="4" :selected-step="selectedStep">
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
