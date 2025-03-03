// import { Button } from './ui/button';
// import { useNavigate } from 'react-router-dom';
// import { useUserStore } from '@/components/store/userStore';


// const Header = () => {
//   const navigate = useNavigate();
//   const { user, resetUser } = useUserStore(
//     (state) => ({
//       user: state.user,
//       resetUser: state.resetUser,
//     }),
//   );
//   console.log(user);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     resetUser();
//     navigate('/login');
//   };

//   return (
//     <header className="flex items-center justify-between p-4 bg-gray-100">
//       <div>
//         <Button onClick={() => navigate('/')}>Neuro - Assist</Button>
//       </div>
//       <nav className="flex gap-2">
//         {user ? (
//           <>
//             {user.role === 'Patient' ? (
//               <>
//                 <Button onClick={() => navigate('/patient/history')}>Show History</Button>
//                 <Button onClick={() => navigate('/patient/profile')}>View Profile</Button>
//                 <Button onClick={() => navigate('/patient/guidelines')}>Guidelines</Button>
//                 <Button onClick={handleLogout}>Logout</Button>
//               </>
//             ) : user.role === 'Hospital' ? (
//               <>
//                 <Button onClick={() => navigate('/hospital/history')}>History</Button>
//                 <Button onClick={() => navigate('/hospital/new-cases')}>New Cases</Button>
//                 <Button onClick={() => navigate('/hospital/emergency-admit')}>Emergency Admit</Button>
//                 <Button onClick={() => navigate('/hospital/guidelines')}>Guidelines</Button>
//                 <Button onClick={handleLogout}>Logout</Button>
//               </>
//             ) : null}
//           </>
//         ) : (
//           <Button onClick={() => navigate('/login')}>Login</Button>
//         )}
//       </nav>
//     </header>
//   );
// };

// export default Header;

import React from 'react'

const Header = () => {
  return (
    <div>
      Hi
    </div>
  )
}

export default Header
