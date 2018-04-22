<template>
    <div class="card-footer-question-feed">
        <div class="footer-icon">
            <v-icon>person</v-icon>
            <span class="footer-text">{{$t('common:by')}} <span class="footer-link" @click="$router.push({name: 'user-userId-slug',
                     params: {userId: userId, slug: userSlug}})">{{user}}</span></span>
        </div>
        <div class="footer-icon">
            <v-icon>query_builder</v-icon>
            <span class="footer-text">{{created | formatRelativeTimesAgo}}</span>
        </div>
        <div class="footer-icon" v-if="numberOfAnswers >= 0">
            <v-icon>chat_bubble_outline</v-icon>
            <span class="footer-text">{{$t('pages:feeds.question.card.answer', {count: numberOfAnswers})}}
            </span>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['user', 'userId', 'userSlug', 'created', 'numberOfAnswers']
    }
</script>

<style lang="scss">
    .card-footer-question-feed {
        margin-top: 12px;
        .footer-icon {
            margin-right: 12px;
            display: inline-block;
            i.icon {
                font-size: 18px;
            }
            .footer-text {
                margin-left: 4px;
                font-size: 12px;
                font-weight: 400;
                color: $secondary-text;
                .footer-link {
                    cursor: pointer;
                }
                :hover.footer-link {
                    text-decoration: underline;
                }
            }
        }
    }
</style>