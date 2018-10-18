import chai from 'chai';
import request from 'supertest';
import server from '../bin/server';
import faker from 'faker';

const expect = chai.expect;
const agent = request.agent(server);

describe('Get all details of category', () => {
  let email = faker.random.alphaNumeric(20),
    password = faker.random.alphaNumeric(10);
  let token, categoryId;
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
          .end((err, data) => {
            expect(200);
            categoryId = data.body.category._id;
            expect(err).to.not.exist;
            done();
          });
      });
  });

  it('Get done!!!', done => {
    agent.get('/api/category/detail/' + categoryId)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .end((err, data) => {
        expect(data.body.details.length).to.equal(1);
        expect(err).to.not.exist;
        done();
      });
  });

  it('Can not get details of another\'s category', done => {
    agent.get('/api/category/detail/5bc7e6ac273c602105123123')
      .set('Authorization', 'Bearer ' + token)
      .expect(422)
      .end((err, data) => {
        expect(data.body.error).to.equal('Can not view details of this category');
        expect(err).to.not.exist;
        done();
      });
  });
});