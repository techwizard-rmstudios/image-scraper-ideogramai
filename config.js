const mysql = require("mysql2");

const con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "123456",
  database: "store",
});
const storePath = "store/";
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const url = "https://ideogram.ai/api/f/p/load?page=0";
const assetsUrl = "https://ideogram.ai/assets/progressive-image/balanced/response/";
const cookies = [
  { name: "_ga", value: "GA1.1.85117377.1725987961" },
  { name: "AMP_MKTG_da0464495c", value: "JTdCJTdE" },
  {
    name: "__cf_bm",
    value: "vEdSI4nD.lyj9B8.6IyY7fZ58svXkuJecGhyXnO5M8s-1726062526-1.0.1.1-lo1E6TAlpl7WNCoXM85N9OsSBi7ig5cOEnZrM2k0NCFTE7C2xFJlIqGN6vkpKURYPnfg4fc19GGeHYGmFyWIlA",
  },
  {
    name: "cf_clearance",
    value: "COAp3Nk3l0jAy.Xx3Afst_hw0EuKJAmgyke_hPoG20M-1726062530-1.2.1.1-S0Q_6E4uKYxwhEsZEZOYt2GlzJVsoaTwBNsFL8AZfms5cV7EW25spCM6fiAWxjnOkTzr_ay7fA9GGG.4AvZh.mEqWd66uPaMlVvwZFb9gsWzc2ILCD5kJr21YLGlpinEwUu7Yj1rSih_6vPbnhLvP_bDs.1.guUkb7YD5zEw_wmqy.vEZiMsTtrrJEtEPm27wvGWaIG5FaHeRoAWCRGEdXI.Dizd4pASZKXtk3X_IkIHYTMsKqWzUEiz56WWuUrFkdIVj1_WyCed.1zoAmC5bK1uPbKrFOKBzw3kThpNpGmEggm79MNuyhd1pcH.On1vBjVsvEHnsZX5fd48RpmZ0YjjLj7dhP9FpzJZxHjU4u.PfIHSDIeubv_bK4hVX4l0",
  },
  {
    name: "session_cookie",
    value:
      "eyJhbGciOiJSUzI1NiIsImtpZCI6Il9hTEJEUSJ9.eyJpc3MiOiJodHRwczovL3Nlc3Npb24uZmlyZWJhc2UuZ29vZ2xlLmNvbS9pZGVvZ3JhbS1wcm9kIiwibmFtZSI6IlJNU3R1ZGlvcyIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NLX1FrMGxDWEE5d2pUT0xMajZaWV9yOHEwbFpidFVCT25aVnVJVjZ6NGZnV1Brd3dcdTAwM2RzOTYtYyIsImF1ZCI6ImlkZW9ncmFtLXByb2QiLCJhdXRoX3RpbWUiOjE3MjU5ODgzMTIsInVzZXJfaWQiOiJreTY2bjg3QnF4VGl4ZFNiREp3RmIyYkFuaUIzIiwic3ViIjoia3k2Nm44N0JxeFRpeGRTYkRKd0ZiMmJBbmlCMyIsImlhdCI6MTcyNjA2MjUzMywiZXhwIjoxNzI3MjcyMTMzLCJlbWFpbCI6InRlY2h3aXphcmQucm1zdHVkaW9zQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7Imdvb2dsZS5jb20iOlsiMTA1MTY2NDA0OTE1MjQ1Njk5NTg1Il0sImVtYWlsIjpbInRlY2h3aXphcmQucm1zdHVkaW9zQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6Imdvb2dsZS5jb20ifX0.RQeZzFDpv4fftZZpRWepESC_3qKw0Wb1WrTHmwwSxT8LMdz00EMgHS58FXfcwlPYWjEYaKu9JYb_Aj_rOjqE4DL3-4jntyHO1YqVMLQaWmwxvpnMCQx7QAbZ82evT4nLaoue35VS0YyDy2icsPSC4rG3X2FKhnxEYFlxZnz3S9bP8uXFbXm4IoFYDeH6QA90FlXPnygraJRNRPE7BIefpE27nk1BblVC1-louGJ1Mu6RgX-h6ar7tY-c4mEP3RWyh4W9aQsuOPL5GHZgB688qUwHAX5zGgtIvlkdHgfJUfXOq4fEwZv3U0pEHn2dvGWgxxtQsrOUzacJSfA__DGbMg",
  },
  {
    name: "AMP_da0464495c",
    value: "JTdCJTIyZGV2aWNlSWQlMjIlM0ElMjJmYmJiYTdhMi0zMDFhLTRjZjctYTA5OC02NGQwYmM1Y2JiZTAlMjIlMkMlMjJ1c2VySWQlMjIlM0ElMjJRLXNtRXludVJKS1J2a3hQQmZVazRBJTIyJTJDJTIyc2Vzc2lvbklkJTIyJTNBMTcyNjA2MjUzMzI5MyUyQyUyMm9wdE91dCUyMiUzQWZhbHNlJTJDJTIybGFzdEV2ZW50VGltZSUyMiUzQTE3MjYwNjI1Mzc2MDclMkMlMjJsYXN0RXZlbnRJZCUyMiUzQTMyNCUyQyUyMnBhZ2VDb3VudGVyJTIyJTNBMSU3RA==",
  },
  { name: "_ga_44J8R31CP6", value: "GS1.1.1726062534.8.1.1726062757.0.0.0" },
];

module.exports = {
  con,
  storePath,
  chromePath,
  url,
  assetsUrl,
  cookies,
};
