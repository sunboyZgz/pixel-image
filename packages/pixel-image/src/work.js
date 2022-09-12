self.onmessage = function (e) {
  const [data, result, w, s, gap] = e.data
  const rgb_g = gap * 4
  let index = 0;
  for (let i = 0; i < data.length; i += rgb_g) {
    result[index * 4] = data[i];
    result[index * 4 + 1] = data[i + 1];
    result[index * 4 + 2] = data[i + 2];
    result[index * 4 + 3] = data[i + 3];
    index++;
  }
  self.postMessage([new ImageData(result, w / gap, s / gap), w / gap, s / gap])
};
