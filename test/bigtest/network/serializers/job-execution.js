import { RestSerializer } from '@bigtest/mirage';

export default RestSerializer.extend({
  serialize(...args) {
    const { jobExecutions } = RestSerializer.prototype.serialize.apply(this, args);

    return {
      jobExecutionDtos: jobExecutions,
      totalRecords: jobExecutions.length,
    };
  },
});
