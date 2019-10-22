<template>
    <div class="harvesting-info-container ely-card">
        <h3 class="harvesting-title">{{harvestingUser.name}}</h3>
        <img class="harvesting-image" :src="harvestingUser.userImage" @click="$router.push({name: 'user-userId-slug',
                     params: {userId: harvestingUser.userId, slug: harvestingUser.slug}})">
        <div class="harvesting-description" v-if="hasTakenPlace">
            <span v-if="harvestingUser.answeredQuestion && harvestingUser.createdQuestion">
                {{$t('pages:question.harvestingInfo.questionCreatedAndAnswered',
                {event: harvestingUser.name})}}</span>
            <span v-else-if="harvestingUser.answeredQuestion && !harvestingUser.createdQuestion">
                {{$t('pages:question.harvestingInfo.questionAnswered',
                {event: harvestingUser.name})}}</span>
            <span v-else-if="!harvestingUser.answeredQuestion && harvestingUser.createdQuestion">
                {{$t('pages:question.harvestingInfo.questionCreated',
                {event: harvestingUser.name})}}</span>
        </div>
        <div class="harvesting-description">
            <span v-html="$t('pages:question.harvestingInfo.questionWillBeAnswered',
            {event: harvestingUser.name,
            date: getDate})"></span>
        </div>
        <div class="navigate-to-harvesting-user-button">
            <v-btn color="secondary" @click="$router.push({name: 'user-userId-slug',
                     params: {userId: harvestingUser.userId, slug: harvestingUser.slug}})">
                {{$t('pages:question.harvestingInfo.toTheEventButton')}}
            </v-btn>
        </div>
    </div>
</template>

<script>
    import isPast from 'date-fns/is_past';

    export default {
        computed: {
            harvestingUser() {
                return this.$store.state.question.question.harvestingUser;
            },
            hasTakenPlace() {
                return isPast(this.$store.state.question.question.harvestingUser.endDate * 1000);
            },
            getDate() {
                return this.$options.filters.formatFromToDate(this.$store.state.question.question.harvestingUser.startDate,
                    this.$store.state.question.question.harvestingUser.endDate, this.$t('common:at'));
            }
        }
    }
</script>

<style lang="scss">
    .harvesting-info-container {
        margin-bottom: 12px;

        h3.harvesting-title {
            @include defaultPaddingCard();
            margin-bottom: 12px;
            font-size: 16px;
            font-weight: 500;
        }

        .harvesting-image {
            width: 100%;
            cursor: pointer;
        }

        .harvesting-description {
            @include defaultPaddingCard();
            font-weight: 300;
            margin-top: 8px;
        }

        .navigate-to-harvesting-user-button {
            @include defaultPaddingCard();
            margin-top: 14px;

            button {
                width: 100%;
            }
        }
    }
</style>
