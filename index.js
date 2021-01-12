const express = require('express');
const app = express();

app.use(() => {
    console.log('Server port 4000 Starting...');
})

app.listen(4000)