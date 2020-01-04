<template>
    <div>
        <suggestion-menu :number-of-suggestion="numberOfSuggestion" :is-admin="isAdmin" :is-super-user="isSuperUser"
                         :question-id="questionId" @delete-suggestion="suggestionDeleted"
                         @add-suggestion="suggestionAdded" id="question-suggestion-button">
            <div slot="icon">
                <span class="number-of-suggestions" v-if="!numberIsRightSide">{{numberOfSuggestion}}</span>
                <v-btn small fab color="secondary">
                    <v-icon size="20">{{$icons.mdiLightbulb}}</v-icon>
                </v-btn>
                <span class="number-of-suggestions number-right" v-if="numberIsRightSide">{{numberOfSuggestion}}</span>
            </div>
        </suggestion-menu>
    </div>
</template>

<script>
    import SuggestionMenu from './menu/SuggestionMenu';
    import {mdiLightbulb} from "@mdi/js";

    export default {
        props: ['numberOfSuggestion', 'isAdmin', 'isSuperUser', 'questionId', 'numberIsRightSide'],
        created() {
            this.$icons = {mdiLightbulb}
        },
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
        .number-of-suggestions.number-right {
            margin-left: 2px;
        }
    }
</style>
