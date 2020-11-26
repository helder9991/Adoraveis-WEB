const express = require('express');
const app = express();

const port = 3000;

const baseDir = `${__dirname}/build/`
app.use(express.static(`${baseDir}`))
app.get('/', (req, res) => res.sendfile('index.html' , { root : baseDir } ))

app.listen(port)
