const ThreadRepository = require('../../../domains/threads/ThreadRepository');
const AddedThread = require('../../../domains/threads/entities/AddedThread');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const mockThreadRepository = new ThreadRepository();
    const mockReturnAddThread = new AddedThread({
      id: 'thread-123',
      title: 'this a thread title',
      owner: 'test-user-123',
    });

    mockThreadRepository.addThread = jest.fn(() => Promise.resolve(mockReturnAddThread));

    const useCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const useCasePayload = {
      title: 'this a thread title',
      body: 'this is a thread body',
      owner: 'test-user-123',
    };

    const expectedAddedThread = new AddedThread({
      id: 'thread-123',
      title: 'this a thread title',
      owner: 'test-user-123',
    });

    // Action
    const addedThread = await useCase.execute(useCasePayload);

    // Assert
    expect(addedThread).toEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(useCasePayload);
  });
});