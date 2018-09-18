<template>
    <div id="stepper-header">
        <slot></slot>
    </div>
</template>

<script>
    export default {
    }
</script>

<style lang="scss">
    #stepper-header {
        display: flex;
        width: 100%;
        align-items: stretch;
        -webkit-box-align: stretch;
        -ms-flex-align: stretch;
        -webkit-box-pack: justify;
        justify-content: space-between;
        height: 72px;
        .v-divider {
            align-self: center;
            margin: 0 -16px;
        }
    }
</style>
