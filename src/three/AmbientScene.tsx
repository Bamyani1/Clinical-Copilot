import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import type { Group } from "three";

type AmbientSceneProps = {
  reducedMotion?: boolean;
  lowPowerMode?: boolean;
};

type AmbientParticlesProps = {
  positions: Float32Array;
  reducedMotion?: boolean;
};

const AmbientParticles = ({ positions, reducedMotion }: AmbientParticlesProps) => {
  const group = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!reducedMotion && group.current) {
      group.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <group ref={group}>
      {/* @ts-expect-error r3f type nuance */}
      <Points positions={positions} stride={3} limit={positions.length / 3}>
        <PointMaterial
          transparent
          color="#9BA4B1"
          size={reducedMotion ? 0.012 : 0.02}
          sizeAttenuation
          depthWrite={false}
          opacity={0.58}
        />
      </Points>
    </group>
  );
};

export function AmbientScene({ reducedMotion, lowPowerMode }: AmbientSceneProps) {
  const positions = useMemo(() => {
    const count = lowPowerMode ? 700 : 1800;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      arr[i] = (Math.random() - 0.5) * 9;
    }
    return arr;
  }, [lowPowerMode]);

  return (
    <Canvas dpr={lowPowerMode ? 1 : [1, 2]} camera={{ position: [0, 0, 6], fov: 50 }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.2} color="#22413E" />
        <AmbientParticles positions={positions} reducedMotion={reducedMotion} />

        {!reducedMotion && (
          <EffectComposer>
            <Bloom intensity={0.15} luminanceThreshold={0.25} />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  );
}
