export type RgbTuple = [red: number, green: number, blue: number];

export function rgb(input: string): RgbTuple {
  const regex = /rgb\(([0-9]{1,3}),\s?([0-9]{1,3}),\s?([0-9]{1,3})\)/;

  const match = input.match(regex);

  if (!match) {
    throw new Error(`'${input}' is not of format 'rgb(r, g, b)'.`);
  }

  const [_, r, g, b] = match;

  return [r, g, b].map(parseFloat) as [number, number, number];
}

export function luminance(r: number, g: number, b: number) {
  const a = [r, g, b].map((v) => {
    v /= 255;

    if (v <= 0.03928) {
      return v / 12.92;
    }

    return Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function contrast(colour1: string, colour2: string) {
  const rgb1 = rgb(colour1);
  const rgb2 = rgb(colour2);

  const lum1 = luminance(...rgb1);
  const lum2 = luminance(...rgb2);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}
