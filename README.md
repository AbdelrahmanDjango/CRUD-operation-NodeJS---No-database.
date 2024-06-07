
# Social network with good features.



🌟 Project Description:

I developed a social networking platform using Node.js, Express, and MongoDB. The project features a robust authentication system allowing users to create accounts, log in, and obtain tokens for accessing platform features like following other users and posting content.



Users can customize the privacy settings of their accounts, choosing between public and private modes. By default, accounts are public, ensuring immediate visibility of posts and profile information. For enhanced privacy, users can switch accounts to private mode.



In private mode, users must send follow requests to access private posts. The account owner can accept or reject follow requests based on their preferences.



I implemented JWT-based authentication to ensure secure token issuance for user authentication. Additionally, I created middleware function to track user activity, allowing developers to monitor the HTTP request methods and endpoint URLs accessed by users, along with timestamps indicating when the requests were made. This provides valuable insights into user behavior and enables developers to analyze user interactions with the platform.



I have developed a very important feature: Groups, which contain advanced features. The user creates the group and then becomes its owner. The owner can control the privacy of the group: whether it is private or public. If it is public, users can join without approval. If it is private, admin or owner approval is required for users to join. Speaking of admins, the group owner can select a specific user and assign them as an admin.

Admins can manage everything in the group except for changing its privacy settings or assigning another user as an admin, which is reserved for the group owner. Admins can remove specific members, view pending join requests, and approve or reject them.

Next, I added a comments feature on posts. The interesting part is the comment privacy. Who can comment? Here, the post owner can select one of three options: comments are open to everyone, comments are open to followers only, comments are closed to everyone. By default, comments are open to everyone until the owner changes it.

I also developed a very simple middleware function: "No URL found with this name," which is more useful for developers to monitor their work effectively. Additionally, I developed another middleware function to save time fetching the user, group, and member.

Users can reset their passwords, which I implemented manually using comparison methods and Joi for data validation.

Back to the Groups feature:

The user creates the group and becomes its owner.

The owner can control the privacy of the group (private or public).

If public, users can join without approval.

If private, admin or owner approval is required for users to join.

The owner can select a user and assign them as an admin.

Admins can manage everything in the group except for changing its privacy settings or assigning another user as an admin. This is reserved for the group owner. Admins can remove specific members, view pending join requests, and approve or reject them.

A crucial feature is the status of posts within the group. Should posts be published immediately upon creation, or should they wait for admin approval? By default, after creating the group, posts are automatically accepted until the group owner changes the status to pending, which means no post will be published without admin or owner approval. This ensures a professional group environment.

Another professional feature: what happens if the group owner decides to leave? First, note that the group owner cannot be listed among the members. Therefore, a professional database design separates the group owner from the members. If the owner decides to leave, who will the group belong to? I will check the group members. If there are members, the first member to join the group will become the new owner. If there are no members, the group will be deleted to maintain a clean database and user experience free from empty groups.

Users can view their pending posts. Posts can be displayed for the entire group or for a specific user within the group. I might work on a new feature if I revisit the project: inviting users to the group (they must be followers). This is an easy-to-implement feature, but I can't promise I'll work on the project again anytime soon.





I managed the project, organized its architecture, created the database schema, and developed the endpoints. Working with a senior software engineer enabled me to understand tokens and authentication and other concepts, leading to the successful completion of the project.



Currently, the project focuses on backend development, with frontend implementation pending.

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
