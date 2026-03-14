import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const hasColumn = await knex.schema.hasColumn("articles", "published_date");
  if (!hasColumn) return;

  await knex.raw(`
    UPDATE articles
    SET published_date = published_at::date
    WHERE published_date IS NULL AND published_at IS NOT NULL
  `);
}

export async function down(): Promise<void> {
  // no rollback needed
}
