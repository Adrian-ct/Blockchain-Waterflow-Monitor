import { create } from "ipfs-http-client";
import OrbitDB from "orbit-db";
import { log } from "console";
import { GlobalRef } from "./GlobalRef";

async function createOrbitDB() {
  try {
    const ipfs = create({ url: "/ip4/127.0.0.1/tcp/5001" });
    const orbitdb = await OrbitDB.createInstance(ipfs);
    const dbLog = await orbitdb.eventlog("hello");
    return dbLog;
  } catch (err: any) {
    log(err);
    throw new Error(err);
  }
}

export default async function getDb(): Promise<OrbitDB> {
  const databaseConn = new GlobalRef("orbitDB");

  if (!databaseConn.value) {
    try {
      databaseConn.value = await createOrbitDB();
      log("Database loaded");
    } catch (err) {
      log(err);
    }
  }
  return databaseConn.value;
}
