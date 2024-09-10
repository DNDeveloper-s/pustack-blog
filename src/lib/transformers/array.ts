export function breakdownArray<T>(arr: T[]): T[][] {
  let result = [];
  let lengths = [5, 4, 3, 2]; // Possible subarray lengths
  let index = 0;

  while (index < arr.length) {
    let remaining = arr.length - index;

    // If the remaining length is 6, split it into [3, 3] to avoid invalid subarray lengths
    if (remaining === 6) {
      result.push(arr.slice(index, index + 3));
      index += 3;
      result.push(arr.slice(index, index + 3));
      index += 3;
    }
    // For remaining length 7, split it into [4, 3] to avoid invalid subarrays
    else if (remaining === 7) {
      result.push(arr.slice(index, index + 4));
      index += 4;
      result.push(arr.slice(index, index + 3));
      index += 3;
    }
    // For other cases, proceed as usual with allowed lengths
    else {
      let length = lengths.find((len) => len <= remaining) ?? 3;
      result.push(arr.slice(index, index + length));
      index += length;
    }
  }

  return result;
}
