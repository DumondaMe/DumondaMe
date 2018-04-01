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
            background-color: #EEEEEE;
            color: #4e4d47;
            padding: 4px;
            border-radius: 2px;
            font-size: 12px;
            font-weight: 400;
        }
    }
</style>
