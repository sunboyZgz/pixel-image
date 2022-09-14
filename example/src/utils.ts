/*
 * @Author: sunboy
 * @LastEditors: sunboy
 * @Date: 2022-09-14 11:07:11
 * @LastEditTime: 2022-09-14 11:15:56
 */
function download(image: HTMLImageElement, filename?: string) {
  let a: null | HTMLAnchorElement = document.createElement("a");
  a.download = filename || "";
  a.href = image.src;
  a.click();
  a = null;
}
export { download };
