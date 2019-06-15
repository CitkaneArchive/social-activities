const Sockets = require('../../social-deployment/templates/nodejs/api/Sockets');
const ApiActivities = require('./api/ApiActivities');

const sockets = new Sockets('activities');
const api = new ApiActivities(sockets);

const apiInterface = {
    create: {
        activity: request => api.createNewActivity(request.args[0], request.ownerId)
            .then((response) => {
                api.publish('activities.activity-created', response.payload);
                return response;
            })
            .catch(err => err)
    },
    read: {
        activities: request => api.getReqSocket('persistance').proxy(request)
    },
    update: {},
    delete: {}
};

sockets.makeResponder(apiInterface);
