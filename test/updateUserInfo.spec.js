import chai from 'chai';
import request from 'supertest';
import server from '../bin/server';
import faker from 'faker';

const expect = chai.expect;
const agent = request.agent(server);

describe('Update User\'s info API', () => {
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

  it('Update done!!!', done => {
    agent.put('/api/user/update')
      .type('form')
      .send({ email: email, password: password })
      .set('Authorization', 'Bearer ' + token)
      .end((err, data) => {
        expect(200);
        expect(err).to.not.exist;
        expect(data.body.info).to.equal('User\'s info - Updated.');
        done();
      });
  });
});