require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const allRoutes = require('./routes');

const app = express();
app.use(express.json());

var corsOptions = {
    origin: [process.env.CLIENT_ADDRESS],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'] // Include Content-Type
};

app.use(cors(corsOptions));

const port = process.env.PORT || 8080;

mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('MongoDB connected ...');
        app.listen(port, () => {
            console.log(`Running on port ${port} ...`);
        })
    })
    .catch(err => {
        console.log(err);
    });

// Other end-points
app.use('/api/v1/cement-swift/', allRoutes);