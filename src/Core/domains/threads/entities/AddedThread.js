class NotContainNeededPropertyError extends Error {
  constructor() {
    super('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    this.name = 'NotContainNeededPropertyError';
  }
}

class NotMeetDataTypeSpecificationError extends Error {
  constructor() {
    super('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    this.name = 'NotMeetDataTypeSpecificationError';
  }
}

class AddedThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, title, owner } = payload;

    this.id = id;
    this.title = title;
    this.owner = owner;
  }

  _verifyPayload(payload) {
    const { id, title, owner } = payload;

    if (!id || !title || !owner) {
      throw new NotContainNeededPropertyError();
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof owner !== 'string') {
      throw new NotMeetDataTypeSpecificationError();
    }
  }
}

module.exports = AddedThread;
module.exports.NotContainNeededPropertyError = NotContainNeededPropertyError;
module.exports.NotMeetDataTypeSpecificationError = NotMeetDataTypeSpecificationError;