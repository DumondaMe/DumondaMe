<template>
    <div class="question-feed-card">
        <v-layout row>
            <user-info :name="question.creator.name" :thumbnail-url="question.creator.thumbnailUrl"
                       :isAdmin="question.isAdmin" :created="question.created" :card-type="'Question'"
                       :card-type-translated="$t('pages:feeds.question.card.questionType')"
                       :question-id="question.questionId" :question-slug="question.questionSlug"
                       :question="question.question"
                       :userId="question.creator.userId" :slug="question.creator.slug">
            </user-info>
            <v-spacer></v-spacer>
            <v-menu bottom v-if="question.isAdmin">
                <v-btn icon slot="activator">
                    <v-icon>more_vert</v-icon>
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
        <v-layout row class="question-info">
            <div class="answer-icon">
                <v-icon>chat_bubble_outline</v-icon>
                <span class="answer-text">{{$t('pages:feeds.question.card.answer', {count: question.numberOfAnswers})}}</span>
            </div>
        </v-layout>
    </div>
</template>

<script>
    import UserInfo from './UserInfo.vue';
    import ExpandText from '~/components/common/text/Expand.vue'

    export default {
        props: ['question'],
        components: {UserInfo, ExpandText},
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            }
        },
    }
</script>

<style lang="scss">
    .question-feed-card {
        margin-bottom: 12px;
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
