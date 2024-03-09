const express = require('express');

const app = express();

app.get('/', (_, res) => res.status(200).json({ message: 'Hello World' }));

app.listen(3000, () => console.log('Server is running on port 3000'));

module.exports = app;