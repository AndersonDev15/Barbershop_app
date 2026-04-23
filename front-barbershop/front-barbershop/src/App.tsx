import AppRouter from "./routes/AppRouter";
import AuthInitializer from "./features/auth/AuthInitializer";
import InactiveBarberiaToast from "./components/InactiveBarberiaToast";

export default function App() {
  return (
    <>
      <AuthInitializer />
      <AppRouter />
      <InactiveBarberiaToast />
    </>
  );
}
