"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  PerspectiveCamera,
  Environment,
  ContactShadows,
  useGLTF
} from "@react-three/drei";
import { Suspense, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import Link from "next/link";

function PrizeModel({ prizeType, position }) {
  const prizes = ["drink", "burger", "donut"];
  if (prizeType === "fail" || prizeType === null) return null;
  const { scene } = useGLTF(`/prizes/${prizes[parseInt(prizeType)]}.glb`);
  return <primitive object={scene} scale={0.3} position={position} />;
}

function ClawModel({ clawPos, isLowering, prizeType }) {
  const { scene } = useGLTF("/claw.glb");
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      ref.current.traverse((child) => {
        if (child.name === "claw") child.position.set(clawPos.x, clawPos.y, clawPos.z);
        if (child.name === "clawBase") child.position.set(clawPos.x, clawPos.y + 0.15, clawPos.z);
        if (child.name === "track") child.position.set(0.011943, clawPos.y + 0.15, clawPos.z);
      });
    }
  });

  return (
    <>
      <primitive object={scene} ref={ref} scale={[0.6, 0.6, 0.6]} />
      <PrizeModel prizeType={prizeType} position={[clawPos.x, clawPos.y - 0.3, clawPos.z]} />
    </>
  );
}

export default function ClawGame() {
  const [clawPos, setClawPos] = useState({ x: -0.4, y: 2.7, z: 0.2 });
  const [isLowering, setIsLowering] = useState(false);
  const [prizeType, setPrizeType] = useState(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space" && !isLowering) {
        const prize = Math.random() < 0.25 ? "0" : Math.random() < 0.5 ? "1" : Math.random() < 0.75 ? "2" : "fail";

        setIsLowering(true);
        setPrizeType(null);
        setShowResult(false);

        gsap
          .timeline()
          .to(clawPos, {
            y: 2,
            duration: 0.6,
            onUpdate: function () {
              setClawPos((prev) => ({ ...prev, y: this.targets()[0].y }));
            }
          })
          .to(clawPos, {
            y: 2.7,
            duration: 0.6,
            onUpdate: function () {
              setClawPos((prev) => ({ ...prev, y: this.targets()[0].y }));
            },
            onComplete: () => {
              console.log("✅ 動畫完成，中獎結果：", prize);
              setPrizeType(prize);
              setShowResult(true);
              setIsLowering(false);
            }
          });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLowering, clawPos]);

  useEffect(() => {
    if (showResult) {
      const timer = setTimeout(() => setShowResult(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showResult]);

  const prizeMap = {
    "0": "飲料",
    "1": "漢堡",
    "2": "甜甜圈",
    "fail": "沒中獎，再接再厲！"
  };

  return (
    <div className="relative w-full h-screen">
      <Canvas>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} intensity={Math.PI} />

        <Suspense fallback={null}>
          <ClawModel clawPos={clawPos} isLowering={isLowering} prizeType={prizeType} />
        </Suspense>

        <Environment preset="city" background backgroundBlurriness={0.5} />
        <ContactShadows opacity={1} scale={10} blur={10} far={10} resolution={256} color="#DDDDDD" />
      </Canvas>

      {/* 操作說明 */}
      <div className="absolute top-4 left-4 text-white text-sm bg-black bg-opacity-50 px-3 py-2 rounded pointer-events-auto z-50">
        <p>控制：WASD 或 方向鍵</p>
        <p>空白鍵：下爪</p>
        <Link href="/" className="text-blue-300 underline mt-2 block">返回主頁</Link>
      </div>

      {/* 頁面下方按鈕 UI */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-auto z-50">
        <button className="bg-blue-300 rounded-full px-5 py-3 text-white font-bold text-sm shadow">◀</button>
        <button className="bg-green-400 rounded-full px-6 py-3 text-white font-bold text-sm shadow">▶</button>
        <button className="bg-green-600 rounded-full px-8 py-3 text-white font-bold text-sm shadow">DROP</button>
      </div>

      {/* 中獎畫面 UI */}
      {showResult && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center bg-white px-6 py-4 rounded-xl shadow-xl z-50 border-2 border-black">
          <h1 className="text-2xl font-bold">
            {prizeType === "fail" ? "失敗" : "恭喜中獎！"}
          </h1>
          <p className="text-lg mt-2">{prizeMap[prizeType]}</p>
        </div>
      )}
    </div>
  );
}
