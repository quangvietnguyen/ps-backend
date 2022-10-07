const express = require('express');
require('./db/mongoose');
// const cors = require('cors');
const commentRouter = require('./routers/comment');
const validator = require('./middlewares/validator');

const app = express();
const port = process.env.PORT;

// app.use(cors());
app.use(express.json());
app.use(validator);
app.use(commentRouter);

app.listen(port, () => {
  console.log('Server is up on port ' + port);
});
