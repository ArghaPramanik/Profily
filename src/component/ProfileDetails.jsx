import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, User, Briefcase, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

function ProfileDetails({ darkMode, profiles }) {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const foundProfile = profiles.find((p) => p.id === parseInt(id));
      setProfile(foundProfile || null);
    };
    fetchProfile();
  }, [id, profiles]);

  if (!profile) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin" size={48} aria-label="Loading profile details" /></div>;
  }

  return (
    <Card className={`max-w-2xl mx-auto ${darkMode ? 'bg-gray-800 bg-opacity-90' : 'bg-white bg-opacity-90'} backdrop-blur-md`}>
      <CardHeader>
        <img src={profile.image} alt={profile.name} className="w-full h-full object-contain rounded-t-lg" />
      </CardHeader>
      <CardContent className="p-6">
        <CardTitle className="text-3xl font-bold mb-4">{profile.name}</CardTitle>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">{profile.description}</p>
        <div className="space-y-2">
          <div className="flex items-center">
            <MapPin className="mr-2" size={20} aria-hidden="true" />
            <span>{profile.address}</span>
          </div>
          <div className="flex items-center">
            <User className="mr-2" size={20} aria-hidden="true" />
            <span>example@email.com</span>
          </div>
          <div className="flex items-center">
            <Briefcase className="mr-2" size={20} aria-hidden="true" />
            <span>Technology, Travel, Photography</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link to="/">
          <Button variant="outline" className="bg-purple-500 text-white hover:bg-purple-600">Back to List</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default ProfileDetails;