import { useState, useEffect } from "react";
import {
  AppBar, Toolbar, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, CircularProgress, MenuItem, Menu, Select, FormControl, InputLabel, Box, TextField,
  Pagination, Button, Drawer, InputAdornment, Slider
} from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import TuneIcon from '@mui/icons-material/Tune';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import './Products.css';
import { useNavigate } from "react-router-dom";

const ProductGrid = () => {
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [filters, setFilters] = useState({ categoria: "", genero: "", valorMin: 1, valorMax: 1000 });
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setLoading(true);
    fetch("/api/get_products/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filters),
    })
      .then((res) => res.json())
      .then((data) => {
        setProdutos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filters]);

  
  const handleFilterChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.value });
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    navigate("/");
  };

  const filteredProducts = produtos.filter(produto =>
    produto.dc_produto.toLowerCase().includes(search.toLowerCase())
  );

  const handleSliderChange = (event, newValue) => {
    setFilters({
      valorMin: newValue[0],
      valorMax: newValue[1],
    });
  };

  const paginatedProducts = filteredProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <Box sx={{ display: "flex", backgroundColor: "#ccc", height: "100vh", width: "100vw" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: "10vw",
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: "10", backgroundImage: "linear-gradient(45deg, #0C2051,#2EAAE9)", },
        }}
      >
        <Toolbar >
          <Typography variant="h6">
            <Box
              component="img"
              src="logoClothes.png"
              alt="logo"
              sx={{ width: 180, height: "auto", marginLeft: "none" }}
            />
          </Typography>
        </Toolbar>
        <AppBar position="static" sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
          <Button edge="start" color="inherit" onClick={() => navigate("/products")} sx={{ backgroundColor: "none", boxShadow: "none", "&:hover": { backgroundColor: "none" } }}>
            <DashboardIcon />Dashboard
          </Button>
        </AppBar>
        <Button edge="start" color="inherit" onClick={() => navigate("/")} sx={{ backgroundColor: "none", color: "#ddd", marginTop: "84vh", "&:hover": { backgroundColor: "none" } }}>
          <ExitToAppIcon /> Sair
        </Button>
      </Drawer>

      <Box sx={{ width: "70vw", ml: "10vw", mt: 2 }}>
        <TextField
          placeholder="Buscar..."
          variant="outlined"
          fullWidth
          value={search}
          onChange={handleSearchChange}
          sx={{
            width: "25vw", marginTop: "2vh", marginBottom: '5vh',
            backgroundColor: "#eee", borderRadius: "8px", boxShadow: 3, "&:hover": { backgroundColor: "none", border: "#001469" }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon sx={{ color: "#001469" }} />
              </InputAdornment>
            ),
          }}
        />
        <Button edge="start" color="inherit" onClick={handleMenuOpen} sx={{ backgroundColor: "none", boxShadow: "none", width: '1vw', marginLeft:'-2vw', "&:hover": { backgroundColor: "none" } }}>
          <AccountCircle sx={{ height: '4vh', width: '4vw', marginLeft: "80vw", marginTop: '4vh', backgroundColor: "none", color: "#001469", "&:hover": { backgroundColor: "none", boxShadow: "none" } }} />
          <Typography variant="h6" sx={{ color: "#001469", marginTop: "4vh", backgroundColor: "none", boxShadow: "none", "&:hover": { backgroundColor: "none", boxShadow: "none" } }}>
          {username ? `${username}` : "Olá, Usuário!"}
        </Typography>
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          sx={{ marginLeft: "40vw", marginTop: "2vh", backgroundColor: "none" }}
        >
          <MenuItem onClick={handleMenuClose} sx={{ backgroundColor: "none", boxShadow: "none", color: "#001469", "&:hover": { backgroundColor: "none", boxShadow: "none" } }}>Sair </MenuItem>
        </Menu>

        <Paper sx={{ width: "70vw", p: 2, display: 'flex', marginBottom: "1vh", boxShadow: 3, backgroundColor: "#eee", borderRadius: "8px" }}>
          <TuneIcon sx={{ color: "#001469", marginRight: "1vw" }}>Filtros</TuneIcon>
          <Typography sx={{ color: "#001469", fontWeight: "bold" }}>Filtros</Typography>
          <Box sx={{ display: "flex", width: "40vw", backgroundColor: "#ccc", borderRadius: "8px", padding: 2, boxShadow: 3, height: '9vh', marginBottom: "1vh", marginTop: "4vh", marginLeft: "1vw", marginRight: "2vw" }}>
            <FormControl fullWidth>
              <InputLabel>Categoria</InputLabel>
              <Select
                name="categoria"
                value={filters.categoria}
                onChange={handleFilterChange}
                sx={{ width: "15vw", marginRight: "1vw" }}
                label="Categoria"
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="Biquini">Biquini</MenuItem>
                <MenuItem value="Body">Body</MenuItem>
                <MenuItem value="Calça">Calça</MenuItem>
                <MenuItem value="Camiseta">Camiseta</MenuItem>
                <MenuItem value="Camisa">Camisa</MenuItem>
                <MenuItem value="Óculos">Óculos</MenuItem>
                <MenuItem value="Sandália">Sandália</MenuItem>
                <MenuItem value="Shorts">Shorts</MenuItem>
                <MenuItem value="Sunga">Sunga</MenuItem>
                <MenuItem value="Tênis">Tênis</MenuItem>
                <MenuItem value="Vestido">Vestido</MenuItem>
                {categorias.map((categoria) => (
                  <MenuItem key={categoria.id} value={categoria.nome}>
                    {categoria.nome} sx={{ width: "20vw" }}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Gênero</InputLabel>
              <Select
                name="genero"
                value={filters.genero}
                onChange={handleFilterChange}
                sx={{ width: "15vw" }}
                label="Gênero"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="Masculino">Masculino</MenuItem>
                <MenuItem value="Feminino">Feminino</MenuItem>
                <MenuItem value="Unissex">Unissex</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", width: "40vw", backgroundColor: "#ccc", borderRadius: "8px", padding: "1vw", marginBottom: "1vh", boxShadow: 3, marginRight: "2vw", height: '9vh', marginTop: "4vh", marginLeft: "1vw" }}>
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
              <Typography sx={{ color: '#001469' }}>Mínimo: R${filters.valorMin}</Typography>
              <Typography sx={{ color: '#001469' }}>Máximo: R${filters.valorMax}</Typography>
            </Box>
            <Slider value={[filters.valorMin, filters.valorMax]} onChange={handleSliderChange} valueLabelDisplay="auto" valueLabelFormat={(value) => `R$ ${value}`} min={1} max={1000} sx={{ marginBottom: "1vh", color: '#001469' }} />
          </Box>
        </Paper>
        <TableContainer component={Paper}>
          <Table>
            <TableHead >
              <TableRow sx={{ backgroundImage: "linear-gradient(45deg,#2EAAE9, #0C2051)", color: "#ddd", "& th": { color: "inherit" } }}>
                <TableCell>ID</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Quantidade</TableCell>
                <TableCell>Valor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                paginatedProducts.map((produto) => (
                  <TableRow key={produto.id_produto}>
                    <TableCell>{produto.id_produto}</TableCell>
                    <TableCell>{produto.dc_produto}</TableCell>
                    <TableCell>{produto.qtd_produto}</TableCell>
                    <TableCell>{produto.vl_produto}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
          <Pagination count={Math.ceil(filteredProducts.length / itemsPerPage)} page={page} onChange={(e, value) => setPage(value)} sx={{"& .MuiPaginationItem-root": {color: "#001469"},"& .MuiPaginationItem-previousNext": {backgroundColor: "#001469",color:"#ddd","&:hover": {backgroundColor: "#003399"}
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ProductGrid;
