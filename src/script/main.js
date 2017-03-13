'use strict';
const config = require('../../config.js');
import sample from 'lodash/sample';
import shuffle from 'lodash/shuffle';
import indexOf from 'lodash/indexOf';
require('./google-analytics');


function Gallery(photos) {
  let cursor = indexOf(photos, sample(photos));

  function next(options) {
    cursor = cursor + 1 > photos.length -1
      ? 0
      : cursor + 1;

    const img = new Image();
    img.onload = () => render(photos[cursor]);
    img.src = photos[cursor].url;
    setTimeout(next.bind(null, options), options.interval || 10000);
  }

  function render({url, description}) {
    document.querySelector('.header').style.backgroundImage = `url(${url})`;
    document.querySelector('.footer__copyright').innerText = description;
  }

  return {start: next};
}

const gallery = new Gallery(config.photos);
gallery.start({interval: 20000});


function BackgroundAnimation(el, interval){
  const State = {
    scale:{min:0.9, max: 1, cur:1, step: 0.1},
    rotateX:{min:-2, max:2, cur:0, step: 0.2},
    rotateY:{min:-10, max:10, cur:0, step: 0.2},
    rotateZ:{min:-2, max:2, cur:0, step: 0.2},
    translateX:{min:-40, max:40, cur:0, step: 4},
    translateY:{min:-40, max:40, cur:0, step: 4},
    posX:{min:0, max:100, cur:0, step: 10},
    posY:{min:0, max:100, cur:0, step: 10}
  };

  function apply(state){console
    el.style.transform = `scale(${state.scale.cur}) translateX(${state.translateX.cur}px) translateY(${state.translateY.cur}px) rotateX(${state.rotateX.cur}deg) rotateY(${state.rotateY.cur}deg) rotateZ(${state.rotateZ.cur}deg)`;
    el.style.backgroundPosition = `background-position: ${state.posX.cur}% ${state.posY.cur}%`;
  }

  apply(State);

  const findNextState = (function(){
    const keys = shuffle(Object.keys(State));

    return () => {
      let i = 3;
      while(i--){
        const k = sample(keys);
        const {min, max, cur, step} = State[k];
        State[k].cur = Math.max(Math.min(cur + (Math.random() > 0.5 ? 1:-1) * (Math.random()+0.5) * step, max), min);
      }
      apply(State);
      setTimeout(findNextState, interval);
    };
  })();

  setTimeout(findNextState, interval);
}

BackgroundAnimation(document.querySelector('.header'), 1500);
