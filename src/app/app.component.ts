import {
  AfterViewInit,
  Component,
  HostListener,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  AmbientLight,
  BoxGeometry,
  ColorRepresentation,
  DirectionalLight,
  GridHelper,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SphereGeometry,
  SpotLight,
  WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit {
  private width = 800;
  private height = 500;
  private renderer!: WebGLRenderer;
  private camera!: PerspectiveCamera;

  // Custom Model
  goKart = new URL('assets/go_kart_hd.glb', import.meta.url);

  private readonly scene = new Scene();

  @HostListener('window:resize')
  reloadScene() {
    console.log('working');
    // this.width = window.innerWidth;
    // this.height = window.innerHeight;
    if (this.camera) {
      // this.camera.aspect = this.width / this.height;
      // this.renderer.setSize(this.width, this.height);
      this.camera.updateProjectionMatrix();
    }
  }
  constructor() {
    // Loader
    const assestLoader = new GLTFLoader();
    assestLoader.load(
      this.goKart.href,
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 5, 5);
        this.scene.add(model);
      },
      undefined,
      (error) => {
        console.error(error);
      }
    );
  }
  ngAfterViewInit(): void {
    // Camera
    this.camera = new PerspectiveCamera(
      75,
      this.width / this.height,
      0.1,
      1000
    );
    this.camera.position.set(100, 80, 150);
    this.scene.add(this.camera);

    // Light
    const light = new SpotLight(0xffffff, 100000);
    light.position.set(70, 100, 90);
    this.scene.add(light);

    const canvas: HTMLCanvasElement = document.querySelector(
      '.webgl'
    ) as HTMLCanvasElement;
    console.log('Cavas:: ', canvas);

    this.renderer = new WebGLRenderer({ canvas });

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.render(this.scene, this.camera);
    this.animate();
  }

  animate = () => {
    // controls.update();
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  };
}
