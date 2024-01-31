import React, { useContext, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import { MoreVert, Replay } from "@material-ui/icons";

import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import TicketOptionsMenu from "../TicketOptionsMenu";
import ButtonWithSpinner from "../ButtonWithSpinner";
import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";
import axios from 'axios';

async function ZDGProtocolo(usuario, protocolo, ticket) {

  const url = process.env.REACT_APP_BACKEND_URL + '/zdgProtocolo';
  const headers = {
    'Content-Type': 'application/json; charset=utf-8'
  };
  const data = {
	usuario: usuario,
	protocolo: protocolo,
	ticket: ticket
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

async function ZDGEmail(zdgSubject, zdgText) {

	const url = process.env.REACT_APP_BACKEND_URL + '/zdgSendEmail';
	const headers = {
	  'Content-Type': 'application/json; charset=utf-8'
	};
	const data = {
	  zdgSubject: zdgSubject,
	  zdgText: zdgText
	};
  
	try {
	  const response = await axios.post(url, data, { headers });
	  console.log(response);
	} catch (error) {
	  console.error(error);
	}
}

async function ZDGEmailUser(zdgSubject, zdgText, zdgSendEmailUser) {

	const url = process.env.REACT_APP_BACKEND_URL + '/zdgSendEmailUser';
	const headers = {
	  'Content-Type': 'application/json; charset=utf-8'
	};
	const data = {
	  zdgSubject: zdgSubject,
	  zdgText: zdgText,
	  zdgTo: zdgSendEmailUser
	};
  
	try {
	  const response = await axios.post(url, data, { headers });
	  console.log(response);
	} catch (error) {
	  console.error(error);
	}
}

const useStyles = makeStyles(theme => ({
	actionButtons: {
		marginRight: 6,
		flex: "none",
		alignSelf: "center",
		marginLeft: "auto",
		"& > *": {
			margin: theme.spacing(1),
		},
	},
}));

const TicketActionButtons = ({ ticket }) => {
	const { ticketId } = useParams();
	const classes = useStyles();
	const history = useHistory();
	const [anchorEl, setAnchorEl] = useState(null);
	const [loading, setLoading] = useState(false);
	const ticketOptionsMenuOpen = Boolean(anchorEl);
	const { user } = useContext(AuthContext);
	const date = new Date();
	const minutes = date.getMinutes();
	const hour = date.getHours();

	const handleSendMessage = async (status, userId) => {
		const message = {
		  read: 1,
		  fromMe: true,
		  mediaUrl: "",
		  body: "Seu protocolo de atendimento é: *nº " + Math.floor(Date.now()/1000) + '*',
		};
		try {
		  const { data } = await api.get("/tickets/" + ticketId);
		  ZDGProtocolo(data.contact.number, Math.floor(Date.now()/1000).toString(), ticketId);
		  await api.post(`/messages/${ticketId}`, message);
		  alert('Protocolo de atendimento:' + Math.floor(Date.now()/1000));
		  await api.put(`/tickets/${ticket.id}`, {
			status: status,
			userId: userId || null,
		  });
		  ZDGEmail('Ticket '+ ticketId + ' acaba de ser finalizado.', 'O atendente acaba de fechar o ticket nº ' + ticketId + '\nNúmero de contato: ' + data.contact.number + '\nNome ' + data.contact.name + '\nHorário ' + hour + ':' + minutes )
		  try {
			const response = await api.get("/contacts/" + data.contact.id);
			const email = response.data.email;
			ZDGEmailUser('Ticket '+ ticketId + ' acaba de ser finalizado.', 'O atendente acaba de fechar o ticket nº ' + ticketId + '\nNúmero de contato: ' + data.contact.number + '\nNome ' + data.contact.name + '\nHorário ' + hour + ':' + minutes, email )
		  } catch (err) {
		  }
		} catch (err) {
		  toastError(err);
		}
	};

	// const handleZDG = async (status, userId) => {
	// 	const message = {
	// 	  read: 1,
	// 	  fromMe: true,
	// 	  mediaUrl: "",
	// 	  body: "Obrigado, clique no link para participar da pesquisa de satisfação: " + process.env.REACT_APP_NPS_URL + ticketId,
	// 	};
	// 	try {
	// 	  await api.post(`/messages/${ticketId}`, message);
	// 	  //alert('NPS enviado');
	// 	//   await api.put(`/tickets/${ticket.id}`, {
	// 	// 	status: status,
	// 	// 	userId: userId || null,
	// 	//   });
	// 	} catch (err) {
	// 	  toastError(err);
	// 	}
	// };

	const handleOpenTicketOptionsMenu = e => {
		setAnchorEl(e.currentTarget);
	};

	const handleCloseTicketOptionsMenu = e => {
		setAnchorEl(null);
	};

	const handleUpdateTicketStatus = async (e, status, userId, text) => {
		setLoading(true);
		try {
			if (status === "closed" && text === "Protocolo") {
				handleSendMessage(status, userId);
				//handleZDG(status, userId)
			}
			else if (status === "closed") {
				try {
					const { data } = await api.get("/tickets/" + ticketId);
					ZDGEmail('Ticket '+ ticketId + ' acaba de ser finalizado.', 'O atendente acaba de fechar o ticket nº ' + ticketId + '\nNúmero de contato: ' + data.contact.number + '\nNome ' + data.contact.name + '\nHorário ' + hour + ':' + minutes );
					try {
						const response = await api.get("/contacts/" + data.contact.id);
						const email = response.data.email;
						ZDGEmailUser('Ticket '+ ticketId + ' acaba de ser finalizado.', 'O atendente acaba de fechar o ticket nº ' + ticketId + '\nNúmero de contato: ' + data.contact.number + '\nNome ' + data.contact.name + '\nHorário ' + hour + ':' + minutes, email )
					  } catch (err) {
					}
					await api.put(`/tickets/${ticket.id}`, {
						status: status,
						userId: userId || null,
					});
				  } catch (err) {
					toastError(err);
				  }
			} 
			else {
				await api.put(`/tickets/${ticket.id}`, {
					status: status,
					userId: userId || null,
				});
			}

			setLoading(false);
			if (status === "open") {
				history.push(`/tickets/${ticket.id}`);
			}
			else {
				history.push("/tickets");
			}
		} catch (err) {
			setLoading(false);
			toastError(err);
		}
	};

	return (
		<div className={classes.actionButtons}>
			{ticket.status === "closed" && (
				<ButtonWithSpinner
					loading={loading}
					startIcon={<Replay />}
					size="small"
					onClick={e => handleUpdateTicketStatus(e, "open", user?.id, "")}
				>
					{i18n.t("messagesList.header.buttons.reopen")}
				</ButtonWithSpinner>
			)}
			{ticket.status === "open" && (
				<>
					<ButtonWithSpinner
						loading={loading}
						startIcon={<Replay />}
						size="small"
						onClick={e => handleUpdateTicketStatus(e, "pending", null, "")}
					>
						{i18n.t("messagesList.header.buttons.return")}
					</ButtonWithSpinner>
					<ButtonWithSpinner
						loading={loading}
						size="small"
						variant="contained"
						color="primary"
						onClick={e => handleUpdateTicketStatus(e, "closed", user?.id, "")}
					>
						{i18n.t("messagesList.header.buttons.resolve")}
					</ButtonWithSpinner>
					<ButtonWithSpinner
						loading={loading}
						size="small"
						variant="contained"
						color="primary"
						onClick={e => handleUpdateTicketStatus(e, "closed", user?.id, "Protocolo")}
					>
						{"Protocolo"}
					</ButtonWithSpinner>
					<IconButton onClick={handleOpenTicketOptionsMenu}>
						<MoreVert />
					</IconButton>
					<TicketOptionsMenu
						ticket={ticket}
						anchorEl={anchorEl}
						menuOpen={ticketOptionsMenuOpen}
						handleClose={handleCloseTicketOptionsMenu}
					/>
				</>
			)}
			{ticket.status === "pending" && (
				<ButtonWithSpinner
					loading={loading}
					size="small"
					variant="contained"
					color="primary"
					onClick={e => handleUpdateTicketStatus(e, "open", user?.id, )}
				>
					{i18n.t("messagesList.header.buttons.accept")}
				</ButtonWithSpinner>
			)}
		</div>
	);
};

export default TicketActionButtons;
