import { create } from "ipfs-http-client";
import OrbitDB from "orbit-db";
import { log } from "console";
import { GlobalRef } from "./GlobalRef";

async function createOrbitDB() {
  let dbLog;
  try {
    const ipfs = create({ url: "/ip4/127.0.0.1/tcp/5001" });
    const orbitdb = await OrbitDB.createInstance(ipfs, {
      directory: "./orbitdb/examples/eventlog",
    });
    dbLog = await orbitdb.eventlog("waterflow");
    await dbLog.load();
    log(dbLog.address.toString() + " was created");
    dbLog.events.on("write", (address: any, entry: any, heads: any) => {
      console.log(`Databse updated`);
    });
    return dbLog;
  } catch (err: any) {
    log("Error creating database");
    log(err);
    throw err;
  }
}

export default async function getDb(): Promise<OrbitDB> {
  const databaseConn = new GlobalRef("orbitDB");

  if (!databaseConn.value) {
    try {
      databaseConn.value = await createOrbitDB();
      log("Database loaded");
    } catch (err) {
      throw err;
    }
  }
  return databaseConn.value;
}
