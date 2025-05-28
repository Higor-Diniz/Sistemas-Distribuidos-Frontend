import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Typography,
} from '@mui/material';
import { useAuthFetch } from '../hooks/useAuthFetch';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export function EditarPostagem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const authFetch = useAuthFetch();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({ categoryId: false, title: false, content: false });
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingPost, setLoadingPost] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await authFetch(`${API_URL}/api/v1/categories`);
        if (!response.ok) throw new Error(`Erro ${response.status}`);
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Falha ao carregar categorias:', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await authFetch(`${API_URL}/api/v1/posts/${id}`);
        if (!response.ok) throw new Error(`Erro ${response.status}`);
        const data = await response.json();
        
        setTitle(data.title);
        setContent(data.content);
        
        if (categories.length > 0 && data.categoryName) {
          const category = categories.find(cat => cat.name === data.categoryName);
          if (category) {
            setCategoryId(category.id);
          }
        }
      } catch (error) {
        console.error('Falha ao carregar postagem:', error);
      } finally {
        setLoadingPost(false);
      }
    };
    
    if (categories.length > 0) {
      fetchPost();
    }
  }, [id, categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const novosErros = {
      categoryId: !categoryId,
      title: !title,
      content: !content,
    };
    setErrors(novosErros);

    const formValido = Object.values(novosErros).every((err) => !err);
    if (!formValido) return;

    setLoading(true);
    try {
      const response = await authFetch(`${API_URL}/api/v1/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ 
          title, 
          content, 
          categoryId
        }),
      });
      if (!response.ok) throw new Error(`Erro ${response.status}`);
      navigate('/postagens'); // Redireciona para a lista de postagens após editar
    } catch (error) {
      console.error('Falha ao atualizar postagem:', error);
      alert('Erro ao atualizar postagem.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingPost || loadingCategories) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
        <Typography>Carregando...</Typography>
      </Box>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 3,
      }}
    >
      <Typography variant="h5" component="h1" textAlign="center">
        Editar Postagem
      </Typography>

      <FormControl
        fullWidth
        required
        error={errors.categoryId}
        disabled={loadingCategories}
      >
        <InputLabel id="label-categoria">Categoria</InputLabel>
        <Select
          labelId="label-categoria"
          id="select-categoria"
          value={categoryId}
          label="Categoria"
          onChange={(e) => {
            setCategoryId(Number(e.target.value));
            setErrors((prev) => ({ ...prev, categoryId: false }));
          }}
        >
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
        {errors.categoryId && <FormHelperText>Categoria é obrigatória</FormHelperText>}
      </FormControl>

      <TextField
        id="title-post"
        label="Título"
        variant="outlined"
        fullWidth
        required
        error={errors.title}
        helperText={errors.title ? 'Título é obrigatório' : ''}
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setErrors((prev) => ({ ...prev, title: false }));
        }}
      />

      <TextField
        id="content-post"
        label="Conteúdo"
        variant="outlined"
        fullWidth
        required
        multiline
        minRows={6}
        error={errors.content}
        helperText={errors.content ? 'Conteúdo é obrigatório' : ''}
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setErrors((prev) => ({ ...prev, content: false }));
        }}
      />

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          type="button"
          variant="outlined"
          size="large"
          onClick={() => navigate('/postagens')}
        >
          Cancelar
        </Button>
        <Button type="submit" variant="contained" size="large" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </Box>
    </Box>
  );
} 