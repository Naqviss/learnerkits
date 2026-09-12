import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

class NodeFileReader {
  result = null;
  onloadend = null;

  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((result) => {
      this.result = result;
      this.onloadend?.({ target: this });
    });
  }

  readAsDataURL(blob) {
    blob.arrayBuffer().then((result) => {
      this.result = `data:${blob.type};base64,${Buffer.from(result).toString("base64")}`;
      this.onloadend?.({ target: this });
    });
  }
}

globalThis.FileReader ??= NodeFileReader;

const archivePath = path.resolve(process.argv[2] || "");
const outputPath = path.resolve(process.argv[3] || "public/models/biology/bodyparts-heart.glb");

if (!archivePath || !fs.existsSync(archivePath)) {
  console.error("Usage: node scripts/build-bodyparts-heart.mjs /path/to/partof_BP3D_4.0_obj_99.zip [output.glb]");
  process.exit(1);
}

const rightHeart = new Set([
  "FJ2417", "FJ2419", "FJ2421", "FJ2423", "FJ2424", "FJ2427",
  "FJ2430", "FJ2433", "FJ2434", "FJ2436", "FJ2437", "FJ2439",
]);
const cavity = new Set(["FJ2422", "FJ2423", "FJ2424", "FJ2425"]);
const valve = new Set(["FJ2417", "FJ2420", "FJ2421", "FJ2426", "FJ2427", "FJ2431", "FJ2433", "FJ2434", "FJ2435", "FJ2436"]);
const componentIds = [
  "FJ2417", "FJ2418", "FJ2419", "FJ2420", "FJ2421", "FJ2422",
  "FJ2423", "FJ2424", "FJ2425", "FJ2426", "FJ2427", "FJ2429",
  "FJ2430", "FJ2431", "FJ2432", "FJ2433", "FJ2434", "FJ2435",
  "FJ2436", "FJ2437", "FJ2438", "FJ2439",
];

const materials = {
  left: new THREE.MeshStandardMaterial({ name: "oxygen-rich chambers", color: 0xb84f60, roughness: 0.58, metalness: 0 }),
  right: new THREE.MeshStandardMaterial({ name: "oxygen-poor chambers", color: 0x557aa9, roughness: 0.58, metalness: 0 }),
  valve: new THREE.MeshStandardMaterial({ name: "heart valves", color: 0xd5a0a4, roughness: 0.72, metalness: 0 }),
  cavityLeft: new THREE.MeshStandardMaterial({ name: "left chamber cavities", color: 0xdc7080, roughness: 0.48, metalness: 0, transparent: true, opacity: 0.3, depthWrite: false }),
  cavityRight: new THREE.MeshStandardMaterial({ name: "right chamber cavities", color: 0x78a2d2, roughness: 0.48, metalness: 0, transparent: true, opacity: 0.3, depthWrite: false }),
};

const loader = new OBJLoader();
const heart = new THREE.Group();
heart.name = "BodyParts3D anatomical heart";
heart.userData = {
  source: "BodyParts3D 4.0",
  license: "CC BY 4.0; source OBJ headers retain the earlier CC BY-SA 2.1 Japan notice",
  credit: "BodyParts3D, © The Database Center for Life Science",
};

for (const id of componentIds) {
  const archiveEntry = `partof_BP3D_4.0_obj_99/${id}.obj`;
  const objText = execFileSync("unzip", ["-p", archivePath, archiveEntry], {
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });
  const component = loader.parse(objText);
  component.name = id;
  component.userData = { bodyParts3dFileId: id };
  component.traverse((node) => {
    if (!node.isMesh) return;
    node.name = `${id} anatomical mesh`;
    node.geometry.computeVertexNormals();
    node.geometry.computeBoundingSphere();
    node.material = cavity.has(id)
      ? (rightHeart.has(id) ? materials.cavityRight : materials.cavityLeft)
      : valve.has(id)
        ? materials.valve
        : (rightHeart.has(id) ? materials.right : materials.left);
  });
  heart.add(component);
}

const bounds = new THREE.Box3().setFromObject(heart);
const center = bounds.getCenter(new THREE.Vector3());
for (const component of heart.children) component.position.copy(center).multiplyScalar(-1);
heart.rotation.x = -Math.PI / 2;
heart.rotation.z = -0.1;
heart.scale.setScalar(0.07);
heart.updateMatrixWorld(true);

const exporter = new GLTFExporter();
const glb = await exporter.parseAsync(heart, {
  binary: true,
  onlyVisible: true,
  includeCustomExtensions: false,
});

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, Buffer.from(glb));
console.log(`Wrote ${outputPath} (${(glb.byteLength / 1024 / 1024).toFixed(2)} MB)`);
