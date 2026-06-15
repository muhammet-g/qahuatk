import "./styles/main.scss";
import { categoryPage } from "./pages/category.js";
import { homePage } from "./pages/home.js";
import { productPage } from "./pages/product.js";
import { receiptPage } from "./pages/receipt.js";
import { products } from "./data/menu.js";

const app = document.querySelector("#app");
const CART_KEY = "qahuatk-cart";

function loadCart() {
  try {
    const cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function getCartItemKey(item) {
  const addonsKey = item.addons.map((addon) => addon.name).sort().join("|");
  return `${item.productId}:${item.size}:${addonsKey}`;
}

function addProductToCart(productPage, quantity) {
  const product = products.find((item) => item.id === productPage.dataset.productId);
  if (!product) {
    return;
  }

  const addons = [...productPage.querySelectorAll(".addon-option input:checked")].map((input) => ({
    name: input.dataset.addon,
    price: Number(input.dataset.price),
  }));
  const size = productPage.querySelector(".size-button.is-active")?.dataset.size || "M";
  const sizePrice = Number(
    productPage.querySelector(".size-button.is-active")?.dataset.sizePrice || product.price,
  );
  const addonsTotal = addons.reduce((sum, addon) => sum + addon.price, 0);
  const newItem = {
    productId: product.id,
    name: product.name,
    image: product.image,
    size,
    addons,
    quantity,
    unitPrice: sizePrice + addonsTotal,
  };
  const cart = loadCart();
  const key = getCartItemKey(newItem);
  const existing = cart.find((item) => getCartItemKey(item) === key);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      ...newItem,
      cartId: `${product.id}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    });
  }

  saveCart(cart);
}

const routes = {
  "/": () => homePage(),
  "/receipt": () => receiptPage(loadCart()),
};

function getRoute() {
  const hash = window.location.hash.replace(/^#/, "") || "/";
  const [path, param] = hash.split("/").filter(Boolean);

  if (!path) {
    return routes["/"]();
  }

  if (path === "category") {
    return categoryPage(param || "all");
  }

  if (path === "product") {
    return productPage(param || "latte");
  }

  return routes[`/${path}`]?.() || homePage();
}

function wirePageEvents() {
  app.querySelectorAll("[data-cart-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const itemNode = button.closest("[data-cart-id]");
      const cartId = itemNode?.dataset.cartId;
      if (!cartId) {
        return;
      }

      const action = button.dataset.cartAction;
      const nextCart = loadCart()
        .map((item) => {
          if (item.cartId !== cartId) {
            return item;
          }
          if (action === "increase") {
            return { ...item, quantity: item.quantity + 1 };
          }
          if (action === "decrease") {
            return { ...item, quantity: Math.max(0, item.quantity - 1) };
          }
          return item;
        })
        .filter((item) => item.cartId !== cartId || (action !== "remove" && item.quantity > 0));

      saveCart(nextCart);
      render();
    });
  });

  app.querySelectorAll('[data-action="menu"]').forEach((button) => {
    button.addEventListener("click", () => {
      const menu = app.querySelector("[data-menu]");
      button.classList.toggle("is-active");
      button.setAttribute("aria-pressed", String(button.classList.contains("is-active")));
      if (menu) {
        menu.hidden = !button.classList.contains("is-active");
      }
    });
  });

  app.querySelectorAll('[data-action="search"]').forEach((button) => {
    button.addEventListener("click", () => {
      const searchInput = app.querySelector(".search-box input");
      if (searchInput) {
        searchInput.focus();
        return;
      }

      window.location.hash = "#/";
      window.requestAnimationFrame(() => app.querySelector(".search-box input")?.focus());
    });
  });

  app.querySelectorAll('[data-action="favorite"]').forEach((button) => {
    button.addEventListener("click", () => {
      const symbol = button.querySelector(".material-symbols-outlined");
      const isActive = button.classList.toggle("is-active");
      button.setAttribute("aria-pressed", String(isActive));
      if (symbol) {
        symbol.textContent = isActive ? "favorite" : "favorite_border";
      }
    });
  });

  app.querySelectorAll('[data-action="back"]').forEach((button) => {
    button.addEventListener("click", () => {
      if (window.history.length > 1) {
        window.history.back();
        return;
      }

      window.location.hash = "#/";
    });
  });

  app.querySelectorAll(".size-button").forEach((button) => {
    button.addEventListener("click", () => {
      app.querySelectorAll(".size-button").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
    });
  });

  const productPage = app.querySelector(".product-page");
  if (!productPage) {
    return;
  }

  let quantity = 1;
  const basePrice = Number(productPage.dataset.price);
  const quantityNode = productPage.querySelector("[data-quantity]");
  const totalNode = productPage.querySelector("[data-total]");
  const selectedPriceNode = productPage.querySelector("[data-selected-price]");

  const getSelectedSizePrice = () =>
    Number(productPage.querySelector(".size-button.is-active")?.dataset.sizePrice || basePrice);

  const renderTotal = () => {
    const selectedSizePrice = getSelectedSizePrice();
    const addonsTotal = [...productPage.querySelectorAll(".addon-option input:checked")].reduce(
      (sum, input) => sum + Number(input.dataset.price),
      0,
    );
    quantityNode.textContent = quantity;
    selectedPriceNode.textContent = `${selectedSizePrice} ر.س`;
    totalNode.textContent = `${(selectedSizePrice + addonsTotal) * quantity} ر.س`;
  };

  productPage.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (action === "increase") {
      quantity += 1;
      renderTotal();
    }
    if (action === "decrease") {
      quantity = Math.max(1, quantity - 1);
      renderTotal();
    }
  });

  const addToReceipt = productPage.querySelector("[data-add-to-receipt]");
  addToReceipt?.addEventListener("click", () => {
    addProductToCart(productPage, quantity);
  });

  productPage.querySelectorAll(".size-button").forEach((button) => {
    button.addEventListener("click", renderTotal);
  });

  productPage.querySelectorAll(".addon-option input").forEach((input) => {
    input.addEventListener("change", renderTotal);
  });
}

function render() {
  app.innerHTML = getRoute();
  wirePageEvents();
  window.scrollTo({ top: 0, behavior: "instant" });
}

window.addEventListener("hashchange", render);
render();
