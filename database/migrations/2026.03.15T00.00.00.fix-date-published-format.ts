import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const hasColumn = await knex.schema.hasColumn("articles", "date_published");
  if (!hasColumn) return;

  // Convert DD/MM/YYYY strings to YYYY-MM-DD so PostgreSQL can cast to date
  await knex.raw(`
    UPDATE articles
    SET date_published = to_char(
      to_date(date_published, 'DD/MM/YYYY'),
      'YYYY-MM-DD'
    )
    WHERE date_published ~ '^\\d{2}/\\d{2}/\\d{4}$'
  `);
}

export async function down(): Promise<void> {
  // no rollback needed
}
