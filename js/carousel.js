const findActiveAttribute = (elements, whenFound) => {
  let element = undefined;
  for (let index = 0; index < elements.length; index++) {
    element = elements[index];
    if (element.classList.contains("active")) {
      if (whenFound) {
        whenFound(element, index);
      }
      break;
    }
  }
  return element;
};

const getNextItem = (items, shouldGetNext, currentIndex) => {
  if (!isValid(items)) {
    return;
  }
  const lastIndex = items.length - 1;
  if (currentIndex === -1 || currentIndex > lastIndex) {
    // return next element or previous element
    if (shouldGetNext) {
      return { item: items[0], index: 0 };
    } else {
      return { item: items[lastIndex], index: lastIndex };
    }
  }

  let index = currentIndex + (shouldGetNext ? 1 : -1);
  index = (index + items.length) % items.length;
  index = Math.max(0, Math.min(index, lastIndex));

  return { item: items[index], index: index };
};

const findActiveItem = (items, shouldGetNext) => {
  // need at least 2 items
  if (items.length < 2) {
    return;
  }
  let activeIndex = 0;
  let activeItem = items[activeIndex];
  let nextItem = items[1];
  findActiveAttribute(items, (item, index) => {
    activeIndex = index;
    activeItem = item;
    nextItem = getNextItem(items, shouldGetNext, index);
  });
  return {
    active: activeItem,
    activeIndex: activeIndex,
    next: nextItem.item,
    nextIndex: nextItem.index,
  };
};

const setActiveIndicator = (indicators, activeIndex) => {
  if (!isValid(indicators) || !isValid(activeIndex)) {
    return;
  }
  if (indicators.length == 0 || activeIndex > indicators.length - 1) {
    return;
  }

  indicators.forEach((indicator, index) => {
    if (indicator.classList.contains("active")) {
      indicator.classList.remove("active");
      indicator.removeAttribute("aria-current");
    }
    if (indicator.dataset.slideTo) {
      const slideTo = parseInt(indicator.dataset.slideTo);
      if (slideTo === activeIndex) {
        indicator.classList.add("active");
        indicator.setAttribute("aria-current", true);
      }
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const ORDER_PREV = "prev";
  const ORDER_NEXT = "next";
  const carousels = document.querySelectorAll(".carousel");

  carousels.forEach((carousel) => {
    const carouselIndicators = carousel.querySelectorAll(
      ".carousel-indicators>button"
    );
    const carouselItems = carousel.querySelectorAll(
      ".carousel-inner>.carousel-item"
    );
    const carouselPrevButton = carousel.querySelector(
      "button.carousel-control-prev"
    );
    const carouselNextButton = carousel.querySelector(
      "button.carousel-control-next"
    );

    let isRunning = false;
    let isSliding = false;
    let intervalId = null;
    const isAutoSlide = strToBoolean(carousel.dataset.auto);
    let isMouseInside = false;

    const slide = (order, specifiedItem = null, specifiedIndex = null) => {
      if (isSliding) {
        return;
      }
      if (!isValid(order)) {
        return;
      }
      if (order !== ORDER_PREV && order !== ORDER_NEXT) {
        return;
      }

      // carousel is not visible then don't animate
      if (!isVisible(carousel, true)) {
        return;
      }
      const isNext = order === ORDER_NEXT;
      const activeItem = findActiveItem(carouselItems, isNext);
      const activeElement = activeItem.active;
      const nextElement = specifiedItem || activeItem.next;

      if (activeElement === nextElement) {
        return;
      }

      isSliding = true;

      // set next indicator to be active
      setActiveIndicator(
        carouselIndicators,
        specifiedIndex || activeItem.nextIndex
      );

      const directionalClassName = isNext
        ? "carousel-item-start"
        : "carousel-item-end";
      const orderClassName = isNext
        ? "carousel-item-next"
        : "carousel-item-prev";

      nextElement.classList.add(orderClassName);
      reflow(nextElement);
      activeElement.classList.add(directionalClassName);
      nextElement.classList.add(directionalClassName);

      const complete = () => {
        nextElement.classList.remove(directionalClassName, orderClassName);
        nextElement.classList.add("active");
        activeElement.classList.remove(
          "active",
          orderClassName,
          directionalClassName
        );
        isSliding = false;
      };
      setTimeout(complete, secondToMs(0.6));
    };

    const slideNext = () => {
      if (isRunning) {
        return;
      }

      isRunning = true;
      slide(ORDER_NEXT);
      isRunning = false;
    };

    const slidePrev = () => {
      if (isRunning) {
        return;
      }

      isRunning = true;
      slide(ORDER_PREV);
      isRunning = false;
    };

    const startCycle = () => {
      let interval = secondToMs(1);
      const datasetInterval = parseInt(carousel.dataset.interval);
      if (!isNaN(datasetInterval)) {
        // interval can be seconds or miliseconds
        if (datasetInterval > interval) {
          interval = datasetInterval;
        } else {
          interval = secondToMs(datasetInterval);
        }
      }
      let order = ORDER_NEXT;
      if (carousel.dataset.order === ORDER_PREV) {
        order = ORDER_PREV;
      }

      if (isRunning || intervalId !== null || isMouseInside) {
        return;
      }

      isRunning = true;
      // slide first
      slide(order);
      // then
      // auto slide when interval reached
      intervalId = setInterval(() => {
        slide(order);
      }, interval);
    };

    const stopCycle = () => {
      if (intervalId === null) {
        return;
      }
      clearInterval(intervalId);
      isRunning = false;
      intervalId = null;
    };

    carousel.addEventListener("mouseenter", () => {
      isMouseInside = true;
      if (isAutoSlide) {
        stopCycle();
      }
    });
    carousel.addEventListener("mouseleave", () => {
      isMouseInside = false;
      if (isAutoSlide) {
        startCycle();
      }
    });

    carouselIndicators.forEach((indicator) => {
      indicator.addEventListener("click", () => {
        const indexItem = parseInt(indicator.dataset.slideTo);
        if (indexItem < carouselItems.length && indexItem >= 0) {
          let order = ORDER_NEXT;
          if (carousel.dataset.order === ORDER_PREV) {
            order = ORDER_PREV;
          }
          const item = carouselItems[indexItem];
          slide(order, item, indexItem);
        }
      });
    });

    carouselNextButton.addEventListener("click", slideNext);
    carouselPrevButton.addEventListener("click", slidePrev);

    if (isAutoSlide) {
      let firstTimeLoad = true;
      // if carousel visible on DOM loaded
      // then cycle it
      if (isVisible(carousel, true) && !isMouseInside && firstTimeLoad) {
        // sometime browser need more time
        // just to load image/render ui
        setTimeout(startCycle, secondToMs(5));
        firstTimeLoad = false;
      } else {
        // auto start or stop when carousel is not visible
        window.addEventListener("scroll", () => {
          if (isVisible(carousel, true) && !isMouseInside) {
            if (firstTimeLoad) {
              // sometime browser need longer time
              // just to load image/render ui
              setTimeout(startCycle, secondToMs(5));
              firstTimeLoad = false;
            } else {
              startCycle();
            }
          } else {
            stopCycle();
          }
        });
      }
    }
  });
});
