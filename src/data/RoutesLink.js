import { Building2, Car, Home, User } from "lucide-react";

export  const routes = [
    {routename: "Inicio", routePath : "/dashboard/contracts", icon : Home, selected : true},
    {routename : "Inmuebles", routePath : "/dashboard/contracts/inmueble", icon : Building2, selected : false},
    {routename : "Vehiculos", routePath : "/dashboard/contracts/vehiculo", icon : Car, selected : false},
    {routename : 'Asociacion', routePath : '/dashboard/contracts/asociacion', icon : User, selected : false},
    {routename : 'RS', routePath : '/dashboard/contracts/rs', icon : User, selected : false},
    {routename : 'SAC', routePath : '/dashboard/contracts/sac', icon : User, selected : false},
    {routename : 'SCRL', routePath : '/dashboard/contracts/scrl', icon : User, selected : false}
];