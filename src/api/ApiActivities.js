
const uniqid = require('uniqid');
const Api = require('../../../social-deployment/templates/nodejs/api/Api');

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
        return this.api.create('persistance.activity', newActivity, ownerId)
            .then(response => this.checkStatus(response));
    }
}

module.exports = ApiActivity;
