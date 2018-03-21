<template>
    <div id="ely-user-logged-in-profile-layout">
        <detail-layout>
            <div slot="content">
                <user-profile></user-profile>
            </div>
            <div slot="sidebar">
                <contacts></contacts>
            </div>
        </detail-layout>
    </div>
</template>

<script>
    import DetailLayout from '~/components/layouts/Detail.vue';
    import UserProfile from '~/components/userProfile/UserProfile.vue';
    import Contacts from '~/components/userProfile/Contacts.vue';

    export default {
        async fetch({store, error}) {
            try {
                await store.dispatch(`userProfile/getProfile`);
            } catch (e) {
                error({statusCode: e.statusCode})
            }
        },
        components: {DetailLayout, UserProfile, Contacts}
    }
</script>

<style lang="scss">
    #ely-user-logged-in-profile-layout {
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