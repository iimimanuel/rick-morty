import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useRecoilState } from 'recoil';
import { locsState } from '../pages/Locations';
import { locationsState, selectedCharactersState } from '../pages/Details';
export default function Navbar() {
  const [, setLocations] = useRecoilState(locationsState);
  const [, setLocs] = useRecoilState(locsState);
  const [, setChar] = useRecoilState(selectedCharactersState);

  const clearStorage = () => {
    localStorage.clear();
    setLocations({});
    setLocs({});
    setChar([]);
    toast.success('Locations Cleared', {
      position: 'top-center',
      autoClose: 1000
    });
  };

  return (
    <nav className="w-full bg-[#0e0e0e] py-4 px-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div
          className="font-black text-xl hover:brightness-75 text-[#6fa9ff]"
        >
          Rick and Morty
        </div>

        <div className="space-x-4 flex items-center">
          <Link to="/locations" className="hover:brightness-75 text-white">
            Locations
          </Link>

          <button
            onClick={clearStorage}
            className="bg-red-500 px-2 py-2 rounded-md hover:bg-red-700 text-sm"
          >
            Clear Locations
          </button>
        </div>
      </div>
    </nav>
  );
}
