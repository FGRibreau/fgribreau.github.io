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
  return document.querySelector(selector);
}

function Gallery(photos) {
  let cursor = 3;

  function next(options) {
    cursor = cursor + 1 > photos.length -1
      ? 0
      : cursor + 1;

    const img = new Image();
    img.onload = () => render(photos[cursor]);
    img.src = photos[cursor].url;
  }

  function render({url, description}) {
    $('.header').style.backgroundImage = `url(${url})`;
    $('.footer__copyright').innerText = description;
  }

  return {next: next};
}

function BackgroundAnimation(el, interval){
  const State = {
    rotateX:{min:-10, max:10, cur:4, step: 2, render:(x) => `rotateX(${x}deg)`},
    rotateY:{min:-5, max:5, cur:3, step: 1, render:(x) => `rotateY(${x}deg)`},
    rotateZ:{min:-2, max:2, cur:0, step: 0.5, render:(x) => `rotateZ(${x}deg)`},
    translateX:{min:-5, max:5, cur:0, step: 1, render:(x) => `translateX(${x}%)`},
    translateZ:{min:-30, max:-10, cur:-10, step: 5, render:(x) => `translateZ(${x}vh)`},
  };

  function apply(state){
    el.style.transform = Object.keys(state).reduce((s, k) => {
      s += ' ' + state[k].render(state[k].cur);
      return s;
    }, '');
  }

  apply(State);

  const findNextState = (function(){
    const keys = shuffle(Object.keys(State));

    return () => {
      keys.forEach(k => {
        const {min, max, cur, step} = State[k];
        State[k].cur = Math.max(Math.min(cur + (Math.random() > 0.5 ? 1:-1) * step, max), min);
        State[k].cur = Math.max(Math.min((Math.random() > 0.5 ? 1:-1) * step, max), min);
        console.log(k, State[k].cur);
      })
      apply(State);
    };
  })();

  setTimeout(findNextState, interval);

  return {
    findNextState:findNextState
  };
}

// Testimonials
function Testimonials(_els, {onNextTestimonial, onNextPart}){
  const els = Array.from(_els);
  let elCursor = -1;

  els.forEach(hide);

  function hide(el){
    el.classList.add('--hide');
  }

  function show(el){
    el.classList.remove('--hide');
  }

  function nextTestimonial(){
    onNextTestimonial();
    elCursor = elCursor+1 > els.length-1 ? 0 : elCursor+1;
    const el = els[elCursor];
    show(el);

    const parts = $$('.part', el);
    parts.forEach(hide);

    function displayNextPart(previousPart){
      onNextPart();
      if(previousPart){
        hide(previousPart);
      }

      const part = parts.shift();
      if(!part){
        hide(el);
        setTimeout(nextTestimonial, 0);
        return;
      }

      show(part);
      const wait = Math.max(part.innerText.split(' ').length * 0.4 * 1000, 3000);
      setTimeout(displayNextPart.bind(null, part), wait);
    }

    displayNextPart();
  }

  nextTestimonial();
}

const {next} = Gallery(config.photos);
const {findNextState} = BackgroundAnimation(document.querySelector('.header'), 1500);

Testimonials($$('.testminials__testimonial'),{
  onNextPart: findNextState,
  onNextTestimonial: next,
});
