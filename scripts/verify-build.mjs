import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? filesIn(file) : [file];
  }));
  return nested.flat();
}

const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const sourceHashes = new Set(await Promise.all((await filesIn('assets/cvs')).map(async (file) => hash(await readFile(file)))));
const outputFiles = await filesIn('dist');
for (const file of outputFiles) {
  if (sourceHashes.has(hash(await readFile(file))) || /(?:^|[\\/])cvs(?:[\\/]|$)/i.test(file)) {
    throw new Error(`Private CV found in build: ${file}`);
  }
}
const certificateHashes = new Set(await Promise.all((await filesIn('assets/certificados')).filter((file) => file.endsWith('.pdf')).map(async (file) => hash(await readFile(file)))));
const pdfFiles = outputFiles.filter((file) => file.endsWith('.pdf'));
for (const file of pdfFiles) {
  if (!certificateHashes.has(hash(await readFile(file)))) throw new Error(`Unexpected public PDF: ${file}`);
}
const pdfCount = pdfFiles.length;
if (pdfCount !== certificateHashes.size) throw new Error(`Expected ${certificateHashes.size} certificate PDFs; found ${pdfCount}`);
console.log(`Build verified: ${pdfCount} certificates, no original CVs.`);
