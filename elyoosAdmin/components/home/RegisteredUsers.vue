<template>
    <div id="elyoos-registered-users-overview" class="ely-card">
        <div id="number-of-users">{{numberOfUsers}} {{$t('pages:home.users.numberOfUsers')}}</div>
        <div class="user" v-for="user in users">
            <div class="user-image">
                <img :src="user.url"/>
            </div>
            <div class="user-info">
                <div class="user-name">{{user.name}}</div>
                <div class="register-date">{{user.registerDate | formatRelativeTimesAgo}}</div>
            </div>
        </div>
        <v-btn outline color="primary" v-show="users.length < numberOfUsers"
               @click="loadNextUsers()">{{$t('common:button.showMore')}}
        </v-btn>
    </div>
</template>

<script>
    export default {
        data() {
            return {}
        },
        methods: {
            async loadNextUsers() {
                try {
                    await this.$store.dispatch(`home/loadNextUsers`);
                } catch (error) {

                }
            }
        },
        computed: {
            numberOfUsers() {
                return this.$store.state.home.numberOfUsers;
            },
            users() {
                return this.$store.state.home.users;
            }
        }
    }
</script>

<style lang="scss">
    #elyoos-registered-users-overview {
        margin-right: 28px;
        display: inline-block;
        width: 300px;
        height: 400px;
        overflow-y: auto;

        #number-of-users {
            font-weight: 300;
            margin-bottom: 18px;
        }
        .user {
            display: block;
            clear: both;
            height: 48px;
            margin-bottom: 8px;
            .user-image {
                float: left;
                width: 48px;
                height: 48px;
                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 2px;
                }
            }
            .user-info {
                margin-left: 60px;
                .user-name {
                    font-size: 14px;
                    color: $primary-color;
                    line-height: 14px;
                }
                .register-date {
                    font-size: 12px;
                    color: $secondary-text;
                }
            }
        }
        button {
            margin-left: 0;
            margin-top: 12px;
        }
    }
</style>
