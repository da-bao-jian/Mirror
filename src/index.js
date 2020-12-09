import "./styles/index.scss";
import * as facemeth from '@tensorflow-models/facemesh';

//setup webcam and canvas
navigator.mediaDevices.getUserMedia({
    video: {
        width: {min: 1024, ideal: 680, max: 1920},
        height: {min: 550, ideal: 400, max: 1000},
        frameRate: {ideal: 12, max:15}
    }
}).then((stream)=>{
    document.getElementById('cam').srcObject = stream;
});



