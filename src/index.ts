import type { Core } from "@strapi/strapi";

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const knex = strapi.db.connection;

    await knex.raw(`
      UPDATE articles
      SET published_date = published_at::date
      WHERE published_date IS NULL AND published_at IS NOT NULL
    `);
  },
};
