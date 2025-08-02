import { useState, useEffect } from "react";
import database from '../data/db.json';
import { formatDateTime } from "../services/utility";
import { ChevronDown, LogOutIcon, Menu, X } from "lucide-react";

interface DashboardProps {
  user: {
    id: number;
    username: string;
  };
  onLogout: () => void;
}

interface TimeRecord {
  id: number;
  userId: number;
  userName: string;
  timeIn: string;
  timeOut: string | null;
  date: string;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>(database.timeRecords as TimeRecord[]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isTimedIn, setIsTimedIn] = useState(false);
  const [lastTimeIn, setLastTimeIn] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const recordsPerPage = 10;

  useEffect(() => {
    const userRecords = timeRecords.filter(record => record.userId === user.id);
    const lastRecord = userRecords[userRecords.length - 1];
    if (lastRecord && !lastRecord.timeOut) {
      setIsTimedIn(true);
      setLastTimeIn(lastRecord.timeIn);
    }
  }, [timeRecords, user.id]);

  const handleTimeIn = () => {
    const newRecord = {
      id: Date.now(),
      userId: user.id,
      userName: user.username,
      timeIn: new Date().toISOString(),
      timeOut: null,
      date: new Date().toDateString()
    };
    
    const updatedRecords = [...timeRecords, newRecord];
    setTimeRecords(updatedRecords);
    (database.timeRecords as TimeRecord[]) = updatedRecords;
    setIsTimedIn(true);
    setLastTimeIn(newRecord.timeIn);
  };

  const handleTimeOut = () => {
    const updatedRecords = timeRecords.map(record => {
      if (record.userId === user.id && !record.timeOut) {
        return { ...record, timeOut: new Date().toISOString() };
      }
      return record;
    });
    
    setTimeRecords(updatedRecords);
    (database.timeRecords as TimeRecord[]) = updatedRecords;
    setIsTimedIn(false);
    setLastTimeIn(null);
  };

  const userRecords = timeRecords.filter(record => record.userId === user.id);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentRecords = userRecords.slice(startIndex, startIndex + recordsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-dark shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-bold text-white">
              Exam <span className="text-highlight">track</span>
            </h1>

            {/* Desktop Navigation */}
            <nav className="hidden lg:block">
              <ul className="flex space-x-6 items-center">
                <li>
                  <a href="#" className="text-white hover:text-gray-300 inline-flex items-center gap-1">
                    My Request <ChevronDown className="w-4 h-4" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white hover:text-gray-300 inline-flex items-center gap-1">
                    Administration Tools <ChevronDown className="w-4 h-4" />
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 hover:opacity-80 text-white">
                    <img
                      src="/src/assets/avatar.png"
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="hidden xl:inline">My Account</span>
                    <ChevronDown className="w-4 h-4 text-white" />
                  </a>
                </li>
                <li>
                  <LogOutIcon 
                    onClick={onLogout} 
                    className="text-error cursor-pointer hover:opacity-80"
                  />
                </li>
              </ul>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-white p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-600 py-4">
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-white hover:text-gray-300 flex items-center justify-between py-2">
                    My Request <ChevronDown className="w-4 h-4" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white hover:text-gray-300 flex items-center justify-between py-2">
                    Administration Tools <ChevronDown className="w-4 h-4" />
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 hover:opacity-80 text-white py-2">
                    <img
                      src="/src/assets/avatar.png"
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full"
                    />
                    My Account
                    <ChevronDown className="w-4 h-4 text-white ml-auto" />
                  </a>
                </li>
                <li>
                  <button 
                    onClick={onLogout}
                    className="flex items-center gap-2 text-error py-2 hover:opacity-80"
                  >
                    <LogOutIcon className="w-5 h-5" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col xl:flex-row gap-6 lg:gap-10">
          {/* Time In/Out Card */}
          <div className="bg-white rounded-lg shadow-md flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gradient-to-r from-blue-500 to-indigo-600 px-4 sm:px-6 py-3 rounded-t-md gap-3 sm:gap-0">
              <h2 className="text-lg font-semibold text-white capitalize">My Attendance</h2>

              {isTimedIn ? (
                <button
                  onClick={handleTimeOut}
                  className="flex items-center justify-center px-4 sm:px-5 py-2 rounded-md font-semibold transition-colors bg-dark text-white border border-white hover:bg-slate-800 cursor-pointer text-sm sm:text-base"
                >
                  Time Out
                </button>
              ) : (
                <button
                  onClick={handleTimeIn}
                  className="flex items-center justify-center px-4 sm:px-5 py-2 rounded-md font-semibold border transition-colors bg-white text-primary border-primary cursor-pointer  text-sm sm:text-base"
                >
                  Time In
                </button>
              )}
            </div>
            
            {userRecords.length === 0 ? (
              <div className="p-6 sm:p-8 text-center text-gray-500">
                <p className="text-sm sm:text-base">No time records found. Start by timing in!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {/* Desktop Table View */}
                <div className="hidden sm:block p-3">
                  <table className="w-full">
                    <thead >
                      <tr>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time In
                        </th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time Out
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDateTime(record.date).split(',')[0]}
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDateTime(record.timeIn).split(',')[1]}
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.timeOut ? formatDateTime(record.timeOut).split(',')[1] : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="sm:hidden">
                  {currentRecords.map((record) => (
                    <div key={record.id} className="border-b border-gray-200 p-4 last:border-b-0">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-gray-500 uppercase">Date</span>
                          <span className="text-sm text-gray-900">{record.date}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-gray-500 uppercase">Time In</span>
                          <span className="text-sm text-gray-900">{formatDateTime(record.timeIn)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-gray-500 uppercase">Time Out</span>
                          <span className="text-sm text-gray-900">
                            {record.timeOut ? formatDateTime(record.timeOut) : '-'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Leave Credit Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden w-full xl:max-w-md xl:flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gradient-to-r from-blue-500 to-indigo-600 px-4 sm:px-6 py-3 rounded-t-md gap-3 sm:gap-0">
              <h2 className="text-lg font-semibold text-white capitalize">Leave Credits</h2>

              <button
                onClick={() => alert('Apply for leave')}
                className="flex items-center justify-center px-4 sm:px-5 py-2 rounded-md font-semibold border transition-colors bg-white text-primary border-primary cursor-pointer  text-sm sm:text-base"
              >
                Apply
              </button>
              
            </div>
            <div className="px-10 sm:px-6 pb-4 mt-6">
              <p className="text-secondary/50 text-sm w-full text-center">Leaves </p>
              <ul className="divide-y divide-gray-200 space-y-2">
                <li className="text-lg text-secondary pb-2 inline-flex justify-between w-full">Vacation: <span>7</span></li>
                <li className="text-lg text-secondary pb-2  inline-flex justify-between w-full">Sick: <span>5</span></li>
                <li className="text-lg text-secondary pb-2  inline-flex justify-between w-full">Bereavement: <span>3</span></li>
                <li className="text-lg text-secondary pb-2  inline-flex justify-between w-full">Emergency Leave: <span>2</span></li>
                <li className="text-lg text-secondary pb-2 inline-flex justify-between w-full">Offset Leave: <span>0</span></li>
                <li className="text-lg text-secondary pb-2  inline-flex justify-between w-full">Compensatory Leave: <span>0</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;