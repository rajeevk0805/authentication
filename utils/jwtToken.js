import jwt from "jsonwebtoken";

export const sendToken = (user, statusCode, message, res) => {
  const token = jwt.sign(
    { username: user.username, id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );

  const cookieExpireHours = parseInt(process.env.COOKIE_EXPIRE);

  const options = {
    expires: new Date(Date.now() + cookieExpireHours * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  return res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      message: message,
      token: token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
};
