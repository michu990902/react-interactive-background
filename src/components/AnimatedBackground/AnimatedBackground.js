import React, { useLayoutEffect, useRef, useState } from 'react';
import styles from './AnimatedBackground.module.css';

const AnimatedBackground = () => {
    const [render, setRender] = useState(0);
    const canvasRef = useRef(null);

    const reRender = () => {
        setRender(render+1);
    }
    
    const width = window.innerWidth, 
        height = window.innerHeight,
        density = 70,
        maxRadius = 5,
        relQuantity = 2,
        lineRange = 100,
        maxMove = 100,
        maxSpeed = 5,
        color = "#f00";
        //TODO: get color

    useLayoutEffect(() => {
        const ctx = canvasRef.current.getContext("2d");
        
        let points = [],
            mouseX = ~~(width * 0.1 + Math.random() * width * 0.8),
            mouseY = ~~(height * 0.1 + Math.random() * height * 0.8),
            stopAnimation = false;

        const setMousePos = e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }

        const getDistance = (p1, p2) => (Math.abs(p1.currX - p2.currX)**2 + Math.abs(p1.currY - p2.currY)**2)**0.5;
        
        const generatePoints = () => {
            points = [];
            for(let x = 0; x < width; x += density){
                for(let y = 0; y < height; y+=density){
                    const px = x + ~~(Math.random() * density),
                        py = y + ~~(Math.random() * density),
                        toX = px + ~~(Math.random() * maxMove),
                        toY = py + ~~(Math.random() * maxMove),
                        reverseX = Math.random() < 0.5,
                        reverseY = Math.random() < 0.5;
                    points.push({
                        x: px,
                        y: py,
                        radius: ~~(Math.random() * maxRadius),
                        closest: [],
                        toX: toX,
                        toY: toY,
                        reverseX: reverseX,
                        reverseY: reverseY,
                        currX: reverseX ? toX : px,
                        currY: reverseY ? toY : py,
                        speed: Math.random() * maxSpeed,
                        active: "0"
                    });
                }
            }
            for(let i = 0; i < points.length; i++) {
                const p1 = points[i];
                let closest = [];
                for(let j = 0; j < points.length; j++){
                    if(closest.length > relQuantity) break;
                    if(i === j) continue;
                    const p2 = points[j];
                    if(p2.closest.includes(j)) continue;
                    if(getDistance(p1, p2) < lineRange){
                        closest.push(j);
                    }
                }
                p1.closest = closest;
            }
        }

        const drawLines = p => {
            if(p.active === "0") return;
            p.closest.forEach(id => {
                ctx.beginPath();
                ctx.moveTo(p.currX, p.currY);
                ctx.lineTo(points[id].currX, points[id].currY);
                //active: 0-F
                ctx.strokeStyle = color+p.active;
                ctx.stroke();
            })
        }
    
        const drawCricle = p => {
            if(p.active === "0") return;
            ctx.beginPath();
            ctx.arc(p.currX, p.currY, p.radius, 0, 2 * Math.PI, false);
            //active: 0-F
            ctx.fillStyle = color+p.active;
            ctx.fill();
        }

        const animate = () => {
            if(stopAnimation) return;

            ctx.clearRect(0, 0, width, height);
            points.forEach(p => {
                const dis = getDistance(p, {currX: mouseX, currY: mouseY});
                if(dis < 100){
                    p.active = "8";    
                }else if(dis < 200){
                    p.active = "4";
                }else if(dis < 300){
                    p.active = "2";
                }else{
                    p.active = "0";
                }

                drawCricle(p)
                drawLines(p)
            })

            points.forEach(p => {
                if(p.currX > p.toX || p.currX < p.x){
                    p.reverseX = !p.reverseX;
                }
                if(p.currY > p.toY || p.currY < p.y){
                    p.reverseY = !p.reverseY;
                }
                p.currX += p.reverseX ? -0.1 : 0.1;
                p.currY += p.reverseY ? -0.1 : 0.1;
            })

            requestAnimationFrame(animate);
        }

        generatePoints();
        requestAnimationFrame(animate);
        window.addEventListener("mousemove", setMousePos);
        window.addEventListener("resize", reRender);
        
        return () => {
            stopAnimation = true;
            window.removeEventListener("mousemove", setMousePos)
            window.removeEventListener("resize", reRender);
        }
    }, [render]);
    
    return (
        <canvas 
            className={styles.bcg}
            width={window.innerWidth}
            height={window.innerHeight}
            ref={canvasRef}
        />
    );
};

export default AnimatedBackground;

