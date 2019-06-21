
const uniqid = require('uniqid');
const Api = require('../templates/Api');

class ApiActivity extends Api {
    constructor(sockets) {
        super(sockets, false);
    }

    createNewActivity(activity, ownerId = null) {
        if (!ownerId) return this.reject(400, 'Uid of creator required');
        const newActivity = activity;
        newActivity.uid = uniqid();
        newActivity.ownerId = ownerId;
        newActivity.created = new Date(Date.now()).toISOString();
        return this.makeRequest('persistance.activity', newActivity, ownerId);
    }
}

module.exports = ApiActivity;
