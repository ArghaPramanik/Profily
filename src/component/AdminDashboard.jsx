import React, { useState } from 'react';
import { Edit, Trash2, Loader2, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiYXJnaGFwcmFtYW5pazAwMSIsImEiOiJjbHQycmx4bmcxZjVtMmpwODhhYnczNGdxIn0.DKbS0X8mktrAUbt5sn72yw';

function AdminDashboard({ darkMode, profiles, setProfiles }) {
  const [editingProfile, setEditingProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEdit = (profile) => {
    setEditingProfile({ ...profile });
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    setProfiles(profiles.filter((profile) => profile.id !== id));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (!editingProfile) return;

      let coordinates = editingProfile.coordinates;

      if (!coordinates || coordinates.length !== 2) {
        // If coordinates are not set or invalid, use the geocoding API to get them
        const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(editingProfile.address)}.json?access_token=${MAPBOX_ACCESS_TOKEN}`);
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          coordinates = data.features[0].center;
        } else {
          throw new Error('Unable to geocode the address');
        }
      }

      const updatedProfile = { ...editingProfile, coordinates };

      if (updatedProfile.id) {
        setProfiles(profiles.map((p) => (p.id === updatedProfile.id ? updatedProfile : p)));
      } else {
        setProfiles([...profiles, { ...updatedProfile, id: Date.now() }]);
      }

      setEditingProfile(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditingProfile((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleAddNew = () => {
    setEditingProfile({
      id: 0,
      name: '',
      description: '',
      address: '',
      image: '',
      coordinates: [0, 0]
    });
    setIsDialogOpen(true);
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800 bg-opacity-90' : 'bg-white bg-opacity-90'} backdrop-blur-md p-6 rounded-lg shadow-lg`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={handleAddNew} className="bg-purple-500 hover:bg-purple-600 text-white">
          <Plus className="mr-2" size={16} aria-hidden="true" />
          Add Profile
        </Button>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className={darkMode ? 'bg-gray-800' : 'bg-white'}>
          <DialogHeader>
            <DialogTitle>{editingProfile?.id ? 'Edit Profile' : 'Add Profile'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={editingProfile?.name || ''}
                onChange={handleInputChange}
                required
                className="bg-purple-100 dark:bg-purple-900"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={editingProfile?.description || ''}
                onChange={handleInputChange}
                required
                className="bg-purple-100 dark:bg-purple-900"
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={editingProfile?.address || ''}
                onChange={handleInputChange}
                required
                className="bg-purple-100 dark:bg-purple-900"
              />
            </div>
            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                value={editingProfile?.image || ''}
                onChange={handleInputChange}
                required
                className="bg-purple-100 dark:bg-purple-900"
              />
            </div>
            <Button type="submit" className="bg-purple-500 hover:bg-purple-600 text-white" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <Card key={profile.id} className={`${darkMode ? 'bg-gray-800 bg-opacity-80' : 'bg-white bg-opacity-80'} backdrop-blur-md`}>
            <CardHeader>
              <img src={profile.image} alt={profile.name} className="w-full h-48 object-cover rounded-t-lg" />
            </CardHeader>
            <CardContent>
              <CardTitle>{profile.name}</CardTitle>
              <p className="text-gray-600 dark:text-gray-400">{profile.description}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">{profile.address}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Coordinates: {profile.coordinates[0].toFixed(4)}, {profile.coordinates[1].toFixed(4)}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => handleEdit(profile)} className="bg-purple-500 text-white hover:bg-purple-600">
                <Edit className="mr-2" size={16} aria-hidden="true" />
                Edit
              </Button>
              <Button variant="destructive" onClick={() => handleDelete(profile.id)}>
                <Trash2 className="mr-2" size={16} aria-hidden="true" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;