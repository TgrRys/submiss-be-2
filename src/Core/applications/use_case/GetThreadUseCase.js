class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);

    if (!thread) {
      throw new Error('GET_THREAD_USE_CASE.THREAD_NOT_FOUND');
    }

    let comments = await this._commentRepository.getCommentsByThreadId(threadId);
    
    comments = comments.map(comment => {
      if (comment.isDeleted) {
        return {
          ...comment,
          content: 'komentar telah dihapus',
        };
      }
      return comment;
    });

    thread.setComments(comments);

    return thread;
  }
}

module.exports = GetThreadUseCase;