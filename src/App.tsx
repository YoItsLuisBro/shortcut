import { Route, Routes } from "react-router";

import { AppShell } from "./layouts/AppShell";
import { DiscoveryPage } from "./pages/DiscoveryPage";
import { LibraryPage } from "./pages/LibraryPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PracticePage } from "./pages/PracticePage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<DiscoveryPage />} />

        <Route path="library" element={<LibraryPage />} />

        <Route path="practice" element={<PracticePage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
