import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  CircularProgress,
  Grid,
} from '@mui/material';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export function Categorias() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/categories`);
        if (!response.ok) throw new Error(`Erro ${response.status}`);
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('Falha ao carregar categorias:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
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

  if (categories.length === 0) {
    return (
      <Box mt={4} textAlign="center">
        <Typography variant="body1">Nenhuma categoria encontrada.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" textAlign="center" mb={4}>
        Categorias
      </Typography>
      
      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                }
              }}
            >
              <CardActionArea 
                onClick={() => navigate(`/postagens?categoria=${category.id}`)}
                sx={{ height: '100%' }}
              >
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {category.name}
                  </Typography>
                  {category.description && (
                    <Typography variant="body2" color="text.secondary">
                      {category.description}
                    </Typography>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 