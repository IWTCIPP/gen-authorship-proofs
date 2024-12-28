import { appendFile } from "fs/promises";

await logImageData("34210", "41752896", "https://files.catbox.moe/qvyvg0.jpg", "/temp/W45J61GC2HEESQM1ED2FVS9MM0.jpg");
await log("\n\n");
await logImageData("33772", "41740131", "https://files.catbox.moe/944off.png", "/temp/s-3245799236.png");
await log("\n\n");
await logImageData("33398", "41727855", "https://files.catbox.moe/te4ecs.png", "/temp/s-1291976568.png");
await log("\n\n");
await logImageData("33467", "41728282", "https://files.catbox.moe/r1ag4p.png", "/temp/s-3296801398.png");
await log("\n\n");
await logImageData("33533", "41728288", "https://files.catbox.moe/24qp5m.png", "/temp/s-3572514163.png");

async function logImageData(tantabusImageId, desuarchivePostNum, catboxUrl, dropboxPath) {
  await logTantabusData(tantabusImageId);
  await log("");
  await logDesuarchiveData(desuarchivePostNum, catboxUrl);
  await log("");
  await logCatboxData(catboxUrl);
  await log("");
  await logDropboxData(dropboxPath);
}

async function logTantabusData(imageId) {
  const response = await fetch(`https://tantabus.ai/api/v1/json/images/${imageId}`);

  if (!response.ok) throw new Error();

  const body = await response.json();

  await log(`https://tantabus.ai/${body.image.id}`);
  await log(`created_at: ${body.image.created_at}`);
  await log(`orig_sha512_hash: ${body.image.orig_sha512_hash}`);
}

async function logDesuarchiveData(postNum, catboxUrl) {
  const response = await fetch(`https://desuarchive.org/_/api/chan/post?board=mlp&num=${postNum}`);

  if (!response.ok) throw new Error();

  const body = await response.json();

  await log(`https://desuarchive.org/mlp/thread/${body.thread_num}/#${body.num}`);
  await log(`timestamp: ${body.timestamp} (${new Date(body.timestamp * 1000).toUTCString()})`);
  if (body.comment.includes(catboxUrl)) await log(`Contains "${catboxUrl}"`);
}

async function logCatboxData(url) {
  const response = await fetch(url);

  if (!response.ok) throw new Error();

  const body = await response.arrayBuffer();

  await log(url);
  await log(`last-modified: ${response.headers.get("last-modified")}`);
  await log(`SHA-512 hash: ${await sha512Hash(body)}`);
  await log(`Dropbox content hash: ${await dropboxContentHash(body)}`);
}

async function sha512Hash(data) {
  return toHexString(await crypto.subtle.digest("SHA-512", data));
}

async function dropboxContentHash(data) {
  if (data.length > 4 * 1024 * 1024) throw new Error();

  return toHexString(await crypto.subtle.digest("SHA-256", await crypto.subtle.digest("SHA-256", data)));
}

function toHexString(arrayBuffer) {
  return [...new Uint8Array(arrayBuffer)].map(x => x.toString(16).padStart(2, "0")).join("");
}

async function logDropboxData(path) {
  const limit = 100;

  const response = await fetch(
    "https://api.dropboxapi.com/2/files/list_revisions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.DROPBOX_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ limit, mode: "id", path })
    }
  );

  if (!response.ok) throw new Error();

  const body = await response.json();

  if (body.entries.length >= limit) throw new Error();

  const entry = body.entries.toSorted((a, b) => a.server_modified.localeCompare(b.server_modified))[0];

  await log(`Earliest available revision of Dropbox${path}`);
  await log(`server_modified: ${entry.server_modified}`);
  await log(`content_hash: ${entry.content_hash}`);
}

async function log(line) {
  await appendFile("output.txt", `${line}\n`);
}
