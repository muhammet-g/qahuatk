import { addons, products, sizeOptions } from "../data/menu.js";
import { icon } from "../components/layout.js";

export const productPage = (id = "latte") => {
  const product = products.find((item) => item.id === id) || products[0];

  return `
    <div class="page product-page" data-product-id="${product.id}" data-price="${product.price}">
      <section class="product-hero">
        <img src="${product.hero}" alt="${product.name}" />
        <div class="product-hero__shade"></div>
        <header class="product-hero__header">
          <button class="icon-button icon-button--glass" data-action="back" aria-label="العودة">
            ${icon("arrow_forward")}
          </button>
          <button class="icon-button icon-button--glass" data-action="favorite" aria-label="المفضلة">
            ${icon("favorite_border")}
          </button>
        </header>
      </section>

      <main class="container product-content">
        <section class="product-summary">
          <div>
            <h1>${product.name}</h1>
            <strong data-selected-price>${product.sizePrices.M} ر.س</strong>
          </div>
          <p>${product.description}</p>
          <ul class="components-list" aria-label="مكونات ${product.name}">
            ${product.components.map((component) => `<li>${component}</li>`).join("")}
          </ul>
        </section>

        <section class="choice-section">
          <h2>الحجم</h2>
          <div class="size-options" role="radiogroup" aria-label="اختيار الحجم">
            ${sizeOptions
              .map(
                (size) => `
                  <button class="size-button ${size.id === "M" ? "is-active" : ""}" type="button" data-size="${size.id}" data-size-price="${product.sizePrices[size.id]}">
                    <span>${size.label} (${size.id})</span>
                    <strong>${product.sizePrices[size.id]} ر.س</strong>
                  </button>
                `,
              )
              .join("")}
          </div>
        </section>

        <section class="choice-section">
          <h2>إضافات (اختياري)</h2>
          <div class="addons-list">
            ${addons
              .map(
                (addon) => `
                  <label class="addon-option">
                    <input type="checkbox" data-addon="${addon.name}" data-price="${addon.price}" />
                    <span class="addon-option__box">
                      <span class="addon-option__check">${icon("check")}</span>
                      <span>${addon.name}</span>
                    </span>
                    <span>+${addon.price} ر.س</span>
                  </label>
                `,
              )
              .join("")}
          </div>
        </section>
      </main>

      <footer class="cart-bar">
        <div class="quantity-control">
          <button type="button" data-action="decrease" aria-label="إنقاص الكمية">${icon("remove")}</button>
          <span data-quantity>1</span>
          <button type="button" data-action="increase" aria-label="زيادة الكمية">${icon("add")}</button>
        </div>
        <a class="primary-action" href="#/receipt" data-add-to-receipt>
          <span>أضف للفاتورة</span>
          <strong data-total>${product.sizePrices.M} ر.س</strong>
        </a>
      </footer>
    </div>
  `;
};
