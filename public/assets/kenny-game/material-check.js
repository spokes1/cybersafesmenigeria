// GLTFLoader can silently return null for failed texture requests. Never present that as valid Kenny artwork.
export function verifyKennyMaterials(gltf){
 let texturedMaterials=0;
 gltf.scene.traverse(object=>{
  if(!object.isMesh)return;
  for(const material of Array.isArray(object.material)?object.material:[object.material]){
   if(material.name!=='Material.002')continue;
   texturedMaterials++;
   for(const key of ['map','normalMap','roughnessMap','metalnessMap'])if(!material[key]?.source?.data)throw new Error(`Kenny texture missing: ${key}`);
   if(material.map.colorSpace!=='srgb')throw new Error('Kenny colour texture must use sRGB.');
  }
 });
 if(!texturedMaterials)throw new Error('Kenny’s textured body material was not found.');
 return texturedMaterials;
}
