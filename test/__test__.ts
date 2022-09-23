const test2 = {
  name: "x to y swap 1",
  rx: 100000,
  ry: 10000000000,
  inputX: 100000,
  outputY: 5000000000,
};
const k = test2.rx * test2.ry;
const deltaY = -k / (test2.rx + test2.inputX) + test2.ry;
