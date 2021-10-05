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
          category: 'grandmaster',
          name: 'Magnus Carlsen',
          rating: 2847,
          worldchampion: true,
          country: 'Norway', 
          id: 1
        },
        {
          category: 'grandmaster',
          name: 'Fabiano Caruana',
          rating: 2820,
          worldchampion: false,
          country: 'USA', 
          id: 2
        },
        {
          category: 'grandmaster',
          name: 'Ding Liren',
          rating: 2791,
          worldchampion: false,
          country: 'China', 
          id: 3
        },
        {
          category: 'grandmaster',
          name: 'Ian Nepomniatchi',
          rating: 2789,
          worldchampion: false,
          country: 'Russia', 
          id: 4
        },
        {
          category: 'grandmaster',
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

      expect(data.body).toEqual(expectation.reverse());
    });
    test('returns chessplayers/:id', async() => {

      const expectation = [
        {
          'id': 1,
          'name': 'Magnus Carlsen',
          'rating': 2847,
          'worldchampion': true,
          'country': 'Norway',
          'image': 'magnus.jpeg',
          'category_id': 1,
          'category': 'grandmaster'
        }
        
      ];

      const data = await fakeRequest(app)
        .get('/chessplayers/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('create chessplayer', async() => {

      const newPlayer = 
        {
          name: 'Ludwig Hammer',
          rating: 2747,
          worldchampion: false,
          country: 'Norway', 
          id: expect.any(Number)
        };
        
      const data = await fakeRequest(app)
        .post('/chessplayers')
        .send({
          name: 'Ludwig Hammer',
          rating: 2747,
          worldchampion: false,
          country: 'Norway', 
          id: 9
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body[0]).toEqual(newPlayer);

      const allChessplayers = await fakeRequest(app)
        .get('/chessplayers')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(allChessplayers.body).toEqual(expect.arrayContaining([newPlayer]));
    });

    test('update chessplayer', async() => {

      const expectedPlayer = 
        {
          category_id: 1,
          name: 'Ding Liren',
          image: 'ding.jpeg',
          rating: 2747,
          worldchampion: false,
          country: 'Norway', 
          id: 3
        };

      const data = await fakeRequest(app)
        .put('/chessplayers/3')
        .send({
          name: 'Ding Liren',
          rating: 2747,
          worldchampion: false,
          country: 'Norway'
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectedPlayer);

      const allChessplayers = await fakeRequest(app)
        .get('/chessplayers')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(allChessplayers.body).toEqual(expect.arrayContaining([expectedPlayer]));
    });

    test('delete chessplayer', async() => {

      const expectedDeleted = 
        {
          name: 'Ian Nepomniatchi',
          rating: 2789,
          worldchampion: false,
          country: 'Russia', 
          id: 4
        };

      const data = await fakeRequest(app)
        .delete('/chessplayers/4')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectedDeleted);

      const missingEntry = await fakeRequest(app)
        .get('/chessplayers/4')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(missingEntry.body).toEqual([]);
    });

  });
});
