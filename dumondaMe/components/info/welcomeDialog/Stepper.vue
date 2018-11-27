<template>
    <stepper-header>
        <step :number="1" :selected-step="selectedStep">
        </step>
        <v-divider></v-divider>
        <step :number="2" :selected-step="selectedStep">
        </step>
        <v-divider></v-divider>
        <step :number="3" :selected-step="selectedStep">
        </step>
        <v-divider></v-divider>
        <step :number="4" :selected-step="selectedStep">
        </step>
        <v-divider></v-divider>
        <step :number="5" :selected-step="selectedStep">
        </step>
        <v-divider></v-divider>
        <step :number="6" :selected-step="selectedStep">
        </step>
        <v-divider></v-divider>
        <step :number="7" :selected-step="selectedStep">
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
