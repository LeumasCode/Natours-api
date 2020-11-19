/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

const stripe = Stripe(
  'pk_test_51HoURxDXlZb2CTn6sW9tzCNTiEcKAeeUlHtJfKH2NfjSybOsHUW4y1l1NeQddK4xo44Brak3ioohhzZafZAXx64800sye5kMZn'
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from api
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    console.log(session);

    // 2) create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (error) {
    console.log(error);
    showAlert('error', error);
  }
};
