const NewComment = require('../../../domains/comments/entities/NewComment');
const AddedComment = require('../../../domains/comments/entities/AddedComment');
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
    expect(mockThreadRepository.isThreadExist)
      .toHaveBeenCalledWith(useCasePayload.threadId);
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
      .mockImplementation(() => Promise.resolve(new AddedComment({
        id: 'comment-123',
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      })));
  
    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
  
    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload);
  
    // Assert
    expect(mockThreadRepository.isThreadExist)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.addComment)
      .toHaveBeenCalledWith(expect.any(NewComment));
    expect(addedComment).toBeInstanceOf(AddedComment);
    expect(addedComment.id).toEqual('comment-123');
    expect(addedComment.content).toEqual(useCasePayload.content);
    expect(addedComment.owner).toEqual(useCasePayload.owner);
  });
});