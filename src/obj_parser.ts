import uploadImage from "./img_upload";

const recursiveObjectParser = <T>(input: T): T => {
  if (Array.isArray(input)) return input.map(recursiveObjectParser) as T;
  if (typeof input === 'object') for (const key in input) input[key] = recursiveObjectParser(input[key]);
  if (typeof input === 'string') return (input.startsWith('data:image/') ? uploadImage(input) : input) as T;
  return input;
}

export default recursiveObjectParser;
