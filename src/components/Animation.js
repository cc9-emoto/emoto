import React, { Component } from "react";
import THREE from "three.js";

let scene, camera, renderer, sphere;

const loadSphere = () => {
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

  let sphereContainer = document.querySelector("#sphere");
  sphereContainer.appendChild(renderer.domElement);

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
};

class Animation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sphereStatus: "decrease",
      clock: 0,
      beats: new Set(),
      loudness: new Set()
    };
    this.animate = this.animate.bind(this);
  }

  componentDidMount() {
    loadSphere();
  }

  animate() {
    console.log("animate");
    const increase = () => {
      sphere.scale.x += 0.1;
      sphere.scale.y += 0.1;
      sphere.scale.z += 0.1;
    };
    const decrease = () => {
      sphere.scale.x -= 0.1;
      sphere.scale.y -= 0.1;
      sphere.scale.z -= 0.1;
    };
    if (this.state.sphereStatus === "increase") {
      increase();
      this.setState({ sphereStatus: "decrease" });
    } else {
      decrease();
      this.setState({ sphereStatus: "increase" });
    }
    renderer.render(scene, camera);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.beatsData &&
      this.props.beatsData.length > 0 &&
      prevProps.beatsData !== this.props.beatsData
    ) {
      console.log("this.props.beatsData:", this.props.beatsData);
      this.startClock();
      this.setState({
        beats: new Set(
          this.props.beatsData.map(
            beat => Math.ceil((beat.start * 1000) / 100) * 100
          )
        ),
        loudness: new Set(this.props.beatsData)
      });
    }
    if (
      this.state.clock !== prevState.clock &&
      this.state.beats.has(this.state.clock)
    ) {
      this.animate();
    }
  }

  startClock() {
    setInterval(() => {
      this.setState({ clock: this.state.clock + 100 });
    }, 100);
  }

  render() {
    return (
      <>
        <button onClick={this.animate}>ANIMATE</button>
        <div id="sphere"></div>;
      </>
    );
  }
}

export default Animation;
