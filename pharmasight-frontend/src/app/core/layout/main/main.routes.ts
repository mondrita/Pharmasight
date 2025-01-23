import {Routes} from "@angular/router";
import {MainComponent} from "./main.component";

export const mainRoutes: Routes = [
    {
        path: '',
        component: MainComponent,
        children: [{
            path: '',
            loadChildren: () =>
                import('../../../workspace/leaflet-map/map.routes').then(
                    (routes) => routes.mapRoutes
                ),
        }]
    }
]