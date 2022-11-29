import fs from 'fs';

export function getJsonData() {
   const now = new Date();
   let jsonData = {};

   fs.readdirSync('src/html/_data/').forEach(jsonFile => {
      const thisData = JSON.parse(fs.readFileSync(`src/html/_data/${ jsonFile }`));
      jsonData = Object.assign({}, jsonData, thisData);
   });

   jsonData.year = now.getFullYear();

   return jsonData;
}

export default getJsonData;
