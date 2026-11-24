
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [movies, setMovies] = useState(() => {
    try {
      const savedMovies = localStorage.getItem("movies");
      return savedMovies ? JSON.parse(savedMovies) : [];
    } catch {
      return [];
    }
  });

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState("");
  const [director, setDirector] = useState("");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  // Save movies whenever the list changes
  useEffect(() => {
    localStorage.setItem("movies", JSON.stringify(movies));
  }, [movies]);

  // Clear form
  function clearForm() {
    setTitle("");
    setGenre("");
    setYear("");
    setRating("");
    setDirector("");
    setEditId(null);
  }

  // Add or update movie
  function handleSubmit(e) {
    e.preventDefault();

    const movie = {
      id: editId !== null ? editId : Date.now(),
      title: title.trim(),
      genre: genre.trim(),
      year,
      rating,
      director: director.trim()
    };

    if (editId !== null) {
      setMovies((oldMovies) =>
        oldMovies.map((item) =>
          item.id === editId ? movie : item
        )
      );
    } else {
      setMovies((oldMovies) => [...oldMovies, movie]);
    }

    clearForm();

    // IMPORTANT: No YouTube link or window.open here.
  }

  // Edit movie
  function editMovie(movie) {
    setTitle(movie.title);
    setGenre(movie.genre);
    setYear(movie.year);
    setRating(movie.rating);
    setDirector(movie.director);
    setEditId(movie.id);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Delete movie
  function deleteMovie(id) {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      setMovies((oldMovies) =>
        oldMovies.filter((movie) => movie.id !== id)
      );
    }
  }

  // Open YouTube ONLY when the trailer button is clicked
  function watchTrailer(movieTitle) {
    const url =
      "https://www.youtube.com/results?search_query=" +
      encodeURIComponent(movieTitle + " official trailer");

    window.open(url, "_blank", "noopener,noreferrer");
  }

  // Search movies
  const filteredMovies = movies.filter((movie) =>
    [movie.title, movie.genre, movie.director]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <header className="header">
        <h1>🎬 Movie Management System</h1>
        <p>Add, manage and explore your favourite movies</p>
      </header>

      <main className="container">
        <section className="form-section">
          <h2>{editId !== null ? "Update Movie" : "Add New Movie"}</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Movie Name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Genre (Action, Comedy, Drama...)"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Release Year"
              min="1888"
              max="2100"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Rating (0 to 10)"
              min="0"
              max="10"
              step="0.1"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Director Name"
              value={director}
              onChange={(e) => setDirector(e.target.value)}
              required
            />

            <div className="form-buttons">
              <button type="submit" className="add-btn">
                {editId !== null ? "Update Movie" : "Add Movie"}
              </button>

              <button
                type="button"
                className="clear-btn"
                onClick={clearForm}
              >
                Clear
              </button>
            </div>
          </form>
        </section>

        <section className="movies-section">
          <div className="movies-heading">
            <h2>My Movie Collection</h2>
            <span>{movies.length} Movies</span>
          </div>

          <input
            className="search-input"
            type="text"
            placeholder="Search by movie, genre or director..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {filteredMovies.length === 0 ? (
            <p className="empty-message">
              {movies.length === 0
                ? "No movies added yet. Add your first movie!"
                : "No matching movies found."}
            </p>
          ) : (
            <div className="movie-grid">
              {filteredMovies.map((movie) => (
                <div className="movie-card" key={movie.id}>
                  <div className="movie-icon">🎥</div>

                  <h3>{movie.title}</h3>

                  <p><strong>Genre:</strong> {movie.genre}</p>
                  <p><strong>Year:</strong> {movie.year}</p>
                  <p><strong>Rating:</strong> ⭐ {movie.rating}/10</p>
                  <p><strong>Director:</strong> {movie.director}</p>

                  <div className="card-buttons">
                    <button
                      className="trailer-btn"
                      type="button"
                      onClick={() => watchTrailer(movie.title)}
                    >
                      Watch Trailer
                    </button>

                    <button
                      className="edit-btn"
                      type="button"
                      onClick={() => editMovie(movie)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      type="button"
                      onClick={() => deleteMovie(movie.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer>
        <p>Movie Management System | Built with React</p>
      </footer>
    </div>
  );
}

export default App;
