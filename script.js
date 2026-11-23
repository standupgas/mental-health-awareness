const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector(".primary-navigation");

function closeMenu() {
  if (!menu || !menuButton) return;

  menu.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation menu");
  document.body.classList.remove("menu-open");
}

if (menuButton && menu) {
  menuButton.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu",
    );
    document.body.classList.toggle("menu-open", isOpen);
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (
      menu.classList.contains("open") &&
      !menu.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const answerId = button.getAttribute("aria-controls");
    const answer = document.getElementById(answerId);
    const isOpen = button.getAttribute("aria-expanded") === "true";

    document.querySelectorAll(".faq-question").forEach((otherButton) => {
      if (otherButton === button) return;

      otherButton.setAttribute("aria-expanded", "false");
      const otherAnswerId = otherButton.getAttribute("aria-controls");
      const otherAnswer = document.getElementById(otherAnswerId);
      if (otherAnswer) otherAnswer.hidden = true;
    });

    button.setAttribute("aria-expanded", String(!isOpen));
    if (answer) answer.hidden = isOpen;
  });
});

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const searchForm = document.querySelector(".site-search");
const searchInput = document.querySelector("#site-search-input");
const searchResults = document.querySelector("#search-results");

if (searchForm && searchInput && searchResults) {
  const searchEntries = [
    { title: "Home", href: "index.html#home" },
    { title: "About the Campaign", href: "about.html#about" },
    { title: "Mental Health", href: "about.html#about" },
    { title: "Understanding Bullying", href: "about.html#about" },
    { title: "Take Action", href: "take-action.html#take-action" },
    { title: "Find Someone Who Can Help", href: "take-action.html#support" },
    { title: "School Activities", href: "school-activities.html#school-activities" },
    { title: "Frequently Asked Questions", href: "faq.html#faq" },
    {
      title: "What should I do if I am being bullied?",
      href: "faq.html#faq-answer-1",
      answerId: "faq-answer-1",
    },
    {
      title: "What if I see someone else being bullied?",
      href: "faq.html#faq-answer-2",
      answerId: "faq-answer-2",
    },
    {
      title: "Does everyone who feels sad have a mental illness?",
      href: "faq.html#faq-answer-3",
      answerId: "faq-answer-3",
    },
    {
      title: "How can I ask for help if I feel nervous?",
      href: "faq.html#faq-answer-4",
      answerId: "faq-answer-4",
    },
    {
      title: "Can I contact this website for help?",
      href: "faq.html#faq-answer-5",
      answerId: "faq-answer-5",
    },
  ];

  let activeResult = -1;

  function closeSearch() {
    searchResults.hidden = true;
    searchInput.setAttribute("aria-expanded", "false");
    activeResult = -1;
  }

  function openSearch(entries, query) {
    searchResults.replaceChildren();
    activeResult = -1;

    if (entries.length === 0) {
      const empty = document.createElement("p");
      empty.className = "search-empty";
      empty.textContent = "No results found.";
      searchResults.appendChild(empty);
    } else {
      entries.forEach((entry, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "search-result";
        button.setAttribute("role", "option");
        button.textContent = entry.title;
        button.dataset.index = String(index);
        button.addEventListener("click", () => selectResult(entry));
        searchResults.appendChild(button);
      });
    }

    if (query) {
      const webLink = document.createElement("a");
      webLink.className = "search-result search-web";
      webLink.href = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
      webLink.target = "_blank";
      webLink.rel = "noopener noreferrer";
      webLink.textContent = `Search the web for “${query}”`;
      webLink.setAttribute("role", "option");
      webLink.addEventListener("click", () => closeMenu());
      searchResults.appendChild(webLink);
    }

    searchResults.hidden = false;
    searchInput.setAttribute("aria-expanded", "true");
  }

  function openWebSearch(query) {
    if (!query) return;
    closeSearch();
    closeMenu();
    window.open(
      `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  function selectResult(entry) {
    closeSearch();
    closeMenu();
    searchInput.value = "";

    if (entry.answerId) {
      const button = document.querySelector(
        `[aria-controls="${entry.answerId}"]`,
      );
      if (button) {
        if (button.getAttribute("aria-expanded") !== "true") button.click();
        searchResults.hidden = true;
        const answer = document.getElementById(entry.answerId);
        if (answer) {
          answer.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }
    }

    window.location.href = entry.href;
  }

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
  });

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
      closeSearch();
      return;
    }

    const entries = searchEntries
      .filter((entry) => entry.title.toLowerCase().includes(query))
      .slice(0, 6);
    openSearch(entries, query);
  });

  searchInput.addEventListener("keydown", (event) => {
    const buttons = [...searchResults.querySelectorAll(".search-result")];
    if (!buttons.length) {
      if (event.key === "Escape") closeSearch();
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      activeResult += event.key === "ArrowDown" ? 1 : -1;
      if (activeResult >= buttons.length) activeResult = 0;
      if (activeResult < 0) activeResult = buttons.length - 1;

      buttons.forEach((button, index) => {
        button.classList.toggle("active", index === activeResult);
      });
    }

    if (event.key === "Enter") {
      event.preventDefault();
      if (activeResult >= 0) {
        buttons[activeResult].click();
      } else {
        openWebSearch(searchInput.value.trim());
      }
    }

    if (event.key === "Escape") closeSearch();
  });

  document.addEventListener("click", (event) => {
    if (!searchForm.contains(event.target)) closeSearch();
  });
}

if (/^#faq-answer-[1-5]$/.test(window.location.hash)) {
  const answerId = window.location.hash.slice(1);
  const button = document.querySelector(`[aria-controls="${answerId}"]`);
  if (button) {
    button.click();
    const answer = document.getElementById(answerId);
    if (answer) {
      answer.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
}
