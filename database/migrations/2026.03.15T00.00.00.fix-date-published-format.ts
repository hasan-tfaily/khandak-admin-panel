import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const hasColumn = await knex.schema.hasColumn("articles", "date_published");
  if (!hasColumn) return;

  await knex.schema.alterTable("articles", (table) => {
    table.dropColumn("date_published");
  });
}

export async function down(): Promise<void> {
  // no rollback needed
}
