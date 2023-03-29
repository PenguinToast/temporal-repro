import { Worker } from "@temporalio/worker";
import { ParentWorkflow } from "./workflows";
import { Client } from "@temporalio/client";

async function main() {
  const worker = await Worker.create({
    workflowsPath: require.resolve("./workflows"),
    activities: {},
    taskQueue: "workflows",
  });
  const workerPromise = worker.run().catch((err) => {
    console.error(err);
    process.exit(1);
  });
  const client = new Client();
  const parentHandle = await client.workflow.start(ParentWorkflow, {
    taskQueue: "workflows",
    workflowId: "parent-workflow",
    args: [],
  });
  // Wait for child to start
  await new Promise((resolve) => setTimeout(resolve, 500));
  await parentHandle.cancel();
  await new Promise((resolve) => setTimeout(resolve, 500));
  const childHandle = client.workflow.getHandle("child-workflow");
  await childHandle.cancel();
  await workerPromise;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
