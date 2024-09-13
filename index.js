const puppeteer = require("puppeteer-core");
const { con, storePath, chromePath, url, cookies, assetsUrl } = require("./config");
const { writeFile, createTar, insertImg, findImg, getLastRound } = require("./utils");

(async () => {
  await con.connect((err) => {
    if (err) throw err;
    console.log("Connected to the database");
  });

  let round = await getLastRound();
  while (round < 280) {
    try {
      const browser = await puppeteer.launch({
        executablePath: chromePath,
        headless: false,
      });
      const page = await browser.newPage();

      await page.goto(url, { waitUntil: "domcontentloaded" });
      await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36");
      await page.setCookie(...cookies);

      let index = 0;
      while (index < 1000) {
        try {
          await page.goto(url, { waitUntil: "domcontentloaded" });
          const res = await page.evaluate(() => document.body.innerText);
          const data = JSON.parse(res);

          for (const item of data) {
            const prompt = item.user_prompt;
            const resolution = item.resolution;
            const height = item.height;
            const width = item.width;

            if (resolution > 1000) {
              for (const n of item.responses) {
                const magic_prompt = n.prompt;
                const img_url = assetsUrl + n.response_id;

                const img_details = {
                  url: img_url,
                  resolution: resolution,
                  height: height,
                  width: width,
                  prompt: prompt,
                  magic_prompt: magic_prompt,
                };

                const imgName = n.response_id + ".jpg";
                const jsonName = n.response_id + ".json";

                if ((await findImg(imgName)) > 0) break;
                const response = await page.goto(img_url, { waitUntil: "domcontentloaded" });

                if (response.ok()) {
                  try {
                    const buffer = await response.buffer();
                    writeFile(storePath + imgName, buffer);
                    writeFile(storePath + jsonName, JSON.stringify(img_details, null, 2));
                    insertImg(imgName, round);

                    index += 1;
                  } catch (err) {
                    console.error("Error writing file.");
                  }
                } else {
                  console.log("Failed to download image.");
                }
              }
            }
          }
        } catch (err) {
          console.log("(PageLoad)Error: ", err.message);
        }
      }
      createTar(round);
      round += 1;

      await browser.close();
    } catch (err) {
      console.log("(Restart)Error: ", err.message);
    }
  }

  await con.destroy();
})();
