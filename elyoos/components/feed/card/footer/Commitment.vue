<template>
    <div class="card-footer-feed">
        <div class="footer-icon" v-if="creator && cardType === 'CommitmentAnswer'">
            <div class="user-icon creator-icon">
                <img :src="creator.userImage">
            </div>
        </div>
        <div class="separator-icon" v-if="creator && cardType === 'CommitmentAnswer'">
            <v-icon medium>
                mdi-menu-right
            </v-icon>
        </div>
        <div class="footer-icon" v-if="user">
            <div class="user-icon">
                <img :src="user.userImage">
            </div>
        </div>
        <div class="footer-icon" v-if="user">
            <v-icon medium v-if="action === 'watch'" class="action-icon">mdi-star</v-icon>

            <v-icon medium v-if="action === 'created' && cardType === 'CommitmentAnswer'"
                    class="action-icon">
                mdi-comment-plus
            </v-icon>

            <v-icon medium v-if="action === 'upVote'" class="action-icon">
                mdi-arrow-up-bold-circle
            </v-icon>
        </div>
        <div class="footer-icon">
            <v-icon medium class="action-icon">mdi-map-marker</v-icon>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['user', 'creator', 'created', 'action', 'regions', 'cardType']
    }
</script>

<style lang="scss">

</style>