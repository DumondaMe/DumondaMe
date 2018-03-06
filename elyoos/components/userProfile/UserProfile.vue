<template>
    <div id="elyoos-user-profile">
        <div id="elyoos-user-profile-content">
            <div id="elyoos-user-image-container">
                <img :src="user.profileImage"/>
                <v-btn id="button-change-image" color="primary" @click="">{{$t("common:button.uploadImage")}}</v-btn>
            </div>
            <div id="profile-info-container">
                <div class="user-name">{{user.forename}} {{user.surname}}</div>
                <div class="email-address">{{user.email}}</div>
                <v-btn outline fab color="primary" id="button-change-profile-data">
                    <v-icon>edit</v-icon>
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            user() {
                return this.$store.state.userProfile.user;
            }
        }
    }
</script>

<style lang="scss">
    #elyoos-user-profile {
        #elyoos-user-profile-content {
            border-bottom: 1px solid $divider;
            #elyoos-user-image-container {
                float: left;
                height: 142px;
                width: 142px;
                img {
                    border-radius: 50%;
                    height: 100%;
                    width: 100%;
                }
                #button-change-image {
                    width: 142px;
                    margin-top: 18px;
                    margin-left: 0;
                }
            }
            #profile-info-container {
                margin-left: 200px;
                min-height: 220px;
                .user-name {
                    font-weight: 300;
                    font-size: 32px;
                    line-height: 28px;
                }
                .email-address {
                    margin-top: 8px;
                    font-size: 14px;
                    color: $secondary-text;
                }
                #button-change-profile-data {
                    height: 36px;
                    width: 36px;
                    margin-top: 8px;
                    margin-left: 0;
                }
            }
        }
        .user-profile-title {
            margin-top: 12px;
            font-size: 18px;
            font-weight: 400;
        }
    }
</style>
