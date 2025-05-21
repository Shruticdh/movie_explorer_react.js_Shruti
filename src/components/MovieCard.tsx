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
  const userPlan = localStorage.getItem("userPlan");

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
      className="w-[200px] text-white hover:scale-105 transition-transform duration-300 relative"
      onClick={handleClick}
    >
      <div className="rounded-sm overflow-hidden cursor-pointer shadow-md relative">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-[240px] object-cover"
        />
        {is_premium === true &&(
            <div className="absolute top-2 left-2 p-1 rounded-full z-20">
              <span className="text-yellow-200 text-xs font-semibold">
                <Crown size={20} color="yellow" />
                Premium
              </span>
            </div>
          )}
        {role === "supervisor" && (
          <div className="absolute top-2 right-2 flex gap-2 z-10">
            <button
              onClick={handleEdit}
              className="bg-white p-1 rounded hover:scale-110 cursor-pointer"
              data-testid="edit-button"
            >
              <Pencil size={14} color="black" />
            </button>
            <button
              onClick={handleDelete}
              className="bg-white p-1 rounded hover:scale-110 cursor-pointer"
              data-testid="delete-button"
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



