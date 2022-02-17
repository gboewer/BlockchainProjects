const express = require('express')
const app = express()
const port = 3000

app.use(express.static('src'));

const staticFilePaths = ['build/contracts', 'node_modules'];

for (let i = 0; i < staticFilePaths.length; i++) {
    const filePath = staticFilePaths[i];
    app.use('/' + filePath, express.static(filePath));
}

app.listen(port);