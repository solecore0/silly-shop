import Mongoose from "mongoose";

export const connectToDB = (uri: string) => {
  Mongoose.connect(uri, {
    dbName: "SillyShopDB_2024",
  })
    .then((c) =>
      console.log("Database Successfully Connected TO " + c.connection.host)
    )
    .catch((e) => console.log(e));
};
