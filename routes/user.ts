// routes/user.ts
import express from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const router = express.Router();

const client = new PrismaClient();

// POST URL: 유저 생성
router.post("/", async (req, res) => {
  try {
    const { account, password } = req.body;

    // account, password를 보내지 않은 경우
    if (!account || !password) {
      return res.status(400).json({
        ok: false,
        message: "Not exist data.",
      });
    }

    // 중복되는 account가 있는 경우
    const existUser = await client.user.findUnique({
      where: {
        account,
      },
    });

    if (existUser) {
      return res.status(400).json({
        ok: false,
        message: "User already existed.",
      });
    }

    // user 생성하기
    const hashedPassword = bcrypt.hashSync(password, 10);

    await client.user.create({
      data: {
        account,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ account }, process.env.JWT_SECRET_KEY!);

    return res.json({
      ok: true,
      token,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      message: "Server error.",
    });
  }
});

// 유저 검증 라우트
router.post("/test", async (req, res) => {
  try {
    const { account, password } = req.body;

    if (!account || !password) {
      return res.status(400).json({
        ok: false,
        message: "Not exist data",
      });
    }

    const user = await client.user.findUnique({
      where: {
        account,
      },
    });

    if (!user) {
      return res.status(400).json({
        ok: false,
        message: "Not exist user",
      });
    }

    const result = bcrypt.compareSync(password, user.password);

    if (!result) {
      return res.status(400).json({
        ok: false,
        message: "Not correct password",
      });
    }

    const token = jwt.sign({ account }, process.env.JWT_SECRET_KEY!);

    return res.json({
      ok: true,
      token,
    });
  } catch (error) {
    return;
  }
});

export default router;
