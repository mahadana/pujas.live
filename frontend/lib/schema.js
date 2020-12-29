import { gql } from "@apollo/client";

const GROUP_FIELDS = `
  id
  name
  description
  image {
    formats
  }
  owner {
    id
  }
  timezone
  events {
    id
    startAt
    duration
    daysOfWeek
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
        confirmed
        blocked
      }
    }
  }
`;
