const express = require('express');
const db = require('./src/config/initDatabase.js');
const logger = require('./src/middlewares/logger.js');
const catchError = require('./src/middlewares/catchError.js');
const cors = require('cors');

const app = express();
// db.sequelize (intance of db) that I create it in index.js (clean db).
// connected db by sync 
const corsOptions = {
    origin : "http://localhost:5000"
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(logger);
app.use('/api/posts', require('./src/routes/api/postsRoutes.js'));
app.use('/posts', require('./src/routes/api/postRoutes.js'))
app.use(catchError);

db.sequelize.authenticate().then(() =>{
    console.log('Connection successfully.')
}).catch((err) =>{
    console.log(err);
})
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {console.log(`Server running on ${PORT} port.`)});




