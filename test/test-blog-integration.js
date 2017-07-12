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

const jsonSeedData = 
[{"title": "11 things -- you won't believe #4", "author": {"firstName": "Billy", "lastName": "Smith"}, "content": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
{"title": "12 things -- you won't believe #4", "author": {"firstName": "Sally", "lastName": "Smith"}, "content": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
{"title": "13 things -- you won't believe #4", "author": {"firstName": "Sally", "lastName": "Smith"}, "content": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
{"title": "14 things -- you won't believe #4", "author": {"firstName": "Sally", "lastName": "Smith"}, "content": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
{"title": "15 things -- you won't believe #4", "author": {"firstName": "Wilson", "lastName": "Wilters"}, "content": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
{"title": "16 things -- you won't believe #4", "author": {"firstName": "Wilson", "lastName": "Wilters"}, "content": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
{"title": "17 things -- you won't believe #4", "author": {"firstName": "Wilson", "lastName": "Wilters"}, "content": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
{"title": "18 things -- you won't believe #4", "author": {"firstName": "Wilson", "lastName": "Wilters"}, "content": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
{"title": "19 things -- you won't believe #4", "author": {"firstName": "Tabernacle", "lastName": "Jeff"}, "content": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
{"title": "20 things -- you won't believe #4", "author": {"firstName": "Tabernacle", "lastName": "Jeff"}, "content": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}
];

//-----------seeding functions
//seed blog data function
//function for generating each key
function seedBlogData(){
    return BlogPost.insertMany(jsonSeedData);
}


//tear up DB

function tearDownDb(){
    console.warn('Deleting Database!!!!!');
    return mongoose.connection.dropDatabase();
}

//----------------------set up test operations
//Wrap everything to the end
describe('Our blog app tests', function() {

    //before
    before(function(){
        return runServer(TEST_DATABASE_URL);
    });

    //before each request
    beforeEach(function() {
        return seedBlogData();
    });

    //after each request
    afterEach(function(){
        return tearDownDb();
    })

    //after last request
    after(function(){
        return closeServer();
    })


    //------GET
    describe('Our blog GET request', function() {
        it('it should return all blog posts', function() {
            let res;
            return chai.request(app)
                .get('/posts')
                .then(function(wackadoodle){
                    res = wackadoodle;
                    res.should.have.status(200);
                    // console.log('This is the res.body' + res.body);
                    res.body.should.have.length.of.at.least(1);
                    return res.body;
                    // return BlogPost.count();
                }).then(function(data){
                    console.log(jsonSeedData.length);
                    data.should.have.length.of.at.least(jsonSeedData.length);
                })
                // .then(function(count) {
                //     res.body.posts.should.have.length.of(count);
                // })
        })
    })

    //------POST



    //------POST



    //------DELETE

});