const fs = require("fs");
const data = require("./test.json");

enum Race {
  "宇宙人" = 1,
  "人族" = 2,
  "虫族" = 3,
}

const getData = () => {
  let objRs = {};
  const list = [...data];
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const race = Race[item.name as string];
    for (let j = 2; j < item.children.length; j++) {
      const el = item.children[j];
      el["thumb1"] = `/assets/modal/${race}/${el.id}-1.png`;
      el["thumb2"] = `/assets/modal/${race}/${el.id}-2.png`;
      if (el.thumb) delete el.thumb;
    }
    objRs[race] = { ...item, children: item.children.slice(2) };
    const desc = item.children[0].desc;
    objRs[race]["desc"] = desc.substring(0, desc.indexOf("\r\n"));
    objRs[race]["features"] = desc.substring(desc.indexOf("\r\n") + 5);
  }

  return objRs;
};

const main = async () => {
  const rs = getData();
  fs.writeFile("./raceConfig.json", JSON.stringify(rs, null, 2), (error) => {
    if (error) {
      console.log("写入文件错误！");
    }
    console.log("写入文件成功！");
  });
};

main();
