"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-unused-vars */
var ErrorEnum;
(function (ErrorEnum) {
    ErrorEnum["SERVER_NOT_FOUND"] = "ServerService.findById.ServerNotFound";
    ErrorEnum["INSUFFICIENT_PERMISIONS"] = "ServerService.findById.InsufficientPermissions";
    ErrorEnum["CHANNEL_NOT_FOUND"] = "ChannelService.findById.ChannelNotFound";
    ErrorEnum["ADDRESSEE_NOT_FOUND"] = "FriendService.createFriendRequest.AddresseeNotFound";
    ErrorEnum["FRIEND_REQUEST_ALREADY_EXISTS"] = "FriendService.createFriendRequest.FriendRequestAlreadyExists.";
    ErrorEnum["FRIENDS_WITH_SELF"] = "FriendService.createFriendRequest.FriendsWithSelf";
    ErrorEnum["FRIEND_REQUEST_NOT_FOUND"] = "FriendService.acceptFriendRequest.FriendRequestNotFound";
    ErrorEnum["FRIEND_REQUEST_INSUFFICIENT_PERMISSIONS_UPDATE"] = "FriendService.acceptFriendRequest.FriendRequestInsufficientPermissionsUpdate";
    ErrorEnum["FRIEND_REQUEST_INSUFFICIENT_PERMISSIONS_DELETE"] = "FriendService.acceptFriendRequest.FriendRequestInsufficientPermissionsDelete";
    ErrorEnum["ADD_SERVER_USER_INSUFFICIENT_PERMISSIONS"] = "ServerUserService.addUserToServer.AddServerUserInsufficientPermissions";
    ErrorEnum["USER_NOT_FOUND"] = "ServerUserService.addUserToServer.UserNotFound";
    ErrorEnum["INVITE_SERVER_USER_INSUFFICIENT_PERMISSIONS"] = "ServerInviteService.inviteUserToServer.InviteServerUserInsufficientPermissions";
    ErrorEnum["INVITE_SERVER_USER_ALREADY_EXISTS"] = "ServerInviteService.inviteUserToServer.InviteServerUserAlreadyExists";
    ErrorEnum["CREATE_DIRECT_MESSAGE_NOT_FRIENDS_WITH_ENTIRE_GROUP"] = "DirectMessageService.createDirectMessage.CreateDirectMessageNotFriendsWithEntireGroup";
    ErrorEnum["DIRECT_MESSAGE_USER_NOT_FOUND"] = "DirectMessageService.findById.DirectMessageUserNotFound";
    ErrorEnum["DIRECT_MESSAGE_NOT_FOUND"] = "DirectMessageService.findById.DirectMessageNotFound";
    ErrorEnum["NOT_INVITED"] = "InviteServer.accept.NotInvited";
})(ErrorEnum || (ErrorEnum = {}));
exports.default = ErrorEnum;
