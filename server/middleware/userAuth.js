import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
  console.log("token", token);
  if (!token) {
    return res.json({
      success: false,
      message: "Not authorised login again",
    });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    if (tokenDecode.id) {
      req.body.userId = tokenDecode.id;
    } else {
      return res.json({
        success: false,
        message: "Not auth login again",
      });
    }

    next();
  } catch (error) {
    return res.json({
      success: false,
      message: "no token",
    });
  }
};

export default userAuth;
