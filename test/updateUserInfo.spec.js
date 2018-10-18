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
      .send({ email: email, password: password, firstName: 'firstName', lastName: 'lastName' })
      .expect(201)
      .end((err, user) => {
        expect(err).to.not.exist;
        token = user.body.token;
        done();
      });
  });

  it('Update done!!!', done => {
    agent.put('/api/user/update')
      .type('form')
      .send({ email: email, password: password, firstName: 'firstName', lastName: 'lastName' })
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .end((err, data) => {
        expect(err).to.not.exist;
        expect(data.body.info).to.equal('User\'s info - Updated.');
        done();
      });
  });

  it('Lack of input data: firstName', done => {
    agent.put('/api/user/update')
      .type('form')
      .send({ email: email, password: password, lastName: 'lastName' })
      .set('Authorization', 'Bearer ' + token)
      .expect(422)
      .end((err, data) => {
        expect(err).to.not.exist;
        expect(data.body.error).to.equal('You have to fill first name and last name.');
        done();
      });
  });

  it('Lack of input data: lastName', done => {
    agent.put('/api/user/update')
      .type('form')
      .send({ email: email, password: password, firstName: 'firstName' })
      .set('Authorization', 'Bearer ' + token)
      .expect(422)
      .end((err, data) => {
        expect(err).to.not.exist;
        expect(data.body.error).to.equal('You have to fill first name and last name.');
        done();
      });
  });
});