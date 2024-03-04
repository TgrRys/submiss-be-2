const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const pool = require("../../database/postgres/pool");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");

describe("ThreadRepositoryPostgres", () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addThread", () => {
    it("should persist new thread and return added thread correctly", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      const newThread = {
        title: "this is new thread",
        body: "this is thread body",
        owner: "user-123",
      };

      const fakeIdGenerator = () => "123";
      const repository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const addedThread = await repository.addThread(newThread);
      expect(addedThread.id).toEqual("thread-123");
      expect(addedThread.title).toEqual(newThread.title);
      expect(addedThread.owner).toEqual(newThread.owner);

      const foundThread = await ThreadsTableTestHelper.findThreadById(
        "thread-123"
      );
      expect(foundThread).toBeDefined();
      expect(foundThread.id).toEqual("thread-123");
      expect(foundThread.title).toEqual(newThread.title);
      expect(foundThread.body).toEqual(newThread.body);
      expect(foundThread.owner).toEqual(newThread.owner);
      expect(foundThread.date).toBeDefined();
    });
  });

  describe("isThreadExist", () => {
    it("should return true if thread exists", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      const repository = new ThreadRepositoryPostgres(pool, {});
      await expect(repository.isThreadExist("thread-123")).resolves.toBe(true);
    });

    it("should return false if thread not exists", async () => {
      const repository = new ThreadRepositoryPostgres(pool, {});
      await expect(repository.isThreadExist("thread-123")).resolves.toBe(false);
    });
  });

  describe("getThreadById", () => {
    it("should return null if thread not exists", async () => {
      const repository = new ThreadRepositoryPostgres(pool, {});
      const thread = await repository.getThreadById("thread-123");
      expect(thread).toBeNull();
    });

    it("should return thread correctly", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      const repository = new ThreadRepositoryPostgres(pool, {});
      const thread = await repository.getThreadById("thread-123");
      expect(thread.id).toEqual("thread-123");
      expect(thread.title).toEqual("title");
      expect(thread.body).toEqual("body");
      expect(thread.date).toEqual(expect.any(String));
      expect(thread.username).toEqual("dicoding");
      expect(thread.comments).toEqual([]);
    });
  });
});
