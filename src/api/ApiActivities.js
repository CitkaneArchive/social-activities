
const uniqid = require('uniqid');
const Api = require('../../../social-deployment/templates/nodejs/api/Api');

class ApiActivity extends Api {
    constructor(apiInterface) {
        super('activities', apiInterface);
    }

    createNewActivity(activity, ownerId = null) {
        const newActivity = activity;
        newActivity.uid = uniqid();
        return this.api.create('persistance.activity', newActivity, ownerId)
            .then(response => this.checkStatus(response));
    }
}

module.exports = ApiActivity;
