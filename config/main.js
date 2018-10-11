export default {
  // Secret key for JWT signing and encryption
  secret: 'just something secret hehe',
  // Database connection information
  database: 'mongodb://localhost:27017',
  // Setting port for server
  port: process.env.PORT || 3000
};
