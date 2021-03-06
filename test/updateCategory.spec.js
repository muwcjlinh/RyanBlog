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
      .expect(201)
      .end((err, user) => {
        expect(err).to.not.exist;
        token = user.body.token;
        agent.post('/api/category/create')
          .set('Authorization', 'Bearer ' + token)
          .send({ nameCategory: faker.random.word(), firstColumn: faker.random.word(), secondColumn: faker.random.word() })
          .expect(200)
          .end((err, data) => {
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
      .expect(200)
      .end((err, data) => {
        expect(err).to.not.exist;
        expect(data.body.info.nameCategory).to.equal('Test Category');
        done();
      });
  });

  it('Can not update other\'s category', done => {
    agent.put('/api/category/update/5bc6e97a9e6d23212b01a123')
      .set('Authorization', 'Bearer ' + token)
      .send({ nameCategory: 'Test Category' })
      .expect(422)
      .end((err, data) => {
        expect(err).to.not.exist;
        expect(data.body.error).to.equal('Can not find this category to update.');
        done();
      });
  });

  it('Lack of input data: nameCategory', done => {
    agent.put('/api/category/update/' + categoryId)
      .set('Authorization', 'Bearer ' + token)
      .send({ visible: 'true' })
      .expect(422)
      .end((err, data) => {
        expect(err).to.not.exist;
        expect(data.body.error).to.equal('You have to fill name of category.');
        done();
      });
  });
});