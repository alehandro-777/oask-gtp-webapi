const mongoose = require( 'mongoose' );
require('../app_api/models/db');  //init mongoose

console.log("Drop create database !!!");

const User =require('../app_api/models/user');
const Point =require('../app_api/models/db-point');
const Role =require('../app_api/models/role');
const States =require('../app_api/models/states-set');
const Profile =require('../app_api/models/user-profile');

const users = require('./users.json');
const roles = require('./roles.json');
const states = require('./di-states.json');
const profiles = require('./profile.json');
const points = require('./db-points.json');

mongoose.connection.on('connected', async () => {   

    await mongoose.connection.dropDatabase();    

    let data = await Role.insertMany(roles);
    console.log(data);

    data = await States.insertMany(states);
    console.log(data);

    data = await Profile.insertMany(profiles);
    console.log(data);

    data = await User.insertMany(users);
    console.log(data);

    data = await Point.insertMany(points);
    console.log(data);

    process.exit(0);
});

