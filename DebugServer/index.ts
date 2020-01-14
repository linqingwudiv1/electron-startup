import express,{Express,Router} from 'express';
import path from 'path';
import {readFileSync} from 'fs';
import homeRoute from './src/controller/home';
import assetRoute from './src/controller/asset';


/**
 * 
 */
export default (app:Express, http:any) => {
  app.use( express.json( {} ) );
  /** 中间件http头设置 */
  app.all('*', ( req, res, next ) =>
  {
    //默认返回text/json
    res.setHeader('Content-Type', 'text/json;charset=utf-8');

    //将所有查询参数转换为小写.... 
    for (let key in req.query)
    {
      req.query[key.toLowerCase()] = req.query[key];
      delete req.query[key];
    }

    next();
  });

  //#region Route
  app.use('/', homeRoute);
  app.use('/asset', assetRoute);
  //#endregion
}
