import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import NavigationPath from "../../../Wolfie2D/Pathfinding/NavigationPath";
import Timer from "../../../Wolfie2D/Timing/Timer";
import { hw3_Names } from "../../hw3_constants";
import EnemyAI, { EnemyStates } from "../EnemyAI";
import EnemyState from "./EnemyState";

/** When an enemy hears a gunshot, it will rush to the location of the gunshot */
export default class Alert extends EnemyState {
    /** The path to move towards the alert position on */
    private path: NavigationPath;

    /** A timer to tell us how long to be alerted for */
    private alertTimer: Timer;
    private  direction:Vec2;
    private flag:boolean;

    constructor(parent: EnemyAI, owner: GameNode){
        super(parent, owner);
        this.direction=Vec2.ZERO;
        this.flag=true;
        this.alertTimer = new Timer(10000);
        
    }
    
    // Receives options.target
    onEnter(options: Record<string, any>): void {
        this.alertTimer.start();
        this.flag=true;
        
    }

    handleInput(event: GameEvent): void {

    }

    // HOMEWORK 3 - TODO
    /**
     * While in the alert state, an enemy should move towards the target position received in onEnter.
     * 
     * Your job is to make sure that for the duration of the alert state, the enemy moves towards this
     * target position.
     */
    update(deltaT: number): void {
        if(this.alertTimer.isStopped()){
            // The timer is up, return to the default state
            this.finished(EnemyStates.DEFAULT);
            this.flag=true;
            return;
        }
        if(this.flag)      {
            this.direction.x=this.parent.player.position.x;
            this.direction.y=this.parent.player.position.y;
            this.flag=false;
            }
        
            this.owner.move(new Vec2((this.direction.x-this.owner.position.x)/64,(this.direction.y-this.owner.position.y)/64));

        
        
        if(this.parent.getPlayerPosition() !== null){
            this.finished(EnemyStates.ATTACKING);
        }
    }

    onExit(): Record<string, any> {
        return {};
    }

}