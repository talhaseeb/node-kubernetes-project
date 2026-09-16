const request = require('supertest');
const app = require('./app');

describe('GET /', () => {
    it('returns the Kubernetes hello message', async () => {
        const response = await request(app).get('/');

        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('<h1> Hello world from inside latest Kubernetes! </h1>');
    });
});