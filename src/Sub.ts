// Example logic triggered when content is updated
const updateContent = async (content) => {
  await content.save();
  pubsub.publish("CONTENT_UPDATED_" + content.id, content);
};
