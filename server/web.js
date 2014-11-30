var gzippo = require('gzippo');
var express = require('express');
var bodyParser = require('body-parser');
var glob = require('glob');
var fs = require('fs');
var path = require('path');
var buildDir = __dirname + '/../build';
var acornsDir = buildDir +'/acorns';

var app = express();
app.use(gzippo.staticGzip(buildDir));
app.use(bodyParser.json());
app.use('/acorn',express.static(acornsDir));

app.listen(process.env.PORT || 1337);

app.get('/api/login/:userName',function(req,res){
   var userPath = acornsDir+'/'+req.params.userName;
   fs.exists(userPath, function(exists){
      if(!exists){
         fs.mkdir(userPath);
      }
      res.send('ok');
   });
});

app.get('/api/:userName/acorns',function(req,res){
   var userPath = acornsDir+'/'+req.params.userName;
   var files = [];
   fs.exists(userPath,function(exists) {
      if(!exists) res.send(files);
       fs.readdir(userPath, function (err, files) {
          if(files) {
             files = files.filter(function (file) {
                return fs.statSync(userPath + '/' + file).isDirectory();
             });
          }
          res.send(files);
       });
   });
});

app.post('/api/:userName/acorns/add', function(req, res){
   var userPath = acornsDir + '/' + req.params.userName;
   var acornName = req.body.acornName;
   var acornPath = userPath + '/' + acornName;

   fs.mkdir(acornPath,function(result){
      res.send('ok');
   });
});

app.get('/api/:userName/acorns/:acornName',function(req,res){
   var acornPath = acornsDir + '/' + req.params.userName + '/' + req.params.acornName;
   var resultFiles = [];
   glob(acornPath + '/*.*', function(err,files){
      for(var i=0;i<files.length;i++)
      {
         resultFiles.push({
            fileName:path.basename(files[i]),
            fileType:path.extname(files[i]).substr(1)
         });
      }
      res.send(resultFiles);
   });
});

app.post('/api/:userName/acorns/:acornName/:fileName',function(req,res){
   var filePath = acornsDir + '/' + req.params.userName + '/' + req.params.acornName + '/' + req.params.fileName;
   var fileContents = req.body.file;
   fs.writeFile(filePath,fileContents,function(err){
      res.send('ok');
   })
});

app.get('/api/:userName/acorns/:acornName/:fileName',function(req,res){
   var filePath = acornsDir + '/' + req.params.userName + '/' + req.params.acornName + '/' + req.params.fileName;

   fs.readFile(filePath,
      {
         flag:'a+',
         encoding: 'utf8'
      },
      function(err,data){
         res.send({
            file:data
      });
   });
});





