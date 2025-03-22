import mongoose from 'mongoose'
import config from './app/config'
import { server } from './app'
async function main() {
  try {
    await mongoose.connect(config.database_url as string)
    server.listen(config.port, () => {
      console.log(`RELIST app listening on port ${config.port}`)
    })
  } catch (err) {
    console.log(err)
  }
}
main()
export default server;
