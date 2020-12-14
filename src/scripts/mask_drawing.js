import {TRIANGULATION} from './triangulation';


export function drawCanvas(keypoints, ctx){
    for(let j = 0; j<keypoints.length; j++){
        const x = keypoints[j][0]; //x and y are horizontal and vertical coordination; z is the depth coordination derived from x using weak perspective projection
        const y = keypoints[j][1];
        ctx.beginPath();
        ctx.arc(x,y,1, 0, 2*Math.PI);
        ctx.fillStyle = 'aqua';
        ctx.fill();
    }
}; 

export function drawTriangular(keypoints, ctx){ 
    for (let i = 0; i < TRIANGULATION.length; i+=3) {
        const points = [
        TRIANGULATION[i], TRIANGULATION[i + 1],
        TRIANGULATION[i + 2]
        ].map(index => keypoints[index]);

        const region = new Path2D();
        region.moveTo(points[0][0], points[0][1]);
        for(let j = 1; j<points.length;j++){
            region.lineTo(points[j][0], points[j][1]);
        }
        region.closePath();
        ctx.strokeStyle='aqua';
        ctx.stroke(region);
    }   
};    


