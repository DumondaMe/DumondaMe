<template>
    <div class="menu-content menu-user-container-content">
        <div class="user-container">
            <user :user="user" :show-date-relative="true" v-for="user in users" :key="user.userId"
                  v-if="user.userId !== userId || !user.userId"
                  @remove-from-trust-circle="removeUserFromTrustCircle"
                  @add-to-trust-circle="addUserToTrustCircle">
            </user>
            <v-btn color="primary" outline class="show-more-users-button" @click="getNextUsers()"
                   v-if="users.hasMoreUsers" :loading="loadingNextUsers" :disabled="loadingNextUsers">
                {{$t('common:button.showMore')}}
            </v-btn>
        </div>
    </div>
</template>

<script>
    import User from '~/components/common/user/User';

    export default {
        props: ['users', 'initHasMoreUsers', 'apiGetUser', 'id', 'userId'],
        components: {User},
        data() {
            return {usersPage: 1, loadingNextUsers: false, hasMoreUsers: this.initHasMoreUsers}
        },
        methods: {
            async getNextUsers() {
                try {
                    this.loadingNextUsers = true;
                    let nextUsers = await this.$axios.$get(this.apiGetUser,
                        {params: {id: this.id, page: this.usersPage}});
                    this.users = this.users.concat(nextUsers.users);
                    this.hasMoreUsers = nextUsers.hasMoreUsers;
                    this.usersPage++;
                } catch (error) {
                    this.showError = true;
                } finally {
                    this.loadingNextUsers = false;
                }
            },
            async addUserToTrustCircle(userId) {
                let response = await this.$axios.$post(`user/trustCircle/${userId}`);
                let user = this.users.users.find(user => user.userId === userId);
                user.personOfTrustSince = response.personOfTrustSince;
                user.isPersonOfTrust = true;
            },
            async removeUserFromTrustCircle(userId) {
                await this.$axios.$delete(`user/trustCircle/${userId}`);
                let user = this.users.users.find(user => user.userId === userId);
                delete user.personOfTrustSince;
                user.isPersonOfTrust = false;
            }
        }
    }
</script>

<style lang="scss">
    .ely-menu-container {
        .menu-user-container-content {
            .more-user-description {
                font-size: 14px;
                margin-bottom: 12px;
            }
            .user-container {
                max-height: 336px;
                overflow-y: auto;
                .show-more-users-button {
                    margin-left: 0;
                }
            }
        }
    }
</style>