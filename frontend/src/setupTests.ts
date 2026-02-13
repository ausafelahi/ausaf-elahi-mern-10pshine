import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;

delete (window as any).location;
window.location = {
  href: "",
  pathname: "",
  search: "",
  hash: "",
  host: "localhost",
  hostname: "localhost",
  origin: "http://localhost",
  port: "",
  protocol: "http:",
  assign: jest.fn(),
  reload: jest.fn(),
  replace: jest.fn(),
  toString: jest.fn(() => "http://localhost"),
} as any;
