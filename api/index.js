const express = require('express');
require('../src/db/mongoose');
const cors = require('cors');
const commentRouter = require('../src/routers/comment');
const validator = require('../src/middlewares/validator');
// const cors = require('./middlewares/cors');

const app = express();
const port = process.env.PORT;

app.use(cors());
// app.use(cors);
app.use(express.json());
app.use(validator);
app.use(commentRouter);

app.listen(port, () => {
  console.log('Server is up on port ' + port);
});
