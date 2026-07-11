import React, { useEffect, useState } from 'react';
import api from './services/api';
import { useNavigate, Routes, Route } from 'react-router-dom';
import ProfilePage from './ProfilePage';
import logoHeaderImg from './assets/header.png'

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState('');
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [isLogged, setIsLogged] = useState(false);
  const navigate = useNavigate();
  const [feedType, setFeedType] = useState('global');
  const [activeCommentsPostId, setActiveCommentsPostId] = useState(null);
  const [comments, setComments] = useState({});
  const [newCommentText, setNewCommentText] = useState("");

  // Controla o estado de login e recarrega os posts quando o feed mudar
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('username');

    if (token) {
      setIsLogged(true);
      if (storedUser) setCurrentUser(storedUser);
    } else {
      setIsLogged(false);
      navigate('/register');
    }
    fetchPosts(true); // Roda sempre, garantindo que deslogados vejam o feed global
  }, [feedType, navigate]);

  const fetchPosts = async (showLoader = false) => {
    if (showLoader) setIsLoading(true);
    try {
      const response = await api.get(`posts/?feed=${feedType}`);
      setPosts(response.data);
    } catch (err) {
      console.error("Erro ao buscar posts", err);
    } finally {
      if (showLoader) setIsLoading(false);
    }
  };

  const handleRefreshFeed = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/');
    fetchPosts(true);
  };

  // --- NOVA FUNÇÃO DE LIKE ---
  const handleLike = async (postId) => {
    try {
      await api.post(`posts/${postId}/like/`);
      fetchPosts();
    } catch (err) {
      console.error("Erro ao curtir:", err);
      if (!isLogged) {
        navigate('/login');
      }
    }
  };

  // --- FUNÇÃO DE FOLLOW ---
  const handleFollow = async (authorId) => {
    try {
      await api.post(`/users/${authorId}/follow/`);
      fetchPosts();
    } catch (err) {
      console.error("Erro ao seguir usuário:", err);
      if (!isLogged) {
        navigate('/login');
      }
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await api.post('posts/', { content: newPost });
      setNewPost('');
      fetchPosts();
    } catch (err) {
      alert("Erro ao publicar! Você está logado?");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    setIsLogged(false);
    navigate('/login');
  };

  const fetchComments = async (postId) => {
    try {
      const response = await api.get(`comments/?post=${postId}`);
      setComments(prev => ({
        ...prev,
        [postId]: response.data
      }));
    } catch (err) {
      console.error("Erro ao buscar comentários", err);
    }
  };

  const toggleCommentsSection = (postId) => {
  if (activeCommentsPostId === postId) {
    setActiveCommentsPostId(null); // Se já estava aberto, fecha
  } else {
    setActiveCommentsPostId(postId); // Se estava fechado, abre...
    fetchComments(postId); // ...e busca os comentários do banco
  }
  setNewCommentText(""); // Limpa o campo de texto
};

const handleCreateComment = async (e, postId) => {
  e.preventDefault();
  if (!newCommentText.trim()) return;

  try {
    await api.post('comments/', {
      post: postId,
      content: newCommentText
    });
    setNewCommentText("");
    fetchComments(postId);

    setPosts(prevPosts => prevPosts.map(p =>
      p.id === postId ? { ...p, comments_count: (p.comments_count || 0) + 1 } : p
    ));
  } catch (err) {
    console.error("Erro ao postar comentário", err);
  }
};
return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-4">

      {/* CONTAINER FIXO NO TOPO */}
      <div className="sticky top-0 z-50 max-w-2xl mx-auto bg-gray-100/80 backdrop-blur-md pt-2 pb-4 space-y-3">

        {/* Navbar Principal */}
        <nav className="flex justify-between items-center bg-white p-4 shadow rounded-lg">
        <div onClick={handleRefreshFeed} className="cursor-pointer">
          <img
            src={logoHeaderImg}
            alt="Who's Posting"
            className="h-10 sm:h-12 w-auto hover:opacity-80 transition-opacity"
          />
        </div>
          <div className="flex items-center space-x-4">
            {/* O BOTÃO QUE LEVA PRO PERFIL FICA AQUI */}
            {isLogged && (
              <button onClick={() => navigate('/profile')} className="text-sm font-semibold text-gray-600 hover:text-blue-600 cursor-pointer">
                Editar Perfil
              </button>
            )}

            {isLogged ? (
              <button onClick={handleLogout} className="text-red-500 font-semibold cursor-pointer hover:text-red-700 transition-colors">Sair</button>
            ) : (
              <button onClick={() => navigate('/login')} className="bg-blue-500 text-white px-4 py-1 rounded cursor-pointer hover:bg-blue-600 transition-colors">Entrar</button>
            )}
          </div>
        </nav>

        {/* SUB-HEADER: ABAS DE ALTERNÂNCIA DE FEED */}
        {isLogged && (
          <div className="flex bg-white rounded-lg p-1.5 shadow-sm border border-gray-200/50 w-full">
            <button
              onClick={() => setFeedType('global')}
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-all duration-300 cursor-pointer text-center ${
                feedType === 'global'
                  ? 'bg-blue-600 text-white shadow-md transform scale-[1.01]'
                  : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50/50'
              }`}
            >
              🌐 Whos Feed
            </button>
            <button
              onClick={() => setFeedType('following')}
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-all duration-300 cursor-pointer text-center ${
                feedType === 'following'
                  ? 'bg-blue-600 text-white shadow-md transform scale-[1.01]'
                  : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50/50'
              }`}
            >
              👥 Whos Seguindo
            </button>
          </div>
        )}
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-2xl mx-auto mt-4">

        {/* Formulário de Novo Post */}
        {isLogged && (
          <form onSubmit={handleCreatePost} className="bg-white p-4 rounded shadow mb-6">
            <textarea
              className="w-full border p-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              placeholder="No que você está pensando?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 transition-colors cursor-pointer">
              Postar
            </button>
          </form>
        )}

        {/* ÁREA DE LOADING OU LISTAGEM DE POSTS */}
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-16 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
            <span className="text-blue-600 font-bold animate-pulse">Atualizando o feed...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">

                {/* Header do Post */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">
                      {(post.author?.[0] || 'U').toUpperCase()}
                    </div>
                    <span className="font-bold text-gray-900">@{post.author}</span>
                  </div>

                  {isLogged && (
                    <div className="flex items-center">
                      {post.author ? (
                        post.author === currentUser ? (
                          <span className="text-xs text-gray-400 italic">Você</span>
                        ) : (
                          <button
                            onClick={() => handleFollow(post.author_id)}
                            className={`text-xs px-3 py-1 rounded-full font-semibold transition-all duration-200 cursor-pointer group ${
                              post.is_following
                                ? 'bg-gray-200 text-gray-700 hover:bg-red-100 hover:text-red-600'
                                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                            }`}
                          >
                            {post.is_following ? (
                              <>
                                <span className="group-hover:hidden">Seguindo</span>
                                <span className="hidden group-hover:inline">Deixar de seguir</span>
                              </>
                            ) : (
                              'Seguir'
                            )}
                          </button>
                        )
                      ) : null}
                    </div>
                  )}
                </div>

                {/* Conteúdo do Post */}
                <p className="text-gray-700 leading-relaxed mb-4">{post.content}</p>

                {/* Botões de Interação */}
                <div className="mt-4 flex items-center space-x-6 pt-2 border-t border-gray-50">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center space-x-2 group focus:outline-none cursor-pointer"
                  >
                    <span className={`text-xl transition-all duration-200 transform group-hover:scale-125 ${
                      post.has_liked
                        ? 'text-red-500 scale-110 drop-shadow-[0_2px_4px_rgba(239,68,68,0.4)]'
                        : 'text-gray-400 grayscale group-hover:grayscale-0'
                    }`}>
                      ❤️
                    </span>
                    <span className={`text-sm font-semibold transition-colors ${
                      post.has_liked ? 'text-red-500' : 'text-gray-500'
                    }`}>
                      {post.likes_count || 0}
                    </span>
                  </button>

                  <button
                    onClick={() => toggleCommentsSection(post.id)}
                    className="flex items-center space-x-2 group focus:outline-none cursor-pointer"
                  >
                    <span className="text-xl transition-all duration-200 transform group-hover:scale-125 text-gray-400 group-hover:text-blue-500">
                      💬
                    </span>
                    <span className="text-sm font-semibold text-gray-500 group-hover:text-blue-600 transition-colors">
                      {post.comments_count || 0}
                    </span>
                  </button>
                </div>

                {/* SEÇÃO EXPANSÍVEL DE COMENTÁRIOS */}
                {activeCommentsPostId === post.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-4 bg-gray-50/50 p-4 rounded-xl animate-slide-up">
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                      {(comments[post.id] || []).map(comment => (
                        <div key={comment.id} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm text-sm">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-gray-800">@{comment.author}</span>
                            <span className="text-[10px] text-gray-400">
                              {new Date(comment.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-gray-600 leading-relaxed">{comment.content}</p>
                        </div>
                      ))}

                      {(!comments[post.id] || comments[post.id].length === 0) && (
                        <p className="text-center text-xs text-gray-400 py-2">Nenhum comentário ainda. Seja o primeiro a interagir!</p>
                      )}
                    </div>

                    {isLogged ? (
                      <form onSubmit={(e) => handleCreateComment(e, post.id)} className="flex items-center space-x-2 mt-2">
                        <input
                          type="text"
                          className="flex-1 border bg-white p-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          placeholder="Escreva um comentário..."
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                        />
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-4 py-2 text-sm rounded-lg font-bold hover:bg-blue-700 transition-colors cursor-pointer"
                        >
                          Enviar
                        </button>
                      </form>
                    ) : (
                      <p className="text-center text-xs text-gray-400 italic pt-2 border-t border-gray-100/50">
                        Faça login para deixar um comentário.
                      </p>
                    )}
                  </div>
                )}

                {/* Data e Footer */}
                <div className="mt-4 pt-2 flex justify-between items-center text-gray-400 text-[10px]">
                  <span>
                    {new Date(post.created_at).toLocaleString('pt-BR', {
                      day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">Original</span>
                </div>

              </div>
            ))}

            {/* Feed vazio */}
            {posts.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <p className="text-lg font-semibold">Nenhum post encontrado.</p>
                <p className="text-sm">Que tal ser o primeiro a postar algo aqui?</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;