# Neighbourly — Community Asset Sharing Platform

Neighbourly is a full-stack, decoupled web application designed to connect local communities by allowing users to share, list, and reserve physical assets like tools, appliances, or equipment. The system is split into an independent, performance-optimized React Frontend and a robust Flask RESTful API backed by a PostgreSQL Database.

---

## Key Features

* Secure User Authentication: Implements JWT (JSON Web Tokens) to securely handle session authorization without forcing constant re-logins.
* Cryptographic Protection: Passwords are fully hashed and salted using bcrypt before hitting the database.
* Automated Token Handling: Axios request interceptors automatically inject JWT authorization headers into API calls, paired with response interceptors to handle session expiration cleanly.
* Database Object Mapping: Uses an Object-Relational Mapper (ORM) to handle structured relationships between platform users and community listings.
* Cross-Origin Resource Sharing (CORS): Safely handles browser-level permissions between different host environments.

---

## Tech Stack & Architecture

### Frontend (The Viewer)
* Framework: React (Vite-powered)
* Styling: Tailwind CSS
* Icons: Lucide React
* HTTP Client: Axios

### Backend (The Gatekeeper & Logic Engine)
* Framework: Flask (Python RESTful API)
* ORM: Flask-SQLAlchemy (PostgreSQL abstraction layer)
* Migrations: Flask-Migrate
* Authentication: Flask-JWT-Extended
* Data Serialization: Flask-Marshmallow
* Production Server: Gunicorn

---

## Local Installation & Setup

To run this project on your local machine, complete the following environment setups in separate terminal windows.

### 1. Backend Setup
1. Clone the repository and navigate to the backend directory.
2. Create and activate a Python virtual environment.
3. Install the backend dependencies using pip.
4. Start your Flask development server.

### 2. Frontend Setup
1. Open a new terminal window and navigate to your frontend project directory.
2. Install the necessary Node packages using npm.
3. Configure your API base route inside your local Axios config file to point to localhost.
4. Boot up your local React development server.

---

## Core Code Mechanics Explained

### The Automated Authentication Interceptor
Instead of manually fetching security tokens before making database inquiries, an Axios Interceptor catches every outgoing payload and staples the verification passport onto it.

### Self-Provisioning Database Tables
To safeguard free-tier hosting configurations where standalone terminal engines are inaccessible, the application self-scans your cloud infrastructure upon booting up, provisioning missing relational schemas dynamically.

### Secured Database Sign-Ups
When a registration script triggers, credentials go through zero-exposure hashing using cryptographic mathematical constraints before records are committed to storage.