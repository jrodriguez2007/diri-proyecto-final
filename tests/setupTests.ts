import { afterAll, beforeAll } from "vitest";

// guarda el original
const realConsoleError = console.error;

beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('not wrapped in act')
    ) {
      return;
    }
    realConsoleError(...args);
  };
});

afterAll(() => {
  console.error = realConsoleError;
});
