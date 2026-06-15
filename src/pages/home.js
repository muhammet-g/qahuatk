import { categories } from "../data/menu.js";
import { appHeader, bottomNav, icon, searchBox } from "../components/layout.js";

const categoryCard = (category) => `
  <a class="category-card" href="#/category/${category.id}">
    <img src="${category.image}" alt="" loading="lazy" decoding="async" />
    <div class="category-card__overlay"></div>
    <div class="category-card__content">
      <div>
        ${icon(category.icon)}
        <strong>${category.title}</strong>
      </div>
      <span class="category-card__arrow">${icon("arrow_forward")}</span>
    </div>
  </a>
`;

export const homePage = () => `
  <div class="page page--with-bottom-nav">
    ${appHeader({ title: "قهوتك", activeTab: "home" })}
    <main class="container home-page">
      <section class="intro">
        <h2>مرحباً بك في قهوتك</h2>
        <p>ماذا تود أن تتذوق اليوم؟</p>
      </section>

      <section class="section-block">
        ${searchBox()}
      </section>

      <section class="section-block">
        <div class="section-title">
          <h3>القائمة</h3>
        </div>
        <div class="category-grid">
          ${categories.map(categoryCard).join("")}
        </div>
      </section>
    </main>
    ${bottomNav("home")}
  </div>
`;
