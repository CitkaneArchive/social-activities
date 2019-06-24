/** @module activities */

const Sockets = require('./templates/Sockets');
const BaseApi = require('./templates/BaseApi');
const ApiActivities = require('./api/ApiActivities');

const sockets = new Sockets('activities');
const { api } = new BaseApi(sockets);
const activities = new ApiActivities(sockets, api);
const bffSubscriptions = [
    'activities/activity-created',
    'activities/activity-updated',
    'activities/activity-deleted'
];

api.publish('bff/makesubscriptions', bffSubscriptions);
/**
 * Publishes a list of topics for the bff to subscribe to
 * @event module:activities.bff/makesubscriptions
 * @type {Object[]}
 */
/**
 * Publishes a new activity
 * @event module:activities.activities/activity-created
 * @type {activity}
 */
/**
 * Publishes an updated activity
 * @event module:activities.activities/activity-updated
 * @type {activity}
 */
/**
 * Publishes a deleted activity
 * @event module:activities.activities/activity-deleted
 * @type {activity}
 */
const apiInterface = {
    /**
     * @interface
     * @memberof module:activities
     * @example <caption>Called from external microservice</caption>
     * api.create('activities.<method>', parameter || [parameters], {@link ownerId}).then(({@link response}) => {...});
     * */
    create: {
        /**
         * Saves a new activity to persistant storage
         * @method module:activities.create#activity
         * @param {request} request - the standard request wrapper
         * @param {activity} request.params -The activity object
         * @param {String} request.params.title - The activity title.
         * @param {String} request.params.about - The text about the activity.
         * @param {String} request.params.date - The date that is pproposed for the activity in 'Year-Month-Day'.
         * @param {String} request.params.ownerId -The uid of the person entity who created the activity.
         * @param {ownerId} request.ownerId -The uid of the entity making the call.
         * @example {@link module:api}.create('activities.activity', {@link activity}, {@link ownerId}).then(({@link response}) => {...});;
         * @returns {(response|response-error)} 201:{@link activity}
         * @emits module:activities.activities/activity-created
         */
        activity: request => activities.createNewActivity(request.args[0], request.ownerId)
            .then(proxyRequest => api.getReqSocket('persistance').proxy(proxyRequest))
            .then((response) => {
                api.publish('activities/activity-created', response.payload);
                return response;
            })
    },
    /**
     * @interface
     * @memberof module:activities
     * @example <caption>Called from external microservice</caption>
     * api.read('activities.<method>', parameter || [parameters], {@link ownerId}).then(({@link response}) => {...});
     * */
    read: {
        /**
         * provides a list of topics for the frontend/bff to subscribe to
         * @method module:activities.read#bffSubscriptions
         * @param {request} request - the standard request wrapper
         * @param {Object[]} request.params - an empty array
         * @param {ownerId} request.ownerId -The uid of the entity making the call.
         * @example {@link module:api}.read('activities.bffSubscriptions', [], {@link ownerId}).then(({@link response}) => {...});;
         * @returns {(response|response-error)} 200:{Object[string]} an array of topics.
         */
        bffSubscriptions: () => api.resolve(200, bffSubscriptions),
        /**
         * Retrieves all activities
         * @method module:activities.read#activities
         * @param {request} request - the standard request wrapper
         * @param {Object[]} request.params - an empty array
         * @param {ownerId} ownerId -The uid of the entity making the call.
         * @example {@link module:api}.read('activities.activities', [], {@link ownerId}).then(({@link response}) => {...});;
         * @returns {(response|response-error)} 200:{@link module:activities~activities} - an object of {@link activitie}s indexed by their uid.
         * */
        activities: request => api.getReqSocket('persistance').proxy(request),
        /**
         * Retrieves an activity by uid
         * @method module:activities.read#activity
         * @param {request} request - the standard request wrapper
         * @param {string} request.params - The uid of the activity.
         * @param {ownerId} request.ownerId -The uid of the entity making the call.
         * @example {@link module:api}.read('activities.activity', 'activity123', {@link ownerId}).then(({@link response}) => {...});;
         * @returns {(response|response-error)} 200:{@link activity}.
         * */
        activity: request => api.getReqSocket('persistance').proxy(request)
    },
    /**
     * @interface
     * @memberof module:activities
     * @example <caption>Called from external microservice</caption>
     * api.update('activities.<method>', parameter || [parameters], {@link ownerId}).then(({@link response}) => {...});
     * */
    update: {
        /**
         * Updates an activity to persistant storage
         * @method module:activities.update#activity
         * @param {request} request - the standard request wrapper
         * @param {activity} request.params -The activity object
         * @param {String} [request.params.title] - The activity title.
         * @param {String} [request.params.about] - The text about the activity.
         * @param {String} [request.params.date] - The date that is pproposed for the activity in 'Year-Month-Day'.
         * @param {String} [request.params.ownerId] -The uid of the person entity who created the activity.
         * @param {String} [request.params.created] -The ISO date string of when the activity was created.
         * @param {String} request.params.uid -The unique id for the activity.
         * @param {ownerId} request.ownerId -The uid of the entity making the call.
         * @example {@link module:api}.update('activities.activity', {@link activity}, {@link ownerId}).then(({@link response}) => {...});;
         * @returns {(response|response-error)} 200:{@link activity}
         * @emits module:activities.activities/activity-updated
         * */
        activity: request => api.getReqSocket('persistance').proxy(request)
            .then((response) => {
                api.publish('activities/activity-updated', response.payload);
                return response;
            })
    },
    /**
     * @interface
     * @memberof module:activities
     * @example <caption>Called from external microservice</caption>
     * api.delete('activities.<method>', parameter || [parameters], {@link ownerId}).then(({@link response}) => {...});
     * */
    delete: {
        /**
         * Deletes an activity from persistant storage
         * @method module:activities.delete#activity
         * @param {request} request - the standard request wrapper
         * @param {activity} request.params -The activity object
         * @param {String} [request.params.title] - The activity title.
         * @param {String} [request.params.about] - The text about the activity.
         * @param {String} [request.params.date] - The date that is pproposed for the activity in 'Year-Month-Day'.
         * @param {String} [request.params.ownerId] -The uid of the person entity who created the activity.
         * @param {String} [request.params.created] -The ISO date string of when the activity was created.
         * @param {String} request.params.uid -The unique id for the activity.
         * @param {ownerId} request.ownerId -The uid of the entity making the call.
         * @example {@link module:api}.delete('activities.activity', {@link activity}, {@link ownerId}).then(({@link response}) => {...});;
         * @returns {(response|response-error)} 205:{@link activity} - the supplied activity object
         * @emits module:activities.activities/activity-deleted
         * */
        activity: request => api.getReqSocket('persistance').proxy(request)
            .then((response) => {
                api.publish('activities/activity-deleted', response.payload);
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
