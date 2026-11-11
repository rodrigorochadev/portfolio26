#version 300 es
precision highp float;

// Trail length; must match POINTS in liquid.ts.
const int POINTS = 6;

// Canvas size and device pixel ratio; everything below is in CSS px, origin at the canvas center.
uniform float uSize;
uniform float uDpr;
// The drop's head (always the center, 0,0) and its trail, y up.
uniform vec2 uPoints[POINTS];
uniform float uRadius;
// Pop in/out: 0 hidden, 1 shown, overshoots a little on the way.
uniform float uScale;
uniform float uTime;
// 0 with reduced motion: no idle wobble.
uniform float uWobble;
// Outline width, CSS px.
uniform float uStroke;
out vec4 fragColor;

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

// Signed distance to the drop: the trail's circles melted together, each smaller than the last.
// The trail shrinks toward the head with the scale, so hiding pulls it back in.
float field(vec2 p) {
  float k = max(18.0 * uScale, 0.001);
  float d = 1e5;
  for (int i = 0; i < POINTS; i++) {
    float r = uRadius * uScale * (1.0 - float(i) * 0.13);
    d = smin(d, length(p - uPoints[i] * uScale) - r, k);
  }
  float a = atan(p.y, p.x);
  d += uWobble * uScale * (0.9 * sin(a * 2.0 + uTime * 1.9) + 0.5 * sin(a * 3.0 - uTime * 1.4));
  return d;
}

void main() {
  vec2 p = gl_FragCoord.xy / uDpr - vec2(uSize * 0.5);
  float d = field(p);

  // Only the drop's edge: a white line, with a soft dark band either side so it reads on light images.
  float edge = abs(d) - uStroke * 0.5;
  float aa = 0.75 / uDpr + 0.25;
  float line = 1.0 - smoothstep(-aa, aa, edge);
  float shade = (1.0 - smoothstep(0.0, 3.0, edge)) * 0.28;
  // Fade out as it shrinks, so a hidden drop doesn't leave a dot behind.
  float fade = smoothstep(0.0, 0.2, uScale);
  float alpha = (line + shade * (1.0 - line)) * fade;
  // Premultiplied: white line, black shade.
  fragColor = vec4(vec3(line * fade), alpha);
}
