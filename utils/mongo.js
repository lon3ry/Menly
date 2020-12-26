const mongoose = require('mongoose');
const { mongoPath } = require('../config.json');

module.exports = async () => {
  await mongoose.connect(mongoPath, {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
  })
  console.log('Connected to mongo database');
  return mongoose;
}