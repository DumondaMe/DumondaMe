<template>
    <div class="card-footer-feed">
        <div class="footer-icon" v-if="creator">
            <div class="user-icon">
                <img :src="creatorImage">
            </div>
        </div>
        <div class="footer-icon">
            <v-icon v-if="action === 'watch'" class="action-icon">mdi-star</v-icon>

            <v-icon v-if="action === 'created'" class="action-icon">
                mdi-plus-circle
            </v-icon>

            <v-icon v-if="action === 'upVote'" class="action-icon">
                mdi-arrow-up-bold-circle
            </v-icon>
        </div>
        <div class="footer-icon">
            <v-icon class="action-icon no-answers" v-if="numberOfAnswers === 0">mdi-comment-alert</v-icon>
            <v-icon class="action-icon only-few-answers" v-else-if="numberOfAnswers > 0 && numberOfAnswers <= 4">
                mdi-comment-alert
            </v-icon>
            <v-icon class="action-icon" v-else>mdi-comment-multiple</v-icon>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['creator', 'creatorId', 'creatorSlug', 'creatorImage', 'created', 'numberOfAnswers', 'action']
    }
</script>

<style lang="scss">
    .card-footer-feed {
        .footer-icon {
            .action-icon.no-answers {
                color: $warning
            }
            .action-icon.only-few-answers {
                color: #bfbc12
            }
        }
    }
</style>