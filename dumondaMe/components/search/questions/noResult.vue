<template>
    <div id="search-questions-no-result-container">
        <h2 class="user-profile-title">{{$t("pages:search.questions.title")}}</h2>
        <div class="no-user-description">{{$t("pages:search.questions.noQuestionDescription")}}</div>
        <v-btn color="secondary">
            {{$t('pages:search.questions.createNewQuestion')}}
        </v-btn>
    </div>
</template>

<style lang="scss">
    #search-questions-no-result-container {
        margin-bottom: 38px;
        h2 {
            font-size: 22px;
            margin-bottom: 12px;
        }
        button {
            margin-left: 0;
            margin-top: 12px;
        }
    }
</style>
