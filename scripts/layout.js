/**
 * ============================================
 * GHANSHYAM SEN - PORTFOLIO LAYOUT CONTROLLER
 * ============================================
 */

const THEME_STORAGE_KEY = "gsen-theme";

// Detect if we're in a subdirectory
function getBasePath() {
  const path = window.location.pathname;
  if (path.includes('/blog/')) {
    return '../';
  }
  return '';
}

// Apply saved theme immediately
(function initTheme() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    applyTheme(stored === "light" ? "light" : "dark");
  } catch (error) {
    applyTheme("dark");
  }
})();

// Load header
const basePath = getBasePath();

fetch(basePath + 'partials/header.html')
  .then(response => response.text())
  .then(data => {
    // Fix relative links for subdirectory
    let headerHtml = data;
    if (basePath) {
      headerHtml = headerHtml.replace(/href="index\.html/g, 'href="' + basePath + 'index.html');
      headerHtml = headerHtml.replace(/href="resume\.html/g, 'href="' + basePath + 'resume.html');
      headerHtml = headerHtml.replace(/href="blog\.html/g, 'href="' + basePath + 'blog.html');
      headerHtml = headerHtml.replace(/href="about\.html/g, 'href="' + basePath + 'about.html');
      headerHtml = headerHtml.replace(/href="assest\//g, 'href="' + basePath + 'assest/');
    }
    document.getElementById('header').innerHTML = headerHtml;
    markActiveNavigation();
    initThemeToggle();
    initMobileMenu(); // Initialize hamburger menu
  })
  .catch(error => console.error('Error loading header:', error));

// Load footer
fetch(basePath + 'partials/footer.html')
  .then(response => response.text())
  .then(data => {
    let footerHtml = data;
    if (basePath) {
      footerHtml = footerHtml.replace(/href="mailto:/g, 'href="mailto:');
    }
    document.getElementById('footer').innerHTML = footerHtml;
    updateFootnoteYear();
  })
  .catch(error => console.error('Error loading footer:', error));

function applyTheme(theme) {
  if (theme === "light") {
    document.body.classList.add("theme-light");
  } else {
    document.body.classList.remove("theme-light");
  }
}

function markActiveNavigation() {
  const pageKey = document.body.dataset.page;
  if (!pageKey) return;

  // Mark active in desktop nav
  const desktopSelector = `.nav-list .nav-link[data-active="${pageKey}"]`;
  const desktopLinks = document.querySelectorAll(".nav-list .nav-link");
  const activeDesktop = document.querySelector(desktopSelector);
  
  desktopLinks.forEach((link) => {
    link.classList.remove("active");
    link.removeAttribute("aria-current");
  });
  
  if (activeDesktop) {
    activeDesktop.classList.add("active");
    activeDesktop.setAttribute("aria-current", "page");
  }
  
  // Mark active in mobile nav
  const mobileSelector = `.mobile-menu-link[data-active="${pageKey}"]`;
  const mobileLinks = document.querySelectorAll(".mobile-menu-link");
  const activeMobile = document.querySelector(mobileSelector);
  
  mobileLinks.forEach((link) => {
    link.classList.remove("active");
  });
  
  if (activeMobile) {
    activeMobile.classList.add("active");
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
  if (!toggle) return;

  const updateToggleIcon = () => {
    const isLight = document.body.classList.contains("theme-light");
    const iconSpan = toggle.querySelector(".theme-toggle__icon");
    if (iconSpan) {
      iconSpan.innerHTML = isLight 
        ? '<i class="bi bi-sun-fill"></i>' 
        : '<i class="bi bi-moon-stars-fill"></i>';
    }
    toggle.setAttribute("aria-pressed", String(isLight));
  };

  toggle.addEventListener("click", () => {
    const isLight = document.body.classList.toggle("theme-light");
    
    try {
      localStorage.setItem(THEME_STORAGE_KEY, isLight ? "light" : "dark");
    } catch (error) {
      console.warn("Unable to persist theme:", error);
    }
    
    updateToggleIcon();
  });

  updateToggleIcon();
}

// Initialize Mobile Menu (Hamburger)
function initMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (!hamburgerBtn || !mobileMenu) {
    console.log('Mobile menu elements not found');
    return;
  }
  
  // Toggle menu on hamburger click
  hamburgerBtn.addEventListener('click', function() {
    hamburgerBtn.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.classList.toggle('menu-open');
  });
  
  // Close menu when clicking on a link
  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburgerBtn.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.classList.remove('menu-open');
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!hamburgerBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
      hamburgerBtn.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.classList.remove('menu-open');
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  markActiveNavigation();
  updateFootnoteYear();
  initThemeToggle();
});
