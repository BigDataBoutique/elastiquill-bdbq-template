$(function() {
  function stickyNav() {
    if ($(window).scrollTop()) {
      $(".navbar-container").addClass("sticky-navbar");
    } else {
      $(".navbar-container").removeClass("sticky-navbar");
    }
  }

  stickyNav();
  $(window).on("resize", stickyNav);
  $(window).scroll(stickyNav);

  function getScrollBarWidth() {
    let $outer = $("<div>")
        .css({ visibility: "hidden", width: 100, overflow: "scroll" })
        .appendTo("body"),
      widthWithScroll = $("<div>")
        .css({ width: "100%" })
        .appendTo($outer)
        .outerWidth();
    $outer.remove();
    return 100 - widthWithScroll;
  }

  // bootstrap modal
  $(".modal").on("show.bs.modal", function() {
    $("header .navbar-container").css("right", getScrollBarWidth());
  });
  $(".modal").on("hidden.bs.modal", function() {
    $("header .navbar-container").css("right", 0);
  });

  // bootstrap popover
  $("[data-bs-toggle=popover]").each(function() {
    const content = $($(this).attr("data-selector")).html();
    $(this).popover({
      sanitize: false,
      html: true,
      content,
      customClass: "bdbq-popover",
    });
  });

  function initLazyLoadImage() {
    const images = $(".lazy-load-img");
    if (window.IntersectionObserver) {
      images.each(function() {
        const image = this;
        const io = new IntersectionObserver(function(entries) {
          if (entries[0].isIntersecting) {
            if (!$(image).attr("src")) {
              $(image).attr("src", $(image).data("src"));
            }
          }
        });
        io.observe(this);
      });
    } else {
      images.each(function() {
        $(this).attr("src", $(this).data("src"));
      });
    }
  }
  initLazyLoadImage();

  // post image fancybox
  $(".post-content")
    .find("img")
    .each(function() {
      var href = $(this).attr("src");
      $(this).replaceWith(
        $(
          '<a data-fancybox="gallery" href="' +
            href +
            '"><img src="' +
            href +
            '"></a>'
        )
      );
    });

  // post code snippet highlighting
  $(".post-content")
    .find("pre code")
    .each(function() {
      let classes = $(this).attr("class");
      if (classes) {
        classes = classes.split(" ");
        const lang = classes.find(item => item.startsWith("language-"));
        if (lang) {
          $(this)
            .closest("pre")
            .attr("data-language", lang.replace("language-", ""));
        }
        hljs.highlightBlock($(this)[0]);
      }
    });

  // post links
  $(".post-content")
    .find("p a")
    .each(function() {
      const href = $(this).attr("href");
      if (!href.startsWith("https://blog.bigdataboutique.com")) {
        $(this).attr("target", "_blank");
        $(this).attr("rel", "noopener nofollow");
      }
    });

  // reposition cta inside post page
  if ($("#postCTA").length && $(".post-content").length) {
    const postCTA = $("#postCTA");
    const h2 = $(".post-content h2");
    if (h2.length && h2.eq(0).index()) {
      // there's an h2 element inside post content
      // and it's not the first child
      postCTA.detach();
      postCTA.insertBefore(h2.eq(0));
    } else if ($(".post-content .excerpt").length) {
      postCTA.detach();
      postCTA.insertAfter($(".post-content .excerpt"));
    }
  }

  // cta
  $(".post-cta").each(async function() {
    const keywords = $(this).attr("data-keywords");
    if (keywords) {
      const response = await fetch(
        `https://bigdataboutique.com/b/ctas/${keywords.toLowerCase()}`
      );
      if (response.ok) {
        try {
          const { text } = await response.json();
          $(this)
            .find(".post-cta__text")
            .html(text);
        } catch (err) {
          // noop
        }
      }
    }
  });

  $("#addCommentButton").on("click", function() {
    $(".comments-widget__form-container").slideDown();
    $(this).detach();
  });

  $("input[name='referrer']").each(function() {
    $(this).val(document.referrer);
  });
});

function copyText(text) {
  const el = document.createElement("textarea");
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}
