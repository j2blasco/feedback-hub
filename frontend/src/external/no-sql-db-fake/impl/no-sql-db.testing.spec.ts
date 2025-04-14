import { describeTest } from "../../../utils/tests/describe-test.spec";
import { testNoSqlDb } from "../core/spec/no-sql-db.spec";
import { createNoSqlDatabaseTesting } from "./no-sql-db.testing";

describeTest('unit', 'NoSqlDatabase Testing', () => {
  testNoSqlDb(async () => createNoSqlDatabaseTesting());
});