export const lavaVertex = `
 varying vec2 vUv;
 void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}
`;
export const lavaFragmentShader = `
 uniform float uTime;
 uniform float uReach;
 uniform float uLake;
 varying vec2 vUv;
 float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
 void main(){
  if(uLake<.5&&vUv.y>uReach)discard;
  vec2 p=mix(vec2(vUv.x*5.,vUv.y*45.-uTime*1.8),vUv*12.-vec2(uTime*.15,uTime*.2),uLake);
  float rock=noise(p)+.32*noise(p*2.7);
  float hot=1.-smoothstep(.48,.77,rock);
  float edge=mix(smoothstep(0.,.12,vUv.x)*smoothstep(0.,.12,1.-vUv.x),1.,uLake);
  vec3 crust=vec3(.07,.019,.014);
  vec3 orange=mix(vec3(1.5,.12,.006),vec3(3.,1.2,.065),hot);
  vec3 color=mix(crust,orange,smoothstep(.14,.85,hot)*edge);
  gl_FragColor=vec4(color,1.);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
 }
`;
