import express,{Express,Router} from 'express';
import path from 'path';
import {readFileSync} from 'fs';
import homeRoute from './src/controller/home';
import assetRoute from './src/controller/asset';

/**
 * 
 */
export default (app:Express, http:any) => {
  app.use(express.json({}));


  /** 中间件http头设置 */
  app.all('*', (req, res, next) =>
  {
    res.setHeader('Content-Type', 'text/html;charset=utf-8');
    next();
  });

  //#region Route
  app.use('/', homeRoute);
  app.use('/asset', assetRoute);
  //#endregion
}
