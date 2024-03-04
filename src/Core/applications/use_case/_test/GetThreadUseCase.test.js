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
    await getThreadUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(
      payload.id
    );
  });
});
