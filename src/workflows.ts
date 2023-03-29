import {
  startChild,
  sleep,
  ChildWorkflowCancellationType,
  ParentClosePolicy,
  CancellationScope,
} from "@temporalio/workflow";

export async function ParentWorkflow() {
  await startChild(ChildWorkflow, {
    args: [],
    workflowId: "child-workflow",
    parentClosePolicy: ParentClosePolicy.PARENT_CLOSE_POLICY_ABANDON,
    cancellationType: ChildWorkflowCancellationType.ABANDON,
  });
  // Wait for cancellation
  let cancellationError: Error | undefined = undefined;
  try {
    await sleep("1 minute");
  } catch (e) {
    cancellationError = e as Error;
  }
  await CancellationScope.nonCancellable(async () => {
    // Wait for child workflow to get cancelled
    // This would normally where we call some cleanup activity
    await sleep("20 second");
  });
  if (cancellationError) {
    throw cancellationError;
  }
}

export async function ChildWorkflow() {
  // Sleep until canceled
  await sleep("1 minute");
}
