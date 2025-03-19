import { useState, useEffect } from "react";
import {
  AppBar, Toolbar,Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, CircularProgress, MenuItem, Select, FormControl, InputLabel, Box, TextField,
  Pagination, Button, Drawer
} from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import './Products.css';
import { useNavigate } from "react-router-dom";

const ProductGrid = () => {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ categoria: "", genero: "", valorMin: "", valorMax: "" });
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

  const filteredProducts = produtos.filter(produto =>
    produto.dc_produto.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedProducts = filteredProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: "10vw",
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: "10vw", boxSizing: "border-box", backgroundImage: "linear-gradient(45deg, #2EAAE9, #1A6083)",},
        }}
      >
        <Toolbar >
          <Typography variant="h6">
            <Box
              component="img"
              src="logoClothes.png"
              alt="logo"
              sx={{ width: 100, height: 50 }} 
            />
          </Typography>
        </Toolbar>
        <AppBar position="static">
        
        <Button edge="start" color="inherit" onClick={() => navigate("/products")} sx={{ backgroundColor: "none", color: "#001469", "&:hover": { backgroundColor: "none" } }}> <DashboardIcon />Dashboard</Button>
        </AppBar>
        <Button
            edge="start"
            color="inherit"
            onClick={() => navigate("/")} 
            sx={{ backgroundColor: "none", color: "#001469", "&:hover": { backgroundColor: "rgba()"} }}
          >
            <ExitToAppIcon /> Sair
          </Button>
      </Drawer>
      
      <Box sx={{ width: "70vw", ml: "10vw", mt: 2 }}>
      <TextField label="Buscar Produto" variant="outlined" fullWidth value={search} onChange={handleSearchChange} sx={{width:"30vw", backgroundColor: "#eee"}} />
        <Paper sx={{ width:"70vw", p: 2, display: 'flex'}}>
          
          <FormControl fullWidth>
            <InputLabel>Categoria</InputLabel>
            <Select
              name="categoria"
              value={filters.categoria}
              onChange={handleFilterChange}
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
                  {categoria.nome}
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
              label="Gênero"
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="Masculino">Masculino</MenuItem>
              <MenuItem value="Feminino">Feminino</MenuItem>
              <MenuItem value="Unissex">Unissex</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Valor Mínimo" type="number" name="valorMin" value={filters.valorMin} onChange={handleFilterChange} />
          <TextField label="Valor Máximo" type="number" name="valorMax" value={filters.valorMax} onChange={handleFilterChange} />
        </Paper>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
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
        <Pagination count={Math.ceil(filteredProducts.length / itemsPerPage)} page={page} onChange={(e, value) => setPage(value)} sx={{ mt: 2 }} />
      </Box>
    </Box>
  );
};

export default ProductGrid;
