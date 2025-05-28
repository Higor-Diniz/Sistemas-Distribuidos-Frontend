import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png';

export function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#ffffff',
        color: '#000000',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <img src={logo} alt="Logo" style={{ height: 120, marginRight: 12 }} />
          <Typography variant="h6">Minha Empresa</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
          >
            Categorias
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/postagens')}
          >
            Postagens
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/criar-postagem')}
          >
            Criar Postagem
          </Button>
          
          {user && (
            <>
              <Typography variant="body2" sx={{ mx: 2 }}>
                Olá, {user.username || user.name || user.email.split('@')[0]}
              </Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={handleLogout}
              >
                Sair
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
