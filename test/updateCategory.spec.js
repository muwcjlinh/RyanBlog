import chai from 'chai';
import request from 'supertest';
import server from '../bin/server';
import faker from 'faker';

const expect = chai.expect;
const agent = request.agent(server);

describe('Update category', () => {
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
            expect(err).to.not.exist;
            categoryId = data.body.category._id;
            done();
          });
      });
  });

  it('Update done!!!', done => {
    agent.put('/api/category/update/' + categoryId)
      .set('Authorization', 'Bearer ' + token)
      .send({ nameCategory: 'Test Category' })
      .end((err, data) => {
        expect(200);
        expect(err).to.not.exist;
        expect(data.body.info.nameCategory).to.equal('Test Category');
        done();
      });
  });

  it('Can not update other\'s category', done => {
    agent.put('/api/category/update/5bc6e97a9e6d23212b01a123')
      .set('Authorization', 'Bearer ' + token)
      .send({ nameCategory: 'Test Category' })
      .end((err, data) => {
        expect(422);
        expect(err).to.not.exist;
        expect(data.body.error).to.equal('Can not find this category to update.');
        done();
      });
  });
});