import getConfig from "../config/Config";
import { ExpressApp } from "./Express"



export class App {

    private app = new ExpressApp().express;


    constructor() {

    }

    public initServer = () => {
        const env = getConfig();
        this.app.listen(env.PORT, () => {
            console.log(`🔥 Server Started listen on http://localhost:${env.PORT}`)
        })

    }


}