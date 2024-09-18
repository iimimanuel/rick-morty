'use client';
import { useQuery } from '@apollo/client';
import createApolloClient from '../utils/apolloClient';
import { GET_CHARACTERS_BY_IDS } from '../queries/queries';
import { atom, useRecoilState } from 'recoil';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Character {
  id: string;
  name: string;
  status: string;
  species: string;
  image: string;
}

interface CharactersByIdsData {
  charactersByIds: Character[];
}

const locationsState = atom<{
  [locationName: string]: string[];
}>({
  key: 'locationsState',
  default: {}
});

const client = createApolloClient();

export default function LocationCharacters() {
  const [locations, setLocations] = useRecoilState(locationsState);
  const { name } = useParams<Record<string, string | undefined>>();

  useEffect(() => {
    const savedLocations = localStorage.getItem('locations');
    if (savedLocations) {
      setLocations(JSON.parse(savedLocations));
    }

    
  }, [setLocations]);

  const characterIds = name ? locations[name] : [];
  const uniqueCharacterIds = Array.from(new Set(characterIds));

  const { loading, data } = useQuery<CharactersByIdsData>(
    GET_CHARACTERS_BY_IDS,
    {
      variables: { ids: uniqueCharacterIds },
      client,
      skip: uniqueCharacterIds.length === 0
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

  if (!data)
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <div>No data available</div>
      </div>
    );

  return (
    <div className="flex justify-center ">
      <div className="">
        {Object.keys(locations).length === 0 ? (
          <p className="text-center text-gray-600">No locations available.</p>
        ) : (
          <div className="">
            <div className=" my-4 grid grid-cols-3 gap-2 lg:grid-cols-10">
              {data.charactersByIds.map((character: any) => (
                <div
                  key={character.id}
                  className="rounded-2xl p-2 bg-[#0e0e0e] flex flex-col items-center w-[100px] "
                >
                  <div className="w-20 h-20 relative ">
                    <img
                      className="object-cover rounded-xl "
                      src={character.image}
                      alt={character.name}
                    />
                  </div>
                  <div>
                    <p className="font-bold break-words text-sm">
                      {character.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
