const fs = require("fs");
const xlsx = require("node-xlsx");

enum Race {
  "Spacemen" = 1,
  "Terran" = 2,
  "Zerg" = 3,
}

const getTranslateData = (path: string) => {
  // 解析得到文档中的所有 sheet
  const sheets = xlsx.parse(path);
  const races = {};

  sheets.forEach((sheet) => {
    // 名称、描述、特点
    const description = sheet["data"][0][2]?.replace(/\t/g, "").split("\r\n");
    races[sheet["name"]] = {
      name: `race-${Race[sheet["name"]]}`,
      desc: description[2],
      descCN: description[0],
      features: description[3]?.substring(10),
      featuresCN: description[1]?.substring(3),
      children: [],
    };

    // 兵种
    const data = sheet["data"].slice(2);
    for (const rowId in data) {
      const row = data[rowId];
      const newRow1 = row[1]?.replace(/\t/g, "");
      const newRow2 = row[2]?.replace(/\t/g, "");
      const nameSplit = newRow1?.indexOf("\r\n");
      const descSplit = newRow2?.indexOf("\r\n");
      if (newRow1 && newRow2) {
        races[sheet["name"]].children.push({
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
  const raceObj = JSON.parse(JSON.stringify(res));
  for (const obj in raceObj) {
    const race = Race[obj as string];
    const list = raceObj[obj].children.map((item) => {
      return {
        id: item.id,
        name: item.name,
        desc: item.desc,
        thumb1: `/assets/modal/${race}/${item.id}-1.png`,
        thumb2: `/assets/modal/${race}/${item.id}-2.png`,
      };
    });
    raceObj[obj].children = list;
    delete raceObj[obj].descCN;
    delete raceObj[obj].featuresCN;
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
    raceObj[res[obj].desc] = res[obj].desc;
    raceObj[res[obj].features] = res[obj].features;
    res[obj].children.forEach((item) => {
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
    raceObj[res[obj].desc] = res[obj].descCN;
    raceObj[res[obj].features] = res[obj].featuresCN;
    res[obj].children.forEach((item) => {
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
  const rs = getTranslateData("./0616 种族描述翻译.xlsx");
  // 写入raceConfig文件
  writeRaceConfigFile(rs);
  // 写入translation文件
  writeTranslationFile(rs);
  // 写入zh-CN文件
  writeZhCNFile(rs);
};
translateMain();
