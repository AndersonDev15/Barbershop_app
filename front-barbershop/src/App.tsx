import AppRouter from "./routes/AppRouter";
import AuthInitializer from "./features/auth/AuthInitializer";
import InactiveBarberiaToast from "./components/InactiveBarberiaToast";
import ErrorToast from "./components/ErrorToast";
export default function App() {
  return (
    <>
      <AuthInitializer />
      <AppRouter />
      <InactiveBarberiaToast />
      <ErrorToast />
    </>
  );
}
