import { ROM_LIST, SETTINGS } from "./constants"
import { InputController } from "./controls"
const AUDIOBUFFSIZE = 1024

export class N64 {
  constructor() {
    this.rom_name = ""
    this.audioInited = false
    this.canvasSize = 640

    const Module = {
      onRuntimeInitialized: this.initModule,
      canvas: document.getElementById("canvas"),
    }
    window["Module"] = Module

    this.rivetsData = {
      beforeEmulatorStarted: true,
      moduleInitializing: true,
      audioSkipCount: 0,
      inputController: null,
      remappings: null,
      remapMode: "",
      currKey: 0,
      remappingPlayer1: false,
      hasRoms: false,
      romList: [],
      inputLoopStarted: false,
      noLocalSave: true,
      lblError: "",
      chkAdvanced: false,
      doubleSpeed: false,
      showDoubleSpeed: false,
      swapSticks: false,
      mouseMode: false,
      useZasCMobile: false,
      showFPS: true,
      disableAudioSync: true,
      hadNipple: false,
      hadFullscreen: false,
      forceAngry: false,
      cheats: [],
      settings: {
        CLOUDSAVEURL: "",
        SHOWADVANCED: false,
        SHOWOPTIONS: false,
      },
    }

    this.rivetsData.settings = SETTINGS

    if (ROM_LIST.length > 0) {
      this.rivetsData.hasRoms = true
      ROM_LIST.forEach((rom) => {
        this.rivetsData.romList.push(rom)
      })
    }
  }

  inputLoop = () => {
    this.rivetsData.inputController.update()
    if (this.rivetsData.beforeEmulatorStarted) {
      setTimeout(() => {
        this.inputLoop()
      }, 100)
    }
  }

  toggleDoubleSpeed = () => {
    if (this.rivetsData.doubleSpeed) {
      this.rivetsData.doubleSpeed = false
      this.setDoubleSpeed(0)
    } else {
      this.rivetsData.doubleSpeed = true
      this.setDoubleSpeed(1)
    }
  }

  LoadEmulator = async (byteArray) => {
    if (this.rom_name.toLocaleLowerCase().endsWith(".zip")) {
      this.rivetsData.lblError =
        "Zip format not supported. Please uncompress first."
      this.rivetsData.beforeEmulatorStarted = false
    } else {
      await this.writeAssets()
      FS.writeFile("custom.v64", byteArray)
      this.beforeRun()
      this.WriteConfigFile()
      this.initAudio() //need to initAudio before next call for iOS to work
      await this.LoadSram()
      console.debug({ Module })
      Module.callMain(["custom.v64"])
      this.rivetsData.beforeEmulatorStarted = false
      this.setRemainingAudio = Module.cwrap("neil_set_buffer_remaining", null, [
        "number",
      ])
      this.setDoubleSpeed = Module.cwrap("neil_set_double_speed", null, [
        "number",
      ])
    }
  }

  writeAssets = async () => {
    let file = "assets.zip"
    let responseText = await this.downloadFile(file)
    console.log(file, responseText.length)
    FS.writeFile(
      file, // file name
      responseText
    )
  }

  reset = () => {
    Module._neil_reset()
  }

  downloadFile = async (url) => {
    return new Promise(function (resolve, reject) {
      var oReq = new XMLHttpRequest()
      oReq.open("GET", url, true)
      oReq.responseType = "arraybuffer"
      oReq.onload = function (oEvent) {
        var arrayBuffer = oReq.response
        var byteArray = new Uint8Array(arrayBuffer)
        resolve(byteArray)
      }
      oReq.onerror = function () {
        reject({
          status: oReq.status,
          statusText: oReq.statusText,
        })
      }
      oReq.send()
    })
  }

  setRomName = (name) => {
    this.rom_name = name
  }

  initAudio = async () => {
    if (!this.audioInited) {
      this.audioInited = true
      this.audioContext = new AudioContext({
        latencyHint: "interactive",
        sampleRate: 44100, //this number has to match what's in gui.cpp
      })
      this.gainNode = this.audioContext.createGain()
      this.gainNode.gain.value = 0.5
      this.gainNode.connect(this.audioContext.destination)

      //point at where the emulator is storing the audio buffer
      this.audioBufferResampled = new Int16Array(
        Module.HEAP16.buffer,
        Module._neilGetSoundBufferResampledAddress(),
        64000
      )

      this.audioWritePosition = 0
      this.audioReadPosition = 0
      this.audioBackOffCounter = 0
      this.audioThreadLock = false

      //emulator is synced to the OnAudioProcess event because it's way
      //more accurate than emscripten_set_main_loop or RAF
      //and the old method was having constant emulator slowdown swings
      //so the audio suffered as a result
      this.pcmPlayer = this.audioContext.createScriptProcessor(
        AUDIOBUFFSIZE,
        2,
        2
      )
      this.pcmPlayer.onaudioprocess = this.AudioProcessRecurring.bind(this)
      this.pcmPlayer.connect(this.gainNode)
    }
  }

  hasEnoughSamples = () => {
    let readPositionTemp = this.audioReadPosition
    let enoughSamples = true
    for (let sample = 0; sample < AUDIOBUFFSIZE; sample++) {
      if (this.audioWritePosition != readPositionTemp) {
        readPositionTemp += 2

        //wrap back around within the ring buffer
        if (readPositionTemp == 64000) {
          readPositionTemp = 0
        }
      } else {
        enoughSamples = false
      }
    }

    return enoughSamples
  }

  //this method keeps getting called when it needs more audio
  //data to play so we just keep streaming it from the emulator
  AudioProcessRecurring = (audioProcessingEvent) => {
    //I think this method is thread safe but just in case
    if (this.audioThreadLock || this.rivetsData.beforeEmulatorStarted) {
      // console.log('audio thread dupe');
      return
    }

    this.audioThreadLock = true

    var sampleRate = audioProcessingEvent.outputBuffer.sampleRate
    let outputBuffer = audioProcessingEvent.outputBuffer
    let outputData1 = outputBuffer.getChannelData(0)
    let outputData2 = outputBuffer.getChannelData(1)

    if (this.rivetsData.disableAudioSync) {
      this.audioWritePosition = Module._neilGetAudioWritePosition()
    } else {
      Module._runMainLoop()

      this.audioWritePosition = Module._neilGetAudioWritePosition()

      if (!this.hasEnoughSamples()) {
        Module._runMainLoop()
      }

      this.audioWritePosition = Module._neilGetAudioWritePosition()
    }

    // if (!this.hasEnoughSamples())
    //     console.log('not enough samples');

    // console.log('Write: ' + this.audioWritePosition + ' Read: ' + this.audioReadPosition);

    let hadSkip = false

    //the bytes are arranged L,R,L,R,etc.... for each speaker
    for (let sample = 0; sample < AUDIOBUFFSIZE; sample++) {
      if (this.audioWritePosition != this.audioReadPosition) {
        outputData1[sample] =
          this.audioBufferResampled[this.audioReadPosition] / 32768
        outputData2[sample] =
          this.audioBufferResampled[this.audioReadPosition + 1] / 32768

        this.audioReadPosition += 2

        //wrap back around within the ring buffer
        if (this.audioReadPosition == 64000) {
          this.audioReadPosition = 0
        }
      } else {
        //if there's nothing to play then just play silence
        outputData1[sample] = 0
        outputData2[sample] = 0

        //if we caught up on samples then back off
        //for 2 frames to buffer some audio
        // if (this.audioBackOffCounter == 0) {
        //     this.audioBackOffCounter = 2;
        // }

        hadSkip = true
      }
    }

    if (hadSkip) this.rivetsData.audioSkipCount++

    //calculate remaining audio in buffer
    let audioBufferRemaining = 0
    let readPositionTemp = this.audioReadPosition
    let writePositionTemp = this.audioWritePosition
    for (let i = 0; i < 64000; i++) {
      if (readPositionTemp != writePositionTemp) {
        readPositionTemp += 2
        audioBufferRemaining += 2

        if (readPositionTemp == 64000) {
          readPositionTemp = 0
        }
      }
    }

    this.setRemainingAudio(audioBufferRemaining)
    this.audioThreadLock = false
  }

  beforeRun = () => {
    //add any overriding logic here before the emulator starts
  }

  WriteConfigFile = () => {
    let configString = "1\r\n".repeat(15)

    //keyboard
    configString +=
      this.rivetsData.inputController.KeyMappings.Mapping_Left + "\r\n"
    configString +=
      this.rivetsData.inputController.KeyMappings.Mapping_Right + "\r\n"
    configString +=
      this.rivetsData.inputController.KeyMappings.Mapping_Up + "\r\n"
    configString +=
      this.rivetsData.inputController.KeyMappings.Mapping_Down + "\r\n"
    configString +=
      this.rivetsData.inputController.KeyMappings.Mapping_Action_Start + "\r\n"
    configString +=
      this.rivetsData.inputController.KeyMappings.Mapping_Action_CUP + "\r\n"
    configString +=
      this.rivetsData.inputController.KeyMappings.Mapping_Action_CDOWN + "\r\n"
    configString +=
      this.rivetsData.inputController.KeyMappings.Mapping_Action_CLEFT + "\r\n"
    configString +=
      this.rivetsData.inputController.KeyMappings.Mapping_Action_CRIGHT + "\r\n"
    configString +=
      this.rivetsData.inputController.KeyMappings.Mapping_Action_Z + "\r\n"
    configString +=
      this.rivetsData.inputController.KeyMappings.Mapping_Action_L + "\r\n"
    configString +=
      this.rivetsData.inputController.KeyMappings.Mapping_Action_R + "\r\n"
    configString +=
      this.rivetsData.inputController.KeyMappings.Mapping_Action_B + "\r\n"
    configString +=
      this.rivetsData.inputController.KeyMappings.Mapping_Action_A + "\r\n"
    configString +=
      this.rivetsData.inputController.KeyMappings.Mapping_Menu + "\r\n"
    configString +=
      this.rivetsData.inputController.KeyMappings.Mapping_Action_Analog_Up +
      "\r\n"
    configString +=
      this.rivetsData.inputController.KeyMappings.Mapping_Action_Analog_Down +
      "\r\n"
    configString +=
      this.rivetsData.inputController.KeyMappings.Mapping_Action_Analog_Left +
      "\r\n"
    configString +=
      this.rivetsData.inputController.KeyMappings.Mapping_Action_Analog_Right +
      "\r\n"

    //load save files
    configString += "0\r\n".repeat(3)

    //show FPS
    if (this.rivetsData.showFPS) configString += "1" + "\r\n"
    else configString += "0" + "\r\n"

    //swap sticks
    if (this.rivetsData.swapSticks) configString += "1" + "\r\n"
    else configString += "0" + "\r\n"

    //disable audio sync
    if (this.rivetsData.disableAudioSync) configString += "1" + "\r\n"
    else configString += "0" + "\r\n"

    //invert player Y axis - off
    configString += "0\r\n".repeat(3)

    // mobile mode off
    configString += "0\r\n".repeat(4)

    FS.writeFile("config.txt", configString)

    //we don't allow double speed when doing audio sync
    if (!this.rivetsData.disableAudioSync) {
      this.rivetsData.showDoubleSpeed = false
    }
  }

  uploadRom = (event) => {
    const app = this
    var file = event.currentTarget.files[0]
    this.rom_name = file.name
    console.log(file)
    var reader = new FileReader()
    reader.onprogress = function (e) {
      console.log("loaded: " + e.loaded)
    }
    reader.onload = function (e) {
      console.log("finished loading")
      var byteArray = new Uint8Array(this.result)
      app.LoadEmulator(byteArray)
    }
    reader.readAsArrayBuffer(file)
  }

  initModule = async () => {
    console.log("module initialized")
    this.rivetsData.moduleInitializing = false
  }

  preventDefaults = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  extractRomName = (name) => {
    if (name.includes("/")) return name.substr(name.lastIndexOf("/") + 1)
    return name
  }

  LoadSram = async () => {
    const app = this
    return new Promise(function (resolve, reject) {
      var request = indexedDB.open("N64WASMDB")
      try {
        request.onsuccess = function (ev) {
          var db = ev.target.result
          var romStore = db
            .transaction("N64WASMSTATES", "readwrite")
            .objectStore("N64WASMSTATES")
          var rom = romStore.get(app.rom_name + ".sram")
          rom.onsuccess = function (event) {
            if (rom.result) {
              let byteArray = rom.result //Uint8Array
              FS.writeFile("/game.savememory", byteArray)
            }
            resolve()
          }
          rom.onerror = function (event) {
            reject()
          }
        }
        request.onerror = function (ev) {
          reject()
        }
      } catch (error) {
        reject()
      }
    })
  }

  SaveSram = () => {
    const app = this
    let data = FS.readFile("/game.savememory") //this is a Uint8Array

    var request = indexedDB.open("N64WASMDB")
    request.onsuccess = function (ev) {
      var db = ev.target.result
      var romStore = db
        .transaction("N64WASMSTATES", "readwrite")
        .objectStore("N64WASMSTATES")
      var addRequest = romStore.put(data, app.rom_name + ".sram")
      addRequest.onsuccess = function (event) {
        console.log("sram added")
      }
      addRequest.onerror = function (event) {
        console.log("error adding sram")
        console.log(event)
      }
    }
  }

  //when it returns from emscripten
  SaveStateEvent = () => {
    console.log("js savestate event")
  }

  setupInputController = () => {
    this.rivetsData.inputController = new InputController(this)
  }

  fullscreen = () => {
    try {
      let el = document.getElementById("canvas")

      //window["myApp"].rivetsData.hadFullscreen = true

      if (el.webkitRequestFullScreen) {
        el.webkitRequestFullScreen()
      } else {
        el.mozRequestFullScreen()
      }
    } catch (error) {
      console.log("full screen failed")
    }
  }

  remapPressed = () => {
    if (this.rivetsData.remapMode == "Key") {
      var keyLast = this.rivetsData.inputController.Key_Last

      //player 1
      if (this.rivetsData.currKey == 1)
        this.rivetsData.remappings.Mapping_Up = keyLast
      if (this.rivetsData.currKey == 2)
        this.rivetsData.remappings.Mapping_Down = keyLast
      if (this.rivetsData.currKey == 3)
        this.rivetsData.remappings.Mapping_Left = keyLast
      if (this.rivetsData.currKey == 4)
        this.rivetsData.remappings.Mapping_Right = keyLast
      if (this.rivetsData.currKey == 5)
        this.rivetsData.remappings.Mapping_Action_A = keyLast
      if (this.rivetsData.currKey == 6)
        this.rivetsData.remappings.Mapping_Action_B = keyLast
      if (this.rivetsData.currKey == 8)
        this.rivetsData.remappings.Mapping_Action_Start = keyLast
      if (this.rivetsData.currKey == 9)
        this.rivetsData.remappings.Mapping_Menu = keyLast
      if (this.rivetsData.currKey == 10)
        this.rivetsData.remappings.Mapping_Action_Z = keyLast
      if (this.rivetsData.currKey == 11)
        this.rivetsData.remappings.Mapping_Action_L = keyLast
      if (this.rivetsData.currKey == 12)
        this.rivetsData.remappings.Mapping_Action_R = keyLast
      if (this.rivetsData.currKey == 13)
        this.rivetsData.remappings.Mapping_Action_CUP = keyLast
      if (this.rivetsData.currKey == 14)
        this.rivetsData.remappings.Mapping_Action_CDOWN = keyLast
      if (this.rivetsData.currKey == 15)
        this.rivetsData.remappings.Mapping_Action_CLEFT = keyLast
      if (this.rivetsData.currKey == 16)
        this.rivetsData.remappings.Mapping_Action_CRIGHT = keyLast
      if (this.rivetsData.currKey == 17)
        this.rivetsData.remappings.Mapping_Action_Analog_Up = keyLast
      if (this.rivetsData.currKey == 18)
        this.rivetsData.remappings.Mapping_Action_Analog_Down = keyLast
      if (this.rivetsData.currKey == 19)
        this.rivetsData.remappings.Mapping_Action_Analog_Left = keyLast
      if (this.rivetsData.currKey == 20)
        this.rivetsData.remappings.Mapping_Action_Analog_Right = keyLast
    }

    this.rivetsData.remapWait = false
  }

  localCallback = () => {}
}
