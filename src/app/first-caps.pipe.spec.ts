import { FirstCapsPipe } from './first-caps.pipe';

describe('FirstCapsPipe', () => {
  it('create an instance', () => {
    const pipe = new FirstCapsPipe();
    expect(pipe).toBeTruthy();
  });
});
