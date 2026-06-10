const fs = require('fs');
const path = require('path');

const src = 'C:\\Users\\Administrator\\.gemini\\antigravity\\brain\\426c386f-33cd-4b83-b394-1e834797eb5d\\media__1781060668259.png';
const dst = path.join(__dirname, 'img', 'azure_vision_ocr.png');

fs.copyFile(src, dst, (err) => {
    if (err) {
        console.error('이미지 복사 실패:', err);
    } else {
        console.log('이미지 복사 성공! d:\\KJH\\html\\portfolio\\img\\azure_vision_ocr.png 위치에 저장되었습니다.');
    }
});
