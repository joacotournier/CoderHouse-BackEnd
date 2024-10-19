import express from "express";
import productRoutes from "./routes/products";
import cartRoutes from "./routes/carts";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PUERTO = 8080;

app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);

app.listen(PUERTO, () => {
  console.log("El servidor esta corriendo en el puerto 8080");
});
