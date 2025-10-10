const THEME_STORAGE_KEY = "gsen-theme";


// Load header.html into the div with id="header"
fetch('partials/header.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header').innerHTML = data;
    markActiveNavigation();
    initThemeToggle();
  })
  .catch(error => console.error('Error loading header:', error));


fetch('partials/footer.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('footer').innerHTML = data;

     updateFootnoteYear();
  })
  .catch(error => console.error('Error loading header:', error));

fetch('partials/contact.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('contact').innerHTML = data;
  })
  .catch(error => console.error('Error loading header:', error));


function setLink() {
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPath = window.location.pathname.split("/").pop(); // e.g. 'about.html' or ''
  const currentHash = window.location.hash; // e.g. '#projects'

  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    const dataActive = link.getAttribute('data-active');

    // Reset any existing 'active' class
    link.classList.remove('active');

    // Check if link matches the current page or hash
    if (
      (linkPath === currentPath) ||                                 // exact match
      (currentPath === '' && dataActive === 'home') ||              // for index.html or /
      (currentPath === 'index.html' && dataActive === 'home') ||    // explicit home page
      (linkPath.includes(currentHash) && currentHash !== '')        // for hash sections (#projects, #technologies)
    ) {
      link.classList.add('active');
    }
  });
}



function applyTheme(theme) {
  if (theme === "light") {
    document.body.classList.add("theme-light");
  } else {
    document.body.classList.remove("theme-light");
  }
}

function markActiveNavigation() {
  const pageKey = document.body.dataset.page;
  if (!pageKey) {
    return;
  }
  const selector = `.nav-link[data-active="${pageKey}"]`;
  const activeLink = document.querySelector(selector);
  if (activeLink) {
    document.querySelectorAll(".top-nav .nav-link").forEach((link) => {
      link.classList.remove("active");
      link.removeAttribute("aria-current");
    });
    activeLink.classList.add("active");
    activeLink.setAttribute("aria-current", "page");
  }
}

function updateFootnoteYear() {
  const target = document.getElementById("footerYear");
  if (target) {
    target.textContent = new Date().getFullYear();
  }
}

function initThemeToggle() {
  const toggle = document.querySelector(".theme-toggle");
  if (!toggle) {
    return;
  }

  const setPressed = () => {
    const isLight = document.body.classList.contains("theme-light");
    toggle.setAttribute("aria-pressed", String(isLight));
    toggle.setAttribute("data-mode", isLight ? "light" : "dark");
  };

  toggle.addEventListener("click", () => {
    const isLight = document.body.classList.toggle("theme-light");
    try {
      localStorage.setItem(THEME_STORAGE_KEY, isLight ? "light" : "dark");
    } catch (error) {
      console.warn("Unable to persist theme", error);
    }
    setPressed();
  });

  setPressed();
}

(function initialiseTheme() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    applyTheme(stored === "light" ? "light" : "dark");
  } catch (error) {
    applyTheme("dark");
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  markActiveNavigation();
  updateFootnoteYear();
  initThemeToggle();
});
