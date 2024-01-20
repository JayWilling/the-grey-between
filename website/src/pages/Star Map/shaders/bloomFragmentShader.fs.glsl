uniform vec3 color;
uniform sampler2D pointTexture;
uniform sampler2D bloomTexture;
uniform sampler2D baseTexture;
uniform float alphaTest;

varying vec3 vColor;
varying vec2 vUv;

void main(){
    
    gl_FragColor=vec4(color*vColor,1);
    
    gl_FragColor=gl_FragColor*(texture2D(pointTexture,gl_PointCoord)+vec4(.5));
    
    if(gl_FragColor.a<alphaTest)discard;
    
}