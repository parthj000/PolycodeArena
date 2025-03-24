import { useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { useScroll } from 'framer-motion';
import * as THREE from 'three';

interface FloatingImageProps {
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
}

function FloatingImage({ url, position, rotation }: FloatingImageProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const texture = useLoader(TextureLoader, url);

  useFrame((state: { clock: { elapsedTime: number } }) => {
    if (!mesh.current) return;
    
    // Gentle floating motion
    mesh.current.position.y += Math.sin(state.clock.elapsedTime) * 0.001;
    mesh.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1 + rotation[2];
  });

  return (
    <mesh ref={mesh} position={position} rotation={rotation}>
      <planeGeometry args={[3, 2]} />
      <meshBasicMaterial map={texture} transparent opacity={0.8} />
    </mesh>
  );
}

export default function Scene3D() {
  const { scrollYProgress } = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        <FloatingImage 
          url="/pic1.png"
          position={[-2, 1, 0]}
          rotation={[0, 0, -0.1]}
        />
        <FloatingImage 
          url="/pic2.png"
          position={[2, -1, -1]}
          rotation={[0, 0, 0.1]}
        />
        <FloatingImage 
          url="/pic3.png"
          position={[0, 0.5, -2]}
          rotation={[0, 0, 0]}
        />

        <fog attach="fog" args={['#000', 5, 15]} />
      </Canvas>
    </div>
  );
} 