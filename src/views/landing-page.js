import React from 'react';
import TextField from "@mui/material/TextField";
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import { BASE_URL } from '../config/axios';
import { mensagemSucesso, mensagemErro } from '../components/toastr';

import imagemErro from '../img/imagem-erro.png'

const baseURL = `${BASE_URL}/produtos`;

function LandingPage() {
    const [dados, setDados] = React.useState(null);
    const [itensCarrinho, setItensCarrinho] = React.useState([]);

    React.useEffect(() => {
        const items = JSON.parse(localStorage.getItem('itensCarrinho'));
        if (items) {
            setItensCarrinho(items);
        }
    }, []);

    function adicionarItemCarrinho(item) {
        try {
            const itemExistente = itensCarrinho.find((i) => i.produto.id === item.id);

            if (itemExistente) {
                itemExistente.quantidade += 1;
                mensagemSucesso(`Quantidade de "${item.nome}" atualizada no carrinho!`);
            } else {
                const novoItem = { quantidade: 1, produto: item };
                setItensCarrinho([...itensCarrinho, novoItem]);
                mensagemSucesso(`"${item.nome}" adicionado ao carrinho!`);
            }

            localStorage.setItem('itensCarrinho', JSON.stringify(itensCarrinho));
        } catch (error) {
            mensagemErro(`Erro ao adicionar "${item.nome}" ao carrinho: ${error.message}`);
        }
    }

    React.useEffect(() => {
        axios.get(baseURL).then((response) => {
            setDados(response.data);
        });
    }, []);

    if (!dados) return null;

    return (
        <div className='container'>
            <h1>Catálogo</h1>
            <div className="search">
                <TextField
                    id="outlined-basic"
                    variant="outlined"
                    fullWidth
                    label="Pesquisar"
                    sx={{
                        backgroundColor: '#f0f0f0',
                        borderRadius: '8px'
                    }}
                    InputProps={{
                        style: {
                            color: '#333',
                            borderRadius: '8px'
                        },
                        endAdornment: (
                            <InputAdornment position="end">
                                <SearchIcon style={{ color: '#666' }} />
                            </InputAdornment>
                        )
                    }}
                />
            </div>

            <Grid container spacing={2} sx={{ marginTop: '20px' }}>
                {dados.map((produto) => (
                    <Grid item xs={12} sm={6} md={4} key={produto.id}>
                        <Card sx={{ borderRadius: '8px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardMedia
                                component="img"
                                sx={{
                                    height: { xs: '100px', sm: '140px' },
                                    objectFit: 'cover'
                                }}
                                image={imagemErro}
                                alt={produto.nome}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h5" component="div" sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
                                    {produto.nome}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                    R$ {produto.preco.toFixed(2)}
                                </Typography>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        marginTop: '10px',
                                        borderRadius: '8px',
                                        fontSize: { xs: '0.8rem', sm: '1rem' }
                                    }}
                                    onClick={() => adicionarItemCarrinho(produto)}
                                >
                                    Adicionar ao Carrinho
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default LandingPage;