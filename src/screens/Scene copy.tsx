import { extend, useApplication } from "@pixi/react";
import {
  Container,
  Graphics,
  Sprite,
  Assets,
  Application,
  Texture,
  AnimatedSprite,
  FederatedPointerEvent,
} from "pixi.js";
import { Viewport } from "pixi-viewport";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

extend({
  Container,
  Graphics,
});

// Create a new application
const app = new Application();

// Initialize the application
await app.init({ resizeTo: window });

const viewport = new Viewport({
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
  worldWidth: 1000,
  worldHeight: 1000,
  events: app.renderer.events, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
});

// add the viewport to the stage
app.stage.addChild(viewport);

// activate plugins
viewport.drag().pinch().wheel().clampZoom({}); // 를 붙이면 가속도 적용

// Append the application canvas to the document body
document.body.appendChild(app.canvas);

// Load textures
await Assets.load([
  "/map.png",
  "/vite.svg",
  "https://pixijs.com/assets/flowerTop.png",
]);

app.stage.eventMode = "static";

const bg = Sprite.from("/map.png");
viewport.addChild(bg);

// const cells = Sprite.from("https://pixijs.com/assets/cells.png");
// cells.scale.set(1.5);

const Scene = () => {
  const [coords, setCoords] = useState([
    {
      x: 310,
      y: 190,
      width: 40,
      height: 40,
    },
    {
      x: 110,
      y: 260,
      width: 80,
      height: 80,
    },
  ]);
  const [isPause, setIsPause] = useState(false);
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   (async () => {
  //     for (let j = 0; j < 2; j++) {
  //       const mask = Sprite.from("/vite.svg");
  //       console.log(coords[j]);
  //       mask.x = coords[j].x;
  //       mask.y = coords[j].y;
  //       mask.width = coords[j].width;
  //       mask.height = coords[j].height;
  //       mask.anchor.set(0.5);
  //       viewport.addChild(mask);
  //     }

  //     // Load the animation sprite sheet
  //     const texture = await Assets.load(
  //       "https://pixijs.com/assets/spritesheet/mc.json"
  //     );

  //     // Create an array to store the textures
  //     const explosionTextures = [];
  //     let i;

  //     for (i = 0; i < 26; i++) {
  //       const texture = Texture.from(`Explosion_Sequence_A ${i + 1}.png`);

  //       explosionTextures.push(texture);
  //     }

  //     const handleClick = (event: FederatedPointerEvent) => {
  //       const local = viewport.toLocal(event.global);
  //       console.log("Clicked inside viewport at local:", local.x, local.y);

  //       for (let j = 0; j < 2; j++) {
  //         const x = coords[j].x;
  //         const y = coords[j].y;
  //         if (
  //           local.x < x + coords[j].width / 2 &&
  //           local.x > x - coords[j].width / 2 &&
  //           local.y < y + coords[j].height / 2 &&
  //           local.y > y - coords[j].height / 2 &&
  //           !isPause
  //         ) {
  //           console.log("get!");
  //           const explosion = new AnimatedSprite(explosionTextures);

  //           explosion.x = x;
  //           explosion.y = y;
  //           explosion.anchor.set(0.5);
  //           explosion.rotation = Math.random() * Math.PI;
  //           explosion.scale.set(0.5);
  //           explosion.gotoAndPlay((Math.random() * 26) | 0);
  //           viewport.addChild(explosion);

  //           viewport.pause = true;
  //           setIsPause(true);

  //           setTimeout(() => {
  //             viewport.removeChild(explosion);
  //             viewport.pause = false;
  //             setIsPause(false);
  //           }, 1500);
  //         }
  //       }
  //     };

  //     app.stage.eventMode = "static"; // 이벤트 허용
  //     app.stage.on("pointerdown", handleClick);

  //     canvasRef.current?.appendChild(app.canvas);
  //     app.start();

  //     return () => {
  //       app.stop();
  //     };
  //   })();
  // }, []);

  return (
    <div>
      {/* <div
        onClick={() => {
          navigate(-1);
          canvasRef.current?.removeChild(app.canvas);
        }}
        style={{
          color: "red",
          position: "fixed",
          top: 20,
          left: 20,
          background: "rgba(150, 150, 0, 0.5)",
        }}
      >
        Go back!
      </div> */}
    </div>
  );
};

export default Scene;
