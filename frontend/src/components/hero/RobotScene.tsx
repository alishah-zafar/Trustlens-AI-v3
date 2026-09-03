import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/* ─── Shared PBR material configs ─── */
const S = {
  shell: { color: "#eaeff5", metalness: 0.75, roughness: 0.18 },
  shellDark: { color: "#c8cfd8", metalness: 0.7, roughness: 0.22 },
  visor: {
    color: "#0D2B2E", metalness: 0.95, roughness: 0.05,
    emissive: "#0a2025", emissiveIntensity: 0.08,
  },
  eye: { color: "#1C4E4D", emissive: "#2fbfb0", emissiveIntensity: 2.5 },
  cool: { color: "#1C4E4D", emissive: "#2fbfb0", emissiveIntensity: 1.2 },
  warm: { color: "#7A1F35", emissive: "#c81e3d", emissiveIntensity: 0.9 },
  joint: { color: "#2a3040", metalness: 0.85, roughness: 0.12 },
  plat: { color: "#0a1e20", metalness: 0.7, roughness: 0.25 },
};

/* ─────────────────────────────────────────
   ROBOT BODY
   ───────────────────────────────────────── */
function RobotBody() {
  const group = useRef<THREE.Group>(null!);
  const headRef = useRef<THREE.Group>(null!);
  const eyeLRef = useRef<THREE.MeshStandardMaterial>(null!);
  const eyeRRef = useRef<THREE.MeshStandardMaterial>(null!);
  const scanRingRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    /* Gentle floating */
    if (group.current) {
      group.current.position.y = Math.sin(t * 0.6) * 0.04;
    }

    /* Head slowly follows pointer with gentle autonomous sway */
    if (headRef.current) {
      const tx = state.pointer.x * 0.12 + Math.sin(t * 0.3) * 0.04;
      const ty = -state.pointer.y * 0.07 + Math.cos(t * 0.4) * 0.02;
      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y, tx, 0.025
      );
      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x, ty, 0.025
      );
    }

    /* Eye glow pulse */
    const pulse = 2.0 + Math.sin(t * 1.8) * 0.8;
    eyeLRef.current && (eyeLRef.current.emissiveIntensity = pulse);
    eyeRRef.current && (eyeRRef.current.emissiveIntensity = pulse);

    /* Scanner ring expanding wave */
    if (scanRingRef.current) {
      const p = (t * 0.5) % 1;
      scanRingRef.current.scale.setScalar(0.7 + p * 0.6);
      const mat = scanRingRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = (1 - p) * 0.45;
    }
  });

  return (
    <group ref={group}>
      {/* ────── HEAD ────── */}
      <group ref={headRef} position={[0, 2.0, 0]}>
        {/* Outer shell */}
        <RoundedBox
          args={[0.95, 0.82, 0.78]}
          radius={0.2}
          smoothness={6}
        >
          <meshStandardMaterial {...S.shell} />
        </RoundedBox>

        {/* Black glossy visor */}
        <mesh position={[0, -0.02, 0.39]}>
          <boxGeometry args={[0.74, 0.48, 0.04]} />
          <meshStandardMaterial {...S.visor} />
        </mesh>

        {/* Left eye sensor */}
        <mesh position={[-0.17, 0.0, 0.42]}>
          <sphereGeometry args={[0.045, 20, 20]} />
          <meshStandardMaterial ref={eyeLRef} {...S.eye} />
        </mesh>
        {/* Right eye sensor */}
        <mesh position={[0.17, 0.0, 0.42]}>
          <sphereGeometry args={[0.045, 20, 20]} />
          <meshStandardMaterial ref={eyeRRef} {...S.eye} />
        </mesh>

        {/* Eye bloom halos */}
        {[-0.17, 0.17].map((x, i) => (
          <mesh key={i} position={[x, 0.0, 0.41]}>
            <circleGeometry args={[0.08, 24]} />
            <meshStandardMaterial
              color="#2fbfb0"
              emissive="#2fbfb0"
              emissiveIntensity={0.35}
              transparent
              opacity={0.15}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}

        {/* Visor reflection strip */}
        <mesh position={[0, 0.12, 0.415]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.6, 0.015]} />
          <meshStandardMaterial
            color="#9DBAB8"
            transparent
            opacity={0.12}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Ear sensor modules */}
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 0.5, 0, 0]}>
            <RoundedBox args={[0.05, 0.2, 0.16]} radius={0.02} smoothness={3}>
              <meshStandardMaterial {...S.shellDark} />
            </RoundedBox>
            <mesh position={[side * 0.03, 0, 0]}>
              <sphereGeometry args={[0.015, 10, 10]} />
              <meshStandardMaterial {...S.cool} />
            </mesh>
          </group>
        ))}

        {/* Top antenna */}
        <mesh position={[0, 0.46, 0]}>
          <cylinderGeometry args={[0.012, 0.018, 0.12, 8]} />
          <meshStandardMaterial {...S.shell} />
        </mesh>
        <mesh position={[0, 0.55, 0]}>
          <sphereGeometry args={[0.028, 12, 12]} />
          <meshStandardMaterial {...S.cool} />
        </mesh>

        {/* Subtle panel seams */}
        <mesh position={[0, 0.3, 0]}>
          <torusGeometry args={[0.38, 0.004, 4, 32]} />
          <meshStandardMaterial color="#9DBAB8" transparent opacity={0.12} />
        </mesh>
      </group>

      {/* ────── NECK ────── */}
      <group position={[0, 1.5, 0]}>
        <mesh>
          <cylinderGeometry args={[0.13, 0.17, 0.12, 16]} />
          <meshStandardMaterial {...S.joint} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <torusGeometry args={[0.15, 0.008, 8, 24]} />
          <meshStandardMaterial {...S.cool} />
        </mesh>
      </group>

      {/* ────── TORSO ────── */}
      <group position={[0, 0.85, 0]}>
        {/* Main body */}
        <RoundedBox args={[1.05, 0.95, 0.58]} radius={0.1} smoothness={5}>
          <meshStandardMaterial {...S.shell} />
        </RoundedBox>

        {/* Upper armor layer */}
        <RoundedBox
          args={[0.88, 0.32, 0.04]}
          radius={0.05}
          smoothness={3}
          position={[0, 0.18, 0.28]}
        >
          <meshStandardMaterial {...S.shellDark} />
        </RoundedBox>
        {/* Lower armor layer */}
        <RoundedBox
          args={[0.78, 0.22, 0.03]}
          radius={0.04}
          smoothness={3}
          position={[0, -0.12, 0.28]}
        >
          <meshStandardMaterial {...S.shellDark} />
        </RoundedBox>

        {/* TrustLens shield emblem */}
        <mesh position={[0, 0.04, 0.3]}>
          <circleGeometry args={[0.1, 6]} />
          <meshStandardMaterial {...S.warm} />
        </mesh>
        <mesh position={[0, 0.04, 0.305]}>
          <circleGeometry args={[0.04, 16]} />
          <meshStandardMaterial {...S.cool} />
        </mesh>

        {/* Side accent strips */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.48, 0, 0.12]}>
            <boxGeometry args={[0.018, 0.6, 0.018]} />
            <meshStandardMaterial {...S.cool} />
          </mesh>
        ))}

        {/* Subtle crimson under-glow */}
        <mesh position={[0, -0.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.4, 24]} />
          <meshStandardMaterial
            color="#c81e3d"
            emissive="#c81e3d"
            emissiveIntensity={0.2}
            transparent
            opacity={0.08}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* ────── LEFT ARM (relaxed) ────── */}
      <group position={[-0.7, 1.05, 0]}>
        <mesh>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial {...S.joint} />
        </mesh>
        <group rotation={[0.15, 0, 0.22]}>
          <mesh position={[0, -0.2, 0]}>
            <capsuleGeometry args={[0.055, 0.22, 8, 16]} />
            <meshStandardMaterial {...S.shell} />
          </mesh>
          <mesh position={[0, -0.1, 0.06]}>
            <boxGeometry args={[0.012, 0.18, 0.012]} />
            <meshStandardMaterial {...S.cool} />
          </mesh>
        </group>
        <mesh position={[-0.04, -0.48, 0.06]}>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshStandardMaterial {...S.joint} />
        </mesh>
        <group position={[-0.04, -0.55, 0.06]}>
          <mesh>
            <capsuleGeometry args={[0.05, 0.2, 8, 16]} />
            <meshStandardMaterial {...S.shell} />
          </mesh>
          <mesh position={[0, -0.14, 0]}>
            <sphereGeometry args={[0.04, 10, 10]} />
            <meshStandardMaterial {...S.shellDark} />
          </mesh>
        </group>
      </group>

      {/* ────── RIGHT ARM (holding scanner) ────── */}
      <group position={[0.7, 1.05, 0]}>
        <mesh>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial {...S.joint} />
        </mesh>
        <group rotation={[-0.55, 0, -0.38]}>
          <mesh position={[0, -0.2, 0]}>
            <capsuleGeometry args={[0.055, 0.22, 8, 16]} />
            <meshStandardMaterial {...S.shell} />
          </mesh>
          <mesh position={[0, -0.1, 0.06]}>
            <boxGeometry args={[0.012, 0.18, 0.012]} />
            <meshStandardMaterial {...S.cool} />
          </mesh>
        </group>
        <mesh position={[0.14, -0.4, 0.22]}>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshStandardMaterial {...S.joint} />
        </mesh>
        <group position={[0.14, -0.46, 0.22]} rotation={[-0.3, 0, 0]}>
          <mesh>
            <capsuleGeometry args={[0.05, 0.15, 8, 16]} />
            <meshStandardMaterial {...S.shell} />
          </mesh>
        </group>

        {/* ═══ MAGNIFYING SCANNER ═══ */}
        <group position={[0.28, -0.48, 0.48]} rotation={[-0.25, 0.3, 0.1]}>
          {/* Thick metallic frame */}
          <mesh>
            <torusGeometry args={[0.22, 0.03, 16, 48]} />
            <meshStandardMaterial
              color="#9DBAB8"
              metalness={0.92}
              roughness={0.08}
            />
          </mesh>
          {/* Outer cyan rim */}
          <mesh position={[0, 0, 0.005]}>
            <torusGeometry args={[0.225, 0.012, 12, 48]} />
            <meshStandardMaterial {...S.cool} />
          </mesh>
          {/* Inner cyan rim */}
          <mesh position={[0, 0, -0.005]}>
            <torusGeometry args={[0.19, 0.008, 12, 48]} />
            <meshStandardMaterial {...S.cool} />
          </mesh>

          {/* Transparent glass lens */}
          <mesh>
            <circleGeometry args={[0.19, 32]} />
            <meshStandardMaterial
              color="#2fbfb0"
              transparent
              opacity={0.1}
              emissive="#2fbfb0"
              emissiveIntensity={0.12}
              side={THREE.DoubleSide}
              metalness={0.3}
              roughness={0.1}
            />
          </mesh>

          {/* Holographic crosshair lines inside lens */}
          <mesh>
            <planeGeometry args={[0.36, 0.004]} />
            <meshStandardMaterial
              color="#2fbfb0"
              emissive="#2fbfb0"
              emissiveIntensity={0.5}
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <planeGeometry args={[0.36, 0.004]} />
            <meshStandardMaterial
              color="#2fbfb0"
              emissive="#2fbfb0"
              emissiveIntensity={0.5}
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Center targeting dot */}
          <mesh position={[0, 0, 0.002]}>
            <circleGeometry args={[0.015, 12]} />
            <meshStandardMaterial
              color="#2fbfb0"
              emissive="#2fbfb0"
              emissiveIntensity={2}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Animated scanning wave ring */}
          <mesh ref={scanRingRef}>
            <torusGeometry args={[0.15, 0.005, 8, 32]} />
            <meshStandardMaterial
              color="#2fbfb0"
              emissive="#2fbfb0"
              emissiveIntensity={2.0}
              transparent
              opacity={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Short handle */}
          <mesh position={[0, -0.28, -0.02]} rotation={[0.1, 0, 0]}>
            <capsuleGeometry args={[0.022, 0.1, 8, 12]} />
            <meshStandardMaterial {...S.shellDark} />
          </mesh>
        </group>
      </group>

      {/* ────── LEGS ────── */}
      {[
        { x: -0.22, rz: 0.04 },
        { x: 0.22, rz: -0.04 },
      ].map((leg) => (
        <group key={leg.x} position={[leg.x, 0.22, 0]}>
          <mesh>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial {...S.joint} />
          </mesh>
          <mesh position={[0, -0.2, 0]}>
            <capsuleGeometry args={[0.065, 0.22, 8, 16]} />
            <meshStandardMaterial {...S.shell} />
          </mesh>
          <mesh position={[leg.x > 0 ? 0.065 : -0.065, -0.2, 0]}>
            <boxGeometry args={[0.01, 0.18, 0.01]} />
            <meshStandardMaterial {...S.cool} />
          </mesh>
          <mesh position={[0, -0.4, 0]}>
            <sphereGeometry args={[0.055, 12, 12]} />
            <meshStandardMaterial {...S.joint} />
          </mesh>
          <mesh position={[0, -0.55, 0]}>
            <capsuleGeometry args={[0.06, 0.16, 8, 16]} />
            <meshStandardMaterial {...S.shell} />
          </mesh>
          {/* Foot */}
          <RoundedBox
            args={[0.14, 0.05, 0.2]}
            radius={0.02}
            smoothness={3}
            position={[0, -0.68, 0.03]}
          >
            <meshStandardMaterial {...S.shellDark} />
          </RoundedBox>
          <mesh position={[0, -0.65, 0.08]}>
            <boxGeometry args={[0.1, 0.008, 0.008]} />
            <meshStandardMaterial {...S.cool} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ─────────────────────────────────────────
   SCANNING PLATFORM
   ───────────────────────────────────────── */
function ScanningPlatform() {
  const outerRingRef = useRef<THREE.Group>(null!);
  const innerRingRef = useRef<THREE.Group>(null!);
  const beamRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const pulseRingRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (outerRingRef.current) outerRingRef.current.rotation.y = t * 0.1;
    if (innerRingRef.current) innerRingRef.current.rotation.y = -t * 0.18;
    if (beamRef.current) {
      const m = beamRef.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 0.4 + Math.sin(t * 1.5) * 0.25;
    }
    if (glowRef.current) {
      const m = glowRef.current.material as THREE.MeshStandardMaterial;
      m.opacity = 0.1 + Math.sin(t * 0.8) * 0.04;
    }
    /* Light pulse ring traveling outward */
    if (pulseRingRef.current) {
      const p = (t * 0.35) % 1;
      pulseRingRef.current.scale.setScalar(0.3 + p * 1.0);
      const m = pulseRingRef.current.material as THREE.MeshStandardMaterial;
      m.opacity = (1 - p) * 0.25;
    }
  });

  return (
    <group position={[0, -0.55, 0]}>
      {/* Main disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.1, 1.15, 0.06, 64]} />
        <meshStandardMaterial {...S.plat} />
      </mesh>
      {/* Raised inner disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.8, 0.82, 0.03, 48]} />
        <meshStandardMaterial color="#0e1e20" metalness={0.65} roughness={0.3} />
      </mesh>

      {/* Outer teal rings (slow clockwise) */}
      <group ref={outerRingRef}>
        {[1.0, 0.92, 0.72].map((r, i) => (
          <mesh
            key={i}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.04, 0]}
          >
            <torusGeometry args={[r, 0.006, 8, 64]} />
            <meshStandardMaterial
              color="#2fbfb0"
              emissive="#2fbfb0"
              emissiveIntensity={0.7 - i * 0.12}
              transparent
              opacity={0.55 - i * 0.08}
            />
          </mesh>
        ))}
      </group>

      {/* Inner crimson rings (slow counter-clockwise) */}
      <group ref={innerRingRef}>
        {[0.55, 0.4, 0.25].map((r, i) => (
          <mesh
            key={i}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.045, 0]}
          >
            <torusGeometry args={[r, 0.005, 8, 48]} />
            <meshStandardMaterial
              color="#c81e3d"
              emissive="#c81e3d"
              emissiveIntensity={0.55 - i * 0.08}
              transparent
              opacity={0.45 - i * 0.06}
            />
          </mesh>
        ))}
      </group>

      {/* Cross beams */}
      {[0, Math.PI / 2].map((rot, i) => (
        <mesh
          key={i}
          ref={i === 0 ? beamRef : undefined}
          rotation={[-Math.PI / 2, rot, 0]}
          position={[0, 0.04, 0]}
        >
          <planeGeometry args={[2.0, 0.018]} />
          <meshStandardMaterial
            color="#2fbfb0"
            emissive="#2fbfb0"
            emissiveIntensity={0.4}
            transparent
            opacity={0.25}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Upward holographic glow cone */}
      <mesh ref={glowRef} position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.08, 0.65, 0.7, 32, 1, true]} />
        <meshStandardMaterial
          color="#2fbfb0"
          emissive="#2fbfb0"
          emissiveIntensity={0.2}
          transparent
          opacity={0.06}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Expanding pulse ring */}
      <mesh
        ref={pulseRingRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.05, 0]}
      >
        <torusGeometry args={[0.8, 0.008, 8, 48]} />
        <meshStandardMaterial
          color="#2fbfb0"
          emissive="#2fbfb0"
          emissiveIntensity={1.0}
          transparent
          opacity={0.2}
        />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────
   ENVIRONMENT — dark AI security lab
   ───────────────────────────────────────── */
function Environment() {
  const particleGroup = useRef<THREE.Group>(null!);

  const particles = useMemo(() => {
    const count =
      typeof window !== "undefined" && window.innerWidth < 768 ? 25 : 55;
    return Array.from({ length: count }, (_, i) => ({
      pos: [
        (Math.random() - 0.5) * 7,
        Math.random() * 5 - 1.5,
        (Math.random() - 0.5) * 5 - 2,
      ] as [number, number, number],
      speed: 0.001 + Math.random() * 0.004,
      size: 0.008 + Math.random() * 0.018,
      offset: i * 0.73,
    }));
  }, []);

  useFrame((state) => {
    if (!particleGroup.current) return;
    const t = state.clock.elapsedTime;
    particleGroup.current.children.forEach((child, i) => {
      const p = particles[i];
      if (!p) return;
      child.position.y = p.pos[1] + Math.sin(t * p.speed * 80 + p.offset) * 0.4;
    });
  });

  const structMat = useMemo(
    () => ({
      color: "#071a1c",
      metalness: 0.8,
      roughness: 0.4,
      emissive: "#0a1e20",
      emissiveIntensity: 0.04,
    }),
    []
  );

  return (
    <group>
      {/* Background structural pillars */}
      <mesh position={[-3.8, 1.2, -5.5]}>
        <boxGeometry args={[0.6, 5, 0.4]} />
        <meshStandardMaterial {...structMat} />
      </mesh>
      <mesh position={[4.0, 0.8, -6]}>
        <boxGeometry args={[0.8, 4.5, 0.35]} />
        <meshStandardMaterial {...structMat} />
      </mesh>
      <mesh position={[3.2, 3.0, -5.2]} rotation={[0, 0, 0.08]}>
        <boxGeometry args={[2.8, 0.12, 0.25]} />
        <meshStandardMaterial {...structMat} />
      </mesh>
      <mesh position={[-2.8, 2.5, -6.5]} rotation={[0, 0.4, 0]}>
        <boxGeometry args={[1.8, 3.5, 0.25]} />
        <meshStandardMaterial {...structMat} />
      </mesh>
      {/* Curved architectural arch */}
      <mesh position={[0, 3.8, -7]} rotation={[0, 0, 0]}>
        <torusGeometry args={[3, 0.08, 8, 32, Math.PI * 0.6]} />
        <meshStandardMaterial {...structMat} />
      </mesh>

      {/* Distant teal/crimson point lights */}
      <pointLight position={[-3.5, 2.5, -5]} intensity={0.2} color="#2fbfb0" />
      <pointLight position={[3.5, 1.5, -6]} intensity={0.15} color="#c81e3d" />

      {/* Subtle digital grid floor */}
      <gridHelper
        args={[14, 28, "#2fbfb0", "#2fbfb0"]}
        position={[0, -0.6, -3]}
        rotation={[0, 0, 0]}
        material-transparent={true}
        material-opacity={0.025}
      />

      {/* Floating particles */}
      <group ref={particleGroup}>
        {particles.map((p, i) => (
          <mesh key={i} position={p.pos}>
            <sphereGeometry args={[p.size, 6, 6]} />
            <meshStandardMaterial
              color="#2fbfb0"
              emissive="#2fbfb0"
              emissiveIntensity={0.6}
              transparent
              opacity={0.25 + Math.random() * 0.2}
            />
          </mesh>
        ))}
      </group>

      {/* Atmospheric haze planes */}
      <mesh position={[0, 1.5, -3.5]}>
        <planeGeometry args={[12, 7]} />
        <meshStandardMaterial
          color="#0D2B2E"
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────
   EXPORTED SCENE
   ───────────────────────────────────────── */
export default function RobotScene() {
  return (
    <div className="w-full h-full min-h-[400px] sm:min-h-[500px]">
      <Canvas
        camera={{ position: [1.3, 1.7, 3.6], fov: 38 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        style={{ background: "transparent" }}
      >
        {/* ── Studio Lighting ── */}
        {/* Ambient base fill */}
        <ambientLight intensity={0.12} color="#1e293b" />

        {/* Key light — soft cool white from upper-left */}
        <directionalLight
          position={[-4, 6, 3]}
          intensity={1.6}
          color="#e2e8f0"
        />

        {/* Rim light — strong teal from behind */}
        <pointLight position={[0, 3, -3.5]} intensity={2.0} color="#2fbfb0" />

        {/* Accent light — crimson from lower-right */}
        <pointLight position={[3, -0.5, 2]} intensity={0.9} color="#c81e3d" />

        {/* Fill from front-left */}
        <pointLight position={[-2.5, 1, 4]} intensity={0.35} color="#38d9cb" />

        {/* Platform uplight */}
        <spotLight
          position={[0, -1.2, 0]}
          angle={0.6}
          penumbra={0.9}
          intensity={1.0}
          color="#2fbfb0"
          target-position={[0, 1, 0]}
        />

        {/* Overhead spot for separation */}
        <spotLight
          position={[0, 6, 1]}
          angle={0.3}
          penumbra={0.85}
          intensity={0.5}
          color="#e2e8f0"
        />

        <Environment />
        <ScanningPlatform />
        <RobotBody />
      </Canvas>
    </div>
  );
}
