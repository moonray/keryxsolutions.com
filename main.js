(function () {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, observerOptions);

    document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (event) {
        event.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          const navHeight = document.querySelector("nav").offsetHeight;
          const targetPosition = target.offsetTop - navHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      });
    });
  }

  function initInitialAnimations() {
    const elementsInView = document.querySelectorAll(".fade-in");
    elementsInView.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add("visible");
      }
    });
  }

  function applyCardBackgrounds() {
    const cardsWithBg = document.querySelectorAll(".tech-card-with-bg");
    cardsWithBg.forEach((card) => {
      const imagePath = card.getAttribute("data-image");
      if (imagePath) {
        card.style.backgroundImage = `url('${imagePath}')`;
      }
    });
  }

  function setupCarousel(config) {
    const {
      scrollContainer,
      cardContainer,
      leftBtn,
      rightBtn,
      cardSelector,
      defaultScrollAmount = 392,
      infinite = false,
    } = config;

    if (!scrollContainer || !cardContainer || !leftBtn || !rightBtn) {
      return;
    }

    let currentIndex = 0;
    let totalItems = 0;
    let duplicateCount = 0;
    let isTransitioning = false;

    if (infinite && cardContainer.dataset.duplicateCount) {
      duplicateCount = parseInt(cardContainer.dataset.duplicateCount, 10);
      totalItems = parseInt(cardContainer.dataset.totalItems, 10);
      currentIndex = duplicateCount;
    }

    const calculateScrollAmount = () => {
      const cards = cardContainer.querySelectorAll(cardSelector);
      if (cards.length > 0) {
        const card = cards[0];
        const cardWidth = card.offsetWidth;
        const computedStyle = window.getComputedStyle(cardContainer);
        const gap = parseInt(computedStyle.getPropertyValue("gap"), 10) || 20;
        return cardWidth + gap;
      }
      return defaultScrollAmount;
    };

    const updateButtonStates = () => {
      if (infinite) {
        leftBtn.disabled = false;
        rightBtn.disabled = false;
      } else {
        const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        leftBtn.disabled = scrollContainer.scrollLeft <= 0;
        rightBtn.disabled = scrollContainer.scrollLeft >= maxScroll - 2;
      }
    };

    const getCurrentIndex = () => {
      const scrollAmount = calculateScrollAmount();
      return Math.round(scrollContainer.scrollLeft / scrollAmount);
    };

    const scrollToIndex = (index, smooth = true) => {
      const scrollAmount = calculateScrollAmount();
      scrollContainer.scrollTo({
        left: index * scrollAmount,
        behavior: smooth ? "smooth" : "auto",
      });
      currentIndex = index;
    };

    const handleInfiniteLoop = (targetIndex, fromManualScroll = false) => {
      if (!infinite || isTransitioning) return;

      if (targetIndex < duplicateCount) {
        const realIndex = duplicateCount + totalItems + (targetIndex - duplicateCount);

        if (fromManualScroll) {
          scrollToIndex(realIndex, false);
          currentIndex = realIndex;
        } else {
          isTransitioning = true;
          setTimeout(() => {
            scrollToIndex(realIndex, false);
            currentIndex = realIndex;
            isTransitioning = false;
          }, 500);
        }
      } else if (targetIndex >= duplicateCount + totalItems) {
        const realIndex = duplicateCount + (targetIndex - duplicateCount - totalItems);

        if (fromManualScroll) {
          scrollToIndex(realIndex, false);
          currentIndex = realIndex;
        } else {
          isTransitioning = true;
          setTimeout(() => {
            scrollToIndex(realIndex, false);
            currentIndex = realIndex;
            isTransitioning = false;
          }, 500);
        }
      }
    };

    leftBtn.addEventListener("click", () => {
      if (infinite && !isTransitioning) {
        currentIndex--;
        scrollToIndex(currentIndex);
        handleInfiniteLoop(currentIndex);
      } else if (!infinite) {
        const scrollAmount = calculateScrollAmount();
        scrollContainer.scrollBy({
          left: -scrollAmount,
          behavior: "smooth",
        });
      }
      setTimeout(updateButtonStates, 500);
    });

    rightBtn.addEventListener("click", () => {
      if (infinite && !isTransitioning) {
        currentIndex++;
        scrollToIndex(currentIndex);
        handleInfiniteLoop(currentIndex);
      } else if (!infinite) {
        const scrollAmount = calculateScrollAmount();
        scrollContainer.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
      setTimeout(updateButtonStates, 500);
    });

    let scrollTimeout;
    let lastScrollIndex = -1;
    let lastScrollLeft = 0;
    let scrollDirection = 0;

    const isCardVisible = (cardIndex) => {
      const cards = cardContainer.querySelectorAll(cardSelector);
      if (!cards[cardIndex]) return false;

      const cardRect = cards[cardIndex].getBoundingClientRect();
      const containerRect = scrollContainer.getBoundingClientRect();

      return cardRect.left < containerRect.right && cardRect.right > containerRect.left;
    };

    const handleManualScroll = () => {
      if (!infinite || isTransitioning) return;

      const currentScrollLeft = scrollContainer.scrollLeft;
      if (currentScrollLeft < lastScrollLeft) {
        scrollDirection = -1;
      } else if (currentScrollLeft > lastScrollLeft) {
        scrollDirection = 1;
      }
      lastScrollLeft = currentScrollLeft;

      const scrolledIndex = getCurrentIndex();

      if (lastScrollIndex === scrolledIndex) return;

      if (scrollDirection === -1 && scrolledIndex <= duplicateCount + 1 && isCardVisible(duplicateCount)) {
        scrollToIndex(duplicateCount + totalItems, false);
        currentIndex = duplicateCount + totalItems;
        lastScrollIndex = duplicateCount + totalItems;
        return;
      } else if (
        scrollDirection === 1 &&
        scrolledIndex >= duplicateCount + totalItems - 2 &&
        isCardVisible(duplicateCount + totalItems - 1)
      ) {
        scrollToIndex(duplicateCount - 1, false);
        currentIndex = duplicateCount - 1;
        lastScrollIndex = duplicateCount - 1;
        return;
      }

      if (scrolledIndex < duplicateCount || scrolledIndex >= duplicateCount + totalItems) {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          if (getCurrentIndex() === scrolledIndex) {
            currentIndex = scrolledIndex;
            handleInfiniteLoop(scrolledIndex, true);
            lastScrollIndex = scrolledIndex;
          }
        }, 200);
        return;
      }

      lastScrollIndex = scrolledIndex;
    };

    scrollContainer.addEventListener("scroll", () => {
      updateButtonStates();
      handleManualScroll();
    });

    window.addEventListener("resize", () => {
      updateButtonStates();
    });

    updateButtonStates();

    if (infinite && duplicateCount > 0) {
      setTimeout(() => {
        scrollToIndex(duplicateCount, false);
      }, 0);
    }

    setTimeout(updateButtonStates, 100);
  }

  function initTechCarousel() {
    const scrollContainer = document.querySelector(".scroll-container");
    const techGrid = document.querySelector(".tech-grid");
    const scrollLeftBtn = document.getElementById("scroll-left");
    const scrollRightBtn = document.getElementById("scroll-right");

    setupCarousel({
      scrollContainer,
      cardContainer: techGrid,
      leftBtn: scrollLeftBtn,
      rightBtn: scrollRightBtn,
      cardSelector: ".tech-card",
      defaultScrollAmount: 392,
    });
  }

  function renderWorkGallery(items) {
    const workTrack = document.querySelector(".work-track");
    if (!workTrack) return;

    const cardsHTML = items
      .map(
        (item) => `
          <div class="embla__slide">
            <article class="work-card" aria-label="${item.project} for ${item.client}">
              <div class="work-picture">
                <img src="${item.image}" alt="${item.project}" width="340" height="190" />
              </div>
              <div class="work-copy">
                <h3 class="work-project">${item.project}</h3>
                <p class="work-client">${item.client}</p>
                <div class="work-details">
                  <p class="work-services">${item.services}</p>
                  <p class="work-stack">${item.stack}</p>
                </div>
              </div>
            </article>
          </div>
        `
      )
      .join("");

    workTrack.innerHTML = cardsHTML;
  }

  async function loadWorkItems() {
    try {
      const response = await fetch("resources/work-items.json");
      if (!response.ok) {
        throw new Error("Failed to load work items");
      }
      const items = await response.json();
      return items;
    } catch (error) {
      console.error("Error loading work items:", error);
      return [];
    }
  }

  function initWorkGallery() {
    loadWorkItems().then((items) => {
      if (!items.length) return;

      renderWorkGallery(items);

      const emblaNode = document.querySelector(".work-slider .embla__viewport");
      if (!emblaNode || typeof EmblaCarousel !== "function") return;

      const options = {
        loop: true,
        align: "center",
        containScroll: "trimSnaps",
        slidesToScroll: 1,
        skipSnaps: false,
      };
      const emblaApi = EmblaCarousel(emblaNode, options);

      const workLeftBtn = document.getElementById("work-left");
      const workRightBtn = document.getElementById("work-right");

      workLeftBtn?.addEventListener("click", () => emblaApi.scrollPrev());
      workRightBtn?.addEventListener("click", () => emblaApi.scrollNext());

      const updateActiveSlide = () => {
        const slides = emblaNode.querySelectorAll(".embla__slide");
        const selectedIndex = emblaApi.selectedScrollSnap();

        slides.forEach((slide, index) => {
          if (index === selectedIndex) {
            slide.classList.add("embla__slide--active");
          } else {
            slide.classList.remove("embla__slide--active");
          }
        });
      };

      emblaApi.on("select", updateActiveSlide);
      emblaApi.on("init", updateActiveSlide);
      updateActiveSlide();

      let scrollAccumulator = 0;
      let isScrolling = false;
      let scrollDirection = 0;

      emblaNode.addEventListener(
        "wheel",
        (event) => {
          if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
            event.preventDefault();

            scrollDirection = event.deltaX > 0 ? 1 : -1;
            scrollAccumulator += event.deltaX;

            if (!isScrolling) {
              isScrolling = true;
              requestAnimationFrame(function scrollStep() {
                if (Math.abs(scrollAccumulator) > 0.5) {
                  const scrollLength = emblaApi.scrollSnapList().length;
                  const currentProgress = emblaApi.scrollProgress();
                  const scrollDelta = scrollAccumulator / 2000;

                  let targetProgress = currentProgress + scrollDelta;

                  if (targetProgress < 0) targetProgress += 1;
                  if (targetProgress > 1) targetProgress -= 1;

                  const targetPosition = targetProgress * (scrollLength - 1);
                  let targetIndex;

                  if (scrollDirection > 0) {
                    targetIndex = Math.ceil(targetPosition);
                  } else {
                    targetIndex = Math.floor(targetPosition);
                  }

                  emblaApi.scrollTo(targetIndex, false);

                  scrollAccumulator *= 0.85;

                  requestAnimationFrame(scrollStep);
                } else {
                  scrollAccumulator = 0;
                  isScrolling = false;
                }
              });
            }
          }
        },
        { passive: false }
      );
    });
  }

  function initModal() {
    const modal = document.getElementById("appointment-modal");
    const modalOpeners = document.querySelectorAll(".open-modal");
    const closeModal = document.querySelector(".close-modal");

    if (!modal || !closeModal) return;

    modalOpeners.forEach((opener) => {
      opener.addEventListener("click", (event) => {
        event.preventDefault();
        modal.style.display = "block";
        document.body.classList.add("modal-open");
      });
    });

    closeModal.addEventListener("click", () => {
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
    });

    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
        document.body.classList.remove("modal-open");
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.style.display === "block") {
        modal.style.display = "none";
        document.body.classList.remove("modal-open");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initInitialAnimations();
    initScrollAnimations();
    initSmoothScroll();
    applyCardBackgrounds();
    initTechCarousel();
    initWorkGallery();
    initModal();
  });

  window.addEventListener("load", () => {
    document.body.style.opacity = "1";
  });
})();
