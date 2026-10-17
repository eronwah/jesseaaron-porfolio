
document.addEventListener("DOMContentLoaded", () => {
  // Automatically update the copyright year.
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Mobile navigation.
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  function closeMenu() {
    if (!menuToggle || !nav) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    nav.classList.remove("is-open");
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const open = menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute("aria-expanded", String(!open));
      menuToggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      nav.classList.toggle("is-open", !open);
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", event => {
      if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
        closeMenu();
      }
    });
  }

  // Reveal sections gently as they enter the screen.
  const revealItems = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -30px 0px"
    });

    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }

  // Highlight the navigation item for the visible section.
  const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${entry.target.id}`
            );
          });
        }
      });
    }, {
      rootMargin: "-35% 0px -55% 0px"
    });

    sections.forEach(section => sectionObserver.observe(section));
  }

  // Project briefs: plans for demonstration projects, not completed results.
  const projectData = {
    operations: {
      kicker: "DASHBOARD CONCEPT",
      title: "Operations & Revenue Tracker",
      description:
        "Create a sample monthly reporting dashboard using fictional operational records. The aim is to make activity, payment status, and key indicators easier to review.",
      steps: [
        "Prepare fictional records with dates, categories, amounts, and status fields.",
        "Check data types, missing values, duplicate rows, and inconsistent categories.",
        "Summarize monthly totals and status counts with formulas or pivot tables.",
        "Build a dashboard with clear labels, filters, and a short interpretation."
      ]
    },
    quality: {
      kicker: "DATA CLEANING",
      title: "Customer Records Quality Check",
      description:
        "Demonstrate a repeatable data-quality process using fictional records, without using real or confidential customer information.",
      steps: [
        "Create sample records with intentional duplicates and missing values.",
        "Define rules for required fields, valid formats, and duplicate identification.",
        "Flag uncertain records for review instead of automatically deleting them.",
        "Document quality checks and explain the limitations of the rules."
      ]
    },
    workflow: {
      kicker: "WORKFLOW DESIGN",
      title: "Spreadsheet Workflow Improvement",
      description:
        "Map a manual tracking process into consistent stages so information is easier to update, validate, and review.",
      steps: [
        "Describe the current process and identify repeated manual steps.",
        "Standardize columns, status values, and responsibilities.",
        "Add validation rules and a review checklist.",
        "Document the proposed process and measure improvements only when evidence is available."
      ]
    }
  };

  const modal = document.getElementById("project-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalKicker = document.getElementById("modal-kicker");
  const modalDescription = document.getElementById("modal-description");
  const modalSteps = document.getElementById("modal-steps");
  let previousFocus = null;

  function closeModal() {
    if (!modal) return;

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    if (previousFocus) previousFocus.focus();
  }

  document.querySelectorAll("[data-project]").forEach(button => {
    button.addEventListener("click", () => {
      const project = projectData[button.dataset.project];
      if (!project || !modal) return;

      previousFocus = button;
      modalKicker.textContent = project.kicker;
      modalTitle.textContent = project.title;
      modalDescription.textContent = project.description;
      modalSteps.replaceChildren();

      project.steps.forEach(step => {
        const item = document.createElement("li");
        item.textContent = step;
        modalSteps.appendChild(item);
      });

      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      modal.querySelector(".modal-close").focus();
    });
  });

  document.querySelectorAll("[data-close-modal]").forEach(element => {
    element.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modal?.classList.contains("is-open")) {
      closeModal();
    }
  });
});
