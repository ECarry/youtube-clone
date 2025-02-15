// Using the workflow client
import { Client } from "@upstash/workflow";

export const workflow = new Client({ token: process.env.QSTASH_TOKEN });
