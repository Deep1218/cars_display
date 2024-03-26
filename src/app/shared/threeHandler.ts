import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';

class ThreeHandler {
  private renderer!: WebGLRenderer;
  private camera!: PerspectiveCamera;

  //   Scene
  private readonly scene = new Scene();

  constructor(public width: number, public height: number) {
    this.camera = new PerspectiveCamera(
      75,
      this.width / this.height,
      0.1,
      1000
    );
  }

  setRenderer(canvas: HTMLCanvasElement) {
    this.renderer = new WebGLRenderer({ canvas });

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
  }
}
