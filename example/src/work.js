/*
 * @Author: sunboy
 * @LastEditors: sunboy
 * @Date: 2022-09-12 20:59:44
 * @LastEditTime: 2022-09-13 21:51:18
 */
self.onmessage = function (e) {
  const [data, sw, sh, gap] = e.data
  console.log(sw, sh, gap)
  const shrinked_data = shrink(data, sw, sh, gap)
  const expanded_data = expand(shrinked_data, sw / gap, sh / gap, gap)
  self.postMessage([new ImageData(expanded_data, sw, sh), sw, sh])
};

//we can do more on the shrink result
function shrink(data, sw, sh, gap) {
  const result = new Uint8ClampedArray(data.length / gap / gap);
  const rgb_g = gap * 4
  let index = 0;
  for (let h = 0; h < sh; h += gap) {
    for (let i = h * sw * 4; i < h * sw * 4 + sw * 4; i += rgb_g, index++) {
      result[index * 4] = data[i];
      result[index * 4 + 1] = data[i + 1];
      result[index * 4 + 2] = data[i + 2];
      result[index * 4 + 3] = data[i + 3];
    }
  }
  return result
}

function expand(data, sw, sh, gap) {
  const result = new Uint8ClampedArray(data.length * gap * gap);
  for (let i = 0; i < data.length; i += 4) {
    const row = Math.floor(i / (sw * 4))
    const col = (i % (sw * 4)) / 4
    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
    for (let e_r = row * gap; e_r < row * gap + gap; e_r++) {
      for (let e_c = col * gap; e_c < col * gap + gap; e_c++) {
        const cur = e_r * sw * gap * 4 + e_c * 4
        result[cur] = r;
        result[cur + 1] = g;
        result[cur + 2] = b;
        result[cur + 3] = a;
      }
    }

  }
  console.log(result)
  return result
}