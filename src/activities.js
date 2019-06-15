const config = require('config');

// eslint-disable-next-line no-underscore-dangle
global.__network = config.get('network');

const Sockets = require('../../social-deployment/templates/nodejs/api/Sockets');
const Api = require('./api/Api');

const sockets = new Sockets('activities');
const api = new Api(sockets);

const apiInterface = {
    create: {},
    read: {},
    update: {},
    delete: {}
};

sockets.makeResponder(apiInterface);
