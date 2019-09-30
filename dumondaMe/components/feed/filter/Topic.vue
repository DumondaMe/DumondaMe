<template>
    <div class="feed-filter-topic-content">
        <div v-for="topic of topics" class="topic-container">
            <div class="topic-image">
                <img :src="topic.image">
            </div>
            <div class="topic-description">{{topic.description}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['topics']
    }
</script>

<style lang="scss">
    .feed-filter-topic-content {
        .topic-container {
            display: flex;
            margin-bottom: 8px;

            .topic-image {
                width: 60px;
                margin-right: 12px;

                img {
                    width: 100%;
                    border-radius: 2px;
                }
            }

            .topic-description {
                font-size: 16px;
                color: $secondary-text;
                line-height: 40px;
            }
        }
    }
</style>
