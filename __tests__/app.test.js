require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
  
      await client.connect();
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
    }, 10000);
  
    afterAll(done => {
      return client.end(done);
    });

    test('returns chessplayers', async() => {

      const expectation = [
        {
          name: 'Magnus Carlsen',
          rating: 2847,
          worldchampion: true,
          country: 'Norway', 
          id: 1
        },
        {
          name: 'Fabiano Caruana',
          rating: 2820,
          worldchampion: false,
          country: 'USA', 
          id: 2
        },
        {
          name: 'Ding Liren',
          rating: 2791,
          worldchampion: false,
          country: 'China', 
          id: 3
        },
        {
          name: 'Ian Nepomniatchi',
          rating: 2789,
          worldchampion: false,
          country: 'Russia', 
          id: 4
        },
        {
          name: 'Levon Aronian',
          rating: 2781,
          worldchampion: false,
          country: 'Armenia', 
          id: 5
        }
      ];

      const data = await fakeRequest(app)
        .get('/chessplayers')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
    test('returns chessplayers/:id', async() => {

      const expectation = [
        {
          name: 'Magnus Carlsen',
          rating: 2847,
          worldchampion: true,
          country: 'Norway', 
          id: 1
        },
        
      ];

      const data = await fakeRequest(app)
        .get('/chessplayers/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
  });
});
