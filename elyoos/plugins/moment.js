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
        return moment.unix(value).format('lll');
    }
});

Vue.filter('formatDateOnly', function (value) {
    if (value) {
        return moment.unix(value).format('ll');
    }
});

export default ({store}) => {
    moment.locale(store.state.i18n.language);
}
