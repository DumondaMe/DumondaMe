<template>
    <div id="elyoos-question-header">
        <h1>{{question.question}}</h1>
        <user-info :name="question.creator.name" :thumbnail-url="question.creator.thumbnailUrl"
                   :created="question.created"></user-info>
        <p id="question-description">{{question.description}}</p>
        <div id="question-commands">
            <v-tooltip top :disabled="isAuthenticated">
                <v-btn outline color="primary" id="answer-question-button"
                       :disabled="!isAuthenticated" slot="activator">
                    <v-icon left>chat</v-icon>
                    {{$t("common:button.answer")}}
                </v-btn>
                <span>{{$t("pages:detailQuestion.tooltipLoginToAnswerQuestion")}}</span>
            </v-tooltip>
            <v-btn outline color="primary" :disabled="!isAuthenticated">
                {{$t("common:button.followQuestion")}}
            </v-btn>
        </div>
    </div>
</template>

<script>
    import UserInfo from '~/components/common/user/Info.vue';

    export default {
        props: ['question'],
        components: {UserInfo},
        data() {
            return {}
        },
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            }
        },
        methods: {
            setResponse(response) {
                this.rcaptResponse = response;
            }
        }
    }
</script>

<style lang="scss">
    #elyoos-question-header {
        h1 {
            margin-bottom: 8px;
        }
        #question-description {
            margin-top: 12px;
            font-size: 16px;
            font-weight: 300;
        }
        #question-commands {
            #answer-question-button {
                margin-left: 0;
            }
            .material-icons {
                margin-right: 8px;
            }
        }
    }
</style>
