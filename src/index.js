import "./styles/index.scss"
import * as tf from '@tensorflow/tfjs'
import { fill } from "@tensorflow/tfjs";
import * as p5 from 'p5'

// function setUp(){
    // tf.tensor([1,2,3,4]).print()
    // console.log('a')
// }

//domcontentloaded might be needed later

const s = (sketch) => {
    const x=100;
    const y=100;
    sketch.setup = function(){
        sketch.createCanvas(700, 410);
        sketch.background(0)
        sketch.ellipse(50,50,80,70)
    };
    sketch.draw = function(){
        sketch.rect(x,y,50,50)
    }
    

}

const myCanvas = new p5(s)


