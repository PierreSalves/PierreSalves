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
import SchoolRounded from "@mui/icons-material/SchoolRounded";
import StorefrontRounded from "@mui/icons-material/StorefrontRounded";
import LocalHospitalRounded from "@mui/icons-material/LocalHospitalRounded";
import RestaurantRounded from "@mui/icons-material/RestaurantRounded";
import PaymentsRounded from "@mui/icons-material/PaymentsRounded";
import CalendarMonthRounded from "@mui/icons-material/CalendarMonthRounded";
import GroupsRounded from "@mui/icons-material/GroupsRounded";
import ShoppingCartRounded from "@mui/icons-material/ShoppingCartRounded";
import PhotoCameraRounded from "@mui/icons-material/PhotoCameraRounded";
import MusicNoteRounded from "@mui/icons-material/MusicNoteRounded";
import SportsEsportsRounded from "@mui/icons-material/SportsEsportsRounded";
import FitnessCenterRounded from "@mui/icons-material/FitnessCenterRounded";
import PetsRounded from "@mui/icons-material/PetsRounded";
import LocalShippingRounded from "@mui/icons-material/LocalShippingRounded";
import ConstructionRounded from "@mui/icons-material/ConstructionRounded";
import ScheduleRounded from "@mui/icons-material/ScheduleRounded";
import NotificationsRounded from "@mui/icons-material/NotificationsRounded";
import LockRounded from "@mui/icons-material/LockRounded";
import CloudRounded from "@mui/icons-material/CloudRounded";
import BuildRounded from "@mui/icons-material/BuildRounded";
import HourglassTopRounded from "@mui/icons-material/HourglassTopRounded";
import ArchiveRounded from "@mui/icons-material/ArchiveRounded";

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
  escola: SchoolRounded,
  loja: StorefrontRounded,
  saude: LocalHospitalRounded,
  restaurante: RestaurantRounded,
  financeiro: PaymentsRounded,
  agenda: CalendarMonthRounded,
  pessoas: GroupsRounded,
  carrinho: ShoppingCartRounded,
  foto: PhotoCameraRounded,
  musica: MusicNoteRounded,
  jogo: SportsEsportsRounded,
  academia: FitnessCenterRounded,
  pet: PetsRounded,
  entrega: LocalShippingRounded,
  obra: ConstructionRounded,
  horario: ScheduleRounded,
  aviso: NotificationsRounded,
  seguranca: LockRounded,
  nuvem: CloudRounded,
  ferramenta: BuildRounded,
  andamento: HourglassTopRounded,
  arquivado: ArchiveRounded,
};

// Lista usada no /admin para escolher o ícone.
export const nomesIcones = Object.keys(icones);

export function Icone({ nome, ...props }) {
  const Componente = icones[nome];
  return Componente ? <Componente aria-hidden="true" {...props} /> : null;
}
