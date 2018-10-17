import chai from 'chai';
import request from 'supertest';
import server from '../bin/server';
import faker from 'faker';

const expect = chai.expect;
const agent = request.agent(server);

describe('Update detail of category', () => {
  let email = faker.random.alphaNumeric(20),
    password = faker.random.alphaNumeric(10);
  let token, detailId;
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
            detailId = data.body.category.details[0]._id;
            done();
          });
      });
  });

  it('Creat done!!!', done => {
    agent.put('/api/category/detail/update/' + detailId)
      .set('Authorization', 'Bearer ' + token)
      .send({ firstColumn: 'faker.random.word()', secondColumn: faker.random.word() })
      .end((err, data) => {
        expect(data.body.info.firstColumn).to.equal('faker.random.word()');
        expect(200);
        expect(err).to.not.exist;
        done();
      });
  });

  it('Can not update other\'s detail', done => {
    agent.put('/api/category/detail/update/5bc6e97a9e6d23212b01a123')
      .set('Authorization', 'Bearer ' + token)
      .send({ firstColumn: 'Test Category', secondColumn: 'Test 2nd' })
      .end((err, data) => {
        expect(422);
        expect(err).to.not.exist;
        expect(data.body.error).to.equal('Can not find this detail to update.');
        done();
      });
  });

  it('Lack of input data: firstColumn', done => {
    agent.put('/api/category/detail/update/' + detailId)
      .set('Authorization', 'Bearer ' + token)
      .send({ secondColumn: faker.random.word() })
      .end((err, data) => {
        expect(data.body.error).to.equal('You have to fill your detail.');
        expect(200);
        expect(err).to.not.exist;
        done();
      });
  });

  it('Lack of input data: secondColumn', done => {
    agent.put('/api/category/detail/update/' + detailId)
      .set('Authorization', 'Bearer ' + token)
      .send({ firstColumn: faker.random.word() })
      .end((err, data) => {
        expect(data.body.error).to.equal('You have to fill your detail.');
        expect(200);
        expect(err).to.not.exist;
        done();
      });
  });
});