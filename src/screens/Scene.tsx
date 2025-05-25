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

type HiddensType = {
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  isFound: boolean;
};

const Scene = () => {
  const [coords, setCoords] = useState<HiddensType[]>([
    {
      x: 310,
      y: 190,
      width: 40,
      height: 40,
      name: "strike1",
      isFound: false,
    },
    {
      x: 110,
      y: 260,
      width: 80,
      height: 80,
      name: "strike2",
      isFound: false,
    },
  ]);
  const [isPause, setIsPause] = useState(false);
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);

  useEffect(() => {
    (async () => {
      // 이미 앱 인스턴스가 존재한다면 (Strict Mode 재실행 시), 이전 인스턴스를 파괴하고 캔버스를 제거합니다.
      console.log("Check strict ", appRef.current);
      if (appRef.current) {
        return;
      }
      //   appRef.current.destroy(true); // 모든 자식과 텍스처를 함께 파괴
      //   if (
      //     canvasRef.current &&
      //     appRef.current.canvas.parentNode === canvasRef.current
      //   ) {
      //     canvasRef.current.removeChild(appRef.current.canvas);
      //   }
      //   appRef.current = null; // 참조 초기화
      // }

      // 새로운 PixiJS Application 인스턴스 생성
      const app = new Application();
      appRef.current = app; // appRef에 저장

      // Initialize the application
      await app.init({ resizeTo: window });

      const viewport = new Viewport({
        worldWidth: 4000,
        worldHeight: 3200,
        events: app.renderer.events, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
      });

      // add the viewport to the stage
      app.stage.addChild(viewport);

      // activate plugins
      viewport.drag().pinch().wheel().clampZoom({
        minScale: 0.4,
        maxScale: 1.2,
      });
      viewport.clamp({
        left: -250,
        right: 4550,
        top: -250,
        bottom: 3450,
      });
      viewport.fit();

      // Append the application canvas to the document body
      // document.body.appendChild(app.canvas);

      // Load textures
      await Assets.load([
        "/map1.png",
        "/vite.svg",
        "https://pixijs.com/assets/flowerTop.png",
      ]);

      app.stage.eventMode = "static";

      const bg = Sprite.from("/map1.png");
      viewport.addChild(bg);

      for (let j = 0; j < 2; j++) {
        const mask = Sprite.from("/vite.svg");
        console.log(coords[j]);
        mask.x = coords[j].x;
        mask.y = coords[j].y;
        mask.width = coords[j].width;
        mask.height = coords[j].height;
        mask.anchor.set(0.5);
        viewport.addChild(mask);
      }

      // Load the animation sprite sheet
      const texture = await Assets.load(
        "https://pixijs.com/assets/spritesheet/mc.json"
      );

      // Create an array to store the textures
      const explosionTextures = [];
      let i;

      for (i = 0; i < 26; i++) {
        const texture = Texture.from(`Explosion_Sequence_A ${i + 1}.png`);

        explosionTextures.push(texture);
      }

      const handleClick = (event: FederatedPointerEvent) => {
        const local = viewport.toLocal(event.global);
        console.log("Clicked inside viewport at local:", local.x, local.y);

        for (let j = 0; j < 2; j++) {
          const spr = coords[j];

          const x = spr.x;
          const y = spr.y;
          if (
            local.x < x + spr.width / 2 &&
            local.x > x - spr.width / 2 &&
            local.y < y + spr.height / 2 &&
            local.y > y - spr.height / 2 &&
            !isPause &&
            !spr.isFound
          ) {
            const explosion = new AnimatedSprite(explosionTextures);

            explosion.x = x;
            explosion.y = y;
            explosion.anchor.set(0.5);
            explosion.rotation = Math.random() * Math.PI;
            explosion.scale.set(0.5);
            explosion.gotoAndPlay((Math.random() * 26) | 0);
            viewport.addChild(explosion);

            viewport.pause = true;
            setIsPause(true);

            setTimeout(() => {
              viewport.removeChild(explosion);
              viewport.pause = false;
              setIsPause(false);
              setCoords((prevItems) =>
                prevItems.map((item, idx) => {
                  if (idx === j) {
                    return {
                      ...item,
                      isFound: true,
                    };
                  } else {
                    return item;
                  }
                })
              );
            }, 2000);
          }
        }
      };

      app.stage.eventMode = "static"; // 이벤트 허용
      app.stage.on("pointerdown", handleClick);

      canvasRef.current?.appendChild(app.canvas);
      app.start();
      viewport.fitWorld();
      console.log("sprite ", viewport);

      return () => {
        console.log("클린업 함수 실행");
        if (appRef.current) {
          // PixiJS 애플리케이션을 파괴하고 관련 리소스를 해제합니다.
          // `true`를 전달하여 자식 요소와 기본 텍스처도 함께 파괴합니다.
          appRef.current.destroy(true);
          // DOM에서 캔버스 엘리먼트를 제거합니다.
          if (
            canvasRef.current &&
            appRef.current.canvas.parentNode === canvasRef.current
          ) {
            canvasRef.current.removeChild(appRef.current.canvas);
          }
          appRef.current = null; // 참조 초기화
        }
        app.stop();
      };
    })();
  }, []);

  return (
    <div className="relative w-full h-screen flex justify-center items-center bg-gray-900">
      <div
        ref={canvasRef}
        className="relative max-w-[600px] h-screen overflow-hidden"
      >
        <div
          onClick={() => {
            navigate(-1);
          }}
          className="text-red-600 p-2 cursor-pointer fixed top-5 left-5 bg-red-300"
        >
          Go back!
        </div>
        <div className="absolute bottom-3 justify-center items-center flex flex-row w-full">
          {coords
            .filter((item) => !item.isFound)
            .map((item) => {
              return (
                <div className="bg-white/80 h-12 w-12 rounded-sm flex justify-center items-center m-1">
                  {item.name}
                </div>
              );
            })}
          {coords
            .filter((item) => item.isFound)
            .map((item) => {
              return (
                <div className="bg-red-800/80 h-12 w-12 rounded-sm flex justify-center items-center m-1">
                  {item.name}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Scene;
