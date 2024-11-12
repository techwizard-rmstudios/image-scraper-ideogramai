const fs = require("fs");
const tar = require("tar");

const { storePath, con } = require("./config");

async function writeFile(path, fileStream) {
  await fs.writeFileSync(path, fileStream);
}

async function createTar(round) {
  const fileName = `bucket_${String(round).padStart(6, "0")}.tar`;
  try {
    await tar.c({ file: fileName, cwd: storePath }, ["."]);
    await fs.rmSync(storePath, { recursive: true });
    await fs.mkdirSync(storePath, { recursive: true });
    console.log(`Created ${fileName} and initialized store.`);
  } catch (err) {
    console.log("Error:", err.message);
  }
}

async function insertImg(name, round) {
  return await new Promise((resolve, reject) => {
    con.query(`INSERT INTO images (name, round, created_at) VALUES ('${name}', '${round}', '${new Date().getTime()}')`, function (err, result) {
      if (err) {
        console.log(err.message);
        reject(err.message);
      }
      resolve(result);
    });
  });
}

async function findImg(name) {
  return await new Promise((resolve, reject) => {
    con.query(`SELECT * FROM images WHERE name = '${name}'`, function (err, result) {
      if (err) {
        console.log(err.message);
        reject(err.message);
      }
      resolve(result.length);
    });
  });
}

async function getLastRound() {
  return await new Promise((resolve, reject) => {
    con.query("SELECT round FROM images ORDER BY id DESC LIMIT 1", function (err, result) {
      if (err) {
        console.log(err.message);
        reject(err.message);
      }

      if (result.length > 0) {
        resolve(result[0].round);
      } else {
        resolve(1);
      }
    });
  });
}

module.exports = {
  writeFile,
  createTar,
  insertImg,
  findImg,
  getLastRound,
};
