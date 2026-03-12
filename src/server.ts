import app from "./app";
import { connectDB } from "./config/mongodb.config";

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});