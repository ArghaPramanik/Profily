import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Map, { Marker, Popup, NavigationControl, FullscreenControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Search, MapPin, Briefcase, ChevronRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiYXJnaGFwcmFtYW5pazAwMSIsImEiOiJjbHQycmx4bmcxZjVtMmpwODhhYnczNGdxIn0.DKbS0X8mktrAUbt5sn72yw';

function ProfileList({ darkMode, profiles }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [viewState, setViewState] = useState({
    latitude: 37.0902,
    longitude: -95.7129,
    zoom: 3,
    transitionDuration: 1000, // Add this line
  });
  const [isLoading, setIsLoading] = useState(false);

  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleShowSummary = useCallback((profile) => {
    setViewState({
      latitude: profile.coordinates[1],
      longitude: profile.coordinates[0],
      zoom: 12,
      transitionDuration: 1000,
    });
    setSelectedProfile(profile);
  }, []);

  return (
    <div className="flex flex-col space-y-6">
      <div className="w-full">
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search profiles..."
            value={searchTerm}
            onChange={handleSearch}
            className={`w-full ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} shadow-md`}
            icon={<Search className="text-gray-400" aria-hidden="true" />}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProfiles.map((profile) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className={`overflow-hidden hover:shadow-lg transition-shadow duration-300 ${darkMode ? 'bg-gray-800 bg-opacity-80' : 'bg-white bg-opacity-80'} backdrop-blur-md`}>
                <CardHeader className="p-0">
                  <img src={profile.image} alt={profile.name} className="w-full h-48 object-cover" />
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-xl font-semibold mb-2">{profile.name}</CardTitle>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                    <Briefcase size={16} className="mr-2" aria-hidden="true" />
                    <span>{profile.description}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <MapPin size={16} className="mr-2" aria-hidden="true" />
                    <span>{profile.address}</span>
                  </div>
                </CardContent>
                <CardFooter className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 flex justify-between items-center`}>
                  <Button
                    onClick={() => handleShowSummary(profile)}
                    variant="outline"
                    className="flex items-center bg-purple-500 text-white hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700"
                  >
                    <MapPin className="mr-2" size={16} aria-hidden="true" />
                    View on Map
                  </Button>
                  <Link
                    to={`/profile/${profile.id}`}
                    className="text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300 font-medium flex items-center transition-colors duration-300"
                  >
                    Details
                    <ChevronRight size={16} className="ml-1" aria-hidden="true" />
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      <div className={`w-full ${darkMode ? 'bg-gray-900' : 'bg-indigo-100'} p-6 rounded-lg shadow-lg`}>
        <h2 className="text-2xl font-bold mb-4 text-purple-600 dark:text-purple-400">Profile Map</h2>
        <Card className={`h-[400px] ${darkMode ? 'bg-gray-800 bg-opacity-80' : 'bg-white bg-opacity-80'} backdrop-blur-md`}>
          <CardContent className="p-0 h-full">
            <Map
              {...viewState}
              onMove={(evt) => setViewState(evt.viewState)}
              style={{ width: '100%', height: '100%' }}
              mapStyle={darkMode ? "mapbox://styles/mapbox/dark-v10" : "mapbox://styles/mapbox/light-v10"}
              mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
            >
              <NavigationControl position="top-left" />
              <FullscreenControl position="top-right" />
              {profiles.map((profile) => (
                <Marker
                  key={profile.id}
                  longitude={profile.coordinates[0]}
                  latitude={profile.coordinates[1]}
                  anchor="bottom"
                >
                  <MapPin
                    size={32}
                    className={`text-purple-500 hover:text-purple-600 cursor-pointer transition-colors duration-200 ${selectedProfile?.id === profile.id ? 'text-red-500' : ''}`}
                    onClick={() => handleShowSummary(profile)}
                    aria-label={`View ${profile.name}'s location`}
                  />
                </Marker>
              ))}
              {selectedProfile && (
                <Popup
                  longitude={selectedProfile.coordinates[0]}
                  latitude={selectedProfile.coordinates[1]}
                  anchor="bottom"
                  onClose={() => setSelectedProfile(null)}
                  closeButton={false}
                  className={darkMode ? 'dark-mode-popup' : ''}
                >
                  <div className={`p-2 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                    <h3 className="font-bold text-lg mb-1">{selectedProfile.name}</h3>
                    <p className="text-sm">{selectedProfile.description}</p>
                    <p className="text-sm mt-1">{selectedProfile.address}</p>
                  </div>
                </Popup>
              )}
            </Map>
          </CardContent>
        </Card>
      </div>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Loader2 className="animate-spin text-white" size={48} aria-label="Loading" />
        </div>
      )}
    </div>
  );
}

export default ProfileList;