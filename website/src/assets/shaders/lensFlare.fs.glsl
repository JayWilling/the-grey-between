// Based on https://www.shadertoy.com/view/4sX3Rs
uniform float iTime;
uniform vec2 lensPosition;
uniform vec2 iResolution;
uniform vec3 colorGain;
uniform float starPoints;
uniform float glareSize;
uniform float flareSize;
uniform float flareSpeed;
uniform float flareShape;
uniform float haloScale;
uniform float opacity;
uniform bool animated;
uniform bool anamorphic;
uniform bool enabled;
uniform bool secondaryGhosts;
uniform bool starBurst;
uniform float ghostScale;
uniform bool aditionalStreaks;
uniform sampler2D lensDirtTexture;
varying vec2 vUv;

float uDispersal=.3;
float uHaloWidth=.6;
float uDistortion=1.5;
float uBrightDark=.5;
vec2 vTexCoord;

float rand(float n){return fract(sin(n)*43758.5453123);}

float noise(float p){
    float fl=floor(p);
    float fc=fract(p);
    return mix(rand(fl),rand(fl+1.),fc);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 k=vec4(1.,2./3.,1./3.,3.);
    vec3 p=abs(fract(c.xxx+k.xyz)*6.-k.www);
    return c.z*mix(k.xxx,clamp(p-k.xxx,0.,1.),c.y);
}

float saturate2(float x)
{
    return clamp(x,0.,1.);
}

vec2 rotateUV(vec2 uv,float rotation)
{
    return vec2(
        cos(rotation)*uv.x+sin(rotation)*uv.y,
        cos(rotation)*uv.y-sin(rotation)*uv.x
    );
}

// Based on https://www.shadertoy.com/view/XtKfRV
vec3 drawflare(vec2 p,float intensity,float rnd,float speed,int id)
{
    float flarehueoffset=(1./32.)*float(id)*.1;
    float lingrad=distance(vec2(0.),p);
    float expgrad=1./exp(lingrad*(fract(rnd)*.66+.33));
    vec3 colgrad=hsv2rgb(vec3(fract((expgrad*8.)+speed*flareSpeed+flarehueoffset),pow(1.-abs(expgrad*2.-1.),.45),20.*expgrad*intensity));//rainbow spectrum effect
    
    float internalStarPoints;
    
    if(anamorphic){
        internalStarPoints=1.;
    }else{
        internalStarPoints=starPoints;
    }
    
    float blades=length(p*flareShape*sin(internalStarPoints*atan(p.x,p.y)));//draw 6 blades
    
    float comp=pow(1.-saturate2(blades),(anamorphic?100.:12.));
    comp+=saturate2(expgrad-.9)*3.;
    comp=pow(comp*expgrad,8.+(1.-intensity)*5.);
    
    if(flareSpeed>0.){
        return vec3(comp)*colgrad;
    }else{
        return vec3(comp)*flareSize*15.;
    }
}

float dist(vec3 a,vec3 b){return abs(a.x-b.x)+abs(a.y-b.y)+abs(a.z-b.z);}

float glare(vec2 uv,vec2 pos,float size)
{
    vec2 main;
    
    if(animated){
        main=rotateUV(uv-pos,iTime*.1);
    }else{
        main=uv-pos;
    }
    
    float ang=atan(main.y,main.x)*(anamorphic?1.:starPoints);
    float dist=length(main);
    dist=pow(dist,.9);
    
    float f0=1./(length(uv-pos)*(1./size*16.)+.2);
    
    return f0+f0*(sin((ang))*.2+.3);
}

//https://www.shadertoy.com/view/Xd2GR3
float sdHex(vec2 p){
    p=abs(p);
    vec2 q=vec2(p.x*2.*.5773503,p.y+p.x*.5773503);
    return dot(step(q.xy,q.yx),1.-q.yx);
}

//fakes x^n for specular effects (k is 0-1)
float fpow(float x,float k){
    return x>k?pow((x-k)/(1.-k),2.):0.;
}

vec3 renderhex(vec2 uv,vec2 p,float s,vec3 col){
    uv-=p;
    if(abs(uv.x)<.2*s&&abs(uv.y)<.2*s){
        return mix(vec3(0),mix(vec3(0),col,.1+fpow(length(uv/s),.1)*10.),smoothstep(0.,.1,sdHex(uv*20./s)));
    }
    return vec3(0);
}

vec3 LensFlare(vec2 uv,vec2 pos)
{
    vec2 main=uv-pos;
    vec2 uvd=uv*(length(uv));
    
    float ang=atan(main.x,main.y);
    
    float f0=.3/(length(uv-pos)*16.+1.);
    
    f0=f0*(sin(noise(sin(ang*3.9-(animated?iTime:0.)*.3)*starPoints))*.2);
    
    float f1=max(.01-pow(length(uv+1.2*pos),1.9),.0)*7.;
    
    float f2=max(.9/(10.+32.*pow(length(uvd+.99*pos),2.)),.0)*.35;
    float f22=max(.9/(11.+32.*pow(length(uvd+.85*pos),2.)),.0)*.23;
    float f23=max(.9/(12.+32.*pow(length(uvd+.95*pos),2.)),.0)*.6;
    
    vec2 uvx=mix(uv,uvd,.1);
    
    float f4=max(.01-pow(length(uvx+.4*pos),2.9),.0)*4.02;
    float f42=max(0.-pow(length(uvx+.45*pos),2.9),.0)*4.1;
    float f43=max(.01-pow(length(uvx+.5*pos),2.9),.0)*4.6;
    
    uvx=mix(uv,uvd,-.4);
    
    float f5=max(.01-pow(length(uvx+.1*pos),5.5),.0)*2.;
    float f52=max(.01-pow(length(uvx+.2*pos),5.5),.0)*2.;
    float f53=max(.01-pow(length(uvx+.1*pos),5.5),.0)*2.;
    
    uvx=mix(uv,uvd,2.1);
    
    float f6=max(.01-pow(length(uvx-.3*pos),1.61),.0)*3.159;
    float f62=max(.01-pow(length(uvx-.325*pos),1.614),.0)*3.14;
    float f63=max(.01-pow(length(uvx-.389*pos),1.623),.0)*3.12;
    
    vec3 c=vec3(glare(uv,pos,glareSize));
    
    vec2 prot;
    
    if(animated){
        prot=rotateUV(uv-pos,(iTime*.1));
    }else if(anamorphic){
        prot=rotateUV(uv-pos,1.570796);
    }else{
        prot=uv-pos;
    }
    
    c+=drawflare(prot,(anamorphic?flareSize*10.:flareSize),.1,iTime,1);
    
    c.r+=f1+f2+f4+f5+f6;c.g+=f1+f22+f42+f52+f62;c.b+=f1+f23+f43+f53+f63;
    c=c*1.3*vec3(length(uvd)+.09);// Vignette
    c+=vec3(f0);
    
    return c;
}

vec3 cc(vec3 color,float factor,float factor2)
{
    float w=color.x+color.y+color.z;
    return mix(color,vec3(w)*factor,w*factor2);
}

float rnd(vec2 p)
{
    float f=fract(sin(dot(p,vec2(12.1234,72.8392))*45123.2));
    return f;
}

float rnd(float w)
{
    float f=fract(sin(w)*1000.);
    return f;
}

float regShape(vec2 p,int N)
{
    float f;
    
    float a=atan(p.x,p.y)+.2;
    float b=6.28319/float(N);
    f=smoothstep(.5,.51,cos(floor(.5+a/b)*b-a)*length(p.xy)*2.-ghostScale);
    
    return f;
}

// Based on https://www.shadertoy.com/view/Xlc3D2
vec3 circle(vec2 p,float size,float decay,vec3 color,vec3 color2,float dist,vec2 mouse)
{
    float l=length(p+mouse*(dist*2.))+size/2.;
    float l2=length(p+mouse*(dist*4.))+size/3.;
    
    float c=max(.04-pow(length(p+mouse*dist),size*ghostScale),0.)*10.;
    float c1=max(.001-pow(l-.3,1./40.)+sin(l*20.),0.)*3.;
    float c2=max(.09/pow(length(p-mouse*dist/.5)*1.,.95),0.)/20.;
    float s=max(.02-pow(regShape(p*5.+mouse*dist*5.+decay,6),1.),0.)*1.5;
    
    color=cos(vec3(colorGain))*.5+.5;
    vec3 f=c*color;
    f+=c1*color;
    f+=c2*color;
    f+=s*color;
    return f;
}

vec4 getLensColor(float x){
    return vec4(vec3(mix(mix(mix(mix(mix(mix(mix(mix(mix(mix(mix(mix(mix(mix(mix(vec3(0.,0.,0.),
    vec3(0.,0.,0.),smoothstep(0.,.063,x)),
    vec3(0.,0.,0.),smoothstep(.063,.125,x)),
    vec3(0.,0.,0.),smoothstep(.125,.188,x)),
    vec3(.188,.131,.116),smoothstep(.188,.227,x)),
    vec3(.31,.204,.537),smoothstep(.227,.251,x)),
    vec3(.192,.106,.286),smoothstep(.251,.314,x)),
    vec3(.102,.008,.341),smoothstep(.314,.392,x)),
    vec3(.086,0.,.141),smoothstep(.392,.502,x)),
    vec3(1.,.31,0.),smoothstep(.502,.604,x)),
    vec3(.1,.1,.1),smoothstep(.604,.643,x)),
    vec3(1.,.929,0.),smoothstep(.643,.761,x)),
    vec3(1.,.086,.424),smoothstep(.761,.847,x)),
    vec3(1.,.49,0.),smoothstep(.847,.89,x)),
    vec3(.945,.275,.475),smoothstep(.89,.941,x)),
    vec3(.251,.275,.796),smoothstep(.941,1.,x))),
1.);
}

float dirtNoise(vec2 p){
vec2 f=fract(p);
f=(f*f)*(3.-(2.*f));
float n=dot(floor(p),vec2(1.,157.));
vec4 a=fract(sin(vec4(n+0.,n+1.,n+157.,n+158.))*43758.5453123);
return mix(mix(a.x,a.y,f.x),mix(a.z,a.w,f.x),f.y);
}

float fbm(vec2 p){
const mat2 m=mat2(.80,-.60,.60,.80);
float f=0.;
f+=.5000*dirtNoise(p);p=m*p*2.02;
f+=.2500*dirtNoise(p);p=m*p*2.03;
f+=.1250*dirtNoise(p);p=m*p*2.01;
f+=.0625*dirtNoise(p);
return f/.9375;
}
vec4 getLensStar(vec2 p){
vec2 pp=(p-vec2(.5))*2.;
float a=atan(pp.y,pp.x);
vec4 cp=vec4(sin(a*1.),length(pp),sin(a*13.),sin(a*53.));
float d=sin(clamp(pow(length(vec2(.5)-p)*.5+haloScale/2.,5.),0.,1.)*3.14159);
vec3 c=vec3(d)*vec3(fbm(cp.xy*16.)*fbm(cp.zw*9.)*max(max(max(max(.5,sin(a*1.)),sin(a*3.)*.8),sin(a*7.)*.8),sin(a*9.)*10.6));
c*=vec3(mix(2.,(sin(length(pp.xy)*256.)*.5)+.5,sin((clamp((length(pp.xy)-.875)/.1,0.,1.)+0.)*2.*3.14159)*1.5)+.5)*.3275;
return vec4(vec3(c*1.),d);
}

vec4 getLensDirt(vec2 p){
p.xy+=vec2(fbm(p.yx*3.),fbm(p.yx*2.))*.0825;
vec3 o=vec3(mix(.125,.25,max(max(smoothstep(.1,0.,length(p-vec2(.25))),
smoothstep(.4,0.,length(p-vec2(.75)))),
smoothstep(.8,0.,length(p-vec2(.875,.125))))));
o+=vec3(max(fbm(p*1.)-.5,0.))*.5;
o+=vec3(max(fbm(p*2.)-.5,0.))*.5;
o+=vec3(max(fbm(p*4.)-.5,0.))*.25;
o+=vec3(max(fbm(p*8.)-.75,0.))*1.;
o+=vec3(max(fbm(p*16.)-.75,0.))*.75;
o+=vec3(max(fbm(p*64.)-.75,0.))*.5;
return vec4(clamp(o,vec3(.15),vec3(1.)),1.);
}

vec4 textureLimited(sampler2D tex,vec2 texCoord){
if(((texCoord.x<0.)||(texCoord.y<0.))||((texCoord.x>1.)||(texCoord.y>1.))){
    return vec4(0.);
}else{
    return texture(tex,texCoord);
}
}

vec4 textureDistorted(sampler2D tex,vec2 texCoord,vec2 direction,vec3 distortion){
return vec4(textureLimited(tex,(texCoord+(direction*distortion.r))).r,
textureLimited(tex,(texCoord+(direction*distortion.g))).g,
textureLimited(tex,(texCoord+(direction*distortion.b))).b,
1.);
}

vec4 getStartBurst(){
vec2 aspectTexCoord=vec2(1.)-(((vTexCoord-vec2(.5))*vec2(1.))+vec2(.5));
vec2 texCoord=vec2(1.)-vTexCoord;
vec2 ghostVec=(vec2(.5)-texCoord)*uDispersal-lensPosition;
vec2 ghostVecAspectNormalized=normalize(ghostVec*vec2(1.))*vec2(1.);
vec2 haloVec=normalize(ghostVec)*uHaloWidth;
vec2 haloVecAspectNormalized=ghostVecAspectNormalized*uHaloWidth;
vec2 texelSize=vec2(1.)/vec2(iResolution.xy);
vec3 distortion=vec3(-(texelSize.x*uDistortion),.2,texelSize.x*uDistortion);
vec4 c=vec4(0.);
for(int i=0;i<8;i++){
vec2 offset=texCoord+(ghostVec*float(i));
c+=textureDistorted(lensDirtTexture,offset,ghostVecAspectNormalized,distortion)*pow(max(0.,1.-(length(vec2(.5)-offset)/length(vec2(.5)))),10.);
}
vec2 haloOffset=texCoord+haloVecAspectNormalized;
return(c*getLensColor((length(vec2(.5)-aspectTexCoord)/length(vec2(haloScale)))))+
(textureDistorted(lensDirtTexture,haloOffset,ghostVecAspectNormalized,distortion)*pow(max(0.,1.-(length(vec2(.5)-haloOffset)/length(vec2(.5)))),10.));
}

void main()
{
vec2 uv=vUv;
vec2 myUV=uv-.5;
myUV.y*=iResolution.y/iResolution.x;
vec2 mouse=lensPosition*.5;
mouse.y*=iResolution.y/iResolution.x;

//First LensFlarePass
vec3 finalColor=LensFlare(myUV,mouse)*20.*colorGain/2.;

//Aditional Streaks
if(aditionalStreaks){
vec3 circColor=vec3(.9,.2,.1);
vec3 circColor2=vec3(.3,.1,.9);

for(float i=0.;i<10.;i++){
    finalColor+=circle(myUV,pow(rnd(i*2000.)*2.8,.1)+1.41,0.,circColor+i,circColor2+i,rnd(i*20.)*3.+.2-.5,lensPosition);
}
}

//Alternative Ghosts
if(secondaryGhosts){
vec3 altGhosts=vec3(.1);
altGhosts+=renderhex(myUV,-lensPosition*.25,ghostScale*1.4,vec3(.03)*colorGain);
altGhosts+=renderhex(myUV,lensPosition*.25,ghostScale*.5,vec3(.03)*colorGain);
altGhosts+=renderhex(myUV,lensPosition*.1,ghostScale*1.6,vec3(.03)*colorGain);
altGhosts+=renderhex(myUV,lensPosition*1.8,ghostScale*2.,vec3(.03)*colorGain);
altGhosts+=renderhex(myUV,lensPosition*1.25,ghostScale*.8,vec3(.03)*colorGain);
altGhosts+=renderhex(myUV,-lensPosition*1.25,ghostScale*5.,vec3(.03)*colorGain);

//Circular ghost
altGhosts+=fpow(1.-abs(distance(lensPosition*.8,myUV)-.5),.985)*vec3(.1);
altGhosts+=fpow(1.-abs(distance(lensPosition*.4,myUV)-.2),.994)*vec3(.05);
finalColor+=altGhosts;
}

//Starburst
if(starBurst){
vTexCoord=myUV+.5;
vec4 lensMod=getLensDirt(myUV);
float tooBright=1.-(clamp(uBrightDark,0.,.5)*2.);
float tooDark=clamp(uBrightDark-.5,0.,.5)*2.;
lensMod+=mix(lensMod,pow(lensMod*2.,vec4(2.))*.5,tooBright);
float lensStarRotationAngle=((myUV.x+myUV.y))*(1./6.);
vec2 lensStarTexCoord=(mat2(cos(lensStarRotationAngle),-sin(lensStarRotationAngle),sin(lensStarRotationAngle),cos(lensStarRotationAngle))*vTexCoord);
lensMod+=getLensStar(lensStarTexCoord)*2.;

finalColor+=clamp((lensMod.rgb*getStartBurst().rgb),.01,1.);
}

//Final composed output
if(enabled){

gl_FragColor=vec4(finalColor,mix(finalColor,vec3(1.),1.)*opacity);

#include<tonemapping_fragment>
#include<colorspace_fragment>
}
}