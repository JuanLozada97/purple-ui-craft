import { Activity } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <Activity className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold">Dashboard Médico</h1>
            <p className="text-sm opacity-90">Indigo Vie Cloud Platform</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
