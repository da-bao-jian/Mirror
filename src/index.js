import "./styles/index.scss";
import * as facemesh from '@tensorflow-models/face-landmarks-detection';
import '@tensorflow/tfjs-backend-webgl';
import TRIANGULATION from './scripts/triangulation';
import {drawCanvas, drawTriangular, drawTriangularHue, drawTriangularBWG} from './scripts/mask_drawing';
import 'regenerator-runtime/runtime';
// import p5;

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

const allText = [];
let pTag = document.createElement('p')
const speechReco = webkitSpeechRecognition || SpeechRecognition;
const recognition = new speechReco();
// recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'en-US';
recognition.onresult = function(e) {

  const sentence = Array.from(e.results).map(res=>(res[0])).map(r=>r.transcript).join('');
  console.log(sentence);

  const textContainer = document.querySelector('.text-container')
  pTag.innerText = sentence;
  textContainer.appendChild(pTag)

  if(e.results[0].isFinal){
    if(sentence.includes('start')){
      main('start');
    } else if(sentence.includes('triangular')){
      main('triangular')
    } else if (sentence.includes('color')) {
      main('color');
    } else if ( sentence.includes('noir')) {
      main('noir');
    }
  };
};

recognition.addEventListener('end', ()=>{
  recognition.start();
})

recognition.start();



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
  } else if(name==='noir'){
    await getCameraReady();
    model = await facemesh.load(facemesh.SupportedPackages.mediapipeFacemesh);
    runDetection('BWGHue')
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
  document.getElementById('clear').addEventListener('click', async()=>{
    await getCameraReady();
    model = await facemesh.load(facemesh.SupportedPackages.mediapipeFacemesh);
    runDetection('grid-points')
  }); 
};
// main()


