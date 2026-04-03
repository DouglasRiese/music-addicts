export interface RouteDefinition {
    param: string; // the uuid for the entity
    method: string; // HTTP method like 'post or 'delete'
    action: string; // the method in the controller object (like 'save' or 'delete')
}