const CommentRepository = require('../../../domains/comments/CommentRepository');
const ThreadRepository = require('../../../domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should throw error if thread is not found', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-test-123',
      owner: 'test-user-123',
      content: 'comment',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.isThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve(''));

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action and Assert
    await expect(addCommentUseCase.execute(useCasePayload))
      .rejects.toThrowError('ADD_COMMENT_USE_CASE.THREAD_NOT_FOUND');
  });

  it('should orchestrating add comment properly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-test-123',
      owner: 'test-user-123',
      content: 'comment',
    };
  
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
  
    /** mocking needed function */
    mockThreadRepository.isThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve('thread-123'));
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
  
    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
  
    // Action
    await addCommentUseCase.execute(useCasePayload);
  
    // Assert
    expect(mockThreadRepository.isThreadExist)
      .toHaveBeenCalledTimes(1);
    expect(mockThreadRepository.isThreadExist)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.addComment)
      .toHaveBeenCalledTimes(1);
    expect(mockCommentRepository.addComment)
      .toHaveBeenCalledWith(useCasePayload);
  
    expect(mockThreadRepository.isThreadExist.mock.invocationCallOrder[0])
      .toBeLessThan(mockCommentRepository.addComment.mock.invocationCallOrder[0]);
  });

});
