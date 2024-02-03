import dotenv from 'dotenv'
dotenv.config()
import { AppDataSource } from "./data-source"
import app from "./app/app"
import setupBackgroundTasks from "./backgroundTask"

const PORT = process.env.PORT || 8000

AppDataSource.initialize().then(async () => {
    console.log("App data source initialized.")

}).catch(error => console.log(error))

setupBackgroundTasks()

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`)
})
