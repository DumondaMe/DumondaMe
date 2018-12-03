<template>
    <div class="step" :class="{'active-step': number === selectedStep, 'future-step': number > selectedStep}">
        <span class="step-number" :class="{'step-number-without-name': !name}"
        @click="navigateToStep">{{number}}</span>
        <div class="step-name">{{name}}</div>
    </div>
</template>

<script>
    export default {
        props: {name: String, number: Number, selectedStep: Number},
        methods: {
            navigateToStep() {
                if (this.number < this.selectedStep) {
                    this.$emit('navigate-to-step', this.number)
                }
            }
        },
    }
</script>

<style lang="scss">
    #stepper-header {
        .step {
            -webkit-box-align: center;
            align-items: center;
            display: flex;
            -webkit-box-orient: horizontal;
            -webkit-box-direction: normal;
            flex-direction: row;
            padding: 24px;
            position: relative;

            .step-number {
                cursor: pointer;
                border-radius: 50%;
                font-size: 12px;
                color: white;
                background-color: $primary-color;
                height: 24px;
                width: 24px;
                min-height: 24px;
                min-width: 24px;
                line-height: 24px;
                margin-right: 8px;
                text-align: center;
                vertical-align: middle;
            }

            .step-number.step-number-without-name {
                margin-right: 0;
            }

            .step-name {
                font-size: 14px;
                @media screen and (max-width: $sm) {
                    display: none;
                }
            }
        }

        .step.active-step {
            .step-name {
                font-weight: 500;
            }
        }

        .step.future-step {
            .step-number {
                cursor: default;
                background-color: rgba(0, 0, 0, .38);
            }
        }
    }
</style>
