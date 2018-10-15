import chai from 'chai';
import request from 'supertest';
import server from '../bin/server';
import faker from 'faker';

const expect = chai.expect;
const agent = request.agent(server);

describe('Create new detail for category', () => {
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

  it('Creat done!!!', done => {
    agent.post('/api/category/detail/create')
      .set('Authorization', 'Bearer ' + token)
      .send({ categoryId: categoryId, firstColumn: faker.random.word(), secondColumn: faker.random.word() })
      .end((err) => {
        expect(200);
        expect(err).to.not.exist;
        done();
      });
  });

  it('Can not create new detail for non existed category', done => {
    agent.post('/api/category/detail/create')
      .set('Authorization', 'Bearer ' + token)
      .send({ categoryId: '5bc44e2fb2d58673e09ec123', firstColumn: faker.random.word(), secondColumn: faker.random.word() })
      .end((err, data) => {
        console.log(data.body);
        expect(422);
        expect(err).to.not.exist;
        done();
      });
  });

  it('Lack of input data: body', done => {
    agent.post('/api/category/detail/create')
      .set('Authorization', 'Bearer ' + token)
      .end((err, data) => {
        expect(422);
        expect(err).to.not.exist;
        expect(data.body.error).to.equal('Lack of input data');
        done();
      });
  });

  it('Lack of input data: nameCategory', done => {
    agent.post('/api/category/detail/create')
      .set('Authorization', 'Bearer ' + token)
      .send({ categoryId: '', firstColumn: 'Test 1st column detail', secondColumn: 'Test 2nd column detail' })
      .end((err, data) => {
        expect(422);
        expect(err).to.not.exist;
        expect(data.body.error).to.equal('Lack of input data');
        done();
      });
  });

  it('Lack of input data: firstColumn', done => {
    agent.post('/api/category/detail/create')
      .set('Authorization', 'Bearer ' + token)
      .send({ categoryId: 'Test Category', firstColumn: '', secondColumn: 'Test 2nd column detail' })
      .end((err, data) => {
        expect(422);
        expect(err).to.not.exist;
        expect(data.body.error).to.equal('Lack of input data');
        done();
      });
  });

  it('Lack of input data: secondColumn', done => {
    agent.post('/api/category/detail/create')
      .set('Authorization', 'Bearer ' + token)
      .send({ categoryId: 'Test Category', firstColumn: 'Test 1st column detail', secondColumn: '' })
      .end((err, data) => {
        expect(422);
        expect(err).to.not.exist;
        expect(data.body.error).to.equal('Lack of input data');
        done();
      });
  });
});