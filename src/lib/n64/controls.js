export class InputController {
  constructor(appInstance = null) {
    this.DebugKeycodes = false

    //for remapping
    this.Key_Last = ""
    this.Remap_Check = false

    //controller 1
    this.Key_Up = false
    this.Key_Down = false
    this.Key_Left = false
    this.Key_Right = false
    this.Key_Action_Start = false
    this.Key_Action_CUP = false
    this.Key_Action_CDOWN = false
    this.Key_Action_CLEFT = false
    this.Key_Action_CRIGHT = false
    this.Key_Action_Z = false
    this.Key_Action_L = false
    this.Key_Action_R = false
    this.Key_Action_B = false
    this.Key_Action_A = false
    this.Key_Menu = false
    this.VectorX = 0
    this.VectorY = 0

    this.KeyMappings = this.defaultKeymappings()
    this.app = appInstance
    document.onkeydown = this.keyDown.bind(this)
    document.onkeyup = this.keyUp.bind(this)
  }

  defaultKeymappings() {
    return {
      Mapping_Left: "f",
      Mapping_Right: "h",
      Mapping_Up: "t",
      Mapping_Down: "g",
      Mapping_Action_A: "x",
      Mapping_Action_B: "c",
      Mapping_Action_Start: "Enter",
      Mapping_Action_CUP: "i",
      Mapping_Action_CDOWN: "k",
      Mapping_Action_CLEFT: "j",
      Mapping_Action_CRIGHT: "l",
      Mapping_Action_Analog_Up: "ArrowUp",
      Mapping_Action_Analog_Down: "ArrowDown",
      Mapping_Action_Analog_Left: "ArrowLeft",
      Mapping_Action_Analog_Right: "ArrowRight",
      Mapping_Action_Z: "z",
      Mapping_Action_L: "a",
      Mapping_Action_R: "s",
      Mapping_Menu: "`",
    }
  }

  keyDown(event) {
    let input_controller = this
    input_controller.Key_Last = event.key

    //handle certain keyboards that use Left instead of ArrowLeft
    if (
      event.key == "Left" &&
      input_controller.KeyMappings.Mapping_Left == "ArrowLeft"
    )
      event = new KeyboardEvent("", { key: "ArrowLeft" })
    if (
      event.key == "Right" &&
      input_controller.KeyMappings.Mapping_Right == "ArrowRight"
    )
      event = new KeyboardEvent("", { key: "ArrowRight" })
    if (
      event.key == "Up" &&
      input_controller.KeyMappings.Mapping_Up == "ArrowUp"
    )
      event = new KeyboardEvent("", { key: "ArrowUp" })
    if (
      event.key == "Down" &&
      input_controller.KeyMappings.Mapping_Down == "ArrowDown"
    )
      event = new KeyboardEvent("", { key: "ArrowDown" })
    let arrowkey = false

    //player 1
    if (event.key == input_controller.KeyMappings.Mapping_Down) {
      input_controller.Key_Down = true
      arrowkey = true
    }
    if (event.key == input_controller.KeyMappings.Mapping_Up) {
      input_controller.Key_Up = true
      arrowkey = true
    }
    if (event.key == input_controller.KeyMappings.Mapping_Left) {
      input_controller.Key_Left = true
      arrowkey = true
    }
    if (event.key == input_controller.KeyMappings.Mapping_Right) {
      input_controller.Key_Right = true
      arrowkey = true
    }
    if (event.key == input_controller.KeyMappings.Mapping_Action_Start) {
      input_controller.Key_Action_Start = true
    }
    if (event.key == input_controller.KeyMappings.Mapping_Action_CUP) {
      input_controller.Key_Action_CUP = true
    }
    if (event.key == input_controller.KeyMappings.Mapping_Action_CDOWN) {
      input_controller.Key_Action_CDOWN = true
    }
    if (event.key == input_controller.KeyMappings.Mapping_Action_CLEFT) {
      input_controller.Key_Action_CLEFT = true
    }
    if (event.key == input_controller.KeyMappings.Mapping_Action_CRIGHT) {
      input_controller.Key_Action_CRIGHT = true
    }
    if (event.key == input_controller.KeyMappings.Mapping_Action_B) {
      input_controller.Key_Action_B = true
    }
    if (event.key == input_controller.KeyMappings.Mapping_Action_Z) {
      input_controller.Key_Action_Z = true
    }
    if (event.key == input_controller.KeyMappings.Mapping_Action_L) {
      input_controller.Key_Action_L = true
    }
    if (event.key == input_controller.KeyMappings.Mapping_Action_R) {
      input_controller.Key_Action_R = true
    }
    if (event.key == input_controller.KeyMappings.Mapping_Action_A) {
      input_controller.Key_Action_A = true
    }
    if (event.key == input_controller.KeyMappings.Mapping_Menu) {
      input_controller.Key_Menu = true
    }
  }

  keyUp(event) {
    let input_controller = this

    //handle certain keyboards that use Left instead of ArrowLeft
    if (
      event.key == "Left" &&
      input_controller.KeyMappings.Mapping_Left == "ArrowLeft"
    )
      event = new KeyboardEvent("", { key: "ArrowLeft" })
    if (
      event.key == "Right" &&
      input_controller.KeyMappings.Mapping_Right == "ArrowRight"
    )
      event = new KeyboardEvent("", { key: "ArrowRight" })
    if (
      event.key == "Up" &&
      input_controller.KeyMappings.Mapping_Up == "ArrowUp"
    )
      event = new KeyboardEvent("", { key: "ArrowUp" })
    if (
      event.key == "Down" &&
      input_controller.KeyMappings.Mapping_Down == "ArrowDown"
    )
      event = new KeyboardEvent("", { key: "ArrowDown" })

    //player 1
    if (event.key == input_controller.KeyMappings.Mapping_Down) {
      input_controller.Key_Down = false
    }
    if (event.key == input_controller.KeyMappings.Mapping_Up) {
      input_controller.Key_Up = false
    }
    if (event.key == input_controller.KeyMappings.Mapping_Left) {
      input_controller.Key_Left = false
    }
    if (event.key == input_controller.KeyMappings.Mapping_Right) {
      input_controller.Key_Right = false
    }
    if (event.key == input_controller.KeyMappings.Mapping_Action_Start) {
      input_controller.Key_Action_Start = false
    }
    if (event.key == input_controller.KeyMappings.Mapping_Action_CUP) {
      input_controller.Key_Action_CUP = false
    }
    if (event.key == input_controller.KeyMappings.Mapping_Action_CDOWN) {
      input_controller.Key_Action_CDOWN = false
    }
    if (event.key == input_controller.KeyMappings.Mapping_Action_CLEFT) {
      input_controller.Key_Action_CLEFT = false
    }
    if (event.key == input_controller.KeyMappings.Mapping_Action_CRIGHT) {
      input_controller.Key_Action_CRIGHT = false
    }
    if (event.key == input_controller.KeyMappings.Mapping_Action_B) {
      input_controller.Key_Action_B = false
    }
    if (event.key == input_controller.KeyMappings.Mapping_Action_Z) {
      input_controller.Key_Action_Z = false
    }
    if (event.key == input_controller.KeyMappings.Mapping_Action_L) {
      input_controller.Key_Action_L = false
    }
    if (event.key == input_controller.KeyMappings.Mapping_Action_R) {
      input_controller.Key_Action_R = false
    }
    if (event.key == input_controller.KeyMappings.Mapping_Action_A) {
      input_controller.Key_Action_A = false
    }
    if (event.key == input_controller.KeyMappings.Mapping_Menu) {
      input_controller.Key_Menu = false
    }
  }

  update() {
    //a hack - need to refactor
    if (this.Remap_Check) {
      if (this.Key_Last != "") {
        this.Remap_Check = false
      }
    }
  }
}
