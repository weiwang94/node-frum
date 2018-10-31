const express = require('express')

const User = require('../models/user')

const { log } = require('../utils')

const { currentUser } = require('./main')

const index = express.Router()

index.get('/', (request, response) => {
    const userList = User.all()
    const u = currentUser(request)
    const args = {
        users: userList,
        user: u,
    }
    console.log('debug u and args', u, args)
    response.render('index/index.html', args)
})

module.exports = index
