<template>
    <div id="question-create-answer-desktop">
        <v-btn color="primary" rounded @click="$emit('answer-question')">
            <v-icon left>$vuetify.icons.mdiPlus</v-icon>
            {{$t("common:button.answer")}}
        </v-btn>
    </div>
</template>

<script>

    export default {
        components: {},
        data() {
            return {showDeleteQuestionDialog: false, showModifyTopicDialog: false, showModifyQuestionDialog: false}
        },
        computed: {
            question() {
                return this.$store.state.question.question;
            }
        },
        methods: {}
    }
</script>

<style lang="scss">
    #question-create-answer-desktop {
        position: absolute;
        bottom: -18px;
        right: 18px;

        @media screen and (max-width: $sm) {
            display: none;
        }
    }
</style>
