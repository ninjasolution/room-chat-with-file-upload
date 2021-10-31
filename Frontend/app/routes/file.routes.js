const video = require('express').Router();
const fs = require('fs');
const path = require('path')
const multer = require('multer');
const service = require('../service');

module.exports = app => {

  app.post('/api/file/upload/:roomName', upload.single('file'), (req, res) => {

    if (!req.file) {
        console.log("No file is available!");
        return res.send({
          success: false
        });
    
      } else {

        console.log(req.file)

        const words = req.file.originalname.split('.');
        const fileType = words[words.length-1];
        const fileName = `${req.params.roomName}-${new Date().getMonth()}M ${new Date().getDate()}D ${new Date().getFullYear()}Y ${new Date().getHours()}H ${new Date().getMinutes()}M ${new Date().getSeconds()}S.${fileType}`;

        setTimeout(() => {
          fs.rename('./files/'+ req.file.originalname, './files/'+fileName, function(err) {
            if ( err ) console.log('ERROR: ' + err);
          });
          service.serverSocket.emit('newFile', fileName);  
        }, 1000);
        return res.send({
          success: true
        });
      }
  })

  app.get('/api/file/:fileName', (req, res) => {
    
    var url = path.join(__dirname, '../../files/')
    res.sendFile(`${url}/${req.params.fileName}`);
  })

  app.delete('/api/file/:fileName', (req, res) => {
    fs.unlink(`./files/${req.params.fileName}`, (err) => {
      if(err) res.status(500).send(err);
      res.status(200).send('success');
    })
  })

}


const storage = multer.diskStorage({

    destination: (req, file, cb) => {
      cb(null, './files');
    },
    filename: (req, file, cb) => {

      cb(null, file.originalname);
      
    }
});

const upload = multer({storage: storage});

function getFileType(file) {
  var filetype = '';
  if(file.mimetype === 'video/mp4') {
    filetype = 'mp4';
  }
  if(file.mimetype === 'image/png') {
    filetype = 'png';
  }
  if(file.mimetype === 'image/jpeg') {
    filetype = 'jpg';
  }
  if(file.mimetype === 'image/gif') {
    filetype = 'gif';
  }

  return filetype;
}


