import React, { useRef, useEffect } from "react";
import { useApplication } from "@pixi/react";
import { Viewport as PixiViewport } from "pixi-viewport";

export interface ViewportProps {
  width: number;
  height: number;
  children?: React.ReactNode;
}

const Viewport = ({ width, height, children }: ViewportProps) => {
  const { app } = useApplication();
  const viewportRef = useRef<PixiViewport | null>(null);

  useEffect(() => {
    if (!app.renderer || !app.stage) return;

    const viewport = new PixiViewport({
      screenWidth: width,
      screenHeight: height,
      worldWidth: width * 2,
      worldHeight: height * 2,
      events: app.renderer.events, // PixiJS v7
      ticker: app.ticker,
    });

    viewport.drag().pinch().wheel().clampZoom({});
    app.stage.addChild(viewport);
    viewportRef.current = viewport;

    return () => {
      app.stage.removeChild(viewport);
      viewport.destroy();
    };
  }, [app, width, height]);

  // 자식 요소를 PixiContainer로 감싸 렌더링할 수는 없으므로
  // 필요한 경우 useEffect 안에서 수동으로 addChild 해야 함
  useEffect(() => {
    if (viewportRef.current && children) {
      React.Children.forEach(children, (child) => {
        // PixiJS 디스플레이 객체일 경우에만 추가
        if (React.isValidElement(child) && child.ref?.current) {
          viewportRef.current?.addChild(child.ref.current);
        }
      });
    }
  }, [children]);

  return null;
};

export default Viewport;
