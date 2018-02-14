<template>
    <div id="elyoos-question-sidebar">
        <admin v-if="isAdmin">
        </admin>
        <general-information>
        </general-information>

    </div>
</template>

<script>

    import Admin from './Admin';
    import GeneralInformation from './GeneralInformation';

    export default {
        components: {Admin, GeneralInformation},
        computed: {
            isAdmin() {
                return this.$store.state.question.question.isAdmin;
            }
        }
    }
</script>

<style lang="scss">
    #elyoos-question-sidebar {
        padding-top: 4px;
        .sidebar-container {
            margin-bottom: 32px;
            h3 {
                font-size: 16px;
                border-bottom: 1px solid #ddd;
                margin-bottom: 12px;
            }
        }
    }
</style>
