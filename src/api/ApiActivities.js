/* eslint-disable class-methods-use-this */

const uniqid = require('uniqid');
const Api = require('../templates/Api');

let api;
class ApiActivity extends Api {
    constructor(sockets, baseApi) {
        super(sockets, false);
        api = baseApi;
    }

    createNewActivity(activity, ownerId = null) {
        if (!ownerId) return api.reject(400, 'Uid of creator required');
        const newActivity = activity;
        newActivity.uid = uniqid();
        newActivity.ownerId = ownerId;
        newActivity.created = new Date(Date.now()).toISOString();
        return api.makeRequestObject('create.activity', newActivity, ownerId);
    }
}

module.exports = ApiActivity;
