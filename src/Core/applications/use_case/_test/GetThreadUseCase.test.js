const CommentRepository = require("../../../domains/comments/CommentRepository");
const ThreadRepository = require("../../../domains/threads/ThreadRepository");
const Thread = require("../../../domains/threads/entities/Thread");
const Comment = require("../../../domains/comments/entities/Comment");
const GetThreadUseCase = require("../GetThreadUseCase");

describe("GetThreadUseCase", () => {
  it("should throw error if thread is not found", async () => {
    // Arrange
    const threadId = "thread-123";

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(""));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action and Assert
    await expect(getThreadUseCase.execute(threadId)).rejects.toThrowError(
      "GET_THREAD_USE_CASE.THREAD_NOT_FOUND"
    );
  });

  it("should orchestrating get thread properly", async () => {
    // Arrange
    const threadId = "thread-123";
    const payload = {
      id: threadId,
      title: "this is thread title",
      body: "this is thread body",
      date: "somedate",
      username: "superuser",
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
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
    const thread = await getThreadUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(
      payload.id
    );
    expect(thread.id).toEqual(payload.id);
    expect(thread.title).toEqual(payload.title);
    expect(thread.body).toEqual(payload.body);
    expect(thread.date).toEqual(payload.date);
    expect(thread.username).toEqual(payload.username);
    expect(Array.isArray(thread.comments)).toBeTruthy();
    expect(thread.comments.length).toEqual(0);
  });

  it("should orchestrating get thread properly with comments", async () => {
    // Arrange
    const threadId = "thread-123";
    const payload = {
      id: threadId,
      title: "this is thread title",
      body: "this is thread body",
      date: "somedate",
      username: "superuser",
    };
  
    const comments = [
      new Comment({
        id: "comment-123",
        content: "this is a comment",
        username: "user-123", 
        date: "somedate",
        isDelete: false, 
      }),
    ];
  
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
  
    /** mocking needed function */
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(new Thread(payload)));
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(comments));
  
    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
  
    // Action
    const thread = await getThreadUseCase.execute(threadId);
  
    // Assert
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(
      payload.id
    );
    expect(thread.id).toEqual(payload.id);
    expect(thread.title).toEqual(payload.title);
    expect(thread.body).toEqual(payload.body);
    expect(thread.date).toEqual(payload.date);
    expect(thread.username).toEqual(payload.username);
    expect(Array.isArray(thread.comments)).toBeTruthy();
    expect(thread.comments.length).toEqual(1);
    expect(thread.comments[0].id).toEqual(comments[0].id);
    expect(thread.comments[0].content).toEqual(comments[0].content);
    expect(thread.comments[0].username).toEqual(comments[0].username);
    expect(thread.comments[0].date).toEqual(comments[0].date);
  });
});
