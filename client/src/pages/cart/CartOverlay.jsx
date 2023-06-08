import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../../store/reducers/CartReducer";
import useAuth from "../../hooks/useAuth";
import { useAxiosPrivate } from "../../hooks/useAxiosPrivate";
import { ReactComponent as CloseIcon } from "../../assets/svg/x-thin.svg";
import "../../assets/css/cart.css";
import { toast } from "react-hot-toast";

export const CartOverlay = ({ toggleShowCart }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cartState);

  const { id } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const total = cart
    ?.reduce(
      (accumulator, cartGame) =>
        accumulator + cartGame.game.price * cartGame.quantity,
      0
    )
    ?.toFixed(2);

  console.log({ cart });

  const removeFromCart = async (cartGame) => {
    if (id) {
      try {
        const response = await axiosPrivate.get(
          `/cart/remove-from-cart/?id=${cartGame._id}`
        );

        toast.success("Removed from cart");

        dispatch(setCart(response.data.games));
      } catch (error) {
        toast.error(error);
      }
    } else {
      const cartComplement = cart.filter(
        ({ game }) => game._id !== cartGame.game._id
      );

      toast.success("Removed from cart");

      dispatch(setCart(cartComplement));
    }
  };

  const handleOpenCart = () => {
    if (id) {
      toggleShowCart(false);
      navigate("/cart");
    } else {
      toggleShowCart(false);
      navigate("/auth", { state: { from: "/cart" } });
    }
  };

  const handleCheckout = () => {
    // TODO: handle push to payment

    if (id) {
      toggleShowCart(false);
      navigate("/cart");
    } else {
      toggleShowCart(false);
      navigate("/auth", { state: { from: "/cart" } });
    }
  };

  return (
    <div className="cart-overlay d-flex justify-content-end">
      <div className="cart-games pe-3">
        {cart?.map((cartGame) => (
          <article
            className="d-flex justify-content-end position-relative mb-2"
            key={`cart-game-${cartGame.game._id}`}
          >
            <img className="game-img" src={cartGame.game.image} width="100%" />

            <button
              className="remove-btn"
              onClick={() => removeFromCart(cartGame)}
            >
              <CloseIcon fill="red" />
            </button>
          </article>
        ))}
      </div>

      <div className="cart-info py-3 pe-3">
        <div className="d-flex justify-content-between">
          <h3 className="span">Cart ({cart?.length ?? 0})</h3>

          <button className="btn-no-bg" onClick={() => toggleShowCart(false)}>
            <CloseIcon />
          </button>
        </div>

        <span className="d-block mb-4">Total: ${total}</span>

        <button
          className="d-block btn-tertiary mb-3 w-100"
          onClick={handleOpenCart}
        >
          Open Cart
        </button>

        <button
          className="d-block btn-secondary mb-3 w-100"
          onClick={handleCheckout}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};
