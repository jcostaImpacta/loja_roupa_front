// components/UserHeader.jsx
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import PropTypes from "prop-types";



export default function UserHeader({ user, anchorEl, handleMenuOpen, handleMenuClose, handleLogout }) {
  return (
    <Box>
      <Button edge="end" color="inherit" onClick={handleMenuOpen} sx={{ padding: 0, minWidth: 0, width: "auto", height: "auto", backgroundColor: "transparent", boxShadow: "none", "&:hover": { backgroundColor: "transparent", boxShadow: "none"}}}>
        <AccountCircle sx={{ height: "4vh", width: "4vw", color: "#001469", backgroundColor: "transparent", "&:hover": { backgroundColor: "transparent" }}}/>
        <Typography sx={{ color: "#001469", fontWeight: "bold" }}>
          {user.descricao}
        </Typography>
      </Button>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}anchorOrigin={{ vertical: "bottom", horizontal: "right"}} transformOrigin={{vertical: "top", horizontal: "right"}}>
        <MenuItem OnClick={handleLogout} x={{ backgroundColor: "none",boxShadow: "none", color: "#001469", "&:hover": { backgroundColor: "none", boxShadow: "none"}}}>Sair </MenuItem>
      </Menu>
    </Box>
  );
}
UserHeader.propTypes = {
    user: PropTypes.shape({
      descricao: PropTypes.string.isRequired,
    }).isRequired,
    anchorEl: PropTypes.any,
    handleMenuOpen: PropTypes.func.isRequired,
    handleMenuClose: PropTypes.func.isRequired,
    handleLogout: PropTypes.func.isRequired,
  };