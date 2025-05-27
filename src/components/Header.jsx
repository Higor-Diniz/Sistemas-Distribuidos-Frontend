import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router';
import logo from '../assets/logo.png';

export function Header() {
  const navigate = useNavigate();

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
        <Box>
          <Button
            variant="contained"
            color="primary"
            sx={{ mr: 1 }}
            onClick={() => navigate('/')}
          >
            Categorias
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ mr: 1 }}
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
        </Box>
      </Toolbar>
    </AppBar>
  );
}
