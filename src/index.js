import "./styles/index.scss";
import * as facemesh from '@tensorflow-models/face-landmarks-detection';
import '@tensorflow/tfjs-backend-webgl';
import TRIANGULATION from './scripts/triangulation';
import 'regenerator-runtime/runtime';
//setup webcam 
async function getCameraReady() {
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

    const promise = new Promise(resolve=>{
        cam.onloadedmetadata = () => {
            resolve(cam)
        }
    });

    return promise.then(
        ()=>(console.log('webcam setup ready')),
        ()=>(console.log('webcam setup failed'))
    )
}



//run detection
async function runDetection(model){
    const webCam = document.getElementById('cam');
    if(cam.readyState === 4){
        const predictions_arr = await model.estimateFaces({input: webCam});
        console.log(predictions_arr);
    }
    // window.requestAnimationFrame(runDetection)
}


async function main(){
    await getCameraReady();
    const model = await facemesh.load(
        facemesh.SupportedPackages.mediapipeFacemesh);
    // await getCameraReady();
    await runDetection(model);

}
main()


