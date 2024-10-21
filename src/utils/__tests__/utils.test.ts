import {formatBytes, getTextSizeInBytes, unwrap} from '..';

describe('formatBytes', () => {
  it('formats bytes correctly when the size is 0', () => {
    expect.assertions(1);
    expect(formatBytes(0)).toBe('0 B');
  });

  it('formats bytes correctly', () => {
    expect.assertions(1);
    expect(formatBytes(1024)).toBe('1 kB');
  });
});

describe('getTextSizeInBytes', () => {
  it('calculates the size for a simple text', () => {
    expect.assertions(1);
    const text = 'text';
    expect(getTextSizeInBytes(text)).toBe(4);
  });

  it('calculates the size for an emoji text', () => {
    expect.assertions(1);
    const text = '🤔 🤓';
    expect(getTextSizeInBytes(text)).toBe(9);
  });
});

describe('unwrap', () => {
  it('returns an empty object', () => {
    expect.assertions(1);
    expect(unwrap(undefined)).toStrictEqual({});
  });

  it('returns a provided prop', () => {
    expect.assertions(1);
    const prop = 'prop';
    expect(unwrap(prop)).toStrictEqual(prop);
  });
});
