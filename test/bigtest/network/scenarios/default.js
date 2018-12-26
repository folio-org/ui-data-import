/* istanbul ignore file */

// default scenario is used during `yarn start --mirage`
export default function defaultScenario(server) {
  server.createList('jobExecution', 20);
  server.get('/metadata-provider/jobExecutions', (schema) => schema.jobExecutions.all());
}
