<template>
    <stepper-header>
        <step :name="$t('common:question')" :number="1" :selected-step="selectedStep">
        </step>
        <v-divider></v-divider>
        <step :name="$t('common:topic')" :number="2" :selected-step="selectedStep">
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
