import { bottomNav, icon } from "../components/layout.js";
import { appHeader } from "../components/layout.js";

const formatPrice = (value) => `${value.toFixed(2)} ر.س`;

const sizeLabels = {
  S: "حجم صغير",
  M: "حجم وسط",
  L: "حجم كبير",
};

const receiptItem = (item) => {
  const addons = item.addons.length ? ` · ${item.addons.map((addon) => addon.name).join("، ")}` : "";
  const itemTotal = item.unitPrice * item.quantity;

  return `
    <article class="receipt-item" data-cart-id="${item.cartId}">
      <img src="${item.image}" alt="${item.name}" />
      <div class="receipt-item__body">
        <h3>${item.name}</h3>
        <p>${sizeLabels[item.size] || item.size}${addons}</p>
        <div class="receipt-controls" aria-label="التحكم في كمية ${item.name}">
          <button type="button" data-cart-action="decrease" aria-label="إنقاص ${item.name}">
            ${icon("remove")}
          </button>
          <span>${item.quantity}</span>
          <button type="button" data-cart-action="increase" aria-label="زيادة ${item.name}">
            ${icon("add")}
          </button>
          <button class="receipt-controls__delete" type="button" data-cart-action="remove" aria-label="حذف ${item.name}">
            ${icon("delete")}
          </button>
        </div>
      </div>
      <div class="receipt-item__price">
        <strong>${formatPrice(itemTotal)}</strong>
        <span>${formatPrice(item.unitPrice)} × ${item.quantity}</span>
      </div>
    </article>
  `;
};

const emptyReceipt = () => `
  <div class="receipt-empty">
    ${icon("receipt_long")}
    <h2>فاتورتك فارغة</h2>
    <p>اختر مشروبك المفضل وأضفه هنا لمراجعة الطلب.</p>
    <a class="primary-action" href="#/category/all">تصفح القائمة</a>
  </div>
`;

export const receiptPage = (cart = []) => {
  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  return `
    <div class="page page--with-bottom-nav">
      ${appHeader({ title: "فاتورتي", activeTab: "receipt" })}
      <main class="container receipt-page">
        ${
          cart.length
            ? `
              <section class="receipt-section">
                <div class="receipt-section__header">
                  <h2>تفاصيل الطلب</h2>
                  <a href="#/category/all">إضافة عنصر</a>
                </div>
                <div class="receipt-list">
                  ${cart.map(receiptItem).join("")}
                </div>
              </section>

              <section class="receipt-summary">
                <h2>ملخص الحساب</h2>
                <dl>
                  <div>
                    <dt>المجموع الفرعي</dt>
                    <dd>${formatPrice(subtotal)}</dd>
                  </div>
                  <div>
                    <dt>الضريبة (15%)</dt>
                    <dd>${formatPrice(tax)}</dd>
                  </div>
                  <div class="receipt-summary__total">
                    <dt>الإجمالي النهائي</dt>
                    <dd>${formatPrice(total)}</dd>
                  </div>
                </dl>
              </section>

              <p class="receipt-note">هذه الفاتورة للعرض فقط وليست لطلب الدفع.</p>
            `
            : emptyReceipt()
        }
      </main>
      ${bottomNav("receipt")}
    </div>
  `;
};
