(() => {
  const FOR_YOU_LABELS = ["おすすめ", "For you"];

  const findHomeTabs = () => {
    const column = document.querySelector('[data-testid="primaryColumn"]');
    if (!column) return [];
    return [...column.querySelectorAll('[role="tablist"] [role="tab"]')];
  };

  const apply = () => {
    const root = document.documentElement;
    if (location.pathname !== "/home") {
      root.removeAttribute("data-xhr-foryou");
      return;
    }

    const tabs = findHomeTabs();
    const forYou = tabs.find((t) => FOR_YOU_LABELS.includes(t.innerText.trim()));
    if (!forYou) return;

    // タブ本体の外枠 (role=presentation) ごと隠す
    const wrapper = forYou.closest('[role="presentation"]') || forYou;
    if (wrapper.dataset.xhrHidden !== "true") wrapper.dataset.xhrHidden = "true";

    if (forYou.getAttribute("aria-selected") === "true") {
      root.setAttribute("data-xhr-foryou", "true");
      const following = tabs.find((t) => t !== forYou);
      if (following) following.click();
    } else {
      root.removeAttribute("data-xhr-foryou");
    }
  };

  let scheduled = false;
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      apply();
    });
  };

  new MutationObserver(schedule).observe(document, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["aria-selected"],
  });
  schedule();
})();
