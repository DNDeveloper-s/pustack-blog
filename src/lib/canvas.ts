// @ts-nocheck

import { scroll } from "framer-motion";

const paraListItems = [
  {
    id: "1",
    text: "Explained very nicely and in easy way and also becomes easy to remember after seeing videos",
    author: "@Shah Jinali",
    rating: 5,
  },
  {
    id: "2",
    text: "The teacher explains very well and makes chapter interesting",
    author: "@Prapti Pathak",
    rating: 4.5,
  },
  {
    id: "3",
    text: "Best app for 9 and 10 at free of cost better than byjus trust me",
    author: "@Ayush Mishra",
    rating: 5,
  },
  {
    id: "4",
    text: "very good exprience for learning and teachers are teach very well.underdtanding of topic is easly",
    author: "@Kumkum Gupta",
    rating: 5,
  },
  {
    id: "5",
    text: "I love this app best app for tentiees",
    author: "@Gunjan Soni",
    rating: 5,
  },
  {
    id: "6",
    text: "Love this app...this app helps me to understand all the concepts in very easy way...💓❤️‍🩹🥰",
    author: "@Chhavi Pihu",
    rating: 4.5,
  },
  {
    id: "7",
    text: "Best app in ed-tech industry. Teaching quality is awesome.",
    author: "@Shailesh Kumar Gaud",
    rating: 5,
  },
  {
    id: "8",
    text: "Best app for learning They make us understand the concept easils.",
    author: "@Taha vlogs",
    rating: 5,
  },
  {
    id: "9",
    text: "Nice learning pletform for indian student Best of luck and use this learning app",
    author: "@Maa Moni",
    rating: 4.5,
  },
];

interface Coords {
  x: number;
  y: number;
}

type Velocity = Coords;

export function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

interface Range {
  from: number;
  to: number;
}

interface LinearRateOptions {
  desiredRange: Range;
  relativeRange: Range;
  acc: number;
}

function getLinearRate(
  startBase: number,
  endBase: number,
  startAcc: number,
  endAcc: number,
  latestValue: number
) {
  if (latestValue < startBase) return startAcc;
  const x = (startAcc - endAcc) / (startBase - endBase);
  let val = x * latestValue + 1;
  if (endAcc > startAcc && val >= Math.max(startAcc, endAcc))
    return Math.max(startAcc, endAcc);
  if (endAcc < startAcc && val <= Math.min(startAcc, endAcc))
    return Math.min(startAcc, endAcc);
  return val;
}

export function getLinearRateNew(options: LinearRateOptions) {
  const x =
    (options.desiredRange.from - options.desiredRange.to) /
    (options.relativeRange.from - options.relativeRange.to);
  const y = options.desiredRange.to - options.relativeRange.to * x;
  let val = options.acc * x + y;
  if (options.acc < options.relativeRange.from) val = options.desiredRange.from;
  if (options.acc > options.relativeRange.to) val = options.desiredRange.to;
  return val;
}

// function getLinearRate(startBase: number, endBase: number, startAcc: number, endAcc: number, latestValue: number) {
// 	const x = (startAcc - endAcc) / (startBase - endBase);
// 	let val = x * (latestValue) + startAcc;
// 	if(endAcc > startAcc && val >= Math.max(startAcc, endAcc)) return Math.max(startAcc, endAcc);
// 	if(endAcc < startAcc && val <= Math.min(startAcc, endAcc)) return Math.min(startAcc, endAcc);
// 	return val;
// }
export interface ReviewProps {
  top: number;
  left: number;
}
export const runCanvasScript = async (
  canvas: HTMLCanvasElement,
  innerWidth = document.body.clientWidth,
  innerHeight = visualViewport.height,
  disableInteractivity,
  toggleReview: (props: ReviewProps) => null = () => {}
) => {
  const c = canvas.getContext("2d");

  canvas.width = innerWidth;
  canvas.height = innerHeight;

  if (!c) return;

  // const mouse = {
  // 	x: innerWidth / 2,
  // 	y: innerHeight / 2
  // }

  const colors = [
    "#7f71c5",
    "#d6d7d7",
    "#D6D7D7FF",
    "#D6D7D7FF",
    "#D6D7D7FF",
    "#D6D7D7FF",
    "#266cb2",
    "#69cc7b",
    "#ebae70",
    "#dde0e4",
    "#D6D7D7FF",
    "#D6D7D7FF",
    "#D6D7D7FF",
    "#dde0e4",
    "#dde0e4",
    "#dde0e4",
    "#dde0e4",
    "#b4a866",
  ];
  // const colors = ['#053B50', '#407cba', '#64CCC5', '#EEEEEE'];
  // const colors = ['#E5D283', '#176B87', '#64CCC5', '#EEEEEE', '#EEEEEE', '#EEEEEE', '#EEEEEE'];
  // const colors = ['#451952', '#662549', '#AE445A', '#F39F5A'];
  // const colors = ['#FFF5E0', '#FF6969', '#BB2525', '#141E46'];
  const numStars = 400;

  addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    init();
  });

  const gravity = 0.05;
  const fl = canvas.width / 3.5;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  // let initialSpeed = window.innerWidth < 600 ? 0.25 : 0.31;
  let initialSpeed = 0.5;
  let speed = initialSpeed;

  const mouse = {
    x: null,
    y: null,
    hovered: -1,
  };

  // addEventListener('scroll', e => {
  // 	console.log('speed - ', e);
  // 	speed += 0.1;
  // })

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  addEventListener("mouseleave", (e) => {
    mouse.x = -1;
    mouse.y = -1;
    toggleReview(null);
  });

  !disableInteractivity &&
    scroll((progress) => {
      // speed = progress * 90 + initialSpeed;
      mouse.x = -1;
      mouse.y = -1;
      toggleReview(null);
      // speed = getLinearRateNew({
      //   desiredRange: { from: initialSpeed, to: 10 },
      //   relativeRange: { from: 0, to: 600 },
      //   acc: progress * document.body.scrollHeight,
      // });
    });

  class Particle {
    x = Math.random() * canvas.width;
    y = Math.random() * canvas.height;
    z = Math.random() * canvas.height;
    startZ;
    id: number;
    hovered = false;
    reviewItem =
      paraListItems[randomIntFromInterval(0, paraListItems.length - 1)];
    // color = '#ff5e4c';
    color = colors[randomIntFromInterval(0, colors.length - 1)];
    size =
      window.innerWidth < 600
        ? randomIntFromInterval(0.2, 1.1)
        : randomIntFromInterval(0.4, 2.5);
    constructor(id: number) {
      this.id = id;
      this.startZ = this.z;
    }

    draw() {
      // if(!c) return;
      // c.beginPath()
      // c.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      // c.fill()
      // c.fillStyle = colors[randomIntFromInterval(0, colors.length - 1)];
      // c.closePath();
    }

    show() {
      if (!c) return;
      let x, y, s;

      x = (this.x - centerX) * (fl / this.z);
      x += centerX;

      y = (this.y - centerY) * (fl / this.z);
      y += centerY;

      s = this.size * (fl / this.z) + 1;
      if (s >= 12) s = 12;

      {
        const startingSize = this.size * (fl / this.startZ) + 1;
        // const x = -1 / (startingSize - 10)
        // const alpha = getLinearRate(startingSize, 10, 0, 1, s);
        const alpha = getLinearRateNew({
          desiredRange: { from: 0.01, to: 1 },
          relativeRange: { from: startingSize, to: 5 },
          acc: s,
        });
        // const alpha =
        // console.log('alpha - ', alpha, startingSize, s);
        c.globalAlpha = alpha;
      }

      const distanceToMouse =
        mouse.x > 0 && mouse.y > 0
          ? Math.sqrt((mouse.x - x) ** 2 + (mouse.y - y) ** 2)
          : null;
      this.hovered = distanceToMouse !== null ? distanceToMouse < s : false;

      if (mouse.hovered >= 0) {
        mouse.hovered =
          this.id === mouse.hovered
            ? this.hovered
              ? this.id
              : -1
            : mouse.hovered;
        c.canvas.style.cursor = "pointer";
        // toggleReview({
        //   ...this.reviewItem,
        //   left: mouse.x,
        //   top: mouse.y,
        // });
      } else {
        mouse.hovered = this.hovered ? this.id : -1;
        c.canvas.style.cursor = "default";
        toggleReview(null);
      }

      // Draw over the whole canvas to create the trail effect
      // c.fillStyle = 'rgba(255, 255, 255, .05)';
      // c.fillRect(0, 0, canvas.width, canvas.height);

      c.beginPath();
      c.fillStyle = this.color;

      if (this.id === mouse.hovered) {
        c.shadowColor = "white";
        c.shadowOffsetX = 0;
        c.shadowOffsetY = 0;
        c.shadowBlur = 10;
      } else {
        c.shadowColor = "transparent";
        c.shadowOffsetX = 0;
        c.shadowOffsetY = 0;
        c.shadowBlur = 0;
      }

      c.arc(x, y, s, 0, Math.PI * 2, false);
      c.fill();

      // c.globalAlpha = alpha;
      // console.log('1 - - ', (fl / this.z));
      c.closePath();
    }

    update() {
      this.draw();
    }

    move() {
      if (this.id === mouse.hovered) return;
      this.z -= speed;
      if (this.z <= 0) {
        this.z = Math.random() * canvas.width;
        this.startZ = this.z;
      }
    }
  }

  let particles: Particle[];
  function init() {
    particles = [];

    const particleCount = window.innerWidth > 900 ? 900 : 500;
    const angleIncrement = (Math.PI * 2) / particleCount;

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(i));
    }
  }

  function animate() {
    if (!c) return;

    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
      particle.show();
      particle.move();
    });
  }

  init();
  animate();
};
