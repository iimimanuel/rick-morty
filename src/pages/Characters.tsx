import { useQuery } from '@apollo/client';
import createApolloClient from '../utils/apolloClient';
import { GET_CHARACTERS } from '../queries/queries';
import { Link } from 'react-router-dom';
import { Waypoint } from 'react-waypoint';
import Navbar from '../components/navbar';

interface Character {
  id: string;
  name: string;
  status: string;
  species: string;
  image: string;
  info: { next: number };
}

interface CharactersData {
  characters: {
    results: Character[];
    info: { next: number };
  };
}

const client = createApolloClient();

export default function CharactersPage() {
  const { data, loading, fetchMore, networkStatus } = useQuery<CharactersData>(
    GET_CHARACTERS,
    {
      variables: { page: 1 },
      client
    }
  );

  if (loading)
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <div className="animate-spin">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </div>
      </div>
    );

  if (!data || !data.characters)
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <div>No data available</div>
      </div>
    );

  console.log(networkStatus);

  return (
    <>
      <Navbar />
      <div className=" space-y-4 my-4 lg:grid lg:grid-cols-3 lg:space-y-0 lg:gap-4">
        {data.characters.results.map((character, i) => (
          <div
            key={character.id}
            className="flex flex-col w-full items-center "
          >
            <Link
              to={`/details/${character.id}`}
              className="space-y-2  rounded-2xl p-4 w-72 bg-[#0e0e0e] group hover:bg-[#222222]  "
            >
              <img
                className="object-cover rounded-xl group-hover:brightness-75 w-64 h-64"
                src={character.image}
                alt={character.name}
                loading="lazy"
              />
              <div>
                <p className="font-bold text-2xl break-words">
                  {character.name}
                </p>
                <p>{character.species}</p>
              </div>
            </Link>
            {i === data.characters.results.length - 20 ? (
              <>
                <div className="animate-spin">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                </div>
                <Waypoint
                  onEnter={() => {
                    if (data.characters.info.next != null)
                      fetchMore({
                        variables: { page: data.characters.info.next },
                        updateQuery: (prev, { fetchMoreResult }) => {
                          if (!fetchMoreResult) {
                            return prev;
                          }
                          return {
                            characters: {
                              results: [
                                ...prev.characters.results,
                                ...fetchMoreResult.characters.results
                              ],
                              info: {
                                next: fetchMoreResult.characters.info.next
                              }
                            }
                          };
                        }
                      });
                  }}
                />
              </>
            ) : (
              <></>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
