const DeleteComment = require('../DeleteComment');

describe('DeleteComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    
    const payload = {
      id: 'comment-123',
    };

    expect(() => new DeleteComment(payload))
      .toThrowError('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    
    const payload = {
      id: 123,
      owner: 'user-123',
      threadId: 1234567890,
    };

    expect(() => new DeleteComment(payload))
      .toThrowError('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DeleteComment object correctly', () => {
    
    const payload = {
      id: 'comment-123',
      owner: 'user-123',
      threadId: 'thread-123',
    };

    const {
      id, owner, threadId,
    } = new DeleteComment(payload);

    expect(id).toEqual(payload.id);
    expect(owner).toEqual(payload.owner);
    expect(threadId).toEqual(payload.threadId);
  });
});