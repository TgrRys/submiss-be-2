const ThreadRepository = require('../../Core/domains/threads/ThreadRepository');
const AddedThread = require('../../Core/domains/threads/entities/AddedThread');
const Thread = require('../../Core/domains/threads/entities/Thread');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const { title, body, owner } = newThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, owner, new Date().toISOString()],
    };

    const result = await this._pool.query(query);
    return new AddedThread({ ...result.rows[0] });
  }

  async isThreadExist(threadId) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rowCount > 0;
  }

  async getThreadById(threadId) {
    const query = {
      text: `SELECT 
                threads.id,
                threads.title,
                threads.body,
                threads.date,
                users.username 
             FROM threads 
             INNER JOIN users ON threads.owner = users.id 
             WHERE threads.id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return null;
    }

    return new Thread({
      ...result.rows[0],
    });
  }
}

module.exports = ThreadRepositoryPostgres;