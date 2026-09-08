const products = [
  { id: 1, name: "Cabernet Sauvignon", category: "wine", price: 15000, img: "https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?auto=format&fit=crop&w=300&q=80" },
  { id: 2, name: "Single Malt Whisky 12Y", category: "spirits", price: 45000, img: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=300&q=80" },
  { id: 3, name: "Aged Dark Rum", category: "rum", price: 18000, img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=300&q=80" },
  { id: 4, name: "Brut Vintage Champagne", category: "champagne", price: 65000, img: "https://images.unsplash.com/photo-1598153346810-860daa814c4b?auto=format&fit=crop&w=300&q=80" },
  { id: 5, name: "Craft IPA Lager", category: "beer", price: 3500, img: "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=300&q=80" },
  { id: 6, name: "Sparkling Tonic Water", category: "soft", price: 1200, img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=300&q=80" }
];

let cart = JSON.parse(localStorage.getItem("wineBarnCart")) || [];

function displayProducts(filter = "all") {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  const filtered = filter === "all" ? products : products.filter(p => p.category === filter);

  filtered.forEach(product => {
    grid.innerHTML += `
      <div class="product-card">
        <img src="${product.img}" alt="${product.name}">
        <div>
          <h3 class="product-title">${product.name}</h3>
          <p class="product-price">₦${product.price.toLocaleString()}</p>
        </div>
        <button class="btn-add" onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `;
  });
}

function filterProducts(category) {
  document.querySelectorAll(".cat-btn").forEach(btn => btn.classList.remove("active"));
  if (event) event.target.classList.add("active");
  displayProducts(category);
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem("wineBarnCart", JSON.stringify(cart));
}

function updateCartUI() {
  const cartCount = document.getElementById("cartCount");
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  cartCount.innerText = totalQty;
  cartTotal.innerText = `₦${totalPrice.toLocaleString()}`;

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-msg">Your cart is empty.</p>';
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div>
        <strong>${item.name}</strong><br>
        <small>₦${item.price.toLocaleString()} x ${item.qty}</small>
      </div>
      <div>₦${(item.price * item.qty).toLocaleString()}</div>
    </div>
  `).join("");
}

function toggleCart() {
  document.getElementById("cartModal").classList.toggle("open");
}

function checkoutWhatsApp() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const phoneNumber = "2348022056232";
  let message = "Hello Wine Barn! I'd like to place an order:%0A%0A";

  cart.forEach(item => {
    message += `• ${item.name} (x${item.qty}) - ₦${(item.price * item.qty).toLocaleString()}%0A`;
  });

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  message += `%0ATotal: ₦${total.toLocaleString()}`;

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(whatsappUrl, "_blank");
}

displayProducts();
updateCartUI();

