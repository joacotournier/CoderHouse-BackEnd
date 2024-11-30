# Coderhouse Backend - Final Project

A modern e-commerce backend built with Node.js, Express, MongoDB, and Socket.IO, featuring real-time updates and a sleek UI.

## Features

- **Product Management**

  - Pagination
  - Filtering by category and availability
  - Sorting by price (ascending/descending)
  - Real-time updates using Socket.IO

- **Cart Management**

  - Add/remove products
  - Update quantities
  - Clear cart
  - MongoDB references for efficient data storage

- **Modern UI**
  - Responsive design
  - Clean and intuitive interface
  - Real-time updates
  - Progressive disclosure

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository:

   ```bash
   git clone [repository-url]
   cd [repository-name]
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:

   ```
   PORT=8080
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Products

- `GET /api/products`

  - Query Parameters:
    - `limit`: Number of items per page (default: 10)
    - `page`: Page number (default: 1)
    - `sort`: Sort by price ('asc' or 'desc')
    - `query`: Search by category or availability

- `GET /api/products/:pid` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:pid` - Update product
- `DELETE /api/products/:pid` - Delete product

### Cart

- `GET /api/carts/:cid` - Get cart by ID
- `POST /api/carts` - Create new cart
- `PUT /api/carts/:cid` - Update entire cart
- `PUT /api/carts/:cid/products/:pid` - Update product quantity in cart
- `DELETE /api/carts/:cid/products/:pid` - Remove product from cart
- `DELETE /api/carts/:cid` - Clear cart

## Views

- `/products` - Product listing with pagination and filters
- `/products/:pid` - Product detail view
- `/carts/:cid` - Cart view

## Technologies Used

- Express.js - Web framework
- MongoDB - Database
- Mongoose - ODM
- Socket.IO - Real-time updates
- Handlebars - Template engine
- TailwindCSS - Styling

## Project Structure

```
.
├── config/
│   └── database.js
├── models/
│   ├── product.model.js
│   └── cart.model.js
├── routes/
│   ├── products.js
│   ├── carts.js
│   └── views.js
├── views/
│   ├── products.handlebars
│   ├── product-detail.handlebars
│   └── cart.handlebars
├── public/
│   └── js/
├── app.js
└── package.json
```
