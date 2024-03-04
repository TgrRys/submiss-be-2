const Comment = require('../Comment');

describe('Comment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'comment-123',
    };
    expect(() => new Comment(payload))
      .toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      username: 'user-123',
      date: 1234567890,
      content: true,
      isDelete: {},
    };
    expect(() => new Comment(payload))
      .toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Comment object correctly', () => {
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      date: 'somedate',
      content: 'this is a comment',
      isDelete: false,
    };
    
    const {
      id, username, date, content,
    } = new Comment(payload);
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
  });

  it('should correctly set content when isDelete is true', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      date: 'somedate',
      content: 'this is a comment',
      isDelete: true,
    };
  
    // Action
    const { content } = new Comment(payload);
  
    // Assert
    expect(content).toEqual('**deleted comment**');
  });
  
  it('should correctly set content when isDelete is false', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      date: 'somedate',
      content: 'this is a comment',
      isDelete: false,
    };
  
    // Action
    const { content } = new Comment(payload);
  
    // Assert
    expect(content).toEqual(payload.content);
  });
});