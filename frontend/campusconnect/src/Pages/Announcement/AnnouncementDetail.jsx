// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getAnnouncementById } from '../../API/API';
// import { FaUser, FaBook, FaCalendarAlt, FaBullhorn, FaArrowLeft } from 'react-icons/fa';

// const PRIORITY_COLORS = {
//   High: 'bg-red-100 text-red-800',
//   Medium: 'bg-yellow-100 text-yellow-800',
//   Low: 'bg-green-100 text-green-800',
// };

// const AnnouncementDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [announcement, setAnnouncement] = useState(null);

//   useEffect(() => {
//     const fetchAnnouncement = async () => {
//       const data = await getAnnouncementById(id);
//       setAnnouncement(data);
//     };

//     fetchAnnouncement();
//   }, [id]);

//   if (!announcement) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-16 pb-12">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Animated Back Button */}
//         <button
//           onClick={() => navigate('/announcements')}
//           className="group mb-8 flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 
//                      bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
//         >
//           <FaArrowLeft className="mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" />
//           Back to Announcements
//         </button>

//         {/* Enhanced Announcement Card */}
//         <div className="transform transition-all duration-300 hover:scale-[1.01]">
//           <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
//             {/* Header with enhanced gradient */}
//             <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6">
//               <div className="flex items-start space-x-4">
//                 <div className="flex-shrink-0">
//                   <div className="p-3 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
//                     <FaBullhorn className="h-6 w-6 text-white" />
//                   </div>
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h1 className="text-2xl font-bold text-white mb-2">
//                     {announcement.title}
//                   </h1>
//                   {announcement.priority && (
//                     <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold 
//                                    bg-white bg-opacity-20 backdrop-blur-sm text-white border border-white/30">
//                       {announcement.priority} Priority
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Content with enhanced typography */}
//             <div className="px-8 py-8">
//               <div className="prose prose-lg max-w-none">
//                 <p className="text-gray-700 leading-relaxed">
//                   {announcement.content}
//                 </p>
//               </div>
//             </div>

//             {/* Footer with glass effect */}
//             <div className="bg-gray-50 px-8 py-6 backdrop-blur-sm border-t border-gray-100">
//               {announcement.course && (
//                 <div className="flex items-center gap-3 mb-4 p-3 bg-white rounded-lg shadow-sm">
//                   <FaBook className="text-blue-600 text-lg" />
//                   <div>
//                     <span className="font-medium text-gray-900">{announcement.course.code}</span>
//                     <span className="mx-2 text-gray-400">•</span>
//                     <span className="text-gray-600">{announcement.course.title}</span>
//                   </div>
//                 </div>
//               )}
              
//               <div className="flex flex-wrap items-center gap-6 text-sm">
//                 <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm">
//                   <FaUser className="mr-2 text-blue-600" />
//                   <span className="text-gray-700">
//                     Posted by: <span className="font-medium">{announcement.creator?.username || 'Unknown'}</span>
//                   </span>
//                 </div>
//                 <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm">
//                   <FaCalendarAlt className="mr-2 text-blue-600" />
//                   <time className="text-gray-700">
//                     {new Date(announcement.created_At).toLocaleDateString('en-US', {
//                       year: 'numeric',
//                       month: 'long',
//                       day: 'numeric',
//                       hour: '2-digit',
//                       minute: '2-digit'
//                     })}
//                   </time>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AnnouncementDetail;
