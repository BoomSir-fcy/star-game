const fs = require("fs");
const xlsx = require("node-xlsx");

enum Race {
  "Spacemen" = 1,
  "Zerg" = 2,
  "Terran" = 3,
}

const getTranslateData = (path: string) => {
  // 解析得到文档中的所有 sheet
  const sheets = xlsx.parse(path);
  const races = {};

  sheets.forEach((sheet) => {
    races[sheet["name"]] = [];
    for (const rowId in sheet["data"]) {
      const row = sheet["data"][rowId];
      const newRow1 = row[1]?.replace(/\t/g, "");
      const newRow2 = row[2]?.replace(/\t/g, "");
      const nameSplit = newRow1?.indexOf("\r\n");
      const descSplit = newRow2?.indexOf("\r\n");
      if (newRow1 && newRow2) {
        races[sheet["name"]].push({
          id: row[0],
          nameCN: newRow1.substring(0, nameSplit),
          name: newRow1.substring(nameSplit + 2),
          descCN: newRow2.substring(0, descSplit),
          desc: newRow2.substring(descSplit + 2),
        });
      }
    }
  });
  return races;
};

const writeRaceConfigFile = (res: any) => {
  const raceObj = { ...res };
  for (const obj in raceObj) {
    const race = Race[obj as string];
    const list = raceObj[obj].map((item) => {
      return {
        id: item.id,
        name: item.name,
        desc: item.desc,
        thumb1: `/assets/modal/${race}/${item.id}-1.png`,
        thumb2: `/assets/modal/${race}/${item.id}-2.png`,
      };
    });
    raceObj[obj] = list;
  }

  fs.writeFile(
    "./translate/raceConfig.json",
    JSON.stringify(raceObj, null, 2),
    (error) => {
      if (error) {
        console.log("写入raceConfig.json文件错误！");
      }
      console.log("写入raceConfig.json文件成功！");
    }
  );
};

const writeTranslationFile = (res: any) => {
  const raceObj = {};
  for (const obj in res) {
    res[obj].forEach((item) => {
      raceObj[item.name] = item.name;
      raceObj[item.desc] = item.desc;
    });
  }

  fs.writeFile(
    "./translate/translation.json",
    JSON.stringify(raceObj, null, 2),
    (error) => {
      if (error) {
        console.log("写入translation.json文件错误！");
      }
      console.log("写入translation.json文件成功！");
    }
  );
};

const writeZhCNFile = (res: any) => {
  const raceObj = {};
  for (const obj in res) {
    res[obj].forEach((item) => {
      raceObj[item.name] = item.nameCN;
      raceObj[item.desc] = item.descCN;
    });
  }

  fs.writeFile(
    "./translate/zh-CN.json",
    JSON.stringify(raceObj, null, 2),
    (error) => {
      if (error) {
        console.log("写入zh-CN.json文件错误！");
      }
      console.log("写入zh-CN.json文件成功！");
    }
  );
};
const translateMain = async () => {
  // 从.xlsx文件中读取英文翻译
  const rs = getTranslateData("E:\\游戏\\0509 种族描述翻译.xlsx");
  // 写入raceConfig文件
  writeRaceConfigFile(rs);
  // 写入translation文件
  writeTranslationFile(rs);
  // 写入zh-CN文件
  writeZhCNFile(rs);
};
translateMain();
