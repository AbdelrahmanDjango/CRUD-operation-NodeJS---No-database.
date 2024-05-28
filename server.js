const express = require('express');
// const db = require('./src/config/initDatabase.js');
const logger = require('./src/middlewares/logger.js');
const catchError = require('./src/middlewares/catchError.js');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition :{
    openapi : "3.0.0",
    info : {
      version : "1.0.0",
      title : "NodeJS API Social Network project.",
    },
  }, 
  
  apis : ['./src/routes/posts/*.js', 
  './src/routes/auth/*.js',
  './src/routes/followers/*.js',
  './src/routes/settings/*.js',
]
}


const app = express();
const corsOptions = {
  origin : "http://localhost:5000"
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(logger);

// Posts routes
app.use('/posts', require('./src/routes/posts/create.js'));
app.use('/posts', require('./src/routes/posts/get.js'));
app.use('/posts', require('./src/routes/posts/update.js'));
app.use('/posts', require('./src/routes/posts/delete.js'));
app.use('/posts', require('./src/routes/posts/commentsStatus.js'));
app.use('/posts/followings/', require('./src/routes/posts/postsFollowings.js'));

// Comments routes
app.use('/', require('./src/routes/comments/create.js'));

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
app.use('/users/', require('./src/routes/followers/followResponse.js'))

app.use(catchError);


const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {console.log(`Server running on ${PORT} port.`)});;
}).catch((err) => {
    console.log(err);
});



// db.sequelize.authenticate().then(() =>{
//     console.log('Connection successfully.')
// }).catch((err) =>{
//     console.log(err);
// });






