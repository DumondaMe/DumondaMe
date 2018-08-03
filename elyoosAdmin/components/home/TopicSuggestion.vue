<template>
    <div id="elyoos-topic-suggestions" class="ely-card">
        <div id="number-of-suggestions">
            <nuxt-link class="password-reset" to="/topics">{{numberOfTopicSuggestions}}
                {{$t('pages:home.topic.numberOfTopicSuggestions')}}
            </nuxt-link>
        </div>
        <div class="user" v-for="suggestion in suggestions">
            <div class="user-image">
                <img :src="suggestion.url"/>
            </div>
            <div class="user-info">
                <div class="user-name">{{suggestion.name}}</div>
                <div class="created-topic-suggestion">{{suggestion.created | formatRelativeTimesAgo}}</div>
                <div class="topic-suggestion">{{suggestion.topic}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            numberOfTopicSuggestions() {
                return this.$store.state.home.numberOfTopicSuggestions;
            },
            suggestions() {
                return this.$store.state.home.topicSuggestions;
            }
        }
    }
</script>

<style lang="scss">
    #elyoos-topic-suggestions {
        margin-right: 28px;
        display: inline-block;
        width: 300px;
        height: 400px;
        overflow-y: auto;

        #number-of-suggestions {
            font-weight: 300;
            margin-bottom: 18px;
            a {
                text-decoration: none;
            }
            a:hover {
                text-decoration: underline;
            }
        }
        .user {
            display: block;
            clear: both;
            height: 48px;
            margin-bottom: 8px;
            .user-image {
                float: left;
                width: 48px;
                height: 48px;
                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 2px;
                }
            }
            .user-info {
                margin-left: 60px;
                .user-name {
                    font-size: 14px;
                    color: $primary-color;
                    line-height: 14px;
                }
                .created-topic-suggestion {
                    font-size: 12px;
                    color: $secondary-text;
                }
                .topic-suggestion {
                    font-size: 14px;
                }
            }
        }
        button {
            margin-left: 0;
            margin-top: 12px;
        }
    }
</style>
