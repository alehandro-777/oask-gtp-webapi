const mongoose = require( 'mongoose' );
const config = require('config');

const dbURI = config.get('dbConfig.connString');

const connParams = {useNewUrlParser: true,useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true };

mongoose.connect(dbURI, connParams);

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error',function (err) {
    console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

function gracefulShutdown(msg, callback) {
    mongoose.connection.close(function () {
    console.log('Mongoose disconnected through ' + msg);
    callback();
});
};

// For nodemon restarts
process.once('SIGUSR2', function () {
    gracefulShutdown('nodemon restart', function () {
    process.kill(process.pid, 'SIGUSR2');
});
});
// For app termination
process.on('SIGINT', function() {
    gracefulShutdown('app termination', function () {
    process.exit(0);
});
});

// For Heroku app termination
process.on('SIGTERM', function() {
    gracefulShutdown('Heroku app shutdown', function () {
    process.exit(0);
});
});