<template>
    <div id="beta-version-description" class="ely-card">
        <h3 class="beta-version-title">{{$t('common:beta.title')}}</h3>
        <div class="description">{{$t('common:beta.description')}}</div>
    </div>
</template>

<script>
</script>

<style lang="scss">
    #beta-version-description {
        margin-bottom: 12px;
        font-size: 14px;
        font-weight: 300;
        h3.beta-version-title {
            color: $secondary-color;
            margin-bottom: 12px;
            font-size: 16px;
            font-weight: 500;
        }
        .description {
            margin-bottom: 8px;
        }
    }
</style>
