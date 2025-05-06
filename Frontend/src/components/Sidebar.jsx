import {React , useEffect , useState} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaUsers, 
  FaClipboardList, 
  FaBell, 
  FaFileExport, 
  FaCog, 
  FaChartBar,
  FaPlus,
  FaSignOutAlt
} from 'react-icons/fa';

function Sidebar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/');
  };
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FaHome size={20} /> },
    { name: 'Members', path: '/members', icon: <FaUsers size={20} /> },
    { name: 'Checklists', path: '/checklists', icon: <FaClipboardList size={20} /> },
    { name: 'Notifications', path: '/notifications', icon: <FaBell size={20} /> },
    { name: 'Export', path: '/export', icon: <FaFileExport size={20} /> },
    { name: 'Settings', path: '/settings', icon: <FaCog size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <FaChartBar size={20} /> },
  ];

  return (
    <div className="w-64 bg-white h-screen shadow-md py-8 flex flex-col">
      <div className="px-6 mb-8">
        <h1 className="text-2xl font-bold text-primary-600">PackPal</h1>
        <p className="text-sm text-gray-500">Group Packing Made Easy</p>
      </div>
      
      <div className="px-6 mb-4">
        <Link
          to="/new-event"
          className="flex items-center justify-center w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          <FaPlus className="mr-2" />
          New Event
        </Link>
      </div>
      
      <nav className="flex-1">
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mb-2">
              <Link
                to={item.path}
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors ${
                  location.pathname === item.path ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-600' : ''
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="px-6 mt-auto">
        <div className="p-4 bg-primary-50 rounded-lg">
          <p className="text-sm text-primary-800 font-medium">Need help?</p>
          <p className="text-xs text-primary-600 mt-1">Check our documentation or contact support</p>
        </div>
        <button
              onClick={handleLogout}
              className={`group flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isScrolled
                  ? 'bg-blue-200 hover:bg-red-50 text-gray-600 hover:text-red-600'
                  : 'bg-blue-500 hover:bg-blue-800 text-white hover:text-red-100'
              }`}
            >
              <FaSignOutAlt 
                size={20} 
                className="transform transition-transform duration-300 group-hover:rotate-180" 
              />
              <span className="font-medium hidden sm:inline">Logout</span>
            </button>
      </div>
    </div>
  );
}

export default Sidebar; 