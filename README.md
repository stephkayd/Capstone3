# Stephanie Dunham - MERN Customer Management Application

## Overview

**Commit and Quit** is a simple MERN stack (MongoDB, Express, React, Node.js) application that manages customer data. The backend API provides secure endpoints to create, read, update, and delete (CRUD) customer documents stored in a MongoDB database. The frontend serves a home page describing available API endpoints.

This project demonstrates RESTful API design, MongoDB data access using the official Node.js driver, and secure API routes with middleware.

---

## Features

- Serve static frontend files from the `public` directory
- RESTful API endpoints for customers:
  - `GET /customers` - Get all customers (protected)
  - `GET /customers/:id` - Get a customer by ID (protected)
  - `POST /customers` - Add a new customer (protected)
  - `PUT /customers/:id` - Update an existing customer (protected)
  - `DELETE /customers/:id` - Delete a customer (protected)
- API key middleware to protect endpoints
- MongoDB data access with async/await
- Reset endpoint to restore default customer data: `GET /reset`
- Proper HTTP status codes for success and error handling

---

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB running locally or access to a MongoDB Atlas cluster
- npm (comes with Node.js)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/commit-and-quit.git
   cd commit-and-quit
