const app = require('../src/app.js');
const request = require('supertest');
const mocha = require('mocha');

describe('GET /health', () => {
    it('should respond with 200 status', done => {
        request(app)
            .get('/health')
            .expect(200, done)
    });
});
