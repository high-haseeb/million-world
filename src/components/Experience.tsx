import { useEffect, useRef, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, MapControls, Stats, useTexture } from "@react-three/drei";
import * as THREE from 'three';

const Experience = () => {
    return (
        <Canvas className="w-full h-full" camera={{ fov: 20, position: [0, 2, 2] }}>
            <Environment preset="city" />
            <Stats />
            <Ground />
            <MapControls makeDefault enableRotate={false} enableZoom={true} minDistance={2} enableDamping={true} dampingFactor={0.1} />
            <Pictures />
        </Canvas>
    )
}

const Ground = () => {
    const map = useTexture('map.svg');
    const planeRef = useRef<THREE.Mesh | null>(null);
    useEffect(() => {
        console.log("map dimensions", map.image.width, map.image.height);
        if (planeRef.current) {
            planeRef.current.scale.set(map.image.width / 1000, map.image.height / 1000, 1.0);
        }
    }, [map]);
    return (
        <mesh ref={planeRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} >
            <planeGeometry args={[1, 1, 1, 1]} />
            <meshStandardMaterial map={map} />
        </mesh>
    )
};



const Pictures = () => {
    const catTexture = useTexture("/cat.webp");
    const count = 10000;
    const meshRef = useRef<THREE.InstancedMesh>(null);

    const positions = useMemo<[number, number, number][]>(() => {
        return Array.from({ length: count }, () => [
            (Math.random() * 2 - 1) * 2, // X position
            0.5,                        // Y position
            (Math.random() * 2 - 1) * 1.5, // Z position
        ]);
    }, [count]);

    useEffect(() => {
        if (meshRef.current) {
            positions.forEach((pos, i) => {
                const matrix = new THREE.Matrix4();
                matrix.setPosition(...pos);
                meshRef.current!.setMatrixAt(i, matrix);
            });
            meshRef.current.instanceMatrix.needsUpdate = true;
        }
    }, [positions, meshRef.current]);

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]} position={[0, 0.0, 0]}>
            <planeGeometry args={[0.1, 0.1, 1, 1]} />
            <meshBasicMaterial map={catTexture} />
        </instancedMesh>
    );
};

export default Experience
