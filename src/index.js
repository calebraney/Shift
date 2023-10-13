import SplitType from 'split-type';
import Lenis from '@studio-freight/lenis';

document.addEventListener('DOMContentLoaded', function () {
  //////////////////////////////
  // Global Variables
  // define variable for global use
  let mm = gsap.matchMedia();
  const links = document.querySelectorAll('a');
  const pageWrapper = document.querySelector('.page-wrapper');
  const pageMain = document.querySelector('.main-wrapper');
  const LOAD_GRID = '.load_grid';
  const LOAD_SQUARES = '.load_grid-item';
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

  // GSAP ANIMATIONS
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

  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (
        this.hostname === window.location.host &&
        this.href.indexOf('#') === -1 &&
        this.target !== '_blank'
      ) {
        e.preventDefault();
        let destination = this.getAttribute('href');
        let durationMS = TRANSITION_DURATION * 1000 + 100;
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
        }, durationMS);
      }
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
