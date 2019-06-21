/**
 * The uid of the entity making the api call.
 *
 * This should be passed in from the previous service call and originates in the frontend/bff service.
 *
 * It can be overridden at the api interface level.
 * @typedef  {String} ownerId
 *
*/

module.exports = {
    /**
     * @typedef request
     * @property {String} ownerId - The uid of the entity which made the api call;
     * @property {String} action - The CRUD action to be called;
     * @property {String} command - The corresponding command invocation for the CRUD operation;
     * @property {(String|Object[])} args - The arguments to pass to the command.
     */
    request: (ownerId, action, command, args = []) => {
        let thisArgs = args;
        if (!Array.isArray(thisArgs)) thisArgs = [thisArgs];
        return {
            ownerId,
            action,
            command,
            args: thisArgs
        };
    },

    /**
     * @typedef response
     * @property {Number} status - The response code as to HTTP schema.
     * @property {any} payload - The api response payload.
     */
    response: (status, payload) => ({
        status,
        payload
    }),
    /**
     * @typedef response-error
     * @property {Number} status - The response code as to HTTP schema.
     * @property {any} message - The api response error.
     */
    error: (status, message) => ({
        status,
        message
    }),
    /**
     * **The object describing an activity.**
     * @typedef activity
     * @property {String} title - The title of the activity.
     * @property {String} about - Some text about the activity.
     * @property {String} date - The date that the activity is happening (use year-month-day format).
     * @todo implement iso for date field.
     * @property {String} ownerId - The uid of the user who created the activity.
     * @property {String} created -The ISO date string of when the activity was created.
     * @property {String} uid -The unique id for the activity.
     */
    user: (title, about, date, ownerId, created, uid) => ({
        title, about, date, ownerId, created, uid
    })
};
