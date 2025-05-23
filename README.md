# Chunk Mate
## Project Structure

* The frontend is built using React and styled-components.
* The backend is developed using Node.js with the Express.js framework.
* PostgreSQL is used to store document data, chunked content, and hyperlink references.

## Steps to Set Up and Run the Project

### Step 1: Set Up and Run the Frontend

1. Navigate to the frontend directory using your terminal.
2. Install all required dependencies using a package manager like npm or yarn.
3. Start the development server.
4. The React app will typically run on localhost at port 5173 or 3000 depending on your setup.
5. Ensure that the backend server is also running to handle file uploads and data fetching.

### Step 2: Start the Backend Server

1. Go to the backend directory from your terminal.
2. Install backend dependencies using a package manager.
3. Ensure the environment variables such as the database connection URL or credentials are properly configured in an environment file.
4. Start the backend server using a Node.js process manager or command line.
5. The backend server will listen on a specific port (typically 5000) and expose endpoints for file upload and database interaction.

### Step 3: Initialize and Connect to the PostgreSQL Database

1. Install PostgreSQL on your machine if it is not already installed.
2. Open a PostgreSQL client such as psql or pgAdmin.
3. Create a new database for the project.
4. Use the SQL schema file or provided table creation statements to define the structure of tables such as documents, chunks, and hyperlinks.
5. Ensure that the backend is connected to the database by correctly configuring the database connection string or settings in the backend application.
6. Verify that the tables are created successfully and test inserting or retrieving data through the backend.

