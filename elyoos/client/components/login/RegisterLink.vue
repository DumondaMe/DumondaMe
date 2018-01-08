<template>
    <div id="elyoos-register-link">
        <div id="register-container">
            <h2>Ein Benutzerkonto erstellen</h2>
            <v-btn color="primary" @click="$router.push({name: 'register'})">Registrieren</v-btn>
        </div>
    </div>
</template>

<style lang="scss">
    #elyoos-register-link {

        @media screen and (min-width: 750px) {
            vertical-align: top;
            display: inline-block;
            margin-left: 120px;
        }
        #register-container {
            width: 300px;
            @media screen and (max-width: 750px) {
                margin: 60px auto 0 auto;
            }
            h2 {
                font-size: 24px;
                font-weight: 400;
                margin-top: 14px;
                margin-bottom: 12px;
            }
            button {
                margin-left: 0;
            }
        }
    }
</style>
