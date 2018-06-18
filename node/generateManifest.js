const fsExtra = require("fs-extra");

const version = process.env.npm_package_version;

const content = `{
  "name": "CrashDive",
  "short_name": "CrashDive",
  "start_url": "./",
  "display": "standalone",
  "version": "${version}"
}
`;

fsExtra.writeFile("./src/site.webmanifest", content, "utf-8", err => {
  Error(err);
});

fsExtra.writeFile("./dist/site.webmanifest", content, "utf-8", err => {
  Error(err);
});
