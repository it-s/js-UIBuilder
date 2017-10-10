// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
//import eslint from 'rollup-plugin-eslint';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: 'src/uiBuilder.js',
  format: 'cjs',
  sourceMap: true,
  plugins: [
    resolve(),
    //eslint(),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    }),
    (!process.env.DEBUG && uglify()),
  ],
  dest: 'dist/uibuilder.js'
};