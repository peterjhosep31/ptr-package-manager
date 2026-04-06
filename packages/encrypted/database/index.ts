import Directory from "../../directory";
import { createConnection } from "../../sqlite";

const PATH = (new Directory()).directoryPath(__filename)

const CONNECTION = createConnection()
