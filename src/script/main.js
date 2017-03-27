'use strict';
const config = require('../../config.js');
import sample from 'lodash/sample';
import shuffle from 'lodash/shuffle';
import indexOf from 'lodash/indexOf';
import noop from 'lodash/noop';
require('./google-analytics');

function $$(selector, el = document){
  return Array.from(el.querySelectorAll(selector));
}

function $(selector){
  const el =  document.querySelector(selector);

  const wrap = {
    0: el,
    tap: (f) => {
      f(el);
      return wrap;
    }
  };

  return wrap;
}

function Gallery(photos, cursor = 3) {

  function next(options) {
    cursor = cursor + 1 > photos.length -1
      ? 0
      : cursor + 1;

    const img = new Image();
    img.onload = () => render(photos[cursor]);
    img.src = photos[cursor].url;
  }

  function render({url, description}) {
    $('.header')[0].style.backgroundImage = `url(${url})`;
    $('.footer__copyright')[0].innerText = description;
  }

  return {next: next};
}

function BackgroundAnimation(el, interval){
  const State = {
    rotateX:{min:-10, max:10, cur:4, step: 2, render:(x) => `rotateX(${x}deg)`},
    rotateY:{min:-5, max:5, cur:3, step: 2, render:(x) => `rotateY(${x}deg)`},
    rotateZ:{min:-2, max:2, cur:0, step: 1, render:(x) => `rotateZ(${x}deg)`},
    translateX:{min:-5, max:5, cur:0, step: 1, render:(x) => `translateX(${x}%)`},
    translateZ:{min:-30, max:-10, cur:-10, step: 5, render:(x) => `translateZ(${x}vh)`},
  };

  function apply(state){
    el.style.transform = Object.keys(state).reduce((s, k) => {
      s += ' ' + state[k].render(state[k].cur);
      return s;
    }, '');
  }

  const findNextState = (function(){
    const keys = shuffle(Object.keys(State));

    return () => {
      keys.forEach(k => {
        const {min, max, step} = State[k];
        State[k].cur = Math.max(Math.min((Math.random() > 0.5 ? 1:-1) * step, max), min);
      })
      apply(State);
    };
  })();

  return {
    findNextState:findNextState
  };
}


// Testimonials
const hide = (el) => el.classList.add('hidden');
const show = (el) => el.classList.remove('hidden');

function Testimonials(els, {onNextTestimonial, onNextPart}){
  const _els = Array.from(els);
  let _cursor = -1;
  let _nextTimeout;

  _els.forEach(hide);

  let next = noop;

  function nextTestimonial(){
    onNextTestimonial();
    _cursor = _cursor+1 > _els.length-1 ? 0 : _cursor+1;
    const el = _els[_cursor];
    show(el);

    const parts = $$('.part', el);
    parts.forEach(hide);

    displayNextPart(el, parts);
  }

  function displayNextPart(el, parts, previousPart){
    clearTimeout(_nextTimeout);
    onNextPart();

    if(previousPart){
      hide(previousPart);
    }

    const part = parts.shift();
    if(!part){
      hide(el);
      el = null;
      parts = null;
      previousPart = null;
      _nextTimeout = setTimeout(nextTestimonial, 0);
      return;
    }

    show(part);
    const wait = Math.max(part.innerText.split(' ').length * 0.4 * 1000, 3000);
    next = displayNextPart.bind(null, el, parts, part);
    _nextTimeout = setTimeout(next, wait);
  }

  nextTestimonial();

  return {
    next: () => next()
  };
}

// Bootstraping
const {next: nextPhoto} = Gallery(config.photos, 0);
const {findNextState: nextBackgroundAnimation} = BackgroundAnimation($('.header')[0], 1500);
const {next: nextSlide} = Testimonials($$('.testminials__testimonial'),{
  onNextPart: nextBackgroundAnimation,
  onNextTestimonial: nextPhoto,
});

// UI interactions
$('.header')[0].addEventListener('click', nextSlide, false);
document.addEventListener('keydown', nextSlide, false)
