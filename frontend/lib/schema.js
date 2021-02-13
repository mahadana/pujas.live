import { gql } from "@apollo/client";

const GROUP_FIELDS = `
  id
  title
  description
  image {
    id
    provider
    formats
  }
  owner {
    id
  }
  timezone
  events {
    id
    day
    startAt
    duration
  }
`;

const RECORDING_FIELDS = `
  id
  title
  description
  image {
    id
    provider
    formats
  }
  automate
  recordingUrl
  embed
  live
  startAt
  endAt
  duration
  skip
  extra
`;

const CHANNEL_FIELDS = `
  id
  title
  description
  image {
    id
    provider
    formats
  }
  automate
  channelUrl
  monastery {
    title
    websiteUrl
  }
  activeStream {
    ${RECORDING_FIELDS}
  }
`;

export const HOME_QUERY = gql`
  {
    channels(sort: "_activeStreams") {
      ${CHANNEL_FIELDS}
    }
    groups(sort: "updated_at:desc", where: { listed: true }) {
      ${GROUP_FIELDS}
    }
  }
`;

export const CHANNEL_QUERY = gql`
  query Channel($id: ID!, $time: DateTime!) {
    channel(id: $id) {
      ${CHANNEL_FIELDS}
      curatedRecordings {
        id
        recording {
          ${RECORDING_FIELDS}
        }
      }
      recordings(
        sort: "startAt:DESC"
        where: {
          startAt_null: false,
          startAt_lt: $time
        }
        limit: 10
      ) {
        ${RECORDING_FIELDS}
      }
    }
  }
`;

export const GROUP_QUERY = gql`
  query Group($id: ID!) {
    group(id: $id) {
      ${GROUP_FIELDS}
    }
  }
`;

export const CREATE_GROUP_MUTATION = gql`
  mutation CreateGroup($input: createGroupInput!) {
    createGroup(input: $input) {
      group {
        ${GROUP_FIELDS}
      }
    }
  }
`;

export const UPDATE_GROUP_MUTATION = gql`
  mutation UpdateGroup($input: updateGroupInput!) {
    updateGroup(input: $input) {
      group {
        ${GROUP_FIELDS}
      }
    }
  }
`;

export const RECORDING_QUERY = gql`
  query Recording($id: ID!) {
    recording(id: $id) {
      ${RECORDING_FIELDS}
    }
  }
`;

export const MESSAGE_GROUP_MUTATION = gql`
  mutation MessageGroup($input: messageGroupInput!) {
    messageGroup(input: $input) {
      ok
    }
  }
`;

export const MESSAGE_SITE_MUTATION = gql`
  mutation MessageSite($input: messageSiteInput!) {
    messageSite(input: $input) {
      ok
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($input: UsersPermissionsLoginInput!) {
    login(input: $input) {
      jwt
      user {
        id
        email
      }
    }
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: UsersPermissionsRegisterInput!) {
    register(input: $input) {
      jwt
      user {
        id
        email
      }
    }
  }
`;

export const CHANGE_EMAIL_MUTATION = gql`
  mutation ChangeEmail($email: String!) {
    changeEmail(email: $email) {
      ok
    }
  }
`;

export const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
    changePassword(oldPassword: $oldPassword, newPassword: $newPassword) {
      ok
    }
  }
`;

export const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      ok
    }
  }
`;

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword(
    $password: String!
    $passwordConfirmation: String!
    $code: String!
  ) {
    resetPassword(
      password: $password
      passwordConfirmation: $passwordConfirmation
      code: $code
    ) {
      jwt
      user {
        id
        email
      }
    }
  }
`;

export const UPLOAD_MUTATION = gql`
  mutation Upload($file: Upload!) {
    upload(file: $file) {
      id
      provider
      formats
    }
  }
`;
