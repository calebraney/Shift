import SplitType from 'split-type';
import Lenis from '@studio-freight/lenis';
import { attr } from './utilities';
import { runSplit } from './utilities';
import Macy from 'macy';
import Swiper from 'swiper';

document.addEventListener('DOMContentLoaded', function () {
  // Comment out for production
  // console.log('Local Script Loaded');

  //////////////////////////////
  // Global Variables
  // define variable for global use
  let mm = gsap.matchMedia();

  gsap.registerPlugin(ScrollTrigger);
  gsap.registerPlugin(Flip);
  gsap.registerPlugin(TextPlugin);

  const links = document.querySelectorAll('a');
  const pageWrapper = document.querySelector('.page-wrapper');
  const pageMain = document.querySelector('.main-wrapper');
  const CLIP_DEFAULT = '[clip-default]';
  const CLIP_HOVER = '[clip-hover]';
  const LOAD_GRID = '.load_grid';
  const LOAD_SQUARES = '.load_grid-item';
  const LOAD_PREVENT_ATTR = '[prevent-transition]';
  const TRANSITION_DURATION = 0.3;

  //GSAP Selectors
  const resetGSAPTriggers = document.querySelectorAll('[gsap-reset]');
  // const LOAD_H1 = '[gsap-load="h1"]';
  // const LOAD_EL = '[gsap-load="el"]';
  const SCROLL_HEADING = '[gsap-scroll="heading"]';
  const SCROLL_EL = '[gsap-scroll="el"]';
  const SCROLL_CONTAINER = '[gsap-scroll="container"]';
  const SCROLL_STAGGER = '[gsap-scroll="stagger"]';
  const LOAD_H1 = '[gsap-load="h1"]';
  const LOAD_H2 = '[gsap-load="h2"]';
  const LOAD_ICON = '[gsap-load="icon"]';
  const LOAD_H2_WRAP = '[gsap-load="h2-wrap"]';
  const LOAD_ICON_WRAP = '[gsap-load="icon-wrap"]';
  const LOAD_TEXTURE = '[gsap-load="texture"]';

  // const SCROLL_LINE = '[gsap-scroll="line"';
  // const SCROLL_NUMBER = '[gsap-scroll="number"';
  // const SCROLL_REFRESH = '[scrolltrigger-refresh]';

  ///////////////////////////////
  //Page Load Animation
  const pageLoad = function () {
    // Code that runs on pageload
    gsap.to(`${LOAD_SQUARES}`, {
      opacity: 0,
      stagger: { amount: 0.5, duration: TRANSITION_DURATION, ease: 'power1.out', from: 'random' },
      onStart: () => {
        loadHome();
        loadHeader();
      },
      onComplete: () => {
        gsap.set(`${LOAD_GRID}`, { display: 'none' });
      },
    });
  };
  pageLoad();

  // const pageLoadFast = function () {
  //   // Code that runs on pageload
  //   gsap.set(`${LOAD_SQUARES}`, {
  //     opacity: 0,
  //   });
  //   gsap.set(`${LOAD_GRID}`, { display: 'none' });
  // };
  // pageLoadFast();

  // Page Transition
  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      let parentPrevent = this.closest(LOAD_PREVENT_ATTR);
      let preventTransition = false;
      if (parentPrevent) {
        preventTransition = attr(false, parentPrevent.getAttribute('prevent-transition'));
      }

      if (
        this.hostname === window.location.host &&
        this.href.indexOf('#') === -1 &&
        this.target !== '_blank' &&
        preventTransition === false
      ) {
        e.preventDefault();
        let destination = this.getAttribute('href');
        let DURATION_MS = TRANSITION_DURATION * 1000 + 500;
        gsap.set(`${LOAD_GRID}`, { display: 'grid' });
        gsap.fromTo(
          `${LOAD_SQUARES}`,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            stagger: {
              amount: 0.5,
              duration: TRANSITION_DURATION,
              ease: 'power1.out',
              from: 'random',
            }, //you can also try a from: "start" or "end" -- get creative!
            onComplete: function () {
              // console.log((window.location = destination));
            },
          }
        );
        setTimeout(function () {
          window.location = destination;
        }, DURATION_MS);
      }
    });
  });

  //////////////////////////////
  //LENIS Smoothscroll

  const lenis = new Lenis({
    duration: 1,
    easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)), // https://easings.net
    touchMultiplier: 1.5,
  });
  // lenis request animation from
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Keep lenis and scrolltrigger in sync
  lenis.on('scroll', () => {
    if (!ScrollTrigger) return;
    ScrollTrigger.update();
  });

  // allow scrolling on overflow elements
  //document.querySelector('.over--scroll').setAttribute("onwheel", "event.stopPropagation()");

  // Click Event Listener for Nav Button
  // let secondClick = false;
  // document.querySelector('.nav-button_component').addEventListener('click', () => {
  //   secondClick = !secondClick;

  //   if (secondClick) stopScroll();
  //   else startScroll();
  // });

  //////////////////////////////
  // Swiper Sliders
  const projectSlider = function () {
    const sliderComponent = '.slider-project_component';
    const sliderWrap = '.swiper';
    const nextButton = '.swiper-next';
    const previousButton = '.swiper-prev';
    const activeClass = 'is-active';
    const disabledClass = 'is-disabled';

    gsap.utils.toArray(sliderComponent).forEach(function (element) {
      nextButtonEl = element.querySelector(nextButton);
      previousButtonEl = element.querySelector(previousButton);
      if (!element || !nextButtonEl || !previousButtonEl) return;
      const swiper = new Swiper(element.querySelector(sliderWrap), {
        speed: 600,
        loop: true,
        drag: false,
        followFinger: false,
        freeMode: false,
        updateOnMove: true,
        rewind: false,
        breakpoints: {
          480: {
            slidesPerView: 1,
            spaceBetween: '0%',
          },
          768: {
            slidesPerView: 2,
            spaceBetween: '0%',
          },
          992: {
            slidesPerView: 3,
            spaceBetween: '0%',
          },
        },
        // navigation: {
        //   nextEl: nextButtonEl,
        //   prevEl: previousButtonEl,
        //   disabledClass: disabledClass,
        // },
        slideActiveClass: activeClass,
        slideDuplicateActiveClass: activeClass,
      });
      nextButtonEl.addEventListener('click', function () {
        swiper.slideNext();
      });
      previousButtonEl.addEventListener('click', function () {
        swiper.slidePrev();
      });
      // swiper.on('slideChange', function () {});
    });
  };

  const projectGallerySlider = function () {
    const sliderComponent = '.slider-gallery_component';
    const sliderWrap = '.swiper';
    const nextButton = '.swiper-next';
    const previousButton = '.swiper-prev';
    const activeClass = 'is-active';
    const disabledClass = 'is-disabled';

    gsap.utils.toArray(sliderComponent).forEach(function (element) {
      if (!element) return;
      nextButtonEl = element.querySelector(nextButton);
      previousButtonEl = element.querySelector(previousButton);
      const swiper = new Swiper(element.querySelector(sliderWrap), {
        speed: 600,
        loop: true,
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: '5%',
        initialSlide: 0,
        // clones: 2, // sets duplicates
        updateOnMove: true, // affects timing
        // autoplay: {
        //   delay: 4000,
        // },
        drag: true,
        followFinger: false,
        freeMode: false,
        rewind: false,
        slideActiveClass: activeClass,
        slideDuplicateActiveClass: activeClass,
      });
      nextButtonEl.addEventListener('click', function () {
        swiper.slideNext();
      });
      previousButtonEl.addEventListener('click', function () {
        swiper.slidePrev();
      });
      // swiper.on('slideChange', function () {});
    });
  };
  const projectGalleryCards = function () {
    const containers = document.querySelectorAll('.related-project_list');
    const ACTIVE_CLASS = 'is-active';
    containers.forEach(function (container) {
      const cards = container.querySelectorAll('.related-project_item');
      if (cards.length === 0 || !container) return;

      // add active class to first card
      const firstCard = cards[0];
      cards.forEach(function (card) {
        card.classList.remove(ACTIVE_CLASS);
      });
      firstCard.classList.add(ACTIVE_CLASS);

      cards.forEach((card) => {
        card.addEventListener('mouseenter', hoverEffectEnter);
        // card.addEventListener('mouseleave', hoverEffectLeave);
      });

      function hoverEffectEnter(e) {
        const el = e.target;
        cards.forEach(function (card) {
          card.classList.remove(ACTIVE_CLASS);
        });
        el.classList.add(ACTIVE_CLASS);
      }
    });
  };

  const projectGalleryCardsOld = function () {
    const cards = document.querySelectorAll('.related-project_item');
    const getRect = (element) => element.getBoundingClientRect();
    const container = document.querySelector('.related-project_list');
    const TEXT_CONTAINER = '.related-projects-card-text';
    const ACTIVE_CLASS = 'active';
    const containerRect = getRect(container);
    const cardRect = getRect(cards[0]);
    const staticCardWidth = cardRect.width;
    const cardGap = 16;

    if (cards.length === 0 || !container) return;

    cards.forEach((card) => {
      card.addEventListener('mouseenter', hoverEffectEnter);
      card.addEventListener('mouseleave', hoverEffectLeave);
    });

    const init = () => {
      const mouseoverEvent = new Event('mouseenter');

      cards[0].dispatchEvent(mouseoverEvent);
    };

    init();

    function hoverEffectEnter(e) {
      const el = e.target;

      const unfocusedCards = Array.from(cards).filter((card) => card !== el);
      const focusedCardInitialWidth = getRect(el).width;
      const focusedCardWidth = containerRect.width / 2 - cardGap;
      const unfocusedCardWidth = (containerRect.width / 2 - cardGap * 2) / 3;
      const textContainer = el.querySelector('.related-project_card-text');

      textContainer.style.width = focusedCardWidth - 32 + 'px';

      if (!el.classList.contains('active')) {
        el.animate(
          [
            {
              // Set the keyframes from the startHeight to endHeight
              width: focusedCardInitialWidth + 'px',
            },
            {
              // Set the keyframes from the startHeight to endHeight
              width: focusedCardWidth + 'px',
            },
          ],

          {
            duration: 400,
            easing: 'ease-out',
            fill: 'forwards',
          }
        );

        textContainer.animate(
          {
            opacity: 1,
            translate: '16px 0',
          },
          {
            duration: 200,
            easing: 'linear',
            fill: 'forwards',
            delay: 200,
          }
        );

        unfocusedCards.forEach((card) => {
          const cardWidth = getRect(card).width;
          const textContainer = card.querySelector(TEXT_CONTAINER);

          textContainer.animate(
            {
              opacity: 0,
            },
            {
              duration: 200,
              easing: 'linear',
              fill: 'forwards',
            }
          );

          card.animate(
            [
              {
                width: cardWidth + 'px',
              },
              {
                width: unfocusedCardWidth + 'px',
              },
            ],
            {
              duration: 400,
              easing: 'ease-out',
              fill: 'forwards',
            }
          );
        });
      }
      el.classList.add(ACTIVE_CLASS);
    }

    function hoverEffectLeave(e) {
      const firstCard = cards[0];

      const unfocusedCards = Array.from(cards).filter((card) => card !== firstCard);
      const focusedCardInitialWidth = getRect(firstCard).width;
      const focusedCardWidth = containerRect.width / 2 - cardGap;
      const unfocusedCardWidth = (containerRect.width / 2 - cardGap * 2) / 3;
      const textContainer = firstCard.querySelector(TEXT_CONTAINER);

      firstCard.animate(
        [
          {
            // Set the keyframes from the startHeight to endHeight
            width: focusedCardInitialWidth + 'px',
          },
          {
            // Set the keyframes from the startHeight to endHeight
            width: focusedCardWidth + 'px',
          },
        ],

        {
          duration: 400,
          easing: 'ease-out',
          fill: 'forwards',
        }
      );

      textContainer.animate(
        {
          opacity: 1,
          translate: '16px 0',
        },
        {
          duration: 200,
          easing: 'linear',
          fill: 'forwards',
          delay: 200,
        }
      );

      unfocusedCards.forEach((card) => {
        const cardWidth = getRect(card).width;
        const textContainer = card.querySelector(TEXT_CONTAINER);

        textContainer.animate(
          {
            opacity: 0,
          },
          {
            duration: 200,
            easing: 'linear',
            fill: 'forwards',
          }
        );

        card.animate(
          [
            {
              width: cardWidth + 'px',
            },
            {
              width: unfocusedCardWidth + 'px',
            },
          ],
          {
            duration: 400,
            easing: 'ease-out',
            fill: 'forwards',
          }
        );

        card.classList.remove(ACTIVE_CLASS);
      });
    }
  };

  const homeHeroSlider = function () {
    const sliderComponent = '.slider-home_component';
    const sliderWrap = '.swiper';
    const nextButton = '.swiper-next';
    const previousButton = '.swiper-prev';
    const activeClass = 'is-active';

    gsap.utils.toArray(sliderComponent).forEach(function (element) {
      if (!element) return;
      nextButtonEl = element.querySelector(nextButton);
      previousButtonEl = element.querySelector(previousButton);
      const swiper = new Swiper(element.querySelector(sliderWrap), {
        speed: 600,
        loop: true,
        clones: 2, // sets duplicates
        updateOnMove: true, // affects timing
        drag: true,
        followFinger: false,
        freeMode: false,
        slidesPerView: 1,
        spaceBetween: '0px',
        slideActiveClass: activeClass,
        slideDuplicateActiveClass: activeClass,
      });
      nextButtonEl.addEventListener('click', function () {
        swiper.slideNext();
      });
      previousButtonEl.addEventListener('click', function () {
        swiper.slidePrev();
      });
    });
  };

  //////////////////////////////
  // GSAP Animations

  const loadHeader = function () {
    const component = document.querySelector('[gsap-load="header"]');
    const h1 = document.querySelector(LOAD_H1);
    const h2 = document.querySelector(LOAD_H2);
    const h2WRap = document.querySelector(LOAD_H2_WRAP);
    const icon = document.querySelector(LOAD_ICON);
    const iconWrap = document.querySelector(LOAD_ICON_WRAP);
    const texture = document.querySelector(LOAD_TEXTURE);

    if (!component) return;

    const h1Text = runSplit(h1);
    const h2Text = runSplit(h2);
    const tl = gsap.timeline({
      delay: 0.4,
      defaults: {
        duration: 0.8,
        ease: 'power2.out',
      },
      onComplete: () => {
        h1Text.revert();
        h2Text.revert();
      },
    });
    tl.set(component, { opacity: 1 });
    tl.fromTo(
      texture,
      {
        x: '110%',
      },
      {
        x: '0%',
        duration: 0.6,
      }
    );
    tl.fromTo(
      iconWrap,
      {
        x: '-110%',
      },
      {
        x: '0%',
        duration: 0.6,
      },
      '<.1'
    );
    tl.fromTo(
      h2WRap,
      {
        y: '110%',
      },
      {
        y: '0%',
        duration: 0.6,
      },
      '<.1'
    );
    tl.fromTo(
      h1Text.words,
      {
        opacity: 0,
        rotateZ: -3,
        x: '2rem',
      },
      {
        opacity: 1,
        rotateZ: 0,
        x: '0rem',
        stagger: { each: 0.1, from: 'start' },
      },
      '<.3'
    );
    tl.fromTo(
      icon,
      {
        opacity: 0,
        rotateZ: 20,
        scale: 0.5,
      },
      {
        opacity: 1,
        rotateZ: 0,
        scale: 1,
      },
      '<.3'
    );
    tl.fromTo(
      h2Text.lines,
      {
        opacity: 0,
        rotateZ: -3,
        y: '2rem',
      },
      {
        opacity: 1,
        y: '0rem',
        rotateZ: 0,
        stagger: { each: 0.1, from: 'start' },
      },
      '<.3'
    );
  };
  const loadHome = function () {
    const component = document.querySelector('[gsap-load="home"]');
    const h1 = document.querySelectorAll(LOAD_H1);
    const h2 = document.querySelector(LOAD_H2);
    const h2WRap = document.querySelector(LOAD_H2_WRAP);
    const callout = document.querySelector('[gsap-load="callout"]');
    const slider = document.querySelector('[gsap-load="slider"]');
    if (!component) return;
    const tl = gsap.timeline({
      delay: 0.4,
      defaults: {
        duration: 0.8,
        ease: 'power2.out',
      },
    });
    tl.set(component, { opacity: 1 });
    tl.fromTo(
      h2WRap,
      {
        x: '-110%',
      },
      {
        x: '0%',
        duration: 0.6,
      }
    );
    tl.fromTo(
      slider,
      {
        y: '110%',
      },
      {
        y: '0%',
        duration: 0.6,
      },
      '<.1'
    );
    tl.fromTo(
      h1,
      {
        opacity: 0,
        rotateZ: -3,
        x: '2rem',
      },
      {
        opacity: 1,
        rotateZ: 0,
        x: '0rem',
        stagger: { each: 0.1, from: 'start' },
      },
      '<.3'
    );
    tl.fromTo(
      h2,
      {
        opacity: 0,
        rotateZ: -3,
        y: '2rem',
      },
      {
        opacity: 1,
        y: '0rem',
        rotateZ: 0,
      },
      '<.3'
    );
    tl.from(
      callout,
      {
        opacity: 0,
        rotateZ: 20,
        scale: 0.5,
      },
      {
        opacity: 1,
        rotateZ: 4,
        scale: 1,
      },
      '<.3'
    );
  };

  const navNews = function () {
    const navMarquees = gsap.utils.toArray('[nav-marquee]');
    if (navMarquees.length === 0) return;

    navMarquees.forEach(function (marquee) {
      let track = marquee.querySelector('[nav-marquee-track]');
      let items = marquee.querySelectorAll('[nav-marquee-item]');
      if (!track || items.length === 0) return;
      let tl = gsap.timeline({
        repeat: -1,
        defaults: { ease: 'expo.inOut', duration: 1, delay: 1 },
      });

      items.forEach(function (item, index) {
        let distance = (index + 1) * -100;
        tl.to(track, { yPercent: distance });
      });

      let clonedItem = items[0].cloneNode(true);
      track.appendChild(clonedItem);
    });
  };

  function homeHeroText() {
    const words = gsap.utils.toArray('[hero-text-item]');
    const textBox = document.querySelector('#hero-text-box');
    const textLine = document.querySelector('#hero-text-line');
    const activeClass = 'is-active';
    const updateLine = function () {
      setTimeout(function () {
        textLine.classList.add(activeClass);
      }, 500);
      setTimeout(function () {
        textLine.classList.remove(activeClass);
      }, 3000);
    };
    if (!textBox || words.length === 0) return;
    let tlHomeText = gsap.timeline({ repeat: -1, delay: 0 });
    tlHomeText.set(textBox, {
      text: '',
      duration: 1,
    });

    words.forEach((word, i) => {
      if (i != 0) {
        let tlText = gsap.timeline({
          repeat: 1,
          yoyo: true,
          repeatDelay: 2,
          onStart: updateLine,
        });
        tlText.to(textBox, { duration: 1, text: word.outerText });
        tlHomeText.add(tlText);
      }
    });

    let tlLastText = gsap.timeline({
      repeat: 1,
      yoyo: true,
      repeatDelay: 2,
      onStart: updateLine,
    });
    tlLastText.to(textBox, {
      duration: 1,
      text: words[0].outerText,
      onStart: updateLine,
    });
    tlHomeText.add(tlLastText);
  }

  const scrollTL = function (item) {
    // default GSAP options
    const settings = {
      scrub: false,
      toggleActions: 'play none none none',
      start: 'top 90%',
      end: 'top 75%',
    };
    //override settings if an attribute is present and a valid type.
    settings.toggleActions = attr(settings.toggleActions, item.getAttribute('gsap-toggle-actions'));
    settings.scrub = attr(settings.scrub, item.getAttribute('gsap-scrub'));
    settings.start = attr(settings.start, item.getAttribute('gsap-scroll-start'));
    settings.end = attr(settings.end, item.getAttribute('gsap-scroll-end'));
    const tl = gsap.timeline({
      defaults: {
        duration: 0.6,
        ease: 'power1.out',
      },
      scrollTrigger: {
        trigger: item,
        start: settings.start,
        end: settings.end,
        toggleActions: settings.toggleActions,
        scrub: settings.scrub,
      },
    });
    return tl;
  };

  const scrollHeading = function () {
    const items = gsap.utils.toArray(SCROLL_HEADING);
    items.forEach((item) => {
      const splitText = runSplit(item);
      if (!splitText) return;
      item.style.opacity = 1;
      const tl = scrollTL(item);
      tl.fromTo(
        splitText.words,
        {
          opacity: 0,
          x: '2rem',
        },
        {
          opacity: 1,
          x: '0rem',
          stagger: { each: 0.2, from: 'start' },
          onComplete: () => {
            splitText.revert();
          },
        }
      );
    });
  };

  const scrollEl = function () {
    const items = gsap.utils.toArray(SCROLL_EL);
    items.forEach((item) => {
      if (!item) return;
      item.style.opacity = 1;
      const tl = scrollTL(item);
      tl.fromTo(
        item,
        {
          opacity: 0,
          x: '2rem',
        },
        {
          opacity: 1,
          x: '0rem',
        }
      );
    });
  };

  const scrollContainer = function () {
    const items = gsap.utils.toArray(SCROLL_CONTAINER);
    items.forEach((item) => {
      if (!item) return;
      const children = gsap.utils.toArray(item.children);
      if (children.length === 0) return;
      children.forEach((child) => {
        const tl = scrollTL(child);
        tl.fromTo(
          child,
          {
            opacity: 0,
            y: '2rem',
          },
          {
            opacity: 1,
            y: '0rem',
          }
        );
      });
    });
  };

  const scrollStagger = function () {
    const items = gsap.utils.toArray(SCROLL_STAGGER);
    items.forEach((item) => {
      const children = gsap.utils.toArray(item.children);
      if (children.length === 0) return;
      const tl = scrollTL(item);
      tl.fromTo(
        children,
        {
          opacity: 0,
          y: '2rem',
        },
        {
          opacity: 1,
          y: '0rem',
          stagger: { each: 0.1, from: 'start' },
        }
      );
    });
  };

  // Clip Hover Animation
  const clipHovers = function () {
    const clipItems = document.querySelectorAll('[clip-parent]');
    clipItems.forEach(function (clipItem) {
      let clipHover = clipItem.querySelector(CLIP_HOVER);
      let clipDefault = clipItem.querySelector(CLIP_DEFAULT);
      // set duration
      let EASE = attr('power2.inOut', clipItem.getAttribute('clip-ease'));
      let DURATION_MS = attr(300, clipItem.getAttribute('clip-duration'));
      let DURATION = DURATION_MS / 1000;

      let tl = gsap.timeline({
        paused: true,
        defaults: { ease: 'none' },
      });

      if (clipHover) {
        tl.set(clipHover, { opacity: 1 });
        // step 1
        tl.fromTo(
          clipHover,
          { clipPath: 'polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%)' },
          {
            clipPath: 'polygon(100% 0%, 100% 100%, 80% 100%, 80% 100%, 100% 0%)',
            duration: DURATION * 0.1,
          }
        );
        //Step 2
        tl.to(clipHover, {
          clipPath: 'polygon(100% 0%, 100% 100%, 0% 100%, 0% 100%, 20% 0%)',
          duration: DURATION * 0.8,
        });
        //final step
        tl.to(clipHover, {
          clipPath: 'polygon(100% 0%, 100% 100%, 0% 100%, 0% 0%, 0% 0%)',
          duration: DURATION * 0.1,
        });
      }
      if (clipDefault) {
        tl.set(clipDefault, { opacity: 1 });
        tl.fromTo(
          clipDefault,
          { clipPath: 'polygon(100% 0%, 100% 100%, 100% 100%, 0% 100%, 0% 0%)' },
          {
            clipPath: 'polygon(100% 0%, 100% 0%, 80% 100%, 0% 100%, 0% 0%)',
            duration: DURATION * 0.1,
          },
          0
        );
        tl.to(
          clipDefault,
          {
            clipPath: 'polygon(20% 0%, 20% 0%, 0% 100%, 0% 100%, 0% 0%)',
            duration: DURATION * 0.8,
          },
          '>'
        );
        tl.to(
          clipDefault,
          {
            clipPath: 'polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%)',
            duration: DURATION * 0.1,
          },
          '>'
        );
      }
      // ease the entire timeline
      let animation = gsap.to(tl, {
        time: tl.duration(),
        paused: true,
        duration: tl.duration(),
        ease: EASE,
      });

      clipItem.addEventListener('mouseenter', function () {
        animation.play();
      });

      clipItem.addEventListener('mouseleave', function () {
        animation.reverse();
      });
    });
  };

  //////////////////////////////
  //Macy JS Grid

  const macyGrid = function () {
    let macyInstance;
    const macyList = '[macy-list]';
    const macyItem = '[macy-item]';
    const macyContainer = document.querySelector(macyList);
    if (!macyContainer) return;
    const filtersActive = macyContainer.hasAttribute('fs-cmsfilter-element');
    // exit if no list is found

    if (!macyContainer) return;
    const createGrid = function () {
      if (macyInstance) {
        macyInstance.remove();
      }
      // macy instance
      macyInstance = Macy({
        container: macyList,
        // waitForImages: false,
        margin: 48,
        columns: 3,
        breakAt: {
          991: 3,
          767: 2,
          479: 1,
        },
      });
    };
    // if filters are active wait for list instance to load before creating macy
    if (filtersActive) {
      createGrid();
      // create the filters instance
      window.fsAttributes = window.fsAttributes || [];
      window.fsAttributes.push([
        'cmsfilter',
        (filterInstances) => {
          // console.log('cmsfilter Successfully loaded!');
          const [filterInstance] = filterInstances;
          // The `renderitems` event runs whenever the list renders items after filtering.
          filterInstance.listInstance.on('renderitems', (renderedItems) => {
            // macyInstance.recalculate(true);
            createGrid();
            setTimeout(function () {
              macyInstance.recalculate(true);
            }, 300);
          });
        },
      ]);
      // load instance
      window.fsAttributes.push([
        'cmsload',
        (listInstances) => {
          // The callback passes a `listInstances` array with all the `CMSList` instances on the page.
          const [listInstance] = listInstances;
          // The `renderitems` event runs whenever the list renders items after switching pages.
          listInstance.on('renderitems', (renderedItems) => {
            macyInstance.recalculate(true);
          });
        },
      ]);
    }
    if (!filtersActive) {
      createGrid();
      setTimeout(function () {
        macyInstance.recalculate(true);
      }, 400);
    }
    //recalculate after images are loaded
    document.addEventListener('load', () => {
      macyInstance.recalculate(true);
    });
  };

  // Run these scripts on page reset
  const gsapInit = function () {
    mm.add(
      {
        //This is the conditions object
        isMobile: '(max-width: 767px)',
        isTablet: '(min-width: 768px)  and (max-width: 991px)',
        isDesktop: '(min-width: 992px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        let { isMobile, isTablet, isDesktop, reduceMotion } = context.conditions;
        // remove these animations if reduce motion is set
        projectSlider();
        homeHeroSlider();
        projectGallerySlider();
        navNews();
        homeHeroText();
        if (isDesktop || isTablet) {
          macyGrid();
          // projectGalleryCardsOld();
          projectGalleryCards();
        }
        if (!reduceMotion) {
          clipHovers();
          scrollHeading();
          scrollEl();
          scrollContainer();
          scrollStagger();
        }
      }
    );
  };
  gsapInit();

  //reset gsap on click of reset triggers
  resetGSAPTriggers.forEach(function (item) {
    item.addEventListener('click', function (e) {
      gsapInit();
    });
  });

  // this was causing long text to flicker during resizing so I tried turning it off, can turn it back on again if needed
  // Update on window resize
  //   let windowWidth = window.innerWidth;
  //   window.addEventListener('resize', function () {
  //     if (window.innerWidth !== windowWidth) {
  //       windowWidth = window.innerWidth;
  //       gsap.matchMediaRefresh();
  //     }
  //   });
});
