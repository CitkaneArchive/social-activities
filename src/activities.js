const Sockets = require('../../social-deployment/templates/nodejs/api/Sockets');
const ApiActivities = require('./api/ApiActivities');

const sockets = new Sockets('activities');
const api = new ApiActivities(sockets);
const bffSubscriptions = [
    'activities.activity-created',
    'activities.activity-updated',
    'activities.activity-deleted'
];
sockets.publish('bff.makesubscriptions', bffSubscriptions);

const apiInterface = {
    create: {
        activity: request => api.createNewActivity(request.args[0], request.ownerId)
            .then((response) => {
                api.sockets.publish('activities.activity-created', response.payload);
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
                api.sockets.publish('activities.activity-updated', response.payload);
                return response;
            })
    },
    delete: {
        activity: request => api.getReqSocket('persistance').proxy(request)
            .then((response) => {
                api.sockets.publish('activities.activity-deleted', response.payload);
                return response;
            })
    }
};

sockets.makeResponder(apiInterface);
