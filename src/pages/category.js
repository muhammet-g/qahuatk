import { categories, products } from "../data/menu.js";
import { appHeader, bottomNav, icon } from "../components/layout.js";

const filters = [["all", "الكل"], ...categories.map((category) => [category.id, category.title])];

const productCard = (product) => `
  <a class="product-card" href="#/product/${product.id}">
    <div class="product-card__media">
      <img src="${product.image}" alt="${product.name}" loading="lazy" decoding="async" />
    </div>
    <div class="product-card__body">
      <h2>${product.name}</h2>
      <p>${product.shortDescription}</p>
      <div class="product-card__footer">
        <span>${product.price} ر.س</span>
        <span class="icon-button icon-button--solid" aria-label="فتح المنتج">
          ${icon("receipt_long")}
        </span>
      </div>
    </div>
  </a>
`;

export const categoryPage = (category = "all") => {
  const visibleProducts =
    category === "all" ? products : products.filter((product) => product.category === category);

  return `
    <div class="page page--with-bottom-nav">
      ${appHeader({ title: category === "all" ? "القائمة" : categories.find((item) => item.id === category)?.title || "القائمة", activeTab: "menu", back: true })}
      <main class="container category-page">
        <section class="filter-row" aria-label="تصفية المنتجات">
          ${filters
            .map(
              ([value, label]) => `
                <a class="filter-chip ${category === value ? "is-active" : ""}" href="#/category/${value}">
                  ${label}
                </a>
              `,
            )
            .join("")}
        </section>

        <section class="product-grid">
          ${visibleProducts.map(productCard).join("")}
        </section>
      </main>
      ${bottomNav("menu")}
    </div>
  `;
};
