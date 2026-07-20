"use client";

import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import styles from "./HeroScene.module.scss";

function InboxBox() {
  return (
    <group>
      {/* Inbox container */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[2, 1.5, 0.1]} />
        <meshStandardMaterial color="#4f46e5" metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Message bubbles floating */}
      <motion.group position={[-1, 0.5, 0.2]} animate={{ y: [0.5, 0.8, 0.5] }} transition={{ duration: 4, repeat: Infinity }}>
        <mesh>
          <boxGeometry args={[1.2, 0.4, 0.05]} />
          <meshStandardMaterial color="#818cf8" metalness={0.2} />
        </mesh>
      </motion.group>

      <motion.group position={[1, -0.3, 0.2]} animate={{ y: [-0.3, 0, -0.3] }} transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}>
        <mesh>
          <boxGeometry args={[0.9, 0.35, 0.05]} />
          <meshStandardMaterial color="#818cf8" metalness={0.2} />
        </mesh>
      </motion.group>

      {/* Glow orbs */}
      <mesh position={[0, 1, 0.5]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#4f46e5" emissive="#4f46e5" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

export function HeroScene() {
  return (
    <div className={styles.container}>
      <Canvas shadows camera={{ position: [0, 0, 4], fov: 50 }} className={styles.canvas}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />
        <InboxBox />
        <OrbitControls autoRotate autoRotateSpeed={2} enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
