/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
const uniqid = require('uniqid');
const BaseApi = require('../../../social-deployment/templates/nodejs/api/BaseApi');

class Api extends BaseApi {
    constructor(sockets) {
        super();
        this.sockets = sockets;
        this.ownerId = null;
    }
}

module.exports = Api;
