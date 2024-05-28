
# Social network with good features.



🌟 Project Description:

I developed a social networking platform using Node.js, Express, and MongoDB. The project features a robust authentication system allowing users to create accounts, log in, and obtain tokens for accessing platform features like following other users and posting content.

Users can customize the privacy settings of their accounts, choosing between public and private modes. By default, accounts are public, ensuring immediate visibility of posts and profile information. For enhanced privacy, users can switch accounts to private mode.

In private mode, users must send follow requests to access private posts. The account owner can accept or reject follow requests based on their preferences.

I implemented JWT-based authentication to ensure secure token issuance for user authentication. Additionally, I created middleware functions to track user activity, allowing developers to monitor the HTTP request methods and endpoint URLs accessed by users, along with timestamps indicating when the requests were made. This provides valuable insights into user behavior and enables developers to analyze user interactions with the platform.

Also I developed a new feature in my project, which is comments status.
User can control who can comment on his post? Opened for all? or opened for only followers? or closed for all? 
And this also effecting if user privacy was private or public? 
Everything is connected to each other.

One challenge was implementing private accounts and managing post privacy settings. I devised a system to automatically adjust post privacy when account settings change and filter data for pending follow requests.

I oversaw the project, structured its architecture, designed the database schema, and implemented the endpoints. Collaboration with an engineer helped me grasp tokens and authentication, facilitating project completion.

Currently, the project focuses on backend development, with frontend implementation pending. For future enhancements, I aim to introduce a chat feature for user interaction.

### Getting started
To start using the project, you must follow these steps:
1) Create a register using name, email, password.
2) Login with the same data to take the token, and from here we can use the rest of the features.

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
http://localhost:5000/api-docs/
