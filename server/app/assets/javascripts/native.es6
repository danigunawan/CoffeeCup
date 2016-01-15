if (window.variant === 'native') {
  function ready() {
    $('a[target]').click((e, elem) => {
      e.preventDefault();
      let href = $(e.target).attr('href');
      window.location = `coffeecup://external?href=${encodeURIComponent(href)}`;
    });
    window.location.hash = (new Date).valueOf(); // Triggers stateChange on WebView.
  }

  $(document).ready(ready);
  $(document).on("page:load load", ready);
}
