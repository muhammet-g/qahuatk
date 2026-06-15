export const icon = (name, className = "") =>
  `<span class="material-symbols-outlined ${className}" aria-hidden="true">${name}</span>`;

const navLinks = (activeTab) => `
  <a class="${activeTab === "home" ? "is-active" : ""}" href="#/">الرئيسية</a>
  <a class="${activeTab === "menu" ? "is-active" : ""}" href="#/category/all">القائمة</a>
  <a class="${activeTab === "receipt" ? "is-active" : ""}" href="#/receipt">فاتورتي</a>
`;

export const appHeader = ({ title, activeTab = "home", back = false, search = true }) => `
  <header class="app-header">
    <button class="icon-button" data-action="${back ? "back" : "menu"}" aria-label="${
      back ? "العودة" : "القائمة"
    }">
      ${icon(back ? "arrow_forward" : "menu")}
    </button>
    <h1>${title}</h1>
    <nav class="desktop-nav" aria-label="التنقل العلوي">
      ${navLinks(activeTab)}
    </nav>
    <button class="icon-button" data-action="${search ? "search" : "favorite"}" aria-label="${search ? "البحث" : "المفضلة"}">
      ${icon(search ? "search" : "favorite_border")}
    </button>
  </header>
  ${
    back
      ? ""
      : `<nav class="quick-menu" data-menu hidden>
          <a href="#/">الرئيسية</a>
          <a href="#/category/all">القائمة</a>
          <a href="#/receipt">فاتورتي</a>
        </nav>`
  }
`;

export const bottomNav = (activeTab) => `
  <nav class="bottom-nav" aria-label="التنقل السفلي">
    <a class="bottom-nav__item ${activeTab === "home" ? "is-active" : ""}" href="#/">
      ${icon("home")}
      <span>الرئيسية</span>
    </a>
    <a class="bottom-nav__item ${activeTab === "menu" ? "is-active" : ""}" href="#/category/all">
      ${icon("local_cafe")}
      <span>القائمة</span>
    </a>
    <a class="bottom-nav__item ${activeTab === "receipt" ? "is-active" : ""}" href="#/receipt">
      ${icon("receipt_long")}
      <span>فاتورتي</span>
    </a>
  </nav>
`;

export const searchBox = () => `
  <label class="search-box">
    ${icon("search")}
    <input type="search" placeholder="ابحث عن قهوتك المفضلة..." aria-label="ابحث عن قهوتك المفضلة" />
  </label>
`;
