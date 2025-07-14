import "./globals.css";
import TopBarNavigationMain from "@/components/Navigation/TopBarNavigationMain";
import { ToastContainer } from "react-toastify";
import EditorContext from "@/context/ConextEditor";
import ContratoContext from "@/context/ContratosContext";
import ContextCardComp from "@/context/ContextCard";

export const metadata = {
  title: "Notaria Rojas Jaen",
  description: "Aplicacion de notaria ROJAS JAEN en Piura",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`font-poppins text-[#0C1019]`}
      >
        <EditorContext>
          <ContratoContext>
            <ContextCardComp>
          <TopBarNavigationMain/>
          {children}
          
          <ToastContainer
            position="bottom"
          />
          </ContextCardComp>
          </ContratoContext>
        </EditorContext>
      </body>
    </html>
  );
}
