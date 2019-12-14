<template>
    <div class="minor-challenge-item">
        <div class="minor-challenge-inner-item" :class="{'challenge-success': numberOfSuccess > trigger}">
        </div>
    </div>
</template>

<script>
    export default {
        props: ['numberOfSuccess', 'trigger'],
    }
</script>

<style lang="scss">
    .minor-challenges-container {
        .minor-challenge-item {
            flex-grow: 1;
            padding-right: 2px;

            .minor-challenge-inner-item {
                height: 6px;
                background: $divider;
            }

            .minor-challenge-inner-item.challenge-success {
                background: $success-text;
            }
        }
    }
</style>