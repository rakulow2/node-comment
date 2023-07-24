const bcrypt = require('bcrypt');

// 함수 : 비밀번호 해싱/솔팅
const hashPasswordHook = async function () {
  try {
    const salt = await bcrypt.genSalt(10); // salt 생성
    const hashedPassword = await bcrypt.hash(this.password, salt); // 생성된 salut를 사용해 비밀번호 해싱
    this.password = hashedPassword; // 비밀번호를 해싱된 비밀번호로 지정
  } catch (error) {
    console.error(error)
  }
};

module.exports = {
  hashPasswordHook,
};
