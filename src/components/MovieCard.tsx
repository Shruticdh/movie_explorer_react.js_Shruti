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
  isLoading?: boolean;
}

const MovieCardSkeleton: React.FC = () => {
  return (
    <div className="w-[120px] sm:w-[150px] md:w-[180px] lg:w-[200px] text-white animate-pulse">
      <div className="rounded-sm overflow-hidden shadow-md relative">
        <div className="w-full h-[160px] sm:h-[200px] md:h-[220px] lg:h-[240px] bg-gray-700 shimmer"></div>
        <div className="bg-gray-600 absolute top-1 sm:top-2 left-1 sm:left-2 p-2 rounded-full">
          <div className="w-4 h-4 bg-gray-500 rounded"></div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-1 sm:gap-2 mt-1">
        <div className="mt-1 w-3/4 h-3 sm:h-4 bg-gray-700 rounded shimmer"></div>
        <div className="flex-shrink-0 w-8 sm:w-10 h-3 sm:h-4 bg-gray-700 rounded shimmer"></div>
      </div>
    </div>
  );
};

const MovieCard: React.FC<SimpleMovieCardProps> = ({
  id,
  title,
  imageUrl,
  duration,
  genre,
  is_premium,
  quality,
  role,
  isLoading = false, 
}) => {
  const navigate = useNavigate();
  const userPlan = localStorage.getItem("userPlan");

  if (isLoading) {
    return <MovieCardSkeleton />;
  }

  const handlePremiumAccess = () => {
    if (is_premium) {
      handlePremiumAccess();
    } else {
      handleNonPremiumAccess();
    }
  };

  const handleNonPremiumAccess = () => {
    navigate(`/movie-details/${id}`, {
      state: { id, title, imageUrl, duration, genre, quality },
    });
  };

  const handleClick = () => {
    if (!is_premium || userPlan === "premium" || role === "supervisor" ) {
      navigate(`/movie-details/${id}`, {
        state: { id, title, imageUrl, duration, genre, quality },
      });
    } else {
      navigate("/subscription");
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
      className="w-[120px] sm:w-[150px] md:w-[180px] lg:w-[200px] text-white hover:scale-105 transition-transform duration-300 relative"
      onClick={handleClick}
    >
      <div className="rounded-sm overflow-hidden cursor-pointer shadow-md relative">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-[160px] sm:h-[200px] md:h-[220px] lg:h-[240px] object-cover"
        />
        {is_premium === true &&(
            <div className=" bg-black/70 absolute top-1 sm:top-2 left-1 sm:left-2 p-2 rounded-full z-20">
              <span className="text-yellow-200 text-xs font-semibold">
                <Crown size={16} color="yellow" />
              </span>
            </div>
          )}
        {role === "supervisor" && (
          <div className="absolute top-1 sm:top-2 right-1 sm:right-2 flex gap-1 sm:gap-2 z-10">
            <button
              onClick={handleEdit}
              className="bg-white p-0.5 sm:p-1 rounded hover:scale-110 cursor-pointer"
              data-testid="edit-button"
            >
              <Pencil size={12} color="black" />
            </button>
            <button
              onClick={handleDelete}
              className="bg-white p-0.5 sm:p-1 rounded hover:scale-110 cursor-pointer"
              data-testid="delete-button"
            >
              <Trash2 size={12} color="black" />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-1 sm:gap-2 mt-1">
        <p className="mt-1 text-xs sm:text-sm font-semibold truncate w-3/4">{title}</p>
        <div className="flex-shrink-0 text-[8px] sm:text-[10px] px-1 sm:px-2 py-[1px] sm:py-[2px] bg-[red] border border-[red] rounded-md">
          {duration}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;