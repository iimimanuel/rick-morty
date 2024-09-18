'use client';
import { atom, useRecoilState } from 'recoil';
import { useEffect,  } from 'react';
import { Link } from 'react-router-dom';

export const locsState = atom<{
  [locationName: string]: string[];
}>({
  key: 'locsState',
  default: {}
});

export default function Locations() {
  const [locations, setLocations] = useRecoilState(locsState);

  useEffect(() => {
    const savedLocations = localStorage.getItem('locations');
    console.log(savedLocations);

    if (savedLocations) {
      setLocations(JSON.parse(savedLocations));
    }
  }, [setLocations]);

  if (Object.keys(locations).length === 0)
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <div>No locations available</div>
      </div>
    );

  return (
    <div className="space-y-4 lg:space-y-0 flex flex-col lg:grid lg:grid-cols-3 lg:gap-4 p-4">
      {Object.keys(locations).map((locationName) => (
        <Link
          to={`./${locationName}`}
          key={locationName}
          className="bg-[#0e0e0e] group hover:bg-[#222222] p-4 rounded-lg shadow-md "
        >
          <h2 className="text-lg font-semibold mb-2">{locationName}</h2>
        </Link>
      ))}
    </div>
  );
}
