export default {
  beforeCreate(event) {
    if (!event.params.data.datePublished) {
      event.params.data.datePublished = new Date().toISOString().split('T')[0];
    }
  },
};
