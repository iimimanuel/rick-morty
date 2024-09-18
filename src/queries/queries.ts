import { gql } from '@apollo/client';

export const GET_CHARACTERS = gql`
  query GetCharacters($page: Int!) {
    characters(page: $page) {
      results {
        id
        name
        status
        species
        origin {
          name
        }
        image
      }
      info {
        next
      }
    }
  }
`;

export const GET_CHARACTER = gql`
  query GetCharacterAndLocations($id: ID!, $page: Int!) {
    character(id: $id) {
      id
      name
      status
      species
      type
      gender
      origin {
        name
      }
      location {
        id
        name
        dimension
        type
      }
      image
    }
    locations(page: $page) {
      results {
        id
        name
        type
        dimension
      }
      info {
        next
      }
    }
  }
`;

export const GET_CHARACTERS_BY_IDS = gql`
  query GetCharactersByIds($ids: [ID!]!) {
    charactersByIds(ids: $ids) {
      id
      name
      status
      species
      image
    }
  }
`;
