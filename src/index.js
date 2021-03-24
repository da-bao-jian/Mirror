import "./styles/index.scss";
import * as facemesh from '@tensorflow-models/face-landmarks-detection';
import '@tensorflow/tfjs-backend-webgl';
import {drawCanvas, drawTriangular, drawTriangularHue, drawTriangularBWG} from './scripts/mask_drawing';
import 'regenerator-runtime/runtime';

let model; 
let webCam; 

//setup webcam 
function getCameraReady() {
  
    const cam = document.getElementById('cam');
    navigator.mediaDevices.getUserMedia({
        video: {
            frameRate: {ideal: 10, max:15} 
        }
    }).then((stream)=>{
        cam.srcObject = stream;
    }).catch((err)=>{
        console.log(err)});

    //promise constructor to make sure the webcam reaches certain stage before loading model
    const promise = new Promise((resolve, reject)=>{
        cam.onprogress = () => {
            resolve(cam)
        }
    });

    return promise.then(

      ()=>(console.log('webcam setup ready')),
      ()=>(console.log('webcam setup failed'))

    );
};


//run detection
async function runDetection(maskName){

  const webCam = document.getElementById('cam');
  const webCamWidth = webCam.width;
  const webCamHeight = webCam.height;

  const canvas = document.getElementById('canvas');
  canvas.width = webCamWidth;
  canvas.height = webCamHeight;
  const ctx1 = canvas.getContext('2d');

  const second_canvas = document.getElementById('second-canvas');
  const second_canvasWidth = second_canvas.width;
  const second_canvasHeight = second_canvas.height;

  const face = document.getElementById('second-canvas');
  face.width = second_canvasWidth;
  face.height = second_canvasHeight;
  const ctx2 = face.getContext('2d');

  if(cam.readyState === 4){
      const drawMask = async() => { //drawing the mask per frame
          const predictions_arr = await model.estimateFaces({input: webCam}); //scaledMesh.length = 478 because of using the updated Iris model; original scaledMesh should only have 468 end points
          ctx1.drawImage(webCam, 0, 0, webCam.width, webCam.height, 0,0, canvas.width, canvas.height);
          ctx2.drawImage(second_canvas, 0, 0, webCam.width, webCam.height, 0,0, face.width, face.height);
          if(predictions_arr.length !== 0){
              console.log(predictions_arr) 
              for(let i=0; i<predictions_arr.length;i++){ //could this just be predictions_arr[0]?
                  const keypoints = predictions_arr[i].scaledMesh; //getting the nomalized 3d coordination landmarks (scaledMesh is the normalized coordination)
                  
                  if(maskName === 'grid-points'){
                    drawCanvas(keypoints, ctx1);
                  } else if (maskName ==='triangular'){
                    drawTriangular(keypoints, ctx2, face);
                  } else if (maskName ==='color-hue') {
                    drawTriangularHue(keypoints, ctx2, face);
                  } else if (maskName ==='BWGHue') {
                    drawTriangularBWG(keypoints, ctx2, face);
                  };
              };
          };
          //recursively calling itself to continously run the detection per frame
          requestAnimationFrame(drawMask);
      };
      drawMask();
  };
};

// window.addEventListener('DOMContentLoaded', () => {
  let screenText = [];
  let canvses = [];
  let pTag = document.createElement('p')
  let speechReco = webkitSpeechRecognition || SpeechRecognition;
  let recognition = new speechReco();
  // recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
  recognition.onresult = function(e) {
  
    const sentence = Array.from(e.results).map(res=>(res[0])).map(r=>r.transcript).join('');
    console.log(sentence);
  
    const textContainer = document.querySelector('.text-container')
    screenText.push(sentence);
  
    pTag.innerText = sentence;
    textContainer.appendChild(pTag)
  
    if(e.results[0].isFinal){

      canvses.push(new p5(sketch));
      
      if(sentence.includes('start')){
        main('start');
      } else if(sentence.includes('triangular')){
        main('triangular')
      } else if (sentence.includes('color')) {
        main('color');
      } else if ( sentence.includes('black and white')) {
        main('black and white');
      } else if ( sentence.includes('clear')) {
        main('clear');
      }
    };
  };

  recognition.addEventListener('end', ()=>{
    recognition.start();
  })
  
  recognition.start();
// })




async function main(name=null){

  if (name === 'start'){
    await getCameraReady();
    model = await facemesh.load(facemesh.SupportedPackages.mediapipeFacemesh);
    runDetection('grid-points')

  } else if(name==='triangular'){
    await getCameraReady();
    model = await facemesh.load(facemesh.SupportedPackages.mediapipeFacemesh);
    runDetection('triangular')
  } else if(name==='color'){
    await getCameraReady();
    model = await facemesh.load(facemesh.SupportedPackages.mediapipeFacemesh);
    runDetection('color-hue')
  } else if(name==='black and white'){
    await getCameraReady();
    model = await facemesh.load(facemesh.SupportedPackages.mediapipeFacemesh);
    runDetection('BWGHue')
  } else if(name==='clear'){
    await getCameraReady();
    model = await facemesh.load(facemesh.SupportedPackages.mediapipeFacemesh);
    runDetection('grid-points')
  };

  document.getElementById('triangular').addEventListener('click', async()=>{
    
    await getCameraReady();
    model = await facemesh.load(facemesh.SupportedPackages.mediapipeFacemesh);
    runDetection('triangular')
  });
  document.getElementById('color-hue').addEventListener('click', async()=>{
    await getCameraReady();
    model = await facemesh.load(facemesh.SupportedPackages.mediapipeFacemesh);
    runDetection('color-hue')
  });
  document.getElementById('BWGHue').addEventListener('click', async()=>{
    await getCameraReady();
    model = await facemesh.load(facemesh.SupportedPackages.mediapipeFacemesh);
    runDetection('BWGHue')
  });
  document.getElementById('restart').addEventListener('click', async()=>{
    await getCameraReady();
    model = await facemesh.load(facemesh.SupportedPackages.mediapipeFacemesh);
    runDetection('grid-points')
  }); 
};
// main()


const textGenerator = () => {
  
  return screenText.splice(screenText.length-1);
  // return String.fromCharCode(0x30A0 + randInt(0,96));
};

function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); 
};

const sketch = (pen) => {
  pen.setup = () => {

    pen.x = window.innerWidth/randInt(2, 10);
    pen.y =  window.innerHeight/randInt(2, 10);
    pen.value = textGenerator();
    pen.rand = Math.floor(Math.random(0,1000000)*10);

    pen.createCanvas(
      window.innerWidth,
      window.innerHeight
    );
  };
  
  pen.draw = () => {
    if(pen.value.length>0){

      // if(pen.frameCount % pen.rand === 2){
        
      //   pen.value = textGenerator()[randInt(0,  textGenerator().length)];
      // };

      pen.fill(140, 255, 170, 250);
      pen.clear();
      pen.text(pen.value, pen.x, pen.y);
      pen.textSize(50);

      if(pen.x >= window.innerWidth){
        pen.x = 0;
      } else {
        pen.x += 2; //can be set to random  
      };
    };
  };
};

