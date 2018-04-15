<template>
    <div class="notification-show-question-request">
        <div class="notification-title">Soll auf der Detailseite deines Engagements
            <span class="bold">{{notification.commitmentTitle}}</span> die Frage
            <span class="bold">{{notification.question}}</span> angezeigt werden?
        </div>
        <div class="commands-container">
            <v-btn outline color="success">
                <v-icon>done</v-icon>
                Ja
            </v-btn>
            <v-btn outline color="error">
                <v-icon>clear</v-icon>
                Nein
            </v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ShowQuestionRequest",
        props: ['notification'],
    }
</script>

<style lang="scss">
    .notification-show-question-request {
        .notification-title {
            .bold {
                color: $primary-color;
            }
        }
        .commands-container {
            margin-top: 6px;
            button {
                margin-left: 0;
                margin-right: 16px;
            }
        }
    }
</style>