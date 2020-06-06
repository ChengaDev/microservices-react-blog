const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { randomBytes } = require('crypto');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/posts', (req, res) => {
    res.status(200).send(posts);
});

app.post('/posts', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const title = req.body.title;

    posts[id] = {
        id,
        title
    };
    console.log('sending request to http://event-broker-srv:4005/events');
    await axios.post('http://event-broker-srv:4005/events', {
        type: 'POST_CREATED',
        data: {
            id,
            title
        }
    });

    res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
    console.log('received event', req.body.type);
});

let posts = {};

app.listen(4000, () => {
    console.log('Hi there!');
    console.log('Posts service listening on port 4000');
});
