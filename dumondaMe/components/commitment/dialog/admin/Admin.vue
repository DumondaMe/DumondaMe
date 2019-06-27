<template>
    <div class="admin-of-commitment">
        <div class="admin-image">
            <img :src="admin.profileUrl"/>
        </div>
        <div class="admin-content">
            <div class="admin-name" v-if="admin.isLoggedInUser">{{$t("common:you")}}</div>
            <div class="admin-name" v-else>{{admin.name}}</div>
        </div>
        <v-spacer></v-spacer>
        <div class="remove-admin-button">
            <v-btn @click="$emit('remove-admin', admin.userId)" outline color="primary"
                   :disabled="disableRemoveButton">
                {{$t("pages:detailCommitment.adminDialog.removeAdminButton")}}
            </v-btn>
        </div>
    </div>
</template>

<script>

    export default {
        props: ['admin', 'disableRemoveButton'],
        data() {
            return {}
        },
        methods: {
            removeAccount() {

            }
        },
    }
</script>

<style lang="scss" scoped>
    .admin-of-commitment {
        display: flex;
        margin-bottom: 18px;

        .admin-image {
            height: 40px;
            width: 40px;

            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }

        .admin-content {
            margin-left: 12px;

            .admin-name {
                font-weight: 500;
            }
        }

        .remove-admin-button {
            button {
                margin: 2px 0 0 12px;
            }
        }
    }
</style>
