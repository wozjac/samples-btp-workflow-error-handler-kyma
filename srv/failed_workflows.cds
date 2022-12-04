using {wf} from '../db/schema';

service FailedWorkflowsService {
  @readonly entity WorkflowInstances as projection on wf.WorkflowInstances;
  action handleErroneousWorkflows() returns Integer
}