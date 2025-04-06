import { useState, useEffect } from "react";
import {
  AppBar, Toolbar, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, CircularProgress, MenuItem, Menu, Select, FormControl, InputLabel, Box, TextField,
  Pagination, Button, Drawer, InputAdornment, Slider
} from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PaidIcon from '@mui/icons-material/Paid';
import TuneIcon from '@mui/icons-material/Tune';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import './Products.css';
import { useNavigate } from "react-router-dom";

const ProductGrid = () => {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [publicos, setPublicos] = useState([]);
  const [colecoes, setColecoes] = useState([]);
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [filters, setFilters] = useState({valorMin: 1, valorMax: 300 });
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = () => {
    setLoading(true);
    
    Promise.all([

      fetch("/api/get_products/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      }).then((res) => {
        if (!res.ok) {
          throw new Error(`Erro na API: ${res.status}`);
        }
        return res.json();
      }),
      fetch("/api/list/categoria/").then((res) => res.json()),
      fetch("/api/list/genero/").then((res) => res.json()),
      fetch("/api/list/publico/").then((res) => res.json()),
      fetch("/api/list/colecao/").then((res) => res.json()),
    ])
      .then(([produtosData, categoriasData, generosData, publicosData, colecoesData]) => {
        setProdutos(produtosData);
        setCategorias(categoriasData);
        setGeneros(generosData);
        setPublicos(publicosData);
        setColecoes(colecoesData);
      })
      .catch((error) => console.error("Erro nas requisições:", error))
      .finally(() => setLoading(false));
  };
    
  const handleClick = () =>{
    fetchData();
  }
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
  };
  
  const handleLogout = () => {
    setAnchorEl(null);
    navigate("/");
  };

const handleSliderChange = (event, newValue) => {
  setFilters({
    ...filters,
    valorMin: newValue[0],
    valorMax: newValue[1],
  });
};

  const searchValue = search || ""; 

  const filteredProducts = produtos.filter(produto => {
    return (
      (produto.dc_produto || "").toLowerCase().includes(searchValue.toLowerCase())
    )
  });
  
const paginatedProducts = filteredProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <Box sx={{ display: "flex", backgroundColor: "#ccc", height: "100vh", width: "100vw" }}>
      <Drawer variant="permanent" sx={{width: "10vw",flexShrink: 0,"& .MuiDrawer-paper": { width: "10", backgroundImage: "linear-gradient(45deg, #0C2051,#2EAAE9)", },}}>
        <Toolbar >
          <Typography variant="h6">
            <Box component="img" src="logoClothes.png" alt="logo" sx={{ width: 180, height: "auto", marginLeft: "none" }}/>
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
        <TextField placeholder="Buscar..." variant="outlined" fullWidth value={search} onChange={handleSearchChange} sx={{width: "25vw", marginTop: "1vh", marginBottom: '3vh',backgroundColor: "#eee", borderRadius: "8px", boxShadow: 3, "&:hover": { backgroundColor: "none", border: "#001469" }
          }} InputProps={{ endAdornment: (
              <InputAdornment position="end">
                <SearchIcon sx={{ color: "#001469" }} />
              </InputAdornment>),}}/>
        <Button edge="start" color="inherit" onClick={handleMenuOpen} sx={{ backgroundColor: "none", boxShadow: "none", width: '1vw', marginLeft:'-2vw', "&:hover": { backgroundColor: "none" } }}>
          <AccountCircle sx={{ height: '4vh', width: '4vw', marginLeft: "80vw", marginTop: '4vh', backgroundColor: "none", color: "#001469", "&:hover": { backgroundColor: "none", boxShadow: "none" } }} />
          <Typography variant="h6" sx={{ color: "#001469", marginTop: "4vh", backgroundColor: "none", boxShadow: "none", "&:hover": { backgroundColor: "none", boxShadow: "none" } }}>
        </Typography>
        </Button>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} sx={{ marginLeft: "40vw", marginTop: "2vh", backgroundColor: "none" }}>
          <MenuItem onClick={handleLogout} sx={{ backgroundColor: "none", boxShadow: "none", color: "#001469", "&:hover": { backgroundColor: "none", boxShadow: "none" } }}>Sair </MenuItem>
        </Menu>
        <Paper sx={{ width: "70vw", p: 2, mb: "2vh", boxShadow: 3, backgroundColor: "#eee",borderRadius: "8px",}}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2, width: "55%"}}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TuneIcon sx={{ color: "#001469", mr: 1 }} />
          <Typography sx={{ color: "#001469", fontWeight: "bold" }}>Filtros</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "", mr: "-35%" }}>
          <PaidIcon sx={{ color: "#001469", mr: 1 }} />
          <Typography sx={{ color: "#001469", fontSize: 16, fontWeight: "bold" }}>Preço</Typography>
        </Box>
        </Box>
         <Box sx={{display: "flex",alignItems: "center",gap: 2,flexWrap: "wrap",mb: 2,}}>

            <FormControl sx={{ minWidth: "10vw" }}>
              <InputLabel>Categoria</InputLabel>
              <Select name="categoria" value={filters.categoria} onChange={handleFilterChange}label="Categoria">
              <MenuItem>Todas</MenuItem>
                {categorias.map((categoria) => (
                <MenuItem key={categoria.dc_categoria} value={categoria.id_categoria}> {categoria.dc_categoria}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: "10vw" }}>
              <InputLabel>Gênero</InputLabel>
              <Select name="genero" value={filters.genero} onChange={handleFilterChange}label="Gênero">
                <MenuItem>Todos</MenuItem>
                {generos.map((genero) => (
                <MenuItem key={genero.dc_genero} value={genero.id_genero}> {genero.dc_genero}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{}}>
              <FormControl sx={{ minWidth: "10vw" }}>
                <InputLabel>Público</InputLabel>
                <Select name="publico" value={filters.publico} onChange={handleFilterChange}label="Público">
                  <MenuItem>Todos</MenuItem>
                  {publicos.map((publico) => (
                <MenuItem key={publico.dc_publico} value={publico.id_publico}> {publico.dc_publico}</MenuItem>
                ))}
                </Select>
              </FormControl>
            </FormControl>
            <FormControl sx={{}}>
              <FormControl sx={{ minWidth: "10vw" }}>
                <InputLabel>Coleção</InputLabel>
                <Select name="colecao" value={filters.colecao} onChange={handleFilterChange}label="Coleção">
                  <MenuItem>Todas</MenuItem>
                  {colecoes.map((colecao) => (
                <MenuItem key={colecao.dc_colecao} value={colecao.id_colecao}> {colecao.dc_colecao}</MenuItem>
                ))}
                </Select>
              </FormControl>
            </FormControl>
            
            <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1}}>
              <Typography sx={{ color: "#001469", mr: 1, fontSize:16}}> R${filters.valorMin}</Typography>
              <Slider value={[filters.valorMin, filters.valorMax]} onChange={handleSliderChange} valueLabelDisplay="auto" valueLabelFormat={(value) => `R$ ${value}`} min={1} max={300} sx={{ color: "#001469", flexGrow: 1, mx: 2 }}/>
              <Typography sx={{ color: "#001469", ml: 1 }}>R${filters.valorMax}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", width: "16%", justifyContent: "flex-end", mx: "83%" }}>  
            <Button variant="contained" onClick={handleClick} sx={{ backgroundColor: "#001469", color: "#ccc",textTransform:"capitalize", fontWeight:"bold",":hover": {backgroundColor: "#003399"}}}>Aplicar Filtros</Button>
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
                  <TableCell colSpan={4} align="center"><CircularProgress /></TableCell>
                </TableRow>
              ) : (
                paginatedProducts.map((produto) => (
                  <TableRow key={produto.id_produto}>
                    <TableCell>{produto.id_produto}</TableCell>
                    <TableCell>{produto.dc_produto}</TableCell>
                    <TableCell>{produto.qtd_produto}</TableCell>
                    <TableCell>{produto.vl_produto}</TableCell>
                  </TableRow>))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt:1}}>
          <Pagination count={Math.ceil(filteredProducts.length / itemsPerPage)} page={page} onChange={(e, value) => setPage(value)} sx={{"& .MuiPaginationItem-root": {color: "#001469"},"& .MuiPaginationItem-previousNext": {backgroundColor: "#001469",color:"#ddd","&:hover": {backgroundColor: "#003399"}},}}/>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductGrid;
