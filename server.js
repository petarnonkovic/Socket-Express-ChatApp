#!/usr/bin/env node
/**
 *  Import dependencies
 */
import express from 'express'
import http from 'http'
import fs from 'fs'
import path from 'path'
import logger from 'morgan'
import exphbs from 'express-handlebars'
import session from 'express-session'


// require .env
require('dotenv').config()

// express instance app
const app = express()
// set port
app.set('port', process.env.PORT || 3001)
// set http.Server and attach to Socket.io
const server = http.createServer(app)
const io = require('socket.io').listen(server)

// set view engine
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: '.hbs',
    cache: false,
    helpers: {
        section: function(name, options) {
            if (!this._section) this._section = {};
            this._section[name] = options.fn(this);
            return null;
        },
        static: function (path) {
            const baseUrl = "/static/";
            return baseUrl + path;
        }
    }
});

app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')

// set cors
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS,PATCH")
    res.header("Access-Control-Allow-Headers", "Content-Type,Accept,X-Access-Token,X-Key")
    if (req.method == 'OPTIONS') {
        res.status(200).end()
    } else {
        next()
    }
})

/**
 *  / App config
 */
app.disable('X-Powered-By')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/static', express.static(path.join(__dirname, 'public/'), {index: false, dotfiles: 'deny'}))

// routes
app.get('/', function (req, res) {
  res.render('index', { title: "Socket.io Chat | Home"})
});

io.on('connection', function(socket) {

    // log msg when new client is connected
    console.log('Client connected!')

    // set initial username
    socket.username = 'Guest'

    // listen username change event
    socket.on('change_username', function(data) {
        let client_data = JSON.parse(data)
        // save new username
        socket.username = client_data.username
        console.log(`Username changed for Socket: ${socket.id}`)
    })

    // listen for new message event
    socket.on('get_message', function(data) {
        let client_data = data;
        // add username and send all back
        socket.broadcast.emit('new_message', client_data)
    })

    // listen for typing event
    socket.on('user_typing', function(data) {
        let client_data = data;
        socket.broadcast.emit('user_typing', client_data)
    })

    // listen for disconnect event
    socket.on('disconnect', function() {
        console.log('Client with ID:  ' + socket.id + ', disconnect')
    })
});

// start server
server.listen(app.get('port'), function(err) {
    if (err) console.log('Error booting server')
    console.log('Running server >> localhost:' + app.get('port'))
})
