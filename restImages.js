const port = process.env.PORT || 3000;

const express = require('express');
const app = express();
const helmet = require('helmet');

app.use(helmet());

app.use(express.static('public'));

app.listen(port, function () {
  console.log(`Started on port ${port}`);
});
