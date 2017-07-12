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
function seedBlogData(){
    console.info('seeding blog data');
    const seedData = [];

    for(let i=1; i<=10; i++) {
    	seedData.push(generateBlogData());
    }
    // console.log('This is the seedData array');
    // console.log(seedData);
    return BlogPost.insertMany(seedData);
}

//generate title
function generateTitle() {
	const title = [
		'you will not believe this stuff', 'my life', 'best day ever'];
		return title[Math.floor(Math.random() * title.length)];
}


//genereate content
function generateContent() {
	const content = [
		'blahblahblahblahblahblah', 'some random posting about stuff', 'i had such a great day'];
		return content[Math.floor(Math.random() * content.length)];
}

//generate author
function generateFirstName() {
	const firstName = [
		'Fake', 'John', 'Ted'];
		return firstName[Math.floor(Math.random() * firstName.length)];
}

function generateLastName() {
	const lastName = [
		'Name', 'Everyan', 'Flannigan'];
		return lastName[Math.floor(Math.random() * lastName.length)];
}


//generate BlogData
function generateBlogData() {
	return {
		title: generateTitle(),
		content: generateContent(),
		author: {
			firstName: generateFirstName(),
			lastName: generateLastName()
		}
	}
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
                    // console.log('Tge BloG PoSt CoUNt iS ' + BlogPost.length);
                    //return res.body;
                    return BlogPost.count();
                }).then(function(count) {
                    

                    //console.log('Body length is ' + res.body.length);
                    
                    // console.log('the count being passed in is ' + count);
                    // console.log(res.body);
                    // console.log('that was the response body');
                    //res.body.should.have.length.of(10);//this is the error, it says that it isnt a function

                });
        });
    });

        it('should return blog posts with the correct keys', function (){
            let resBlog;
            return chai.request(app)
                .get('/posts')
                .then(function(res){
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('array');

                    res.body.forEach(function(blogPost){
                        blogPost.should.be.a('object');
                        blogPost.should.include.keys(
                            'id', 'author', 'content', 'title', 'created')
                    });
                    resBlog = res.body[0];
                    return BlogPost.findById(resBlog.id)
                })
                .then(function(blog){
                    resBlog.id.should.equal(blog.id);
                    resBlog.title.should.equal(blog.title);
                    resBlog.author.should.contain(blog.author.firstName);
                    resBlog.author.should.contain(blog.author.lastName);
                    resBlog.content.should.equal(blog.content);
                })


        });

    //------POST
    describe('POST requests', function() {
        it ('should add a new blog post', function() {

            const newBlogPost = generateBlogData();

            return chai.request(app)
                .post('/posts')
                .send(newBlogPost)
                .then(function(res){
                    res.should.have.status(201);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.include.keys(
                        'id', 'author', 'content', 'title', 'created');
                    res.body.title.should.equal(newBlogPost.title);
                    res.body.id.should.not.be.null;
                    res.body.created.should.not.be.null;
                    res.body.content.should.equal(newBlogPost.content);

                    return BlogPost.findById(res.body.id);
                })
                .then(function(blog){
                    blog.title.should.equal(newBlogPost.title);
                    blog.author.firstName.should.equal(newBlogPost.author.firstName);
                    blog.author.lastName.should.equal(newBlogPost.author.lastName);
                    blog.content.should.equal(newBlogPost.content);
                })
        });
    });


    //------POST



    //------DELETE

});