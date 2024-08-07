export function getRandomDarkHexColor() {
  let color = "#";
  for (let i = 0; i < 3; i++) {
    // Generate a random number between 0 and 127 (to keep it dark)
    let randomValue = Math.floor(Math.random() * 128);
    // Convert to hexadecimal and ensure it's two digits
    let hex = randomValue.toString(16).padStart(2, "0");
    color += hex;
  }
  return color;
}
