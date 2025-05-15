import React from "react";
import { motion } from "framer-motion";
import Img from "../assets/Avatar2.jpg";
import Img2 from "../assets/Interseller.jpg";
import Img3 from "../assets/FatherBanner.jpg" ;
import Img4 from "../assets/LoveBanner3.jpg";
import Img5 from  "../assets/DuneTwoBanner.jpg" ;
import Img6 from  "../assets/ConjuringBanner.jpg" ;
import Img7 from  "../assets/DarkKnight.jpg";
import Img8 from "../assets/BoothBanner3.jpg" ;

interface Genre {
  name: string;
  imageUrl: string;
}

interface GenreProps {
  onGenreClick: (genre: string) => void;
}

const genres: Genre[] = [
  { name: "Fantasy", imageUrl: Img },
  { name: "Sci-fi", imageUrl: Img2 },
  { name: "Drama", imageUrl: Img3 },
  { name: "Romance", imageUrl: Img4 },
  { name: "Action", imageUrl: Img5 },
  { name: "Horror", imageUrl: Img6 },
  { name: "Adventure", imageUrl: Img7 },
  { name: "Comedy", imageUrl: Img8 },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Genre: React.FC<GenreProps> = ({ onGenreClick }) => {
  return (
    <div className="bg-black px-6 py-8 md:px-16 text-white">
      <motion.div
        className="flex justify-center gap-5 flex-wrap max-sm:w-[100%]"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {genres.map((genre) => (
          <motion.div
            key={genre.name}
            className="relative rounded-lg overflow-hidden group h-30 cursor-pointer w-[125px] h-[80px] max-[750px]:w-[125px] max-[750px]:h-[80px] max-[500px]:w-[100px] max-[500px]:h-[50px]"
            variants={cardVariants}
            onClick={() => onGenreClick(genre.name)}
          >
            <img
              src={genre.imageUrl}
              alt={genre.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/50 bg-opacity-40 group-hover:bg-opacity-60 transition-all duration-300"></div>
            <h3 className="absolute inset-0 flex items-center justify-center text-white text-xl font-semibold">
              {genre.name}
            </h3>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Genre;
