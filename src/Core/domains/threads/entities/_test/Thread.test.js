const Comment = require("../../../comments/entities/Comment");
const Thread = require("../Thread");

describe("Thread entities", () => {
  it("should throw error when payload did not contain needed property", async () => {
    const payload = {
      id: "thread-123",
      title: "this a thread title",
      date: "somedate",
      username: "superuser",
    };

    expect(() => new Thread(payload)).toThrowError(
      "THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", async () => {
    const payload = {
      id: "thread-123",
      title: "this a thread title",
      body: "this is a thread body",
      date: "somedate",
      username: 123,
    };
    expect(() => new Thread(payload)).toThrowError(
      "THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create Thread object correctly", async () => {
    const payload = {
      id: "thread-123",
      title: "this a thread title",
      body: "this is a thread body",
      date: "somedate",
      username: "superuser",
    };

    const { id, title, body, date, username } = new Thread(payload);

    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
  });

  it("should throw error if comment is not array", async () => {
    const payload = {
      id: "thread-123",
      title: "this a thread title",
      body: "this is a thread body",
      date: "somedate",
      username: "superuser",
    };
    const comment = "this is string not an array";
    const thread = new Thread(payload);

    expect(() => thread.setComments(comment)).toThrowError(
      "THREAD.COMMENTS_NOT_ARRAY"
    );
  });

  it("should throw error when comments in thread contain invalid member", async () => {
    const threadPayload = {
      id: "thread-123",
      title: "this a thread title",
      body: "this is a thread body",
      date: "somedate",
      username: "superuser",
    };
    const commentPayload = {
      id: "comment-123",
      username: "superuser",
      date: "somedate",
      content: "this is a comment",
      isDelete: false,
    };
    const comments = [new Thread(threadPayload), new Comment(commentPayload)];

    const thread = new Thread(threadPayload);

    expect(() => thread.setComments(comments)).toThrowError(
      "THREAD.COMMENTS_CONTAINS_INVALID_MEMBER"
    );
  });

  it("should create thread object with comments correctly", async () => {
    const threadPayload = {
      id: "thread-123",
      title: "this a thread title",
      body: "this is a thread body",
      date: "somedate",
      username: "superuser",
    };
    const commentPayload = {
      id: "comment-123",
      username: "superuser",
      date: "somedate",
      content: "this is a comment",
      isDelete: false,
    };
    const comments = [new Comment(commentPayload)];

    const thread = new Thread(threadPayload);
    thread.setComments(comments);

    // Assert
    expect(thread.comments).toBeDefined();
    expect(thread.comments).toEqual(comments);
    expect(thread.comments[0].id).toEqual(commentPayload.id);
    expect(thread.comments[0].content).toEqual(commentPayload.content);
    expect(thread.comments[0].date).toEqual(commentPayload.date);
    expect(thread.comments[0].username).toEqual(commentPayload.username);
  });
});
