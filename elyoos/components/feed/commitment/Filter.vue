<template>
    <div id="commitment-filter">

    </div>
</template>

<script>
    export default {
        components: {},
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            }
        },
        data: function () {
            return {
                dialog: false, searchQuestion: true
            };
        },
        methods: {

        }
    }
</script>

<style lang="scss">
    #commitment-filter {
        background-color: white;
        border-radius: 4px;
        border: 1px solid #e0e0e0;
        padding: 12px;
        margin: 0;

    }
</style>
