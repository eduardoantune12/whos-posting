import { useState, useEffect } from 'react';
import api from './services/api';
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ first_name: '', bio: '', profile_picture: null });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await api.get('profile/update/');
    setProfile(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('first_name', profile.first_name);
    formData.append('bio', profile.bio);
    if (profile.profile_picture instanceof File) {
      formData.append('profile_picture', profile.profile_picture);
    }

    try {
      await api.patch('profile/update/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/')
    } catch (err) {
      console.error("Erro ao atualizar perfil", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Editar Perfil</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text" placeholder="Nome" value={profile.first_name}
          onChange={(e) => setProfile({...profile, first_name: e.target.value})}
          className="w-full border p-2 rounded"
        />
        <textarea
          placeholder="Bio" value={profile.bio}
          onChange={(e) => setProfile({...profile, bio: e.target.value})}
          className="w-full border p-2 rounded"
        />
        <input
          type="file" onChange={(e) => setProfile({...profile, profile_picture: e.target.files[0]})}
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors cursor-pointer">Salvar</button>
      </form>
    </div>
  );
}

export default ProfilePage;