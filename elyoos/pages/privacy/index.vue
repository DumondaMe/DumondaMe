<template>
    <div id="privacy-policy">
        <h1>{{$t('pages:privacy.title')}}</h1>
        <h2>{{$t('pages:privacy.general.title')}}</h2>
        <ul>
            <li>{{$t('pages:privacy.general.point1')}}</li>
            <li>{{$t('pages:privacy.general.point2')}}</li>
            <li>{{$t('pages:privacy.general.point3')}}</li>
        </ul>
        <h2>{{$t('pages:privacy.processingData.title')}}</h2>

        <h3>1. {{$t('pages:privacy.processingData.general.title')}}</h3>
        <p>{{$t('pages:privacy.processingData.general.text1')}}</p>

        <h3>2. {{$t('pages:privacy.processingData.informationProvideToUs.title')}}</h3>
        <p>{{$t('pages:privacy.processingData.informationProvideToUs.text1')}}</p>
        <ul>
            <li>{{$t('pages:privacy.processingData.informationProvideToUs.point1')}}</li>
            <li>{{$t('pages:privacy.processingData.informationProvideToUs.point2')}}</li>
            <li>{{$t('pages:privacy.processingData.informationProvideToUs.point3')}}</li>
        </ul>

        <h3>3. {{$t('pages:privacy.processingData.informationAutomaticallyObtain.title')}}</h3>
        <p>{{$t('pages:privacy.processingData.informationAutomaticallyObtain.text1')}}</p>
        <ul>
            <li>{{$t('pages:privacy.processingData.informationAutomaticallyObtain.point1')}}</li>
            <li>{{$t('pages:privacy.processingData.informationAutomaticallyObtain.point2')}}</li>
            <li>{{$t('pages:privacy.processingData.informationAutomaticallyObtain.point3')}}</li>
        </ul>

        <h3>4. {{$t('pages:privacy.processingData.informationFromOtherSource.title')}}</h3>
        <p>{{$t('pages:privacy.processingData.informationFromOtherSource.text1')}}</p>

        <h3>5. {{$t('pages:privacy.processingData.whoReceiveInformation.title')}}</h3>
        <p>{{$t('pages:privacy.processingData.whoReceiveInformation.text1')}}</p>
        <ul>
            <li>{{$t('pages:privacy.processingData.whoReceiveInformation.point1')}}</li>
            <li>{{$t('pages:privacy.processingData.whoReceiveInformation.point2')}}</li>
        </ul>

        <h2>{{$t('pages:privacy.rights.title')}}</h2>

        <h3>{{$t('pages:privacy.rights.userRights.title')}}</h3>
        <p>{{$t('pages:privacy.rights.userRights.text1')}}</p>

        <h3>{{$t('pages:privacy.rights.deleteData.title')}}</h3>
        <p>{{$t('pages:privacy.rights.deleteData.text1')}}</p>

        <h3>{{$t('pages:privacy.rights.rightOfObjection.title')}}</h3>
        <p>{{$t('pages:privacy.rights.rightOfObjection.text1')}}</p>
    </div>
</template>

<script>
    export default {
        computed: {
            selectedLanguage() {
                return this.$store.state.i18n.language
            }
        }
    }
</script>

<style lang="scss">
    #privacy-policy {
        .terms-date {
            margin-top: 4px;
            font-size: 14px;
        }

        .terms-text {
            margin-top: 12px;
            font-size: 14px;
        }

        h1 {
            font-size: 52px;
            line-height: 60px;
            color: #333;
            margin-bottom: 40px;
        }
        h2 {
            font-size: 36px;
            line-height: 52px;
            color: #333;
            margin-top: 30px;
            margin-bottom: 20px;
        }
        h3 {
            font-size: 24px;
            color: #333;
            margin-top: 30px;
            margin-bottom: 12px;
        }

        ul {
            margin-left: 18px;
            margin-bottom: 18px;
        }
    }
</style>