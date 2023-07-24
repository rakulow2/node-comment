const jwt = require("jsonwebtoken");
const User = require("../models/user-shema");

module.exports = async (req, res, next) => {
  const { Authorization } = req.cookies; // cookies안에 있는 Authorization 가져옴

  if (!Authorization) {
    res.status(403).json({
      errorMessage: "로그인이 필요한 기능입니다."
    });
    return;
  }

  const [authType, authToken] = (Authorization ?? "").split(" ");

  // authType === Bearer값인지 확인 / authToken 검증 필요
  if (authType !== 'Bearer' || !authToken) {
    res.status(403).json({
      errorMessage: "전달된 쿠키에서 오류가 발생하였습니다."
    });
    return;
  }

  try {
    const { userId } = jwt.verify(authToken, "customized-secret-key", { ignoreExpiration: true });
    // console.log(userId)

    const user = await User.findOne({ nickname: userId });
    // console.log(user)

    if (!user) {
      return res.status(400).json({ errorMessage: "사용자를 찾을 수 없습니다." });
    }

    res.locals.user = user;

    next();

  } catch (error) {
    console.error(error);
    res.status(403).json({ errorMessage: "오류발생" })
  }
};