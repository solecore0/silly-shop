import ms from "ms";
import { Response } from "express";

const refreshCookieExpireTime = process.env.REFRESH_COOKIE_EXPIRE || "2w";

export const sendTokens = (user: any, statusCode: number, res: Response) => {
  const { accessToken, refreshToken } = user.getJwtTokens();
  // console.log(token)
  const refreshToken_expireSeconds = ms(refreshCookieExpireTime) / 1000;

  // console.log(`Expire seconds: ${expireSeconds}`);
  const resfreshTokenOptions = {
    expires: new Date(Date.now() + refreshToken_expireSeconds * 1000),
    httpOnly: true,
  };
  res
    .status(statusCode)
    .cookie("refreshToken", refreshToken, resfreshTokenOptions)
    .json({
      success: true,
      message: `Welcome ${user.name}`,
      token: accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        photo: user.photo,
      },
    });
};
