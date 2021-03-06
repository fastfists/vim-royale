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

const cachedEntityArray: Component[] = [];

// singleton?
export class EntityStore {
    private currentId: number;
    private maxId: number;
    private startId: number;

    // <generics>
    private entityMap: Map<EntityItem, Map<string, Component>>;
    private entitiesByComponent: Map<string, Map<EntityItem, Component>>;

    constructor() {
        this.entitiesByComponent = new Map();
        this.entityMap = new Map();
        this.currentId = 1;
    }

    setEntityRange(start: number, stop: number) {
        this.currentId = start;
        this.startId = start;
        this.maxId = stop;
    }

    getComponent<T extends Component>(entityId: EntityItem, comp: T): T | null {
        const componentMap = this.entityMap.get(entityId);

        if (!componentMap) {
            return null;
        }

        const out = componentMap.get(comp.type) as T;
        if (!out) {
            return null;
        }

        return out;
    }

    // TODO: Debugging
    getAllEntities(): EntityItem[] {
        return [...this.entityMap.keys()];
    }

    forEach<T extends Component>(T, cb: (entityId: EntityItem, state: T) => void) {
        const entities = this.entitiesByComponent.get(T.type);

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
            const entity: T = <any>entities.get(k);

            cb(k, entity);
        });
    }

    toCachedArray(component: Component): Component[] {
        cachedEntityArray.length = 0;

        const entities = this.entitiesByComponent.get(component.type);
        for (let [k, v] of entities) {
            if (v.type === component.type) {
                cachedEntityArray.push(v);
            }
        }

        return cachedEntityArray;
    }

    toArray<T extends Component>(T): T[] {
        const entities = this.entitiesByComponent.get(T.type);

        if (!entities) {
            return [];
        }

        return Array.from(entities.keys()).map(k => entities.get(k) as T);
    }

    getNextId(): number {
        if (this.currentId + 1 === this.maxId) {
            this.currentId = this.startId;
        }

        return this.currentId++;
    }

    createNewEntity(): number {
        let id: number;
        let count = 0;
        do {
            id = this.getNextId();
            count++;
        } while (!this.setNewEntity(id) && count < this.maxId - this.startId);

        // TODO: this should be better handlede.....
        if (count === this.maxId - this.startId) {
            throw new Error("WHAT HAS HAPPENED, YOU HAVE USED ALL OF YOUR ENTITIES");
        }

        return id;
    }

    setNewEntity(id: number): boolean {
        if (this.entityMap.has(id)) {
            return false;
        }

        this.entityMap.set(id, new Map());

        return true;
    }

    attachComponent(entity: EntityItem, comp: Component) {
        this.entityMap.get(entity).set(comp.type, comp);
        if (!this.entitiesByComponent.has(comp.type)) {
            this.entitiesByComponent.set(comp.type, new Map());
        }

        // @ts-ignore
        this.entitiesByComponent.get(comp.type).set(entity, comp);
    }

    removeComponent(entity: EntityItem, type: string) {
        throw new Error("You should implement me...");
    }

    removeEntityRange(from: EntityItem, to: EntityItem) {

        // TODO: OBVIOUSLY A PROBLEM (maybe, profile).
        for (const entityId of this.entityMap.keys()) {
            if (entityId >= from && entityId < to) {
                if (this.entityMap.has(entityId)) {
                    const components = this.entityMap.get(entityId);

                    for (const component of components.values()) {
                        const entityIdMap =
                            this.entitiesByComponent.get(component.type);

                        if (entityIdMap.has(entityId)) {
                            entityIdMap.delete(entityId);
                        }
                    }

                    this.entityMap.delete(entityId);
                }
            }
        }
    }

    removeEntity(entity: EntityItem) {
        if (this.entityMap.has(entity)) {
            this.entityMap.delete(entity);
            this.entitiesByComponent.forEach(entityMap => {
                if (entityMap.has(entity)) {
                    entityMap.delete(entity);
                }
            });
        }
    }
}

export default function createEntityStore() {
    return new EntityStore();
};


