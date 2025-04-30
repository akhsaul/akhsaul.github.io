document.addEventListener("DOMContentLoaded", () => {
  const hamburgerButton = document.querySelector("#hamburger");
  const hamburgerTarget = document.querySelector(
    hamburgerButton.dataset.target
  );
  let isTransitioning = false;
  let isShown = false;

  hamburgerButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (isTransitioning) {
      return;
    }

    if (!isShown) {
      // show menu
      hamburgerTarget.classList.remove("collapse");
      hamburgerTarget.classList.add("collapsing");
      hamburgerTarget.style["height"] = 0;

      hamburgerButton.classList.toggle("collapsed", true);
      hamburgerButton.setAttribute("aria-expanded", true);

      isTransitioning = true;
      const complete = () => {
        isTransitioning = false;
        hamburgerTarget.classList.remove("collapsing");
        hamburgerTarget.classList.add("collapse", "show");
        hamburgerTarget.style["height"] = "";
        isShown = true;
      };
      setTimeout(complete, secondToMs(0.35));

      hamburgerTarget.style["height"] = hamburgerTarget["scrollHeight"] + "px";
    } else {
      // hide menu
      hamburgerTarget.style["height"] = `${
        hamburgerTarget.getBoundingClientRect()["height"]
      }px`;

      reflow(hamburgerTarget);

      hamburgerTarget.classList.add("collapsing");
      hamburgerTarget.classList.remove("collapse", "show");

      hamburgerButton.classList.toggle("collapsed", false);
      hamburgerButton.setAttribute("aria-expanded", false);

      isTransitioning = true;

      const complete = () => {
        isTransitioning = false;
        hamburgerTarget.classList.remove("collapsing");
        hamburgerTarget.classList.add("collapse");
        isShown = false;
      };

      hamburgerTarget.style["height"] = "";
      setTimeout(complete, secondToMs(0.35));
    }
  });
});
