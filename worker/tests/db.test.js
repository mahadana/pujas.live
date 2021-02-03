import db from "@/db";

describe("knex", () => {
  let knex;
  beforeAll(() => {
    knex = db.init();
  });
  afterAll(() => {
    knex.destroy();
  });

  test("basics", async () => {
    const result = await knex
      .select("tablename")
      .from("pg_catalog.pg_tables")
      .where({ schemaname: "public" });
    expect(result.length).toEqual(expect.any(Number));
  });
});
