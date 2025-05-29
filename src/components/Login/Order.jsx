import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {AppBar, Badge,Box, Button, Dialog,DialogTitle, DialogContent, DialogContentText,DialogActions, Drawer, MenuItem,Toolbar,Typography, IconButton, List, ListItem, ListItemText, Table, TableBody, TableCell, TableHead, TableContainer, TableRow, TextField} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircle from '@mui/icons-material/AccountCircle';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import Pagination from '@mui/material/Pagination';
import Menu from '@mui/material/Menu';
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded';
import './Order.css';

export default function Order() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [modoVendaAtivo, setModoVendaAtivo] = useState(true);
  const [cart, setCart] = useState([]);
  const [orderResult, setOrderResult] = useState([]);
  const [resumoAberto, setResumoAberto] = useState(false);
  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [pedidoSucesso, setPedidoSucesso] = useState(false);
  const [search, setSearch] = useState("");
  const [filters] = useState({});
  const [page, setPage] = useState(1);
  const itemsPerPage = 10

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    fetch("/api/get_products/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filters),
    }).then((res) => {
      if (!res.ok) {
        throw new Error(`Erro na API: ${res.status}`);
      }
      return res.json();
    }).then((produtosData) => {
      setProdutos(produtosData);
    })
      .catch((error) => console.error("Erro nas requisições:", error))
      .finally(() => setLoading(false));
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
  const abrirResumo = () => setResumoAberto(true);
  const fecharResumo = () => setResumoAberto(false);
  const abrirConfirmacao = () => {
    setResumoAberto(false);
    setConfirmacaoAberta(true);
  };
  const fecharConfirmacao = () => setConfirmacaoAberta(false);
  const adicionarProduto = (produto) => {
  const produtoExistente = cart.find((p) => p.id_produto === produto.id_produto);
  const quantidadeNoCarrinho = produtoExistente ? produtoExistente.qtd_total : 0;

  if (quantidadeNoCarrinho >= produto.qtd_total) {
    return;
  }

  if (produtoExistente) {
    setCart((prev) =>
      prev.map((p) =>
        p.id_produto === produto.id_produto
          ? { ...p, qtd_total: p.qtd_total + 1 }
          : p
      )
    );
  } else {
    setCart([...cart, { ...produto, qtd_total: 1 }]);
  }
};

  const fetchOrder = async () => {
    navigate("/new_order");
  };

  const alterarQuantidade = (id, delta) => {
      setCart((prev) =>
        prev.map((p) => {
          if (p.id_produto_ === id) {
            const novaQuantidade = p.qtd_total + delta;
            if (novaQuantidade < 1) return { ...p, qtd_total: 1 }; 
            if (novaQuantidade > p.qtd_total) return p; 
            return { ...p, qtd_total: novaQuantidade };
          }
          return p;
        })
      );
    };

  const valorTotal = cart.reduce((total, item) => total + item.qtd_total * item.vl_produto, 0);
  const quantidadeTotal = cart.reduce((sum, item) => sum + item.qtd_total, 0)
  const isAdicionarDesabilitado = (produto) => {
    const itemNoCarrinho = cart.find((item) => item.id === produto.id);
    const quantidadeNoCarrinho = itemNoCarrinho ? itemNoCarrinho.qtd_total : 0;
    return produto.qtd_total <= quantidadeNoCarrinho;
    };
  const finalizarPedido = () => {
    fecharConfirmacao();
    let orderData = {"cd_usuario": user.codigo, "vl_total_ordem": valorTotal ,"qtd_total_produto": quantidadeTotal, "lista_produtos": cart}

    fetch("/api/new_order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData)
      }).then((res) => {
        if (!res.ok) {
          throw new Error(`Erro na API: ${res.status}`);
        }
        return res.json();
      }).then((orderResult) => {
        setCart([]);
        setModoVendaAtivo(true);
        setPedidoSucesso(true);
        setOrderResult(orderResult);
      })
        .catch((error) => console.error("Erro nas requisições:", error))
        .finally(() => setLoading(false));
  };
  const fetchReturn = () => {
    fetchData();
    setModoVendaAtivo(false);
    setResumoAberto(false);
    setPedidoSucesso(false);
    setCart([]);
    navigate("/products");
  }
  const dataFormatada = orderResult?.dt_ordem ? new Date(orderResult.dt_ordem).toLocaleString("pt-BR").slice(0, 17) : "";
  const produtosFiltrados = produtos.filter(produto =>
    produto.dc_produto.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <Box sx={{ display: "flex", backgroundColor: "#ccc", height: "100vh", width: "100vw"}}>
      <Drawer variant="permanent" sx={{ width: "10vw", flexShrink: 0, minHeight:"80vh", "& .MuiDrawer-paper": { width: "15vw", minHeight:"20vh", backgroundImage: "linear-gradient(45deg, #0C2051,#2EAAE9)", }, }}>
              <Toolbar sx={{display: "flex", alignItems: "center", justifyContent: "center", textAlign:"center"}}>
                <Typography variant="h6">
                <Box component="img" src="logoClothes.png" alt="logo" sx={{ width: "12vw", height: "auto", textAlign:"center" }} />
                </Typography>
              </Toolbar>
              <AppBar position="static" sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
                <Button edge="start" color="inherit" onClick={() => navigate("/products")} sx={{ backgroundColor: "none", boxShadow: "none", "&:hover": { backgroundColor: "none" } }}>
                  <DashboardIcon/>Produtos
                </Button>
              </AppBar>
              <AppBar position="static" sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
                <Button onClick={fetchOrder} edge="start" color="inherit" sx={{color:"white", backgroundColor: "none", boxShadow: "none", "&:hover": { backgroundColor: "none" }}}>
                  <Box component="img" src="caixa.png" alt="caixa aberta" sx={{height: "24px", textAlign:"center", marginRight:"3px"}}/>Nova Venda
                </Button>
              </AppBar>
              <AppBar position="static" sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
                <Button edge="start" color="inherit" onClick={() => navigate("/")} sx={{ backgroundColor: "none", boxShadow:"none","&:hover": { backgroundColor: "none" } }}>
                  <ExitToAppIcon/> Sair
                </Button>
              </AppBar>
      </Drawer>
      <Box sx={{ display:"flex",width:"90vw",flexGrow: 1, p: 3, backgroundColor: "#ccc", minHeight:"100vh", color:"#001469"}}>
        <Box sx={{ margin: "0 auto", padding: 2, width: "100%", maxWidth: "60vw" }}>
          <Box sx={{ display: "flex", justifyContent: "end", mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "self-start", marginRight:"38vw", position:"absolute", width:"20vw"}}>
            <TextField variant="outlined" placeholder="Buscar..." sx={{width: "25vw",backgroundColor: "#eee",borderRadius: "8px",boxShadow: 3,"&:hover": { backgroundColor: "none", border: "#001469" }}} value={search} onChange={handleSearchChange} 
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon sx={{ color: "#001469" }}/>
                </InputAdornment>
              ),}}/>
          </Box>
          <IconButton onClick={abrirResumo} edge="end" color="inherit"sx={{backgroundColor: "transparent", fontWeight:"bold", textTransform:"capitalize",boxShadow: "none",width:"4vw", marginRight:"1vw","&:hover": { backgroundColor: "none", boxShadow: "none" }}}>
            <Badge badgeContent={quantidadeTotal} color="primary" sx={{borderRadius:"100%", "& .MuiBadge-dot": { backgroundColor: "#001469" } }}>
              <Box component="img" src="caixa-azul.png" alt="Resumo do pedido" sx={{ maxHeight:"30px", maxWidth:"30px" }} />
            </Badge>
          </IconButton>
          <Button edge="end" color="inherit" onClick={handleMenuOpen} sx={{padding: 0,minWidth: 0, width: 'auto', height: 'auto', backgroundColor: "transparent", boxShadow: "none","&:hover": { backgroundColor: "transparent", boxShadow: "none" },}}>
            <AccountCircle sx={{height: '4vh', width: '4vw', color: "#001469",backgroundColor: "transparent", "&:hover": { backgroundColor: "transparent" }}}/>
            <Typography sx={{ color: "#001469", fontWeight: "bold" }}>{user.descricao}</Typography>
          </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} transformOrigin={{vertical: 'top', horizontal: 'right',}}>
            <MenuItem onClick={handleLogout} sx={{backgroundColor: "none",boxShadow: "none", color: "#001469", "&:hover": { backgroundColor: "none", boxShadow: "none" }}}> Sair</MenuItem>
          </Menu>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "initial", marginTop: 2, backgroundColor: "#fff", padding: 2, borderRadius: 2, boxShadow: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", flexDirection:"row",  marginTop: 2 }}>
                <ShoppingBagRoundedIcon sx={{display:"flex",height: "30px", width:"30px", marginRight:"8px"}}/>
                <Typography variant="h5" sx={{color:"#001469", fontWeight:"bold", textAlign:"initial" }}>Área de Vendas</Typography>
              </Box>
                {modoVendaAtivo && (
                  <div style={{ marginTop: 30 }}>
                    <TableContainer sx={{  width:"55vw", borderRadius: 2 }}>
                        <Table>
                          <TableHead sx={{color:"#ccc"}}>
                            <TableRow sx={{backgroundImage: "linear-gradient(45deg, #2EAAE9,#0C2051)", color:"#ccc"}}>
                              <TableCell sx={{color:"#ccc",textTransform:"capitalize"
                              }}>Nome</TableCell>
                              <TableCell sx={{color:"#ccc",textTransform:"capitalize"
                              }} align="center">Valor</TableCell>
                              <TableCell sx={{color:"#ccc",textTransform:"capitalize"
                              }}align="center">Adicionar Item</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {produtosFiltrados.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((produto) =>  (
                              <TableRow key={produto.id}>
                                <TableCell>{produto.dc_produto}</TableCell>
                                <TableCell align="center">R$ {produto.vl_produto.toFixed(2)}</TableCell>
                                <TableCell align="center">
                                    <Button
                                    onClick={() => adicionarProduto(produto)}
                                     sx={{
                                      backgroundColor: "#001469",
                                      color: "#ccc",
                                      fontWeight: "bold",
                                      textTransform: "capitalize",
                                      maxWidth: "150px",
                                      ":hover": {
                                        backgroundColor: "#003399"
                                      },
                                      ...(isAdicionarDesabilitado(produto) && {
                                        backgroundColor: "#ccc",
                                        color: "#666",
                                        cursor: "not-allowed",
                                        ":hover": {
                                          backgroundColor: "#ccc"
                                        }
                                      })
                                    }}>
                                      Adicionar
                                    </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <Box align="center">
                        <Button variant="contained" color="primary" onClick={abrirResumo} sx={{marginTop:"20px", backgroundColor:"#003399", color:"#ccc", textTransform:"capitalize", fontWeight:"bold", maxWidth:"250px", ":hover": { backgroundColor: "#001469" }}}>Finalizar Venda</Button>
                      </Box>
                  </div>
                )}
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
            <Pagination count={Math.ceil(produtos.length / itemsPerPage)} page={page} onChange={(e, value) => setPage(value)} sx={{ "& .MuiPaginationItem-root": { color: "#001469" }, "& .MuiPaginationItem-previousNext": { backgroundColor: "#001469", color: "#ddd", "&:hover": { backgroundColor: "#003399" } }}} />
          </Box>
        </Box>
        <Dialog open={resumoAberto} onClose={fecharResumo} maxWidth="sm" fullWidth>
          <Box sx={{backgroundColor: "#ccc", padding: 2, borderRadius: 2, boxShadow: 3, color:"#001469"}}>
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection:"column", marginTop: 2 }}>
                <Box component="img" src="delivery.png" alt="logo" sx={{ width: "8vw", height: "auto", textAlign:"center" }} />
              </Box>
                <DialogTitle sx={{textAlign:"center", fontWeight:"bold"}}>Resumo do Pedido</DialogTitle>
                <DialogContent>
                  {cart.length === 0 ? (
                    <DialogContentText sx={{textAlign:"center", fontSize:"1.2rem"}}>Nenhum item no carrinho.</DialogContentText>
                  ) : (
                    <List>
                      {cart.map((item) => (
                        <ListItem key={item.id} secondaryAction={
                          <>
                          <Box sx={{ display: "flex", alignItems: "center", marginLeft: "-90px",borderRadius: 1, backgroundColor:"#ccc"}}>
                              <IconButton onClick={() => setCart(cart.filter((p) => p.id !== item.id))} sx={{backgroundColor:"#fff", color:"#003399", maxHeight:"30px", maxWidth:"30px", marginRight:"5px",":hover": { backgroundColor: "#eee" }}}>
                                <DeleteRoundedIcon />
                              </IconButton>
                              <IconButton onClick={() => alterarQuantidade(item.id, -1)} sx={{backgroundColor:"primary.main", color:"#fff", maxHeight:"30px", maxWidth:"30px",":hover": { backgroundColor: "#003399" }}}>
                                <Remove />
                              </IconButton>
                              <Typography sx={{marginLeft:"5px", marginRight:"5px"}}>{item.qtd_total}</Typography>
                              <IconButton
                                  onClick={() => alterarQuantidade(item.id, 1)}
                                  disabled={item.qtd_total >= item.qtd_estoque}
                                  sx={{
                                    backgroundColor: "primary.main",
                                    color: "#fff",
                                    maxHeight: "30px",
                                    maxWidth: "30px",
                                    ":hover": {
                                      backgroundColor: "#003399"
                                    },
                                    ...(item.qtd_total >= item.qtd_estoque && {
                                      backgroundColor: "grey.400",
                                      color: "white",
                                    }),
                                  }}>
                                <Add />
                              </IconButton>
                          </Box>
                          </>
                        }>
                          <ListItemText primary={item.dc_produto} secondary={`R$ ${item.vl_produto} cada`}/>
                        </ListItem>
                      ))}
                    </List>
                  )}
                  <Typography variant="h6" style={{ marginTop: 10, textAlign:"center"}}>Deseja Finalizar essa Venda?</Typography>
                  <Box sx={{ display: "flex",justifyContent: "center", alignItems: "center" }}>
                    <Typography variant="h6" style={{ marginTop: 10, fontWeight:"bold" }}> Total:</Typography>
                    <Typography variant="h6" style={{ marginTop: 10, marginLeft:"5px"}}>R$ {valorTotal.toFixed(2)}</Typography>
                  </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={fecharResumo} sx={{backgroundColor:"#fff", ":hover": { backgroundColor: "#eee" }}}>Cancelar</Button>
                <Button variant="contained" color="primary" onClick={abrirConfirmacao} disabled={cart.length === 0}>Confirmar</Button>
              </DialogActions>
          </Box>
        </Dialog>
            <Dialog open={confirmacaoAberta} onClose={fecharConfirmacao}>
              <Box sx={{backgroundColor: "#ccc", padding: 2, borderRadius: 1, boxShadow: 3, color:"#001469", textAlign:"center"}}>
                <DialogTitle sx={{fontWeight:"bold"}}>Confirmação</DialogTitle>
                <DialogContent>
                  <DialogContentText> Tem certeza que deseja finalizar esta venda?</DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={fecharConfirmacao} sx={{backgroundColor:"#fff", ":hover": { backgroundColor: "#eee" }}}>Não</Button>
                <Button variant="contained" color="primary" onClick={finalizarPedido} disabled={cart.length === 0}>Sim</Button>
                </DialogActions>
              </Box>
            </Dialog>
            <Dialog open={pedidoSucesso} onClose={() => setPedidoSucesso(false)}>
                <Box sx={{backgroundColor: "#ccc", padding: 2, borderRadius: 1, boxShadow: 3, color:"#001469", textAlign:"center"}}>
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection:"column", marginTop: 2 }}>
                       <Box component="img" src="checklist.png" alt="logo" sx={{ width: "8vw", height: "auto", textAlign:"center" }} />
                    </Box>
                  <DialogTitle>Venda Realizada com Sucesso!</DialogTitle>
                  <DialogContent>
                    <DialogContentText>Vendedor: {user.descricao}</DialogContentText>
                    <DialogContentText>Venda Realizada: {dataFormatada}</DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button variant="contained" autoFocus color="primary" onClick={() => fetchReturn()}>Ok</Button>
                  </DialogActions>
                </Box>
            </Dialog>
          </Box>
    </Box>
  );
}