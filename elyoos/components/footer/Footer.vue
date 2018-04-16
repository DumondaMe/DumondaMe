<template>
    <div id="ely-footer">
        <div id="ely-footer-container">
            <div class="footer-nav">Vision</div>
            <div class="footer-nav">Über uns</div>
            <div class="footer-nav">News</div>
            <div class="footer-nav">Spenden</div>
            <div class="footer-nav">AGB</div>
            <div class="footer-nav">Datenschutz</div>
            <div class="footer-nav">Kontakt</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Footer"
    }
</script>

<style lang="scss">
    #ely-footer {
        clear: both;
        position: relative;
        z-index: 10;
        height: 48px;
        margin-top: -48px;
        background-color: #757575;
        left: 0;
        right: 0;
        #ely-footer-container {
            max-width: 950px;
            margin: 0 auto;
            .footer-nav {
                display: inline-block;
                color: #ffffff;
                font-size: 14px;
                line-height: 14px;
                padding: 18px 0 16px 0;
                font-weight: 400;
                margin-right: 28px;
                cursor: pointer;
            }
            :hover.footer-nav {
                color: #B3E5FC;
            }
        }
    }
</style>