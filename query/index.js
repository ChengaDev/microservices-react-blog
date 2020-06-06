const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
    if (type === 'POST_CREATED') {
        const { id, title } = data;

        posts[id] = { id, title, comments: [] };
    }

    if (type === 'COMMENT_CREATED') {
        const { id, content, postId, status } = data;

        const post = posts[postId];
        if (post) {
            post.comments.push({ id, content, status });
        } else {
            res.status(404);
        }
    }

    if (type === 'COMMENT_UPDATED') {
        const { id, content, postId, status } = data;

        const post = posts[postId];
        const comment = post.comments.find((comment) => {
            return comment.id === id;
        });
        console.log(comment);

        comment.status = status;
        comment.content = content;
    }
};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    const { type, data } = req.body;

    handleEvent(type, data);

    res.send({});
});

app.listen(4002, async () => {
    console.log('Query service is listening on port 4002');

    const missedEvents = await axios.get('http://event-broker-srv:4005/events');
    for (let event of missedEvents.data) {
        handleEvent(event.type, event.data);
    }
});
