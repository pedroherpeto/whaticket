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

async function ZDGSender(userIg, message, token) {

  const url = process.env.REACT_APP_BACKEND_URL + '/sendDirect';
  const headers = {
    'Content-Type': 'application/json; charset=utf-8'
  };
  const data = {
	userIg: userIg,
	message: message,
	token: token
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log(response);
  } catch (error) {
    console.error(error);
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

const DirectInsta = () => {
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
		alert('As mensagens estão sendo carregadas! Aguarde...');
			setTimeout(function() {
				ZDGSender(inputs.userIg, inputs.message, token);
				alert('Mensagem enviada para o instagram de: ' + inputs.userIg);
				},5000 + Math.floor(Math.random() * 10000))            
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
			<h1> Disparo automátio de DIRECTS</h1>
			</Paper>
			<Paper className={classes.paper}>
			<h3><span role="img" aria-label="warning">⚠️</span> API limitada pelo mecanismo anti-spam do IG. Sujeito a banimentos ou quedas inesperadas.</h3>
			</Paper>
			<form onSubmit={handleSubmit}>
				<Paper className={classes.paper}>
				<TextField 
					id="outlined-basic" 
					label="Destinatários IG" 
					variant="outlined" 
					name="userIg" 
					value={inputs.userIg || ""} 
					onChange={handleChange}
					required
					fullWidth
					multiline
					margin="dense"
					placeholder="usuário IG&#13;&#10;usuário IG&#13;&#10;usuário IG&#13;&#10;usuário IG"
				/>
				</Paper>
				<Paper className={classes.paper}>
				<TextField 
					id="outlined-basic" 
					label="Mensagem" 
					variant="outlined" 
					name="message" 
					value={inputs.message || ""} 
					onChange={handleChange}
					required
					fullWidth
					multiline
					margin="dense"
					placeholder="Olá, tudo bem?&#13;&#10;Como posso te ajudar?&#13;&#10;Abraços, a gente se vê!"
				/>
				</Paper>
				<Button variant="contained" color="secondary" className={classes.button} type="submit">
				DISPARAR
				</Button>
			</form>
			</Container>
		</div>
	);
};

export default DirectInsta;