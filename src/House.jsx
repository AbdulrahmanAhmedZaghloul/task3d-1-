
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const House = () => {
  const mountRef = useRef(null);
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // انا هنا بحدد ابعاد الكاميره

    camera.position.set(40, 20, 60);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // انا هنا حدد الارضيه ولونها وحجمها 
    const floorGeometry = new THREE.PlaneGeometry(80, 80);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x8c8c8c });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

    // دالة لإنشاء الحائط مع النافذة والباب

    const createWallWithWindows = (x, y, z, isHorizontal = false, hasDoor = false) => {
      const wallGeometry = new THREE.BoxGeometry(15, 10, 0.5); // جدار
      const wall = new THREE.Mesh(wallGeometry, wallMaterial);
      wall.position.set(x, y, z);
      if (isHorizontal) wall.rotation.y = Math.PI / 2;

      scene.add(wall);

      const createWindow = (xOffset) => {
        const frameGeometry = new THREE.BoxGeometry(2.5, 2.5, 0.1); // إطار النافذة
        const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.set(xOffset, 9.5, 7.9); // ضبط موضع النافذة

        const glassGeometry = new THREE.BoxGeometry(2.3, 2.3, 0.1); // زجاج النافذة
        const glassMaterial = new THREE.MeshStandardMaterial({
          color: 0x87ceeb,
          opacity: 0.6,
          transparent: true,
        });
        const glass = new THREE.Mesh(glassGeometry, glassMaterial);
        glass.position.set(0, 0, 0.05); // ضبط موضع الزجاج
        frame.add(glass);

        return frame;
      };
      const createWindow1 = (xOffset) => {
        const frameGeometry = new THREE.BoxGeometry(2.5, 2.5, 0.1); // إطار النافذة
        const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.set(xOffset, 16, 7.9); // ضبط موضع النافذة

        const glassGeometry = new THREE.BoxGeometry(2.3, 2.3, 0.1); // زجاج النافذة
        const glassMaterial = new THREE.MeshStandardMaterial({
          color: 0x87ceeb,
          opacity: 0.6,
          transparent: true,
        });
        const glass = new THREE.Mesh(glassGeometry, glassMaterial);
        glass.position.set(0, 0, 0.05); // ضبط موضع الزجاج
        frame.add(glass);

        return frame;
      };

      // وضع الشبابيك في الجدار
      const window1 = createWindow(-5); // نافذة على اليسار
      const window2 = createWindow(5); // نافذة على اليمين
      scene.add(window1);
      scene.add(window2);

      const window3 = createWindow1(-5); // نافذة على اليسار
      const window4 = createWindow1(5); // نافذة على اليمين
      scene.add(window3);
      scene.add(window4);

      if (hasDoor) {
        const doorGeometry = new THREE.BoxGeometry(3, 6, 0.1); // باب
        const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.set(0, 3, 7.9); // ضبط موضع الباب
        scene.add(door);
      }
    };


    // الطابق الأول - جدران
    createWallWithWindows(0, 5, -7.5, false, true); // الجدار الأمامي مع الباب
    createWallWithWindows(0, 5, 7.5); // الجدار الخلفي
    createWallWithWindows(-7.5, 5, 0, true); // الجدار الأيسر
    createWallWithWindows(7.5, 5, 0, true); // الجدار الأيمن

    // الأرضية بين الطابقين
    const secondFloorGeometry = new THREE.BoxGeometry(15, 0.5, 15);
    const secondFloor = new THREE.Mesh(secondFloorGeometry, wallMaterial);
    secondFloor.position.set(0, 10, 0);
    scene.add(secondFloor);

    // الطابق الثاني - جدران
    createWallWithWindows(0, 15, -7.5); // الجدار الأمامي
    createWallWithWindows(0, 15, 7.5); // الجدار الخلفي
    createWallWithWindows(-7.5, 15, 0, true); // الجدار الأيسر
    createWallWithWindows(7.5, 15, 0, true); // الجدار الأيمن

    // السقف
    const roofGeometry = new THREE.ConeGeometry(10, 5, 4);
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(0, 22.5, 0);
    roof.rotation.y = Math.PI / 4;
    scene.add(roof);

    // الإضاءة
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);
  return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default House;
