<template>
    <div id="ely-user-profile-layout">
        <detail-layout>
            <div slot="content" id="question-detail">
                <user-profile></user-profile>
            </div>
            <div slot="sidebar">
                <sidebar></sidebar>
            </div>
        </detail-layout>
    </div>
</template>

<script>
    import DetailLayout from '~/components/layouts/Detail.vue';
    import UserProfile from '~/components/userProfile/UserProfile.vue';
    import Sidebar from '~/components/userProfile/sidebar/Sidebar.vue';

    export default {
        async fetch({store, error}) {
            try {
                await store.dispatch(`userProfile/getProfile`);
            } catch (e) {
                error({statusCode: e.statusCode})
            }
        },
        components: {DetailLayout, UserProfile, Sidebar}
    }
</script>

<style lang="scss">
    #ely-user-profile-layout {
        #detail-layout {
            #detail-content {
                width: 550px;
            }
            #detail-sidebar {
                margin-left: 650px;
            }
        }
    }
</style>