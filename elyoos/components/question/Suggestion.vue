<template>
    <div id="question-suggestion-button">
        <suggestion-menu :number-of-suggestion="numberOfSuggestion" :is-admin="isAdmin" :is-super-user="isSuperUser">
            <div slot="icon">
                <v-btn small fab color="secondary">
                    <v-icon>mdi-wrench</v-icon>
                </v-btn>
                <span class="number-of-suggestions">{{question.numberOfSuggestions}}</span>
            </div>
        </suggestion-menu>
    </div>
</template>

<script>
    import SuggestionMenu from './menu/Suggestion';

    export default {
        props: ['numberOfSuggestion', 'isAdmin', 'isSuperUser'],
        components: {SuggestionMenu},
        data() {
            return {}
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
    #question-suggestion-button {
        margin-left: 8px;
        height: 40px;
        display: inline-block;
        .number-of-suggestions {
            display: inline-block;
            font-size: 16px;
            font-weight: 500;
            color: $secondary-text;
            margin-left: 10px;
            margin-right: 16px;
            vertical-align: middle;
        }
    }
</style>
