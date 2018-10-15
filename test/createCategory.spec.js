import chai from 'chai';
import request from 'supertest';
import server from '../bin/server';
import faker from 'faker';

const expect = chai.expect;
const agent = request.agent(server);

describe('Create new category', () => {
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

  it('Creat done!!!', done => {
    agent.post('/api/category/create')
      .set('Authorization', 'Bearer ' + token)
      .send({ nameCategory: 'Test Category', firstColumn: 'Test 1st column detail', secondColumn: 'Test 2nd column detail' })
      .end((err, data) => {
        expect(200);
        expect(err).to.not.exist;
        expect(data.body.category.nameCategory).to.equal('Test Category');
        expect(data.body.category.details[0].firstColumn).to.equal('Test 1st column detail');
        expect(data.body.category.details[0].secondColumn).to.equal('Test 2nd column detail');
        done();
      });
  });

  it('Lack of input data: body', done => {
    agent.post('/api/category/create')
      .set('Authorization', 'Bearer ' + token)
      .end((err, data) => {
        expect(422);
        expect(err).to.not.exist;
        expect(data.body.error).to.equal('Lack of input data');
        done();
      });
  });

  it('Lack of input data: nameCategory', done => {
    agent.post('/api/category/create')
      .set('Authorization', 'Bearer ' + token)
      .send({ nameCategory: '', firstColumn: 'Test 1st column detail', secondColumn: 'Test 2nd column detail' })
      .end((err, data) => {
        expect(422);
        expect(err).to.not.exist;
        expect(data.body.error).to.equal('Lack of input data');
        done();
      });
  });

  it('Lack of input data: firstColumn', done => {
    agent.post('/api/category/create')
      .set('Authorization', 'Bearer ' + token)
      .send({ nameCategory: 'Test Category', firstColumn: '', secondColumn: 'Test 2nd column detail' })
      .end((err, data) => {
        expect(422);
        expect(err).to.not.exist;
        expect(data.body.error).to.equal('Lack of input data');
        done();
      });
  });

  it('Lack of input data: secondColumn', done => {
    agent.post('/api/category/create')
      .set('Authorization', 'Bearer ' + token)
      .send({ nameCategory: 'Test Category', firstColumn: 'Test 1st column detail', secondColumn: '' })
      .end((err, data) => {
        expect(422);
        expect(err).to.not.exist;
        expect(data.body.error).to.equal('Lack of input data');
        done();
      });
  });
});