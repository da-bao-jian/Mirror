import "./styles/index.scss";
import * as facemesh from '@tensorflow-models/face-landmarks-detection';
import '@tensorflow/tfjs-backend-webgl';
import TRIANGULATION from './scripts/triangulation';
import 'regenerator-runtime/runtime';



//setup webcam 
function getCameraReady() {
    const cam = document.getElementById('cam');
    navigator.mediaDevices.getUserMedia({
        video: {
            frameRate: {ideal: 12, max:15} 
        }
    }).then((stream)=>{
        cam.srcObject = stream;
    }).catch((err)=>{
        console.log(err);
    });

    //promise constructor to make sure the webcam reaches certain stage before loading model
    //more info on promises: https://javascript.info/promise-basics
    const promise = new Promise((resolve, reject)=>{
        cam.onprogress = () => {
            resolve(cam)
        }
    });

    return promise.then(
        // (values)=>(console.log(values)),
        ()=>(console.log('webcam setup ready')),
        ()=>(console.log('webcam setup failed'))
    )
}



//run detection
let model; //declare model variable for the requestAnimationFrame's callback so runDetection doesn't have to take in an argument
async function runDetection(){
    const webCam = document.getElementById('cam');
    if(cam.readyState === 4){
        const predictions_arr = await model.estimateFaces({input: webCam});
        console.log(predictions_arr);
    };
    //recursively calling itself to continously run the detection 
    window.requestAnimationFrame(runDetection);
    
}

async function main(){
    await getCameraReady();
    model = await facemesh.load(
        facemesh.SupportedPackages.mediapipeFacemesh);
    // await getCameraReady();
    runDetection();

}
// main()


