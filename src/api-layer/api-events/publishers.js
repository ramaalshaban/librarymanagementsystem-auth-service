const { ServicePublisher } = require("serviceCommon");

// User Event Publisher Classes

// Publisher class for getUser api
const { UserRetrivedTopic } = require("./topics");
class UserRetrivedPublisher extends ServicePublisher {
  constructor(user, session, requestId) {
    super(UserRetrivedTopic, user, session, requestId);
  }

  static async Publish(user, session, requestId) {
    const _publisher = new UserRetrivedPublisher(user, session, requestId);
    await _publisher.publish();
  }
}

// Publisher class for updateUser api
const { UserUpdatedTopic } = require("./topics");
class UserUpdatedPublisher extends ServicePublisher {
  constructor(user, session, requestId) {
    super(UserUpdatedTopic, user, session, requestId);
  }

  static async Publish(user, session, requestId) {
    const _publisher = new UserUpdatedPublisher(user, session, requestId);
    await _publisher.publish();
  }
}

// Publisher class for registerUser api
const { UserRegisteredTopic } = require("./topics");
class UserRegisteredPublisher extends ServicePublisher {
  constructor(user, session, requestId) {
    super(UserRegisteredTopic, user, session, requestId);
  }

  static async Publish(user, session, requestId) {
    const _publisher = new UserRegisteredPublisher(user, session, requestId);
    await _publisher.publish();
  }
}

// Publisher class for deleteUser api
const { UserDeletedTopic } = require("./topics");
class UserDeletedPublisher extends ServicePublisher {
  constructor(user, session, requestId) {
    super(UserDeletedTopic, user, session, requestId);
  }

  static async Publish(user, session, requestId) {
    const _publisher = new UserDeletedPublisher(user, session, requestId);
    await _publisher.publish();
  }
}

// Publisher class for listUsers api
const { UsersListedTopic } = require("./topics");
class UsersListedPublisher extends ServicePublisher {
  constructor(users, session, requestId) {
    super(UsersListedTopic, users, session, requestId);
  }

  static async Publish(users, session, requestId) {
    const _publisher = new UsersListedPublisher(users, session, requestId);
    await _publisher.publish();
  }
}

// UserGroup Event Publisher Classes

// UserGroupMember Event Publisher Classes

// AuthShareToken Event Publisher Classes

module.exports = {
  UserRetrivedPublisher,
  UserUpdatedPublisher,
  UserRegisteredPublisher,
  UserDeletedPublisher,
  UsersListedPublisher,
};
