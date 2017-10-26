const fs = require('fs')
const util = require('util')
const readFile = util.promisify(fs.readFile)
const FlashEmu = require('flash-emu')
FlashEmu.PLAYERGLOBAL = 'node_modules/flash-emu/lib/playerglobal.abc'
FlashEmu.BUILTIN = 'node_modules/flash-emu/lib/builtin.abc'
const emu = new FlashEmu({
  async readFile (filename) {
    const buf = await readFile(filename)
    return new Uint8Array(buf).buffer
  }
})
const vm = emu.getVM()
emu.runSWF('example.swf', false).then(() => {
  const CModule = vm.getProxy(emu.getProperty('sample.mp', 'CModule'))
  CModule.callProperty('startAsync')
  let somePtr = CModule.callProperty('malloc', 4)
  console.log('ptr:', somePtr)
  CModule.callProperty('free', somePtr)
}).catch(e => console.error(e))
