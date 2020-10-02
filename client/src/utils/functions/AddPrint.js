import API from '../API';
import { ADD_PRINT, LOADING } from '../actions';

export default function AddPrint(props, dispatch) {

  dispatch({ type: LOADING })
  API.createPrint({
    name: props.name,
    description: props.description,
    series: props.series,
    price: parseFloat(props.price).toFixed(2),
    quantity: Math.floor(parseFloat(props.quantity)),
    image: props.image,
    featured: props.featured,
    about: props.about,
  })
    .then(({ data }) => {
      dispatch({
        type: ADD_PRINT,
        print: data
      });
    })
    .catch(err => console.log(err));
}
