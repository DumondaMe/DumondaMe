<template>
    <div class="card-footer-question-feed">
        <div class="footer-icon">
            <v-tooltip bottom>
                <v-icon v-if="action === 'watch'" slot="activator" class="action-icon">mdi-eye</v-icon>
                <span v-if="action === 'watch'">Beobachtet von {{user}}</span>
                <v-icon v-if="action === 'created' && (cardType === 'Question' || cardType === 'Commitment')"
                        slot="activator" class="action-icon">
                    mdi-pencil
                </v-icon>
                <span v-if="action === 'created' && (cardType === 'Question' || cardType === 'Commitment')">
                    Erstellt von {{user}}</span>
                <v-icon v-if="action === 'created' && cardType !== 'Question' && cardType !== 'Commitment'"
                        slot="activator" class="action-icon">
                    mdi-forum
                </v-icon>
                <span v-if="action === 'created' && cardType !== 'Question' && cardType !== 'Commitment'">
                    Antwort von {{user}}</span>
                <v-icon v-if="action === 'upVote'" slot="activator" class="action-icon">
                    mdi-arrow-up-bold-circle-outline
                </v-icon>
                <span v-if="action === 'upVote'">Zustimmung von {{user}}</span>
            </v-tooltip>
            <span class="footer-text">{{$t('common:by')}} <span class="footer-link" @click="$router.push({name: 'user-userId-slug',
                     params: {userId: userId, slug: userSlug}})">{{user}}</span></span>
        </div>
        <div class="footer-icon">
            <v-icon>mdi-clock</v-icon>
            <span class="footer-text">{{created | formatRelativeTimesAgo}}</span>
        </div>
        <div class="footer-icon" v-if="numberOfAnswers >= 0">
            <v-icon>mdi-forum</v-icon>
            <span class="footer-text">{{$t('pages:feeds.card.answer', {count: numberOfAnswers})}}
            </span>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['user', 'userId', 'userSlug', 'created', 'numberOfAnswers', 'action', 'cardType']
    }
</script>

<style lang="scss">
    .card-footer-question-feed {
        margin-top: 16px;
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
            .action-icon {
                color: #009688;
            }
            .action-icon.icon {
                font-size: 20px;
            }
        }
    }
</style>