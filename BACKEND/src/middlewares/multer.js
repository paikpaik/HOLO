const multer = require('multer');

// 파일 저장 경로와 파일명 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'FRONT/views/public/images')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1])
  }
});

// 파일 필터링
const fileFilter = function(req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('이미지 파일만 업로드 가능합니다.'));
  }
  cb(null, true);
}

// multer 미들웨어 설정
const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter 
})

module.exports = upload;