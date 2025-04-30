import { useState } from "react";
import {Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, IconButton, List, ListItem, ListItemText,} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

const produtosMock = [
  { id: 1, nome: "Produto A", valor: 35.9 },
  { id: 2, nome: "Produto B", valor: 89.9 },
  { id: 3, nome: "Produto C", valor: 129.9 },
  { id: 4, nome: "Produto D", valor: 59.9 },
];

export default function Order() {
  const [modoVendaAtivo, setModoVendaAtivo] = useState(false);
  const [cart, setCart] = useState([]);
  const [resumoAberto, setResumoAberto] = useState(false);
  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false);

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

  const alterarQuantidade = (id, delta) => {
    setCart((prev) =>
      prev
        .map((p) =>
          p.id === id ? { ...p, quantidade: Math.max(1, p.quantidade + delta) } : p
        )
    );
  };

  const valorTotal = cart.reduce(
    (total, item) => total + item.quantidade * item.valor,
    0
  );

  const finalizarPedido = () => {
    console.log("Pedido finalizado:", cart);
    fecharConfirmacao();
    setCart([]);
    setModoVendaAtivo(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h5">Área de Vendas</Typography>

      {!modoVendaAtivo ? (
        <Button
          variant="contained"
          color="primary"
          onClick={iniciarVenda}
          style={{ marginTop: 20 }}
        >
          Nova Venda
        </Button>
      ) : (
        <Button
          variant="contained"
          color="secondary"
          onClick={abrirResumo}
          style={{ marginTop: 20 }}
        >
          Finalizar Pré-venda
        </Button>
      )}

      {modoVendaAtivo && (
        <div style={{ marginTop: 30 }}>
          {produtosMock.map((produto) => (
            <div
              key={produto.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <span>
                {produto.nome} - R$ {produto.valor}
              </span>
              <Button
                variant="contained"
                onClick={() => adicionarProduto(produto)}
              >
                Inserir
              </Button>
            </div>
          ))}
        </div>
      )}

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
    </div>
  );
}
// Order.jsx
// export const createOrder = async () => {
//     try {
//       const response = await fetch("/api/order", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           // dados da venda, se precisar
//         }),
//       });
  
//       if (!response.ok) throw new Error("Erro ao criar pedido");
  
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error("Erro na criação do pedido:", error);
//       throw error;
//     }
//   };
  