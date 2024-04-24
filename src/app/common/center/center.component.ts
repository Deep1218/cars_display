import { Component, HostListener } from '@angular/core';
import {
  ACESFilmicToneMapping,
  DoubleSide,
  EquirectangularReflectionMapping,
  Mesh,
  MeshPhongMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  SRGBColorSpace,
  Scene,
  SpotLight,
  SpotLightHelper,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowCircleRight,
  faArrowCircleLeft,
} from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-center',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './center.component.html',
  styleUrl: './center.component.css',
})
export class CenterComponent {
  faArrowCircleLeft = faArrowCircleLeft;
  faArrowCircleRight = faArrowCircleRight;
  animate = () => {
    this.controls.update();
    requestAnimationFrame(this.animate);
    this.renderer.toneMappingExposure = this.selectedModel.exposure;
    this.renderer.render(this.scene, this.camera);
  };
  private width = 800;
  private height = 500;
  private renderer!: WebGLRenderer;
  private camera!: PerspectiveCamera;
  private controls!: OrbitControls;
  public car: any;
  // Custom Model
  modelSetting = [
    {
      name: 'Car 1',
      uri: 'assets/models/car1/scene.gltf',
      exposure: 2,
      ligthIntensity: 50,
      cssClass: 'model-1-gradient',
    },
    {
      name: 'Car 2',
      uri: 'assets/models/car2/scene.gltf',
      exposure: 1,
      ligthIntensity: 80,
      cssClass: 'model-2-gradient',
    },
    {
      name: 'Car 3',
      uri: 'assets/models/car3/scene.gltf',
      exposure: 4,
      ligthIntensity: 50,
      cssClass: 'model-3-gradient',
    },
  ];
  selectedModel = this.modelSetting[0];
  private readonly scene = new Scene();

  @HostListener('window:resize')
  reloadScene() {
    if (this.camera) {
      // this.camera.aspect = this.width / this.height;
      // this.renderer.setSize(this.width, this.height);
      this.camera.updateProjectionMatrix();
    }
  }

  constructor() {
    this.addCamera();
    this.loaders();
    this.addPlane();
  }

  ngAfterViewInit(): void {
    const canvas: HTMLCanvasElement = document.querySelector(
      '.webgl'
    ) as HTMLCanvasElement;
    this.setRenderer(canvas);
  }
  setRenderer(canvas: HTMLCanvasElement) {
    this.renderer = new WebGLRenderer({ canvas, antialias: true });

    this.renderer.setClearColor(0xa3a3a3);
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.shadowMap.enabled = true;

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.render(this.scene, this.camera);

    this.addControls(canvas);
    this.animate();
  }

  addControls(canvas: HTMLCanvasElement) {
    this.controls = new OrbitControls(this.camera, canvas);
  }

  loaders() {
    // GLTF Loader
    const assestLoader = new GLTFLoader();

    // RGBE Loader
    const rgbeloader = new RGBELoader();

    rgbeloader.load('assets/WhiteNeons_NAD.hdr', (texture) => {
      texture.mapping = EquirectangularReflectionMapping;
      this.scene.castShadow = true;
      this.scene.environment = texture;
      assestLoader.load(
        this.selectedModel.uri,
        (gltf) => {
          const model = gltf.scene;
          model.position.set(0, 0, 0);
          model.traverse((node: any) => {
            node.castShadow = node.isMesh;
            node.receiveShadow = node.isMesh;
          });
          this.scene.add(model);
          this.car = model;
        },
        undefined,
        (error) => {
          console.error(error);
        }
      );
    });
  }

  addCamera() {
    this.camera = new PerspectiveCamera(
      45,
      this.width / this.height,
      0.1,
      1000
    );
    this.camera.position.set(3.65, 2.47, 1.17);
    this.scene.add(this.camera);
    this.addLight();
  }

  addLight() {
    const light = new SpotLight(0xffffff, this.selectedModel.ligthIntensity);
    light.position.set(0, 8, 0);
    light.angle = 0.5;
    light.penumbra = 0.1;
    light.castShadow = true;
    light.shadow.focus = 1;
    light.shadow.blurSamples = 10;
    light.shadow.camera.near = 1;
    light.shadow.camera.far = 20;
    this.scene.add(light);

    const lightHelper = new SpotLightHelper(light);
    // this.scene.add(lightHelper);
  }
  addPlane() {
    const planeGeometry = new PlaneGeometry(10, 10);
    const planeMat = new MeshPhongMaterial({
      color: 0x5a5a5a,
      dithering: true,
      side: DoubleSide,
    });
    const plane = new Mesh(planeGeometry, planeMat);
    plane.receiveShadow = true;
    plane.rotation.x = -0.5 * Math.PI;
    this.scene.add(plane);
  }
  changeSelectedModel(next: boolean) {
    const findIndex = this.modelSetting.findIndex(
      (setting) => this.selectedModel.uri === setting.uri
    );
    if (findIndex >= 0) {
      if (next && this.modelSetting.length !== findIndex + 1) {
        // console.log('Testing:: ', next, findIndex);
        this.scene.remove(this.car);
        this.selectedModel = this.modelSetting[findIndex + 1];
        this.loaders();
      } else if (!next && findIndex > 0) {
        this.scene.remove(this.car);
        this.selectedModel = this.modelSetting[findIndex - 1];
        this.loaders();
      }
    }
  }
}
