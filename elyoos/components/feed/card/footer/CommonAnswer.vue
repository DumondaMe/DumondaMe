<template>
    <div class="card-footer-feed">
        <div class="footer-icon" v-if="creator">
            <v-tooltip bottom>
                <v-icon v-if="action === 'created'"
                        slot="activator" class="action-icon">
                    mdi-forum
                </v-icon>
                <span v-if="action === 'created'">
                    Antwort von {{creator}}</span>

                <v-icon v-if="action === 'upVote'" slot="activator" class="action-icon">
                    mdi-arrow-up-bold-circle-outline
                </v-icon>
                <span v-if="action === 'upVote'">Zustimmung von {{creator}}</span>
            </v-tooltip>
            <span class="footer-text">{{$t('common:by')}} <span class="footer-link" @click="$router.push({name: 'user-userId-slug',
                     params: {userId: creatorId, slug: creatorSlug}})">{{creator}}</span></span>
        </div>
        <div class="footer-icon">
            <v-icon>mdi-clock</v-icon>
            <span class="footer-text">{{created | formatRelativeTimesAgo}}</span>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['creator', 'creatorId', 'creatorSlug', 'created', 'action']
    }
</script>

<style lang="scss">

</style>