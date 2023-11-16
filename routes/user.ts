// routes/user.ts
import express from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

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
        message: "user already existed.",
      });
    }

    // user 생성하기
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await client.user.create({
      data: {
        account,
        password: hashedPassword,
      },
    });

    return res.json({
      ok: true,
      user: {
        id: newUser.id,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
        account: newUser.account,
      },
    });
  } catch (error) {
    /*
    backend에서 console.error(error)로 관리하지 않음.
    에러 로그를 기록해주는 방법을 사용함.
    keyword : node js morgan
    */
    console.error(error);

    return res.status(500).json({
      ok: false,
      message: "Server error.",
    });
  }
});

export default router;
