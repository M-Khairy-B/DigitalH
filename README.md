# Authentication and Dashboard Project

## 🔑 Authentication

- Users can log in using email and password.
- Authentication is handled using NextAuth.js.
- Upon successful login, users are redirected to the dashboard.
- Authentication errors are handled gracefully.

### Default Login Credentials:

```json
{
  "email": "john@mail.com",
  "password": "changeme"
}
```

## 📊 Dashboard

### Products Page:

- Displays a table of products with the following columns as per API docs.
- Includes actions: **Edit, Delete, View Details**.
- Search functionality by product name.
- Interactive hover effects for better user experience.

### ➕ Add Product:

- Button to open a modal for adding a new product.
- Form includes fields as specified in the API docs.
- Form validation is enforced before submission.

### ✏️ Edit Product:

- Clicking **Edit** opens a modal with pre-filled product details.
- Users can update product details.
- Form validation is enforced before submission.

### 🗑️ Delete Product:

- Clicking **Delete** shows a confirmation dialog.
- Deletes the product after user confirmation.

### 🔍 View Product Details:

- Clicking **View Details** opens a modal with detailed product information.

## 📂 Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo.git
   ```
2. Navigate to the project folder:
   ```bash
   cd your-project-folder
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and visit:
   ```
   http://localhost:3000
   ```
