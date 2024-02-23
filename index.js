const express = require('express');


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use('/api/posts', require('./routes/api/postsRoutes.js'));



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {console.log(`Server running on ${PORT} post.`)});