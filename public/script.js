$(function() {
  var stickyNav = function() {
    if ($(window).scrollTop()) {
      $(".navbar-container").addClass("sticky-navbar");
    } else {
      $(".navbar-container").removeClass("sticky-navbar");
    }
  };

  stickyNav();
  $(window).on("resize", stickyNav);
  $(window).scroll(stickyNav);

  $("pre code").each(function() {
    const classes = $(this)
      .attr("class")
      .split(" ");
    const lang = classes.find(item => item.startsWith("language-"));
    if (lang) {
      $(this)
        .closest("pre")
        .attr("data-language", lang.replace("language-", ""));
    }
    hljs.highlightBlock($(this)[0]);
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
