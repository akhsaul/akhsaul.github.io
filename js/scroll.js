document.addEventListener("DOMContentLoaded", () => {
  const menuElements = [];
  const targetElements = [];

  const menus = document.querySelectorAll("nav a.nav-link");
  // Populate all menu and targeted elements
  menus.forEach((menu) => {
    if (isValid(menu.href)) {
      const index = menu.href.indexOf("#");
      if (index !== -1) {
        const targetId = menu.href.substring(index);
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElements.push(targetElement);
          menuElements.push(menu);
        } else {
          console.log(`Target element with ID "${targetId}" not found.`);
        }
      } else {
        console.log("No target ID found in href");
      }
    }
  });

  window.addEventListener("scroll", () => {
    // if empty, don't do anything
    if (targetElements.length === 0) {
      return;
    }

    let activeIndex = -1;
    const currentPosition =
      document.documentElement.scrollTop || window.scrollY;

    for (let index = 0; index < targetElements.length; index++) {
      const element = targetElements[index];
      // add 5% error viewport
      if (currentPosition >= getOffset(element)) {
        activeIndex = index;
      } else {
        break;
      }
    }

    menuElements.forEach((menu, index) => {
      // Hapus kelas dari semua menu
      menu.classList.remove("active");
      // Tambahkan kelas ke menu yang sesuai dengan target yang aktif
      if (activeIndex !== -1 && index === activeIndex) {
        menu.classList.add("active");
      }
    });
  });

  // Dispatch scroll event for first time on DOM loaded
  if (document.documentElement.scrollTop > 0) {
    window.dispatchEvent(new Event("scroll"));
  } else {
    // Click first menu
    if (menuElements.length >= 1) {
      const firstMenu = menuElements[0];
      firstMenu.addEventListener(
        "click",
        (e) => {
          e.preventDefault();
          window.dispatchEvent(new Event("scroll"));
        },
        { once: true }
      );
      firstMenu.click();
    }
  }

  // Event listener resize, for handling viewport changes
  window.addEventListener("resize", () => {
    window.dispatchEvent(new Event("scroll"));
  });
});
