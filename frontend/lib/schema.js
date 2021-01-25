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

export const HOME_QUERY = gql`
  {
    channels(sort: "_activeStreams") {
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
        extra
      }
      curatedRecordings {
        title
        description
        recording {
          title
          description
          image {
            id
            provider
            formats
          }
          recordingUrl
          embed
          extra
        }
        skip
      }
    }
    groups(sort: "updated_at:desc", where: { listed: true }) {
      ${GROUP_FIELDS}
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

export const MESSAGE_GROUP_MUTATION = gql`
  mutation MessageGroup($input: messageGroupInput!) {
    messageGroup(input: $input) {
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
