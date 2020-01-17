// 1. Everything has behaViors
// createNewEntity: number
// addBehavior(entity: number, behavior<Position>)
//
// Renderererer(board) {
//    entities.forEach(<Position>, (positionEntity) => {
//    });
// }
//

export interface Component {
    type: string;
}

export type EntityItem = number;

// singleton?
class EntityStore {
    private currentId: number;

    // <generics>
    private entityMap: Map<EntityItem, Map<string, Component>>;
    private entitiesByComponent: Map<string, Map<EntityItem, Component>>;

    constructor() {
        this.entitiesByComponent = new Map();
        this.entityMap = new Map();
        this.currentId = 1;
    }

    getComponent(entityId: EntityItem, type: string): Component {
        const componentMap = this.entityMap.get(entityId);

        if (!componentMap) {
            return null;
        }

        const out = componentMap.get(type);
        if (!out) {
            return null;
        }

        return out;
    }


    forEach(componentType: string, cb: (entityId: EntityItem, state: Component) => void) {
        debugger;
        const entities = this.entitiesByComponent.get(componentType);
        console.error("entities", entities);

        if (!entities) {
            return;
        }

        // TODO: Ask Jordan
        // TODO: Whatatattatata
        // for (k of entities) {
        // for (k in entities.keys()) {
        //   k becomes a string
        // }
        Array.from(entities.keys()).forEach(k => {
            const entity = entities.get(k);

            console.error("for k", k, entity);

            cb(k, entity);
        });
    }

    toArray(componentType: string): Component[] {
        console.error("Getting componentType", componentType);
        const entities = this.entitiesByComponent.get(componentType);

        if (!entities) {
            return [];
        }

        return Array.from(entities.keys()).map(k => entities.get(k));
    }

    createNewEntity(): number {
        const id = this.currentId++;

        this.entityMap.set(id, new Map());

        return id;
    }

    attachComponent(entity: EntityItem, comp: Component) {
        this.entityMap.get(entity).set(comp.type, comp);
        if (!this.entitiesByComponent.has(comp.type)) {
            this.entitiesByComponent.set(comp.type, new Map());
        }

        this.entitiesByComponent.get(comp.type).set(entity, comp);
    }

    removeComponent
}

const store = new EntityStore();
export default function createEntityStore() {
    return store;
};


