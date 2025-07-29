const express = require('express');
const app = express()
const port = 8002;
const cors = require('cors');
const biginRoutes = require('./routes/biginRoutes');
const logger = require('./logger')


app.use(cors({
    origin: ["https://factacy.ai", "http://localhost:3000","https://www.factacy.ai/"],
    methods: ["GET", "POST", "PUT", "DELETE"],
   // credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/bigin', biginRoutes)


app.get(`/api`, (req, res) => {
    res.send(`3000 ok`)
})

app.listen(port, () => {
    logger.info(`Server is running on port: ${port}`);
})
