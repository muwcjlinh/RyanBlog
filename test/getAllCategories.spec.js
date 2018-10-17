import chai from 'chai';
import request from 'supertest';
import server from '../bin/server';
import faker from 'faker';

const expect = chai.expect;
const agent = request.agent(server);

describe('Get all categories', () => {
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
        agent.post('/api/category/create')
          .set('Authorization', 'Bearer ' + token)
          .send({ nameCategory: faker.random.word(), firstColumn: faker.random.word(), secondColumn: faker.random.word() })
          .end((err) => {
            expect(200);
            expect(err).to.not.exist;
            done();
          });
      });
  });

  it('Get done!!!', done => {
    agent.get('/api/category/all')
      .set('Authorization', 'Bearer ' + token)
      .end((err) => {
        expect(200);
        expect(err).to.not.exist;
        done();
      });
  });

  // Need test case when do not have any categories yet
});