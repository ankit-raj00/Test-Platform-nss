import conf from "../Conf/conf";
import { Client, Databases, Query } from "appwrite";

export class Service {
    client = new Client();
    databases;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
    }

    // Function to get all data from the collection
    async getAllData() {
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId
            );

            // Log and return the data
            console.log("Retrieved Data:", response.documents);
            return response.documents;
        } catch (error) {
            console.log("Appwrite service :: getAllData :: error", error);
            return [];
        }
    }
}


const service = new Service();
export default service;
