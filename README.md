Change Hands - An Item Exchange Platform

Project Vision:

The target audience for this project are for local people in Jersey, that require a platform where they are able to list and find second hand items within the island. The current problem is that there is not a suitable platform that exists, where people are easily able to sell their items and find second hand items online, which highlights the need for this project. The project ‘Change Hands’, is a web application platform, that provides users in Jersey with the ability to interact with each other and sell or buy items online, without needing to pay for postage or use external websites. The key reasons for this projects initiation, is because there is a scarcity of efficient and suitable online second hand web platforms available in Jersey, that are able to provide a secure way in which users can communicate, negotiate and exchange items effectively.

User Guide:

Requirements:
1.	Download and install Node.JS (https://nodejs.org/en/download/)

2.	Download and install MongoDB server (https://docs.mongodb.com/manual/administration/install-community/)

3.	Download the project from GitHub and extract it.

4.	Open a command prompt/terminal and navigate to the project folder location. Type ‘cd backend’ and once in the backend folder, type ‘npm install’ (this will install all the packages necessary to run the application)

5.	Type in ‘npm install -g nodemon’ and type ‘nodemon’ in the backend folder once installed. (this will start the backend server) Alternatively run ‘npm start’.

6.	Once the backend server is running, open another command promt/terminal, cd into the frontend folder and type ‘npm install’.

7.	Run the frontend by typing ‘npm start’ in the command promt/terminal while in the react-frontend folder.

8.	Navigate to (http://localhost:3000/register) and create a new user account to begin using the application.

9. Accessing the admin panel. The database should be connected to the atlas mongoDB server. If it is, you will be able to login with the admin credentials found below in 10.

10. Alternatively if the database is connected to "mongodb://localhost/changehands", the admin panel will require an account to be created) For this download Postman (https://www.postman.com/downloads/) or any other API application and POST the credentials to http://localhost:5000/api/v1/admin/auth/registerAdmin

Credentials:
{
   "email": "admin@admin.com",
   "password": "Password123"
}
This API link would normally be disabled to prevent users from creating admin accounts, but for the purpose of testing, the route has been enabled.
