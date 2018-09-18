<template>
    <div class="step" :class="{'active-step': number === selectedStep, 'future-step': number > selectedStep}">
        <span class="step-number">{{number}}</span>
        <div class="step-name">{{name}}</div>
    </div>
</template>

<script>
    export default {
        props: {name: String, number: Number, selectedStep: Number}
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
            .step-name {
                font-size: 14px;
            }
        }
        .step.active-step {
            .step-name {
                font-weight: 500;
            }
        }
        .step.future-step {
            .step-number {
                background-color: rgba(0,0,0,.38);
            }
        }
    }
</style>
