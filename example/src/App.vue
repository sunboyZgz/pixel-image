<script setup lang="ts">
import { onMounted, ref } from "vue";
import { DrawContext } from "pixel-image";
// import { DrawContext } from "./utils";
const container = ref<HTMLElement>();

const putImgToSource = function (
  input: HTMLInputElement,
  ev: InputEvent,
  img: HTMLImageElement
) {
  const f = input.files && input.files[0];
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
    <input id="image-upload" type="file" />
    <input id="scale" type="text" />
    <button @click="patchImage">patch</button>
  </div>
  <img id="source" width="300" height="300" />
  <div ref="container"></div>
</template>

<style scoped></style>
