import chai from 'chai';
import request from 'supertest';
import server from '../bin/server';
import faker from 'faker';

const expect = chai.expect;
const agent = request.agent(server);

describe('Get User\'s info API', () => {
  let email = faker.random.alphaNumeric(20),
    password = faker.random.alphaNumeric(10);
  let token;
  before(done => {
    agent.post('/api/auth/register')
      .type('form')
      .send({ email: email, password: password, firstName: faker.random.word(), lastName: faker.random.word() })
      .end((err, user) => {
        expect(201);
        expect(err).to.not.exist;
        token = user.body.token;
        done();
      });
  });

  it('Get done!!!', done => {
    agent.get('/api/user')
      .set('Authorization', 'Bearer ' + token)
      .end((err) => {
        expect(200);
        expect(err).to.not.exist;
        done();
      });
  });
});