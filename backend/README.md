# FastAPI Backend Documentation

This is the backend part of the React Vite FastAPI project. The backend is built using FastAPI, a modern web framework for building APIs with Python 3.7+ based on standard Python type hints.

## Project Structure

The backend is organized into several directories:

- **app**: Contains the main application code.
  - **api**: Holds the API routes and endpoints.
  - **core**: Contains configuration settings for the application.
  - **models**: Defines the data models used in the application.
  - **schemas**: Contains Pydantic schemas for data validation and serialization.
  - **deps.py**: Includes dependency injection functions for authentication and database sessions.

## Getting Started

To run the FastAPI backend, follow these steps:

1. **Install Dependencies**: Make sure to install the required dependencies listed in `requirements.txt` by running:
   ```
   pip install -r requirements.txt
   ```

2. **Run the Application**: You can start the FastAPI application using:
   ```
   uvicorn app.main:app --reload
   ```
   This will start the server in development mode, allowing for hot reloading.

## API Endpoints

The backend provides several API endpoints for user authentication and CRUD operations. Refer to the `routes.py` file for detailed information on the available endpoints.

## Configuration

Configuration settings such as database connection details and JWT secret can be found in `core/config.py`. Make sure to update these settings according to your environment.

## Contributing

If you would like to contribute to the backend, please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.