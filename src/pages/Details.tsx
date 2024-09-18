'use client';
import { useQuery } from '@apollo/client';
import createApolloClient from '../utils/apolloClient';
import { GET_CHARACTER } from '../queries/queries';
import { useRecoilState } from 'recoil';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { atom } from 'recoil';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Waypoint } from 'react-waypoint';

interface Character {
  id: string;
  name: string;
  status: string;
  species: string;
  gender: string;

  image: string;
}

interface Locations {
  id: string;
  name: string;
  url: string;
  dimension: string;
  type: string;
}
interface CharacterData {
  character: Character;
  locations: { results: Locations[]; info: { next: number } };
}

export const locationsState = atom<{
  [locationName: string]: string[];
}>({
  key: 'locationsState',
  default: {}
});

export const selectedCharactersState = atom<string[]>({
  key: 'selectedCharactersState',
  default: []
});

const client = createApolloClient();

export default function Details() {
  const [, setLocations] = useRecoilState(locationsState);
  const [selectedCharacters, setSelectedCharacters] = useRecoilState(
    selectedCharactersState
  );
  const id = useParams().id as string;
  const [newLocation, setNewLocation] = useState('');
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const savedLocations = localStorage.getItem('locations');
    const savedSelectedCharacters = localStorage.getItem('selectedCharacters');

    if (savedLocations) {
      setLocations(JSON.parse(savedLocations));
    }

    if (savedSelectedCharacters) {
      setSelectedCharacters(JSON.parse(savedSelectedCharacters));
    }
  }, [setLocations, setSelectedCharacters]);

  const { loading, data, fetchMore } = useQuery<CharacterData>(GET_CHARACTER, {
    variables: { id, page: 1 },
    client,
    skip: !id
  });

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

  const character = data.character;

  const AssignLocation = async () => {
    const input = newLocation === 'others!@#$%^&*(' ? inputValue : newLocation;
    if (input.trim()) {
      if (selectedCharacters.includes(id)) {
        return toast.error('Character already exists!', {
          position: 'top-center',
          autoClose: 1000
        });
      }

      await setLocations((prev) => {
        const updatedLocations = {
          ...prev,
          [input]: [...(prev[input] || []), character.id]
        };

        localStorage.setItem('locations', JSON.stringify(updatedLocations));
        return updatedLocations;
      });

      await setSelectedCharacters((prev) => {
        const updatedCharacters = [...prev, id];

        localStorage.setItem(
          'selectedCharacters',
          JSON.stringify(updatedCharacters)
        );
        return updatedCharacters;
      });
      toast.success('Character successfully added to the location!', {
        position: 'top-center',
        autoClose: 1000
      });
    }
  };

  return (
    <div className="space-y-4 w-full my-4 flex flex-col items-center justify-center lg:h-screen lg:my-0">
      <div className=" w-72 space-y-2 flex flex-col rounded-2xl p-4 bg-[#0e0e0e]">
        <img
          className="object-cover rounded-xl w-64 h-64 "
          src={character.image}
          alt={character.name}
          loading="lazy"
        />
        <div className="w-64">
          <p className="font-bold text-2xl break-words">{character.name}</p>
          <p>Status: {character.status}</p>
          <p>Species: {character.species}</p>
          <p>Gender: {character.gender}</p>
        </div>

        <div className="flex flex-col space-y-2">
          <select
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            className="bg-[#0e0e0e] text-white p-2 rounded-md w-full"
          >
            <option value="" disabled>
              Select Location
            </option>
            <option value="others!@#$%^&*(">others</option>
            {data.locations.results.map((location, i) => (
              <>
                <option key={location.id} value={location.name}>
                  {location.name}
                </option>
                {i === data.locations.results.length - 20 && (
                  <Waypoint
                    onEnter={() => {
                      if (data.locations.info.next != null)
                        fetchMore({
                          variables: { page: data.locations.info.next },
                          updateQuery: (prev, { fetchMoreResult }) => {
                            if (!fetchMoreResult) {
                              return prev;
                            }
                            return {
                              character: prev.character,
                              locations: {
                                results: [
                                  ...prev.locations.results,
                                  ...fetchMoreResult.locations.results
                                ],
                                info: {
                                  next: fetchMoreResult.locations.info.next
                                }
                              }
                            };
                          }
                        });
                    }}
                  />
                )}
              </>
            ))}
          </select>
          {newLocation === 'others!@#$%^&*(' && (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder=" "
              className="w-full px-2 py-2 border text-black rounded-lg shadow-sm placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          )}
          <div className="flex justify-end">
            <button
              disabled={newLocation === ''}
              className="bg-[#1b1b1b] p-2 w-16 rounded-xl font-bold "
              onClick={AssignLocation}
            >
              ADD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
