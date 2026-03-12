/**
 * Generate avatar-catalog.json from AD-Skins-New metadata.
 * Also copies all 3,000 Hytopia skin PNGs into public/skins/avatars/.
 *
 * Usage: node scripts/generate-avatar-catalog.cjs
 */
const fs = require('fs');
const path = require('path');

const METADATA_PATH = path.resolve(__dirname, '../../AD-Skins-New/Metadata/_metadata.json');
const SKINS_SRC = path.resolve(__dirname, '../../AD-Skins-New/Hytopia-Skins');
const SKINS_DEST = path.resolve(__dirname, '../public/skins/avatars');
const CATALOG_OUT = path.resolve(__dirname, '../public/avatar-catalog.json');

/** Map sport folder names from metadata to our sport tags */
const SPORT_MAP = {
  'soccer': 'soccer',
  'basketball': 'basketball',
  'american-football': 'football',
  'golf': 'golf',
  'tennis': 'tennis',
  'rugby': 'rugby',
  'baseball': 'baseball',
  'ufc': 'other',
  'wwe': 'other',
};

function extractSport(attributes) {
  for (const attr of attributes) {
    // Match both male and female sport paths
    const match = attr.trait_type.match(/sports-(?:male|female)\/(?:male|female)-([\w-]+)\//);
    if (match) {
      return SPORT_MAP[match[1]] || 'other';
    }
  }
  return 'other';
}

function main() {
  console.log('Reading metadata...');
  const raw = fs.readFileSync(METADATA_PATH, 'utf8');
  const metadata = JSON.parse(raw);
  console.log(`Found ${metadata.length} entries`);

  // Build catalog
  const catalog = metadata.map((entry) => ({
    id: entry.edition,
    sport: extractSport(entry.attributes),
    name: `Avatar #${entry.edition}`,
  }));

  // Sort by id
  catalog.sort((a, b) => a.id - b.id);

  // Write catalog JSON
  fs.writeFileSync(CATALOG_OUT, JSON.stringify(catalog), 'utf8');
  const sizeKB = (Buffer.byteLength(JSON.stringify(catalog)) / 1024).toFixed(1);
  console.log(`Wrote ${CATALOG_OUT} (${sizeKB} KB, ${catalog.length} entries)`);

  // Print sport distribution
  const sportCounts = {};
  catalog.forEach((c) => { sportCounts[c.sport] = (sportCounts[c.sport] || 0) + 1; });
  console.log('Sport distribution:', sportCounts);

  // Copy PNGs
  console.log(`\nCopying PNGs from ${SKINS_SRC} to ${SKINS_DEST}...`);
  fs.mkdirSync(SKINS_DEST, { recursive: true });

  const srcFiles = fs.readdirSync(SKINS_SRC).filter((f) => f.endsWith('.png'));
  let copied = 0;
  let skipped = 0;

  for (const file of srcFiles) {
    const dest = path.join(SKINS_DEST, file);
    if (fs.existsSync(dest)) {
      // Check if same size to skip identical files
      const srcStat = fs.statSync(path.join(SKINS_SRC, file));
      const destStat = fs.statSync(dest);
      if (srcStat.size === destStat.size) {
        skipped++;
        continue;
      }
    }
    fs.copyFileSync(path.join(SKINS_SRC, file), dest);
    copied++;
  }

  console.log(`Copied ${copied} PNGs, skipped ${skipped} (already up to date)`);
  console.log('Done!');
}

main();
