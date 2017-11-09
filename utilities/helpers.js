const colors = [
  '#FFCF00', // yellow
  '#8FFE06', // green
  '#000BFC', // blue
  '#5B08C6', // purple
  '#FF5A04', // orange
  '#FE0004', // red
];

const getRandomColors = () => {
  let options = colors.slice();
  let i = Math.floor(Math.random() * options.length);
  const color = options[i];
  options = options.slice(0, i).concat(options.slice(i + 1));
  i = Math.floor(Math.random() * options.length);
  const altColor = options[i];
  return [color, altColor];
}

module.exports = {
  getRandomColors: getRandomColors,
};