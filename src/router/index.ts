import { Router, Request, Response } from "express";
import { dbService } from "../config/firebase";

interface logType {
  timeStamp: string;
  winner1: string;
  winner1_point: number;
  winner2: string;
  winner2_point: number;
  loser1: string;
  loser1_point: number;
  loser2: string;
  loser2_point: number;
}
/*
☆ 10월 티라미드 계급 ☆

- 천계 (11 ~ ) -
내수용 +15
인.재 +12

- 왕족 (8 ~ 10) -
영.재 +10
태.진 +10

- 귀족 (4 ~ 7)
민.규 +6
블.랙 +7
민.재 +6
준.석 +6
유.진 +5
두.리 +3(기부)
규.호 +5
미.란 +4
영.연 +4

- 평민 (0 ~ 3)
성.진 +2
동.현 +2
정.원 0

- 노예 (-1 ~ 10)
성.우 -1
한.별 -1
재.원 -1
의.윤 -2
찬.문 -2
준.범 -2
한.슬 -3
현.정 -4
누.렁 -4
봄.브 -4
영.진 -5
썰.영 -8
주.연 -10
소.라 -11

- 심해 (-11~ )
경.열 -14
현.준 -17


티라미드 -8
*/
const AppRouter = Router();
AppRouter.get("/", async (req: Request, res: Response) => {
  return res.send({ success: true });
});
// AppRouter.use("/user", UserRouter);

AppRouter.get("/point", async (req: Request, res: Response) => {
  const logs: logType[] = [];
  const total: any = {};
  const now = new Date();
  const rank = [
    { point: 11, title: "왕족" },
    { point: 8, title: "귀족" },
    { point: 4, title: "평민" },
    { point: 0, title: "노예" },
    { point: -10, title: "심해" },
    { point: -100, title: "지옥" },
  ];
  let msg = "이번달 티라미드 계급\n\n" + "- 천계 -\n";

  const snapshot = await dbService
    .collection(`playerList${now.getFullYear()}${now.getMonth() + 1}`)
    .get();
  snapshot.forEach((doc) => {
    const data = { ...doc.data() } as logType;
    logs.push(data);
  });
  for (let i = 0; i < logs.length; i++) {
    if (total.hasOwnProperty(logs[i].winner1)) {
      total[logs[i].winner1] += logs[i].winner1_point;
    } else {
      total[logs[i].winner1] = logs[i].winner1_point;
    }
    if (total.hasOwnProperty(logs[i].winner2)) {
      total[logs[i].winner2] += logs[i].winner2_point;
    } else {
      total[logs[i].winner2] = logs[i].winner2_point;
    }
    if (total.hasOwnProperty(logs[i].loser1)) {
      total[logs[i].loser1] -= logs[i].loser1_point;
    } else {
      total[logs[i].loser1] = -1 * logs[i].loser1_point;
    }
    if (total.hasOwnProperty(logs[i].loser2)) {
      total[logs[i].loser2] -= logs[i].loser2_point;
    } else {
      total[logs[i].loser2] = -1 * logs[i].loser2_point;
    }
  }
  const sortArr = Object.entries(total).sort(
    (a: any, b: any) => b[1] - a[1],
  ) as [string, number][];
  let thisrank = 0;
  for (let i = 0; i < sortArr.length; i++) {
    if (sortArr[i][1] < rank[thisrank].point) {
      msg += "\n";
      msg += `- ${rank[thisrank].title} -\n`;
      thisrank++;
      i--;
      continue;
    }
    if (sortArr[i][0] === "소라") {
      msg += `${sortArr[i][0].split("").join(".")} : ${15} (사실${
        sortArr[i][1]
      })\n`;
    } else {
      msg += `${sortArr[i][0].split("").join(".")} : ${sortArr[i][1]}\n`;
    }
  }
  return res.send({ success: true, msg });
});
AppRouter.post("/point", async (req: Request, res: Response) => {
  const inputArr = req.body.input.split("\n");
  const logTime = new Date();
  const doc = `${logTime.getFullYear()}${logTime.getMonth() + 1}`;
  const logDate = ("0" + String(logTime.getDate())).slice(-2);
  const logHour = ("0" + String(logTime.getHours())).slice(-2);
  const logMinute = ("0" + String(logTime.getMinutes())).slice(-2);
  const games = {
    winner1: "",
    winner2: "",
    loser1: "",
    loser2: "",
    winner1_point: 0,
    winner2_point: 0,
    loser1_point: 0,
    loser2_point: 0,
    timeStamp: `${logDate}${logHour}${logMinute}`,
  };
  try {
    if (inputArr[1][0] === "승" && inputArr[2][0] === "패") {
      const winners = inputArr[1].split(" "); //[승,썰1.1,썰2.2]
      const losers = inputArr[2].split(" "); //[패,썰3.2, 썰4]
      const winner1 =
        typeof winners[1] === "string" ? winners[1].split(".") : null;
      const winner2 =
        typeof winners[2] === "string" ? winners[2].split(".") : null;
      const loser1 =
        typeof losers[1] === "string" ? losers[1].split(".") : null;
      const loser2 =
        typeof losers[2] === "string" ? losers[2].split(".") : null;
      if (winner1 && winner2 && loser1 && loser2) {
        games.winner1 = winner1[0];
        games.winner1_point = winner1[1] ? Number(winner1[1]) : 1;
        games.winner2 = winner2[0];
        games.winner2_point = winner2[1] ? Number(winner2[1]) : 1;
        games.loser1 = loser1[0];
        games.loser1_point = loser1[1] ? Number(loser1[1]) : 1;
        games.loser2 = loser2[0];
        games.loser2_point = loser2[1] ? Number(loser2[1]) : 1;
      } else {
        throw {
          message: "형식을 맞춰서 입력해주세요",
        };
      }
    } else if (inputArr[1][0] === "패" && inputArr[2][0] === "승") {
      const losers = inputArr[1].split(" "); //[패,썰1.1,썰2.2]
      const winners = inputArr[2].split(" "); //[승,썰3.2, 썰4]
      const winner1 =
        typeof winners[1] === "string" ? winners[1].split(".") : null;
      const winner2 =
        typeof winners[2] === "string" ? winners[2].split(".") : null;
      const loser1 =
        typeof losers[1] === "string" ? losers[1].split(".") : null;
      const loser2 =
        typeof losers[2] === "string" ? losers[2].split(".") : null;
      if (winner1 && winner2 && loser1 && loser2) {
        games.winner1 = winner1[0];
        games.winner1_point = winner1[1] ? Number(winner1[1]) : 1;
        games.winner2 = winner2[0];
        games.winner2_point = winner2[1] ? Number(winner2[1]) : 1;
        games.loser1 = loser1[0];
        games.loser1_point = loser1[1] ? Number(loser1[1]) : 1;
        games.loser2 = loser2[0];
        games.loser2_point = loser2[1] ? Number(loser2[1]) : 1;
      } else {
        throw {
          message: "형식을 맞춰서 입력해주세요",
        };
      }
    } else {
      throw {
        message: "형식을 맞춰서 입력해주세요",
      };
    }
    if (
      games.loser1_point + games.loser2_point !==
      games.winner1_point + games.winner2_point
    ) {
      throw {
        message: "점수가 맞지 안습니다.",
      };
    } else {
      await dbService.collection(`playerList${doc}`).add(games);
    }
    return res.send({ success: true, msg: "입력이 완료되었습니다." });
  } catch (error) {
    return res.send({ success: false, msg: error.message });
  }
});

export default AppRouter;
