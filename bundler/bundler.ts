{
  async function bundle() {
    return await Bun.build({
      entrypoints: ['./src/index.js'],
      outdir: './dist',
      minify: true,
      sourcemap: "external",
      target: "node",
    });
  }

  const result = await bundle();
  result?.logs.forEach((log, index) => console.log(index, log));
}

export { }
