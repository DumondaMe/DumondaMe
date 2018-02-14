<template>
    <div class="sidebar-container">
        <h3>{{$t("pages:detailQuestion.sidebar.admin.title")}}</h3>
        <div id="question-admin-container">
            <p>{{$t("pages:detailQuestion.sidebar.admin.description")}}</p>
            <div id="admin-commands">
                <v-btn outline fab color="primary">
                    <v-icon>edit</v-icon>
                </v-btn>
                <v-btn outline fab color="primary">
                    <v-icon>delete</v-icon>
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script>
    export default {}
</script>

<style lang="scss">
    #question-admin-container {
        p {
            font-size: 14px;
            font-weight: 300;
            margin-bottom: 6px;
        }
        #admin-commands {
            button {
                height: 36px;
                width: 36px;
                margin-left: 0;
                margin-right: 16px;
            }
        }
    }
</style>
