import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Divider,
} from '@mui/material';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export function ListarPostagens() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/posts`);
        if (!response.ok) throw new Error(`Erro ${response.status}`);
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.error('Falha ao carregar postagens:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={4} textAlign="center">
        <Typography color="error">Falha ao carregar: {error}</Typography>
      </Box>
    );
  }

  if (posts.length === 0) {
    return (
      <Box mt={4} textAlign="center">
        <Typography variant="body1">Nenhuma postagem encontrada.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        p: 3,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <Typography variant="h5" component="h1" textAlign="center">
        Postagens
      </Typography>

      {posts.map((post) => (
        <Box key={post.id}>
          <Typography variant="h6">{post.title}</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {post.categoryName}
          </Typography>
          <Typography variant="body1" paragraph>
            {post.content}
          </Typography>
          <Divider />
        </Box>
      ))}
    </Box>
  );
}
