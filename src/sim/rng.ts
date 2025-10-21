export function makeXorShift32(seed: number) {
  let s = seed >>> 0;
  return function rng() {
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17; s >>>= 0;
    s ^= s << 5;  s >>>= 0;
    return (s >>> 0) / 4294967296;
  };
}

export function lcgNext(seed: number) {
  return (seed * 1664525 + 1013904223) >>> 0;
}
