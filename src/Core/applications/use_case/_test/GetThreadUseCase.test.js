const Comment = require("../../../domains/comments/entities/Comment"); // Add this line
const CommentRepository = require("../../../domains/comments/CommentRepository");
const ThreadRepository = require("../../../domains/threads/ThreadRepository");
const Thread = require("../../../domains/threads/entities/Thread");
const GetThreadUseCase = require("../GetThreadUseCase");

describe("GetThreadUseCase", () => {
  it("should throw error if thread is not found", async () => {
    const threadId = "thread-123";
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(""));
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await expect(getThreadUseCase.execute(threadId)).rejects.toThrowError(
      "GET_THREAD_USE_CASE.THREAD_NOT_FOUND"
    );
  });

  it("should orchestrating get thread properly", async () => {
    const threadId = "thread-123";
    const payload = {
      id: threadId,
      title: "this is thread title",
      body: "this is thread body",
      date: "somedate",
      username: "superuser",
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(new Thread(payload)));
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve([]));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const result = await getThreadUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(
      payload.id
    );
    expect(result).toEqual({
      id: payload.id,
      title: payload.title,
      body: payload.body,
      date: payload.date,
      username: payload.username,
      comments: [],
    });
  });

  it("should handle deleted comments", async () => {
    const threadId = "thread-123";
    const payload = {
      id: threadId,
      title: "this is thread title",
      body: "this is thread body",
      date: "somedate",
      username: "superuser",
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(new Thread(payload)));
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve([
          new Comment({
            id: "comment-123",
            content: "This is a comment",
            isDelete: true, // Change this
            username: "user1",
            date: "somedate",
          }),
          new Comment({
            id: "comment-456",
            content: "This is another comment",
            isDelete: false, // And this
            username: "user2",
            date: "somedate",
          }),
        ])
      );

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const result = await getThreadUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(
      payload.id
    );
    expect(result).toEqual({
      id: payload.id,
      title: payload.title,
      body: payload.body,
      date: payload.date,
      username: payload.username,
      comments: [
        {
          id: "comment-123",
          content: "**deleted comment**", 
          username: "user1",
          date: "somedate",
        },
        {
          id: "comment-456",
          content: "This is another comment",
          username: "user2",
          date: "somedate",
        },
      ],
    });
  });
});
