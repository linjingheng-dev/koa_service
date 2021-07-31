const { exec } = require('child_process');
const path = require("path");
const gitPath = path.resolve(__dirname, './');
const eslintPath = path.resolve(__dirname, 'node_modules/eslint/bin/eslint');
// exec("git diff --cached --name-only", { cwd: gitPath }, (err, stdout, stderr) => {
//     if (err) {
//         console.log('执行git diff失败', err);
//         process.exit(1);
//         return;
//     }
//     if (stderr) {
//         console.log('git diff失败', stderr);
//     }
//     const eslintPro = new Promise((resolve, reject) => {
//         const esfile = stdout.split("\n").filter(v => {
//             return /.js$/.test(v);
//         }).map(v => {
//             return path.resolve(gitPath, v);
//         }).join(" ");
//         if (!esfile) {
//             resolve();
//             return;
//         }
//         exec(`node ${eslintPath}  ${esfile} --no-ignore`, (err, esstdout, stderr) => {
//             if (err) {
//                 console.log('执行eslint 出现问题', err);
//             }
//             if (stderr) {
//                 console.log('执行eslint 出现问题', stderr);
//                 reject();
//             }
//             resolve(esstdout);


//         })
//     });
//     Promise.all([eslintPro]).then((res) => {
//         if (res[0]) {
//             if (res[0]) {
//                 console.log('代码有以下不规范:\n', res[0]);
//             }
//             process.exit(1);
//         }
//     }).catch((err) => {
//         console.log('===============get error=====================================', err);
//         process.exit(1);
//     })
// })