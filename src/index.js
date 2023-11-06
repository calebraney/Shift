import SplitType from 'split-type';
import Lenis from '@studio-freight/lenis';
import { attr } from './utilities';
import { runSplit } from './utilities';
import Macy from 'macy';

document.addEventListener('DOMContentLoaded', function () {
  // Comment out for production
  // console.log('Local Script Loaded');

  //////////////////////////////
  // Global Variables
  // define variable for global use
  let mm = gsap.matchMedia();

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
  // const SCROLL_HEADING = '[gsap-scroll="heading"]';
  // const SCROLL_EL = '[gsap-scroll="el"]';
  // const SCROLL_CONTAINER = '[gsap-scroll="container"]';
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
      onComplete: () => {
        gsap.set(`${LOAD_GRID}`, { display: 'none' });
      },
    });
  };

  pageLoad();
  //////////////////////////////
  //LENIS Smoothscroll
  gsap.registerPlugin(ScrollTrigger);

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
  // On first click of nav stop scrolling
  function stopScroll() {
    lenis.stop();
  }
  // On second click of nav start scrolling
  function startScroll() {
    lenis.start();
  }

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
  // GSAP Animations

  //set global interaction defaults
  // gsap.defaults({
  //   duration: 0.6,
  //   ease: 'power1.out',
  // });

  // Page Transition
  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      let keepTransition = attr(true, this.getAttribute(LOAD_PREVENT_ATTR));
      if (
        this.hostname === window.location.host &&
        this.href.indexOf('#') === -1 &&
        this.target !== '_blank' &&
        keepTransition
      ) {
        e.preventDefault();
        console.log(keepTransition);
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
          console.log(DURATION_MS, 'out');
          window.location = destination;
        }, DURATION_MS);
      }
    });
  });

  const scrollTL = function (item) {
    // default GSAP options
    const defaults = {
      toggleActions: 'play none none none',
      scrub: true,
      start: 'top 90%',
      end: 'top 75%',
    };
    //override defaults if an attribute is present and a valid type.
    defaults.toggleActions = attr(defaults.toggleActions, item.getAttribute('gsap-toggle-actions'));
    defaults.scrub = attr(defaults.scrub, item.getAttribute('gsap-scrub'));
    defaults.start = attr(defaults.start, item.getAttribute('gsap-scroll-start'));
    defaults.end = attr(defaults.end, item.getAttribute('gsap-scroll-end'));
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: defaults.start,
        end: defaults.end,
        toggleActions: defaults.scrub ? 'none none none none' : defaults.toggleActions,
        scrub: defaults.scrub ? 0.5 : false,
      },
    });
    return tl;
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
    const loadingClass = 'is-loading';
    const macyContainer = document.querySelector(macyList);
    const filtersActive = macyContainer.hasAttribute('fs-cmsfilter-element');
    console.log(filtersActive);
    // exit if no list is found

    const addBlur = function () {
      const items = document.querySelectorAll(macyItem);
      items.forEach((item) => {
        if (!item || item.classList.contains(loadingClass)) return;
        item.classList.add(loadingClass);
      });
    };
    addBlur();

    const removeBlur = function () {
      const items = document.querySelectorAll(macyItem);
      items.forEach((item) => {
        if (!item || !item.classList.contains(loadingClass)) return;
        item.classList.remove(loadingClass);
      });
    };

    if (!macyContainer) return;
    const createGrid = function () {
      addBlur();
      if (macyInstance) {
        macyInstance.remove();
      }
      // macy instance
      macyInstance = Macy({
        container: macyList,
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
      // create the filters instance
      window.fsAttributes = window.fsAttributes || [];
      window.fsAttributes.push([
        'cmsfilter',
        (filterInstances) => {
          const [filterInstance] = filterInstances;
          // The `renderitems` event runs whenever the list renders items after filtering.
          filterInstance.listInstance.on('renderitems', (renderedItems) => {
            console.log('macy made');
            createGrid();
            removeBlur();
          });
        },
      ]);
    }
    if (!filtersActive) {
      createGrid();
      removeBlur();
    }
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
        if (isDesktop || isTablet) {
          macyGrid();
        }
        if (!reduceMotion) {
          clipHovers();
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

  // Update on window resize
  let windowWidth = window.innerWidth;
  window.addEventListener('resize', function () {
    if (window.innerWidth !== windowWidth) {
      windowWidth = window.innerWidth;
      gsap.matchMediaRefresh();
    }
  });
});
