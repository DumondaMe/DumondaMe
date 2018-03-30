<template>
    <div class="topics-container">
        <div class="topic" v-for="topic in topics">{{topic}}</div>
    </div>
</template>

<script>
    export default {
        props: ['topics']
    }
</script>

<style lang="scss">
    .topics-container {
        margin-bottom: 8px;
        .topic {
            display: inline-block;
            margin-right: 8px;
            background-color: #78909C;
            color: #ffffff;
            padding: 2px 4px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 300;
        }
    }
</style>
