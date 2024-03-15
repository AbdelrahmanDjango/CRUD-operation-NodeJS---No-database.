
# Social network with good features.
This is a social network project, using JavaScript (Express JS), MongoDB database, and using Auth JWT.

What is the challenge for me in this project -the Junior Challenge-:

The account privacy feature leads to changing the entire structure of the project, as if the account is private, its posts will be private, and vice versa.

This also affects the follower system. If you try to access a private account or its posts, you will have to follow it first.

### Getting started
To start using the project, you must follow these steps:
1) Create a register using name, email, password, role, and bio. They will be overridden with default values until the user changes them.

2) Create a login with the same data to take the token, and from here we can use the rest of the features.

### Prerequisites
What things you need to install the software and how to install them:
1) install Express
2) install jsonwebtoken
3) install Joi 
4) install mongoose 
5) install uuid
6) install bcrybt
7) install dotenv
8) install cors





# API Reference

NodeJS API Social Network project.
 1.0.0 
OAS 3.0
default


POST
/posts/create
Create a new post



DELETE
/posts/delete/{id}
Delete a post



GET
/posts
Retrieve public posts



GET
/posts/followings
Retrieve posts from followed users



PUT
/posts/update/{id}
Update a post



GET
/posts/{id}
Retrieve user's posts



DELETE
/users/delete
Delete user



GET
/users
Retrieve all users


GET
/users/{id}
Retrieve a user by ID


POST
/users/login
User login


POST
/users/register
User registration


PUT
/users/update
Update user information



GET
/users/{id}/following
Get users followed by a specific user


POST
/users/follow/{id}
Follow a user



DELETE
/users/unfollow/{id}
Unfollow a user



PUT
/users/privacy
Update user privacy settings



PUT
/users/resetpassword
Reset user password