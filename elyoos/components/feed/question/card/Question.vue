<template>
    <div class="question-feed-card">
        <v-layout row>
            <user-info :isAdmin="question.isAdmin" :created="question.created" :card-type="'Question'"
                       :question-id="question.questionId" :question-slug="question.questionSlug"
                       :question="question.question">
            </user-info>
            <v-spacer></v-spacer>
            <v-menu bottom v-if="question.isAdmin">
                <v-btn icon slot="activator">
                    <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
                <v-list>
                    <v-list-tile @click="">
                        <v-list-tile-title>Bearbeiten</v-list-tile-title>
                    </v-list-tile>
                    <v-divider></v-divider>
                    <v-list-tile @click="">
                        <v-list-tile-title>Löschen</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
        </v-layout>
        <expand-text :expand-text="question.description" class="question-description" itemprop="text">
        </expand-text>
        <card-footer :user="question.creator.name" :userId="question.creator.userId" :userSlug="question.creator.slug"
                     :created="question.created" :number-of-answers="question.numberOfAnswers">
        </card-footer>
    </div>
</template>

<script>
    import UserInfo from './UserInfo.vue';
    import CardFooter from './footer.vue';
    import ExpandText from '~/components/common/text/Expand.vue'

    export default {
        props: ['question'],
        components: {UserInfo, CardFooter, ExpandText},
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            }
        },
    }
</script>

<style lang="scss">
    .question-feed-card {
        .question-description {
            margin-top: 12px;
        }
        .question-info {
            margin-top: 12px;
            .answer-icon {
                i.icon {
                    color: $primary-color;
                }
                .answer-text {
                    margin-left: 6px;
                    font-size: 14px;
                    font-weight: 500;
                    color: $secondary-text;
                }
            }
        }
    }
</style>
