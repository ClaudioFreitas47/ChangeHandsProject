//requires mocha and chai for testing
const server = require('../server');
const request = require('supertest')(server);
const chai = require('chai'), chaiHttp = require('chai-http');
var expect = chai.expect;
chai.use(chaiHttp);

//API route

const API = "http://localhost:5000/api/v1"

//user auth token
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNmRjZDE4ZDI4NTBhMDYzNWVlNjJlMyIsImlhdCI6MTYxNzgxMTIzOCwiZXhwIjoxNjIwNDAzMjM4fQ.R21u4tLVdD6m2JOcdsP8F2g8DtbGXsKqAkk1v1wqWAg"

//admin auth token
const adminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNmRhYjJlMzFjYTU1NDgyZjQ3N2U4NyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTYxNzgwNzMxNCwiZXhwIjoxNjIwMzk5MzE0fQ.ioYAahdX2M53FsopxAXxalR31U_bH1KNxSxlgHD95n8"


// functions for tests
let register_test = {
    'firstName': 'user',
    'lastName': 'name',
    'username': 'username',
    'email': 'user@gmail.com',
    'password': 'Password123'
}

let registered_test = {
    'firstName': 'Test',
    'lastName': 'Test',
    'username': 'Test01',
    'email': 'Test01@gmail.com',
    'password': 'Password123'
};

let register_password_test = {
    'firstName': 'Pass',
    'lastName': 'Test',
    'username': 'Passtest',
    'email': 'Passtest@gmail.com',
    'password': '1'
};

let register_email_test = {
    'firstName': 'Email',
    'lastName': 'Test',
    'username': 'Emailtest',
    'email': 'Emailtest',
    'password': 'Password123'
};

let login_valid_test = {
    'username': 'Test01',
    'password': '12345678'
};

let login_invalid_test = {
    'username': '1111',
    'password': '1111'
};

let register_admin_test = {
    'email': 'admin1@gmail.com',
    'password': 'Password123'

}

let register_admin_password_test = {
    'email': 'Adminpasstest@gmail.com',
    'password': '1'
};

let register_admin_email_test = {

    'email': 'Emailtest',
    'password': 'Password123'
};

let login_admin_valid_test = {
    'email': 'admin@admin.com',
    'password': '12345678'
};

let login_admin_invalid_test = {
    'email': 'admin',
    'password': '1'
};


;

//API test results are expected to contain success of failure results
describe('/POST Register', () => {
    it('it should register the user', (done) => {
        chai.request(API)
            .post('/auth/register')
            .send(register_test)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.a.status(200);
                expect(res.body).to.contain.property('success', true)
                expect(res.body).to.contain.property('token')
                done();

            })
    })


    it('it should display an error if a user is already registered', (done) => {
        chai.request(API)
            .post('/auth/register')
            .send(registered_test)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.a.status(400);
                expect(res.body).to.contain.property('success', false)
                expect(res.body).to.contain.property('error', 'Syntax Error/Duplicate Index')
                done();

            })
    })

    it('it should display an error if password doesnt meet complexity', (done) => {
        chai.request(API)
            .post('/auth/register')
            .send(register_password_test)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.a.status(400);
                expect(res.body).to.contain.property('success', false)
                expect(res.body).to.contain.property('error', 'Password must contain the following:\n' +
                    '        Uppercase and lowercase characters, \n' +
                    '        Any digit character (0-9)\n' +
                    '        Atleast 8 characters in length.')
                done();

            })
    })


    it('it should display an error if the email doesnt meet the requirements', (done) => {
        chai.request(API)
            .post('/auth/register')
            .send(register_email_test)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.a.status(400);
                expect(res.body).to.contain.property('success', false)
                expect(res.body).to.contain.property('error', "Email must contain '@' and a valid domain")
                done();

            })
    })
})

describe('/POST Login', () => {
    it('it should login a registered user', (done) => {
        chai.request(API)
            .post('/auth/login')
            .send(login_valid_test)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.a.status(200);
                expect(res.body).to.contain.property('success', true)
                expect(res.body).to.contain.property('token')
                done();

            })
    })

    it('it should not allow an unregistered user to login', (done) => {
        chai.request(API)
            .post('/user/login')
            .send(login_invalid_test)
            .end((err, res) => {
                expect(res).to.have.a.status(404);
                expect(err).to.be.null;
                done();

            })
    })

})

describe('/POST Admin Register', () => {
    it('it should register the admin account', (done) => {
        chai.request(API)
            .post('/admin/auth/registerAdmin')
            .send(register_admin_test)
            .end((err, res) => {

                expect(err).to.be.null;
                expect(res).to.have.a.status(200);
                expect(res.body).to.contain.property('success', true)
                expect(res.body).to.contain.property('token')
                done();

            })
    })

    it('it should display an error if password doesnt meet complexity', (done) => {
        chai.request(API)
            .post('/admin/auth/registerAdmin')
            .send(register_admin_password_test)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.a.status(400);
                expect(res.body).to.contain.property('success', false)
                expect(res.body).to.contain.property('error', 'Password must contain the following:\n' +
                    '      Uppercase and lowercase characters, \n' +
                    '      Any digit character (0-9)\n' +
                    '      Atleast 8 characters in length.')
                done();

            })
    })


    it('it should display an error if the email doesnt meet the requirements', (done) => {
        chai.request(API)
            .post('/admin/auth/registerAdmin')
            .send(register_admin_email_test)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.a.status(400);
                expect(res.body).to.contain.property('success', false)
                expect(res.body).to.contain.property('error', "Email must contain '@' and a valid domain")
                done();

            })
    })

})

describe('/POST Admin Login', () => {
    it('it should login an admin account', (done) => {
        chai.request(API)
            .post('/admin/auth/login')
            .send(login_admin_valid_test)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.a.status(200);
                expect(res.body).to.contain.property('success', true)
                expect(res.body).to.contain.property('token')
                done();

            })
    })

    it('it should not allow an unregistered admin to login', (done) => {
        chai.request(API)
            .post('admin/auth/login')
            .send(login_admin_invalid_test)
            .end((err, res) => {
                expect(res).to.have.a.status(404);
                expect(err).to.be.null;
                done();

            })
    })
})
describe('/Get All Products', () => {
    it('it should get all the products if the user is authenticated', (done) => {
        chai.request(API)
            .get('/products/getAllProducts')
            .set({
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.a.status(200);
                expect(res.body).to.contain.property('data')

                done();

            })
    })
})
describe('/Get Admin Brands', () => {
    it('it should get all the brands if the admin is authenticated', (done) => {
        chai.request(API)
            .get('/admin/brands/getAllBrands')
            .set({
                'Authorization': `Bearer ${adminToken}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.a.status(200);
                expect(res.body).to.contain.property('data')

                done();

            })
    })
    it('it should error trying to get the brands if the admin is not authenticated', (done) => {
        chai.request(API)
            .get('/admin/brands/getAllBrands')
            .set({
                'Authorization': `Bearer `,
                'Content-Type': 'application/x-www-form-urlencoded'
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.body).to.contain.property('success', false)
                expect(res.body).to.contain.property('error', "Authentiation Required to Access This Route!")
                done();

            })
    })
})

describe('/Get Admin Categories', () => {
    it('it should get all the categories if the admin is authenticated', (done) => {
        chai.request(API)
            .get('/admin/categories/getAllCategories')
            .set({
                'Authorization': `Bearer ${adminToken}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.a.status(200);
                expect(res.body).to.contain.property('data')

                done();

            })
    })
    it('it should error trying to get the categories if the admin is not authenticated', (done) => {
        chai.request(API)
            .get('/admin/categories/getAllCategories')
            .set({
                'Authorization': `Bearer `,
                'Content-Type': 'application/x-www-form-urlencoded'
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.body).to.contain.property('success', false)
                expect(res.body).to.contain.property('error', "Authentiation Required to Access This Route!")
                done();

            })
    })
})

