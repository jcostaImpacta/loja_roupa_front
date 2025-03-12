import React, { useState, useEffect } from "react";
import { Drawer, AppBar, Toolbar, IconButton, Typography,Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({ categoria: "", publico: "", genero: "", colecao: "" });

  useEffect(() => {
    fetch("/api/get_products/")
      .then((res) => res.json())
      .then((data) => {
        setProdutos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleFiltroChange = (event) => {
    setFiltros({ ...filtros, [event.target.name]: event.target.value });
  };

  return (
    <div sx={{ width: 100 }}>
       <AppBar position="static">
         <Toolbar>
           <IconButton edge="start" color="inherit" onClick={() => setOpen(true)} sx={{ width: 48, height: 48 }}>
            <MenuIcon />
           </IconButton>
           <Typography variant="h6">Loja</Typography>
         </Toolbar>
       </AppBar>

        <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
         <Typography variant="h6" sx={{ p: 2 }}>Menu</Typography>
       </Drawer>

       <Paper sx={{ p: 2, mb: 2 }}>
        <FormControl sx={{ minWidth: 120, mr: 2 }}>
          <InputLabel>Categoria</InputLabel>
          <Select name="categoria" value={filtros.categoria} onChange={handleFiltroChange}>
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="Roupas">Roupas</MenuItem>
            <MenuItem value="Acessórios">Acessórios</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120, mr: 2 }}>
          <InputLabel>Público</InputLabel>
          <Select name="publico" value={filtros.publico} onChange={handleFiltroChange}>
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="Adulto">Adulto</MenuItem>
            <MenuItem value="Infantil">Infantil</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120, mr: 2 }}>
          <InputLabel>Gênero</InputLabel>
          <Select name="genero" value={filtros.genero} onChange={handleFiltroChange}>
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="Masculino">Masculino</MenuItem>
            <MenuItem value="Feminino">Feminino</MenuItem>
            <MenuItem value="Unissex">Unissex</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Coleção</InputLabel>
          <Select name="colecao" value={filtros.colecao} onChange={handleFiltroChange}>
            <MenuItem value="">Todas</MenuItem>
            <MenuItem value="Verão">Verão</MenuItem>
            <MenuItem value="Inverno">Inverno</MenuItem>
          </Select>
        </FormControl>
      </Paper>


       <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Descrição</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Público</TableCell>
              <TableCell>Gênero</TableCell>
              <TableCell>Coleção</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Quantidade</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              produtos.map((produto) => (
                <TableRow key={produto.id_produto}>
                  <TableCell>{produto.dc_produto}</TableCell>
                  <TableCell>{produto.tp_categoria}</TableCell>
                  <TableCell>{produto.tp_publico}</TableCell>
                  <TableCell>{produto.tp_genero}</TableCell>
                  <TableCell>{produto.tp_colecao}</TableCell>
                  <TableCell>{produto.vl_produto}</TableCell>
                  <TableCell>{produto.qtd_produto}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Dashboard;
