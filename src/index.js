import "./styles/index.scss";
import * as facemesh from '@tensorflow-models/face-landmarks-detection';
import '@tensorflow/tfjs-backend-webgl';
import TRIANGULATION from './scripts/triangulation';
import {drawCanvas, drawTriangular} from './scripts/mask_drawing';
import 'regenerator-runtime/runtime';

let model; 
let webCam; 

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
        console.log(err)});

    //promise constructor to make sure the webcam reaches certain stage before loading model
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
async function runDetection(){
    const webCam = document.getElementById('cam');
    const webCamWidth = webCam.width;
    const webCamHeight = webCam.height;
    const canvas = document.getElementById('canvas');
    canvas.width = webCamWidth;
    canvas.height = webCamHeight;
    const ctx = canvas.getContext('2d');
    if(cam.readyState === 4){
        const drawMask = async() => { //drawing the mask per frame
            const predictions_arr = await model.estimateFaces({input: webCam}); //scaledMesh.length = 478 because of using the updated Iris model; original scaledMesh should only have 468 end points
            ctx.drawImage(webCam, 0, 0, webCam.width, webCam.height, 0,0, canvas.width, canvas.height);
            if(predictions_arr.length !== 0){
                console.log(predictions_arr) 
                for(let i=0; i<predictions_arr.length;i++){ //could this just be predictions_arr[0]?
                    const keypoints = predictions_arr[i].scaledMesh; //getting the nomalized 3d coordination landmarks (scaledMesh is the normalized coordination)
                    // drawCanvas(keypoints, ctx);
                    drawTriangular(keypoints, ctx);
                }
            }
            //recursively calling itself to continously run the detection per frame
            requestAnimationFrame(drawMask);
        }
        drawMask()
    };
    
}


async function main(){
    await getCameraReady();
    model = await facemesh.load(
        facemesh.SupportedPackages.mediapipeFacemesh);
    // await getCameraReady();
    runDetection();
    
}
// main()


