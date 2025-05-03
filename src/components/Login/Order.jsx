import { useState } from "react";
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

const produtosMock = [
  { id: 1, nome: "Produto A", valor: 35.9 },
  { id: 2, nome: "Produto B", valor: 89.9 },
  { id: 3, nome: "Produto C", valor: 129.9 },
  { id: 4, nome: "Produto D", valor: 59.9 },
  { id: 5, nome: "Produto E", valor: 45.9 },
  { id: 6, nome: "Produto F", valor: 99.9 },
  { id: 7, nome: "Produto G", valor: 79.9 },
  { id: 8, nome: "Produto H", valor: 39.9 },
  { id: 9, nome: "Produto I", valor: 49.9 },
  { id: 10, nome: "Produto J", valor: 69.9 },
  { id: 11, nome: "Produto K", valor: 89.9 },
  { id: 12, nome: "Produto L", valor: 109.9 },
  { id: 13, nome: "Produto M", valor: 129.9 },
  { id: 14, nome: "Produto N", valor: 149.9 },
  { id: 15, nome: "Produto O", valor: 169.9 },
  { id: 16, nome: "Produto P", valor: 189.9 },
  { id: 17, nome: "Produto Q", valor: 199.9 },
  { id: 18, nome: "Produto R", valor: 219.9 },
  { id: 19, nome: "Produto S", valor: 239.9 },
  { id: 20, nome: "Produto T", valor: 259.9 },
];

export default function Order() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [modoVendaAtivo, setModoVendaAtivo] = useState(true);
  const [cart, setCart] = useState([]);
  const [resumoAberto, setResumoAberto] = useState(false);
  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [produtos] = useState(produtosMock)
  const [pedidoSucesso, setPedidoSucesso] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10
  
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
  // const iniciarVenda = () => setModoVendaAtivo(true);

  const abrirResumo = () => setResumoAberto(true);
  const fecharResumo = () => setResumoAberto(false);

  const abrirConfirmacao = () => {
    setResumoAberto(false);
    setConfirmacaoAberta(true);
  };
  const fecharConfirmacao = () => setConfirmacaoAberta(false);
  const adicionarProduto = (produto) => {
    const existente = cart.find((p) => p.id === produto.id);
    if (existente) {
      setCart((prev) =>
        prev.map((p) =>
          p.id === produto.id ? { ...p, quantidade: p.quantidade + 1 } : p
        )
      );
    } else {
      setCart([...cart, { ...produto, quantidade: 1 }]);
    }
  };
  const fetchOrder = async () => {
    try {
      const response = await fetch("/api/new_order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
      });
      const orderData = await response.json();
      localStorage.setItem("order", JSON.stringify(orderData));
      navigate("/new_order");
    } catch (error) {
      console.error("Erro ao iniciar nova venda:", error);
    }
  };
  const alterarQuantidade = (id, delta) => {
    setCart((prev) =>
      prev
        .map((p) =>
          p.id === id ? { ...p, quantidade: Math.max(1, p.quantidade + delta) } : p
        )
    );
  };

  const valorTotal = cart.reduce((total, item) => total + item.quantidade * item.valor, 0);

  const finalizarPedido = () => {
    fecharConfirmacao();
    setCart([]);
    setModoVendaAtivo(true);
    setPedidoSucesso(true);
  };
  const novaData = new Date();
  const dataFormatada = novaData.toLocaleDateString("pt-BR");

  const produtosFiltrados = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    // Container central
    <Box sx={{ display: "flex", backgroundColor: "#ccc", height: "100vh", width: "100vw"}}>
      {/* Sidebar esquerda */}
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
            <Badge badgeContent={cart.reduce((sum, item) => sum + item.quantidade, 0)} color="primary" sx={{borderRadius:"100%", "& .MuiBadge-dot": { backgroundColor: "#001469" } }}>
              <Box component="img" src="caixa-azul.png" alt="Resumo do pedido" sx={{ maxHeight:"30px", maxWidth:"30px" }} />
            </Badge>
          </IconButton>

          <Button edge="end" color="inherit" onClick={handleMenuOpen} sx={{padding: 0,minWidth: 0, width: 'auto', height: 'auto', backgroundColor: "none", boxShadow: "none","&:hover": { backgroundColor: "none", boxShadow: "none" },}}>
              <AccountCircle sx={{maxHeight:"34px", maxWidth:"34px", color: "#001469", marginRight:"1vw",backgroundColor: "none", "&:hover": { backgroundColor: "none" }}}/>
              <Typography sx={{ color: "#001469", fontWeight: "bold", paddingRight:"1vw" }}>{user.descricao}</Typography>
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} transformOrigin={{vertical: 'top', horizontal: 'right',}}>
              <MenuItem onClick={handleLogout} sx={{backgroundColor: "none",boxShadow: "none", color: "#001469", "&:hover": { backgroundColor: "none", boxShadow: "none" }}}> Sair</MenuItem>
            </Menu>
          </Box>
              
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "initial", marginTop: 2, backgroundColor: "#eee", padding: 2, borderRadius: 2, boxShadow: 3 }}>
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
                                <TableCell>{produto.nome}</TableCell>
                                <TableCell align="center">R$ {produto.valor.toFixed(2)}</TableCell>
                                <TableCell align="center">
                                  <Button onClick={() => adicionarProduto(produto)} sx={{backgroundColor:"#003399", color:"#ccc", fontWeight:"bold", textTransform:"capitalize", maxWidth:"150px", ":hover": { backgroundColor: "#001469" }}}>Adicionar</Button>
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
                    <Pagination count={Math.ceil(produtosMock.length / itemsPerPage)} page={page} onChange={(e, value) => setPage(value)} sx={{
                            "& .MuiPaginationItem-root": { color: "#001469" },
                            "& .MuiPaginationItem-previousNext": { backgroundColor: "#001469", color: "#ddd", "&:hover": { backgroundColor: "#003399" } }
                          }} />
                </Box>
        </Box>
            {/* Modal de Resumo */}
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
                              <Typography sx={{marginLeft:"5px", marginRight:"5px"}}>{item.quantidade}</Typography>
                              <IconButton onClick={() => alterarQuantidade(item.id, 1)}sx={{backgroundColor:"primary.main", color:"#fff", maxHeight:"30px", maxWidth:"30px",":hover": { backgroundColor: "#003399" }}}>
                                <Add />
                              </IconButton>
                          </Box>
                          </>
                        }>
                          <ListItemText primary={item.nome} secondary={`R$ ${item.valor} cada`}/>
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

            {/* Modal de Confirmação */}
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
              
              {/* Modal de Sucesso */}
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
                    <Button variant="contained" autoFocus color="primary" onClick={() => setPedidoSucesso(false)}>Ok</Button>
                  </DialogActions>
                </Box>
              </Dialog>
          </Box>
    </Box>
  );
}