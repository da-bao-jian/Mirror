
import "./styles/index.scss";
import * as tf from '@tensorflow/tfjs';

const s = function( sketch ) {
    sketch.setup = function() {
      sketch.createCanvas(700, 410);
      sketch.background(0);
    };
  };    
  const myp5 = new p5(s);

