document.addEventListener("DOMContentLoaded", function() {
  initStickNav();
  initBsModalListener();
  initBsPopover();
  initFancyboxImages();
  initSyntaxHighlighter();
  initPostExternalLinks();
  initPostCtaSection();
  initCommentBox();
  initFormSubmission();
  initLazyLoadImage();
  initLazyLoadRecaptcha();
  initLazyLoadCalendly();
});

function initStickNav() {
  function stickyNav() {
    const navbarContainer = document.querySelector(".navbar-container");

    if (window.scrollY > 0) {
      navbarContainer.classList.add("sticky-navbar");
    } else {
      navbarContainer.classList.remove("sticky-navbar");
    }
  }

  stickyNav();
  window.addEventListener("resize", stickyNav);
  window.addEventListener("scroll", stickyNav);
}

function initBsModalListener() {
  function getScrollBarWidth() {
    const outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.width = "100px";
    outer.style.overflow = "scroll";
    document.body.appendChild(outer);

    const inner = document.createElement("div");
    inner.style.width = "100%";
    outer.appendChild(inner);
    const widthWithScroll = inner.offsetWidth;

    document.body.removeChild(outer);

    return 100 - widthWithScroll;
  }

  // bootstrap modal
  const modals = document.querySelectorAll(".modal");

  modals.forEach(function(modal) {
    modal.addEventListener("show.bs.modal", function() {
      const navbarContainer = document.querySelector(
        "header .navbar-container"
      );
      navbarContainer.style.right = getScrollBarWidth() + "px";
    });

    modal.addEventListener("hidden.bs.modal", function() {
      const navbarContainer = document.querySelector(
        "header .navbar-container"
      );
      navbarContainer.style.right = 0;
    });
  });
}

function initBsPopover() {
  const popoverElements = document.querySelectorAll("[data-bs-toggle=popover]");

  popoverElements.forEach(function(popoverElement) {
    const content = document.querySelector(
      popoverElement.getAttribute("data-selector")
    ).innerHTML;

    popoverElement.addEventListener("shown.bs.popover", function() {
      const navbarContainer = document.querySelector(
        "header .navbar-container"
      );
      navbarContainer.style.right = getScrollBarWidth() + "px";
    });

    popoverElement.addEventListener("hidden.bs.popover", function() {
      const navbarContainer = document.querySelector(
        "header .navbar-container"
      );
      navbarContainer.style.right = "0";
    });

    new bootstrap.Popover(popoverElement, {
      sanitize: false,
      html: true,
      content: content,
      customClass: "bdbq-popover",
    });
  });
}

function initFancyboxImages() {
  const postImages = document.querySelectorAll(".post-content img");

  postImages.forEach(function(image) {
    const href = image.getAttribute("src");
    const anchorElement = document.createElement("a");
    anchorElement.setAttribute("data-fancybox", "gallery");
    anchorElement.setAttribute("href", href);

    const imgElement = document.createElement("img");
    imgElement.setAttribute("src", href);

    anchorElement.appendChild(imgElement);

    image.parentNode.replaceChild(anchorElement, image);
  });

  Fancybox.bind("[data-fancybox]", {
    // Your custom options
  });
}

function initSyntaxHighlighter() {
  const codeSnippets = document.querySelectorAll(".post-content pre code");

  codeSnippets.forEach(function(code) {
    let classes = code.getAttribute("class");

    if (classes) {
      classes = classes.split(" ");
      const lang = classes.find(function(item) {
        return item.startsWith("language-");
      });

      if (lang) {
        code.parentNode.setAttribute(
          "data-language",
          lang.replace("language-", "")
        );
      }

      hljs.highlightElement(code);
    }
  });
}

function initPostExternalLinks() {
  const postLinks = document.querySelectorAll(".post-content p a");

  postLinks.forEach(function(link) {
    const href = link.getAttribute("href");
    if (!href.startsWith("https://blog.bigdataboutique.com")) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener nofollow");
    }
  });
}

function initPostCtaSection() {
  const postCTA = document.getElementById("postCTA");
  const postContent = document.querySelector(".post-content");

  if (postCTA && postContent) {
    const h2Elements = postContent.querySelectorAll("h2");

    if (h2Elements.length && h2Elements[0].previousElementSibling) {
      postContent.insertBefore(postCTA, h2Elements[0]);
    } else if (postContent.querySelector(".excerpt")) {
      postContent.insertBefore(
        postCTA,
        postContent.querySelector(".excerpt").nextSibling
      );
    }
  }

  const postCTAs = document.querySelectorAll(".post-cta");

  postCTAs.forEach(async function(cta) {
    const keywords = cta.getAttribute("data-keywords");

    if (keywords) {
      const response = await fetch(
        `https://bigdataboutique.com/b/ctas/${keywords.toLowerCase()}`
      );

      if (response.ok) {
        try {
          const { text } = await response.json();
          cta.querySelector(".post-cta__text").innerHTML = text;
        } catch (err) {
          // noop
        }
      }
    }
  });
}

function initCommentBox() {
  const addCommentButton = document.getElementById("addCommentButton");

  if (addCommentButton) {
    addCommentButton.addEventListener("click", function() {
      const formContainer = document.querySelector(
        ".comments-widget__form-container"
      );
      formContainer.style.display = "block";
      addCommentButton.parentNode.removeChild(addCommentButton);
    });
  }
}

function initFormSubmission() {
  document
    .querySelectorAll("#subscribeForm, #contactForm")
    .forEach(function(form) {
      form.addEventListener("submit", async function(e) {
        e.preventDefault();
        form.classList.add("loading");
        const response = await fetch(form.getAttribute("action"), {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
          body: new URLSearchParams(new FormData(form)),
        });

        form.classList.remove("loading");
        if (response.ok) {
          form.reset();
          const formToast = new bootstrap.Toast(
            document.querySelector(".success-toast")
          );
          formToast && formToast.show();

          const modalContainer = form.closest(".modal");
          if (modalContainer) {
            bootstrap.Modal.getOrCreateInstance(
              document.getElementById(modalContainer.getAttribute("id"))
            ).hide();
          }
        } else {
          const formToast = new bootstrap.Toast(
            document.querySelector(".error-toast")
          );
          formToast && formToast.show();
        }
      });
    });
}

function initLazyLoadImage() {
  const images = document.querySelectorAll(".lazy-load-img");

  if ("IntersectionObserver" in window) {
    const handleIntersection = function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          if (!entry.target.getAttribute("src")) {
            entry.target.setAttribute(
              "src",
              entry.target.getAttribute("data-src")
            );
          }
          observer.unobserve(entry.target);
        }
      });
    };

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver(handleIntersection, options);

    images.forEach(function(image) {
      observer.observe(image);
    });
  } else {
    images.forEach(function(image) {
      image.setAttribute("src", image.getAttribute("data-src"));
    });
  }
}

function initLazyLoadRecaptcha() {
  const captchaElements = document.querySelectorAll(".g-recaptcha");

  if (!captchaElements.length) {
    return;
  }

  const handleIntersection = function(entries, observer) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && !document.getElementById("captchaScript")) {
        loadRecaptcha();
        observer.disconnect();
      }
    });
  };

  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0,
  };

  const observer = new IntersectionObserver(handleIntersection, options);

  captchaElements.forEach(function(captchaElement) {
    observer.observe(captchaElement);
  });

  const loadRecaptcha = function() {
    const captchaScript = document.createElement("script");
    captchaScript.id = "captchaScript";
    captchaScript.async = true;
    captchaScript.src = "https://www.google.com/recaptcha/api.js";
    document.body.appendChild(captchaScript);
  };
}

function initLazyLoadCalendly() {
  const calendlyModal = document.getElementById("calendlyModal");

  if (!calendlyModal) {
    return;
  }

  calendlyModal.addEventListener("show.bs.modal", function() {
    if (!document.getElementById("calendlyScript")) {
      const calendlyScript = document.createElement("script");
      calendlyScript.id = "calendlyScript";
      calendlyScript.async = true;
      calendlyScript.src =
        "https://assets.calendly.com/assets/external/widget.js";
      document.body.appendChild(calendlyScript);

      const listener = function(event) {
        if (
          event.origin === "https://calendly.com" &&
          event.data &&
          event.data.event &&
          event.data.event === "calendly.event_type_viewed"
        ) {
          const loader = calendlyModal.querySelector(".loader");
          if (loader) {
            loader.style.display = "none";
          }
          window.removeEventListener("message", listener);
        }
      };

      window.addEventListener("message", listener);
    }
  });
}

function copyText(text) {
  const el = document.createElement("textarea");
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}
