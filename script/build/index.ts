const fs = require("fs");
const xlsx = require("node-xlsx");

// =====> 默认是CN, 当提供了翻译的xlsx文件时, 就改成EN,并执行这个脚本
const LAN = "CN";

enum Race {
  "Spacemen" = 1,
  "Terran" = 2,
  "Zerg" = 3,
}
enum RaceCN {
  "宇宙" = 1,
  "人" = 2,
  "虫" = 3,
}
const getTranslateData = (path: string) => {
  // 解析得到文档中的所有 sheet
  const sheets = xlsx.parse(path);
  const races = {};

  sheets.forEach((sheet) => {
    const data = sheet["data"].slice(1);
    const race =
      LAN === "CN"
        ? RaceCN[sheet["name"] as string]
        : Race[sheet["name"] as string];
    races[race] = [];
    let groupDesc = "";

    for (const rowId in data) {
      const row = data[rowId];
      const col1 = row[0]?.replace(/\t/g, "");
      let col2 = row[1]?.replace(/\t/g, "");
      const col3 = row[2];
      console.log(col3, "----", col1);

      // 解决xlsx文件中描述一列合并的情况
      if (col2) {
        groupDesc = col2;
      } else {
        col2 = groupDesc;
      }

      const nameSplit = col1?.indexOf("\r\n");
      const descSplit = col2?.indexOf("\r\n");

      if (LAN !== "CN" && nameSplit !== -1) {
        races[race].push({
          id: col3,
          nameCN: col1.substring(0, nameSplit),
          name: col1.substring(nameSplit + 2),
          descCN: col2.substring(0, descSplit),
          desc: col2.substring(descSplit + 2),
        });
      } else {
        races[race].push({
          id: col3,
          nameCN: col1,
          name: "",
          descCN: col2,
          desc: "",
        });
      }
    }
  });
  return races;
};

const writeRaceConfigFile = (res: any) => {
  const raceObj = JSON.parse(JSON.stringify(res));
  for (const obj in raceObj) {
    const list = raceObj[obj].map((item) => {
      if (LAN === "CN") {
        return {
          index: item.id,
          name: item.nameCN,
          desc: item.descCN,
        };
      }
      return {
        index: item.id,
        name: item.name,
        desc: item.desc,
      };
    });
    raceObj[obj] = list;
  }

  fs.writeFile(
    "./build/config.json",
    JSON.stringify(raceObj, null, 2),
    (error) => {
      if (error) {
        console.log("写入config.json文件错误！");
      }
      console.log("写入config.json文件成功！");
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
  // 从.xlsx文件中读取数据
  const rs = getTranslateData("./0708 建筑描述.xlsx");
  // 写入raceConfig文件
  writeRaceConfigFile(rs);
  // 写入translation文件
  // writeTranslationFile(rs);
  // 写入zh-CN文件
  // writeZhCNFile(rs);
};
translateMain();
