export default {
  beforeCreate(event) {
    if (!event.params.data.publishedDate) {
      event.params.data.publishedDate = new Date().toISOString().split("T")[0];
    }
  },
  beforeUpdate(event) {
    if (!event.params.data.publishedDate && event.params.data.publishedAt) {
      event.params.data.publishedDate = new Date(event.params.data.publishedAt)
        .toISOString()
        .split("T")[0];
    }
  },
};
