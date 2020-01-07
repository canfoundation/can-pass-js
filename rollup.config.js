import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
import dotenv from 'rollup-plugin-dotenv';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'lib/can-pass-api.js',
      format: 'umd',
      name: 'can-pass-api',
      sourcemap: true,
    },
  ],
  plugins: [
    dotenv(),
    commonjs(),
    resolve({
      extensions,
    }),
    babel({
      exclude: 'node_modules/**',
      extensions,
    }),
    uglify(),
  ],
};
