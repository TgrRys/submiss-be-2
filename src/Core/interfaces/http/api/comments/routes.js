const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads/{id}/comments',
    handler: (request, h) => handler.postCommentHandler(request, h),
    options: {
      auth: 'api_forum_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: (request, h) => handler.deleteCommentHandler(request, h),
    options: {
      auth: 'api_forum_jwt',
    },
  },
];

module.exports = routes;