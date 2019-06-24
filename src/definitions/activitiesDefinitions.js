module.exports = {
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
    activity: (title, about, date, ownerId, created, uid) => ({
        title, about, date, ownerId, created, uid
    })
};

/**
 * @typedef module:activities~activities
 * @property {activity} uid - an object of {@link activity}s indexed by their uid.
 */
