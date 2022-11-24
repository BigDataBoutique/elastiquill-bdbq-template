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

  function initModalListener() {
    $(".modal").on("show.bs.modal", function() {
      $("header .navbar-container").css("right", getScrollBarWidth());
    });
    $(".modal").on("hidden.bs.modal", function() {
      $("header .navbar-container").css("right", 0);
    });
  }
  initModalListener();

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

  // post cta
  $(".post-cta").each(async function() {
    const keywords = $(this).attr("data-keywords");
    if (keywords) {
      const response = await fetch(
        `https://bigdataboutique.com/b/ctas/${keywords}`
      );
      if (response.ok) {
        try {
          const { text } = await response.json();
          $(this)
            .find(".text")
            .html(text);
        } catch (err) {
          // noop
        }
      }
    }
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
