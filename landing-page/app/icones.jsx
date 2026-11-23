// Nomes de ícone que o site.config.js pode usar. Para um ícone novo, importe de
// @mui/icons-material (variante Rounded) e dê um nome aqui.
import WebRounded from "@mui/icons-material/WebRounded";
import SmartphoneRounded from "@mui/icons-material/SmartphoneRounded";
import WifiOffRounded from "@mui/icons-material/WifiOffRounded";
import AppsRounded from "@mui/icons-material/AppsRounded";
import SportsMartialArtsRounded from "@mui/icons-material/SportsMartialArtsRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import BarChartRounded from "@mui/icons-material/BarChartRounded";
import MilitaryTechRounded from "@mui/icons-material/MilitaryTechRounded";
import AdminPanelSettingsRounded from "@mui/icons-material/AdminPanelSettingsRounded";
import OpenInNewRounded from "@mui/icons-material/OpenInNewRounded";
import MovieRounded from "@mui/icons-material/MovieRounded";
import QueuePlayNextRounded from "@mui/icons-material/QueuePlayNextRounded";
import LinkRounded from "@mui/icons-material/LinkRounded";
import PlayCircleRounded from "@mui/icons-material/PlayCircleRounded";
import InsightsRounded from "@mui/icons-material/InsightsRounded";
import CakeRounded from "@mui/icons-material/CakeRounded";
import CodeRounded from "@mui/icons-material/CodeRounded";
import EventRounded from "@mui/icons-material/EventRounded";
import ChatRounded from "@mui/icons-material/ChatRounded";
import AddToDriveRounded from "@mui/icons-material/AddToDriveRounded";
import ForumRounded from "@mui/icons-material/ForumRounded";
import PaletteRounded from "@mui/icons-material/PaletteRounded";
import SupportAgentRounded from "@mui/icons-material/SupportAgentRounded";
import EditNoteRounded from "@mui/icons-material/EditNoteRounded";
import DescriptionRounded from "@mui/icons-material/DescriptionRounded";
import TravelExploreRounded from "@mui/icons-material/TravelExploreRounded";
import EmojiEventsRounded from "@mui/icons-material/EmojiEventsRounded";
import SendRounded from "@mui/icons-material/SendRounded";
import MailRounded from "@mui/icons-material/MailRounded";
import LanguageRounded from "@mui/icons-material/LanguageRounded";

const icones = {
  web: WebRounded,
  site: LanguageRounded,
  celular: SmartphoneRounded,
  offline: WifiOffRounded,
  apps: AppsRounded,
  artesMarciais: SportsMartialArtsRounded,
  ok: CheckCircleRounded,
  grafico: BarChartRounded,
  medalha: MilitaryTechRounded,
  admin: AdminPanelSettingsRounded,
  abrir: OpenInNewRounded,
  filme: MovieRounded,
  fila: QueuePlayNextRounded,
  link: LinkRounded,
  play: PlayCircleRounded,
  painel: InsightsRounded,
  bolo: CakeRounded,
  codigo: CodeRounded,
  evento: EventRounded,
  chat: ChatRounded,
  drive: AddToDriveRounded,
  conversa: ForumRounded,
  paleta: PaletteRounded,
  suporte: SupportAgentRounded,
  ideia: EditNoteRounded,
  documento: DescriptionRounded,
  explorar: TravelExploreRounded,
  trofeu: EmojiEventsRounded,
  enviar: SendRounded,
  email: MailRounded,
};

export function Icone({ nome, ...props }) {
  const Componente = icones[nome];
  return Componente ? <Componente aria-hidden="true" {...props} /> : null;
}
