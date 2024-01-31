import React, { useEffect, useState } from "react";
import openSocket from "socket.io-client";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import api from "../../services/api";
import toastError from "../../errors/toastError";
import TextField from '@material-ui/core/TextField';
import Paper from "@material-ui/core/Paper";
import Button from '@material-ui/core/Button';
import axios from 'axios';

async function ZDGSender(limit, iD, token) {

  const url = process.env.REACT_APP_BACKEND_URL + '/syncMessage';
  const headers = {
    'Content-Type': 'application/json; charset=utf-8'
  };
  const data = {
	limit: limit,
	token: token,
	ticketwhatsappId: parseInt(iD)
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

async function GETSender() {
	const url = process.env.REACT_APP_BACKEND_URL + '/whatsappzdg';
	try {
	  const response = await axios.get(url);
	  const connectedObjects = response.data.filter(obj => obj.status === 'CONNECTED');
      const names = connectedObjects.map(obj => obj.id);
      const namesString = names.join(', ');
	  alert("ID instância Conectadas: " + namesString);
	} catch (error) {
	  alert("Erro: " + error.message);
	}
}

const useStyles = makeStyles(theme => ({
	root: {
		display: "flex",
		alignItems: "center",
		padding: theme.spacing(4),
		backgroundColor: theme.palette.background.default,
	},

	paper: {
		padding: theme.spacing(2),
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		textAlign: "center",
		verticalAlign: "middle",
		marginBottom: 12,
	},

	button: {
		padding: theme.spacing(2),
		display: "inline-flex",
		justifyContent: "center",
		alignItems: "center",
		textAlign: "center",
		verticalAlign: "middle",
		marginBottom: 12,
		marginRight: 12,
	},
	settingOption: {
		marginLeft: "auto",
	},
	margin: {
		margin: theme.spacing(1),
	},
}));

const ZDGHistorico = () => {
	const classes = useStyles();
	const [inputs, setInputs] = useState({});
	const [settings, setSettings] = useState([]);

	useEffect(() => {
		const fetchSession = async () => {
			try {
				const { data } = await api.get("/settings");
				setSettings(data);
			} catch (err) {
				toastError(err);
			}
		};
		fetchSession();
	}, []);
	
	const getSettingValue = key => {
		const { value } = settings.find(s => s.key === key);
		return value;
	};

	const handleChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		setInputs(values => ({...values, [name]: value}))
	  }
	
	const handleSubmit = (event) => {
		event.preventDefault();
		const token = settings && settings.length > 0 && getSettingValue("userApiToken");
		alert('As mensagens estão sendo importadas! Aguarde...');
		ZDGSender(inputs.limite, inputs.id, token);
	}
	
	useEffect(() => {
		const socket = openSocket(process.env.REACT_APP_BACKEND_URL);
		return () => {
			socket.disconnect();
		};
	}, []);

	return (
		<div className={classes.root}>  
			<Container className={classes.container} maxWidth="sm">
			<Paper className={classes.paper}>
			<h1> Importação de Mensagens do Dispositivo</h1>
			</Paper>
			<Paper className={classes.paper}>
			<h3><span role="img" aria-label="warning">⚠️</span> Use valores baixos, pois serão importadas mensagens de todas as conversas abertas no seu dispositivo. Valores altos podem sobrecarregar e derrubar o seu sistema.</h3>
			</Paper>
			<form onSubmit={handleSubmit}>
				<Paper className={classes.paper}>
				<TextField 
					id="outlined-basic" 
					label="Limite de Importação" 
					variant="outlined" 
					name="limite" 
					value={inputs.limite || ""} 
					onChange={handleChange}
					required
					fullWidth
					margin="dense"
					placeholder="Quantidade de mensagens por conversa"
				/>
				</Paper>

				<Paper className={classes.paper}>
				<TextField 
					id="outlined-basic" 
					label="ID de Disparo" 
					variant="outlined" 
					name="id" 
					value={inputs.id || ""} 
					onChange={handleChange}
					required
					fullWidth
					margin="dense"
				/>
				</Paper>
				<Button variant="contained" color="primary" className={classes.button} onClick={GETSender}>
				Mostrar ID de Disparo
				</Button>
				<Button variant="contained" color="secondary" className={classes.button} type="submit">
				IMPORTAR MENSAGENS
				</Button>
			</form>
			</Container>
		</div>
	);
};

export default ZDGHistorico;