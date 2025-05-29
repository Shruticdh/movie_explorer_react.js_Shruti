import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Footer from "../components/footer";
import Header from "../components/header";
import { addMovie, updateMovie } from "../Services/AdminServices";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { getMoviesById } from "../Services/MovieService";
import bgImage from "../assets/background_Dark_signup.webp";

const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 0.6,
      ease: "easeOut",
    },
  },
});

const MovieForm = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    genre: "",
    director: "",
    main_lead: "",
    rating: "",
    duration: "",
    release_year: "",
    is_premium: false,
    poster_url: "",
    banner_url: "",
  });

  const [banner, setBanner] = useState<File | null>(null);
  const [poster, setPoster] = useState<File | null>(null);
  const [directorInput, setDirectorInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const directorRef = useRef(null);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  useEffect(() => {
      window.scrollTo(0, 0);  
    }, []);

  useEffect(() => {
    console.log("Fetching movie with ID:", id);
    if (isEditMode && id) {
      getMoviesById(Number(id))
        .then((res) => {
          const movie = res;
          if (!movie) {
            toast.error("Movie details not found");
            return;
          }
          setForm({
            title: movie.title,
            description: movie.description,
            genre: movie.genre,
            director: movie.director,
            main_lead: movie.main_lead,
            rating: String(movie.rating),
            duration: String(movie.duration),
            release_year: String(movie.release_year),
            is_premium: Boolean(movie.is_premium),
            poster_url: movie.poster_url,
            banner_url: movie.banner_url,
          });
          setDirectorInput(movie.director);
        })
        .catch((err) => {
          console.error("Error fetching movie details:", err);
          toast.error("Failed to fetch movie details");
        });
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "rating") {
      if (value === "") {
        setForm({ ...form, rating: "" });
        return;
      }
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 0 || numValue > 10) {
        toast.error("Rating must be a number between 0 and 10");
        return;
      }
      setForm({ ...form, rating: value });
    }
    else if (name === "duration") {
      if (value === "") {
        setForm({ ...form, duration: "" });
        return;
      }
      const numValue = parseInt(value, 10);
      if (isNaN(numValue) || numValue <= 0) {
        toast.error("Duration must be a positive integer");
        return;
      }
      setForm({ ...form, duration: value });
    }
    else if (name === "release_year") {
      if (value === "") {
        setForm({ ...form, release_year: "" });
        return;
      }
      const numValue = parseInt(value, 10);
      if (isNaN(numValue) || numValue <= 0) {
        toast.error("Release year must be a positive integer");
        return;
      }
      setForm({ ...form, release_year: value });
    }
    else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleDirectorInput = (e) => {
    const value = e.target.value;
    setDirectorInput(value);
    setForm({ ...form, director: value });
    setShowSuggestions(value.length > 0);
  };

  const handleDirectorSelect = (director) => {
    setDirectorInput(director);
    setForm({ ...form, director });
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    const ratingNum = parseFloat(form.rating);
    const durationNum = parseInt(form.duration, 10);
    const releaseYearNum = parseInt(form.release_year, 10);

    if (form.rating && (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 10)) {
      toast.error("Rating must be a number between 0 and 10");
      return;
    }
    if (form.duration && (isNaN(durationNum) || durationNum <= 0)) {
      toast.error("Duration must be a positive integer");
      return;
    }
    if (form.release_year && (isNaN(releaseYearNum) || releaseYearNum <= 0)) {
      toast.error("Release year must be a positive integer");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(`movie[${key}]`, typeof value === "boolean" ? String(value) : value);
    });
    if (banner) formData.append("movie[banner]", banner);
    if (poster) formData.append("movie[poster]", poster);

    try {
      if (isEditMode) {
        await updateMovie(id, formData);
        toast.success("Movie updated successfully!");
      } else {
        await addMovie(formData);
        toast.success("Movie added successfully!");
      }
      navigate("/dashboard");
    } catch (error) {
      toast.error("Error while submitting movie");
      console.error(error.response?.data || error.message);
    }
  };

  const genres = [
    "Fantasy",
    "Horror",
    "Romance",
    "Drama",
    "Sci-fi",
    "Action",
    "Adventure",
    "Comedy",
  ];

  const directors = [
    "Christopher Nolan",
    "Steven Spielberg",
    "Quentin Tarantino",
    "Martin Scorsese",
    "Greta Gerwig",
    "Bong Joon-ho",
    "Alfonso Cuarón",
    "Denis Villeneuve",
    "Sofia Coppola",
    "James Cameron",
    "Ridley Scott",
    "Wes Anderson",
    "David Fincher",
    "Taika Waititi",
    "Patty Jenkins",
  ];

  const filteredDirectors = directors.filter((director) =>
    director.toLowerCase().includes(directorInput.toLowerCase())
  );

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-black p-6 flex items-center justify-center text-white">
        <div className="backdrop-blur-sm bg-gradient-to-br from-black via-zinc-900 bg-white/5 border border-gray-700 rounded-2xl shadow-2xl p-8 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div initial="hidden" animate="visible" variants={fadeIn(0)}>
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-red-600">Add</span> Movie
              <span className="text-red-600"> M</span>OVIEXPO
            </h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Please fill out all required fields including image files.
            </p>

            <motion.div
              variants={fadeIn(0.3)}
              initial="hidden"
              animate="visible"
              className="relative rounded-lg overflow-hidden"
            >
              <img
                src={bgImage}
                alt="Background"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-black/30"></div>
            </motion.div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4 w-full"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: "title", placeholder: "Movie Title", type: "text" },
                { name: "genre", placeholder: "Select Genre", type: "select" },
                { name: "director", placeholder: "Director Name", type: "autocomplete" },
                { name: "main_lead", placeholder: "Main Actor/Actress", type: "text" },
                {
                  name: "rating",
                  type: "number",
                  placeholder: "e.g. 8.5",
                  min: "0",
                  max: "10",
                  step: "0.1",
                },
                {
                  name: "duration",
                  type: "number",
                  placeholder: "e.g. 120",
                  min: "1",
                },
                {
                  name: "release_year",
                  type: "number",
                  placeholder: "e.g. 2025",
                  min: "1",
                },
              ].map((field, i) => (
                <motion.div
                  key={field.name}
                  variants={fadeIn(i * 0.1)}
                  className="space-y-2"
                >
                  <label className="text-sm text-gray-300 capitalize">
                    {field.name.replace("_", " ")} *
                  </label>
                  {field.type === "select" ? (
                    <select
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      required
                      className="w-full bg-zinc-800 p-3 rounded-lg focus:ring-2 focus:ring-red-600"
                    >
                      <option value="" disabled>
                        {field.placeholder}
                      </option>
                      {genres.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "autocomplete" ? (
                    <div className="relative" ref={directorRef}>
                      <input
                        type="text"
                        name={field.name}
                        value={directorInput}
                        onChange={handleDirectorInput}
                        onFocus={() => setShowSuggestions(directorInput.length > 0)}
                        required
                        placeholder={field.placeholder}
                        className="w-full bg-zinc-800 p-3 rounded-lg focus:ring-2 focus:ring-red-600"
                      />
                      {showSuggestions && filteredDirectors.length > 0 && (
                        <ul className="absolute z-10 w-full bg-zinc-800 border border-gray-600 rounded-lg mt-1 max-h-40 overflow-y-auto">
                          {filteredDirectors.map((director) => (
                            <li
                              key={director}
                              onClick={() => handleDirectorSelect(director)}
                              className="p-3 hover:bg-zinc-700 cursor-pointer text-gray-300"
                            >
                              {director}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <input
                      type={field.type || "text"}
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      required
                      placeholder={field.placeholder}
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      className="w-full bg-zinc-800 p-3 rounded-lg focus:ring-2 focus:ring-red-600"
                    />
                  )}
                </motion.div>
              ))}
              <motion.div
                variants={fadeIn(0.8)}
                className="space-y-2 flex items-center gap-3 md:mt-6"
              >
                <input
                  type="checkbox"
                  name="is_premium"
                  checked={form.is_premium}
                  onChange={(e) =>
                    setForm({ ...form, is_premium: e.target.checked })
                  }
                  className="w-5 h-5 text-red-600 focus:ring-red-600"
                />
                <label className="text-sm text-gray-300 -mt-3">Premium Plan</label>
              </motion.div>
            </motion.div>
            <motion.div className="space-y-2" variants={fadeIn(0.9)}>
              <label className="text-sm text-gray-300">Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Enter full description..."
                className="w-full bg-zinc-800 p-3 rounded-lg focus:ring-2 focus:ring-red-600"
              />
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              variants={fadeIn(1.1)}
            >
              <div className="space-y-2">
                <label className="text-sm text-gray-300">
                  Banner Image (jpg/png)
                </label>
                {isEditMode && !banner && form.banner_url && (
                  <img
                    src={form.banner_url}
                    alt="Current Banner"
                    className="w-full h-40 object-cover rounded-lg border border-gray-600"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files?.[0] && setBanner(e.target.files[0])
                  }
                  className="w-full bg-zinc-800 file:bg-red-600 file:text-white file:px-4 file:py-2 file:rounded-lg file:border-none file:cursor-pointer rounded-lg p-2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-300">
                  Poster Image (jpg/png)
                </label>
                {isEditMode && !poster && form.poster_url && (
                  <img
                    src={form.poster_url}
                    alt="Current Poster"
                    className="w-full h-40 object-cover rounded-lg border border-gray-600"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files?.[0] && setPoster(e.target.files[0])
                  }
                  className="w-full bg-zinc-800 file:bg-red-600 file:text-white file:px-4 file:py-2 file:rounded-lg file:border-none file:cursor-pointer rounded-lg p-2"
                />
              </div>
            </motion.div>

            <motion.button
              type="submit"
              variants={fadeIn(1.3)}
              className="w-full mt-4 bg-red-600 hover:bg-red-700 transition-all py-3 rounded-lg font-semibold tracking-wide shadow-lg cursor-pointer"
            >
              {isEditMode ? "Update Movie" : "Submit Movie"}
            </motion.button>
          </motion.form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MovieForm;











