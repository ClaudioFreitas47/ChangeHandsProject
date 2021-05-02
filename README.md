Requirements:
1.	Download and install Node.JS (https://nodejs.org/en/download/)

2.	Download and install MongoDB server (https://docs.mongodb.com/manual/administration/install-community/)

3.	Download the project from GitHub and extract it.

4.	Open a command prompt/terminal and navigate to the project folder location. Type ‘cd backend’ and once in the backend folder, type ‘npm install’ (this will install all the packages necessary to run the application)

5.	Type in ‘npm install -g nodemon’ and type ‘nodemon’ in the backend folder once installed. (this will start the backend server) Alternatively run ‘npm start’.

6.	Once the backend server is running, open another command promt/terminal, cd into the frontend folder and type ‘npm install’.

7.	Run the frontend by typing ‘npm start’ in the command promt/terminal while in the react-frontend folder.

8.	Navigate to (http://localhost:3000/register) and create a new user account to begin using the application.

9.	To use the admin panel an account will need to be created. For this download Postman (https://www.postman.com/downloads/) or any other API application and POST the credentials to http://localhost:5000/api/v1/admin/auth/login

Credentials:
{
   "email": "admin@admin.com",
   "password": "Password123"
}
This API link would normally be disabled to prevent users from creating admin accounts, but for the purpose of testing, the route has been enabled.
