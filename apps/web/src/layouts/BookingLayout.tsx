// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import MovieInfo from "./MovieInfo";
// import SeatMap from "./SeatMap";
// import { IShowTimeSeat, IMovie } from "../types/schema";

// const BookingPage = () => {
//   const { id } = useParams(); // Lấy ID phim từ URL: /booking/:id
//   const [movie, setMovie] = useState<IMovie | null>(null);
//   const [selectedSeats, setSelectedSeats] = useState<IShowTimeSeat[]>([]);

//   // Giả lập Fetch Data (Sau này thay bằng API của bạn)
//   useEffect(() => {
//     // const data = await api.getMovie(id);
//     // setMovie(data);
//   }, [id]);

//   const handleSeatClick = (seat: IShowTimeSeat) => {
//     setSelectedSeats((prev) =>
//       prev.find((s) => s.seatCode === seat.seatCode)
//         ? prev.filter((s) => s.seatCode !== seat.seatCode)
//         : [...prev, seat],
//     );
//   };

//   if (!movie)
//     return <div className="p-20 text-center">Đang tải dữ liệu...</div>;

//   return (
//     <div className="flex flex-col lg:flex-row min-h-screen bg-[#050505] text-white">
//       {/* BÊN TRÁI: MOVIE (30%) */}
//       <aside className="w-full lg:w-[30%] p-8 lg:border-r border-zinc-900 lg:sticky lg:top-0 lg:h-screen overflow-y-auto">
//         <MovieInfo movie={movie} />

//         {/* Tóm tắt đặt vé nhanh phía dưới thông tin phim */}
//         <div className="mt-10 p-5 bg-zinc-900/30 rounded-2xl border border-zinc-800">
//           <div className="flex justify-between mb-4">
//             <span className="text-zinc-500">Ghế:</span>
//             <span className="font-bold text-orange-500">
//               {selectedSeats.map((s) => s.seatCode).join(", ") || "None"}
//             </span>
//           </div>
//           <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
//             <span className="text-zinc-500">Tổng tiền:</span>
//             <span className="text-2xl font-black text-red-500">
//               {selectedSeats
//                 .reduce((sum, s) => sum + s.price, 0)
//                 .toLocaleString()}
//               đ
//             </span>
//           </div>
//           <button className="w-full mt-6 bg-red-600 py-4 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-900/20">
//             THANH TOÁN
//           </button>
//         </div>
//       </aside>

//       {/* BÊN PHẢI: SEATMAP (70%) */}
//       <main className="flex-1 p-8 lg:p-16 flex items-center justify-center">
//         <div className="w-full max-w-5xl">
//           <header className="text-center mb-12">
//             <h2 className="text-zinc-500 uppercase tracking-[0.3em] text-xs">
//               Sơ đồ ghế rạp
//             </h2>
//             <p className="text-xl font-bold mt-2">Phòng chiếu số 05</p>
//           </header>

//           <SeatMap
//             seats={[]} // Truyền mảng ghế từ API của bạn vào đây
//             selectedSeatCodes={selectedSeats.map((s) => s.seatCode)}
//             onSeatClick={handleSeatClick}
//           />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default BookingPage;
