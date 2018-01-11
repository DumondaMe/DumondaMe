<template>
    <div class="feeds-container">
        <h3 class="feedTitle">{{$t("pages:feeds.sidebar.feedTitle")}}</h3>
        <div class="feedContent">
            <div class="feed-link">
                <nuxt-link to="/">{{$t("pages:feeds.sidebar.question")}}</nuxt-link>
            </div>
            <div class="feed-link">
                <nuxt-link to="/posts">{{$t("pages:feeds.sidebar.post")}}</nuxt-link>
            </div>
            <div class="feed-link">
                <nuxt-link to="/organisations">{{$t("pages:feeds.sidebar.org")}}</nuxt-link>
            </div>
            <div class="feed-link">
                <nuxt-link to="/events">{{$t("pages:feeds.sidebar.event")}}</nuxt-link>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    .feedContent {
        .feed-link {
            font-weight: 400;
            font-size: 14px;
            padding: 4px 5px;
            margin-bottom: 3px;
            a {
                color: $primary-text;
                text-decoration: none;
            }
            a.nuxt-link-exact-active {
                color: $primary-color;
                font-weight: 500;
            }
        }
    }
</style>
