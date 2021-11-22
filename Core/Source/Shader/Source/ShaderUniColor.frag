#version 300 es
/**
* Single color shading
* @authors Jascha Karagöl, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2019
*/
precision mediump float;
uniform vec4 u_color;
out vec4 frag;

void main() {
  frag = u_color;
}