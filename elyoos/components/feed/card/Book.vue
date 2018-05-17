<template>
    <div class="book-answer-feed-card">
        <v-layout row>
            <user-info :isAdmin="answer.isAdmin" :card-type="answer.type" :question-id="answer.questionId"
                       :question-slug="answer.questionSlug" :question="answer.question">
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
        <div class="book-answer-content" :class="{'no-book-image': !answer.imageUrl}">
            <div class="book-preview-image" v-if="answer.imageUrl">
                <img :src="answer.imageUrl">
            </div>
            <div class="answer-description">
                <div class="title-container">
                    <v-icon class="card-type-icon">mdi-book-open-page-variant</v-icon>
                    <span class="card-title"><a target="_blank" :href="getExternalLink"
                                                       class="link">{{answer.title}}</a></span>
                </div>
                <expand-text :expand-text="answer.description"
                             :class="{'no-book-image': !answer.imageUrl}" itemprop="text">
                </expand-text>
            </div>
        </div>
        <card-footer :user="answer.creator.name" :userId="answer.creator.userId" :userSlug="answer.creator.slug"
                     :created="answer.created" :action="answer.action" :card-type="answer.type">
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
        data() {
            return {expandDescription: false}
        },
        computed: {
            getExternalLink() {
                let title = this.answer.title.replace(' ', '+');
                return `https://duckduckgo.com/?q="${title}"&t=hf&ia=web`;
            }
        }
    }
</script>

<style lang="scss">
    .book-answer-feed-card {
        .book-answer-content {
            min-height: 90px;
            display: flex;
            .book-preview-image {
                img {
                    border-radius: 2px;
                    margin-top: 19px;
                    max-height: 250px;
                    max-width: 120px;
                }
            }
            .answer-description {
                margin-left: 18px;
                margin-top: 13px;
            }
            .answer-description.no-book-image {
                margin-left: 0;
            }
        }
        .book-answer-content.no-book-image {
            min-height: 0;
        }
    }
</style>
