const express = require('express');
const db = require('./src/config/initDatabase.js');
const logger = require('./src/middlewares/logger.js');
const catchError = require('./src/middlewares/catchError.js');
const cors = require('cors');

const app = express();
const corsOptions = {
    origin : "http://localhost:5000"
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(logger);

// Posts routes
app.use('/posts', require('./src/routes/posts/create.js'));
app.use('/posts', require('./src/routes/posts/get.js'));
app.use('/posts', require('./src/routes/posts/update.js'));
app.use('/posts', require('./src/routes/posts/delete.js'));

// User posts route.
app.use('/users/posts', require('./src/routes/posts/userPostsRoutes.js'));

// Auth routes.
app.use('/users/', require('./src/routes/auth/register.js'));
app.use('/users/', require('./src/routes/auth/login.js'));
app.use('/users/', require('./src/routes/auth/get.js'));
app.use('/users/', require('./src/routes/auth/update.js'));
app.use('/users/', require('./src/routes/auth/delete.js'));
app.use('/users/', require('./src/routes/settings/resetPassword.js'));
app.use('/users', require('./src/routes/settings/editPrivacy.js'))

// Following && followers routes.
app.use('/users/', require('./src/routes/followers/userFollow.js'));
app.use('/users/', require('./src/routes/followers/getFollowing.js'));
app.use('/users/', require('./src/routes/followers/userUnfollow.js'));
app.use('/users/', require('./src/routes/followers/getFollowers.js'));


app.use(catchError);
db.sequelize.authenticate().then(() =>{
    console.log('Connection successfully.')
}).catch((err) =>{
    console.log(err);
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {console.log(`Server running on ${PORT} port.`)});





