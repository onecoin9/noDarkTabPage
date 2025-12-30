import {
  Clock,
  SearchBox,
  BookmarkGrid,
  SettingsPanel,
  SettingsButton,
  Background,
  CustomCss,
} from './components';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-10 relative" style={{ minHeight: '100vh' }}>
      <Background />
      <CustomCss />
      <SettingsButton />
      <SettingsPanel />

      <main className="w-full max-w-4xl flex flex-col items-center gap-10 z-10">
        <Clock />
        <SearchBox />
        <BookmarkGrid />
      </main>
    </div>
  );
}

export default App;
