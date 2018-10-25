<template>
    <div id="search-users-no-result-container">
        <h2 class="user-profile-title">{{$t("pages:search.users.title")}}</h2>
        <div class="no-user-description">{{$t("pages:search.users.noUserDescription")}}</div>
    </div>
</template>

<style lang="scss">
    #search-users-no-result-container {
        margin-bottom: 38px;
        h2 {
            font-size: 22px;
            margin-bottom: 12px;
        }
    }
</style>
