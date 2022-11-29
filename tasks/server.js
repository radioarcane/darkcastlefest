/*
   Local Development Server
*/
import Browser from 'browser-sync';
//import webpack from 'webpack';
//import webpackDevMiddleware from 'webpack-dev-middleware';
//import webpackHotMiddleware from 'webpack-hot-middleware';

import { config as webpackConfig } from './webpack';

const browser = Browser.create();
//const bundler = webpack(webpackConfig);

export function server() {
   const config = {
      //https: true,
      //port: 9999,
      serveStatic: ['./public', './src/static', {
         dir: './src/images',
         route: '/images'
      }],
      middleware: [
         //webpackDevMiddleware(bundler, { /* options */ }),
         //webpackHotMiddleware(bundler),
      ],
   };

   browser.init(config);
}

export function serverReload() {
   browser.reload();
}
