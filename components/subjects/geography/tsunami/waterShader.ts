// A long-wave packet over a compressed coastal scene, with small wind ripples.
// The wave does not curl like a surfing wave and this scene does not solve inundation.
export const waterVertex=`
uniform float uTime;
uniform float uCenter;
uniform float uAmplitude;
uniform float uAmplification;
uniform float uWidth;
varying vec3 vWorld;
varying vec3 vNormal;
varying float vQ;
float coast(float z){return 5.+sin(z*.13)*.9+sin(z*.31)*.3;}
float surface(vec2 p){
 float q=p.x-coast(p.y)+5.;
 float near=clamp((q+5.)/8.,0.,1.);
 float d=(q-uCenter)/uWidth;
 float trough=(d+2.6)/1.5;
 float wave=uAmplitude*mix(1.,uAmplification,near*near)*(exp(-d*d)-.28*exp(-trough*trough));
 return wave+.035*sin(p.x*1.3+p.y*.8-uTime*1.2)+.018*sin(p.y*2.7-p.x*.5-uTime*1.9);
}
void main(){
 vec3 p=position;
 p.y=surface(p.xz);
 float e=.045;
 vNormal=normalize(vec3(surface(p.xz-vec2(e,0.))-surface(p.xz+vec2(e,0.)),2.*e,surface(p.xz-vec2(0.,e))-surface(p.xz+vec2(0.,e))));
 vWorld=(modelMatrix*vec4(p,1.)).xyz;
 vQ=p.x-coast(p.z)+5.;
 gl_Position=projectionMatrix*viewMatrix*vec4(vWorld,1.);
}`;
export const waterFragment=`
uniform float uTime;
uniform float uCenter;
uniform float uAmplitude;
uniform float uWidth;
uniform vec3 uSun;
varying vec3 vWorld;
varying vec3 vNormal;
varying float vQ;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
void main(){
 if(vQ>5.)discard;
 vec3 n=normalize(vNormal);
 float detail=noise(vWorld.xz*3.+uTime*.13);
 n=normalize(n+vec3((detail-.5)*.07,0.,(noise(vWorld.zx*4.-uTime*.1)-.5)*.06));
 vec3 eye=normalize(cameraPosition-vWorld);
 float fresnel=.025+.55*pow(1.-max(dot(n,eye),0.),4.);
 float shallow=smoothstep(-9.,5.,vQ);
 vec3 deep=vec3(.025,.18,.32),shelf=vec3(.055,.45,.5);
 vec3 color=mix(deep,shelf,shallow*.83);
 color+=vec3(.015,.055,.052)*sin(vWorld.x*.8+sin(vWorld.z*.9))*shallow;
 vec3 sky=vec3(.55,.75,.87);
 color=mix(color,sky,fresnel);
 vec3 h=normalize(normalize(uSun)+eye);
 float spec=pow(max(dot(n,h),0.),160.);
 color+=vec3(1.,.93,.77)*spec*.9;
 float crestDistance=(vQ-uCenter)/max(.1,uWidth*.29);
 float crest=exp(-crestDistance*crestDistance)*smoothstep(-4.,4.,vQ)*smoothstep(.02,.1,uAmplitude);
 float fringe=(1.-smoothstep(.04,.22,abs(vQ-4.82-sin(vWorld.z*3.+uTime)*.035)));
 float foam=max(crest*(.25+.75*noise(vWorld.xz*5.)),fringe*.7);
 color=mix(color,vec3(.84,.94,.94),clamp(foam,0.,.85));
 float fog=1.-exp(-length(cameraPosition-vWorld)*.008);
 color=mix(color,vec3(.60,.77,.87),fog*.6);
 gl_FragColor=vec4(color,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
