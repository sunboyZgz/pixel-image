<script setup lang="ts">
import { onMounted, ref } from "vue";
// import { DrawContext } from "pixel-image";
import {
  DrawContext,
  canvasToImage,
} from "../../packages/pixel-image/src/main";
import { download } from "./utils";
const container = ref<HTMLElement>();

let filename = "";
const putImgToSource = function (
  input: HTMLInputElement,
  ev: InputEvent,
  img: HTMLImageElement
) {
  const f = input.files && input.files[0];
  filename = f?.name || "";
  let src: string | undefined;
  if (f) {
    src = URL.createObjectURL(f);
  }
  img.src = src ? src : "";
};

let drawContext: DrawContext;
const putImgToCanvas = function (img: HTMLImageElement) {
  if (drawContext) {
    drawContext.ClearRect();
    drawContext.DrawImage();
  } else {
    drawContext = new DrawContext(img);
    drawContext.DrawImage();
    drawContext.PutImage(container.value!);
  }
};
const patchImage = () => {
  const scale_input = document.getElementById("scale") as HTMLInputElement;
  const opt =
    (scale_input.value && { scale: parseFloat(scale_input.value) }) ||
    undefined;
  opt ? drawContext.Patch(opt) : drawContext.Patch();
};

const downloadImage = () => {
  const canvas = drawContext.elm;
  canvasToImage(canvas, (_, img) => {
    download(img, filename);
  });
};
onMounted(() => {
  const input = document.getElementById("image-upload") as HTMLInputElement;
  const img = document.getElementById("source") as HTMLImageElement;
  input.addEventListener(
    "change",
    function (this: HTMLInputElement, ev: Event) {
      putImgToSource(this, ev as InputEvent, img);
    }
  );
  img.addEventListener("load", function (this: HTMLImageElement, ev: Event) {
    putImgToCanvas(this);
  });
});
</script>

<template>
  <div>pixel-image</div>
  <div>
    <input accept="image/*" id="image-upload" type="file" />
    <input id="scale" type="text" />
    <button @click="patchImage">patch</button>
    <button @click="downloadImage">download</button>
  </div>
  <img id="source" width="300" height="300" />
  <div ref="container"></div>
</template>

<style scoped></style>
