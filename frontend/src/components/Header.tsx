/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/components/store/userStore';
import { 
  LogOut, 
  UserIcon, 
  HistoryIcon, 
  FilePlusIcon, 
  AmbulanceIcon,
  HeartPulseIcon, 
} from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = useUserStore((state: any) => state.user);
  const resetUser = useUserStore((state: any) => state.resetUser);
  
  console.log(user);
  console.log(token);
  const handleLogout = () => {
    localStorage.removeItem('token');
    resetUser();
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between p-4 bg-background text-foreground shadow-sm">
      <div>
        <Button 
          variant="ghost" 
          className="text-xl font-bold hover:bg-muted"
          onClick={() => navigate('/')}
        >
          Neuro - Assist
        </Button>
      </div>
      <nav className="flex gap-2">
        {user ? (
          <>
            {user.role === 'Patient' ? (
              <>
                <Button 
                  variant="outline" 
                  className="hover:bg-secondary hover:text-secondary-foreground"
                  onClick={() => navigate('/patient/history')}
                >
                  <HistoryIcon className="mr-2 h-4 w-4" />
                  History
                </Button>
                <Button 
                  variant="outline" 
                  className="hover:bg-secondary hover:text-secondary-foreground"
                  onClick={() => navigate('/patient/profile')}
                >
                  <UserIcon className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : user.role === 'Hospital' ? (
              <>
                <Button 
                  variant="outline" 
                  className="hover:bg-secondary hover:text-secondary-foreground"
                  onClick={() => navigate('/hospital/history')}
                >
                  <HistoryIcon className="mr-2 h-4 w-4" />
                  History
                </Button>
                <Button 
                  variant="outline" 
                  className="hover:bg-secondary hover:text-secondary-foreground"
                  onClick={() => navigate('/hospital/cases')}
                >
                  <FilePlusIcon className="mr-2 h-4 w-4" />
                  New Cases
                </Button>
                <Button 
                  variant="outline" 
                  className="hover:bg-secondary hover:text-secondary-foreground"
                  onClick={() => navigate('/hospital/emergency')}
                >
                  <AmbulanceIcon className="mr-2 h-4 w-4" />
                  Emergency Admit
                </Button>
                <Button 
                  variant="outline" 
                  className="hover:bg-secondary hover:text-secondary-foreground"
                  onClick={() => navigate('/guidelines')}
                >
                  <HeartPulseIcon className="mr-2 h-4 w-4" />
                  Guidelines
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : null}
          </>
        ) : (
          <Button 
            variant="default" 
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        )}
      </nav>
    </header>
  );
};

export default Header;