/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-extraneous-dependencies */

const LOG_LEVEL = process.env.LOG_LEVEL || 'WARN';
const { MessageConsumerPact, synchronousBodyHandler } = require('@pact-foundation/pact');
const path = require('path');
const fs = require('fs-extra');
const chai = require('chai');
const dateString = require('chai-date-string');
const {
    apiInterface,
    api,
    sockets,
    gracefulShutdown
} = require('../../src/activities');

const { expect } = chai;
chai.use(dateString);
const pactsDir = path.join(__dirname, '../pacts');

describe('social-activities consumer', () => {
    let messagePact;
    before(() => {
        fs.removeSync(path.join(pactsDir, 'social-activities-social-persistance.json'));
        messagePact = new MessageConsumerPact({
            consumer: 'social-activities',
            provider: 'social-persistance',
            dir: pactsDir,
            logLevel: LOG_LEVEL,
            spec: 2
        });
    });

    after(() => {
        setTimeout(() => {
            gracefulShutdown();
        }, 1000);
    });

    it('is running in test environment', () => {
        expect(process.env.NODE_ENV).to.equal('test');
    });

    it('publishes a list of subscription topics to \'bff.makesubscriptions\'', () => {
        let lastMessage;
        let topic;
        let topics;
        try {
            [lastMessage] = sockets.publisher._outgoing.lastBatch.content;
            [topic, topics] = JSON.parse(lastMessage.toString());
            topics = JSON.parse(topics);
        } catch (err) {
            throw err;
        }
        expect(topic).to.equal('bff.makesubscriptions');
        expect(topics.length).to.equal(3);
    });
    describe('create.activity', () => {
        it('creates a new activity object', async () => {
            function handler(response) {
                expect(response.status).to.equal(201);
                expect(response.payload).to.be.an('object');
                expect(response.payload).to.have.keys([
                    'title',
                    'about',
                    'date',
                    'ownerId',
                    'created',
                    'uid'
                ]);
                expect(response.payload.uid).to.be.an('string');
                expect(response.payload.uid).to.not.be.empty;
                expect(response.payload.created).to.be.a.dateString();
                expect(response.payload.ownerId).to.equal('test-social-activities');
            }
            let request = await api.makeRequestObject('create.activity', {
                title: 'Test Activity',
                about: 'About the activity',
                date: '2019-06-18'
            }, 'test-social-activities');

            api.getReqSocket().prototype.proxy = (proxyRequest) => {
                request = proxyRequest;
                const newActivity = request.args[0];
                return api.resolve(201, newActivity);
            };
            const expectedResponse = await apiInterface.create.activity(request);

            return messagePact
                .expectsToReceive('persistance.create.activity')
                .given(request)
                .withContent(expectedResponse)
                .withMetadata({ 'content-type': 'application/json' })
                .verify(synchronousBodyHandler(handler));
        });

        it('publishes the new activity to the \'activities.activity-created\' event', () => {
            let lastMessage;
            let topic;
            let payload;
            try {
                [lastMessage] = sockets.publisher._outgoing.lastBatch.content;
                [topic, payload] = JSON.parse(lastMessage.toString());
                payload = JSON.parse(payload);
            } catch (err) {
                throw err;
            }

            expect(topic).to.equal('activities.activity-created');
            expect(payload).to.be.an('object');
            expect(payload.title).to.equal('Test Activity');
        });
    });
});
