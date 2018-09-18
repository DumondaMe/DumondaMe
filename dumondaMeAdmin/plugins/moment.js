import Vue from 'vue';
import moment from 'moment';
import 'moment/locale/de';
import 'moment/locale/en-gb';

Vue.filter('formatRelativeTimesAgo', function (value) {
    if (value) {
        return moment.unix(value).fromNow();
    }
});

Vue.filter('formatDate', function (value) {
    if (value) {
        return moment.unix(value).format('l LT');
    }
});

Vue.filter('formatDateOnly', function (value) {
    if (value) {
        return moment.unix(value).format('ll');
    }
});

Vue.filter('formatFromToDate', function (startDate, endDate, atTranslation) {
    startDate = moment.unix(startDate);
    endDate = moment.unix(endDate);
    if (startDate.isSame(endDate, 'day')) {
        return `${startDate.format('LL')} ${atTranslation}
                    ${startDate.format('HH:mm')} - ${endDate.format('HH:mm')}`;
    }
    return `${startDate.format('LL')} ${atTranslation}
                ${startDate.format('HH:mm')} - ${endDate.format('LL')} ${endDate.format('HH:mm')}`;
});

export default ({store}) => {
    moment.locale(store.state.i18n.language);
};
