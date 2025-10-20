(function () {
  const EVENT_DATE = new Date('2026-08-29T19:00:00');

  function formatUnit(value) {
    return String(value).padStart(2, '0');
  }

  function updateCountdown() {
    const now = new Date();
    const difference = EVENT_DATE.getTime() - now.getTime();

    const elements = {
      days: document.querySelector('[data-countdown="days"]'),
      hours: document.querySelector('[data-countdown="hours"]'),
      minutes: document.querySelector('[data-countdown="minutes"]'),
      seconds: document.querySelector('[data-countdown="seconds"]'),
    };

    if (!elements.days) {
      return true;
    }

    if (difference <= 0) {
      ['days', 'hours', 'minutes', 'seconds'].forEach((unit) => {
        elements[unit].textContent = '00';
      });
      return true;
    }

    const totalSeconds = Math.floor(difference / 1000);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds / (60 * 60)) % 24);
    const minutes = Math.floor((totalSeconds / 60) % 60);
    const seconds = Math.floor(totalSeconds % 60);

    elements.days.textContent = formatUnit(days);
    elements.hours.textContent = formatUnit(hours);
    elements.minutes.textContent = formatUnit(minutes);
    elements.seconds.textContent = formatUnit(seconds);

    return false;
  }

  function setupCountdown() {
    if (updateCountdown()) {
      return;
    }

    const timer = setInterval(() => {
      if (updateCountdown()) {
        clearInterval(timer);
      }
    }, 1000);
  }

  function setupNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const toggleIcon = navToggle ? navToggle.querySelector('.nav-toggle__icon') : null;

    if (navLinks) {
      const activePage = document.body ? document.body.dataset.page : '';
      navLinks.querySelectorAll('li[data-nav]').forEach((item) => {
        const target = item.dataset.nav;
        const isActive = activePage && (target === activePage || (activePage === 'home' && target === 'home'));
        item.classList.toggle('active', Boolean(isActive));
      });
    }

    if (!navToggle || !navLinks) return;

    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      const nextState = !isExpanded;
      navToggle.setAttribute('aria-expanded', String(nextState));
      navLinks.classList.toggle('open', nextState);
      if (toggleIcon) {
        toggleIcon.textContent = nextState ? '✕' : '☰';
      }
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        if (navToggle) {
          navToggle.setAttribute('aria-expanded', 'false');
        }
        if (toggleIcon) {
          toggleIcon.textContent = '☰';
        }
      });
    });
  }

  function setupFooter() {
    const yearElement = document.querySelector('[data-current-year]');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }

    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (event) => {
        event.preventDefault();
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupCountdown();
    setupNavigation();
    setupFooter();
  });
})();
