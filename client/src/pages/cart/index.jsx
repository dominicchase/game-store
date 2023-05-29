import React from "react";
import { useDispatch, useSelector } from "react-redux";

export const Cart = () => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cartState);

  if (!cart?.games?.length) {
    return null;
  }

  const sortedCart = [...cart.games].sort((curr, next) =>
    curr.game.name < next.game.name ? -1 : 1
  );

  const subtotal = cart.games.reduce(
    (accumulator, cartGame) =>
      accumulator + cartGame.game.price * cartGame.quantity,
    0
  );

  const numberOfGames = cart.games.reduce(
    (accumulator, cartGame) => accumulator + cartGame.quantity,
    0
  );

  const handlePayment = () => {};

  return (
    <div>
      {sortedCart.map((cartGame) => (
        <div
          className="d-flex px-5 pb-5 mb-5 border-bottom"
          key={`cart-game-${cartGame._id}`}
        >
          <div className="col-3 me-4">
            <img src={cartGame.game.image} width={"100%"} alt="" />
          </div>

          <div>
            <span className="d-block mb-3">{cartGame.game.name}</span>

            <span className="d-block mb-3">${cartGame.game.price}</span>

            <span className="d-block mb-3">Qty: {cartGame.quantity}</span>

            <button
              className="px-4"
              onClick={() => dispatch(removeGameFromCart(cartGame.game._id))}
            >
              X
            </button>
          </div>
        </div>
      ))}

      <div className="d-flex flex-column align-items-end">
        <strong className="d-block mb-3">
          Subtotal ({numberOfGames} games): ${subtotal}
        </strong>

        <button onClick={handlePayment}>Proceed to Payment</button>
      </div>
    </div>
  );
};
