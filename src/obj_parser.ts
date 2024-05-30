import uploadImage from "./img_upload";

const recursiveObjectParser = async <T>(input: T): Promise<T> => {
  if (Array.isArray(input)) return input.map(recursiveObjectParser) as T;
  if (typeof input === 'object') for (const key in input) input[key] = await recursiveObjectParser(input[key]);
  if (typeof input === 'string') return (input.startsWith('data:image/') ? await uploadImage(input) : input) as T;
  return input;
}

export default recursiveObjectParser;
