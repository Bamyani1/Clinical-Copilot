import { useEffect, useState } from "react";
import { AmbientScene } from "./AmbientScene";

type Props = {
  enableAmbientGL?: boolean;
  lowPowerMode?: boolean;
  position?: 'fixed' | 'absolute';
  className?: string;
  opacity?: number;
};

export function AmbientLayer({ enableAmbientGL = true, lowPowerMode = false, position = 'fixed', className = '', opacity = 0.6 }: Props) {
  const [supportsWebGL, setSupportsWebGL] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      setSupportsWebGL(!!gl);
    } catch {
      setSupportsWebGL(false);
    }
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setReducedMotion(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (!enableAmbientGL || !supportsWebGL) {
    return (
      <div
        aria-hidden
        className={`pointer-events-none ${position} inset-0 z-0 ambient-fallback ambient-fallback-animated ${className}`}
        style={{ opacity }}
      />
    );
  }

  return (
    <div
      aria-hidden
      className={`pointer-events-none ${position} inset-0 z-0 ${className}`}
      style={{ opacity }}
    >
      <AmbientScene reducedMotion={reducedMotion} lowPowerMode={lowPowerMode} />
    </div>
  );
}


