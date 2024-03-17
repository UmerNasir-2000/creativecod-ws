const db = {
  user: require("./user.model"),
  chatMessage: require("./chat.message.model"),
  chatRequest: require("./chat.request.model"),
  group: require("./group.model"),
  groupMember: require("./group.member.model"),
  groupMessage: require("./group.message.model"),
}

module.exports = db
