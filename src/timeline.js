const Plugin = () => {
  const disabledClass = "disabled";
  const scrolling = 280;

  // SET EQUAL HEIGHTS
  function setEqualHeights(el) {
    let counter = 0;
    for (let i = 0; i < el.length; i++) {
      const singleHeight = parseInt(
        window.getComputedStyle(el[i]).getPropertyValue("height")
      );

      if (counter < singleHeight) {
        counter = singleHeight;
      }
    }

    for (let i = 0; i < el.length; i++) {
      el[i].style.height = `${counter}px`;
    }
  }

  // CHECK IF AN ELEMENT IS IN VIEWPORT
  function isElementInViewport(el) {
    const pRect = document.querySelector(".slides").getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    return rect.left >= pRect.left && rect.right <= pRect.right;
  }

  // SET STATE OF PREV/NEXT ARROWS
  function setBtnState(el, flag = true) {
    if (flag) {
      el.classList.add(disabledClass);
    } else {
      if (el.classList.contains(disabledClass)) {
        el.classList.remove(disabledClass);
      }
      el.disabled = false;
    }
  }

  // ANIMATE TIMELINE
  function animateTl(arrows, tl) {
    const firstItem = tl.querySelector("li:first-child"),
      lastItem = tl.querySelector("li:last-child"),
      el = arrows.querySelectorAll(".arrow"),
      arrowPrev = arrows.querySelector(".arrow__prev"),
      arrowNext = arrows.querySelector(".arrow__next");
    let counter = 0;
    for (let i = 0; i < el.length; i++) {
      el[i].addEventListener("click", function () {
        if (!arrowPrev.disabled) {
          arrowPrev.disabled = true;
        }
        if (!arrowNext.disabled) {
          arrowNext.disabled = true;
        }
        const sign = this.classList.contains("arrow__prev") ? "" : "-";
        if (counter === 0) {
          tl.style.transform = `translateX(-${scrolling}px)`;
        } else {
          const tlStyle = getComputedStyle(tl);
          // add more browser prefixes if needed here
          const tlTransform =
            tlStyle.getPropertyValue("-webkit-transform") ||
            tlStyle.getPropertyValue("transform");
          const values =
            parseInt(tlTransform.split(",")[4]) +
            parseInt(`${sign}${scrolling}`);
          tl.style.transform = `translateX(${values}px)`;
        }

        setTimeout(() => {
          isElementInViewport(firstItem)
            ? setBtnState(arrowPrev)
            : setBtnState(arrowPrev, false);
          isElementInViewport(lastItem)
            ? setBtnState(arrowNext)
            : setBtnState(arrowNext, false);
        }, 1100);

        counter++;
      });
    }
  }

  return {
    id: "timeline",
    init: function (reveal) {
      reveal.on("slidechanged", (event) => {
        const element = event.currentSlide;
        if (
          element.classList.contains("timeline") &&
          !element.dataset.isTlInited
        ) {
          const timeline = element.querySelector(".timeline ol"),
            elH = element.querySelectorAll(".timeline li > div"),
            arrows = element.querySelector(".timeline .arrows");
          setEqualHeights(elH);
          element.dataset.isTlInited = true;
          animateTl(arrows, timeline);
        }
      });
    },
  };
};

export default Plugin;
