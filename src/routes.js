import Dashboard from "./pages/dashboard/Dashboard";
import Telemetry from "./pages/telemetry/Telemetry";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Companies from "./pages/companies/Companies";
import ShowCompanies from "./pages/companies/ShowCompanies";
import Vehicles from "./pages/vehicles/Vehicles";
import ShowVehicles from "./pages/vehicles/ShowVehicles";
import Lines from "./pages/lines/Lines";
import Scales from "./pages/scales/Scales";
import Employee from "./pages/employee/Employee";
import ShowEmployee from "./pages/employee/ShowEmployee";
import Trip from "./pages/trip/Trip";
import Events from "./pages/events/Events";
import Fuel from "./pages/fuel/Fuel";
import Consumption from "./pages/consumption/Consumption";
import Occurrences from "./pages/occurrences/Occurrences";
import ShowOccurrences from "./pages/occurrences/ShowOccurrences";
import Synoptic from "./pages/synoptic/Synoptic";
import Monitoring from "./pages/monitoring/Monitoring";
import Notifications from "./pages/notifications/Notifications";
import Settings from "./pages/settings/Settings";
import Obd from "./pages/Obd/Obd";
import ShowObd from "./pages/Obd/ShowObd";
import CellphoneNumber from "./pages/cellphone";
import ShowCellphone from "./pages/cellphone/ShowCellphone";
import Users from "./pages/users/Users";
import ShowUser from "./pages/users/ShowUser";
import BrandVehicle from "./pages/vehicles/VehicleDependency/BrandVehicle";
import ModelVehicle from "./pages/vehicles/VehicleDependency/ModelVehicle";
import ShowVehicleDependency from "./pages/vehicles/VehicleDependency/ShowVehicleDependency";
import ShowEvent from "./pages/events/ShowEvent";
import ShowFuel from "./pages/fuel/ShowFuel";
import ShowConsumption from "./pages/consumption/ShowConsumption";
import ShowLine from "./pages/lines/ShowLine";
import ShowProfile from "./pages/Profile/ShowProfile";
import ShowScale from "./pages/scales/ShowScale";
import ShowTrip from "./pages/trip/ShowTrip";
import AddressRegisterPoints from "./pages/lines/DynamicRegistration/AddressRegisterPoints";
import GeolocationRegisterPoints from "./pages/lines/DynamicRegistration/GeolocationRegisterPoints";
import DataObd from "./pages/dataObd/DataObd";
import Reports from "./pages/reports/Reports";

const routesAuth = [
    {
        path: "/recuperacao",
        exact: true,
        name: "Recuperação de senha",
        component: ForgotPassword,
    },
    {
        path: "/",
        exact: true,
        name: "Login",
        component: Login,
    },
    {
        path: "/login",
        exact: true,
        name: "Login",
        component: Login,
    },
];

const routesAdmin = [
    {
        path: "/companies",
        exact: true,
        name: "Empresas",
        component: Companies,
    },
    {
        path: "/companies/show/:identifier",
        exact: true,
        name: "Detalhes de empresa",
        component: ShowCompanies,
    },
    {
        path: "/vehicles",
        exact: true,
        name: "Veículos",
        component: Vehicles,
    },
    {
        path: "/vehicle/brand",
        exact: true,
        name: "Veículos",
        component: BrandVehicle,
    },
    {
        path: "/vehicle/model",
        exact: true,
        name: "Veículos",
        component: ModelVehicle,
    },
    {
        path: "/vehicle/:type/show/:id",
        exact: true,
        name: "Detalhes de :type",
        component: ShowVehicleDependency,
    },
    {
        path: "/vehicles/show/:identifier",
        exact: true,
        name: "Detalhes de veículo",
        component: ShowVehicles,
    },
    {
        path: "/lines",
        exact: true,
        name: "Linhas",
        component: Lines,
    },
    {
        path: "/lines/show/:id",
        exact: true,
        name: "Detalhes da Linha",
        component: ShowLine,
    },
    {
        path: "/points/new/:idLine",
        exact: true,
        name: "Novo Ponto",
        component: AddressRegisterPoints,
    },

    {
        path: "/lines/:idLine/points/address/new",
        exact: true,
        name: "Novo ponto via endereço",
        component: AddressRegisterPoints,
    },
    {
        path: "/lines/:idLine/points/geolocation/new",
        exact: true,
        name: "Novo ponto via geolocalização",
        component: GeolocationRegisterPoints,
    },
    {
        path: "/scales",
        exact: true,
        name: "Escalas",
        component: Scales,
    },
    {
        path: "/scale/show/:identifier",
        exact: true,
        name: "Detalhes da escala",
        component: ShowScale,
    },
    {
        path: "/employee",
        exact: true,
        name: "Colaboradores",
        component: Employee,
    },
    {
        path: "/employee/show/:identifier",
        exact: true,
        name: "Detalhes do Colaborador",
        component: ShowEmployee,
    },
    {
        path: "/occurrences",
        exact: true,
        name: "Ocorrências",
        component: Occurrences,
    },
    {
        path: "/occurrences/show/:identifier",
        exact: true,
        name: "Detalhes da ocorrência",
        component: ShowOccurrences,
    },
    {
        path: "/fuel",
        exact: true,
        name: "Combustível",
        component: Fuel,
    },
    {
        path: "/fuel/show/:identifier",
        exact: true,
        name: "Detalhes da cotação",
        component: ShowFuel,
    },
    {
        path: "/consumption",
        exact: true,
        name: "Consumo",
        component: Consumption,
    },
    {
        path: "/consumption/show/:identifier",
        exact: true,
        name: "Detalhes do consumo",
        component: ShowConsumption,
    },
    {
        path: "/synoptic",
        exact: true,
        name: "Sinótica",
        component: Synoptic,
    },
    {
        path: "/monitoring",
        exact: true,
        name: "Monitoramento",
        component: Monitoring,
    },
    {
        path: "/trip",
        exact: true,
        name: "Viagem",
        component: Trip,
    },
    {
        path: "/trip/show/:identifier",
        exact: true,
        name: "Detalhes da viagem",
        component: ShowTrip,
    },
    {
        path: "/event",
        exact: true,
        name: "Eventos",
        component: Events,
    },
    {
        path: "/event/show/:id",
        exact: true,
        name: "Detalhes do evento",
        component: ShowEvent,
    },
    {
        path: "/reports",
        exact: true,
        name: "Relatórios",
        component: Reports,
    },
    {
        path: "/notifications",
        exact: true,
        name: "Notificações",
        component: Notifications,
    },
    {
        path: "/settings/:identifierCompany",
        exact: true,
        name: "Parâmetros do sistema",
        component: Settings,
    },
    {
        path: "/profile",
        exact: true,
        name: "Perfil",
        component: ShowProfile,
    },
    {
        path: "/telemetry",
        exact: true,
        name: "Telemetria",
        component: Telemetry,
    },
    {
        path: "/obd",
        exact: true,
        name: "OBD",
        component: Obd,
    },
    {
        path: "/obd/show/:identifier",
        exact: true,
        name: "Detalhes do OBD",
        component: ShowObd,
    },
    {
        path: "/dataobd",
        exact: true,
        name: "DadosObd",
        component: DataObd,
    },
    {
        path: "/cellphone",
        exact: true,
        name: "Número de celular",
        component: CellphoneNumber,
    },
    {
        path: "/cellphone/:id",
        exact: true,
        name: "Dashboard",
        component: ShowCellphone,
    },
    {
        path: "/dashboard",
        exact: true,
        name: "Dashboard",
        component: Dashboard,
    },
    {
        path: "/users/:type",
        exact: true,
        name: "Usuários",
        component: Users,
    },
    {
        path: "/users/:type/:id",
        exact: true,
        name: "Dashboard",
        component: ShowUser,
    },
];

export { routesAuth, routesAdmin };
