const colors = [
  '#FE0004', // red
  '#8FFE06', // green
  '#000BFC', // blue
];

const altColors = [
  '#FF5A04', // orange
  '#FFCF00', // yellow
  '#5B08C6', // purple
];

const getColor = () => {
  let random = Math.floor(Math.random() * colors.length);
  return colors[random];
}

const getAltColor = () => {
  let random = Math.floor(Math.random() * altColors.length);
  return altColors[random];
}

module.exports = {
  getColor: getColor,
  getAltColor: getAltColor,
};