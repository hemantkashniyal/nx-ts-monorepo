import { glob } from 'glob';
import * as fs from 'fs';
import * as path from 'path';

const getLcovFiles =  (src: string): Promise<string[]> =>{
  return new Promise((resolve, reject) => {
    glob.glob(`${src}/**/lcov.info`, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  })
};

(async function(){
  const files = await getLcovFiles('coverage');
  const mergedReport = files.reduce((mergedReport, currFile) => mergedReport += fs.readFileSync(currFile), '');
  await fs.writeFile(path.resolve('./coverage/lcov.info'), mergedReport, (err) => {
    if (err) throw err;
    console.log('Merged file has been saved!');
  });
})();
