document$.subscribe(() => {
  const toc = document.querySelector(".md-sidebar--secondary .md-nav--secondary");
  if (!toc) return;

  const items = Array.from(
    toc.querySelectorAll(":scope > .md-nav__list > .md-nav__item")
  );

  function getChild(item) {
    return item.querySelector(":scope > .md-nav");
  }

  function openItem(item) {
    const child = getChild(item);
    if (!child) return;
    item.classList.add("toc-open");
    child.style.display = "block";
  }

  function closeItem(item) {
    const child = getChild(item);
    if (!child) return;
    item.classList.remove("toc-open");
    child.style.display = "none";
  }

  function updateToc() {
    const active = toc.querySelector(".md-nav__link--active");

    items.forEach(closeItem);

    if (!active) return;

    const current = items.find((item) => item.contains(active));
    if (current) openItem(current);
  }

  items.forEach((item) => {
    const link = item.querySelector(":scope > .md-nav__link");
    const child = getChild(item);

    if (!link || !child) return;

    item.classList.add("toc-collapsible");
    child.style.display = "none";

    link.addEventListener("click", () => {
      openItem(item);
      setTimeout(updateToc, 100);
    });
  });

  updateToc();

  window.addEventListener("hashchange", () => {
    setTimeout(updateToc, 100);
  });

  let timer = null;
  const observer = new MutationObserver(() => {
    clearTimeout(timer);
    timer = setTimeout(updateToc, 80);
  });

  observer.observe(toc, {
    subtree: true,
    attributes: true,
    attributeFilter: ["class"],
  });
});