const routes = (handler) => [
    {
        method: 'POST',
        path: '/threads',
        handler: (request, h) => handler.postThreadHandler(request, h),
        options: {
            auth: 'api_forum_jwt',
        },
    },
    {
        method: 'GET',
        path: '/threads/{id}',
        handler: (request) => handler.getThreadHandler(request),
    },
];

module.exports = routes;