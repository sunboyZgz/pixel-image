//@ts-ignore-next
import Worker from "./work.js?worker";
const worker = new Worker();

interface Draw {
  draw(c: DrawContext): void;
  patch(c: DrawContext, opt: option): void;
}

function patchImageData(
  data: Uint8ClampedArray,
  size: number[],
  opt: option
): void {
  const { scale } = opt;
  let gap = Math.round(1 / scale);
  const [w, h] = size;
  if (w % gap != 0 || h % gap != 0) {
    if (gap > 8) {
      while (w % gap != 0 || h % gap != 0) {
        gap = gap >> 1;
      }
    } else {
      while (w % gap != 0 || h % gap != 0) {
        gap--;
      }
    }
  }

  worker.postMessage([data, w, h, gap]);
  return;
}

function default_draw(c: DrawContext) {
  const ctx = c.ctx!;
  const canvas = c.elm;
  const img = c.img;
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}
type option = { scale: number };
let tempCanvas = document.createElement("canvas");
let tempCtx = tempCanvas.getContext("2d")!;

//todo: for more flexible custom control
function my_patch(c: DrawContext, opt: option) {
  const { ctx, elm: canvas, img } = c;
  const { scale } = opt;
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  tempCanvas.width = w;
  tempCanvas.height = h;
  tempCtx.clearRect(0, 0, w, h);
  tempCtx.drawImage(img, 0, 0, w, h);
  let imageData = tempCtx.getImageData(0, 0, w, h);
  worker.onmessage = (m) => {
    const [imageData, dw, dh] = m.data;
    ctx.clearRect(0, 0, w, h);
    canvas.width = dw;
    canvas.height = dh;
    ctx.putImageData(imageData, 0, 0);
  };
  patchImageData(imageData.data, [w, h], opt);
}

function default_patch(c: DrawContext, opt: option) {
  const { ctx, elm: canvas, img } = c;
  const { scale } = opt;
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  tempCanvas.width = w * scale;
  tempCanvas.height = h * scale;
  tempCtx.drawImage(img, 0, 0, w * scale, h * scale);
  let imageData = ctx.getImageData(0, 0, w, h);
  const temp_img = new Image();
  const data_url = tempCanvas.toDataURL();
  temp_img.src = data_url;
  ctx.clearRect(0, 0, w, h);
  temp_img.onload = () => {
    canvas.width = temp_img.width / scale;
    canvas.height = temp_img.height / scale;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
      temp_img,
      0,
      0,
      temp_img.width / scale,
      temp_img.height / scale
    );
  };
  patchImageData(imageData.data, [w, h], opt);
}

const default_methods: Draw = {
  draw: default_draw,
  patch: my_patch,
};

class DrawContext {
  public elm: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public img: HTMLImageElement;
  private draw_methods: Draw;
  constructor(img: HTMLImageElement, d?: Draw) {
    const canvas = document.createElement("canvas");
    this.img = img;
    this.elm = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.draw_methods = d || default_methods;
  }
  public DrawImage() {
    const { draw } = this.draw_methods;
    draw(this);
  }

  public Patch(opt: option = { scale: 0.25 }) {
    const { patch } = this.draw_methods;
    patch(this, opt);
  }

  public ClearRect() {
    this.ctx.clearRect(0, 0, this.elm.width, this.elm.height);
  }

  public PutImage(container: HTMLElement) {
    container.appendChild(this.elm);
  }
}

export { DrawContext, default_patch, default_draw, my_patch };
