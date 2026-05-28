const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'src', 'locales', 'en', 'translation.json');
const amPath = path.join(__dirname, 'src', 'locales', 'am', 'translation.json');

try {
  const enKeys = JSON.parse(process.argv[2] || '{}');
  const amKeys = JSON.parse(process.argv[3] || '{}');

  const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  const am = JSON.parse(fs.readFileSync(amPath, 'utf8'));

  Object.assign(en, enKeys);
  Object.assign(am, amKeys);

  fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
  fs.writeFileSync(amPath, JSON.stringify(am, null, 2));
  console.log('Translations updated successfully.');
} catch (e) {
  console.error('Error updating translations:', e.message);
  process.exit(1);
}
