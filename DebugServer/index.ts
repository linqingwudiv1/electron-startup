import express from 'express';
import path from 'path';
import {Express} from 'express';
import {readFileSync} from 'fs';
export default (app:Express, http:any) => {

  app.use(express.json());
  app.use(express.static(path.join(__dirname, 'public'), {    
    extensions:['*']
  }));

  app.get('/AppVersion', ( req, res ) => 
  {
    res.json({Version: '0.0.1'});
  });
  
  app.get('/GetNeedDownloadList', ( req, res ) =>
  {
    //#region 
    let data = [{
      "title": "demo.MP4",
      "uri": "/public/demo.MP4",
      "contentSize": 0,
      "transferSize": 0,
      "segment": 0,
      "segment_transferSize": 0,
      "fileType": 0,
      "state": 0,
      "requests": []
    }, {
      "title": "管理端.zip",
      "uri": "/管理端.zip",
      "contentSize": 0,
      "transferSize": 0,
      "segment": 0,
      "segment_transferSize": 0,
      "fileType": 1,
      "state": 0,
      "requests": []
    }, {
      "title": "favicon.ico",
      "uri": "/favicon.ico",
      "contentSize": 0,
      "transferSize": 0,
      "segment": 0,
      "segment_transferSize": 0,
      "fileType": 0,
      "state": 0,
      "requests": []
    }, {
      "title": "package-lock.json",
      "uri": "/package-lock.json",
      "contentSize": 0,
      "transferSize": 0,
      "segment": 0,
      "segment_transferSize": 0,
      "fileType": 0,
      "state": 0,
      "requests": []
    }, {
      "title": "1.jpg",
      "uri": "/1.jpg",
      "contentSize": 0,
      "transferSize": 0,
      "segment": 0,
      "segment_transferSize": 0,
      "fileType": 0,
      "state": 0,
      "requests": []
    }, {
      "title": "服装DIY.MP4",
      "uri": "/服装DIY.MP4",
      "contentSize": 0,
      "transferSize": 0,
      "segment": 0,
      "segment_transferSize": 0,
      "fileType": 0,
      "state": 0,
      "requests": []
    }];
    //#endregion
    let Version = req.query.version;
    res.json({
              DownloadDirList :data 
            });
  });
}


let arr = [1,34,56,7887,23122,546,76,87,32543,76,32];

for(let i = 0; i < arr.length; i++)
{
  let temp = arr[i];
  for(let j = i + 1; j < arr.length; j++)
  {
    if (arr[i] < arr[j])
    {
      arr[i] = arr[j];
      arr[j] = temp;
    }
  }
}


for(let i = 1; i < arr.length;i++)
{
  let temp = arr[i];
  for( let j = 0; j <  i - 1; j++ )
  {

  }
}