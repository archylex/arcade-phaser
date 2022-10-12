import { IState } from './IState';

let idCount : number = 0;

export default class StateMachine {    
    private id : string = (++idCount).toString();
	private context? : object;
	private states : Map<string, IState> = new Map<string, IState>();
	private currentState?: IState;
    private isChangingState : Boolean = false;
    private changeStateQueue: string[];

    constructor(context?: object, id?: string) {
		this.id = id ?? this.id;
		this.context = context;
		this.changeStateQueue = [];
	}

    isCurrentState(name: string) {
		if (!this.currentState) {
			return false;
		}

		return this.currentState.name === name;
	}

	addState(name: string, config?: { onEnter?: () => void, onUpdate?: (dt: number) => void, onExit?: () => void }) {
		const context = this.context;
	
	    this.states.set(name, {
		    name,
		    onEnter: config?.onEnter?.bind(context),
		    onUpdate: config?.onUpdate?.bind(context),
		    onExit: config?.onExit?.bind(context)
	    });

	    return this;
	}

	setState(name: string) {
        if (!this.states.has(name)) {
		    console.warn(`Tried to change to unknown state: ${name}`);
		    return;
	    }

	    if (this.isCurrentState(name)) {
            console.warn(`No state changed`);
		    return;
	    }

	    if (this.isChangingState) {
		    this.changeStateQueue.push(name);
		    return;
	    }

	    this.isChangingState = true;

	    console.log(`[StateMachine (${this.id})] change from ${this.currentState?.name ?? 'none'} to ${name}`);

	    if (this.currentState && this.currentState.onExit) 	{
		    this.currentState.onExit();
	    }

	    this.currentState = this.states.get(name)!;

	    if (this.currentState.onEnter) {
		    this.currentState.onEnter();
	    }

	    this.isChangingState = false;
	}

	update(dt: number) {
		if (this.changeStateQueue.length > 0) {
		    this.setState(this.changeStateQueue.shift()!);
		    return;
	    }

	    if (this.currentState && this.currentState.onUpdate) {
		    this.currentState.onUpdate(dt);
	    }
	}
}