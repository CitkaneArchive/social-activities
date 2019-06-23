
const Sockets = require('./templates/Sockets');
const BaseApi = require('./templates/BaseApi');
const ApiActivities = require('./api/ApiActivities');

const sockets = new Sockets('activities');
const { api } = new BaseApi(sockets);
const activities = new ApiActivities(sockets, api);
const bffSubscriptions = [
    'activities.activity-created',
    'activities.activity-updated',
    'activities.activity-deleted'
];
api.publish('bff.makesubscriptions', bffSubscriptions);

const apiInterface = {

    create: {
        activity: request => activities.createNewActivity(request.args[0], request.ownerId)
            .then(proxyRequest => api.getReqSocket('persistance').proxy(proxyRequest))
            .then((response) => {
                api.publish('activities.activity-created', response.payload);
                return response;
            })
    },
    read: {
        bffSubscriptions: () => api.resolve(200, bffSubscriptions),

        activities: request => api.getReqSocket('persistance').proxy(request),
        activity: request => api.getReqSocket('persistance').proxy(request)
    },
    update: {
        activity: request => api.getReqSocket('persistance').proxy(request)
            .then((response) => {
                api.publish('activities.activity-updated', response.payload);
                return response;
            })
    },
    delete: {
        activity: request => api.getReqSocket('persistance').proxy(request)
            .then((response) => {
                api.publish('activities.activity-deleted', response.payload);
                return response;
            })
    }
};

sockets.makeResponder(apiInterface);

function gracefulShutdown() {
    console.log('Gracefully shutting down social-activities');
    process.exit();
}
module.exports = {
    apiInterface,
    api,
    sockets,
    gracefulShutdown
};
