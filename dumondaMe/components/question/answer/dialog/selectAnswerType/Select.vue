<template>
    <v-card id="select-answer-type-container">
        <v-card-title>{{$t('pages:question.selectAnswerDialog.title')}}</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
            <div class="select-answer-desktop">
                <select-desktop @answer-selected="type => $emit('answer-selected', type)"></select-desktop>
            </div>
            <div class="select-answer-mobile">
                <select-mobile @answer-selected="type => $emit('answer-selected', type)"></select-mobile>
            </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click.native="$emit('close-dialog')">
                {{$t("common:button.close")}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import SelectDesktop from './Desktop';
    import SelectMobile from './Mobile';

    export default {
        components: {SelectDesktop, SelectMobile}
    }
</script>

<style lang="scss">
    #select-answer-type-container {
        width: 100%;
        .select-answer-desktop {
            @media screen and (max-width: 600px) {
                display: none;
            }
        }
        .select-answer-mobile {
            @media screen and (min-width: 600px) {
                display: none;
            }
        }
    }
</style>
