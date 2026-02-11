module.exports = {
  spec: ["test/**/*.test.js"],

  require: ["test/setup.js"],

  reporter: "spec",

  timeout: 5000,

  exit: true,

  recursive: true,

  color: true,

  slow: 200,
};
