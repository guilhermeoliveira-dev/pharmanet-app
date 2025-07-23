import React, { useState } from 'react';
import { IconButton, Collapse, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import imagemErro from '../img/imagem-erro.png';

const ProductDropdown = ({ product }) => {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <IconButton onClick={() => setOpen(!open)}>
                {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
            <Collapse in={open}>
                <Typography variant="body2" color="white">
                    <strong>Descrição:</strong> {product.descricao}
                </Typography>
                <Typography variant="body2" color="white">
                    <strong>Tarja:</strong> {product.nomeTarja}
                </Typography>
                <Typography variant="body2" color="white">
                    <strong>Peso:</strong> {product.peso}
                </Typography>
                <img src={product.imagem != null ? product.imagem : imagemErro} alt={product.nome } style={{ width: '100px', height: '100px' }} />
            </Collapse>
        </div>
    );
};

export default ProductDropdown;