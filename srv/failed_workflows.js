class FailedWorkflowsService extends cds.ApplicationService {
  async init() {
    this.on("READ", `WorkflowInstances`, async (req) => {
      const workflowSrv = await cds.connect.to(
        "Workflow.API.for.Cloud.Foundry"
      );

      const instances = await workflowSrv.v1_workflow_instances({
        status: "ERRONEOUS",
      });

      // enrich with error messages
      for (const i of instances) {
        i.errors = await workflowSrv.v1_workflow_instances__error_messages({
          workflowInstanceId: i.id,
        });
      }

      return instances;
    });

    await super.init();
  }

  async handleErroneousWorkflows() {
    const srv = await cds.connect.to("FailedWorkflowsService");
    const instances = await srv.run(SELECT.from("WorkflowInstances"));
    console.log("Checking if there are erroneous workflows to handle...");

    if (instances && instances.length > 0) {
      console.log(`Handling ${instances.length} erroneous workflows`);

      for (const i of instances) {
        // check the failed workflow whether something useful can be done
        // ...
      }
    }

    return instances ? instances.length : 0;
  }
}

module.exports = FailedWorkflowsService;
