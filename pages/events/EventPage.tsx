/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useMemo, useEffect } from 'react';
import EventCard from '../../components/EventCard';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import FloatingHelpButton from '../../components/FloatingHelpButton';
import { Search, ChevronLeft, ChevronRight, Filter as FilterIcon, ChevronDown, ChevronUp } from 'lucide-react'; 
import { EventData, PageName, UserRole } from '../../HegiraApp'; // Renamed import

interface EventPageProps {
  events?: EventData[]; 
  onNavigate?: (page: PageName, data?: any) => void;
}

const ITEMS_PER_PAGE = 9; 

const EventPage: React.FC<EventPageProps> = ({ events = [], onNavigate }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Festivals']); // Example, can be dynamic
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Default values for standalone mode
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('visitor');
  const [userName, setUserName] = useState('Pengunjung');
  const [currentPageName, setCurrentPageName] = useState<PageName>('events');

  // Mock data for standalone mode
  const mockEvents: EventData[] = [
    {
      id: 1,
      category: 'B2C',
      name: 'Festival Musik Jakarta 2024',
      location: 'Jakarta Convention Center',
      dateDisplay: '15 Desember 2024',
      timeDisplay: '19:00 WIB',
      fullDescription: 'Festival musik terbesar di Jakarta dengan berbagai genre musik dari lokal hingga internasional.',
      ticketCategories: [
        {
          id: '1',
          name: 'VIP',
          price: 500000,
          maxQuantity: 100,
          description: 'Akses VIP dengan view terbaik'
        },
        {
          id: '2',
          name: 'Regular',
          price: 250000,
          maxQuantity: 500,
          description: 'Akses regular'
        }
      ],
      displayPrice: 'Rp 250.000',
      status: 'Aktif',
      theme: 'Musik',
      address: 'Jl. Gatot Subroto, Jakarta Selatan'
    },
    {
      id: 2,
      category: 'B2B',
      name: 'Tech Conference 2024',
      location: 'Hotel Indonesia Kempinski',
      dateDisplay: '20 Desember 2024',
      timeDisplay: '09:00 WIB',
      fullDescription: 'Konferensi teknologi terdepan dengan pembicara dari perusahaan teknologi global.',
      ticketCategories: [
        {
          id: '3',
          name: 'Early Bird',
          price: 1500000,
          maxQuantity: 200,
          description: 'Tiket early bird dengan diskon 30%'
        }
      ],
      displayPrice: 'Rp 1.500.000',
      status: 'Aktif',
      theme: 'Teknologi',
      address: 'Jl. MH Thamrin, Jakarta Pusat'
    }
  ];

  // Use provided events or fall back to mock data
  const eventsToDisplay = events.length > 0 ? events : mockEvents;

  // Handle navigation for standalone mode
  const handleNavigate = (page: PageName, data?: any) => {
    if (onNavigate) {
      onNavigate(page, data);
    } else {
      // For standalone mode, handle basic navigation
      if (page === 'landing') {
        window.location.href = '/';
      } else if (page === 'dashboard') {
        window.location.href = '/';
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('visitor');
    setUserName('Pengunjung');
  };

  const handleOpenAuthModal = () => {
    // For standalone mode, redirect to main page
    window.location.href = '/';
  };

  const handleOpenRoleSwitchModal = () => {
    // For standalone mode, redirect to main page
    window.location.href = '/';
  };

  // Filter events based on search term and other filters
  const filteredAndSortedEvents = useMemo(() => {
    let processedEvents = Array.isArray(eventsToDisplay) ? eventsToDisplay : []; // Guard if events is undefined

    if (searchTerm) {
      processedEvents = processedEvents.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.summary && event.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
        event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // Add more filtering logic here if needed (e.g., based on selectedCategories, startDate, endDate)
    
    return processedEvents;
  }, [eventsToDisplay, searchTerm, selectedCategories, startDate, endDate]);

  const totalPages = filteredAndSortedEvents.length > 0 ? Math.ceil(filteredAndSortedEvents.length / ITEMS_PER_PAGE) : 0;

  const currentEvents = useMemo(() => {
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    return filteredAndSortedEvents.slice(indexOfFirstItem, indexOfLastItem);
  }, [currentPage, filteredAndSortedEvents]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Ensure currentPage stays within bounds when filtered events change
  React.useEffect(() => {
    if (totalPages === 0) {
      setCurrentPage(1);
    } else if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const categories = ["Festivals", "Conferences", "Exhibitions", "Konser", "Pameran Seni"]; // This could be dynamic based on events prop

  return (
    <>
      <Navbar
        onNavigate={handleNavigate}
        currentPage={currentPageName}
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        userName={userName}
        onLogout={handleLogout}
        onOpenAuthModal={handleOpenAuthModal}
        onOpenRoleSwitchModal={handleOpenRoleSwitchModal}
      />
      
      <div className="pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <header className="mb-8 md:mb-12 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-jakarta font-bold text-hegra-turquoise">Jelajahi Event</h1>
            <p className="mt-3 text-lg text-gray-700 max-w-3xl mx-auto">
              Selami dunia penuh kegembiraan dan peluang. Jelajahi beragam koleksi acara mendatang, 
              dari festival yang meriah dan konferensi yang berwawasan hingga pameran yang menarik. Temukan pengalaman tak terlupakan Anda berikutnya di sini.
            </p>
          </header>
          
          <div className="mb-12 md:mb-16">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="search"
                id="search-event"
                name="search-event"
                placeholder="Cari nama, kategori, atau lokasi event..."
                className="w-full py-3 px-4 pl-12 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 transition-colors bg-white" 
                aria-label="Search events"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-1/4 lg:w-1/5 bg-white p-6 rounded-lg shadow-sm border border-gray-200 self-start">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-jakarta font-semibold text-hegra-navy">Filters</h2>
                <button 
                  onClick={() => setIsFilterVisible(!isFilterVisible)} 
                  className="text-hegra-navy hover:text-hegra-turquoise p-1"
                  aria-expanded={isFilterVisible}
                  aria-controls="event-filters-content"
                >
                  {isFilterVisible ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
              
              {isFilterVisible && (
                <div id="event-filters-content" className="space-y-6">
                  {/* Category Filter */}
                  <div>
                    <h3 className="text-lg font-jakarta font-medium text-gray-800 mb-2">Category</h3>
                    <ul className="space-y-1">
                      {categories.map(category => (
                        <li key={category}>
                          <label className="flex items-center space-x-2 text-gray-700 hover:text-hegra-turquoise cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(category)}
                              onChange={() => handleCategoryChange(category)}
                              className="form-checkbox h-4 w-4 text-hegra-turquoise rounded border-gray-300 focus:ring-hegra-turquoise/20"
                            />
                            <span>{category}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Date Range Filter */}
                  <div>
                    <h3 className="text-lg font-jakarta font-medium text-gray-800 mb-2">Date Range</h3>
                    <div className="space-y-2">
                      <div>
                        <label htmlFor="start-date" className="sr-only">Start date</label>
                        <input
                          type="date"
                          id="start-date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 text-sm bg-white"
                          placeholder="Start date"
                        />
                      </div>
                      <div>
                        <label htmlFor="end-date" className="sr-only">End date</label>
                        <input
                          type="date"
                          id="end-date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 text-sm bg-white"
                          placeholder="End date"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </aside>

            <main className="w-full md:w-3/4 lg:w-4/5">
              <section aria-labelledby="event-list-heading">
                <h2 id="event-list-heading" className="sr-only">Daftar Event</h2>
                {currentEvents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                    {currentEvents.map(event => (
                      <EventCard key={event.id} {...event} onNavigate={onNavigate} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <Search size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-xl text-gray-500">Tidak ada event yang cocok dengan pencarian Anda.</p>
                    <p className="text-sm text-gray-400 mt-2">Coba kata kunci atau filter lain.</p>
                  </div>
                )}
              </section>

              {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center space-x-2" aria-label="Paginasi event">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-md text-sm bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50"
                    aria-label="Halaman sebelumnya"
                  >
                    <ChevronLeft size={16} className="mr-1" /> Previous
                  </button>
                  {pageNumbers.map(number => (
                    <button
                      key={number}
                      onClick={() => handlePageChange(number)}
                      className={`px-3 py-1 rounded-md text-sm transition-colors focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50
                        ${currentPage === number 
                          ? 'bg-hegra-turquoise text-white font-semibold' 
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                      aria-current={currentPage === number ? 'page' : undefined}
                      aria-label={`Ke halaman ${number}`}
                    >
                      {number}
                    </button>
                  ))}
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-md text-sm bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50"
                    aria-label="Halaman berikutnya"
                  >
                    Next <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
             <Footer onNavigate={handleNavigate} currentPage={currentPageName} />
       <FloatingHelpButton onNavigate={handleNavigate} />
    </>
  );
};

export default EventPage;

export const getServerSideProps = async () => ({ props: {} });