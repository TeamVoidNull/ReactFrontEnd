const express = require('express');
const app = express();

app.use('/', express.static('chatbot-frontend/build'));

app.listen(8080);