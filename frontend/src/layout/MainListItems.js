import React, { useContext, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Divider from "@material-ui/core/Divider";
import { Badge } from "@material-ui/core";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import ContactPhoneOutlinedIcon from "@material-ui/icons/ContactPhoneOutlined";
import AccountTreeOutlinedIcon from "@material-ui/icons/AccountTreeOutlined";
import QuestionAnswerOutlinedIcon from "@material-ui/icons/QuestionAnswerOutlined";
import BallotIcon from '@material-ui/icons/Ballot';
import SubjectIcon from '@material-ui/icons/Subject';
import SendIcon from '@material-ui/icons/Send';
//import GroupIcon from '@material-ui/icons/Group';
// import TextsmsIcon from '@material-ui/icons/Textsms';
// import PhoneInTalkIcon from '@material-ui/icons/PhoneInTalk';
// import BurstModeIcon from '@material-ui/icons/BurstMode';
// import NewReleasesIcon from '@material-ui/icons/NewReleases';
// import InstagramIcon from '@material-ui/icons/Instagram';
// import ChatIcon from '@material-ui/icons/Chat';
// import ScheduleIcon from '@material-ui/icons/Schedule';
// import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
// import VerticalSplitIcon from '@material-ui/icons/VerticalSplit';

import { i18n } from "../translate/i18n";
import { WhatsAppsContext } from "../context/WhatsApp/WhatsAppsContext";
import { AuthContext } from "../context/Auth/AuthContext";
import { Can } from "../components/Can";
import { makeStyles } from "@material-ui/core/styles";

import chatImage from "../assets/icon.png";

const useStyles = makeStyles(theme => ({
	icon: {
		color: theme.palette.primary.main
	},
}));

function ListItemLink(props) {
  const { icon, primary, to, className } = props;
  const classes = useStyles();

  const renderLink = React.useMemo(
    () =>
      React.forwardRef((itemProps, ref) => (
        <RouterLink to={to} ref={ref} {...itemProps} />
      )),
    [to]
  );

  return (
    <li>
      <ListItem button component={renderLink} className={className}>
        {icon ? <ListItemIcon className={classes.icon}>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

const MainListItems = (props) => {
  
  const { drawerClose } = props;
  const { whatsApps } = useContext(WhatsAppsContext);
  const { user } = useContext(AuthContext);
  const [connectionWarning, setConnectionWarning] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (whatsApps.length > 0) {
        const offlineWhats = whatsApps.filter((whats) => {
          return (
            whats.status === "qrcode" ||
            whats.status === "PAIRING" ||
            whats.status === "DISCONNECTED" ||
            whats.status === "TIMEOUT" ||
            whats.status === "OPENING"
          );
        });
        if (offlineWhats.length > 0) {
          setConnectionWarning(true);
        } else {
          setConnectionWarning(false);
        }
      }
    }, 2000);
    return () => clearTimeout(delayDebounceFn);
  }, [whatsApps]);

  return (
    <div onClick={drawerClose}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <img src={chatImage} style={{ width: '40%' }} alt={process.env.REACT_APP_TITLE} />
        {/* <p>{process.env.REACT_APP_TITLE}</p> */}
      </div>
      <Divider />
      <ListItemLink
        to="/connections"
        primary={i18n.t("mainDrawer.listItems.connections")}
        icon={
          <Badge badgeContent={connectionWarning ? "!" : 0} color="error">
            <SyncAltIcon />
          </Badge>
        }
      />
      <ListItemLink
        to="/"
        primary="Dashboard"
        icon={<BallotIcon />}
      />
      <ListItemLink
        to="/tickets"
        primary={i18n.t("mainDrawer.listItems.tickets")}
        icon={<WhatsAppIcon />}
      />
      {/* <ListItemLink
        to="/ZDGChatbot"
        primary={i18n.t("mainDrawer.listItems.ZDGChatbot")}
        icon={<NewReleasesIcon />}
      />
      <ListItemLink
        to="/ZDGKanban"
        primary={i18n.t("mainDrawer.listItems.Kanban")}
        icon={<VerticalSplitIcon />}
      />      */}
      <ListItemLink
        to="/contacts"
        primary={i18n.t("mainDrawer.listItems.contacts")}
        icon={<ContactPhoneOutlinedIcon />}
      />
      <ListItemLink
        to="/quickAnswers"
        primary={i18n.t("mainDrawer.listItems.quickAnswers")}
        icon={<QuestionAnswerOutlinedIcon />}
      />
      <Divider />
      <ListSubheader inset>
        {i18n.t("mainDrawer.listItems.bulk")}
      </ListSubheader>
      {/* <ListItemLink
              to="/ZDGAgendamento"
              primary={i18n.t("mainDrawer.listItems.ZDGAgendamento")}
              icon={<ScheduleIcon />}
      /> */}
      <ListItemLink
              to="/ZDGHistorico"
              primary={i18n.t("mainDrawer.listItems.ZDGHistorico")}
              icon={<SubjectIcon />}
      />
      <ListItemLink
              to="/ZDG"
              primary={i18n.t("mainDrawer.listItems.ZDG")}
              icon={<SendIcon />}
      />
      {/* <ListItemLink
              to="/ZDGMedia"
              primary={i18n.t("mainDrawer.listItems.ZDGMedia")}
              icon={<BurstModeIcon />}
      />
      <ListItemLink
              to="/ZDGMedia2"
              primary={i18n.t("mainDrawer.listItems.ZDGMedia2")}
              icon={<BurstModeIcon />}
      />
      <ListItemLink
              to="/ZDGMedia3"
              primary={i18n.t("mainDrawer.listItems.ZDGMedia3")}
              icon={<RecordVoiceOverIcon />}
      />
      <ListItemLink
              to="/ZDGGroups"
              primary={i18n.t("mainDrawer.listItems.ZDGGroups")}
              icon={<GroupIcon />}
      />
      <ListItemLink
              to="/InstaDirect"
              primary={i18n.t("mainDrawer.listItems.Direct")}
              icon={<InstagramIcon />}
      />
      <ListItemLink
              to="/SMS"
              primary={i18n.t("mainDrawer.listItems.SMS")}
              icon={<TextsmsIcon />}
      />
      <ListItemLink
              to="/VoiceCall"
              primary={i18n.t("mainDrawer.listItems.VoiceCall")}
              icon={<PhoneInTalkIcon />}
      /> */}
      <Can
        role={user.profile}
        perform="drawer-admin-items:view"
        yes={() => (
          <>
            <Divider />
            <ListSubheader inset>
              {i18n.t("mainDrawer.listItems.administration")}
            </ListSubheader>
            {/* <ListItemLink
              to="/connections"
              primary={i18n.t("mainDrawer.listItems.connections")}
              icon={
                <Badge badgeContent={connectionWarning ? "!" : 0} color="error">
                  <SyncAltIcon />
                </Badge>
              }
            /> */}
            <ListItemLink
              to="/users"
              primary={i18n.t("mainDrawer.listItems.users")}
              icon={<PeopleAltOutlinedIcon />}
            />
            <ListItemLink
              to="/queues"
              primary={i18n.t("mainDrawer.listItems.queues")}
              icon={<AccountTreeOutlinedIcon />}
            />
            <ListItemLink
              to="/settings"
              primary={i18n.t("mainDrawer.listItems.settings")}
              icon={<SettingsOutlinedIcon />}
            />
          </>
        )}
      />
      <Divider />
      <ListSubheader>
      <a rel="noopener noreferrer" href="https://comunidadezdg.com.br" target="_blank"> Comunidade ZDG</a>
      </ListSubheader>      
    </div>
  );
};

export default MainListItems;
