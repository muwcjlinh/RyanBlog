// import express from 'express';

export default (app) => {
  app.get('/', (req, res) => {
    res.send('Welcome to the 1st edition of Ryan\'s blog.')
  })
};
