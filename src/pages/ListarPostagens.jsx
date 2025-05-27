import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export function ListarPostagens() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoriaId = searchParams.get('categoria');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, postId: null, postTitle: '' });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let url = `${API_URL}/api/v1/posts`;
        if (categoriaId) {
          url += `?categoryId=${categoriaId}`;
        }
        const response = await fetch(url);
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
  }, [categoriaId]);

  const handleDeleteClick = (post) => {
    setDeleteDialog({ open: true, postId: post.id, postTitle: post.title });
  };

  const handleDeleteConfirm = async () => {
    const { postId } = deleteDialog;
    try {
      const response = await fetch(`${API_URL}/api/v1/posts/${postId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`Erro ${response.status}`);
      
      // Remove a postagem da lista local
      setPosts(posts.filter(post => post.id !== postId));
      setDeleteDialog({ open: false, postId: null, postTitle: '' });
    } catch (err) {
      console.error('Falha ao deletar postagem:', err);
      alert('Erro ao deletar postagem');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, postId: null, postTitle: '' });
  };

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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h6">{post.title}</Typography>
              <Typography variant="subtitle2" color="textSecondary">
                {post.categoryName}
              </Typography>
            </Box>
            <Box>
              <Tooltip title="Editar postagem">
                <IconButton
                  onClick={() => navigate(`/postagens/editar/${post.id}`)}
                  size="small"
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Excluir postagem">
                <IconButton
                  onClick={() => handleDeleteClick(post)}
                  size="small"
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Typography variant="body1" paragraph>
            {post.content}
          </Typography>
          <Divider />
        </Box>
      ))}

      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir a postagem "{deleteDialog.postTitle}"?
            Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
