<template>
    <div class="text-answer-feed-card">
        <v-layout row class="text-answer-header">
            <user-info :isAdmin="answer.isAdmin" :created="answer.created" :card-type="answer.type"
                       :card-type-translated="$t('pages:detailQuestion.answerType.text')"
                       :question-id="answer.questionId" :question-slug="answer.questionSlug"
                       :question="answer.question">
            </user-info>
            <v-spacer></v-spacer>
            <v-menu bottom v-if="answer.isAdmin">
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
        <expand-text :expand-text="answer.answer" class="answer-description" itemprop="text">
        </expand-text>
        <card-footer :user="answer.creator.name" :userId="answer.creator.userId" :userSlug="answer.creator.slug"
                     :created="answer.created">
        </card-footer>
    </div>
</template>

<script>
    import UserInfo from './UserInfo.vue';
    import CardFooter from './footer.vue';
    import ExpandText from '~/components/common/text/Expand.vue'

    export default {
        props: ['answer'],
        components: {UserInfo, CardFooter, ExpandText},
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            }
        },
    }
</script>

<style lang="scss">
    .text-answer-feed-card {
        .answer-description {
            margin-top: 12px;
        }
    }
</style>
