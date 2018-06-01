<template>
    <div class="link-answer-feed-card">
        <v-layout row>
            <user-info :isAdmin="answer.isAdmin" :card-type="answer.type"
                       :question-id="answer.questionId" :question-slug="answer.questionSlug"
                       :question="answer.question">
            </user-info>
            <v-spacer></v-spacer>
            <v-menu bottom v-if="answer.isAdmin">
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
        <div class="link-answer-content">
            <div class="link-preview-image" v-if="answer.imageUrl">
                <img :src="answer.imageUrl">
            </div>
            <div class="answer-description" :class="{'no-link-image': !answer.imageUrl}">
                <div class="title-container">
                    <v-icon class="card-type-icon">mdi-link</v-icon>
                    <span class="card-title"><a target="_blank" :href="answer.link"
                                                class="link">{{answer.title}}</a></span>
                </div>
                <expand-text :expand-text="answer.description"
                             :class="{'no-link-image': !answer.imageUrl}" itemprop="text">
                </expand-text>
            </div>
        </div>
        <card-footer :creator="answer.creator.name" :creator-id="answer.creator.userId"
                     :creator-slug="answer.creator.slug" :created="answer.created" :action="answer.action"
                     :card-type="answer.type">
        </card-footer>
    </div>
</template>

<script>
    import UserInfo from './UserInfo.vue';
    import CardFooter from './footer/CommonAnswer';
    import ExpandText from '~/components/common/text/Expand.vue'

    export default {
        props: ['answer'],
        components: {UserInfo, CardFooter, ExpandText},
        computed: {
            answerType() {
                if (this.answer.pageType) {
                    return this.$t(`pages:detailQuestion.answerType.link.${this.answer.pageType}`)
                }
                return this.$t(`pages:detailQuestion.answerType.link.link`)
            }
        }
    }
</script>

<style lang="scss">
    .link-answer-feed-card {
        .link-answer-content {
            margin-top: 12px;
            min-height: 90px;
            display: flex;
            .link-preview-image {
                img {
                    border-radius: 2px;
                    margin-top: 5px;
                    max-width: 120px;
                }
            }
            .answer-description {
                margin-left: 18px;
            }
            .answer-description.no-link-image {
                margin-left: 0;
            }
        }
        .link-answer-content.no-link-image {
            min-height: 0;
        }
    }
</style>
