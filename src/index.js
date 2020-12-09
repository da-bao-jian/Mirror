import "./styles/index.scss";
import * as facemeth from '@tensorflow-models/facemesh';
import TRIANGULATION from './scripts/triangulation';
import 'regenerator-runtime/runtime';
//setup webcam 
async function getCameraReady() {
    navigator.mediaDevices.getUserMedia({
        video: {
            // width: {ideal: 680}, //need to be further adjusted to match canvas
            // height: {min: 550, ideal: 400, max: 1000},
            frameRate: {ideal: 12, max:15} 
        }
    }).then((stream)=>{
        document.getElementById('cam').srcObject = stream;
    }).catch((err)=>{
        console.log(err);
    });
}



async function main(){
    await getCameraReady();

}
// main()


