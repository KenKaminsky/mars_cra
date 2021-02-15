export const wrapInGenerator = async <T>(
  array: T[],
  cb: (val: T) => void,
  delay = 0,
): Promise<void> => {
  function* generatorFunction() {
    for (let i = 0; i < array.length; i++) {
      yield array[i];
    }
  }
  for (const val of generatorFunction()) {
    await new Promise((res) => setTimeout(res, delay));
    await cb(val);
  }
};
