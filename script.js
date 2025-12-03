// ===================================
// NAVIGATION & MOBILE MENU
// ===================================

const navbar = document.getElementById("navbar");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navLinks = document.getElementById("navLinks");
const navLinkItems = document.querySelectorAll(".nav-link");

// Navbar scroll effect
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  // Add/remove scrolled class
  if (currentScroll > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  lastScroll = currentScroll;
});

// Mobile menu toggle
mobileMenuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  mobileMenuBtn.classList.toggle("active");

  // Animate hamburger icon
  const spans = mobileMenuBtn.querySelectorAll("span");
  if (navLinks.classList.contains("active")) {
    spans[0].style.transform = "rotate(45deg) translate(7px, 7px)";
    spans[1].style.opacity = "0";
    spans[2].style.transform = "rotate(-45deg) translate(7px, -7px)";
  } else {
    spans[0].style.transform = "none";
    spans[1].style.opacity = "1";
    spans[2].style.transform = "none";
  }
});

// Close mobile menu when clicking a link
navLinkItems.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    const spans = mobileMenuBtn.querySelectorAll("span");
    spans[0].style.transform = "none";
    spans[1].style.opacity = "1";
    spans[2].style.transform = "none";
  });
});

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
    navLinks.classList.remove("active");
    const spans = mobileMenuBtn.querySelectorAll("span");
    spans[0].style.transform = "none";
    spans[1].style.opacity = "1";
    spans[2].style.transform = "none";
  }
});

// ===================================
// SMOOTH SCROLL
// ===================================

navLinkItems.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href");
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      const navHeight = navbar.offsetHeight;
      const targetPosition = targetSection.offsetTop - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
});

// ===================================
// ACTIVE LINK INDICATOR
// ===================================

function highlightActiveLink() {
  const sections = document.querySelectorAll("section[id]");
  const scrollY = window.pageYOffset;

  sections.forEach((section) => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute("id");
    const correspondingLink = document.querySelector(
      `.nav-link[href="#${sectionId}"]`
    );

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      correspondingLink?.classList.add("active");
    } else {
      correspondingLink?.classList.remove("active");
    }
  });
}

window.addEventListener("scroll", highlightActiveLink);

// ===================================
// SCROLL ANIMATIONS
// ===================================

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe all sections
document.querySelectorAll("section").forEach((section) => {
  section.style.opacity = "0";
  section.style.transform = "translateY(30px)";
  section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  observer.observe(section);
});

// Observe cards
document
  .querySelectorAll(".package-card, .portfolio-item, .tech-category")
  .forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    observer.observe(card);
  });

// ===================================
// FORM HANDLING
// ===================================

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.textContent = "Enviando...";
    submitButton.style.opacity = "0.7";

    try {
      // Get form data
      const formData = new FormData(contactForm);

      // Send to Formspree (you need to replace the action URL in HTML)
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        // Success
        showNotification("¡Mensaje enviado! Te responderé pronto.", "success");
        contactForm.reset();
      } else {
        // Error
        showNotification(
          "Hubo un error. Por favor, intenta de nuevo.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      showNotification(
        "Error al enviar el mensaje. Intenta por WhatsApp.",
        "error"
      );
    } finally {
      // Re-enable button
      submitButton.disabled = false;
      submitButton.textContent = originalText;
      submitButton.style.opacity = "1";
    }
  });
}

// ===================================
// NOTIFICATION SYSTEM
// ===================================

function showNotification(message, type = "success") {
  // Remove existing notifications
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Add styles
  Object.assign(notification.style, {
    position: "fixed",
    top: "100px",
    right: "20px",
    padding: "1rem 1.5rem",
    borderRadius: "12px",
    backgroundColor: type === "success" ? "#10b981" : "#ef4444",
    color: "white",
    fontWeight: "600",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    zIndex: "10000",
    animation: "slideInRight 0.3s ease",
    maxWidth: "300px",
  });

  // Add to DOM
  document.body.appendChild(notification);

  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// Add notification animations to document
const style = document.createElement("style");
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===================================
// FORM VALIDATION
// ===================================

// Real-time validation
const formInputs = document.querySelectorAll(
  ".contact-form input, .contact-form select, .contact-form textarea"
);

formInputs.forEach((input) => {
  input.addEventListener("blur", () => {
    validateField(input);
  });

  input.addEventListener("input", () => {
    if (input.classList.contains("error")) {
      validateField(input);
    }
  });
});

function validateField(field) {
  const value = field.value.trim();

  // Remove previous error
  removeError(field);

  // Check if required field is empty
  if (field.hasAttribute("required") && !value) {
    showError(field, "Este campo es obligatorio");
    return false;
  }

  // Email validation
  if (field.type === "email" && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      showError(field, "Por favor, ingresa un email válido");
      return false;
    }
  }

  // Phone validation (basic)
  if (field.type === "tel" && value) {
    const phoneRegex = /^[+]?[\d\s-()]+$/;
    if (!phoneRegex.test(value) || value.length < 8) {
      showError(field, "Por favor, ingresa un teléfono válido");
      return false;
    }
  }

  return true;
}

function showError(field, message) {
  field.classList.add("error");
  field.style.borderColor = "#ef4444";

  // Create error message
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.textContent = message;
  errorDiv.style.color = "#ef4444";
  errorDiv.style.fontSize = "0.875rem";
  errorDiv.style.marginTop = "0.25rem";

  field.parentElement.appendChild(errorDiv);
}

function removeError(field) {
  field.classList.remove("error");
  field.style.borderColor = "";

  const errorMessage = field.parentElement.querySelector(".error-message");
  if (errorMessage) {
    errorMessage.remove();
  }
}

// Validate all fields before submit
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    let isValid = true;

    formInputs.forEach((input) => {
      if (!validateField(input)) {
        isValid = false;
      }
    });

    if (!isValid) {
      e.preventDefault();
      showNotification(
        "Por favor, completa todos los campos correctamente",
        "error"
      );
    }
  });
}

// ===================================
// PACKAGE CARD HOVER EFFECT
// ===================================

const packageCards = document.querySelectorAll(".package-card");

packageCards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-10px) scale(1.02)";
  });

  card.addEventListener("mouseleave", () => {
    if (!card.classList.contains("package-featured")) {
      card.style.transform = "";
    }
  });
});

// ===================================
// PORTFOLIO ITEM CLICK
// ===================================

const portfolioItems = document.querySelectorAll(".portfolio-item");

portfolioItems.forEach((item) => {
  const link = item.querySelector(".portfolio-link");

  item.addEventListener("click", (e) => {
    // If clicking the link itself, let it work normally
    if (e.target.closest(".portfolio-link")) {
      return;
    }

    // Otherwise, trigger the link click
    if (link) {
      e.preventDefault();
      // Here you could open a modal or navigate
      // For now, we'll just show a notification
      showNotification("Demo disponible próximamente", "success");
    }
  });
});

// ===================================
// LAZY LOADING IMAGES (if you add images later)
// ===================================

if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add("loaded");
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img);
  });
}

// ===================================
// SCROLL TO TOP FUNCTIONALITY
// ===================================

let scrollTopBtn;

function createScrollTopButton() {
  scrollTopBtn = document.createElement("button");
  scrollTopBtn.innerHTML = "↑";
  scrollTopBtn.className = "scroll-top-btn";

  Object.assign(scrollTopBtn.style, {
    position: "fixed",
    bottom: "100px",
    right: "2rem",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    background: "var(--secondary)",
    color: "white",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    opacity: "0",
    visibility: "hidden",
    transition: "all 0.3s ease",
    zIndex: "998",
    boxShadow: "0 5px 20px rgba(0, 78, 137, 0.3)",
  });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  scrollTopBtn.addEventListener("mouseenter", () => {
    scrollTopBtn.style.transform = "translateY(-5px)";
    scrollTopBtn.style.boxShadow = "0 8px 30px rgba(0, 78, 137, 0.4)";
  });

  scrollTopBtn.addEventListener("mouseleave", () => {
    scrollTopBtn.style.transform = "translateY(0)";
    scrollTopBtn.style.boxShadow = "0 5px 20px rgba(0, 78, 137, 0.3)";
  });

  document.body.appendChild(scrollTopBtn);
}

createScrollTopButton();

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 500) {
    scrollTopBtn.style.opacity = "1";
    scrollTopBtn.style.visibility = "visible";
  } else {
    scrollTopBtn.style.opacity = "0";
    scrollTopBtn.style.visibility = "hidden";
  }
});

// ===================================
// PERFORMANCE: Debounce scroll events
// ===================================

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Use debounced version for scroll events if needed
const debouncedScrollHandler = debounce(() => {
  // Any heavy scroll operations here
}, 100);

// ===================================
// CONSOLE MESSAGE (Optional branding)
// ===================================

console.log(
  "%c¡Hola Developer! 👋",
  "color: #FF6B35; font-size: 20px; font-weight: bold;"
);
console.log(
  "%c¿Buscando algo interesante en el código?",
  "color: #004E89; font-size: 14px;"
);
console.log(
  "%cEste sitio fue desarrollado con ❤️ y código limpio.",
  "color: #718096; font-size: 12px;"
);
console.log(
  "%cSi te interesa trabajar conmigo, enviame un mensaje!",
  "color: #FF6B35; font-size: 12px;"
);

// ===================================
// INITIALIZE
// ===================================

document.addEventListener("DOMContentLoaded", () => {
  console.log("Portfolio loaded successfully! 🚀");

  // Add smooth scroll to all anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // Skip if it's just "#"
      if (href === "#") {
        e.preventDefault();
        return;
      }

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.offsetTop - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Trigger highlight on load
  highlightActiveLink();
});
