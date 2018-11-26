<template>
    <v-card id="welcome-profile-image-container">
        <v-card-text class="mobile-dialog-content">
            <div id="profile-image-container">

            </div>
            <div class="profile-image-description">{{$t("dialog:welcome.stepProfileImage.description")}}</div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="$emit('close-dialog')">
                {{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary" @click="$emit('next')">
                {{$t("common:button.next")}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    export default {

    }
</script>

<style lang="scss">
    #welcome-profile-image-container {
        #profile-image-container {
            width: 300px;
            margin: 12px auto;

            img {
                width: 100%;
                border-radius: 6px;
            }
        }

        .profile-image-description {
            text-align: center;
            font-weight: 300;
            max-width: 550px;
            margin: 0 auto;
        }
    }
</style>
