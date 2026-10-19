import React,{useEffect,useRef} from 'react';
import * as THREE from 'three';
export default function Ritual3D(){
 const mount=useRef(null);
 useEffect(()=>{
  const host=mount.current;if(!host||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  let renderer,scene,camera,frame=0,raf=0;
  const geometries=[],materials=[];
  try{
   scene=new THREE.Scene();
   camera=new THREE.PerspectiveCamera(35,1,.1,100);camera.position.set(0,0,9);
   renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
   renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.7));
   host.appendChild(renderer.domElement);
   const parent=new THREE.Group();scene.add(parent);
   function line(points,color,opacity=.85,radius=.024){
    const material=new THREE.MeshBasicMaterial({color,transparent:true,opacity,blending:THREE.AdditiveBlending,depthWrite:false});
    materials.push(material);
    for(let i=0;i<points.length-1;i++){
     const a=new THREE.Vector3(...points[i]),b=new THREE.Vector3(...points[i+1]);
     const dir=b.clone().sub(a),geo=new THREE.CylinderGeometry(radius,radius,dir.length(),6);
     geometries.push(geo);const mesh=new THREE.Mesh(geo,material);
     mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize());parent.add(mesh);
    }
   }
   function ring(r,color,opacity,radius){
    const pts=Array.from({length:145},(_,i)=>{const a=i*Math.PI*2/144;return [Math.cos(a)*r,Math.sin(a)*r,0]});line(pts,color,opacity,radius);
   }
   ring(2.65,0xbd2c22,.75,.025);ring(2.48,0xf05a37,.65,.014);ring(2.1,0x79251e,.5,.012);
   const vertices=Array.from({length:5},(_,i)=>{const a=Math.PI/2+i*Math.PI*2/5;return [Math.cos(a)*2.03,Math.sin(a)*2.03,.07]});
   const order=[0,2,4,1,3,0];line(order.map(i=>vertices[i]),0xff633f,.92,.029);
   const embers=new THREE.Group();scene.add(embers);
   for(let i=0;i<45;i++){
    const a=i*2.399,r=2.9+((i*17)%17)/15,z=((i*11)%15)/15-.5;
    const geo=new THREE.SphereGeometry(.018+((i*3)%8)*.004,5,5);
    const mat=new THREE.MeshBasicMaterial({color:i%3?0xc54528:0xffa26a,transparent:true,opacity:.5});
    geometries.push(geo);materials.push(mat);
    const dot=new THREE.Mesh(geo,mat);dot.position.set(Math.cos(a)*r,Math.sin(a)*r,z);embers.add(dot);
   }
   parent.rotation.x=-.55;
   const resize=()=>{const w=host.clientWidth||300,h=host.clientHeight||300;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)};
   const ro=new ResizeObserver(resize);ro.observe(host);resize();
   const clock=new THREE.Clock();
   function tick(){const t=clock.getElapsedTime();parent.rotation.z=t*.13;parent.rotation.x=-.65+Math.sin(t*.7)*.13;parent.rotation.y=Math.sin(t*.36)*.16;const scale=1+Math.sin(t*2)*.018;parent.scale.setScalar(scale);embers.rotation.z=-t*.09;renderer.render(scene,camera);raf=requestAnimationFrame(tick)}tick();
   return()=>{cancelAnimationFrame(raf);ro.disconnect();geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove()};
  }catch(e){console.warn('3D unavailable',e);if(renderer){renderer.dispose();renderer.domElement?.remove()}}
 },[]);
 return <div className="ritual-canvas" ref={mount}><div className="ritual-fallback" aria-hidden="true">⛧</div></div>
}
