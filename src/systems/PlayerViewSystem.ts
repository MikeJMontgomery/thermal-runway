import { System } from 'ecsy'
import PlayerTagComponent from '../tags/PlayerTagComponent'
import PlayerViewTagComponent from '../tags/PlayerViewTagComponent'
import PositionComponent from '../components/PositionComponent'
import ModelComponent from '../components/ModelComponent'
import ScaleComponent from '../components/ScaleComponent'
import { AmmoRigidBodyStateComponent } from '../components/AmmoRigidBodyStateComponent'

export default class PlayerViewSystem extends System {
  playerPosition: PositionComponent
  playerScale: ScaleComponent
  playerDirection: { x?: number; y?: number; z?: number } = {}

  execute() {
    // When a new player component is added,
    // we want to create a view component for it
    this.queries.playerRigidBody.added.forEach((entity) => {
      this.world
        .createEntity()
        .addComponent(PlayerViewTagComponent)
        .addComponent(PositionComponent)
        .addComponent(ScaleComponent)
        .addComponent(ModelComponent, { type: 'character' })
    })

    this.queries.playerRigidBody.results.forEach((entity) => {
      this.playerPosition = entity.getComponent(PositionComponent)
      this.playerScale = entity.getComponent(ScaleComponent)

      // const {rigidBody} = entity.getComponent(AmmoRigidBodyStateComponent)
      // const velocity = rigidBody.getLinearVelocity()
    })

    this.queries.playerView.results.forEach((entity) => {
      const playerViewPosition = entity.getMutableComponent(PositionComponent)
      playerViewPosition.x = this.playerPosition.x
      playerViewPosition.y = this.playerPosition.y - this.playerScale.x / 2
      playerViewPosition.z = this.playerPosition.z
    })
  }
}

PlayerViewSystem.queries = {
  playerRigidBody: {
    components: [PlayerTagComponent, PositionComponent, ScaleComponent, AmmoRigidBodyStateComponent],
    listen: {
      added: true,
      changed: true,
    },
  },

  playerView: {
    components: [PlayerViewTagComponent],
  },
}