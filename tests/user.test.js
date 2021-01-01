const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOneId, userOne, setupDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)

afterEach(() => {
})

test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Andy',
        email: 'andy@email.com',
        password: 'abcabcabc'
    }).expect(201)

    // asset that the db was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // asset about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Andy',
            email: 'andy@email.com'
        },
        token: user.tokens[0].token
    })

    // assert password is not saved in plain text
    expect(user.password).not.toBe('abcabcabc')
})

test('Should login exisiting user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()
    expect(response.body.token).toBe(userOne.tokens[0].token)

})

test('Should not login non-existing user', async () => {
    await request(app).post('/users/login').send({
        email: 'some@example.com',
        password: 'asdfadfsdf'
    }).expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthorized user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOne._id)
    expect(user).toBeNull()
})

test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid field', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: "bbb"
        }).expect(200)

        const user = await User.findById(userOneId)
        expect(user.name).toBe("bbb") 
})

test('Should not update invalid field', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            hair: "bbb"
        }).expect(400)
})