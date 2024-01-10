const resolvers = {
  Query: {
    user: async (_, { id }) => await User.findById(id),
    collections: async (_, { owner }) => await Collection.find({ owner }),
    content: async (_, { id }) => await Content.findById(id),
    allContent: async (_, { type, tags }) => await Content.find({ type, tags: { $in: tags } }),
  },
  Mutation: {
    createCollection: async (_, { name }) => await new Collection({ name }).save(),
    addContentToCollection: async (_, { collectionId, contentId }) => {
      const collection = await Collection.findById(collectionId);
      collection.content.push(contentId);
      return collection.save();
    },
    updateContent: async (_, { id, data }) => await Content.findByIdAndUpdate(id, data),
    addComment: async (_, { contentId, content }) => {
      const newComment = new Comment({ content });
      const updatedContent = await Content.findByIdAndUpdate(contentId, { $push: { comments: newComment } });
      return updatedContent;
    },
  },
  Subscription: {
    contentUpdates: {
      subscribe: async (_, { id }) => {
        return pubsub.asyncIterator("CONTENT_UPDATED_" + id);
      },
    },
  },
};
