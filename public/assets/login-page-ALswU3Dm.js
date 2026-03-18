import{c as U,r as g,j as o,X as L,a as C,Y as j,Z as B}from"./index-c061DRs1.js";import{m as _,S as D,M as F,A as W}from"./proxy-rgyxgoCE.js";import{A as H}from"./arrow-right-CXSksF9P.js";const G=[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]],$=U("eye-off",G);const X=[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],Y=U("eye",X);const q=[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]],Z=U("user",q),K=`#version 300 es
precision mediump float;

layout(location = 0) in vec4 a_position;

uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_imageAspectRatio;
uniform float u_originX;
uniform float u_originY;
uniform float u_worldWidth;
uniform float u_worldHeight;
uniform float u_fit;
uniform float u_scale;
uniform float u_rotation;
uniform float u_offsetX;
uniform float u_offsetY;

out vec2 v_objectUV;
out vec2 v_objectBoxSize;
out vec2 v_responsiveUV;
out vec2 v_responsiveBoxGivenSize;
out vec2 v_patternUV;
out vec2 v_patternBoxSize;
out vec2 v_imageUV;

vec3 getBoxSize(float boxRatio, vec2 givenBoxSize) {
  vec2 box = vec2(0.);
  // fit = none
  box.x = boxRatio * min(givenBoxSize.x / boxRatio, givenBoxSize.y);
  float noFitBoxWidth = box.x;
  if (u_fit == 1.) { // fit = contain
    box.x = boxRatio * min(u_resolution.x / boxRatio, u_resolution.y);
  } else if (u_fit == 2.) { // fit = cover
    box.x = boxRatio * max(u_resolution.x / boxRatio, u_resolution.y);
  }
  box.y = box.x / boxRatio;
  return vec3(box, noFitBoxWidth);
}

void main() {
  gl_Position = a_position;

  vec2 uv = gl_Position.xy * .5;
  vec2 boxOrigin = vec2(.5 - u_originX, u_originY - .5);
  vec2 givenBoxSize = vec2(u_worldWidth, u_worldHeight);
  givenBoxSize = max(givenBoxSize, vec2(1.)) * u_pixelRatio;
  float r = u_rotation * 3.14159265358979323846 / 180.;
  mat2 graphicRotation = mat2(cos(r), sin(r), -sin(r), cos(r));
  vec2 graphicOffset = vec2(-u_offsetX, u_offsetY);


  // ===================================================

  float fixedRatio = 1.;
  vec2 fixedRatioBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );

  v_objectBoxSize = getBoxSize(fixedRatio, fixedRatioBoxGivenSize).xy;
  vec2 objectWorldScale = u_resolution.xy / v_objectBoxSize;

  v_objectUV = uv;
  v_objectUV *= objectWorldScale;
  v_objectUV += boxOrigin * (objectWorldScale - 1.);
  v_objectUV += graphicOffset;
  v_objectUV /= u_scale;
  v_objectUV = graphicRotation * v_objectUV;

  // ===================================================

  v_responsiveBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );
  float responsiveRatio = v_responsiveBoxGivenSize.x / v_responsiveBoxGivenSize.y;
  vec2 responsiveBoxSize = getBoxSize(responsiveRatio, v_responsiveBoxGivenSize).xy;
  vec2 responsiveBoxScale = u_resolution.xy / responsiveBoxSize;

  #ifdef ADD_HELPERS
  v_responsiveHelperBox = uv;
  v_responsiveHelperBox *= responsiveBoxScale;
  v_responsiveHelperBox += boxOrigin * (responsiveBoxScale - 1.);
  #endif

  v_responsiveUV = uv;
  v_responsiveUV *= responsiveBoxScale;
  v_responsiveUV += boxOrigin * (responsiveBoxScale - 1.);
  v_responsiveUV += graphicOffset;
  v_responsiveUV /= u_scale;
  v_responsiveUV.x *= responsiveRatio;
  v_responsiveUV = graphicRotation * v_responsiveUV;
  v_responsiveUV.x /= responsiveRatio;

  // ===================================================

  float patternBoxRatio = givenBoxSize.x / givenBoxSize.y;
  vec2 patternBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );
  patternBoxRatio = patternBoxGivenSize.x / patternBoxGivenSize.y;

  vec3 boxSizeData = getBoxSize(patternBoxRatio, patternBoxGivenSize);
  v_patternBoxSize = boxSizeData.xy;
  float patternBoxNoFitBoxWidth = boxSizeData.z;
  vec2 patternBoxScale = u_resolution.xy / v_patternBoxSize;

  v_patternUV = uv;
  v_patternUV += graphicOffset / patternBoxScale;
  v_patternUV += boxOrigin;
  v_patternUV -= boxOrigin / patternBoxScale;
  v_patternUV *= u_resolution.xy;
  v_patternUV /= u_pixelRatio;
  if (u_fit > 0.) {
    v_patternUV *= (patternBoxNoFitBoxWidth / v_patternBoxSize.x);
  }
  v_patternUV /= u_scale;
  v_patternUV = graphicRotation * v_patternUV;
  v_patternUV += boxOrigin / patternBoxScale;
  v_patternUV -= boxOrigin;
  // x100 is a default multiplier between vertex and fragmant shaders
  // we use it to avoid UV presision issues
  v_patternUV *= .01;

  // ===================================================

  vec2 imageBoxSize;
  if (u_fit == 1.) { // contain
    imageBoxSize.x = min(u_resolution.x / u_imageAspectRatio, u_resolution.y) * u_imageAspectRatio;
  } else if (u_fit == 2.) { // cover
    imageBoxSize.x = max(u_resolution.x / u_imageAspectRatio, u_resolution.y) * u_imageAspectRatio;
  } else {
    imageBoxSize.x = min(10.0, 10.0 / u_imageAspectRatio * u_imageAspectRatio);
  }
  imageBoxSize.y = imageBoxSize.x / u_imageAspectRatio;
  vec2 imageBoxScale = u_resolution.xy / imageBoxSize;

  v_imageUV = uv;
  v_imageUV *= imageBoxScale;
  v_imageUV += boxOrigin * (imageBoxScale - 1.);
  v_imageUV += graphicOffset;
  v_imageUV /= u_scale;
  v_imageUV.x *= u_imageAspectRatio;
  v_imageUV = graphicRotation * v_imageUV;
  v_imageUV.x /= u_imageAspectRatio;

  v_imageUV += .5;
  v_imageUV.y = 1. - v_imageUV.y;
}`,M=1920*1080*4;let Q=class{parentElement;canvasElement;gl;program=null;uniformLocations={};fragmentShader;rafId=null;lastRenderTime=0;currentFrame=0;speed=0;currentSpeed=0;providedUniforms;mipmaps=[];hasBeenDisposed=!1;resolutionChanged=!0;textures=new Map;minPixelRatio;maxPixelCount;isSafari=te();uniformCache={};textureUnitMap=new Map;ownerDocument;constructor(e,s,r,c,a=0,i=0,l=2,u=M,n=[]){if(e?.nodeType===1)this.parentElement=e;else throw new Error("Paper Shaders: parent element must be an HTMLElement");if(this.ownerDocument=e.ownerDocument,!this.ownerDocument.querySelector("style[data-paper-shader]")){const m=this.ownerDocument.createElement("style");m.innerHTML=ee,m.setAttribute("data-paper-shader",""),this.ownerDocument.head.prepend(m)}const h=this.ownerDocument.createElement("canvas");this.canvasElement=h,this.parentElement.prepend(h),this.fragmentShader=s,this.providedUniforms=r,this.mipmaps=n,this.currentFrame=i,this.minPixelRatio=l,this.maxPixelCount=u;const f=h.getContext("webgl2",c);if(!f)throw new Error("Paper Shaders: WebGL is not supported in this browser");this.gl=f,this.initProgram(),this.setupPositionAttribute(),this.setupUniforms(),this.setUniformValues(this.providedUniforms),this.setupResizeObserver(),visualViewport?.addEventListener("resize",this.handleVisualViewportChange),this.setSpeed(a),this.parentElement.setAttribute("data-paper-shader",""),this.parentElement.paperShaderMount=this,this.ownerDocument.addEventListener("visibilitychange",this.handleDocumentVisibilityChange)}initProgram=()=>{const e=J(this.gl,K,this.fragmentShader);e&&(this.program=e)};setupPositionAttribute=()=>{const e=this.gl.getAttribLocation(this.program,"a_position"),s=this.gl.createBuffer();this.gl.bindBuffer(this.gl.ARRAY_BUFFER,s);const r=[-1,-1,1,-1,-1,1,-1,1,1,-1,1,1];this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array(r),this.gl.STATIC_DRAW),this.gl.enableVertexAttribArray(e),this.gl.vertexAttribPointer(e,2,this.gl.FLOAT,!1,0,0)};setupUniforms=()=>{const e={u_time:this.gl.getUniformLocation(this.program,"u_time"),u_pixelRatio:this.gl.getUniformLocation(this.program,"u_pixelRatio"),u_resolution:this.gl.getUniformLocation(this.program,"u_resolution")};Object.entries(this.providedUniforms).forEach(([s,r])=>{if(e[s]=this.gl.getUniformLocation(this.program,s),r instanceof HTMLImageElement){const c=`${s}AspectRatio`;e[c]=this.gl.getUniformLocation(this.program,c)}}),this.uniformLocations=e};renderScale=1;parentWidth=0;parentHeight=0;parentDevicePixelWidth=0;parentDevicePixelHeight=0;devicePixelsSupported=!1;resizeObserver=null;setupResizeObserver=()=>{this.resizeObserver=new ResizeObserver(([e])=>{if(e?.borderBoxSize[0]){const s=e.devicePixelContentBoxSize?.[0];s!==void 0&&(this.devicePixelsSupported=!0,this.parentDevicePixelWidth=s.inlineSize,this.parentDevicePixelHeight=s.blockSize),this.parentWidth=e.borderBoxSize[0].inlineSize,this.parentHeight=e.borderBoxSize[0].blockSize}this.handleResize()}),this.resizeObserver.observe(this.parentElement)};handleVisualViewportChange=()=>{this.resizeObserver?.disconnect(),this.setupResizeObserver()};handleResize=()=>{let e=0,s=0;const r=Math.max(1,window.devicePixelRatio),c=visualViewport?.scale??1;if(this.devicePixelsSupported){const h=Math.max(1,this.minPixelRatio/r);e=this.parentDevicePixelWidth*h*c,s=this.parentDevicePixelHeight*h*c}else{let h=Math.max(r,this.minPixelRatio)*c;if(this.isSafari){const f=ie(this.ownerDocument);h*=Math.max(1,f)}e=Math.round(this.parentWidth)*h,s=Math.round(this.parentHeight)*h}const a=Math.sqrt(this.maxPixelCount)/Math.sqrt(e*s),i=Math.min(1,a),l=Math.round(e*i),u=Math.round(s*i),n=l/Math.round(this.parentWidth);(this.canvasElement.width!==l||this.canvasElement.height!==u||this.renderScale!==n)&&(this.renderScale=n,this.canvasElement.width=l,this.canvasElement.height=u,this.resolutionChanged=!0,this.gl.viewport(0,0,this.gl.canvas.width,this.gl.canvas.height),this.render(performance.now()))};render=e=>{if(this.hasBeenDisposed)return;if(this.program===null){console.warn("Tried to render before program or gl was initialized");return}const s=e-this.lastRenderTime;this.lastRenderTime=e,this.currentSpeed!==0&&(this.currentFrame+=s*this.currentSpeed),this.gl.clear(this.gl.COLOR_BUFFER_BIT),this.gl.useProgram(this.program),this.gl.uniform1f(this.uniformLocations.u_time,this.currentFrame*.001),this.resolutionChanged&&(this.gl.uniform2f(this.uniformLocations.u_resolution,this.gl.canvas.width,this.gl.canvas.height),this.gl.uniform1f(this.uniformLocations.u_pixelRatio,this.renderScale),this.resolutionChanged=!1),this.gl.drawArrays(this.gl.TRIANGLES,0,6),this.currentSpeed!==0?this.requestRender():this.rafId=null};requestRender=()=>{this.rafId!==null&&cancelAnimationFrame(this.rafId),this.rafId=requestAnimationFrame(this.render)};setTextureUniform=(e,s)=>{if(!s.complete||s.naturalWidth===0)throw new Error(`Paper Shaders: image for uniform ${e} must be fully loaded`);const r=this.textures.get(e);r&&this.gl.deleteTexture(r),this.textureUnitMap.has(e)||this.textureUnitMap.set(e,this.textureUnitMap.size);const c=this.textureUnitMap.get(e);this.gl.activeTexture(this.gl.TEXTURE0+c);const a=this.gl.createTexture();this.gl.bindTexture(this.gl.TEXTURE_2D,a),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MAG_FILTER,this.gl.LINEAR),this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,s),this.mipmaps.includes(e)&&(this.gl.generateMipmap(this.gl.TEXTURE_2D),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR_MIPMAP_LINEAR));const i=this.gl.getError();if(i!==this.gl.NO_ERROR||a===null){console.error("Paper Shaders: WebGL error when uploading texture:",i);return}this.textures.set(e,a);const l=this.uniformLocations[e];if(l){this.gl.uniform1i(l,c);const u=`${e}AspectRatio`,n=this.uniformLocations[u];if(n){const h=s.naturalWidth/s.naturalHeight;this.gl.uniform1f(n,h)}}};areUniformValuesEqual=(e,s)=>e===s?!0:Array.isArray(e)&&Array.isArray(s)&&e.length===s.length?e.every((r,c)=>this.areUniformValuesEqual(r,s[c])):!1;setUniformValues=e=>{this.gl.useProgram(this.program),Object.entries(e).forEach(([s,r])=>{let c=r;if(r instanceof HTMLImageElement&&(c=`${r.src.slice(0,200)}|${r.naturalWidth}x${r.naturalHeight}`),this.areUniformValuesEqual(this.uniformCache[s],c))return;this.uniformCache[s]=c;const a=this.uniformLocations[s];if(!a){console.warn(`Uniform location for ${s} not found`);return}if(r instanceof HTMLImageElement)this.setTextureUniform(s,r);else if(Array.isArray(r)){let i=null,l=null;if(r[0]!==void 0&&Array.isArray(r[0])){const u=r[0].length;if(r.every(n=>n.length===u))i=r.flat(),l=u;else{console.warn(`All child arrays must be the same length for ${s}`);return}}else i=r,l=i.length;switch(l){case 2:this.gl.uniform2fv(a,i);break;case 3:this.gl.uniform3fv(a,i);break;case 4:this.gl.uniform4fv(a,i);break;case 9:this.gl.uniformMatrix3fv(a,!1,i);break;case 16:this.gl.uniformMatrix4fv(a,!1,i);break;default:console.warn(`Unsupported uniform array length: ${l}`)}}else typeof r=="number"?this.gl.uniform1f(a,r):typeof r=="boolean"?this.gl.uniform1i(a,r?1:0):console.warn(`Unsupported uniform type for ${s}: ${typeof r}`)})};getCurrentFrame=()=>this.currentFrame;setFrame=e=>{this.currentFrame=e,this.lastRenderTime=performance.now(),this.render(performance.now())};setSpeed=(e=1)=>{this.speed=e,this.setCurrentSpeed(this.ownerDocument.hidden?0:e)};setCurrentSpeed=e=>{this.currentSpeed=e,this.rafId===null&&e!==0&&(this.lastRenderTime=performance.now(),this.rafId=requestAnimationFrame(this.render)),this.rafId!==null&&e===0&&(cancelAnimationFrame(this.rafId),this.rafId=null)};setMaxPixelCount=(e=M)=>{this.maxPixelCount=e,this.handleResize()};setMinPixelRatio=(e=2)=>{this.minPixelRatio=e,this.handleResize()};setUniforms=e=>{this.setUniformValues(e),this.providedUniforms={...this.providedUniforms,...e},this.render(performance.now())};handleDocumentVisibilityChange=()=>{this.setCurrentSpeed(this.ownerDocument.hidden?0:this.speed)};dispose=()=>{this.hasBeenDisposed=!0,this.rafId!==null&&(cancelAnimationFrame(this.rafId),this.rafId=null),this.gl&&this.program&&(this.textures.forEach(e=>{this.gl.deleteTexture(e)}),this.textures.clear(),this.gl.deleteProgram(this.program),this.program=null,this.gl.bindBuffer(this.gl.ARRAY_BUFFER,null),this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,null),this.gl.bindRenderbuffer(this.gl.RENDERBUFFER,null),this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,null),this.gl.getError()),this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null),visualViewport?.removeEventListener("resize",this.handleVisualViewportChange),this.ownerDocument.removeEventListener("visibilitychange",this.handleDocumentVisibilityChange),this.uniformLocations={},this.canvasElement.remove(),delete this.parentElement.paperShaderMount}};function z(t,e,s){const r=t.createShader(e);return r?(t.shaderSource(r,s),t.compileShader(r),t.getShaderParameter(r,t.COMPILE_STATUS)?r:(console.error("An error occurred compiling the shaders: "+t.getShaderInfoLog(r)),t.deleteShader(r),null)):null}function J(t,e,s){const r=t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT),c=r?r.precision:null;c&&c<23&&(e=e.replace(/precision\s+(lowp|mediump)\s+float;/g,"precision highp float;"),s=s.replace(/precision\s+(lowp|mediump)\s+float/g,"precision highp float").replace(/\b(uniform|varying|attribute)\s+(lowp|mediump)\s+(\w+)/g,"$1 highp $3"));const a=z(t,t.VERTEX_SHADER,e),i=z(t,t.FRAGMENT_SHADER,s);if(!a||!i)return null;const l=t.createProgram();return l?(t.attachShader(l,a),t.attachShader(l,i),t.linkProgram(l),t.getProgramParameter(l,t.LINK_STATUS)?(t.detachShader(l,a),t.detachShader(l,i),t.deleteShader(a),t.deleteShader(i),l):(console.error("Unable to initialize the shader program: "+t.getProgramInfoLog(l)),t.deleteProgram(l),t.deleteShader(a),t.deleteShader(i),null)):null}const ee=`@layer paper-shaders {
  :where([data-paper-shader]) {
    isolation: isolate;
    position: relative;

    & canvas {
      contain: strict;
      display: block;
      position: absolute;
      inset: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      corner-shape: inherit;
    }
  }
}`;function te(){const t=navigator.userAgent.toLowerCase();return t.includes("safari")&&!t.includes("chrome")&&!t.includes("android")}function ie(t){const e=visualViewport?.scale??1,s=visualViewport?.width??window.innerWidth,r=window.innerWidth-t.documentElement.clientWidth,c=e*s+r,a=outerWidth/c,i=Math.round(100*a);return i%5===0?i/100:i===33?1/3:i===67?2/3:i===133?4/3:a}const re={fit:"contain",scale:1,rotation:0,offsetX:0,offsetY:0,originX:.5,originY:.5,worldWidth:0,worldHeight:0},se={none:0,contain:1,cover:2},ae=`
#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846
`,oe=`
vec2 rotate(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}
`,ne=`
  float hash21(vec2 p) {
    p = fract(p * vec2(0.3183099, 0.3678794)) + 0.1;
    p += dot(p, p + 19.19);
    return fract(p.x * p.y);
  }
`,T={maxColorCount:10},le=`#version 300 es
precision mediump float;

uniform float u_time;

uniform vec4 u_colors[${T.maxColorCount}];
uniform float u_colorsCount;

uniform float u_distortion;
uniform float u_swirl;
uniform float u_grainMixer;
uniform float u_grainOverlay;

in vec2 v_objectUV;
out vec4 fragColor;

${ae}
${oe}
${ne}

float valueNoise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  float x1 = mix(a, b, u.x);
  float x2 = mix(c, d, u.x);
  return mix(x1, x2, u.y);
}

float noise(vec2 n, vec2 seedOffset) {
  return valueNoise(n + seedOffset);
}

vec2 getPosition(int i, float t) {
  float a = float(i) * .37;
  float b = .6 + fract(float(i) / 3.) * .9;
  float c = .8 + fract(float(i + 1) / 4.);

  float x = sin(t * b + a);
  float y = cos(t * c + a * 1.5);

  return .5 + .5 * vec2(x, y);
}

void main() {
  vec2 uv = v_objectUV;
  uv += .5;
  vec2 grainUV = uv * 1000.;

  float grain = noise(grainUV, vec2(0.));
  float mixerGrain = .4 * u_grainMixer * (grain - .5);

  const float firstFrameOffset = 41.5;
  float t = .5 * (u_time + firstFrameOffset);

  float radius = smoothstep(0., 1., length(uv - .5));
  float center = 1. - radius;
  for (float i = 1.; i <= 2.; i++) {
    uv.x += u_distortion * center / i * sin(t + i * .4 * smoothstep(.0, 1., uv.y)) * cos(.2 * t + i * 2.4 * smoothstep(.0, 1., uv.y));
    uv.y += u_distortion * center / i * cos(t + i * 2. * smoothstep(.0, 1., uv.x));
  }

  vec2 uvRotated = uv;
  uvRotated -= vec2(.5);
  float angle = 3. * u_swirl * radius;
  uvRotated = rotate(uvRotated, -angle);
  uvRotated += vec2(.5);

  vec3 color = vec3(0.);
  float opacity = 0.;
  float totalWeight = 0.;

  for (int i = 0; i < ${T.maxColorCount}; i++) {
    if (i >= int(u_colorsCount)) break;

    vec2 pos = getPosition(i, t) + mixerGrain;
    vec3 colorFraction = u_colors[i].rgb * u_colors[i].a;
    float opacityFraction = u_colors[i].a;

    float dist = length(uvRotated - pos);

    dist = pow(dist, 3.5);
    float weight = 1. / (dist + 1e-3);
    color += colorFraction * weight;
    opacity += opacityFraction * weight;
    totalWeight += weight;
  }

  color /= max(1e-4, totalWeight);
  opacity /= max(1e-4, totalWeight);

  float grainOverlay = valueNoise(rotate(grainUV, 1.) + vec2(3.));
  grainOverlay = mix(grainOverlay, valueNoise(rotate(grainUV, 2.) + vec2(-1.)), .5);
  grainOverlay = pow(grainOverlay, 1.3);

  float grainOverlayV = grainOverlay * 2. - 1.;
  vec3 grainOverlayColor = vec3(step(0., grainOverlayV));
  float grainOverlayStrength = u_grainOverlay * abs(grainOverlayV);
  grainOverlayStrength = pow(grainOverlayStrength, .8);
  color = mix(color, grainOverlayColor, .35 * grainOverlayStrength);

  opacity += .5 * grainOverlayStrength;
  opacity = clamp(opacity, 0., 1.);

  fragColor = vec4(color, opacity);
}
`;function ce(t){if(Array.isArray(t))return t.length===4?t:t.length===3?[...t,1]:E;if(typeof t!="string")return E;let e,s,r,c=1;if(t.startsWith("#"))[e,s,r,c]=ue(t);else if(t.startsWith("rgb"))[e,s,r,c]=he(t);else if(t.startsWith("hsl"))[e,s,r,c]=fe(de(t));else return console.error("Unsupported color format",t),E;return[S(e,0,1),S(s,0,1),S(r,0,1),S(c,0,1)]}function ue(t){t=t.replace(/^#/,""),t.length===3&&(t=t.split("").map(a=>a+a).join("")),t.length===6&&(t=t+"ff");const e=parseInt(t.slice(0,2),16)/255,s=parseInt(t.slice(2,4),16)/255,r=parseInt(t.slice(4,6),16)/255,c=parseInt(t.slice(6,8),16)/255;return[e,s,r,c]}function he(t){const e=t.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([0-9.]+))?\s*\)$/i);return e?[parseInt(e[1]??"0")/255,parseInt(e[2]??"0")/255,parseInt(e[3]??"0")/255,e[4]===void 0?1:parseFloat(e[4])]:[0,0,0,1]}function de(t){const e=t.match(/^hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([0-9.]+))?\s*\)$/i);return e?[parseInt(e[1]??"0"),parseInt(e[2]??"0"),parseInt(e[3]??"0"),e[4]===void 0?1:parseFloat(e[4])]:[0,0,0,1]}function fe(t){const[e,s,r,c]=t,a=e/360,i=s/100,l=r/100;let u,n,h;if(s===0)u=n=h=l;else{const f=(x,y,p)=>(p<0&&(p+=1),p>1&&(p-=1),p<.16666666666666666?x+(y-x)*6*p:p<.5?y:p<.6666666666666666?x+(y-x)*(.6666666666666666-p)*6:x),m=l<.5?l*(1+i):l+i-l*i,d=2*l-m;u=f(d,m,a+1/3),n=f(d,m,a),h=f(d,m,a-1/3)}return[u,n,h,c]}const S=(t,e,s)=>Math.min(Math.max(t,e),s),E=[0,0,0,1],me="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";function ge(t){const e=g.useRef(void 0),s=g.useCallback(r=>{const c=t.map(a=>{if(a!=null){if(typeof a=="function"){const i=a,l=i(r);return typeof l=="function"?l:()=>{i(null)}}return a.current=r,()=>{a.current=null}}});return()=>{c.forEach(a=>a?.())}},t);return g.useMemo(()=>t.every(r=>r==null)?null:r=>{e.current&&(e.current(),e.current=void 0),r!=null&&(e.current=s(r))},t)}function P(t){if(t.naturalWidth<1024&&t.naturalHeight<1024){if(t.naturalWidth<1||t.naturalHeight<1)return;const e=t.naturalWidth/t.naturalHeight;t.width=Math.round(e>1?1024*e:1024),t.height=Math.round(e>1?1024:1024/e)}}async function V(t){const e={},s=[],r=a=>{try{return a.startsWith("/")||new URL(a),!0}catch{return!1}},c=a=>{try{return a.startsWith("/")?!1:new URL(a,window.location.origin).origin!==window.location.origin}catch{return!1}};return Object.entries(t).forEach(([a,i])=>{if(typeof i=="string"){const l=i||me;if(!r(l)){console.warn(`Uniform "${a}" has invalid URL "${l}". Skipping image loading.`);return}const u=new Promise((n,h)=>{const f=new Image;c(l)&&(f.crossOrigin="anonymous"),f.onload=()=>{P(f),e[a]=f,n()},f.onerror=()=>{console.error(`Could not set uniforms. Failed to load image at ${l}`),h()},f.src=l});s.push(u)}else i instanceof HTMLImageElement&&P(i),e[a]=i}),await Promise.all(s),e}const I=g.forwardRef(function({fragmentShader:e,uniforms:s,webGlContextAttributes:r,speed:c=0,frame:a=0,width:i,height:l,minPixelRatio:u,maxPixelCount:n,mipmaps:h,style:f,...m},d){const[x,y]=g.useState(!1),p=g.useRef(null),b=g.useRef(null),w=g.useRef(r);g.useEffect(()=>((async()=>{const A=await V(s);p.current&&!b.current&&(b.current=new Q(p.current,e,A,w.current,c,a,u,n,h),y(!0))})(),()=>{b.current?.dispose(),b.current=null}),[e]),g.useEffect(()=>{let R=!1;return(async()=>{const N=await V(s);R||b.current?.setUniforms(N)})(),()=>{R=!0}},[s,x]),g.useEffect(()=>{b.current?.setSpeed(c)},[c,x]),g.useEffect(()=>{b.current?.setMaxPixelCount(n)},[n,x]),g.useEffect(()=>{b.current?.setMinPixelRatio(u)},[u,x]),g.useEffect(()=>{b.current?.setFrame(a)},[a,x]);const k=ge([p,d]);return o.jsx("div",{ref:k,style:i!==void 0||l!==void 0?{width:typeof i=="string"&&isNaN(+i)===!1?+i:i,height:typeof l=="string"&&isNaN(+l)===!1?+l:l,...f}:f,...m})});I.displayName="ShaderMount";function pe(t,e){for(const s in t){if(s==="colors"){const r=Array.isArray(t.colors),c=Array.isArray(e.colors);if(!r||!c){if(Object.is(t.colors,e.colors)===!1)return!1;continue}if(t.colors?.length!==e.colors?.length||!t.colors?.every((a,i)=>a===e.colors?.[i]))return!1;continue}if(Object.is(t[s],e[s])===!1)return!1}return!0}const v={params:{...re,speed:1,frame:0,colors:["#e0eaff","#241d9a","#f75092","#9f50d3"],distortion:.8,swirl:.1,grainMixer:0,grainOverlay:0}},xe=g.memo(function({speed:e=v.params.speed,frame:s=v.params.frame,colors:r=v.params.colors,distortion:c=v.params.distortion,swirl:a=v.params.swirl,grainMixer:i=v.params.grainMixer,grainOverlay:l=v.params.grainOverlay,fit:u=v.params.fit,rotation:n=v.params.rotation,scale:h=v.params.scale,originX:f=v.params.originX,originY:m=v.params.originY,offsetX:d=v.params.offsetX,offsetY:x=v.params.offsetY,worldWidth:y=v.params.worldWidth,worldHeight:p=v.params.worldHeight,...b}){const w={u_colors:r.map(ce),u_colorsCount:r.length,u_distortion:c,u_swirl:a,u_grainMixer:i,u_grainOverlay:l,u_fit:se[u],u_rotation:n,u_scale:h,u_offsetX:d,u_offsetY:x,u_originX:f,u_originY:m,u_worldWidth:y,u_worldHeight:p};return o.jsx(I,{...b,speed:e,frame:s,fragmentShader:le,uniforms:w})},pe);function ve(){return o.jsxs("div",{className:"fixed inset-0 z-0",children:[o.jsx(xe,{style:{height:"100vh",width:"100vw"},distortion:.8,swirl:.1,offsetX:0,offsetY:0,scale:1,rotation:0,speed:1,colors:["hsl(216, 90%, 27%)","hsl(243, 68%, 36%)","hsl(205, 91%, 64%)","hsl(211, 61%, 57%)"]}),o.jsx("div",{className:"absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.34),rgba(2,6,23,0.22)_32%,rgba(2,6,23,0.44))]"})]})}const be=(...t)=>t.filter(Boolean).join(" "),ye=({children:t,variant:e="default",className:s="",...r})=>{const c="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",a={default:"bg-primary bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700",outline:"border border-input bg-background hover:bg-accent hover:text-accent-foreground"};return o.jsx("button",{className:`${c} ${a[e]} ${s}`,...r,children:t})},O=({className:t="",...e})=>o.jsx("input",{className:`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm text-gray-800 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-100 dark:placeholder:text-slate-500 ${t}`,...e}),_e=()=>{const t=g.useRef(null),[e,s]=g.useState({width:0,height:0}),r=g.useMemo(()=>[{start:{x:100,y:150,delay:0},end:{x:200,y:80,delay:2},color:"#2563eb"},{start:{x:200,y:80,delay:2},end:{x:260,y:120,delay:4},color:"#2563eb"},{start:{x:50,y:50,delay:1},end:{x:150,y:180,delay:3},color:"#2563eb"},{start:{x:280,y:60,delay:.5},end:{x:180,y:180,delay:2.5},color:"#2563eb"}],[]);g.useEffect(()=>{const a=t.current;if(!a||!a.parentElement)return;const i=new ResizeObserver(l=>{const{width:u,height:n}=l[0].contentRect;s({width:u,height:n}),a.width=u,a.height=n});return i.observe(a.parentElement),()=>i.disconnect()},[]);const c=g.useMemo(()=>{if(!e.width||!e.height)return[];const a=[],i=12,l=1;for(let u=0;u<e.width;u+=i)for(let n=0;n<e.height;n+=i){const h=u<e.width*.25&&u>e.width*.05&&n<e.height*.4&&n>e.height*.1||u<e.width*.25&&u>e.width*.15&&n<e.height*.8&&n>e.height*.4||u<e.width*.45&&u>e.width*.3&&n<e.height*.35&&n>e.height*.15||u<e.width*.5&&u>e.width*.35&&n<e.height*.65&&n>e.height*.35||u<e.width*.7&&u>e.width*.45&&n<e.height*.5&&n>e.height*.1||u<e.width*.8&&u>e.width*.65&&n<e.height*.8&&n>e.height*.6,f=Math.abs(Math.sin(u*12.9898+n*78.233)*43758.5453),m=f-Math.floor(f);h&&m>.3&&a.push({x:u,y:n,radius:l,opacity:m*.5+.2})}return a},[e.height,e.width]);return g.useEffect(()=>{if(!e.width||!e.height)return;const a=t.current;if(!a)return;const i=a.getContext("2d");if(!i)return;let l=0,u=Date.now();const n=()=>{i.clearRect(0,0,e.width,e.height),c.forEach(m=>{i.beginPath(),i.arc(m.x,m.y,m.radius,0,Math.PI*2),i.fillStyle=`rgba(37, 99, 235, ${m.opacity})`,i.fill()})},h=()=>{const m=(Date.now()-u)/1e3;r.forEach(d=>{const x=m-d.start.delay;if(x<=0)return;const p=Math.min(x/3,1),b=d.start.x+(d.end.x-d.start.x)*p,w=d.start.y+(d.end.y-d.start.y)*p;i.beginPath(),i.moveTo(d.start.x,d.start.y),i.lineTo(b,w),i.strokeStyle=d.color,i.lineWidth=1.5,i.stroke(),i.beginPath(),i.arc(d.start.x,d.start.y,3,0,Math.PI*2),i.fillStyle=d.color,i.fill(),i.beginPath(),i.arc(b,w,3,0,Math.PI*2),i.fillStyle="#3b82f6",i.fill(),i.beginPath(),i.arc(b,w,6,0,Math.PI*2),i.fillStyle="rgba(59, 130, 246, 0.4)",i.fill(),p===1&&(i.beginPath(),i.arc(d.end.x,d.end.y,3,0,Math.PI*2),i.fillStyle=d.color,i.fill())})},f=()=>{n(),h(),(Date.now()-u)/1e3>15&&(u=Date.now()),l=requestAnimationFrame(f)};return f(),()=>cancelAnimationFrame(l)},[e,c,r]),o.jsx("div",{className:"relative h-full w-full overflow-hidden",children:o.jsx("canvas",{ref:t,className:"absolute inset-0 h-full w-full"})})},we=({error:t,username:e,password:s,onUsernameChange:r,onPasswordChange:c,onSubmit:a,onGuestLogin:i})=>{const{theme:l,setTheme:u}=L(),[n,h]=g.useState(!1),[f,m]=g.useState(!1);return o.jsx("div",{className:"flex h-full w-full items-center justify-center",children:o.jsxs(_.div,{initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},transition:{duration:.5},className:"flex w-full max-w-4xl overflow-hidden rounded-2xl border border-white/50 bg-white/90 shadow-xl backdrop-blur-md dark:border-slate-700/70 dark:bg-slate-950/90",children:[o.jsx("div",{className:"relative hidden h-[600px] w-1/2 overflow-hidden border-r border-gray-100 dark:border-slate-800 md:block",children:o.jsxs("div",{className:"absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950",children:[o.jsx(_e,{}),o.jsxs("div",{className:"absolute inset-0 z-10 flex flex-col items-center justify-center p-8",children:[o.jsx(_.div,{initial:{opacity:0,y:-20},animate:{opacity:1,y:0},transition:{delay:.6,duration:.5},className:"mb-6",children:o.jsx("div",{className:"flex h-24 w-24 items-center justify-center rounded-full ",children:o.jsx("img",{src:"logo.svg",alt:""})})}),o.jsx(_.h2,{initial:{opacity:0,y:-20},animate:{opacity:1,y:0},transition:{delay:.7,duration:.5},className:"mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-center text-3xl font-bold text-transparent dark:from-blue-300 dark:to-indigo-300",children:"Free Mail"}),o.jsx(_.p,{initial:{opacity:0,y:-20},animate:{opacity:1,y:0},transition:{delay:.8,duration:.5},className:"max-w-xs text-center text-sm text-gray-600 dark:text-slate-300",children:"Sign in to access your domain email dashboard and connect with everywhere"})]})]})}),o.jsx("div",{className:"flex w-full flex-col justify-center bg-white p-8 dark:bg-slate-950 md:w-1/2 md:p-10",children:o.jsxs(_.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5},children:[o.jsxs("div",{className:"mb-8 flex items-start justify-between gap-4",children:[o.jsxs("div",{children:[o.jsx("h1",{className:"mb-1 text-2xl font-bold text-gray-800 dark:text-slate-100 md:text-3xl",children:"Welcome back"}),o.jsx("p",{className:"text-gray-500 dark:text-slate-400",children:"Sign in to your account"})]}),o.jsxs("button",{type:"button",onClick:()=>u(l==="dark"?"light":"dark"),className:"inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",children:[l==="dark"?o.jsx(D,{size:14}):o.jsx(F,{size:14}),l==="dark"?"Light":"Dark"]})]}),o.jsxs("form",{className:"space-y-5",children:[o.jsxs("div",{children:[o.jsxs("label",{htmlFor:"email",className:"mb-1 block text-sm font-medium text-gray-700 dark:text-slate-200",children:["Email ",o.jsx("span",{className:"text-blue-500",children:"*"})]}),o.jsx(O,{id:"email",type:"email",value:e,onChange:d=>r(d.target.value),placeholder:"Enter your email address",required:!0,className:"w-full border-gray-200 bg-gray-50 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900"})]}),o.jsxs("div",{children:[o.jsxs("label",{htmlFor:"password",className:"mb-1 block text-sm font-medium text-gray-700 dark:text-slate-200",children:["Password ",o.jsx("span",{className:"text-blue-500",children:"*"})]}),o.jsxs("div",{className:"relative",children:[o.jsx(O,{id:"password",type:n?"text":"password",value:s,onChange:d=>c(d.target.value),placeholder:"Enter your password",required:!0,className:"w-full border-gray-200 bg-gray-50 pr-10 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900"}),o.jsx("button",{type:"button",className:"absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200",onClick:()=>h(!n),children:n?o.jsx($,{size:18}):o.jsx(Y,{size:18})})]})]}),o.jsx(W,{children:t?o.jsx(_.div,{initial:{opacity:0,y:-4},animate:{opacity:1,y:0},exit:{opacity:0,y:-4},className:"rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300",children:t}):null}),o.jsx(_.div,{whileHover:{scale:1.01},whileTap:{scale:.98},onHoverStart:()=>m(!0),onHoverEnd:()=>m(!1),className:"pt-2",children:o.jsxs(ye,{type:"submit",className:be("relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 py-2 text-white transition-all duration-300 hover:from-blue-600 hover:to-indigo-700",f?"shadow-lg shadow-blue-200 dark:shadow-blue-950/40":""),onClick:d=>{d.preventDefault(),a()},children:[o.jsxs("span",{className:"flex items-center justify-center",children:["Sign in",o.jsx(H,{className:"ml-2 h-4 w-4"})]}),f?o.jsx(_.span,{initial:{left:"-100%"},animate:{left:"100%"},transition:{duration:1,ease:"easeInOut"},className:"absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent",style:{filter:"blur(8px)"}}):null]})}),o.jsxs("div",{className:"relative my-6",children:[o.jsx("div",{className:"absolute inset-0 flex items-center",children:o.jsx("div",{className:"w-full border-t border-gray-200 dark:border-slate-700"})}),o.jsx("div",{className:"relative flex justify-center text-sm",children:o.jsx("span",{className:"bg-white px-2 text-gray-500 dark:bg-slate-950 dark:text-slate-400",children:"or"})})]}),o.jsx("div",{className:"mb-6",children:o.jsx("button",{className:"w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-gray-700 shadow-sm transition-all duration-300 hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",onClick:i,type:"button",children:o.jsxs("span",{className:"flex items-center justify-center gap-2",children:[o.jsx(Z,{className:"h-5 w-5"}),o.jsx("span",{children:"访客模式登录"})]})})}),o.jsx("div",{className:"mt-6 text-center",children:o.jsx("a",{href:"#",className:"text-sm text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300",children:"Forgot password?"})})]})]})})]})})};function Ae(){const{setSession:t}=C(),[e,s]=g.useState("admin"),[r,c]=g.useState("admin"),[a,i]=g.useState(""),l=async()=>{try{const n=await j(e.trim(),r.trim());if(!n.authenticated&&!n.role){i("登录失败，请检查账号密码。");return}const h={username:n.username??e.trim(),role:n.role==="admin"||n.role==="guest"||n.role==="mailbox"?n.role:"user",canSend:!!n.can_send,mailboxLimit:n.mailbox_limit};i(""),t(h),B("/app")}catch{i("账号或密码错误，或服务端暂时不可用。")}},u=async()=>{s("guest"),c("admin");try{const n=await j("guest","admin");i(""),t({username:n.username??"guest",role:(n.role==="guest","guest"),canSend:!!n.can_send,mailboxLimit:n.mailbox_limit}),B("/app")}catch{i("访客模式登录失败，请检查服务端 GUEST_PASSWORD 配置。")}};return o.jsxs("main",{className:"relative h-screen w-screen overflow-hidden bg-slate-950",children:[o.jsx(ve,{}),o.jsx("div",{className:"relative z-10 flex h-full w-full items-center justify-center p-4",children:o.jsx(we,{error:a,username:e,password:r,onUsernameChange:s,onPasswordChange:c,onSubmit:l,onGuestLogin:u})})]})}export{Ae as LoginPage};
