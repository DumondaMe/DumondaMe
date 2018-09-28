<template>
    <div id="question-suggestion-button">
        <suggestion-menu :number-of-suggestion="numberOfSuggestion" :is-admin="isAdmin" :is-super-user="isSuperUser"
                         :question-id="questionId" @delete-suggestion="suggestionDeleted"
                         @add-suggestion="suggestionAdded">
            <div slot="icon">
                <span class="number-of-suggestions">{{numberOfSuggestion}}</span>
                <v-btn small fab color="secondary">
                    <v-icon>mdi-lightbulb-outline</v-icon>
                </v-btn>
            </div>
        </suggestion-menu>
    </div>
</template>

<script>
    import SuggestionMenu from './menu/SuggestionMenu';

    export default {
        props: ['numberOfSuggestion', 'isAdmin', 'isSuperUser', 'questionId'],
        components: {SuggestionMenu},
        data() {
            return {}
        },
        methods: {
            suggestionDeleted() {
                this.$store.commit('question/SUGGESTION_REMOVED');
            },
            suggestionAdded() {
                this.$store.commit('question/SUGGESTION_ADDED');
            }
        }
    }
</script>

<style lang="scss">
    #question-suggestion-button {
        margin-left: 8px;
        height: 40px;
        display: inline-block;
        .number-of-suggestions {
            display: inline-block;
            font-size: 16px;
            font-weight: 500;
            color: $secondary-text;
            margin-left: 18px;
            margin-right: 8px;
            vertical-align: middle;
        }
    }
</style>
