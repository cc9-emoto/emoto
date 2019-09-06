import React, { Component } from "react";
import THREE from "three.js";
import musicData from "../musicData.json";

let scene, camera, renderer, sphere;
let clock = 0;

const loadSphere = () => {
  function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 15;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(
      3,
      50,
      50,
      0,
      Math.PI * 2,
      0,
      Math.PI * 2
    );
    const material = new THREE.MeshNormalMaterial();

    sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    renderer.render(scene, camera);
  }

  init();
};

const beats = musicData.beats.map(beat => {
  return Math.round((beat.start * 1000) / 100) * 100;
});
console.log("beats:", beats);

class Animation extends Component {
  constructor() {
    super();
    this.state = {
      sphereStatus: "decrease"
    };
    this.animate = this.animate.bind(this);
  }

  animate() {
    requestAnimationFrame(this.animate);
    const increase = () => {
      sphere.scale.x += 0.001;
      sphere.scale.y += 0.001;
      sphere.scale.z += 0.001;
    };

    const decrease = () => {
      sphere.scale.x -= 0.001;
      sphere.scale.y -= 0.001;
      sphere.scale.z -= 0.001;
    };

    if (this.state.sphereStatus === "increase") {
      increase();
    } else {
      decrease();
    }

    renderer.render(scene, camera);
  }

  shouldComponentUpdate() {
    return false;
  }

  getData() {
    setInterval(() => {
      if (this.state.sphereStatus === "increase") {
        this.setState({
          sphereStatus: "decrease"
        });
      } else {
        this.setState({
          sphereStatus: "increase"
        });
      }
    }, 100);
  }

  startClock() {
    setInterval(() => {
      clock += 100;
    }, 100);
  }

  checkClock() {
    setInterval(() => {
      if (beats.includes(clock)) {
        this.animate();
      }
    }, 100);
  }

  render() {
    loadSphere();
    return (
      <div>
        <script>{this.getData()}</script>
        <script>{this.startClock()}</script>
        <script>{this.checkClock()}</script>
      </div>
    );
  }
}

export default Animation;
