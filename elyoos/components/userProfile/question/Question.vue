<template>
    <div class="user-question-info ely-card">
        <div class="question-title" @click="$router.push({name: 'question-questionId-slug',
                     params: {questionId: question.questionId, slug: question.questionSlug}})">{{question.question}}
        </div>
        <expand-text :expand-text="question.descriptionHtml" class="description">
        </expand-text>
        <div class="info-container">
            <div class="info-icon-element">
                <v-icon class="info-icon">mdi-forum</v-icon>
                <span class="info-text">{{question.numberOfAnswers}}</span>
            </div>
            <div class="info-icon-element">
                <v-icon class="info-icon">mdi-eye</v-icon>
                <span class="info-text">{{question.numberOfWatches}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import ExpandText from '~/components/common/text/Expand.vue'

    export default {
        props: ['question'],
        components: {ExpandText},
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            },
            isLoggedInUser() {
                return this.$store.state.userProfile.user.isLoggedInUser;
            }
        },
        methods: {}
    }
</script>

<style lang="scss">
    .user-question-info {
        margin-bottom: 8px;
        .question-title {
            cursor: pointer;
            color: $primary-color;
            font-size: 16px;
            font-weight: 400;
        }
        :hover.question-title {
            text-decoration: underline;
        }
        .description {
            font-size: 16px;
            font-weight: 300;
        }
        .info-container {
            margin-top: 12px;
            .info-icon-element {
                display: inline-block;
                font-size: 12px;
                font-weight: 400;
                color: $secondary-text;
                margin-right: 12px;
                .info-icon {
                    font-size: 16px;
                    margin-right: 0;
                }
                .info-text {
                    margin-left: 6px;
                    vertical-align: middle;
                    line-height: 16px;
                }
            }
        }
    }
</style>
