import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {AppBar, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Drawer, MenuItem,Toolbar,Typography, IconButton, List, ListItem, ListItemText,} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import './Order.css';

const produtosMock = [
  { id: 1, nome: "Produto A", valor: 35.9 },
  { id: 2, nome: "Produto B", valor: 89.9 },
  { id: 3, nome: "Produto C", valor: 129.9 },
  { id: 4, nome: "Produto D", valor: 59.9 },
];

export default function Order() {
  const navigate = useNavigate();
  const [modoVendaAtivo, setModoVendaAtivo] = useState(false);
  const [cart, setCart] = useState([]);
  const [resumoAberto, setResumoAberto] = useState(false);
  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const [anchorEl, setAnchorEl] = useState(null);

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
  const iniciarVenda = () => setModoVendaAtivo(true);

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
    console.log("Pedido finalizado:", cart);
    fecharConfirmacao();
    setCart([]);
    setModoVendaAtivo(false);
  };

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
          <Box sx={{ display: "flex", justifyContent: "end", alignItems: "center", mb: 3 }}>
          
          <Button edge="end" color="inherit" onClick={handleMenuOpen} sx={{padding: 0,minWidth: 0, width: 'auto', height: 'auto', backgroundColor: "transparent", boxShadow: "none","&:hover": { backgroundColor: "transparent", boxShadow: "none" },}}>
              <AccountCircle sx={{height: '4vh', width: '4vw', color: "#001469",backgroundColor: "transparent", "&:hover": { backgroundColor: "transparent" }}}/>
              <Typography sx={{ color: "#001469", fontWeight: "bold" }}>{user.descricao}</Typography>
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} transformOrigin={{vertical: 'top', horizontal: 'right',}}>
              <MenuItem onClick={handleLogout} sx={{backgroundColor: "none",boxShadow: "none", color: "#001469", "&:hover": { backgroundColor: "none", boxShadow: "none" }}}> Sair</MenuItem>
            </Menu>
          </Box>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 2, backgroundColor: "#eee", padding: 2, borderRadius: 2, boxShadow: 3 }}>
              <Typography variant="h5" sx={{color:"#001469", fontWeight:"bold", }}>Área de Vendas</Typography>
                {modoVendaAtivo && (
                  <div style={{ marginTop: 30 }}>
                    {produtosMock.map((produto) => (
                      <div key={produto.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10,}}>
                        <span>{produto.nome} - R$ {produto.valor}</span>
                        <Button variant="contained" onClick={() => adicionarProduto(produto)}>Inserir</Button>
                      </div>
                    ))}
                  </div>
                )}
                {!modoVendaAtivo ? (
                  <Button variant="contained" onClick={iniciarVenda} sx={{marginTop:"20px", backgroundColor: "#001469", color:"#ccc", textTransform:"capitalize", fontWeight:"bold", maxWidth:"20vw", ":hover": { backgroundColor: "#003399" }}}>Nova Venda</Button>
                ) : (
                  <Button variant="contained" onClick={abrirResumo} sx={{marginTop:"20px", backgroundColor:"#001469", color:"#ccc", textTransform:"capitalize", fontWeight:"bold", maxWidth:"20vw", ":hover": { backgroundColor: "#003399" }}}>Finalizar Pré-venda</Button>
                )}
              </Box>
        </Box>
            {/* Modal de Resumo */}
            <Dialog open={resumoAberto} onClose={fecharResumo} maxWidth="sm" fullWidth>
              <DialogTitle>Resumo do Pedido</DialogTitle>
              <DialogContent>
                {cart.length === 0 ? (
                  <Typography>Nenhum item no carrinho.</Typography>
                ) : (
                  <List>
                    {cart.map((item) => (
                      <ListItem key={item.id} secondaryAction={
                        <>
                          <IconButton onClick={() => alterarQuantidade(item.id, -1)}>
                            <Remove />
                          </IconButton>
                          <Typography>{item.quantidade}</Typography>
                          <IconButton onClick={() => alterarQuantidade(item.id, 1)}>
                            <Add />
                          </IconButton>
                        </>
                      }>
                        <ListItemText
                          primary={item.nome}
                          secondary={`R$ ${item.valor} cada`}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
                <Typography variant="h6" style={{ marginTop: 10 }}>
                  Total: R$ {valorTotal.toFixed(2)}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={fecharResumo}>Cancelar</Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={abrirConfirmacao}
                  disabled={cart.length === 0}
                >
                  Finalizar Venda
                </Button>
              </DialogActions>
            </Dialog>

            {/* Modal de Confirmação */}
            <Dialog open={confirmacaoAberta} onClose={fecharConfirmacao}>
              <DialogTitle>Confirmar Venda</DialogTitle>
              <DialogContent>
                <Typography>
                  Tem certeza que deseja finalizar esta venda?
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={fecharConfirmacao}>Cancelar</Button>
                <Button variant="contained" color="success" onClick={finalizarPedido}>
                  Confirmar
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
    </Box>
  );
}