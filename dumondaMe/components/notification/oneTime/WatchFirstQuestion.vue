<template>
    <div class="notification-one-time-watch-first-question">
        <div class="first-question-title">
            <v-icon size="32" class="success-icon">mdi-check-circle-outline</v-icon>
            <div>{{$t('pages:notifications.oneTime.watchFirstQuestion.title')}}</div>
        </div>
        <div class="description">{{$t('pages:notifications.oneTime.watchFirstQuestion.description')}}</div>
        <v-btn color="primary" class="go-to-questions"
               @click="$router.push({name: 'question'})">
            {{$t('pages:notifications.oneTime.challengeWatchQuestion.goToQuestions')}}
        </v-btn>
    </div>
</template>

<script>

    export default {
        props: ['notification']
    }
</script>

<style lang="scss">
    .notification-one-time-watch-first-question {

        .first-question-title {
            display: flex;
            color: $success-text;
            font-weight: 400;
            font-size: 22px;

            .success-icon {
                margin-right: 8px;
            }

            .success-icon.v-icon {
                color: $success-text;
            }
        }

        .description {
            margin-top: 8px;
            font-weight: 300;
            font-size: 16px;
        }

        button.go-to-questions {
            display: block;
            margin-top: 16px;
            margin-left: 0;
        }
    }
</style>