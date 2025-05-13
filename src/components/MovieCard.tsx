

import React from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Crown } from "lucide-react";
import { deleteMovie } from "../Services/AdminServices";
import { toast } from "react-toastify";

interface SimpleMovieCardProps {
  id: string;
  title: string;
  imageUrl: string;
  duration: string;
  genre?: string;
  is_premium: boolean;
  quality?: string;
  role?: string;
}

const MovieCard: React.FC<SimpleMovieCardProps> = ({
  id,
  title,
  imageUrl,
  duration,
  genre,
  is_premium,
  quality,
  role,
}) => {
  const navigate = useNavigate();
  
  // const handleClick = () => {
  //   if (is_premium) {
  //     navigate("/subscription");
  //   } else {
  //     navigate(`/movie-details/${id}`, {
  //       state: { id, title, imageUrl, duration, genre, quality },
  //     });
  //   }
  // };


  const handleClick = () => {
    const userPlan = localStorage.getItem("userPlan");
    // Check: if movie is premium and user does NOT have a premium plan
    if (is_premium && userPlan !== "premium") {
      navigate("/subscription");
    } else {
      navigate(`/movie-details/${id}`, {
        state: { id, title, imageUrl, duration, genre, quality },
      });
    }
  };
  

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/movies/${id}/edit`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      await deleteMovie(id);
      toast.success("Movie deleted successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting movie:", error);
      toast.error("Failed to delete movie");
    }
  };

  return (
    <div
      className="w-[200px] text-white hover:scale-105 transition-transform duration-300 relative"
      onClick={handleClick}
    >
      <div className="rounded-sm overflow-hidden cursor-pointer shadow-md relative">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-[240px] object-cover"
        />

        {/* Premium Crown */}
        {is_premium && (
          <div className="absolute top-2 left-2 bg-yellow-500 p-1 rounded-full z-10">
            <Crown size={14} color="white" />
          </div>
        )}

        {/* Edit/Delete for supervisor */}
        {role === "supervisor" && (
          <div className="absolute top-2 right-2 flex gap-2 z-10">
            <button
              onClick={handleEdit}
              className="bg-white p-1 rounded hover:scale-110"
            >
              <Pencil size={14} color="black" />
            </button>
            <button
              onClick={handleDelete}
              className="bg-white p-1 rounded hover:scale-110"
            >
              <Trash2 size={14} color="black" />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 mt-1">
        <p className="mt-1 text-sm font-semibold truncate w-3/4">{title}</p>
        <div className="flex-shrink-0 text-[10px] px-2 py-[2px] bg-[red] border border-[red] rounded-md">
          {duration}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
