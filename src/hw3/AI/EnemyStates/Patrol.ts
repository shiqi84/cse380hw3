import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import NavigationPath from "../../../Wolfie2D/Pathfinding/NavigationPath";
import { hw3_Events, hw3_Names } from "../../hw3_constants";
import EnemyAI, { EnemyStates } from "../EnemyAI";
import EnemyState from "./EnemyState";

export default class Patrol extends EnemyState {

    // The route this AI takes when patrolling
    protected patrolRoute: Array<Vec2>;

    // The current patrolRoute index
    protected routeIndex: number;

    // The current path
    protected currentPath: NavigationPath;

    // A return object for exiting this state
    protected retObj: Record<string, any>;
    private direction: Vec2;
    private flag=1;

    constructor(parent: EnemyAI, owner: GameNode, patrolRoute: Array<Vec2>){
        super(parent, owner);
        this.patrolRoute = patrolRoute;
        this.routeIndex = 0;

    }

    onEnter(options: Record<string, any>): void {}

    handleInput(event: GameEvent): void {
        if(event.type === hw3_Events.SHOT_FIRED){
            // Shot was fired. Go check it out if it was close to us
            if(this.owner.position.distanceTo(event.data.get("position")) < event.data.get("volume")){
                // Shot was close enough to hear, go to the alert state
                this.retObj = {target: event.data.get("position")};
                this.finished(EnemyStates.ALERT);
            }
        }
    }

    // HOMEWORK 3 - TODO
    /**
     * An enemy in the patrol state should move along its route.
     * The route is given to this state in its constructor.
     * 
     * You must add in routing so that the enemy will move along its patrol route while in this state.
     * The patrol route (in this case) is a series of positions in the world the enemy should move between.
     * 
     * You can also modify the onEnter method if you wish to.
     * 
     * For inspiration, check out the Guard state, or look at the NavigationPath class or the GameNode class
     */
    update(deltaT: number): void {
        // If the enemy sees the player, start attacking
        if(this.parent.getPlayerPosition() !== null){
            this.finished(EnemyStates.ATTACKING);}
            if(this.owner.position.x==this.patrolRoute[this.routeIndex].x&&this.owner.position.y==this.patrolRoute[this.routeIndex].y){
                if(this.flag==1&&this.routeIndex==(this.patrolRoute.length-1)){
                    this.flag=-1;
                }if(this.flag==-1&&this.routeIndex==0){
                    this.flag=1;

                }
               if(this.flag==1) {
                this.routeIndex+=1;
            this.direction=new Vec2((this.patrolRoute[this.routeIndex].x-this.owner.position.x)/256,(this.patrolRoute[this.routeIndex].y-this.owner.position.y)/256)
      }  else{
          this.routeIndex-=1;
        this.direction=new Vec2((this.patrolRoute[this.routeIndex].x-this.owner.position.x)/256,(this.patrolRoute[this.routeIndex].y-this.owner.position.y)/256)

      }
    
    }
            this.owner.move(this.direction)
        
    }

    onExit(): Record<string, any> {
        return this.retObj;
    }

    getNextPath(): NavigationPath {
        let path = this.owner.getScene().getNavigationManager().getPath(hw3_Names.NAVMESH, this.owner.position, this.patrolRoute[this.routeIndex]);
        this.routeIndex = (this.routeIndex + 1)%this.patrolRoute.length;
        return path;
    }

}