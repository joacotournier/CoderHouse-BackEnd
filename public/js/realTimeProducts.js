const socket = io();

const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");

// Listen for products updates from server
socket.on("products", (products) => {
  productList.innerHTML = products
    .map(
      (product) => `
    <div class="product-card">
      <h2>${product.title}</h2>
      <p>${product.description}</p>
      <p>Price: $${product.price}</p>
      <p>Stock: ${product.stock}</p>
      <p>Category: ${product.category}</p>
      <button onclick="deleteProduct(${product.id})">Delete</button>
    </div>
  `
    )
    .join("");
});

// Handle form submission
productForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const product = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: Number(document.getElementById("price").value),
    stock: Number(document.getElementById("stock").value),
    category: document.getElementById("category").value,
    code: document.getElementById("code").value,
    status: true,
    thumbnails: [],
  };

  socket.emit("newProduct", product);
  productForm.reset();
});

// Handle product deletion
function deleteProduct(id) {
  socket.emit("deleteProduct", id);
}
