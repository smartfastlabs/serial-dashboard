export const COLORS = [
  "#000000", // Black
  "#1f77b4", // Blue
  "#ff7f0e", // Orange
  "#2ca02c", // Green
  "#d62728", // Red
  "#9467bd", // Purple
  "#8c564b", // Brown
  "#e377c2", // Pink
  "#7f7f7f", // Gray
  "#bcbd22", // Olive
  "#17becf", // Cyan
  "#aec7e8", // Light Blue
  "#ffbb78", // Light Orange
  "#98df8a", // Light Green
  "#ff9896", // Light Red
  "#c5b0d5", // Light Purple
  "#c49c94", // Light Brown
  "#f7b6d2", // Light Pink
  "#c7c7c7", // Light Gray
  "#dbdb8d", // Light Olive
  "#9edae5", // Light Cyan
];

function getRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}
