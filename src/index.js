import SplitType from 'split-type';
import Lenis from '@studio-freight/lenis';
import { attr } from './utilities';

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
  const clipItems = document.querySelectorAll('[clip-parent]');
  const CLIP_DEFAULT = '[clip-default]';
  const CLIP_HOVER = '[clip-hover]';
  const LOAD_GRID = '.load_grid';
  const LOAD_SQUARES = '.load_grid-item';
  const LOAD_PREVENT_ATTR = '[prevent-load]';
  const TRANSITION_DURATION = 0.35;

  //GSAP Selectors
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
      stagger: { amount: 0.5, duration: TRANSITION_DURATION, from: 'random' },
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
  gsap.defaults({
    duration: 0.6,
    ease: 'power1.out',
  });

  // Page Transition
  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (
        this.hostname === window.location.host &&
        this.href.indexOf('#') === -1 &&
        this.target !== '_blank' &&
        !this.hasAttribute(LOAD_PREVENT_ATTR)
      ) {
        e.preventDefault();
        let destination = this.getAttribute('href');
        let DURATION_MS = TRANSITION_DURATION * 1000 + 100;
        gsap.set(`${LOAD_GRID}`, { display: 'grid' });
        gsap.fromTo(
          `${LOAD_SQUARES}`,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            stagger: { amount: 0.5, duration: TRANSITION_DURATION, from: 'random' }, //you can also try a from: "start" or "end" -- get creative!
            // onComplete: function () {
            //   window.location = destination;
            // },
          }
        );
        setTimeout(function () {
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
  clipItems.forEach(function (clipItem) {
    let clipHover = clipItem.querySelector(CLIP_HOVER);
    let clipDefault = clipItem.querySelector(CLIP_DEFAULT);
    //return if elements aren't fount
    if (!clipHover) return;
    // set duration
    let EASE = attr('power2.inOut', clipItem.getAttribute('clip-ease'));
    let DURATION_MS = attr(300, clipItem.getAttribute('clip-duration'));
    let DURATION = DURATION_MS / 1000;

    let tl = gsap.timeline({
      paused: true,
      defaults: { ease: 'none' },
    });
    tl.set(clipDefault, { opacity: 1 });
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
    if (clipDefault) {
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

  //split text utility
  const runSplit = function (text) {
    typeSplit = new SplitType(text, {
      types: 'lines, words',
    });
    return typeSplit;
  };
});
