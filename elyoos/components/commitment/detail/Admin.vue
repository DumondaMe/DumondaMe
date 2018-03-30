<template>
    <div class="sidebar-container">
        <h3>{{$t("pages:detailCommitment.admin.title")}}</h3>
        <div id="commitment-admin-container">
            <p>{{$t("pages:detailCommitment.admin.description")}}</p>
            <div id="admin-commands">
                <v-btn outline fab small color="primary">
                    <v-icon>edit</v-icon>
                </v-btn>
                <v-btn outline fab small color="primary" @click.native="showDeleteCommitmentDialog = true">
                    <v-icon>delete</v-icon>
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        components: {},
        data() {
            return {showDeleteCommitmentDialog: false}
        }
    }
</script>

<style lang="scss">
    #commitment-admin-container {
        p {
            font-size: 14px;
            font-weight: 300;
            margin-bottom: 6px;
        }
        #admin-commands {
            button {
                margin-left: 0;
                margin-right: 16px;
            }
        }
    }
</style>
