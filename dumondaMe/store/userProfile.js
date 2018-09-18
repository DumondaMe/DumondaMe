export const state = () => ({
    user: {feed: []},
    nextPeopleOfTrust: 0,
    nextPeopleTrustUser: 0,
    feedPage: 0
});

const setTrustCircleForSinglePerson = function (users, userId, personOfTrustSince, isPersonOfTrust) {
    let user = users.find((contact) => contact.userId === userId);
    if (user) {
        if (isPersonOfTrust) {
            user.personOfTrustSince = personOfTrustSince;
        } else {
            delete user.personOfTrustSince;
        }
        user.isPersonOfTrust = isPersonOfTrust;
        return true;
    }
    return false;
};

const setTrustCircleForFeed = function (feed, userId, isPersonOfTrust) {
    let changedState = false;
    for (let card of feed) {
        if (card.user && card.user.userId === userId) {
            card.user.isTrustUser = isPersonOfTrust;
            changedState = true;
        }
        if (card.creator && card.creator.userId === userId) {
            card.creator.isTrustUser = isPersonOfTrust;
            changedState = true;
        }
    }
};

export const mutations = {
    SET_USER_PROFILE: function (state, user) {
        state.user = user;
        if (!state.user.userDescription) {
            state.user.userDescription = '';
        }
        state.nextPeopleOfTrust = user.peopleOfTrust.length;
        state.nextPeopleTrustUser = user.peopleTrustUser.length;
        state.feedPage = 1;
    },
    CHANGE_USER_DATA: function (state, user) {
        state.user.forename = user.forename;
        state.user.surname = user.surname;
        state.user.userDescription = user.userDescription;
    },
    UPDATE_USER_PROFILE_IMAGE: function (state, image) {
        state.user.profileImage = image;
    },
    REMOVE_USER_FROM_TRUST_CIRCLE: function (state, userId) {
        let setTrustUser = false;
        if (state.user.userId === userId) {
            state.user.isPersonOfTrustOfLoggedInUser = false;
        }
        if (setTrustCircleForSinglePerson(state.user.peopleOfTrust, userId, null, false)) {
            setTrustUser = true;
        }
        if (setTrustCircleForSinglePerson(state.user.peopleTrustUser, userId, null, false)) {
            setTrustUser = true;
        }
        if (setTrustCircleForFeed(state.user.feed, userId, false)) {
            setTrustUser = true;
        }
        if (setTrustUser && state.user.isLoggedInUser) {
            state.user.numberOfPeopleOfTrust--;
        }
    },
    ADD_USER_TO_TRUST_CIRCLE: function (state, userToAdd) {
        let setTrustUser = false;
        if (state.user.userId === userToAdd.userId) {
            state.user.isPersonOfTrustOfLoggedInUser = true;
        }
        if (setTrustCircleForSinglePerson(state.user.peopleOfTrust, userToAdd.userId,
            userToAdd.personOfTrustSince, true)) {
            setTrustUser = true;
        }
        if (setTrustCircleForSinglePerson(state.user.peopleTrustUser, userToAdd.userId,
            userToAdd.personOfTrustSince, true)) {
            setTrustUser = true;
        }
        if (setTrustCircleForFeed(state.user.feed, userToAdd.userId, true)) {
            setTrustUser = true;
        }
        if (setTrustUser && state.user.isLoggedInUser) {
            state.user.numberOfPeopleOfTrust++;
        }
        /*if ((setTrustCircleForSinglePerson(state.user.peopleOfTrust, userToAdd.userId,
            userToAdd.personOfTrustSince, true) ||
            setTrustCircleForSinglePerson(state.user.peopleTrustUser, userToAdd.userId,
                userToAdd.personOfTrustSince, true) ||
            setTrustCircleForFeed(state.user.feed, userToAdd.userId)) && state.user.isLoggedInUser) {
            state.user.numberOfPeopleOfTrust++;
        }*/
        /*let user = state.user.peopleOfTrust.find((contact) => contact.userId === userToAdd.userId);
        if (user) {
            user.personOfTrustSince = userToAdd.personOfTrustSince;
            user.isPersonOfTrust = true;
            if (state.user.isLoggedInUser) {
                addedToLoggedInUser = true;
            }
        }*/
        /*for (let card of state.user.feed) {
            if (card.user && card.user.userId === userToAdd.userId) {
                card.user.isTrustUser = true;
                if (state.user.isLoggedInUser) {
                    addedToLoggedInUser = true;
                }
            }
            if (card.creator && card.creator.userId === userToAdd.userId) {
                card.creator.isTrustUser = true;
                if (state.user.isLoggedInUser) {
                    addedToLoggedInUser = true;
                }
            }
        }*/
        /*if (addedToLoggedInUser) {
            state.user.numberOfPeopleOfTrust++;
        }*/
    },
    ADD_PEOPLE_OF_TRUST: function (state, {peopleOfTrust, numberOfPeopleOfTrust, numberOfInvisiblePeopleOfTrust}) {
        state.user.peopleOfTrust = state.user.peopleOfTrust.concat(peopleOfTrust);
        state.user.numberOfPeopleOfTrust = numberOfPeopleOfTrust;
        state.user.numberOfInvisiblePeopleOfTrust = numberOfInvisiblePeopleOfTrust;
        state.nextPeopleOfTrust = state.user.peopleOfTrust.length;
    },
    ADD_PEOPLE_TRUST_USER: function (state, {peopleTrustUser, numberOfPeopleTrustUser, numberOfInvisiblePeopleTrustUser}) {
        state.user.peopleTrustUser = state.user.peopleTrustUser.concat(peopleTrustUser);
        state.user.numberOfPeopleTrustUser = numberOfPeopleTrustUser;
        state.user.numberOfInvisiblePeopleTrustUser = numberOfInvisiblePeopleTrustUser;
        state.nextPeopleTrustUser = state.user.peopleTrustUser.length;
    },
    ADD_FEED: function (state, {feed}) {
        state.user.feed = state.user.feed.concat(feed);
    },
    UP_VOTE_ANSWER(state, answerId) {
        let upVoteAnswer = state.user.feed.find((element) => element.answerId === answerId);
        upVoteAnswer.numberOfUpVotes++;
    },
    DOWN_VOTE_ANSWER(state, answerId) {
        let downVoteAnswer = state.user.feed.find((answer) => answer.answerId === answerId);
        downVoteAnswer.numberOfUpVotes--;
    },
    REMOVE_ANSWER(state, answerId) {
        let answerToRemove = state.user.feed.findIndex((answer) => answer.answerId === answerId);
        if (answerToRemove > -1) {
            state.user.feed.splice(answerToRemove, 1);
        }
    },
    ADD_QUESTION_WATCH(state, questionId) {
        let question = state.user.feed.find(
            (element) => element.questionId === questionId && element.type === 'Question');
        question.numberOfWatches++;
    },
    REMOVE_QUESTION_WATCH(state, questionId) {
        let question = state.user.feed.find(
            (element) => element.questionId === questionId && element.type === 'Question');
        question.numberOfWatches--;
    },
    ADD_COMMITMENT_WATCH(state, commitmentId) {
        let commitment = state.user.feed.find(
            (element) => element.commitmentId === commitmentId && element.type === 'Commitment');
        commitment.numberOfWatches++;
    },
    REMOVE_COMMITMENT_WATCH(state, commitmentId) {
        let commitment = state.user.feed.find(
            (element) => element.commitmentId === commitmentId && element.type === 'Commitment');
        commitment.numberOfWatches--;
    },
};

export const getters = {
    isLoggedInUser: state => {
        return state.user.isLoggedInUser;
    }
};

export const actions = {
    async getProfile({commit, rootState}) {
        let user = await this.$axios.$get(`user/profile`,
            {params: {guiLanguage: rootState.i18n.language, languages: ['de', 'en']}});
        commit('SET_USER_PROFILE', user);
    },
    async getProfileOtherUser({commit, rootState}, userId) {
        let user = await this.$axios.$get(`user/profile/`,
            {params: {userId, guiLanguage: rootState.i18n.language, languages: ['de', 'en']}});
        commit('SET_USER_PROFILE', user);
    },
    async addUserToTrustCircle({commit}, userId) {
        let response = await this.$axios.$post(`user/trustCircle/${userId}`);
        commit('ADD_USER_TO_TRUST_CIRCLE', {userId, personOfTrustSince: response.personOfTrustSince});
    },
    async removeUserFromTrustCircle({commit}, userId) {
        await this.$axios.$delete(`user/trustCircle/${userId}`);
        commit('REMOVE_USER_FROM_TRUST_CIRCLE', userId);
    },
    async uploadUserData({commit}, userProfile) {
        if (typeof userProfile.userDescription === 'string' && userProfile.userDescription.trim().length === 0) {
            delete userProfile.userDescription;
        }
        await this.$axios.$put(`user/profile`, userProfile);
        commit('CHANGE_USER_DATA', userProfile);
    },
    async loadNextPeopleOfTrust({state, commit}) {
        let response = await this.$axios.$get(`user/profile/trustCircle`,
            {params: {userId: state.user.userId, maxItems: 15, skip: state.nextPeopleOfTrust}});
        commit('ADD_PEOPLE_OF_TRUST', {
            peopleOfTrust: response.peopleOfTrust,
            numberOfPeopleOfTrust: response.numberOfPeopleOfTrust,
            numberOfInvisiblePeopleOfTrust: response.numberOfInvisiblePeopleOfTrust
        });
    },
    async loadNextPeopleTrustUser({state, commit}) {
        let response = await this.$axios.$get(`user/profile/peopleTrustUser`,
            {params: {userId: state.user.userId, maxItems: 15, skip: state.nextPeopleTrustUser}});
        commit('ADD_PEOPLE_TRUST_USER', {
            peopleTrustUser: response.peopleTrustUser,
            numberOfPeopleTrustUser: response.numberOfPeopleTrustUser,
            numberOfInvisiblePeopleTrustUser: response.numberOfInvisiblePeopleTrustUser
        });
    },
    async loadNextFeedElements({state, rootState, commit}) {
        let response = await this.$axios.$get(`user/profile/activity`, {
            params: {
                userId: state.user.userId, page: state.feedPage, guiLanguage: rootState.i18n.language,
                languages: ['de', 'en']
            }
        });
        commit('ADD_ADMIN_COMMITMENTS', {
            commitments: response.commitments,
            numberOfCommitments: response.numberOfCommitments
        });
    }
};