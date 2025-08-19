const { ServicePublisher } = require("serviceCommon");

// User Event Publisher Classes

// Publisher class for registerUser route
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

// Publisher class for updateUser route
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

// Publisher class for deleteUser route
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

// Publisher class for updateUserRole route
const { UserroleUpdatedTopic } = require("./topics");
class UserroleUpdatedPublisher extends ServicePublisher {
  constructor(userrole, session, requestId) {
    super(UserroleUpdatedTopic, userrole, session, requestId);
  }

  static async Publish(userrole, session, requestId) {
    const _publisher = new UserroleUpdatedPublisher(
      userrole,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// Publisher class for updatePassword route
const { PasswordUpdatedTopic } = require("./topics");
class PasswordUpdatedPublisher extends ServicePublisher {
  constructor(password, session, requestId) {
    super(PasswordUpdatedTopic, password, session, requestId);
  }

  static async Publish(password, session, requestId) {
    const _publisher = new PasswordUpdatedPublisher(
      password,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// Publisher class for getUser route
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

// Publisher class for listUsers route
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

// Publisher class for createGroup route
const { GroupCreatedTopic } = require("./topics");
class GroupCreatedPublisher extends ServicePublisher {
  constructor(group, session, requestId) {
    super(GroupCreatedTopic, group, session, requestId);
  }

  static async Publish(group, session, requestId) {
    const _publisher = new GroupCreatedPublisher(group, session, requestId);
    await _publisher.publish();
  }
}

// Publisher class for updateGroup route
const { GroupUpdatedTopic } = require("./topics");
class GroupUpdatedPublisher extends ServicePublisher {
  constructor(group, session, requestId) {
    super(GroupUpdatedTopic, group, session, requestId);
  }

  static async Publish(group, session, requestId) {
    const _publisher = new GroupUpdatedPublisher(group, session, requestId);
    await _publisher.publish();
  }
}

// Publisher class for getGroup route
const { GroupRetrivedTopic } = require("./topics");
class GroupRetrivedPublisher extends ServicePublisher {
  constructor(group, session, requestId) {
    super(GroupRetrivedTopic, group, session, requestId);
  }

  static async Publish(group, session, requestId) {
    const _publisher = new GroupRetrivedPublisher(group, session, requestId);
    await _publisher.publish();
  }
}

// Publisher class for listGroups route
const { GroupsListedTopic } = require("./topics");
class GroupsListedPublisher extends ServicePublisher {
  constructor(groups, session, requestId) {
    super(GroupsListedTopic, groups, session, requestId);
  }

  static async Publish(groups, session, requestId) {
    const _publisher = new GroupsListedPublisher(groups, session, requestId);
    await _publisher.publish();
  }
}

// UserGroupMember Event Publisher Classes

// Publisher class for createGroupMember route
const { GroupmemberCreatedTopic } = require("./topics");
class GroupmemberCreatedPublisher extends ServicePublisher {
  constructor(groupmember, session, requestId) {
    super(GroupmemberCreatedTopic, groupmember, session, requestId);
  }

  static async Publish(groupmember, session, requestId) {
    const _publisher = new GroupmemberCreatedPublisher(
      groupmember,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// Publisher class for deleteGroupMember route
const { GroupmemberDeletedTopic } = require("./topics");
class GroupmemberDeletedPublisher extends ServicePublisher {
  constructor(groupmember, session, requestId) {
    super(GroupmemberDeletedTopic, groupmember, session, requestId);
  }

  static async Publish(groupmember, session, requestId) {
    const _publisher = new GroupmemberDeletedPublisher(
      groupmember,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// Publisher class for getGroupMember route
const { GroupmemberRetrivedTopic } = require("./topics");
class GroupmemberRetrivedPublisher extends ServicePublisher {
  constructor(groupmember, session, requestId) {
    super(GroupmemberRetrivedTopic, groupmember, session, requestId);
  }

  static async Publish(groupmember, session, requestId) {
    const _publisher = new GroupmemberRetrivedPublisher(
      groupmember,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// Publisher class for listGroupMembers route
const { GroupmembersListedTopic } = require("./topics");
class GroupmembersListedPublisher extends ServicePublisher {
  constructor(groupmembers, session, requestId) {
    super(GroupmembersListedTopic, groupmembers, session, requestId);
  }

  static async Publish(groupmembers, session, requestId) {
    const _publisher = new GroupmembersListedPublisher(
      groupmembers,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// AuthShareToken Event Publisher Classes

module.exports = {
  UserRegisteredPublisher,
  UserUpdatedPublisher,
  UserDeletedPublisher,
  UserroleUpdatedPublisher,
  PasswordUpdatedPublisher,
  UserRetrivedPublisher,
  UsersListedPublisher,
  GroupCreatedPublisher,
  GroupUpdatedPublisher,
  GroupRetrivedPublisher,
  GroupsListedPublisher,
  GroupmemberCreatedPublisher,
  GroupmemberDeletedPublisher,
  GroupmemberRetrivedPublisher,
  GroupmembersListedPublisher,
};
