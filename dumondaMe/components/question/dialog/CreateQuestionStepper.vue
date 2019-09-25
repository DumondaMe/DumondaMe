<template>
    <div>
        <div id="mobile-create-question-dialog-header">
            {{$t('pages:question.createDialog.title')}}
        </div>
        <stepper-header>
            <step :name="$t('common:question')" :number="1" :selected-step="selectedStep"
                  @navigate-to-step="(number) => $emit('navigate-to-step', number)">
            </step>
            <v-divider></v-divider>
            <step :name="$t('common:topic')" :number="2" :selected-step="selectedStep">
            </step>
        </stepper-header>
    </div>
</template>

<script>
    import StepperHeader from '~/components/common/stepper/StepperHeader'
    import Step from '~/components/common/stepper/Step'

    export default {
        props: {selectedStep: Number},
        components: {StepperHeader, Step},
    }
</script>

<style lang="scss">
    #mobile-create-question-dialog-header {
        @media screen and (min-width: $xs) {
            display: none;
        }

        padding: 16px 24px;
        font-weight: 500;
        border-bottom: 1px solid $divider;
    }
</style>
