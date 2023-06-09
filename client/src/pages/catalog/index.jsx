import { useDispatch } from "react-redux";
import { useGetGames } from "./useGetGames";
import { useGetCategories } from "../../hooks/useGetCategories";
import { GameCard } from "../../components/GameCard";
import { setGame } from "../../store/reducers/GameReducer";
import "../../assets/css/games.css";

export const Catalog = ({ toggleShowGame }) => {
  const dispatch = useDispatch();
  const { games, categories, handleChangeCategory, lastGameRef } =
    useGetGames();

  const { allCategories } = useGetCategories();

  const handleClick = (game) => {
    dispatch(setGame(game));
    toggleShowGame((prevState) => !prevState);
  };

  return games.length ? (
    <div className="d-flex justify-content-between">
      <div className="games-category col-3 d-none d-md-block ps-4">
        <strong className="d-block mb-3 mt-4 h5">Category</strong>

        {allCategories.map(({ categoryName, categoryEnum }) => (
          <div className="mb-2" key={`category-${categoryEnum}`}>
            <input
              className="checkbox me-3"
              type="checkbox"
              checked={categories.includes(categoryEnum)}
              value={categoryEnum}
              onChange={handleChangeCategory}
            />

            <label>{categoryName}</label>
          </div>
        ))}
      </div>

      <div className="row px-4 pt-4">
        {games.map((game, index) => (
          <GameCard
            game={game}
            handleClick={handleClick}
            lastGameRef={index === games.length - 1 ? lastGameRef : null}
            key={`game-${game._id}`}
          />
        ))}
      </div>
    </div>
  ) : (
    <span className="d-block col ms-4 mt-4">No Games</span>
  );
};
