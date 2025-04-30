const isValid = (value) => {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === "string" && value.trim() === "") {
    return false;
  }
  if (Array.isArray(value) && value.length === 0) {
    return false;
  }
  return true;
};

/**
 * Trick to restart an element's animation
 *
 * @param {HTMLElement} element
 * @return void
 *
 * @see https://www.harrytheo.com/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
 */
const reflow = (element) => {
  element.offsetHeight;
};

const secondToMs = (second) => {
  const durationPadding = 5;
  return second * 1000 + durationPadding;
};

const getOffset = (element) => {
  const finalStyle = element.computedStyleMap();
  const marginTop = parseFloat(finalStyle.get("margin-top")) || 0;
  const paddingTop = parseFloat(finalStyle.get("padding-top")) || 0;

  return element.offsetTop - (marginTop + paddingTop) / 2;
};

const isVisible = (element, navCalc) => {
  let navbarHeight = 0;
  // calculate navbar if requested
  if (navCalc) {
    const navBar = document.querySelector("nav");
    if (navBar) {
      const position = navBar.computedStyleMap().get("position").value;
      if (position === "fixed") {
        navbarHeight = navBar.getBoundingClientRect().height;
      }
    }
  }

  const rect = element.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > navbarHeight;
};

const strToBoolean = (str) => {
  if (typeof str !== "string") {
    return false;
  }
  const lowerStr = str.toLowerCase().trim();
  return lowerStr === "true";
};
