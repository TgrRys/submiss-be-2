/* istanbul ignore file */
const pool = require('../src/Infrastructure/database/postgres/pool');

const ThreadsTableTestHelper = {
  async findThreadById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },

  async addThread({
    id = 'thread-123', title = 'title', body = 'body', owner = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5)',
      values: [id, title, body, owner, new Date().toISOString()],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE TRUE');
  },
};

module.exports = ThreadsTableTestHelper;