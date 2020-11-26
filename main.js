require('dotenv/config');
const express = require('express');

const app = express();

const baseDir = `${__dirname}/build/`;
app.use(express.static(`${baseDir}`));
app.get('/', (req, res) => res.sendfile('index.html', { root: baseDir }));

app.listen(process.env.REACT_PORT);
