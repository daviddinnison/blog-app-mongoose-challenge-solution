//declaring frameworks mongoose, faker, body-parser, express, chai, chai-http, mocha
//not using express
const mongoose = require('mongoose');
const faker = require('faker');
const bodyParser = require('body-parser');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mocha = require('mocha');

//set up promises for mogoose
mongoose.Promise = global.Promise;


//set up chai methods
const should = chai.should();

const {BlogPost} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);


//-----------seeding functions
//seed blog data function
//function for generating each key



//tear up DB

//----------------------set up test operations
//Wrap everything to the end
//before
//beforeEach
//afterEach
//after


//------GET


//------POST



//------POST



//------DELETE
