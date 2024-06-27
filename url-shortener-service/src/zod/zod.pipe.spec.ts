import { z } from 'zod';
import { ZodPipe } from './zod.pipe';

describe('ZodPipe', () => {
  it('should be defined', () => {
    expect(new ZodPipe(z.null())).toBeDefined();
  });
});
