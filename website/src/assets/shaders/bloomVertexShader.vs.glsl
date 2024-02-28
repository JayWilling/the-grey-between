attribute float size;
attribute vec3 customColor;

varying vec3 vColor;
varying vec2 vUv;

void main(){
    
    vColor=customColor;
    
    vec4 mvPosition=modelViewMatrix*vec4(position,1.);
    
    gl_PointSize=3.+size*(300/-mvPosition.z);
    
    gl_Position=projectionMatrix*mvPosition;
    
    vUv=uv;
    
}