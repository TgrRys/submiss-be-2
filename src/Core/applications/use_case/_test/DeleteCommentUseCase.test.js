const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const ThreadRepository = require('../../../domains/threads/ThreadRepository');
const CommentRepository = require('../../../domains/comments/CommentRepository');

describe('DeleteCommentUseCase', () => {
  it('should throw error if use case payload not contain correct property', async () => {
    const useCasePayload = {};
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    await expect(deleteCommentUseCase.execute(useCasePayload)).rejects.toThrowError('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if thread is not found', async () => {
    const useCasePayload = {
      id: 'test-comment-123',
      threadId: 'test-thread-01',
      owner: 'test-user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.isThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve(''));
    mockCommentRepository.isCommentExist = jest.fn()
      .mockImplementation(() => Promise.resolve('comment-123'));
    mockCommentRepository.isCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve('user-123'));

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects.toThrowError('DELETE_COMMENT_USE_CASE.THREAD_NOT_FOUND');
  });

  it('should throw error if comment is not found', async () => {
    const useCasePayload = {
      id: 'test-comment-123',
      threadId: 'test-thread-01',
      owner: 'test-user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.isThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve('test-thread-01'));
    mockCommentRepository.isCommentExist = jest.fn()
      .mockImplementation(() => Promise.resolve(''));
    mockCommentRepository.isCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve('test-user-123'));

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects.toThrowError('DELETE_COMMENT_USE_CASE.COMMENT_NOT_FOUND');
  });

  it('should throw error if comment is not owned', async () => {
    const useCasePayload = {
      id: 'test-comment-123',
      threadId: 'test-thread-01',
      owner: 'test-user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.isThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve('test-thread-01'));
    mockCommentRepository.isCommentExist = jest.fn()
      .mockImplementation(() => Promise.resolve('test-comment-123'));
    mockCommentRepository.isCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve(''));

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects.toThrowError('DELETE_COMMENT_USE_CASE.COMMENT_NOT_OWNED');
  });

  it('should orchestrating delete comment properly', async () => {
    const useCasePayload = {
      id: 'test-comment-123',
      threadId: 'test-thread-01',
      owner: 'test-user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    mockThreadRepository.isThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve('test-thread-01'));
    mockCommentRepository.isCommentExist = jest.fn()
      .mockImplementation(() => Promise.resolve('test-comment-123'));
    mockCommentRepository.isCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve('test-user-123'));
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await deleteCommentUseCase.execute(useCasePayload);
    expect(mockThreadRepository.isThreadExist)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.isCommentExist)
      .toHaveBeenCalledWith(useCasePayload.id);
    expect(mockCommentRepository.isCommentOwner)
      .toHaveBeenCalledWith(useCasePayload.id, useCasePayload.owner);
    expect(mockCommentRepository.deleteComment)
      .toHaveBeenCalledWith(useCasePayload.id);
  });
});
