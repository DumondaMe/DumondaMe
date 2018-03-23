<template>
    <div class="topic-button-container" @click="toggleTopic">
        <img class="topic-image" :src="image"/>
        <div class="topic-description">{{description}}</div>
        <div class="topic-not-selected" v-if="!selected"></div>
        <img class="topic-selected" :src="getMark()" v-else/>
    </div>
</template>

<script>

    export default {
        props: ['topic', 'image', 'description'],
        data() {
            return {selected: false}
        },
        methods: {
            getMark() {
                return `${process.env.staticUrl}/img/topics/mark.jpg`;
            },
            toggleTopic() {
                if (this.selected) {
                    this.$emit('remove-topic', this.topic);
                } else {
                    this.$emit('add-topic', this.topic);
                }
                this.selected = !this.selected;
            }
        }
    }
</script>

<style lang="scss">
    .topic-button-container {
        display: inline-block;
        position: relative;
        width: 120px;
        height: 120px;
        cursor: pointer;
        margin-bottom: 18px;
        @media screen and (max-width: 360px) {
            width: 100px;
            height: 100px;
        }
        .topic-image {
            width: 100%;
            height: 100%;
        }
        .topic-description {
            background: #757575;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            font-size: 14px;
            font-weight: 500;
            text-align: center;
            color: #fff;
            @media screen and (max-width: 360px) {
                font-size: 12px;
            }
        }
        .topic-not-selected {
            border-radius: 50%;
            background: #757575;
            opacity: 0.6;
            position: absolute;
            right: 6px;
            top: 6px;
            height: 24px;
            width: 24px;
            border: 1px solid #424242;
        }
        .topic-selected {
            border-radius: 50%;
            position: absolute;
            right: 6px;
            top: 6px;
            height: 24px;
            width: 24px;
        }
    }
</style>
